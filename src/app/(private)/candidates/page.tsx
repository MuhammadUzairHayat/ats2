import Candidates from "@/components/candidates/Candidates";
import { fetchCandidatePageData } from "@/lib/utils/data-fetching";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Candidates | Techwards - ATS",
  description: "View and manage your recruitment dashboard",
};
export default async function CandidatesPage() {
  const { candidates, positions, statuses } = await fetchCandidatePageData();

  return (
    <div>
      <Candidates
        candidates={candidates}
        positions={positions}
        statuses={statuses}
      />
    </div>
  );
}
