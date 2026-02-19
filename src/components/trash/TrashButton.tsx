"use client";

import { useState, useEffect } from "react";
import { Candidate } from "@/types";
import TrashModal from "./TrashModal";
import { getDeletedCandidates } from "@/lib/google-sheet/trash-sheet";

export default function TrashButton({
  allCandidates,
}: {
  allCandidates: Candidate[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedCandidates, setDeletedCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* _______________________________________
     Fetch deleted candidates
     _________________________________________
  */
  const fetchDeletedCandidates = async (allCandidates: Candidate[]) => {
    try {
      setIsLoading(true);
      const candidates = await getDeletedCandidates(allCandidates);
      setDeletedCandidates(candidates || []);
    } catch (error) {
      console.error("Error fetching deleted candidates:", error);
      setDeletedCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* _______________________________________
     Load deleted candidates on mount and when allCandidates changes
     _________________________________________
  */
  useEffect(() => {
    if (allCandidates && allCandidates.length > 0) {
      fetchDeletedCandidates(allCandidates);
    }
  }, [allCandidates]);

  /* _______________________________________
     Refresh after undo/delete
     _________________________________________
  */
  const handleRefresh = () => {
    fetchDeletedCandidates(allCandidates);
  };

  const deletedCount = deletedCandidates?.length || 0;
  const displayCount = deletedCount > 99 ? "99+" : deletedCount;

  return (
    <>
      {/* Floating Button - Fixed at bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-md p-2 shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        title="View Trash"
        aria-label={`View ${deletedCount} deleted candidates`}
      >
        <div className="relative">
          {isLoading ? (
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
          {deletedCount > 0 && !isLoading && (
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
