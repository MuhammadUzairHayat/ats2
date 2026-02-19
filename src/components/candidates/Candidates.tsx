"use client";
import React, { useState } from "react";
import CandidatesFilters from "./CandidatesFilters";
import CandidatesTable from "./CandidatesTable";
import CandidateFormModal from "./CandidateFormModal";
import { Candidate, Position, Status } from "@/types";
import { useCandidateFilters } from "../ui/filters/filtersHook";
import { useCandidateDetailsModal } from "@/hooks/useCandidateDetailsModal";
import { useCandidateFormModal } from "@/hooks/useCandidateFormModal";
import CandidateDetailsModal from "./candidate-details-modal/CandidateDetailsModal";
import { ColumnConfig } from "@/components/candidates/ColumnVisibilityToggle";

interface CandidatesProps {
  candidates: Candidate[];
  positions: Position[];
  statuses: Status[];
}

const Candidates = React.memo(
  ({ candidates, positions, statuses }: CandidatesProps) => {
    const {
      filters,
      filteredCandidates,
      handleFilterChange,
      handleStatusClick,
      handlePositionClick,
      handleStatusFlagClick, // ✅ Add this
    } = useCandidateFilters(candidates, statuses, positions);

    const {
      selectedCandidate,
      isDetailsModalOpen,
      openDetailsModal,
      closeDetailsModal,
    } = useCandidateDetailsModal();

    const {
      isFormModalOpen,
      formModalMode,
      selectedCandidateForEdit,
      openAddFormModal,
      openEditFormModal,
      closeFormModal,
    } = useCandidateFormModal();

    // ✅ Column state managed at page level
    const [columns, setColumns] = useState<ColumnConfig[]>(
      [
        { id: "name", label: "Name", visible: true, alwaysVisible: true },
        { id: "position", label: "Position", visible: true },
        { id: "experience", label: "Experience", visible: true },
        { id: "contact", label: "Contact", visible: true },
        { id: "availability", label: "Availability", visible: false },
        { id: "status", label: "Status", visible: true },
        { id: "resume", label: "Resume", visible: true },
        { id: "actions", label: "Actions", visible: true, alwaysVisible: true },
      ]
    );

    // ✅ Handle column visibility toggle
    const handleColumnToggle = (columnId: string) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, visible: !col.visible } : col
        )
      );
    };

    return (
      <div className="space-y-6">
        {/*--- Filters ---*/}
        <CandidatesFilters
          filters={filters}
          candidates={candidates}
          statuses={statuses}
          positions={positions}
          handleFilterChange={handleFilterChange}
          onAddClick={openAddFormModal}
          columns={columns}
          onColumnToggle={handleColumnToggle}
        />

        {/*--- Candidates Table ---*/}
        <div className="bg-white rounded-lg">
          <div className="overflow-x-auto">
            <CandidatesTable
              filteredCandidates={filteredCandidates}
              statuses={statuses}
              columns={columns} // ✅ Pass columns here
              onStatusClick={handleStatusClick}
              onPositionClick={handlePositionClick}
              onStatusFlagClick={handleStatusFlagClick} // ✅ Add this
              onViewClick={openDetailsModal}
              onEditClick={openEditFormModal}
            />
          </div>
        </div>

        {/* Candidate Details Modal */}
        <CandidateDetailsModal
          candidate={selectedCandidate}
          statuses={statuses.filter((s) => s.isDeleted !== 1)}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        />

        {/* Candidate Form Modal */}
        <CandidateFormModal
          mode={formModalMode}
          candidate={selectedCandidateForEdit}
          positions={positions.filter((p) => p.isDeleted !== 1)}
          statuses={statuses.filter((s) => s.isDeleted !== 1)}
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
        />
      </div>
    );
  }
);

Candidates.displayName = "Candidates";

export default Candidates;
