import ProgressBar from "./ProgressBar";
import { BulkActionsBarProps } from "./types";

export default function BulkActionsBar({
  selectedCount,
  bulkUndoLoading,
  bulkDeleteLoading,
  progress,
  onRestoreAll,
  onDeleteAll,
}: BulkActionsBarProps) {
  const hasProgress = progress.total > 0;

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out border-b border-blue-100 ${
        selectedCount > 0
          ? hasProgress
            ? "min-h-16 opacity-100"
            : "min-h-15 opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3 bg-blue-50">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900">
            {selectedCount} candidate{selectedCount > 1 ? "s" : ""} selected
          </p>
          <ProgressBar progress={progress} />
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            onClick={onRestoreAll}
            disabled={bulkUndoLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Restore ${selectedCount} selected candidates`}
          >
            {bulkUndoLoading ? (
              <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            )}
            Restore All
          </button>

          <button
            onClick={onDeleteAll}
            disabled={bulkDeleteLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Permanently delete ${selectedCount} selected candidates`}
          >
            {bulkDeleteLoading ? (
              <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <svg
                className="w-4 h-4 mr-2"
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
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
}
