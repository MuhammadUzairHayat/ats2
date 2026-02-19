"use client";
import { Candidate } from "@/types";
import {
  CheckCircleIcon,
  PauseCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function CandidateStatusSummary({
  filteredCandidates,
}: {
  filteredCandidates: Candidate[];
}) {
  const onHoldCount = filteredCandidates.filter((c) => c.statusFlag === "onHold").length;
  const activeCount = filteredCandidates.filter((c) => c.statusFlag === "active").length;
  const rejectedCount = filteredCandidates.filter((c) => c.statusFlag === "rejected").length;
  const totalCount = filteredCandidates.length;

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 flex flex-wrap items-center gap-10">
      {/* Total */}
      <div className="text-base font-semibold text-gray-800">
        Total Candidates: &nbsp;<span className="text-blue-600">{totalCount}</span>
      </div>

      {/* Active */}
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="w-5 h-5 text-green-600" />
        <span className="text-gray-700 text-sm font-light">Active:</span>
        <span className="text-gray-900 font-semibold">{activeCount}</span>
      </div>

      {/* On Hold */}
      <div className="flex items-center space-x-2">
        <PauseCircleIcon className="w-5 h-5 text-yellow-500" />
        <span className="text-gray-700 text-sm font-light">On Hold:</span>
        <span className="text-gray-900 font-semibold">{onHoldCount}</span>
      </div>

      {/* Rejected */}
      <div className="flex items-center space-x-2">
        <XCircleIcon className="w-5 h-5 text-red-500" />
        <span className="text-gray-700 text-sm font-light">Rejected:</span>
        <span className="text-gray-900 font-semibold">{rejectedCount}</span>
      </div>
    </div>
  );
}
