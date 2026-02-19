import { Candidate, Position } from "@/types";
import { isHiringLimitReached } from "./position-utils";

export interface HiringValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateHiredStatus(
  position: string,
  statusFlag: string,
  positions: Position[],
  candidates: Candidate[]
): HiringValidationResult {
  const selectedPosition = positions.find(
    (p) => p.name === position && p.isDeleted === 0
  );

  if (!selectedPosition) {
    return {
      isValid: false,
      error: `Position "${position}" not found`
    };
  }

  const isLimitReached = isHiringLimitReached(
    position,
    selectedPosition.criteria,
    candidates
  );

  if (isLimitReached) {
    return {
      isValid: false,
      error: "Hiring limit reached for this position"
    };
  }

  if (statusFlag !== "0") {
    return {
      isValid: false,
      error: "Status flag must be 'Active' for hired candidates"
    };
  }

  return { isValid: true, error: null };
}