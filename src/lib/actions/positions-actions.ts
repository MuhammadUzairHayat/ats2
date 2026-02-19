"use server";

import { revalidatePath } from "next/cache";
import {
  getPositions,
  softDeletePosition,
  permanentDeletePosition,
  undoDeletePosition,
} from "../google-sheet/positions-sheet";
import { getCandidates } from "../google-sheet/candidates-sheet";
import { deleteCandidate } from "../google-sheet/trash-sheet";

/* _______________________________________
   Revalidate position-related pages cache
   _________________________________________
*/
function revalidatePositionPaths() {
  revalidatePath("/dashboard/positions");
  revalidatePath("/dashboard");
}


/* _______________________________________
   Server action to delete a position (legacy)
   _________________________________________
*/
export async function deletePositionHandle(positionId: string) {
  try {
    await permanentDeletePosition(positionId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting position:", error);
    return { success: false, error: "Failed to delete position" };
  }
}

/* _______________________________________
   Server action to soft delete a position
   _________________________________________
*/
export async function softDeletePositionHandle(positionId: string) {
  try {
    await softDeletePosition(positionId);
    revalidatePositionPaths();
    return { success: true };
  } catch (error) {
    console.error("Error soft deleting position:", error);
    return { success: false, error: "Failed to soft delete position" };
  }
}

/* _______________________________________
   Server action to permanently delete position and related candidates
   _________________________________________
*/
export async function permanentDeletePositionHandle(positionId: string) {
  try {
    const positions = await getPositions();
    const positionToDelete = positions.find((p) => p.id === positionId);

    if (!positionToDelete) {
      return { success: false, error: "Position not found" };
    }

    const candidates = await getCandidates();
    const candidatesToDelete = candidates.filter(
      (c) => c.position === positionToDelete.name && c.isDeleted === 0
    );

    if (candidatesToDelete.length > 0) {
      await Promise.all(
        candidatesToDelete.map((candidate) => deleteCandidate(candidate.id))
      );
    }

    await permanentDeletePosition(positionId);

    revalidatePositionPaths();
    revalidatePath("/candidates");

    return {
      success: true,
      deletedCandidates: candidatesToDelete.length,
    };
  } catch (error) {
    console.error("Error permanently deleting position:", error);
    return { success: false, error: "Failed to permanently delete position" };
  }
}

/* _______________________________________
   Server action to restore a soft-deleted position
   _________________________________________
*/
export async function undoDeletePositionHandle(positionId: string) {
  try {
    await undoDeletePosition(positionId);
    revalidatePositionPaths();
    return { success: true };
  } catch (error) {
    console.error("Error undoing delete position:", error);
    return { success: false, error: "Failed to undo delete position" };
  }
}
