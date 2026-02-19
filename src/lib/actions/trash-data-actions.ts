"use server";

import { getCandidates } from "@/lib/google-sheet/candidates-sheet";
import { getDeletedCandidates } from "@/lib/google-sheet/trash-sheet";
import { Candidate } from "@/types";

/* _______________________________________
   Local type definitions for trash data
   _________________________________________
*/
type CandidateWithDeletionReason = Candidate & {
  deletionReason?: string;
  deletedAt?: string;
};

/* _______________________________________
   Generic response type
   _________________________________________
*/
type ActionResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

/* _______________________________________
   Generic error handler wrapper
   _________________________________________
*/
async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string,
  fallbackData: T
): Promise<ActionResponse<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return { success: false, data: fallbackData, error: errorMessage };
  }
}

/* _______________________________________
   Get all trash candidates with deletion metadata
   _________________________________________
*/
async function getAllTrashCandidates(): Promise<
  CandidateWithDeletionReason[]
> {
  const allCandidates = await getCandidates();
  const deletedCandidates = await getDeletedCandidates(allCandidates);

  return deletedCandidates.map((candidate) => ({
    ...candidate,
    deletionReason: "Soft deleted",
    deletedAt: candidate.entryDate,
  }));
}

/* _______________________________________
   Fetch all candidates (active + deleted)
   _________________________________________
*/
export async function fetchAllCandidatesAction(): Promise<
  ActionResponse<Candidate[]>
> {
  return withErrorHandling(
    () => getCandidates().then((data) => data || []),
    "Failed to fetch candidates",
    []
  );
}

/* _______________________________________
   Fetch all trash candidates (with deletion reason)
   _________________________________________
*/
export async function fetchDeletedCandidatesAction(): Promise<
  ActionResponse<CandidateWithDeletionReason[]>
> {
  return withErrorHandling(
    () => getAllTrashCandidates(),
    "Failed to fetch deleted candidates",
    []
  );
}

/* _______________________________________
   Fetch all trash data at once (optimized)
   _________________________________________
*/
export async function fetchAllTrashDataAction(): Promise<
  ActionResponse<{
    allCandidates: Candidate[];
    deletedCandidates: CandidateWithDeletionReason[];
  }>
> {
  return withErrorHandling(
    async () => {
      // Fetch all candidates once
      const allCandidates = await getCandidates();

      // Get deleted candidates
      const deletedCandidates = await getAllTrashCandidates();

      return {
        allCandidates,
        deletedCandidates,
      };
    },
    "Failed to fetch trash data",
    {
      allCandidates: [],
      deletedCandidates: [],
    }
  );
}