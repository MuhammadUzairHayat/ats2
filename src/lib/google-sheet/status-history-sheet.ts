import { StatusHistoryEntry } from "@/types";
import { findCandidateRowIndex, getCandidateById } from "./candidates-sheet";
import { randomUUID } from "crypto";
import { getSheetsAndID, wrapGoogleApiCall } from "./auth_sheet";
import { serializeStatusHistory, deserializeStatusHistory } from "../utils/candidate-utils";

const SHEET_NAME = "Sheet1";

/**
 * In-memory caches / pending-write guards to reduce repeated work
 * and prevent write races for the same candidate.
 */
const historyCache = new Map<string, StatusHistoryEntry[]>();
const pendingAppend = new Map<string, Promise<void>>();

/* _______________________________________
   📜 Get candidate status history (cached, non-mutating)
   _________________________________________
*/
export async function getCandidateStatusHistory(
  candidateId: string
): Promise<StatusHistoryEntry[]> {
  // return cached copy if available
  const cached = historyCache.get(candidateId);
  if (cached) {
    return [...cached];
  }

  const candidate = await getCandidateById(candidateId);
  if (!candidate) return [];

  const raw = candidate.statusHistory || [];
  // do not mutate original array
  const sorted = [...raw].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  // cache a copy
  historyCache.set(candidateId, [...sorted]);
  return sorted;
}

/* _______________________________________
   🔍 Verify candidate history integrity (reads raw sheet cell)
   _________________________________________
*/
export async function verifyCandidateHistory(candidateId: string): Promise<{
  success: boolean;
  rawData: string;
  parsedCount: number;
  error?: string;
}> {
  try {
    const rowIndex = await findCandidateRowIndex(candidateId);
    if (rowIndex === -1) {
      return {
        success: false,
        rawData: "",
        parsedCount: 0,
        error: "Candidate not found",
      };
    }

    const { sheets, spreadsheetId } = await getSheetsAndID();

    const response = await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAME}!R${rowIndex}`,
      })
    );

    const rawData = response.data.values?.[0]?.[0] || "";

    // quick validate before attempting full deserialize
    const validation = validateHistoryString(rawData);
    if (!validation.isValid) {
      return {
        success: false,
        rawData,
        parsedCount: 0,
        error: validation.error,
      };
    }

    // use deserialize to ensure same parsing as app logic
    const parsed = deserializeStatusHistory(rawData);

    return {
      success: true,
      rawData,
      parsedCount: parsed.length,
    };
  } catch (error) {
    return {
      success: false,
      rawData: "",
      parsedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* _______________________________________
   ➕ Append status history entry to candidate
   - Prevents concurrent write races per-candidate by sequencing writes
   - Updates in-memory cache after successful write
   _________________________________________
*/
export async function appendCandidateStatusHistory(
  candidateId: string,
  entry: {
    oldStatus: string;
    newStatus: string;
    changedBy: string;
  }
): Promise<void> {
  // sequence appends per candidate to avoid lost updates
  const sequence = (async () => {
    // fetch latest candidate (fresh read to avoid stale writes)
    const candidate = await getCandidateById(candidateId);
    if (!candidate) {
      throw new Error(`Candidate not found: ${candidateId}`);
    }

    const historyEntry: StatusHistoryEntry = {
      historyId: randomUUID(),
      oldStatus: entry.oldStatus,
      newStatus: entry.newStatus,
      changedAt: new Date().toISOString(),
      changedBy: entry.changedBy,
    };

    // merge with latest history (do not mutate original)
    const updatedHistory = [...(candidate.statusHistory || []), historyEntry];

    // ensure serialized string
    let serializedHistory = serializeStatusHistory(updatedHistory);
    if (typeof serializedHistory !== "string") {
      try {
        serializedHistory = JSON.stringify(serializedHistory);
      } catch {
        throw new Error("Failed to serialize history to string");
      }
    }

    const rowIndex = await findCandidateRowIndex(candidateId);
    if (rowIndex === -1) throw new Error("Candidate not found");

    const { sheets, spreadsheetId } = await getSheetsAndID();

    await wrapGoogleApiCall(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!R${rowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[String(serializedHistory)]],
        },
      })
    );

    // update in-memory cache with latest value
    historyCache.set(candidateId, [...updatedHistory]);
  })();

  // chain with any existing pending append for this candidate
  const previous = pendingAppend.get(candidateId) ?? Promise.resolve();
  const chained = previous
    .catch(() => {
      // previous failed - continue with current append
    })
    .then(() => sequence);

  pendingAppend.set(candidateId, chained);

  try {
    await chained;
  } finally {
    // clear pending entry if it's the same promise
    const currentPending = pendingAppend.get(candidateId);
    if (currentPending === chained) {
      pendingAppend.delete(candidateId);
    }
  }
}

/* _______________________________________
   ✅ Validate History String
   _________________________________________
*/
export function validateHistoryString(historyString: string): {
  isValid: boolean;
  error?: string;
  entriesCount?: number;
} {
  if (typeof historyString !== "string") {
    return {
      isValid: false,
      error: `Not a string, got: ${typeof historyString}`,
    };
  }

  if (historyString.trim() === "") {
    return {
      isValid: true,
      entriesCount: 0,
    };
  }

  try {
    const parsed = JSON.parse(historyString);

    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        error: "Parsed value is not an array",
      };
    }

    return {
      isValid: true,
      entriesCount: parsed.length,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `JSON parse error: ${error instanceof Error ? error.message : "Unknown"}`,
    };
  }
}