"use client";
import { useState, useCallback } from "react";
import { Candidate } from "@/types";

export function useCandidateFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedCandidateForEdit, setSelectedCandidateForEdit] =
    useState<Candidate | null>(null);

  const openAddFormModal = useCallback(() => {
    setMode("add");
    setSelectedCandidateForEdit(null);
    setIsOpen(true);
  }, []);

  const openEditFormModal = useCallback((candidate: Candidate) => {
    setMode("edit");
    setSelectedCandidateForEdit(candidate);
    setIsOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setSelectedCandidateForEdit(null);
    setIsOpen(false);
  }, []);

  return {
    isFormModalOpen: isOpen,
    formModalMode: mode,
    selectedCandidateForEdit,
    openAddFormModal,
    openEditFormModal,
    closeFormModal,
  };
}
