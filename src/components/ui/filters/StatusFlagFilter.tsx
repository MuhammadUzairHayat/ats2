"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

interface StatusFlagFilterProps {
  filters: string;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const STATUS_FLAGS = [
  { value: "", label: "All Flags", color: "text-gray-600", bgColor: "bg-gray-50" },
  { value: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
  { value: "onHold", label: "On Hold", color: "text-amber-600", bgColor: "bg-amber-50" },
  { value: "rejected", label: "Rejected", color: "text-red-600", bgColor: "bg-red-50" },
];

const StatusFlagFilter = ({
  filters,
  handleFilterChange,
}: StatusFlagFilterProps) => {
  const [selectedValue, setSelectedValue] = useState(filters || "");
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external filter changes
  useEffect(() => {
    setSelectedValue(filters || "");
  }, [filters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setFilterQuery("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setOpen(false);
    setFilterQuery("");

    const syntheticEvent = {
      target: { name: "statusFlag", value },
    } as unknown as ChangeEvent<HTMLSelectElement>;

    handleFilterChange(syntheticEvent);
  };

  // Filter flags based on search query
  const filteredFlags = STATUS_FLAGS.filter((flag) =>
    flag.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const selectedFlag = STATUS_FLAGS.find((flag) => flag.value === selectedValue);

  return (
    <div className="relative max-w-96" ref={containerRef}>
      <label
        htmlFor="statusFlag-filter"
        className="block text-sm font-medium text-gray-700 mb-2.5"
      >
        Status Flag
      </label>

      {/* Custom Select Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-left focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 flex items-center justify-between hover:border-blue-300"
      >
        <span
          className={`${
            selectedFlag?.color || "text-gray-500"
          } font-medium truncate`}
        >
          {selectedFlag?.label || "Select Flag"}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search flags..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-none text-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredFlags.length > 0 ? (
              filteredFlags.map((flag) => (
                <button
                  key={flag.value}
                  type="button"
                  onClick={() => handleSelect(flag.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    selectedValue === flag.value ? flag.bgColor : ""
                  }`}
                >
                  <span className={`${flag.color} font-medium`}>
                    {flag.label}
                  </span>
                  {selectedValue === flag.value && (
                    <CheckIcon className={`w-5 h-5 ${flag.color}`} />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No flags found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFlagFilter;
