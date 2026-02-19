import { Candidate } from "@/types";

export interface TrashOperationResult {
  success: boolean;
  error?: string;
}

export interface BatchProcessResult {
  successCount: number;
  failCount: number;
}

export interface ProgressState {
  current: number;
  total: number;
}

export interface TrashTableProps {
  candidates: Candidate[];
  selectedIds: Set<string>;
  undoLoading: string | null;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onSelectAll: () => void;
  onSelectRow: (id: string) => void;
  onUndoDelete: (id: string, name: string) => void;
}

export interface TrashModalProps {
  allCandidates: Candidate[]
  isOpen: boolean;
  onClose: () => void;
  deletedCandidates: Candidate[];
  onRefresh: () => void;
}

export interface TrashTableRowProps {
  candidate: Candidate;
  isSelected: boolean;
  isUndoLoading: boolean;
  onSelect: (id: string) => void;
  onUndo: (id: string, name: string) => void;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  bulkUndoLoading: boolean;
  bulkDeleteLoading: boolean;
  progress: ProgressState;
  onRestoreAll: () => void;
  onDeleteAll: () => void;
}
