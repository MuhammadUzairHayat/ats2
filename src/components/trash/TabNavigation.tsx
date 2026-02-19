
type TabType = "candidates" | "positions" | "statuses";

interface TabNavigationProps {
  activeTab: TabType;
  candidatesCount: number;
  positionsCount: number;
  statusesCount: number;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  candidatesCount,
  positionsCount,
  statusesCount,
  onTabChange,
}: TabNavigationProps) {
  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "candidates", label: "Candidates", count: candidatesCount },
    { id: "positions", label: "Positions", count: positionsCount },
    { id: "statuses", label: "Statuses", count: statusesCount },
  ];

  return (
    <div className="border-b border-gray-200 px-6">
      <nav className="flex gap-4" aria-label="Trash tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative py-3 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}