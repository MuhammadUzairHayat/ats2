import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  permanentDeleteCandidate,
  undoDeleteCandidate,
} from "@/lib/actions/trash-actions";
import { BatchProcessResult, ProgressState } from "./types";

export function useTrashOperations(onRefresh: () => void) {
  const [undoLoading, setUndoLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUndoLoading, setBulkUndoLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    current: 0,
    total: 0,
  });

  // Use ref to avoid recreating batchProcess on every render
  const progressRef = useRef({ current: 0, total: 0 });

  /* _______________________________________
     Batch process with concurrency control
     _________________________________________
  */
  const batchProcess = useCallback(
    async <T>(
      items: T[],
      processor: (item: T) => Promise<{ success: boolean }>,
      concurrency = 3
    ): Promise<BatchProcessResult> => {
      let successCount = 0;
      let failCount = 0;

      progressRef.current = { current: 0, total: items.length };
      setProgress({ current: 0, total: items.length });

      for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const results = await Promise.allSettled(
          batch.map((item) => processor(item))
        );

        results.forEach((result) => {
          progressRef.current.current++;
          if (result.status === "fulfilled" && result.value.success) {
            successCount++;
          } else {
            failCount++;
          }
        });

        // Batch update progress to reduce re-renders
        setProgress({ ...progressRef.current });
      }

      setProgress({ current: 0, total: 0 });
      return { successCount, failCount };
    },
    []
  );

  /* _______________________________________
     Handle select/deselect individual row
     _________________________________________
  */
  const handleSelectRow = useCallback((candidateId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  }, []);

  /* _______________________________________
     Handle select/deselect all rows
     _________________________________________
  */
  const handleSelectAll = useCallback((candidateIds: string[]) => {
    setSelectedIds((prev) =>
      prev.size === candidateIds.length ? new Set() : new Set(candidateIds)
    );
  }, []);

  /* _______________________________________
     Show toast notifications for results
     _________________________________________
  */
  const showResultToast = useCallback(
    (
      successCount: number,
      failCount: number,
      action: "restored" | "deleted"
    ) => {
      if (successCount > 0) {
        toast.success(
          `${successCount} candidate${
            successCount > 1 ? "s" : ""
          } ${action} successfully`
        );
      }
      if (failCount > 0) {
        toast.error(
          `Failed to ${
            action === "restored" ? "restore" : "delete"
          } ${failCount} candidate${failCount > 1 ? "s" : ""}`
        );
      }
    },
    []
  );

  /* _______________________________________
     Handle undo single candidate
     _________________________________________
  */
  const handleUndoDelete = useCallback(
    async (candidateId: string, candidateName: string) => {
      setUndoLoading(candidateId);

      try {
        const result = await undoDeleteCandidate(candidateId);

        if (result.success) {
          toast.success(`${candidateName} has been restored`);
          setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(candidateId);
            return newSet;
          });
          onRefresh();
        } else {
          toast.error(result.error || "Failed to restore candidate");
        }
      } catch (error) {
        console.error("Error restoring candidate:", error);
        toast.error("An error occurred while restoring candidate");
      } finally {
        setUndoLoading(null);
      }
    },
    [onRefresh]
  );

  /* _______________________________________
     Generic bulk operation handler
     _________________________________________
  */
  const handleBulkOperation = useCallback(
    async (
      operation: (id: string) => Promise<{ success: boolean }>,
      action: "restore" | "delete",
      setLoading: (loading: boolean) => void
    ) => {
      if (selectedIds.size === 0) return;

      setLoading(true);
      const selectedIdsArray = Array.from(selectedIds);

      try {
        const { successCount, failCount } = await batchProcess(
          selectedIdsArray,
          async (id) => {
            try {
              return await operation(id);
            } catch (error) {
              console.error(`Error ${action}ing candidate:`, error);
              return { success: false };
            }
          },
          3
        );

        showResultToast(
          successCount,
          failCount,
          action === "restore" ? "restored" : "deleted"
        );

        setSelectedIds(new Set());
        onRefresh();
      } catch (error) {
        console.error(`Error in bulk ${action}:`, error);
        toast.error(`An error occurred during bulk ${action}`);
      } finally {
        setLoading(false);
      }
    },
    [selectedIds, batchProcess, showResultToast, onRefresh]
  );

  /* _______________________________________
     Handle bulk undo selected candidates
     _________________________________________
  */
  const handleBulkUndo = useCallback(
    () =>
      handleBulkOperation(undoDeleteCandidate, "restore", setBulkUndoLoading),
    [handleBulkOperation]
  );

  /* _______________________________________
     Handle bulk permanent delete
     _________________________________________
  */
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${
        selectedIds.size
      } candidate${
        selectedIds.size > 1 ? "s" : ""
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    await handleBulkOperation(
      permanentDeleteCandidate,
      "delete",
      setBulkDeleteLoading
    );
  }, [selectedIds.size, handleBulkOperation]);

  return {
    undoLoading,
    selectedIds,
    bulkUndoLoading,
    bulkDeleteLoading,
    progress,
    handleSelectRow,
    handleSelectAll,
    handleUndoDelete,
    handleBulkUndo,
    handleBulkDelete,
  };
}
