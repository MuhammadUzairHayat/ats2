"use server";

import { revalidatePath } from "next/cache";
import {
  updateCandidateField,
  bulkUpdateCandidatesPosition,
  bulkUpdateCandidatesStatus,
} from "../google-sheet/candidates-sheet";


export interface CandidateActionState {
  error: string | null;
}


function revalidateCandidatePaths() {
  revalidatePath("/candidates");
  revalidatePath("/dashboard");
}


export async function softDeleteCandidate(candidateId: string) {
  try {
    await updateCandidateField(candidateId, "isDeleted", 1);
    revalidateCandidatePaths();
    return { success: true };
  } catch (error) {
    console.error("Error soft deleting candidate:", error);
    return { success: false, error: "Failed to delete candidate" };
  }
}

export async function bulkUpdateCandidatesPositionAction(
  oldPositionName: string,
  newPositionName: string
) {
  try {
    const result = await bulkUpdateCandidatesPosition(
      oldPositionName,
      newPositionName
    );
    revalidateCandidatePaths();
    return { success: true, updated: result.updated };
  } catch (error) {
    console.error("Error bulk updating candidates position:", error);
    return { success: false, error: "Failed to update candidates position" };
  }
}

export async function bulkUpdateCandidatesStatusAction(
  oldStatusName: string,
  newStatusName: string
) {
  try {
    const result = await bulkUpdateCandidatesStatus(
      oldStatusName,
      newStatusName
    );
    revalidateCandidatePaths();
    return { success: true, updated: result.updated };
  } catch (error) {
    console.error("Error bulk updating candidates status:", error);
    return { success: false, error: "Failed to update candidates status" };
  }
}
