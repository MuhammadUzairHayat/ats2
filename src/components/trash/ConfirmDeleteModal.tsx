"use client";

import { useState } from "react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  itemName: string;
  itemType: "position" | "status";
  candidateCount: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (confirmationText: string) => void;
};

export default function ConfirmDeleteModal({
  isOpen,
  itemName,
  itemType,
  candidateCount,
  isDeleting,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim() !== itemName.trim()) {
      setError(`Please type "${itemName}" exactly as shown`);
      return;
    }
    onConfirm(inputValue);
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setInputValue("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete {itemType === "position" ? "Position" : "Status"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold text-gray-900">{itemName}</span>{" "}
                and all{" "}
                <span className="font-semibold text-red-600">
                  {candidateCount} candidate{candidateCount !== 1 ? "s" : ""}
                </span>{" "}
                associated with it.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <label
            htmlFor="confirm-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Type <span className="font-semibold text-gray-900">&quot;{itemName}&quot;</span> to
            confirm:
          </label>
          <input
            title="confirm deletion"
            id="confirm-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDeleting) {
                handleConfirm();
              }
            }}
            disabled={isDeleting}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder={itemName}
            autoFocus
            aria-describedby={error ? "error-message" : undefined}
          />
          {error && (
            <p id="error-message" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Warning:</strong> This action cannot be undone. All
              associated candidates will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!inputValue.trim() || isDeleting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}