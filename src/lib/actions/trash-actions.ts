"use server";
import { updateCandidateField } from "../google-sheet/candidates-sheet";
import { deleteCandidate } from "../google-sheet/trash-sheet";
import { revalidatePath } from "next/cache";


function revalidateCandidatePaths() {
  revalidatePath("/candidates");
  revalidatePath("/dashboard");
}
/* _______________________________________
   🔄 Undo Delete
   _________________________________________
 */
export async function undoDeleteCandidate(candidateId: string) {
  try {
    await updateCandidateField(candidateId, "isDeleted", 0);
    revalidateCandidatePaths();
    return { success: true };
  } catch (error) {
    console.error("Error undoing delete:", error);
    return { success: false, error: "Failed to restore candidate" };
  }
}

/* _______________________________________
   🧨 Permanent Delete
   _________________________________________
 */
export async function permanentDeleteCandidate(candidateId: string) {
  try {
    await deleteCandidate(candidateId);
    revalidateCandidatePaths();
    return { success: true };
  } catch (error) {
    console.error("Error permanently deleting candidate:", error);
    return { success: false, error: "Failed to delete candidate permanently" };
  }
}