"use client";
import React, { useMemo } from "react";
import { Candidate, Status } from "@/types";
import {
  ConditionalDeleteButton,
  EditRowButton,
  ViewRowButton,
} from "../ui/TableActionButtons";
import { softDeleteCandidate } from "@/lib/actions/candidates-actions";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MinusIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import {
  createStatusColorMap,
  getStatusColor,
} from "@/lib/utils/candidate-utils";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import { formatExperience } from "@/lib/utils/text-utils";
import { permanentDeleteCandidate } from "@/lib/actions/trash-actions";
import { ColumnConfig } from "./ColumnVisibilityToggle";

interface CandidatesTableBodyProps {
  currentCandidates: Candidate[];
  statuses: Status[];
  columns: ColumnConfig[];
  onStatusClick?: (status: string) => void;
  onPositionClick?: (position: string) => void;
  onStatusFlagClick?: (status: string) => void;
  onViewClick?: (candidate: Candidate) => void;
  onEditClick?: (candidate: Candidate) => void;
}

const CandidatesTableBody = React.memo(
  ({
    currentCandidates,
    statuses,
    columns,
    onStatusClick,
    onPositionClick,
    onStatusFlagClick,
    onViewClick,
    onEditClick,
  }: CandidatesTableBodyProps) => {
    const statusColorMap = useMemo(
      () => createStatusColorMap(statuses),
      [statuses]
    );

    const isVisible = (columnId: string) =>
      columns.find((col) => col.id === columnId)?.visible || false;

    return (
      <tbody className="bg-white divide-y divide-gray-100">
        {currentCandidates.map((candidate: Candidate, index: number) => {
          const colors = getStatusColor(candidate?.status, statusColorMap);
          return (
            <tr
              key={`candidate-${index}`}
              className="hover:bg-gray-50 transition-colors duration-150 group"
            >
              {/*=== Name (Always Visible) ===*/}
              {isVisible("name") && (
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: colors.bg,
                      }}
                    >
                      <span
                        className="text-white font-medium text-sm"
                        style={{ color: colors.text }}
                      >
                        {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p
                        title={candidate.name}
                        className="text-sm font-semibold text-gray-900 min-w-[160px]"
                      >
                        {toStandardTitleCase(candidate.name)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {candidate.linkedin && (
                          <p
                            title={candidate.linkedin}
                            className="text-xs text-blue-600 truncate max-w-[120px]"
                          >
                            <a
                              href={candidate.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              LinkedIn
                            </a>
                          </p>
                        )}
                        {candidate.statusFlag && (
                          <span
                            onClick={() =>
                              onStatusFlagClick?.(
                                candidate.statusFlag! as string
                              )
                            }
                            className={`items-center cursor-pointer px-2 py-0.5 rounded-full text-xs font-medium w-[min-content] ${
                              candidate.statusFlag === "onHold"
                                ? "bg-amber-100 text-amber-800"
                                : candidate.statusFlag === "rejected"
                                ? "bg-red-100 text-red-800"
                                : candidate.statusFlag === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {candidate.statusFlag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
              )}

              {/*=== Position ===*/}
              {isVisible("position") && (
                <td className="px-6 py-4">
                  <div
                    className="flex flex-col gap-2 text-sm text-gray-900 font-medium cursor-pointer hover:text-blue-600 min-w-[160px]"
                    onClick={() => onPositionClick?.(candidate.position)}
                    title={candidate.position}
                  >
                    {candidate.position}
                  </div>
                </td>
              )}

              {/*=== Experience ===*/}
              {isVisible("experience") && (
                <td className="px-6 py-4">
                  <div className="text-sm text-nowrap text-gray-600">
                    {candidate.experience ? (
                      formatExperience(candidate.experience)
                    ) : (
                      <MinusIcon className="w-6 h-3" />
                    )}
                  </div>
                </td>
              )}

              {/*=== Contact ===*/}
              {isVisible("contact") && (
                <td className="px-6 py-4 align-middle">
                  <div className="flex flex-col space-y-1 justify-center">
                    {candidate.phoneNumber && (
                      <a
                        href={`tel:${candidate.phoneNumber}`}
                        className="flex gap-2 w-[min-content] py-1 px-3 items-center text-xs bg-[#9e9ea115] rounded-full text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        <PhoneIcon className="w-4 h-4" />{" "}
                        {candidate.phoneNumber}
                      </a>
                    )}
                    {candidate.email && (
                      <a
                        href={`mailto:${candidate.email}`}
                        className="flex gap-2 w-[min-content] py-1 px-3 items-center text-xs text-gray-600 bg-[#9e9ea115] rounded-full hover:text-blue-600 truncate transition-colors"
                        title={candidate.email}
                      >
                        <EnvelopeIcon className="w-4 h-4" /> {candidate.email}
                      </a>
                    )}
                  </div>
                </td>
              )}

              {/*=== Availability ===*/}
              {isVisible("availability") && (
                <td className="px-6 py-4">
                  <div className="text-sm text-nowrap text-gray-600">
                    {candidate.noticePeriod ? (
                      `${candidate.noticePeriod} days`
                    ) : (
                      <MinusIcon className="w-6 h-3" />
                    )}
                  </div>
                </td>
              )}

              {/*=== Status ===*/}
              {isVisible("status") && (
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-nowrap cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                    onClick={() => onStatusClick?.(candidate.status)}
                    title="Click to filter by this status"
                  >
                    {toStandardTitleCase(candidate.status)}
                  </span>
                </td>
              )}

              {/*=== Resume ===*/}
              {isVisible("resume") && (
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {candidate.fileId ? (
                      <a
                        href={`https://drive.google.com/file/d/${candidate.fileId}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-green-200 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 hover:border-green-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        title="View Resume"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Resume</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 border border-gray-200 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed">
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium text-nowrap">
                          No Resume
                        </span>
                      </span>
                    )}
                  </div>
                </td>
              )}

              {/*=== Actions (Always Visible & Sticky) - FIXED Z-INDEX ===*/}
              {isVisible("actions") && (
                <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-[1] transition-colors duration-150">
                  <div className="flex items-center space-x-2">
                    <ViewRowButton onClick={() => onViewClick?.(candidate)} />
                    <EditRowButton onClick={() => onEditClick?.(candidate)} />
                    <ConditionalDeleteButton
                      id={candidate.id}
                      selectedName={candidate.name}
                      modalTitle="Delete Candidate"
                      isDeleted={candidate.isDeleted}
                      onSoftDelete={softDeleteCandidate}
                      onPermanentDelete={permanentDeleteCandidate}
                    />
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    );
  }
);

CandidatesTableBody.displayName = "CandidatesTableBody";

export default CandidatesTableBody;
