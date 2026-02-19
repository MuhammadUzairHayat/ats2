import React from "react";
import { Candidate, Status } from "@/types";
import {
  ConditionalDeleteButton,
  EditRowButton,
} from "../ui/TableActionButtons";
import {
  softDeleteStatusHandle,
  permanentDeleteStatusHandle,
} from "@/lib/actions/statuses-actions";

const STATUSES = ["Color", "Status", "Description", "Actions"];

interface StatusesTableProps {
  statuses: Status[];
  candidates: Candidate[];
  onEditClick?: (status: Status) => void;
}

const StatusesTable = ({ statuses, candidates, onEditClick }: StatusesTableProps) => {
  // Filter out deleted statuses
  const activeStatuses = statuses.filter((status) => !status.isDeleted);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              {STATUSES.map((status, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {status}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {activeStatuses.map((status) => (
              <tr
                key={status.id}
                className="hover:bg-gray-50 transition-colors duration-150 group"
              >
                {/* Color Display */}
                <td
                  className="px-6 py-4 text-sm font-mono text-white"
                  style={{ backgroundColor: status.color }}
                >
                  {status.color}
                </td>

                {/* Status Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div title={status.name} className="text-base font-semibold text-gray-900">
                      {status.name}
                    </div>
                  </div>
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {status.description || (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 transition-opacity duration-200">
                    <EditRowButton onClick={() => onEditClick?.(status)} />
                    <ConditionalDeleteButton
                      id={status.id}
                      selectedName={status.name}
                      modalTitle="Delete Status"
                      isDeleted={status.isDeleted}
                      onSoftDelete={softDeleteStatusHandle}
                      onPermanentDelete={permanentDeleteStatusHandle}
                      candidates={candidates}
                      itemType="status"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {activeStatuses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No statuses found</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first status to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusesTable;
