"use client";
import React, { useState } from "react";
import PositionTable from "@/components/position/PositionTable";
import PositionFormModal from "@/components/position/PositionFormModal";
import { Candidate, Position } from "@/types";
import { PlusIcon } from "@heroicons/react/24/outline";

interface PositionsPageClientProps {
  positions: Position[];
  candidates: Candidate[]
}

export default function PositionsPageClient({ positions, candidates }: PositionsPageClientProps) {
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"add" | "edit">("add");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const handleAddPosition = () => {
    setFormModalMode("add");
    setSelectedPosition(null);
    setIsFormModalOpen(true);
  };

  const handleEditPosition = (position: Position) => {
    setFormModalMode("edit");
    setSelectedPosition(position);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedPosition(null);
  };

  return (
    <div className="space-y-8">
      {/* === Position Page Title === */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              Positions
            </h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Manage job positions and organize them into categories for better
            candidate tracking.
          </p>
        </div>

        {/* === Add Position Button ===*/}
        <div className="flex-shrink-0">
          <button
            onClick={handleAddPosition}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/*=== Positions Table ===*/}
      <PositionTable positions={positions} candidates={candidates} onEditClick={handleEditPosition} />

      {/* Position Form Modal */}
      <PositionFormModal
        mode={formModalMode}
        position={selectedPosition}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
      />
    </div>
  );
}