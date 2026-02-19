import TrashTableRow from "./TrashTableRow";
import { TrashTableProps } from "./types";

export default function TrashTable({
  candidates,
  selectedIds,
  undoLoading,
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  onSelectRow,
  onUndoDelete,
}: TrashTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">Trash is empty</p>
        <p className="text-gray-400 text-sm mt-1">No deleted candidates</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 py-6 bg-blue-50 rounded-t-lg">
            <th className="text-left py-3 px-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isSomeSelected;
                  }
                }}
                onChange={onSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                title={isAllSelected ? "Deselect all" : "Select all"}
                aria-label={isAllSelected ? "Deselect all" : "Select all"}
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Position
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Experience
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <TrashTableRow
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedIds.has(candidate.id)}
              isUndoLoading={undoLoading === candidate.id}
              onSelect={onSelectRow}
              onUndo={onUndoDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}