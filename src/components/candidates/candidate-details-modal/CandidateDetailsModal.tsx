"use client";
import React, { useEffect } from "react";
import { Candidate, Status } from "@/types";
import { XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { createStatusColorMap } from "@/lib/utils/candidate-utils";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import CandidateJourneyTimeline from "./CandidateJourneyTimeline";
import CandidateInfoGrid from "./CandidateInfoGrid";
import CandidateProfileHeader from "./CandidateProfileHeader";

interface CandidateDetailsModalProps {
  candidate: Candidate | null;
  statuses: Status[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateDetailsModal({
  candidate,
  statuses,
  isOpen,
  onClose,
}: CandidateDetailsModalProps) {
  // ✅ Use embedded statusHistory from candidate object
  const statusHistory = candidate?.statusHistory || [];

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        // Re-enable body scroll when modal closes
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const statusColorMap = createStatusColorMap(statuses);

  // Format date helper
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Get status flag details
  const getStatusFlagDetails = () => {
    switch (candidate.statusFlag) {
      case "active":
        return { color: "green", label: "Active" };
      case "rejected":
        return { color: "red", label: "Rejected" };
      default:
        return { color: "amber", label: "On Hold" };
    }
  };

  const { color: flagColor, label: flagLabel } = getStatusFlagDetails();

  return (
    <div className="fixed inset-0 z-50 max-h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0000007a] backdrop:backdrop-blur-2xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl h-5/6 no-scrollbar mx-auto my-10 rounded-xl bg-white shadow-2xl overflow-hidden transform transition-transform duration-300">
        {/* Sticky Header */}
        <div className="flex shadow-sm items-center w-full justify-between px-6 py-4 bg-white sticky top-0 z-20">
          <span className="flex items-center gap-2">
            <UserCircleIcon className="w-10 h-10 p-2 bg-blue-50 text-blue-600 rounded-lg" />
            <p className="text-md">
              {toStandardTitleCase(candidate.name)} Profile
            </p>
          </span>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content - ✅ Changed overflow-y-auto to overflow-y-visible */}
        <div className="h-[calc(100%-60px)] md:h-[calc(100%-100px)] no-scrollbar overflow-y-visible overflow-x-hidden overscroll-contain px-6">
          <div className="max-w-[76rem] mx-auto my-0">
            <div className="p-4 md:p-6 space-y-6 md:space-y-8 pb-8">
              {/* Profile Header - ✅ Added overflow-visible */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-gray-100 overflow-visible">
                <CandidateProfileHeader
                  candidate={candidate}
                  statusColorMap={statusColorMap}
                />

                {/* Journey Timeline */}
                <CandidateJourneyTimeline
                  statuses={statuses}
                  currentStatus={candidate.status}
                  statusHistory={statusHistory}
                  loadingHistory={false} // ✅ No loading needed - data already available
                  flagColor={flagColor}
                  flagLabel={flagLabel}
                  formatDate={formatDate}
                />
              </div>

              {/* Details Grid */}
              <CandidateInfoGrid candidate={candidate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
