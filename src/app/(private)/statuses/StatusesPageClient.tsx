"use client";
import React, { useState } from "react";
import StatusesTable from "@/components/status/StatusesTable";
import StatusFormModal from "@/components/status/StatusFormModal";
import { Candidate, Status } from "@/types";
import { PlusIcon } from "@heroicons/react/24/outline";

interface StatusesPageClientProps {
  statuses: Status[];
  candidates: Candidate[];
}

export default function StatusesPageClient({
  statuses,
  candidates,
}: StatusesPageClientProps) {
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"add" | "edit">("add");
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const handleAddStatus = () => {
    setFormModalMode("add");
    setSelectedStatus(null);
    setIsFormModalOpen(true);
  };

  const handleEditStatus = (status: Status) => {
    setFormModalMode("edit");
    setSelectedStatus(status);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedStatus(null);
  };

  return (
    <div className="space-y-8">
      {/*=== Statuses Page Header Section ===*/}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">Statuses</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Manage candidate statuses and customize their display properties for
            better pipeline tracking.
          </p>
        </div>

        {/* === Add Status Button === */}
        <div className="flex-shrink-0">
          <button
            onClick={handleAddStatus}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Status
          </button>
        </div>
      </div>

      {/*=== Statuses Table ===*/}
      <StatusesTable
        statuses={statuses}
        candidates={candidates}
        onEditClick={handleEditStatus}
      />

      {/* Status Form Modal */}
      <StatusFormModal
        mode={formModalMode}
        status={selectedStatus}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
      />
    </div>
  );
}
