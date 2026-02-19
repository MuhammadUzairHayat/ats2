import React, { useState, useRef, useEffect } from "react";
import { Candidate, Filters, Position, Status } from "@/types";
import {
  PlusIcon,
  FunnelIcon,
  ChevronDownIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PositionsFilter from "@/components/ui/filters/PositionsFilter";
import StatusesFilter from "@/components/ui/filters/StatusesFilter";
import StatusFlagFilter from "@/components/ui/filters/StatusFlagFilter";
import SearchFilter from "@/components/ui/filters/SearchFilter";
import TrashButton from "../trash/TrashButton";
import ColumnVisibilityToggle, { ColumnConfig } from "./ColumnVisibilityToggle";
import { cn } from "../ui/Skeleton";

interface CandidatesFiltersProps {
  candidates: Candidate[];
  filters: Filters;
  statuses: Status[];
  positions: Position[];
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onAddClick?: () => void;
  // ✅ New props for column visibility
  columns: ColumnConfig[];
  onColumnToggle: (columnId: string) => void;
}

const CandidatesFilters = ({
  candidates,
  filters,
  statuses,
  positions,
  handleFilterChange,
  onAddClick,
  columns,
  onColumnToggle,
}: CandidatesFiltersProps) => {
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ✅ Check if any filter is active
  const hasActiveFilters = Boolean(
    filters.position || filters.status || filters.statusFlag || filters.search
  );

  // ✅ Clear all filters handler
  const handleClearFilters = () => {
    // Create synthetic events to clear each filter
    const clearEvents = [
      { target: { name: "position", value: "" } },
      { target: { name: "status", value: "" } },
      { target: { name: "statusFlag", value: "" } },
      { target: { name: "search", value: "" } },
    ];

    clearEvents.forEach((event) => {
      handleFilterChange(event as React.ChangeEvent<HTMLInputElement>);
    });
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsColumnDropdownOpen(false);
      }
    };

    if (isColumnDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColumnDropdownOpen]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/*---- Header ---- */}
      <div className="flex items-start md:items-center sm:items-center flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* Left: Title + Icon */}
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-900">Candidates</h3>
        </div>

        {/* Right: Add Candidate Button */}
        <div className="flex items-center gap-3">
          <TrashButton allCandidates={candidates} />
          <button
            type="button"
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-4 h-4" /> Add Candidate
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
        {/* Position (2/10 on lg) */}
        <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
          <PositionsFilter
            positions={positions}
            filters={filters.position}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Status  */}
        <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
          <StatusesFilter
            statuses={statuses}
            filters={filters.status}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Status Flag*/}
        <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
          <StatusFlagFilter
            filters={filters.statusFlag}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Search */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3">
          <SearchFilter
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        <div
          className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 relative flex flex-col gap-2"
          ref={dropdownRef}
        >
          {/* Toggle Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsColumnDropdownOpen((v) => !v)}
            aria-controls="columns-dropdown"
            title="Toggle column visibility"
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 mt-6 bg-white border border-gray-300 rounded-xl
               hover:border-blue-400 hover:bg-blue-50 transition-all focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-gray-100 rounded-md">
                <FunnelIcon className="w-4 h-4 text-gray-700" />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isColumnDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Panel - ✅ Fixed positioning */}
          {isColumnDropdownOpen && (
            <div
              id="columns-dropdown"
              className="absolute top-full mt-2 
                 min-w-[320px] max-w-[500px]
                 bg-white border border-gray-200 rounded-xl shadow-2xl 
                 z-[100] p-4 
                 max-h-[450px] overflow-y-auto
                 animate-in fade-in slide-in-from-top-2
                 left-0
                 xl:left-auto xl:right-0"
            >
              <ColumnVisibilityToggle
                columns={columns}
                onToggle={onColumnToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/*=== Active Filters Indicator + Clear Button ===*/}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.position && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Position: {filters.position}
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {filters.status}
              </span>
            )}
            {filters.statusFlag && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  {
                    "bg-green-100 text-green-800":
                      filters.statusFlag === "active",
                    "bg-amber-100 text-amber-800":
                      filters.statusFlag === "onHold",
                    "bg-red-100 text-red-800":
                      filters.statusFlag === "rejected",
                  }
                )}
              >
                {filters.statusFlag === "active" && "Active"}
                {filters.statusFlag === "onHold" && "On Hold"}
                {filters.statusFlag === "rejected" && "Rejected"}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Search: {filters.search}
              </span>
            )}

            {/* ✅ Clear Filters Button */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Clear all filters"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesFilters;
