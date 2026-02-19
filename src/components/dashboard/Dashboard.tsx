"use client";
import { DashboardClientProps } from "@/types";
import DashboardEachStatus from "@/components/dashboard/DashboardEachStatus";
import DashboardPageTitle from "./DashboardPageTitle";
import CandidateStatusSummary from "./FlagStatusSummary";
import PositionsFilter from "@/components/ui/filters/PositionsFilter";
import { useDashboardFilters } from "../ui/filters/filtersHook";
import { useMemo } from "react";

export default function Dashboard({
  candidates,
  statuses,
  positions,
}: DashboardClientProps) {
  const { selectedPosition, handlePositionFilterChange, filteredCandidates } =
    useDashboardFilters(candidates, positions, statuses);

  const activeStatuses = useMemo(
    () => statuses.filter((status) => status.isDeleted === 0),
    [statuses]
  );

  return (
    <div className="space-y-8">
      <div className="relative flex z-10 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DashboardPageTitle />

        <PositionsFilter
          positions={positions}
          filters={selectedPosition}
          handleFilterChange={handlePositionFilterChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-gray-900 bg-gray-100 p-2 rounded-full px-6">
          {selectedPosition || "All Positions"}
        </h2>
      </div>

      <CandidateStatusSummary filteredCandidates={filteredCandidates} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeStatuses.map((status, index) => (
          <DashboardEachStatus
            delay={index}
            filteredCandidates={filteredCandidates}
            key={status.id}
            status={status}
          />
        ))}
      </div>
    </div>
  );
}
