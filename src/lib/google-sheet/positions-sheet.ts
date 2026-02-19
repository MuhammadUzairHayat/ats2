import { Position } from "@/types";
import { getSheetsAndID, wrapGoogleApiCall } from "./auth_sheet";
import { sheets_v4 } from "googleapis";

const SHEET_NAME = "Positions";
const SHEET_RANGE = `${SHEET_NAME}!A2:F`;

/* _______________________________________
   Find sheet row index (0-based for API) by ID
   _________________________________________
*/
async function findRowIndexById(positionId: string): Promise<number> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const response = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A2:A`,
    })
  );
  const rows = response.data.values || [];
  return rows.findIndex((row) => row[0] === positionId);
}

function mapRowToPosition(row: string[]): Position {
  return {
    id: row[0] || "",
    name: row[1] || "",
    description: row[2] || "",
    department: row[3] || "",
    criteria: row[4] ? parseInt(row[4]) : undefined,
    isDeleted: parseInt(row[5] || "0"),
  };
}

function positionToRow(
  position: Position | Omit<Position, "id"> & { id?: string }
): (string | number)[] {
  return [
    position.id || "",
    (position.name || "").trim(),
    position.description || "",
    position.department || "",
    position.criteria ?? "",
    position.isDeleted ?? 0,
  ];
}

/* _______________________________________
   Get all positions (excluding deleted ones)
   _________________________________________
*/
export async function getPositions(): Promise<Position[]> {
  const { sheets, spreadsheetId } = await getSheetsAndID();

  try {
    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: SHEET_RANGE,
      })
    );

    const rows = response.data.values || [];
    return rows.map(mapRowToPosition);
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
}

/* _______________________________________
   Get position by ID (excluding deleted ones)
   _________________________________________
*/
export async function getPositionById(id: string): Promise<Position | null> {
  const positions = await getPositions();
  return positions.find((p) => p.id === id && p.isDeleted === 0) || null;
}

export async function getPositionByName(
  name: string
): Promise<Position | null> {
  const positions = await getPositions();
  return positions.find((p) => p.name === name && p.isDeleted === 0) || null;
}

/* _______________________________________
   Add a new position to Google Sheets
   _________________________________________
*/
export async function addPosition(
  position: Omit<Position, "id">
): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const existing = await getPositions();
  const maxId = existing.reduce((max, p) => Math.max(max, parseInt(p.id)), 0);
  const newId = (maxId + 1).toString();

  const values = [positionToRow({ ...position, id: newId })];

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
  );
}

/* _______________________________________
   Update an entire position row by ID
   _________________________________________
*/
export async function updatePosition(position: Position): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const rowIndex = await findRowIndexById(position.id);
  if (rowIndex === -1) throw new Error("Position not found");

  const sheetRow = rowIndex + 2;
  const range = `${SHEET_NAME}!A${sheetRow}:F${sheetRow}`;
  const values = [positionToRow(position)];

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
  );
}

async function updatePositionField(
  positionId: string,
  field: "F",
  value: number
): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  const rowIndex = await findRowIndexById(positionId);
  if (rowIndex === -1) throw new Error("Position not found");

  const sheetRow = rowIndex + 2;
  const range = `${SHEET_NAME}!${field}${sheetRow}`;

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[value]] },
    })
  );
}

/* _______________________________________
   Soft delete a position (set isDeleted = 1)
   _________________________________________
*/
export async function softDeletePosition(positionId: string): Promise<void> {
  await updatePositionField(positionId, "F", 1);
}

/* _______________________________________
   Undo delete a position (set isDeleted = 0)
   _________________________________________
*/
export async function undoDeletePosition(positionId: string): Promise<void> {
  await updatePositionField(positionId, "F", 0);
}

/* _______________________________________
   Permanently delete a position
   _________________________________________
*/
export async function permanentDeletePosition(
  positionId: string
): Promise<void> {
  const { sheets, spreadsheetId } = await getSheetsAndID();
  if (!spreadsheetId) throw new Error("Spreadsheet ID is missing");

  const rowIndex = await findRowIndexById(positionId);
  if (rowIndex === -1) throw new Error("Position not found");

  const sheetInfo = await wrapGoogleApiCall(() =>
    sheets.spreadsheets.get({ spreadsheetId })
  );

  const sheet = sheetInfo.data.sheets?.find(
    (s: sheets_v4.Schema$Sheet) => s.properties?.title === SHEET_NAME
  );

  const sheetId = sheet?.properties?.sheetId;
  if (sheetId === undefined) throw new Error(`Sheet '${SHEET_NAME}' not found`);

  const startIndex = rowIndex + 1;
  const endIndex = startIndex + 1;

  await wrapGoogleApiCall(() =>
    sheets.spreadsheets.batchUpdate({
      spreadsheetId,
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
}