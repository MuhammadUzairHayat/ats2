"use client";
import { Candidate } from "@/types";
import {
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface DeleteModalProps {
  selectedName: string | null;
  modalTitle?: string;
  isSoftDeleted: number | undefined;
  isDeleting: boolean;
  modalMessage?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  candidates?: Candidate[];
  itemType?: "position" | "status" | "other";
}

const DeleteModal = ({
  selectedName,
  modalTitle,
  modalMessage,
  isSoftDeleted,
  isDeleting,
  setIsModalOpen,
  handleDelete,
  candidates = [],
  itemType = "other",
}: DeleteModalProps) => {
  // Calculate candidate count and validation automatically
  const { hasCandidates, candidateCount } = useMemo(() => {
    if (!candidates || candidates.length === 0 || !selectedName) {
      return { hasCandidates: false, candidateCount: 0 };
    }

    let count = 0;

    if (itemType === "position") {
      // Count candidates assigned to this position
      count = candidates.filter(
        (c) => c.position === selectedName && c.isDeleted === 0
      ).length;
    } else if (itemType === "status") {
      // Count candidates with this status
      count = candidates.filter(
        (c) => c.status === selectedName && c.isDeleted === 0
      ).length;
    }

    return {
      hasCandidates: count > 0,
      candidateCount: count,
    };
  }, [candidates, selectedName, itemType]);

  // Lock body scroll and handle ESC key in single effect
  useEffect(() => {
    // Save original body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Cleanup: restore scroll and remove event listener
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setIsModalOpen]);

  // Determine modal title based on item type
  const getModalTitle = () => {
    if (itemType === "position") return "Delete Position";
    if (itemType === "status") return "Delete Status";
    return modalTitle || "Delete Item";
  };

  // Generate error message for candidates
  const getCandidateErrorMessage = () => {
    const itemName = itemType === "position" ? "position" : "status";
    return `Cannot delete this ${itemName} because ${candidateCount} candidate${
      candidateCount === 1 ? " is" : "s are"
    } currently assigned to it. Please reassign or remove ${
      candidateCount === 1 ? "the candidate" : "these candidates"
    } before deleting.`;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          setIsModalOpen(false);
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${
                hasCandidates ? "bg-yellow-100" : "bg-red-100"
              } rounded-full flex items-center justify-center`}
            >
              {hasCandidates ? (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              ) : (
                <TrashIcon className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getModalTitle()}
              </h3>
              <p className="text-sm text-gray-500">
                {hasCandidates
                  ? "Action not allowed"
                  : isSoftDeleted
                  ? "This action cannot be undone"
                  : "This action can be undone"}
              </p>
            </div>
          </div>
          <button
            type="button"
            title="Close modal"
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {hasCandidates ? (
            // Show error message when candidates are found
            <>
              <p className="text-gray-700 mb-4">
                Cannot delete{" "}
                <strong className="font-semibold text-gray-900">
                  {selectedName || "this item"}
                </strong>
                .
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 font-medium">
                    {getCandidateErrorMessage()}
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Show normal delete confirmation
            <>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-gray-900">
                  {selectedName || "this item"}
                </strong>
                ?{" "}
                {isSoftDeleted
                  ? "This will permanently remove it from the system"
                  : "This will move it to trash"}
                .
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">
                  {modalMessage || "Warning: This action cannot be undone."}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasCandidates ? "Close" : "Cancel"}
          </button>
          {!hasCandidates && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                getModalTitle()
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to escape table DOM hierarchy
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default DeleteModal;
