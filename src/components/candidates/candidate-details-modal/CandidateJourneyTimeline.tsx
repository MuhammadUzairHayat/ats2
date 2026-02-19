import React from "react";
import { Status, StatusHistoryEntry } from "@/types";
import { CheckIcon } from "@heroicons/react/24/outline";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import StatusHistoryTooltip from "./StatusHistoryTooltip";

interface CandidateJourneyTimelineProps {
  statuses: Status[];
  currentStatus: string;
  statusHistory: StatusHistoryEntry[];
  loadingHistory: boolean;
  flagColor: string;
  flagLabel: string;
  formatDate: (dateString: string | null) => string;
}

export default function CandidateJourneyTimeline({
  statuses,
  currentStatus,
  statusHistory,
  loadingHistory,
  flagColor,
  flagLabel,
  formatDate,
}: CandidateJourneyTimelineProps) {
  const currentStepIndex = statuses.findIndex(
    (status) => status.name === currentStatus && status.isDeleted !== 1
  );

  const getStatusDates = (statusName: string): StatusHistoryEntry[] => {
    return statusHistory
      .filter((entry) => entry.newStatus === statusName)
      .sort(
        (a, b) =>
          new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
      );
  };

  // ✅ Calculate total width based on number of statuses
  const statusWidth = 120; // Each status takes 200px
  const totalWidth = statuses.length * statusWidth;
  const progressWidth =
    currentStepIndex >= 0 ? (currentStepIndex + 1) * statusWidth : 0;

  return (
    <div className="mt-6 pt-6">
      {currentStepIndex === -1 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Current status &quot;{currentStatus}&quot; is
            not found in the standard workflow.
          </p>
        </div>
      )}

      {loadingHistory && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-blue-800">Loading status timeline...</p>
        </div>
      )}

      {/* Timeline Container - Horizontal scroll wrapper */}
      <div className="relative overflow-x-auto overflow-y-visible no-scrollbar rounded-lg py-2 pt-6">
        {/* Inner container with fixed pixel width */}
        <div
          className="relative"
          style={{ width: `${totalWidth}px`, minWidth: "100%" }}
        >
          {/* Background Track - Full width */}
          <div
            className="absolute top-1/6 left-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"
            style={{ width: `${totalWidth}px` }}
          ></div>

          {/* Progress Track - Fills up to current step */}
          {currentStepIndex >= 0 && (
            <div
              className={`absolute top-1/6 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-700 ease-out ${
                flagColor === "green"
                  ? "bg-green-500"
                  : flagColor === "red"
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
              style={{
                width: `${progressWidth - statusWidth / 2}px`,
              }}
            ></div>
          )}

          {/* Status Nodes Container */}
          <div className="flex relative">
            {statuses.map((status, idx) => {
              const isCompleted =
                currentStepIndex >= 0 && idx < currentStepIndex;
              const isCurrent =
                currentStepIndex >= 0 && idx === currentStepIndex;
              const isUpcoming =
                currentStepIndex >= 0 && idx > currentStepIndex;
              const statusDates = getStatusDates(status.name);

              return (
                <div
                  key={status.id}
                  className="flex flex-col items-center relative"
                  style={{ width: `${statusWidth}px` }}
                >
                  {/* Status Indicator */}
                  <div className="relative mb-2">
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 z-10 ${
                        isCompleted
                          ? "bg-green-500 text-white scale-110"
                          : isCurrent
                          ? `${
                              flagColor === "green"
                                ? "bg-green-500 ring-4 ring-green-200"
                                : flagColor === "red"
                                ? "bg-red-500 ring-4 ring-red-200"
                                : "bg-amber-500 ring-4 ring-amber-200"
                            } text-white scale-110`
                          : "bg-white border-2 border-gray-300 text-gray-500"
                      } ${isUpcoming ? "opacity-70" : ""}`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{idx + 1}</span>
                      )}

                      {isCurrent && (
                        <div
                          className={`absolute inset-0 rounded-full animate-ping ${
                            flagColor === "green"
                              ? "bg-green-400"
                              : flagColor === "red"
                              ? "bg-red-400"
                              : "bg-amber-400"
                          } opacity-30`}
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Status Label & Dates */}
                  <div className="flex flex-col gap-2 text-center w-full px-2 mt-2">
                    <div
                      className={`text-xs font-medium leading-tight break-words ${
                        isCurrent
                          ? "text-gray-900 font-bold"
                          : isCompleted
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {status.name}
                    </div>

                    {statusDates.length > 0 && (
                      <div className="mt-1">
                        <StatusHistoryTooltip
                          statusDates={statusDates}
                          formatDate={formatDate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div
          className={`p-3 rounded-lg ${
            flagColor === "green"
              ? "bg-green-50 border border-green-200"
              : flagColor === "red"
              ? "bg-red-50 border border-red-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div
            className={`text-sm font-bold ${
              flagColor === "green"
                ? "text-green-700"
                : flagColor === "red"
                ? "text-red-700"
                : "text-amber-700"
            }`}
          >
            {flagLabel}
          </div>
          <div className="text-xs text-gray-600">Current Status</div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-bold text-blue-700">
            {currentStepIndex >= 0
              ? `${currentStepIndex + 1}/${statuses.length}`
              : "N/A"}
          </div>
          <div className="text-xs text-gray-600">Progress</div>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div
            className="text-sm font-bold text-gray-700 truncate"
            title={currentStatus}
          >
            {toStandardTitleCase(currentStatus)}
          </div>
          <div className="text-xs text-gray-600">Stage</div>
        </div>
      </div>
    </div>
  );
}
