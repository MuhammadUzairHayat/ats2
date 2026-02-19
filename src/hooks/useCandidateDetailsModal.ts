"use client";
import { useState, useCallback } from "react";
import { Candidate } from "@/types";

export function useCandidateDetailsModal() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const openDetailsModal = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsOpen(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setSelectedCandidate(null);
    setIsOpen(false);
  }, []);

  return {
    selectedCandidate,
    isDetailsModalOpen: isOpen,
    openDetailsModal,
    closeDetailsModal,
  };
}
