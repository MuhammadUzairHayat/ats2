import { formatExperience, toStandardTitleCase } from "@/lib/utils/text-utils";
import { softDeleteCandidate } from "@/lib/actions/candidates-actions";
import { permanentDeleteCandidate } from "@/lib/actions/trash-actions";
import { ConditionalDeleteButton } from "../ui/TableActionButtons";
import { TrashTableRowProps } from "./types";


export default function TrashTableRow({
  candidate,
  isSelected,
  isUndoLoading,
  onSelect,
  onUndo,
}: TrashTableRowProps) {
  return (
    <tr
      className={`border-b border-gray-100 transition-all duration-200 ease-in-out ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(candidate.id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
          title={`Select ${candidate.name}`}
          aria-label={`Select ${candidate.name}`}
        />
      </td>

      {/* Name */}
      <td className="py-4 px-4">
        <div className="font-medium text-gray-900">
          {toStandardTitleCase(candidate.name)}
        </div>
      </td>

      {/* Position */}
      <td className="py-4 px-4">
        <div className="text-gray-700">{candidate.position}</div>
      </td>

      {/* Experience */}
      <td className="py-4 px-4">
        <div className="text-gray-700 text-nowrap">
          {candidate.experience ? formatExperience(candidate.experience) : null}
        </div>
      </td>

      {/* Email */}
      <td className="py-4 px-4">
        <div className="text-gray-600 text-sm">{candidate.email}</div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 text-nowrap">
          {toStandardTitleCase(candidate.status)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onUndo(candidate.id, candidate.name)}
            disabled={isUndoLoading}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Restore candidate"
            aria-label={`Restore ${candidate.name}`}
          >
            {isUndoLoading ? (
              <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
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
                Restore
              </>
            )}
          </button>
          <ConditionalDeleteButton
            modalTitle="Delete Candidate"
            id={candidate.id}
            selectedName={candidate.name}
            isDeleted={candidate.isDeleted}
            onSoftDelete={softDeleteCandidate}
            onPermanentDelete={permanentDeleteCandidate}
          />
        </div>
      </td>
    </tr>
  );
}