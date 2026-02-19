import { Candidate, Status, StatusHistoryEntry } from "@/types";
import { getSheetsAndID, wrapGoogleApiCall } from "./auth_sheet";
import { uploadResumeToDrive } from "./resume-file";
import {
  candidateToRow,
  mapRowToCandidate,
  statusFlag,
  serializeStatusHistory,
} from "../utils/candidate-utils";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import { getSession } from "../auth";
import { randomUUID } from "crypto";
import { appendCandidateStatusHistory } from "./status-history-sheet";

const SHEET_NAME = "Sheet1";
const SHEET_RANGE = `${SHEET_NAME}!A2:R`;

/* _______________________________________
   🧠 Helper — Find candidate row index by ID
   _________________________________________
 */
export async function findCandidateRowIndex(
  candidateId: string
): Promise<number> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const response = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE,
    })
  );

  const rows = response.data.values || [];
  const index = rows.findIndex((row) => row[0] === candidateId);
  return index === -1 ? -1 : index + 2;
}

/* _______________________________________
   📥 Get all candidates
   _________________________________________
 */
export async function getCandidates() {
  const { sheets, spreadsheetId } = await getSheetsAndID();

  try {
    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: SHEET_RANGE,
      })
    );

    const rows = response.data.values || [];
    const candidates = rows.map(mapRowToCandidate);

    return candidates.sort(
      (a, b) =>
        new Date(b.entryDate || "").getTime() -
        new Date(a.entryDate || "").getTime()
    );
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
}

/* _______________________________________
   📌 Get candidate by ID
   _________________________________________
 */
export async function getCandidateById(id: string): Promise<Candidate | null> {
  const candidates = await getCandidates();
  return candidates.find((c) => c.id === id && c.isDeleted === 0) || null;
}

/* _______________________________________
   ✏️ Update candidate (full row)
   _________________________________________
 */
export async function updateCandidate(
  id: string,
  candidate: Candidate
): Promise<void> {
  const rowIndex = await findCandidateRowIndex(id);
  if (rowIndex === -1) throw new Error("Candidate not found");

  const { sheets, spreadsheetId } = await getSheetsAndID();
  const values = [candidateToRow(candidate)];

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowIndex}:R${rowIndex}`,
      valueInputOption: "RAW", // ✅ Use RAW to preserve strings
      requestBody: { values },
    })
  );

}

/* _______________________________________
   ➕ Add a new candidate
   _________________________________________
 */
export async function addCandidate(formData: FormData) {
  const session = await getSession();
  
  // ✅ Extract experience values
  const experience = [
    (formData.get("experience-years") as string) || "0",
    (formData.get("experience-months") as string) || "0",
  ];

  // ✅ Extract and format status
  const status = toStandardTitleCase((formData.get("status") as string) || "New");

  // ✅ Initialize status history with first entry
  const initialHistory: StatusHistoryEntry[] = [
    {
      historyId: randomUUID(),
      oldStatus: "New",
      newStatus: status,
      changedAt: new Date().toISOString(),
      changedBy: session?.user?.name || "System Admin",
    },
  ];

  // ✅ Safely extract phone number (matching API route field name: "phone")
  const phoneNumber = (formData.get("phone") as string) || "";
  const cleanedPhone = phoneNumber.replace(/^\+/, "");

  // ✅ Build candidate object with safe null checks
  const candidate = {
    id: crypto.randomUUID(),
    name: (formData.get("name") as string) || "",
    position: (formData.get("position") as string) || "",
    experience: experience,
    phoneNumber: cleanedPhone,
    email: ((formData.get("email") as string) || "").trim(),
    currentSalary: (formData.get("current-salary") as string) || "",
    expectedSalary: (formData.get("expected-salary") as string) || "",
    noticePeriod: (formData.get("notice-period") as string) || "",
    status: status,
    statusFlag: statusFlag[Number(formData.get("statusFlag") || 0)],
    linkedin: ((formData.get("linkedin") as string) || "").trim(),
    reference: (formData.get("reference") as string) || "",
    comments: (formData.get("comments") as string) || "",
    entryDate: new Date().toISOString(),
    statusHistory: initialHistory,
  };

  console.log("📝 Candidate object prepared:", candidate);

  const { sheets, spreadsheetId } = await getSheetsAndID();

  // ✅ Handle CV file upload (matching API route field name: "cvFile")
  let fileId = "";
  const cvFile = formData.get("cvFile") as File | null;
  
  
  if (cvFile && cvFile.size > 0) {
    try {
      const uploadResult = await uploadResumeToDrive(
        formData,
        `${candidate.name}-resume.pdf`
      );
      fileId = uploadResult.id || "";
      console.log("✅ CV uploaded successfully, fileId:", fileId);
    } catch (uploadError) {
      console.error("❌ Error uploading CV:", uploadError);
      throw new Error(`Failed to upload CV: ${uploadError}`);
    }
  }

  // ✅ Prepare row data
  const rowData = candidateToRow({ ...candidate, fileId });
  const values = [rowData];


  // ✅ Append to sheet
  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:R`,
      valueInputOption: "RAW", // ✅ Use RAW to preserve string format
      requestBody: { values },
    })
  );

  console.log("✅ Candidate added to sheet successfully");

  return { candidateId: candidate.id };
}

/* _______________________________________
   ➕ Add a new candidate (legacy)
   _________________________________________
 */
export async function addCandidateLegacy(formData: FormData) {
  const session = await getSession();
  const experience = [
    (formData.get("experience-years") as string) || "",
    (formData.get("experience-months") as string) || "",
  ];

  const status = toStandardTitleCase((formData.get("status") as string));

  // ✅ Initialize status history with first entry
  const initialHistory: StatusHistoryEntry[] = [
    {
      historyId: randomUUID(),
      oldStatus: "New",
      newStatus: status,
      changedAt: new Date().toISOString(),
      changedBy: session?.user?.name || "System Admin",
    },
  ];

  const candidate = {
    id: crypto.randomUUID(),
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    experience: experience,
    phoneNumber: (formData.get("phoneNumber") as string).replace(/^\+/, ""),
    email: (formData.get("email") as string)?.trim(),
    currentSalary: formData.get("currentSalary") as string,
    expectedSalary: formData.get("expectedSalary") as string,
    noticePeriod: formData.get("notice-period") as string,
    status: status,
    statusFlag: statusFlag[Number(formData.get("statusFlag"))],
    linkedin: (formData.get("linkedin") as string)?.trim(),
    reference: formData.get("reference") as string,
    comments: formData.get("comments") as string,
    entryDate: new Date().toISOString(),
    statusHistory: initialHistory,
  };

  const { sheets, spreadsheetId } = await getSheetsAndID();

  let fileId = "";
  const cvFile = formData.get("cv") as File;
  if (cvFile && cvFile.size > 0) {
    const uploadResult = await uploadResumeToDrive(
      formData,
      `${candidate.name}-resume.pdf`
    );
    fileId = uploadResult.id || "";
  }

  const values = [candidateToRow({ ...candidate, fileId })];

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:R`, // ✅ Extended to R
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
  );

  return { candidateId: candidate.id };
}

/* _______________________________________
   🧩 Update a single field
   _________________________________________
 */
export async function updateCandidateField(
  id: string,
  field: keyof Candidate,
  value: string | number | string[] | StatusHistoryEntry[] | null
): Promise<void> {
  const rowIndex = await findCandidateRowIndex(id);
  if (rowIndex === -1) throw new Error("Candidate not found");

  const columnMap: Record<keyof Candidate, string> = {
    id: "A",
    name: "B",
    position: "C",
    experience: "D",
    phoneNumber: "E",
    email: "F",
    currentSalary: "G",
    expectedSalary: "H",
    noticePeriod: "I",
    status: "J",
    statusFlag: "K",
    linkedin: "L",
    reference: "M",
    comments: "N",
    fileId: "O",
    isDeleted: "P",
    entryDate: "Q",
    statusHistory: "R", // ✅ Added history column
  };

  const column = columnMap[field];
  if (!column) throw new Error(`Invalid field: ${field}`);

  const { sheets, spreadsheetId } = await getSheetsAndID();

  let sendValue: string | number;
  if (field === "statusHistory") {
    sendValue = serializeStatusHistory(value as StatusHistoryEntry[]);
  } else {
    sendValue = Array.isArray(value) ? value.toString() : value ?? "";
  }

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!${column}${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[sendValue]] },
    })
  );
}

/* _______________________________________
   🔄 Update candidate status with history tracking
   _________________________________________
 */
export async function updateCandidateStatus(
  candidateId: string,
  newStatus: string,
  changedBy: string = "System"
): Promise<void> {
  try {
    const candidate = await getCandidateById(candidateId);

    if (!candidate) {
      throw new Error(`Candidate not found: ${candidateId}`);
    }

    const oldStatus = candidate.status;

    if (oldStatus.toLowerCase() === newStatus.toLowerCase()) {
      return;
    }

    // Update status field
    await updateCandidateField(candidateId, "status", newStatus);

    // Append to history
    await appendCandidateStatusHistory(candidateId, {
      oldStatus,
      newStatus,
      changedBy,
    });
  } catch (error) {
    console.error("❌ Error updating candidate status:", error);
    throw error;
  }
}

/* _______________________________________
   📦 Bulk update - Position
   _________________________________________
 */
export async function bulkUpdateCandidatesPosition(
  oldPosition: string,
  newPosition: string
): Promise<{ updated: number }> {
  const candidates = await getCandidates();
  const toUpdate = candidates.filter(
    (c) => c.position === oldPosition && c.isDeleted === 0
  );

  await Promise.all(
    toUpdate.map((c) => updateCandidateField(c.id, "position", newPosition))
  );

  return { updated: toUpdate.length };
}

/* _______________________________________
   📦 Bulk update - Status with history tracking
   _________________________________________
 */
export async function bulkUpdateCandidatesStatus(
  oldStatusName: string,
  newStatusName: string,
  changedBy: string = "System"
): Promise<{ updated: number }> {
  const candidates = await getCandidates();
  const toUpdate = candidates.filter(
    (c) =>
      c.status.toLowerCase() === oldStatusName.toLowerCase() &&
      c.isDeleted === 0
  );

  await Promise.all(
    toUpdate.map((c) => updateCandidateStatus(c.id, newStatusName, changedBy))
  );

  return { updated: toUpdate.length };
}

/* _______________________________________
   🌈 Get status color
   _________________________________________
 */
export function getStatusColor(status: string, statuses: Status[]): string {
  const foundStatus = statuses.find((s) => s.name === status);
  return foundStatus?.color || "";
}
