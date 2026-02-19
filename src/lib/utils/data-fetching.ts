import { getCandidates } from "@/lib/google-sheet/candidates-sheet";
import { getPositions } from "@/lib/google-sheet/positions-sheet";
import { getStatuses } from "@/lib/google-sheet/statuses-sheet";

/**
 * Fetches all common dashboard data in parallel
 */
export async function fetchDashboardData() {
  const [candidates, positions, statuses] = await Promise.all([
    getCandidates(),
    getPositions(),
    getStatuses(),
  ]);

  return {
    candidates,
    positions,
    statuses,
  };
}

/**
 * Fetches data needed for candidate management pages
 */
export async function fetchCandidatePageData() {
  const [candidates, positions, statuses] = await Promise.all([
    getCandidates(),
    getPositions(),
    getStatuses(),
  ]);

  return {
    candidates,
    positions,
    statuses,
  };
}

/**
 * Fetches data needed for form pages (add/edit)
 */
export async function fetchFormData() {
  const [positions, statuses] = await Promise.all([
    getPositions(),
    getStatuses(),
  ]);

  return {
    positions,
    statuses,
  };
}