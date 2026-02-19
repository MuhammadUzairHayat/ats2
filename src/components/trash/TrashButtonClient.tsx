"use client";

import { useState, useCallback } from "react";
import TrashModal from "./TrashModal";
import {
  fetchDeletedCandidatesAction,
  fetchAllCandidatesAction,
} from "@/lib/actions/trash-data-actions";
import { toast } from "sonner";
import { Candidate } from "@/types";

interface TrashButtonClientProps {
  allCandidates: Candidate[];
  initialDeletedCandidates?: Candidate[];
}

export default function TrashButtonClient({
  allCandidates,
  initialDeletedCandidates = [],
}: TrashButtonClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedCandidates, setDeletedCandidates] = useState<Candidate[]>(
    initialDeletedCandidates
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* _______________________________________
     Refresh all trash data
     _________________________________________
  */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [candidatesResult, allCandidatesResult] = await Promise.all([
        fetchDeletedCandidatesAction(),
        fetchAllCandidatesAction(),
      ]);

      if (candidatesResult?.success) {
        setDeletedCandidates(candidatesResult.data ?? []);
      } else {
        toast.error(candidatesResult?.error || "Failed to refresh candidates");
      }

      // optionally use allCandidatesResult if needed in future
      if (allCandidatesResult && !allCandidatesResult.success) {
        console.warn(
          "fetchAllCandidatesAction failed",
          allCandidatesResult.error
        );
      }
    } catch (error) {
      console.error("Error refreshing trash data:", error);
      toast.error("An error occurred while refreshing trash data");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /* _______________________________________
     Open modal and refresh data
     _________________________________________
  */
  const handleOpenModal = useCallback(async () => {
    setIsOpen(true);
    await handleRefresh();
  }, [handleRefresh]);

  const totalDeletedCount = deletedCandidates?.length || 0;
  const displayCount = totalDeletedCount > 99 ? "99+" : totalDeletedCount;

  return (
    <>
      {/* Floating Button - Fixed at bottom-right */}
      <button
        onClick={handleOpenModal}
        disabled={isRefreshing}
        className="fixed cursor-pointer bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        title="View Trash"
        aria-label={`View ${totalDeletedCount} deleted items`}
      >
        <div className="relative">
          {isRefreshing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
          {totalDeletedCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-red-600">
              {displayCount}
            </span>
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <TrashModal
          allCandidates={allCandidates}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          deletedCandidates={deletedCandidates}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}