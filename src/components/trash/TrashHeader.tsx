interface TrashHeaderProps {
  totalCandidates: number;
  selectedCount: number;
  onClose: () => void;
}

export default function TrashHeader({
  totalCandidates,
  selectedCount,
  onClose,
}: TrashHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Candidates Trash</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalCandidates}{" "}
          {totalCandidates === 1 ? "candidate" : "candidates"} in trash
          {selectedCount > 0 && (
            <span className="ml-2 text-blue-600 font-medium">
              • {selectedCount} selected
            </span>
          )}
        </p>
      </div>
      <button
        title="Close modal"
        onClick={onClose}
        className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        aria-label="Close trash modal"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}