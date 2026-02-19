import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Position } from "@/types";
import FilterDropdownList from "./FilterDropdownList";

interface PositionsFilterProps {
  positions: Position[];
  filters: string;
  handleFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function PositionsFilter({
  positions,
  filters,
  handleFilterChange,
}: PositionsFilterProps) {
  const [selectedValue, setSelectedValue] = useState(filters || "");
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external filter changes
  useEffect(() => {
    setSelectedValue(filters || "");
    setFilterQuery("");
  }, [filters]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = positions.filter((p) =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="relative max-w-[24rem] w-full" ref={containerRef}>
      <label
        htmlFor="position"
        className="block text-sm font-medium text-gray-700 mb-2.5"
      >
        Position
      </label>

      {/* ==== Fake select field (click to open) ==== */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 border focus:border-blue-400 focus:ring-1 focus:ring-blue-400 border-gray-300 rounded-xl bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 transition-all"
      >
        <div className="flex-1 overflow-x-auto whitespace-nowrap no-scrollbar">
          <span
            className={`text-gray-900 ${!selectedValue && "text-gray-400"}`}
          >
            {selectedValue || "All Positions"}
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {/* ==== Dropdown with search + list ==== */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-t-xl">
          {/* Search input inside dropdown */}
          <div className="p-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-2 py-1 border-0 bg-white rounded-lg  focus:border-transparent focus:outline-none text-gray-900"
              autoFocus
            />
          </div>

          {/* Filtered list */}
          <FilterDropdownList
            fieldName="position"
            defaultOption="All Positions"
            filtered={filtered}
            setInputValue={setSelectedValue}
            setFilterQuery={setFilterQuery}
            handleFilterChange={handleFilterChange}
            setOpen={setOpen}
          />
        </div>
      )}
    </div>
  );
}
