import React from "react";
import { ColumnConfig } from "./ColumnVisibilityToggle";

interface CandidatesTableHeaderProps {
  columns: ColumnConfig[];
}

const CandidatesTableHeader = ({ columns }: CandidatesTableHeaderProps) => {
  const columnMap: Record<string, { text: string; sticky?: boolean }> = {
    name: { text: "Name" },
    position: { text: "Position" },
    experience: { text: "Experience" },
    contact: { text: "Contact" },
    salary: { text: "Salary" },
    availability: { text: "Availability" },
    status: { text: "Status" },
    resume: { text: "Resume" },
    actions: { text: "Actions", sticky: true },
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns
          .filter((col) => col.visible)
          .map((column) => {
            const config = columnMap[column.id];
            return (
              <th
                key={column.id}
                className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  config.sticky
                    ? "sticky right-0 bg-gray-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-[5]"
                    : ""
                }`}
              >
                {config.text}
              </th>
            );
          })}
      </tr>
    </thead>
  );
};

export default CandidatesTableHeader;
