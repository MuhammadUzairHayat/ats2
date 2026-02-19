"use client";
import { Candidate, Status } from "@/types";
import React, { useState, useEffect } from "react";
import CandidatesTableHeader from "./CandidatesTableHeader";
import CandidatesTableBody from "./CandidatesTableBody";
import { Pagination } from "./Pagination";
import { ColumnConfig } from "./ColumnVisibilityToggle";

interface CandidatesTableProps {
  filteredCandidates: Candidate[];
  statuses: Status[];
  onStatusClick?: (status: string) => void;
  onPositionClick?: (position: string) => void;
  onStatusFlagClick?: (statusFlag: string) => void;
  onViewClick?: (candidate: Candidate) => void;
  onEditClick?: (candidate: Candidate) => void;
  // ✅ Accept columns from parent
  columns: ColumnConfig[];
}

const CandidatesTable = React.memo(
  ({
    filteredCandidates,
    statuses,
    onStatusClick,
    onPositionClick,
    onStatusFlagClick,
    onViewClick,
    onEditClick,
    columns, // ✅ Receive columns as prop
  }: CandidatesTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    /* _______________________________________
       Reset pagination when filtered candidates change
       _________________________________________
    */
    useEffect(() => {
      setCurrentPage(1);
    }, [filteredCandidates.length]);

    /* _______________________________________
       Pagination calculations
       _________________________________________
    */
    const totalItems = filteredCandidates.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

    /* _______________________________________
       Handle status click with pagination reset
       _________________________________________
    */
    const handleStatusClick = (status: string) => {
      setCurrentPage(1);
      onStatusClick?.(status);
    };

    /* _______________________________________
       Handle position click with pagination reset
       _________________________________________
    */
    const handlePositionClick = (position: string) => {
      setCurrentPage(1);
      onPositionClick?.(position);
    };

    /* _______________________________________
       Handle status flag click with pagination reset
       _________________________________________
    */
    const handleStatusFlagClick = (statusFlag: string) => {
      setCurrentPage(1);
      onStatusFlagClick?.(statusFlag);
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* ❌ Removed Column Visibility Toggle - now in CandidatesFilters */}

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* === Table Header === */}
            <CandidatesTableHeader columns={columns} />

            {/* === Table Body === */}
            <CandidatesTableBody
              currentCandidates={currentCandidates}
              statuses={statuses}
              columns={columns}
              onStatusClick={handleStatusClick}
              onPositionClick={handlePositionClick}
              onStatusFlagClick={handleStatusFlagClick}
              onViewClick={onViewClick}
              onEditClick={onEditClick}
            />
          </table>

          {/*=== No Candidates Found State ===*/}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                  />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No candidates found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}

          {/*=== Sticky Pagination Footer ===*/}
          <Pagination
            startIndex={startIndex}
            endIndex={endIndex}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>
    );
  }
);

CandidatesTable.displayName = "CandidatesTable";

export default CandidatesTable;
