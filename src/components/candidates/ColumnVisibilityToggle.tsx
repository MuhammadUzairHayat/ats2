"use client";

import { useRef } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  alwaysVisible?: boolean;
}

interface ColumnVisibilityToggleProps {
  columns: ColumnConfig[];
  onToggle: (columnId: string) => void;
}

export default function ColumnVisibilityToggle({
  columns,
  onToggle,
}: ColumnVisibilityToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleCount = columns.filter((col) => col.visible).length;

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-xl">
            <EyeIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Column Visibility
          </h3>
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {visibleCount} / {columns.length}
          </span>
        </div>
      </div>

      {/* Column Toggle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {columns.map((column) => {
          if (column.alwaysVisible) return
          return (
            <label
              key={column.id}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                column.visible
                  ? "bg-blue-50 border-blue-300 shadow-sm hover:border-blue-400 hover:bg-blue-100"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${
                column.alwaysVisible
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              title={
                column.alwaysVisible
                  ? "This column is always visible"
                  : `Toggle ${column.label}`
              }
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={column.visible}
                onChange={() => !column.alwaysVisible && onToggle(column.id)}
                disabled={column.alwaysVisible}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                aria-label={`Toggle ${column.label}`}
              />

              {/* Label Text */}
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`text-sm font-medium truncate ${
                    column.visible ? "text-blue-900" : "text-gray-700"
                  }`}
                >
                  {column.label}
                </span>
                {column.alwaysVisible && (
                  <span className="text-[11px] text-blue-600 font-medium mt-0.5">
                    Required field
                  </span>
                )}
              </div>

              {/* Icon */}
              <div
                className={`flex-shrink-0 transition-colors duration-200 ${
                  column.visible ? "text-blue-600" : "text-gray-400"
                }`}
              >
              </div>
            </label>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          Required columns cannot be hidden
        </p>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() =>
              columns.forEach(
                (col) => !col.alwaysVisible && !col.visible && onToggle(col.id)
              )
            }
            className="px-4 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
          >
            Show All
          </button>
          <button
            type="button"
            onClick={() =>
              columns.forEach(
                (col) => !col.alwaysVisible && col.visible && onToggle(col.id)
              )
            }
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Hide All
          </button>
        </div>
      </div>
    </div>
  );
}
