import { Status } from "@/types";
import { getSheetsAndID, wrapGoogleApiCall } from "./auth_sheet";
import { sheets_v4 } from "googleapis";
import { toStandardTitleCase } from "@/lib/utils/text-utils";

/** ───────────────────────────────
 *  ✅ Helper to safely get spreadsheetId
 *  ─────────────────────────────── */
function ensureSpreadsheetId(spreadsheetId: string | undefined): string {
  if (!spreadsheetId) {
    throw new Error("Spreadsheet ID is missing");
  }
  return spreadsheetId;
}

/** ───────────────────────────────
 *  ✅ Helper to find sheetId dynamically by title
 *  ─────────────────────────────── */
async function getSheetIdByTitle(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  title: string
): Promise<number | null> {
  const sheetInfo = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.get({ spreadsheetId })
  );
  const sheet = sheetInfo.data.sheets?.find(
    (s: sheets_v4.Schema$Sheet) => s.properties?.title === title
  );
  if (sheet?.properties?.sheetId === undefined) {
    throw new Error(`Sheet '${title}' not found`);
  }
  return sheet.properties.sheetId;
}

/** ───────────────────────────────
 *  ✅ Fetch all statuses
 *  ─────────────────────────────── */
export async function getStatuses(): Promise<Status[]> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const id = ensureSpreadsheetId(spreadsheetId);

  try {
    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: "Statuses!A2:E",
      })
    );

    const rows = response.data.values || [];
    return rows.map(
      (row: string[]): Status => ({
        id: row[0] || "",
        name: row[1] || "",
        color: row[2] || "",
        description: row[3] || "",
        isDeleted: parseInt(row[4] || "0"),
      })
    );
  } catch (error) {
    console.error("Error fetching statuses:", error);
    throw error;
  }
}

/** ───────────────────────────────
 *  ✅ Get specific status by ID
 *  ─────────────────────────────── */
export async function getStatusById(id: string): Promise<Status | null> {
  try {
    const statuses = await getStatuses();
    const status = statuses.find((s) => s.id === id);
    return status || null;
  } catch (error) {
    console.error("Error fetching status by ID:", error);
    return null;
  }
}
export async function getStatusByName(name: string): Promise<Status | null> {
  try {
    const statuses = await getStatuses();
    const status = statuses.find((s) => s.name === name);
    return status || null;
  } catch (error) {
    console.error("Error fetching status by ID:", error);
    return null;
  }
}

/** ───────────────────────────────
 *  ✅ Add new status
 *  ─────────────────────────────── */
export async function addStatus(status: Omit<Status, "id">): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const sid = ensureSpreadsheetId(spreadsheetId);

  try {
    const values = [
      [
        crypto.randomUUID(),
        status.name
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim(),
        status.color,
        status.description,
        0,
      ],
    ];

    await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.append({
        spreadsheetId: sid,
        range: "Statuses!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      })
    );
  } catch (error) {
    console.error("Error adding status:", error);
    throw error;
  }
}

/** ───────────────────────────────
 *  ✅ Update existing status
 *  ─────────────────────────────── */
export async function updateStatus(status: Status): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const sid = ensureSpreadsheetId(spreadsheetId);

  try {
    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId: sid,
        range: "Statuses!A2:A",
      })
    );

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === status.id);
    if (rowIndex === -1) throw new Error("Status not found");

    const values = [
      [
        status.id,
        toStandardTitleCase(status.name),
        status.color,
        status.description,
        status.isDeleted,
      ],
    ];

    await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId: sid,
        range: `Statuses!A${rowIndex + 2}:E${rowIndex + 2}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      })
    );
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

/** ───────────────────────────────
 *  ✅ Soft Delete & Undo Delete (merged logic)
 *  ─────────────────────────────── */
export async function setStatusDeleted(
  statusId: string,
  deleted: boolean
): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const sid = ensureSpreadsheetId(spreadsheetId);

  const response = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId: sid,
      range: "Statuses!A2:A",
    })
  );

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === statusId);
  if (rowIndex === -1) throw new Error("Status not found");

  const range = `Statuses!E${rowIndex + 2}`;
  const values = [[deleted ? 1 : 0]];

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId: sid,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
  );
}

export async function softDeleteStatus(statusId: string) {
  return setStatusDeleted(statusId, true);
}



/** ───────────────────────────────
 *  ✅ Permanent delete row
 *  ─────────────────────────────── */
export async function permanentDeleteStatus(statusId: string): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const sid = ensureSpreadsheetId(spreadsheetId);

  try {
    // Find row index by ID
    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId: sid,
        range: "Statuses!A2:A",
      })
    );

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === statusId);
    if (rowIndex === -1)
      throw new Error(`Status with ID ${statusId} not found`);

    // Get actual sheetId dynamically
    const sheetId = await getSheetIdByTitle(sheets, sid, "Statuses");

    const startIndex = rowIndex + 1;
    const endIndex = startIndex + 1;

    await wrapGoogleApiCall(() =>
      sheets.spreadsheets.batchUpdate({
        spreadsheetId: sid,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: "ROWS",
                  startIndex,
                  endIndex,
                },
              },
            },
          ],
        },
      })
    );
  } catch (error) {
    console.error("Error permanently deleting status:", error);
    throw new Error("Failed to permanently delete status");
  }
}
