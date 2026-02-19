"use client";
import { useState, useMemo, type ChangeEvent, useCallback } from "react";
import { Candidate, Filters, Position, Status } from "@/types";
import { filterCandidates } from "@/lib/utils/candidate-utils";

/**
 * Filters active candidates based on position and status
 */
function filterActiveCandidates(
  candidates: Candidate[],
  positions: Position[],
  statuses: Status[]
): Candidate[] {
  const activePositionNames = new Set(
    positions
      .filter((p) => p.isDeleted === 0)
      .map((p) => p.name.toLowerCase().trim())
  );

  const activeStatusNames = new Set(
    statuses
      .filter((s) => s.isDeleted === 0)
      .map((s) => s.name.toLowerCase().trim())
  );

  return candidates.filter((c) => {
    if (c.isDeleted === 1) return false;

    const candidatePosition = c.position.toLowerCase().trim();
    const candidateStatus = c.status.toLowerCase().trim();

    return (
      activePositionNames.has(candidatePosition) &&
      activeStatusNames.has(candidateStatus)
    );
  });
}

export function useDashboardFilters(
  candidates: Candidate[],
  positions: Position[],
  statuses: Status[]
) {
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const handlePositionFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSelectedPosition(e.target.value);
    },
    []
  );

  const activeCandidates = useMemo(
    () => filterActiveCandidates(candidates, positions, statuses),
    [candidates, positions, statuses]
  );

  const filteredCandidates = useMemo(() => {
    if (!selectedPosition) return activeCandidates;

    const normalizedSelection = selectedPosition.toLowerCase().trim();

    return activeCandidates.filter(
      (candidate) =>
        candidate.position.toLowerCase().trim() === normalizedSelection
    );
  }, [activeCandidates, selectedPosition]);

  return {
    selectedPosition,
    handlePositionFilterChange,
    filteredCandidates,
    activeCandidates,
    setSelectedPosition,
  };
}

export function useCandidateFilters(
  candidates: Candidate[],
  statuses: Status[],
  positions: Position[]
) {
  const [filters, setFilters] = useState<Filters>({
    position: "",
    status: "",
    search: "",
    statusFlag: "",
  });

  const activeCandidates = useMemo(
    () => filterActiveCandidates(candidates, positions, statuses),
    [candidates, positions, statuses]
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleStatusClick = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handlePositionClick = useCallback((position: string) => {
    setFilters((prev) => ({ ...prev, position }));
  }, []);

  // ✅ Add statusFlag click handler
  const handleStatusFlagClick = useCallback((statusFlag: string) => {
    setFilters((prev) => ({ ...prev, statusFlag }));
  }, []);

  const filteredCandidates = useMemo(() => {
    return filterCandidates(activeCandidates, filters, positions, statuses);
  }, [activeCandidates, filters, positions, statuses]);

  return {
    filters,
    setFilters,
    handleFilterChange,
    handleStatusClick,
    handlePositionClick,
    handleStatusFlagClick, // ✅ Export new handler
    filteredCandidates,
  };
}
