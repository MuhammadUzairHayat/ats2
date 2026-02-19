import { Status, Candidate, Position, Filters } from "@/types";
import { StatusHistoryEntry } from "@/types";

/* _______________________________________
   🎨 Get status color with fallback
   Returns { bg, text } colors for status badges
   _________________________________________
*/
export function getStatusColor(
  candidateStatus: string,
  statusColorMap: Map<string, string>
): { bg: string; text: string } {
  if (!candidateStatus) {
    return {
      bg: "#f3f4f6",
      text: "#6b7280",
    };
  }

  // ✅ Ensure statusColorMap is a Map object
  const color = statusColorMap.get(candidateStatus.trim().toLowerCase());
  const baseColor = color || "#6b7280";

  // Convert hex to rgba with 12.5% opacity (20 in hex = ~12.5%)
  const bgColor = baseColor + "20";

  return {
    bg: bgColor,
    text: baseColor,
  };
}

/* _______________________________________
   🗺️ Create status color map from Status array
   Converts Status[] to Map<string, string> for quick lookup
   _________________________________________
*/
export function createStatusColorMap(statuses: Status[]): Map<string, string> {
  const colorMap = new Map<string, string>();
  
  statuses.forEach((status) => {
    if (status.name && status.color) {
      colorMap.set(status.name.trim().toLowerCase(), status.color);
    }
  });
  
  return colorMap;
}

/* _______________________________________
   Filter candidates based on search criteria
   _________________________________________
*/
export const filterCandidates = (
  candidates: Candidate[],
  filters: Filters,
  positions: Position[],
  statuses: Status[]
) => {
  if (!Array.isArray(positions) || !Array.isArray(statuses)) {
    return [];
  }

  const activePositionNames = new Set(
    positions
      .filter((p) => p.isDeleted === 0)
      .map((p) => p.name.toLowerCase().trim())
  );

  const activeStatusNames = new Set(
    statuses
      .filter((s) => s.isDeleted === 0)
      .map((s) => s.name.toLowerCase().trim())
  );

  const normalizedFilters = {
    position: filters.position?.toLowerCase().trim() || "",
    status: filters.status?.toLowerCase().trim() || "",
    statusFlag: filters.statusFlag?.toLowerCase().trim() || "", // ✅ Add statusFlag
    search: filters.search?.toLowerCase() || "",
  };

  return candidates.filter((candidate) => {
    if (candidate.isDeleted === 1) return false;

    const normalizedCandidatePosition = candidate.position
      ?.toLowerCase()
      .trim();
    const normalizedCandidateStatus = candidate.status?.toLowerCase().trim();

    if (!activePositionNames.has(normalizedCandidatePosition)) return false;
    if (!activeStatusNames.has(normalizedCandidateStatus)) return false;

    const matchesPosition =
      !normalizedFilters.position ||
      normalizedCandidatePosition === normalizedFilters.position;

    const matchesStatus =
      !normalizedFilters.status ||
      normalizedCandidateStatus === normalizedFilters.status;

    // ✅ Add statusFlag filter logic
    const matchesStatusFlag =
      !normalizedFilters.statusFlag ||
      (candidate.statusFlag as string)?.toLowerCase().trim() === normalizedFilters.statusFlag;

    const matchesSearch =
      !normalizedFilters.search ||
      candidate.name?.toLowerCase().includes(normalizedFilters.search) ||
      candidate.email?.toLowerCase().includes(normalizedFilters.search) ||
      candidate.position?.toLowerCase().includes(normalizedFilters.search);

    return matchesPosition && matchesStatus && matchesStatusFlag && matchesSearch; // ✅ Include statusFlag
  });
};

/* _______________________________________
   Status flag constants and types
   _________________________________________
*/
export const statusFlag = ["active", "onHold", "rejected"] as const;
export type StatusFlag = (typeof statusFlag)[number];

/* _______________________________________
   Get status flag index from string value
   _________________________________________
*/
export const getStatusFlagIndex = (statusFlagString: string): number => {
  return statusFlag.indexOf(statusFlagString as StatusFlag);
};

/* _______________________________________
   Get status flag string from index
   _________________________________________
*/
export const getStatusFlagString = (statusFlagIndex: number): string => {
  return statusFlag[statusFlagIndex] || statusFlag[0];
};

/* _______________________________________
   📋 Serialize/Deserialize Status History
   _________________________________________
*/
export function serializeStatusHistory(
  history: StatusHistoryEntry[] | undefined
): string {
  if (!history || history.length === 0) return "[]";
  
  try {
    // ✅ Ensure it's converted to string explicitly
    const jsonString = JSON.stringify(history);
    
    // ✅ Verify it's a string
    if (typeof jsonString !== 'string') {
      console.error("❌ Serialization did not return a string!");
      return "[]";
    }
    
    return jsonString;
  } catch (error) {
    console.error("❌ Error serializing status history:", error);
    return "[]";
  }
}

export function deserializeStatusHistory(
  jsonString: string | undefined
): StatusHistoryEntry[] {
  // ✅ Handle empty or invalid input
  if (!jsonString || jsonString.trim() === "" || jsonString === "[]") {
    return [];
  }
  
  // ✅ Ensure we're working with a string
  if (typeof jsonString !== 'string') {
    console.error("❌ deserializeStatusHistory received non-string:", typeof jsonString);
    return [];
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!Array.isArray(parsed)) {
      console.error("❌ Parsed JSON is not an array:", parsed);
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error("❌ Error parsing status history JSON:", error);
    console.error("Failed JSON string:", jsonString?.substring(0, 200) + "...");
    return [];
  }
}

/* _______________________________________
   Map Google Sheets row to Candidate object
   _________________________________________
*/
export function mapRowToCandidate(row: string[]): Candidate {
  return {
    id: row[0] || "",
    name: row[1] || "",
    position: row[2] || "",
    experience: row[3] ? row[3].split(",") : ["", ""],
    phoneNumber: row[4] ? `+${row[4]}` : "",
    email: row[5] || "",
    currentSalary: row[6] || "",
    expectedSalary: row[7] || "",
    noticePeriod: row[8] || "",
    status: row[9] || "",
    statusFlag: row[10] || "active",
    linkedin: row[11] || "",
    reference: row[12] || "",
    comments: row[13] || "",
    fileId: row[14] || "",
    isDeleted: row[15] === "1" ? 1 : 0,
    entryDate: row[16] || "",
    statusHistory: deserializeStatusHistory(row[17]), // ✅ Column R
  };
}

/* _______________________________________
   Convert Candidate object to Google Sheets row
   _________________________________________
*/
export function candidateToRow(
  candidate: Partial<Candidate> & { id: string }
): (string | number)[] {
  return [
    candidate.id,
    candidate.name || "",
    candidate.position || "",
    Array.isArray(candidate.experience) ? candidate.experience.toString() : "",
    candidate.phoneNumber || "",
    candidate.email || "",
    candidate.currentSalary || "",
    candidate.expectedSalary || "",
    candidate.noticePeriod || "",
    candidate.status || "",
    candidate.statusFlag || "",
    candidate.linkedin || "",
    candidate.reference || "",
    candidate.comments || "",
    candidate.fileId || "",
    candidate.isDeleted ?? 0,
    candidate.entryDate || new Date().toISOString(),
    serializeStatusHistory(candidate.statusHistory), // ✅ Column R (JSON)
  ];
}
