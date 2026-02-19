"use client";
import { motion } from "framer-motion";
import { Candidate, Status } from "@/types";
import { memo } from "react";
import { toStandardTitleCase } from "@/lib/utils/text-utils";

interface DashboardEachStatusProps {
  delay: number;
  filteredCandidates: Candidate[];
  status: Status;
}

const DashboardEachStatus = memo(
  ({ delay, filteredCandidates, status }: DashboardEachStatusProps) => {
    const statusCandidates = filteredCandidates.filter(
      (c) => c.status.toLowerCase() === status.name.toLowerCase()
    );

    const count = statusCandidates.length;
    const percentage =
      filteredCandidates.length > 0
        ? ((count / filteredCandidates.length) * 100).toFixed(1)
        : "0.0";

    const statusFlagBreakdown = statusCandidates.reduce(
      (acc, c) => {
        if (c.statusFlag === "active") acc.active++;
        else if (c.statusFlag === "onHold") acc.onHold++;
        else if (c.statusFlag === "rejected") acc.rejected++;
        return acc;
      },
      { active: 0, onHold: 0, rejected: 0 }
    );

    return (
      <motion.div
        key={status.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.08 }}
        className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-sm transition-all duration-300"
      >
        <div className="flex flex-1 items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl p-3 bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">
                {toStandardTitleCase(status.name)}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex items-end py-3 ${
              count > 0 ? " justify-between" : " justify-end"
            }`}
          >
            {/* Status Flag Breakdown */}
            {count > 0 && (
              <div className="mt-2 flex flex-wrap-reverse gap-1">
                {statusFlagBreakdown.active > 0 && (
                  <span className="inline-flex items-center px-[14px] py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">
                    Active: &nbsp; <b>{statusFlagBreakdown.active}</b>
                  </span>
                )}
                {statusFlagBreakdown.onHold > 0 && (
                  <span className="inline-flex items-center px-[12px] py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                    on Hold: &nbsp; <b>{statusFlagBreakdown.onHold}</b>
                  </span>
                )}
                {statusFlagBreakdown.rejected > 0 && (
                  <span className="inline-flex items-center px-[14px] py-1 text-xs font-medium bg-red-100 text-red-800 rounded-md">
                    Rejected: &nbsp; <b>{statusFlagBreakdown.rejected}</b>
                  </span>
                )}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>
          <div className="w-full rounded-full h-2 bg-gray-200">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-blue-500"
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>
        </div>
      </motion.div>
    );
  }
);

DashboardEachStatus.displayName = "DashboardEachStatus";

export default DashboardEachStatus;
