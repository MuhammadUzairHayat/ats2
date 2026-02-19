"use server";

import {
  getStatuses,
  softDeleteStatus,
  permanentDeleteStatus,
} from "../google-sheet/statuses-sheet";
import { revalidatePath } from "next/cache";
import { deleteCandidate } from "../google-sheet/trash-sheet";

export async function deleteStatusHandle(statusId: string) {
  try {
    await permanentDeleteStatus(statusId);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting status: ${error}`);
    return { success: false, error: "Failed to delete status" };
  }
}

export async function softDeleteStatusHandle(statusId: string) {
  try {
    await softDeleteStatus(statusId);
    revalidatePath("/statuses");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(`Error soft deleting status: ${error}`);
    return { success: false, error: "Failed to soft delete status" };
  }
}

export async function permanentDeleteStatusHandle(statusId: string) {
  try {
    // First, get the status name before deleting it
    const statuses = await getStatuses();
    const statusToDelete = statuses.find((s) => s.id === statusId);

    if (!statusToDelete) {
      return { success: false, error: "Status not found" };
    }

    // Find all candidates with this status
    const { getCandidates} = await import(
      "../google-sheet/candidates-sheet"
    );
    const candidates = await getCandidates();
    const candidatesToDelete = candidates.filter(
      (c) => c.status === statusToDelete.name && c.isDeleted === 0
    );

    // Delete all related candidates first
    if (candidatesToDelete.length > 0) {
      await Promise.all(
        candidatesToDelete.map((candidate) => deleteCandidate(candidate.id))
      );
    }

    // Then delete the status
    await permanentDeleteStatus(statusId);

    return {
      success: true,
      deletedCandidates: candidatesToDelete.length,
    };
  } catch (error) {
    console.error(`Error permanently deleting status: ${error}`);
    return { success: false, error: "Failed to permanently delete status" };
  }
}
