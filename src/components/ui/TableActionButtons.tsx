"use client";

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import Link from "next/link";
import { toast } from "sonner";
import { Candidate } from "@/types";


interface DeleteResult {
  success: boolean;
  error?: string;
  deletedCandidates?: number;
}

interface ConditionalDeleteButtonProps {
  id: string;
  selectedName: string;
  modalTitle: string;
  isDeleted: number | undefined;
  onSoftDelete: (id: string) => Promise<DeleteResult>;
  onPermanentDelete: (id: string) => Promise<DeleteResult>;
  candidates?: Candidate[],
  itemType?: "position" | "status" | "other"
}

/* _____________________________________

    Conditional Delete Button Component
  _____________________________________ */

export function ConditionalDeleteButton({
  id,
  selectedName,
  modalTitle,
  isDeleted,
  onSoftDelete,
  onPermanentDelete,
  candidates,
  itemType = "other"
}: ConditionalDeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const candidateIsDeleted = Number(isDeleted);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = candidateIsDeleted
        ? await onPermanentDelete(id)
        : await onSoftDelete(id);

      if (result.success) {
        setIsModalOpen(false);

        // Show toast notification for cascade deletes
        if (candidateIsDeleted && 'deletedCandidates' in result && result.deletedCandidates! > 0) {
          toast.success(`${result.deletedCandidates} candidate${result.deletedCandidates === 1 ? '' : 's'} also deleted`);
        }
      } else {
        console.error(result.error || "Failed to delete. Please try again.");
      }
    } catch (error) {
      console.error(`An unexpected error occurred. Please try again. ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  modalTitle = candidateIsDeleted
    ? `Permanently ${modalTitle}`
    : `${modalTitle}`;
  const modalMessage = candidateIsDeleted
    ? "Warning: This action cannot be undone."
    : "This will move the row to trash. You can restore it later.";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center cursor-pointer p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        title={candidateIsDeleted ? "Permanently delete" : "Move to trash"}
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteModal
          selectedName={selectedName}
          modalTitle={modalTitle}
          isDeleting={isDeleting}
          isSoftDeleted={isDeleted}
          modalMessage={modalMessage}
          setIsModalOpen={setIsModalOpen}
          handleDelete={handleDelete}
          candidates={candidates}
          itemType={itemType}
        />
      )}
    </>
  );
}

/* _____________________________________

    Edit Row Button Component
  _____________________________________ */
export const EditRowButton = ({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="inline-flex cursor-pointer items-center p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        title="Edit candidate"
      >
        <PencilSquareIcon className="w-4 h-4" />
      </button>
    );
  }

  if (!href) {
    console.error("EditRowButton: href is required when onClick is not provided");
    return null;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      title="Edit position"
    >
      <PencilSquareIcon className="w-4 h-4" />
    </Link>
  );
};

/* _____________________________________

    View Row Button Component
  _____________________________________ */
export const ViewRowButton = ({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="inline-flex cursor-pointer items-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
        title="View candidate"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
    );
  }

  if (!href) {
    console.error("ViewRowButton: href is required when onClick is not provided");
    return null;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
      title="View candidate"
    >
      <EyeIcon className="h-4 w-4" />
    </Link>
  );
};

/* _____________________________________

    Undo Delete Button Component
  _____________________________________ */
interface UndoDeleteButtonProps {
  id: string;
  handleUndo: (id: string) => Promise<DeleteResult>;
}

export const UndoDeleteButton = ({ id, handleUndo }: UndoDeleteButtonProps) => {
  const [isUndoing, setIsUndoing] = useState(false);

  const handleClick = async () => {
    setIsUndoing(true);
    try {
      const result = await handleUndo(id);
      if (result.success) {
        // No need for router.refresh() - revalidatePath handles it in server action
      } else {
        console.error(result.error || "Failed to restore. Please try again.");
      }
    } catch (error) {
      console.error(`An unexpected error occurred. Please try again. ${error}`);
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUndoing}
      className="inline-flex items-center p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Undo delete"
    >
      <ArrowUturnLeftIcon className="w-4 h-4" />
    </button>
  );
};
