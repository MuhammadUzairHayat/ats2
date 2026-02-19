import { getPositions } from "@/lib/google-sheet/positions-sheet";
import { getCandidates } from "@/lib/google-sheet/candidates-sheet";
import PositionsPageClient from "@/components/position/PositionsPageClient";
import { Metadata } from "next";

// Add caching to reduce load time
export const revalidate = 120; // Revalidate every 2 minutes

export const metadata: Metadata = {
  title: "Positions | Techwards - ATS",
  description: "View and manage your recruitment dashboard",
};
export default async function PositionsPage() {
  const positions = await getPositions();
  const candidates = await getCandidates();

  return (
    <div>
      <PositionsPageClient
        positions={positions}
        candidates={candidates} // ✅ Pass candidates to table
      />
    </div>
  );
}
