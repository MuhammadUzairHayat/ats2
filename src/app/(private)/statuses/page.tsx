import { getStatuses } from "@/lib/google-sheet/statuses-sheet";
import StatusesPageClient from "./StatusesPageClient";
import { Metadata } from "next";
import { getCandidates } from "@/lib/google-sheet/candidates-sheet";

// Add caching to reduce load time
export const revalidate = 120; // Revalidate every 2 minutes

export const metadata: Metadata = {
  title: "Statuses | Techwards - ATS",
  description: "View and manage your recruitment dashboard",
};
export default async function StatusesPage() {
  const statuses = await getStatuses();
  const candidates = await getCandidates();

  return <StatusesPageClient statuses={statuses} candidates={candidates} />;
}
