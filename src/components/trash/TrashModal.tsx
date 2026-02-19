"use client";

import TrashHeader from "./TrashHeader";
import BulkActionsBar from "./BulkActionsBar";
import TrashTable from "./TrashTable";
import { useTrashOperations } from "./useTrashOperations";
import { TrashModalProps } from "./types";

export default function TrashModal({
  isOpen,
  onClose,
  deletedCandidates,
  onRefresh,
}: TrashModalProps) {
  const {
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
  } = useTrashOperations(onRefresh);

  const isAllSelected =
    deletedCandidates.length > 0 &&
    selectedIds.size === deletedCandidates.length;
  const isSomeSelected =
    selectedIds.size > 0 && selectedIds.size < deletedCandidates.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-md shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <TrashHeader
          totalCandidates={deletedCandidates.length}
          selectedCount={selectedIds.size}
          onClose={onClose}
        />

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedIds.size}
          bulkUndoLoading={bulkUndoLoading}
          bulkDeleteLoading={bulkDeleteLoading}
          progress={progress}
          onRestoreAll={handleBulkUndo}
          onDeleteAll={handleBulkDelete}
        />

        {/* Content - Table */}
        <div className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out">
          <TrashTable
            candidates={deletedCandidates}
            selectedIds={selectedIds}
            undoLoading={undoLoading}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={() =>
              handleSelectAll(deletedCandidates.map((c) => c.id))
            }
            onSelectRow={handleSelectRow}
            onUndoDelete={handleUndoDelete}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
