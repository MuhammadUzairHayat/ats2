import { Candidate } from "@/types";

const HIRED_STATUS = "hired";

/* _______________________________________
   Calculate hired candidates count for a position
   _________________________________________
*/
export function getHiredCountForPosition(
  positionName: string,
  candidates: Candidate[]
): number {
  return candidates.filter(
    (candidate) =>
      candidate.position === positionName &&
      candidate.status.toLowerCase() === HIRED_STATUS &&
      candidate.isDeleted === 0
  ).length;
}

/* _______________________________________
   Check if position has reached hiring limit
   Returns false if criteria is undefined (unlimited hiring)
   _________________________________________
*/
export function isHiringLimitReached(
  positionName: string,
  criteria: number | undefined,
  candidates: Candidate[]
): boolean {
  if (criteria === undefined || criteria === null) {
    return false;
  }

  const hiredCount = getHiredCountForPosition(positionName, candidates);
  return hiredCount >= criteria;
}