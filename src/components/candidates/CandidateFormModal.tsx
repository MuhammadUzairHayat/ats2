"use client";
import React, { useEffect } from "react";
import { Candidate, Position, Status } from "@/types";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AddCandidateForm from "./add/AddCandidateForm";
import EditCandidateForm from "./EditCandidateForm";

interface CandidateFormModalProps {
  mode: "add" | "edit";
  candidate?: Candidate | null;
  positions: Position[];
  statuses: Status[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateFormModal({
  mode,
  candidate,
  positions,
  statuses,
  isOpen,
  onClose,
}: CandidateFormModalProps) {
  // Handle escape key and prevent body scroll
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

  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Candidate" : "Add New Candidate";

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0000007a] backdrop:backdrop-blur-2xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal - Full screen on desktop, responsive on mobile */}
      <div className="relative w-full max-w-3xl h-5/6 mx-auto my-10 no-scrollbar rounded-xl
       bg-white shadow-2xl overflow-hidden transform transition-transform duration-300">
        {/* Sticky Header - Always visible */}
        <div className="flex shadow-sm items-center w-full justify-between px-6 py-4 bg-white sticky top-0 z-20">
          <div className="flex gap-2 items-center">
            <span className="p-2 bg-blue-50 flex items-center rounded-lg">
              {mode === "add" ? (
                <PlusCircleIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <PencilSquareIcon className="w-5 h-5 text-blue-600" />
              )}
            </span>
            <p className="text-md">{title}</p>
          </div>{" "}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="h-[calc(100%-60px)] md:h-[calc(100%-100px)] no-scrollbar overflow-y-auto overscroll-contain">
          <div className="max-w-[76rem] mx-auto my-0">
            <div className="p-4 md:p-6">
              {isEditMode ? (
                <EditCandidateForm
                  candidate={candidate!}
                  candidates={[]} // Empty array since we don't need duplicate validation in modal
                  positions={positions}
                  statuses={statuses}
                />
              ) : (
                <AddCandidateForm
                  candidates={[]} // Empty array since we don't need duplicate validation in modal
                  positions={positions}
                  statuses={statuses}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
