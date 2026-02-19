import React from "react";
import { Position, Candidate } from "@/types";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import {
  ConditionalDeleteButton,
  EditRowButton,
} from "../ui/TableActionButtons";
import {
  softDeletePositionHandle,
  permanentDeletePositionHandle,
} from "@/lib/actions/positions-actions";
import { getHiredCountForPosition } from "@/lib/utils/position-utils";

const COLUMNS = [
  "Position Name",
  "Department",
  "Vacancies",
  "Hired",
  "Description",
  "Actions",
];

interface PositionTableProps {
  positions: Position[];
  candidates: Candidate[];
  onEditClick?: (position: Position) => void;
}

const PositionTable = ({
  positions,
  candidates,
  onEditClick,
}: PositionTableProps) => {
  const activePositions = positions.filter(
    (position) => position.isDeleted === 0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {activePositions.map((position) => {
              //  Calculate hired count dynamically
              const hiredCount = getHiredCountForPosition(
                position.name,
                candidates
              );

              return (
                <tr
                  key={position.id}
                  className="hover:bg-gray-50 transition-colors duration-150 group"
                >
                  {/* Position Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div title={position.name} className="text-base font-semibold text-gray-900">
                        {position.name}
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {position.department}
                    </span>
                  </td>

                  {/* Criteria */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {position.criteria ? (
                        <span className="inline-flex text-nowrap items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Max {position.criteria} candidates
                        </span>
                      ) : (
                        <span className="text-gray-400 ml-2 italic">Unlimited</span>
                      )}
                    </div>
                  </td>

                  {/* Hired - Display dynamically calculated count */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {hiredCount}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4">
                    <div title={position.description} className="text-sm text-gray-600 line-clamp-2">
                      {position.description || (
                        <span className="text-gray-400 italic">
                          No description provided
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 transition-opacity duration-200">
                      <EditRowButton onClick={() => onEditClick?.(position)} />

                      <ConditionalDeleteButton
                        id={position.id}
                        selectedName={position.name}
                        modalTitle="Delete Position"
                        isDeleted={position.isDeleted}
                        onSoftDelete={softDeletePositionHandle}
                        onPermanentDelete={permanentDeletePositionHandle}
                        candidates={candidates}
                        itemType="position"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {activePositions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BuildingOfficeIcon className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No positions found
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first position to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default PositionTable;
