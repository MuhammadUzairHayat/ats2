"use server";

import { findCandidateRowIndex } from "../google-sheet/candidates-sheet";
import { Candidate } from "@/types";
import { getSheetsAndID, wrapGoogleApiCall } from "./auth_sheet";
import { deleteResumeFile } from "./resume-file";

const SHEET_NAME = "Sheet1";

/* _______________________________________
   Get all soft-deleted candidates
   _________________________________________
*/
export async function getDeletedCandidates(allCandidates: Candidate[]): Promise<Candidate[]> {
  return allCandidates.filter((c) => c.isDeleted === 1);
}

/* _______________________________________
   🗑️ Permanent delete (row + file)
   _________________________________________
 */
export async function deleteCandidate(candidateId: string): Promise<void> {
  const rowIndex = await findCandidateRowIndex(candidateId);
  if (rowIndex === -1) throw new Error("Candidate not found");

  const { sheets, spreadsheetId } = await getSheetsAndID();

  const response = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowIndex}:R${rowIndex}`,
    })
  );

  const rowData = response.data.values?.[0];

  if (!rowData) {
    throw new Error("Failed to fetch candidate data");
  }

  // Column O (fileId) is at index 14 (0-based: A=0, B=1, ..., O=14)
  const fileId = rowData[14];

  if (fileId && fileId.trim()) {
    try {
      await deleteResumeFile(fileId);
      console.log(`Deleted file: ${fileId}`);
    } catch (err) {
      console.warn(`Failed to delete file ${fileId}:`, err);
    }
  } else {
    console.log("No fileId found for this candidate");
  }

  const sheetInfo = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.get({ spreadsheetId })
  );

  const sheet = sheetInfo.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME
  );

  if (!sheet || sheet.properties?.sheetId === undefined) {
    throw new Error(`Sheet "${SHEET_NAME}" not found`);
  }

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet?.properties?.sheetId,
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    })
  );
}