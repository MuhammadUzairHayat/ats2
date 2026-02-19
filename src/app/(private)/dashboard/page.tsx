import Dashboard from "@/components/dashboard/Dashboard";
import { fetchDashboardData } from "@/lib/utils/data-fetching";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Techwards - ATS",
  description: "View and manage your recruitment dashboard",
};

export default async function DashboardPage() {
  const { candidates, statuses, positions } = await fetchDashboardData();

  return (
    <Dashboard
      candidates={candidates}
      statuses={statuses}
      positions={positions}
    />
  );
}
