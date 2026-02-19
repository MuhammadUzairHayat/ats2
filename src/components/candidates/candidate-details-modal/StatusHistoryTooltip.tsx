import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ClockIcon } from "@heroicons/react/24/outline";
import { StatusHistoryEntry } from "@/types";

interface StatusHistoryTooltipProps {
  statusDates: StatusHistoryEntry[];
  formatDate: (dateString: string | null) => string;
}

export default function StatusHistoryTooltip({
  statusDates,
  formatDate,
}: StatusHistoryTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  // ✅ Calculate position synchronously when hovered
  useLayoutEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
      // ✅ Show tooltip after position is calculated
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (statusDates.length === 0) return null;

  const tooltipContent = (
    <div
      className={`fixed z-[9999] transition-opacity duration-200 pointer-events-none ${
        isVisible ? "opacity-100" : "opacity-0 invisible"
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="bg-gray-50 text-gray-800 rounded-lg shadow-2xl p-3 min-w-[220px] max-w-[300px]">
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-200"></div>
        </div>

        <div className="text-xs font-semibold mb-2 pb-2 border-b border-gray-100">
          Status History ({statusDates.length} entries)
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto">
          {statusDates.map((historyEntry, dateIdx) => (
            <div
              key={`${historyEntry.historyId}-${dateIdx}`}
              className="text-xs py-1.5 px-2 bg-gray-100 rounded"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ClockIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  {formatDate(historyEntry.changedAt)}
                </span>
              </div>
              <div className="text-gray-700 text-[10px] ml-4 truncate">
                {historyEntry.oldStatus.toLowerCase() === "new" ? "Added First" : 
                <span className="text-gray-600">From: {historyEntry.oldStatus}</span>}
              </div>
              <div className="text-gray-700 text-[10px] ml-4 truncate">
                By:{" "}
                <span className="text-gray-600">{historyEntry.changedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="flex flex-col items-center justify-center gap-1 cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <ClockIcon className="w-3 h-3 text-gray-400" />
          {formatDate(statusDates[0].changedAt)}
        </span>
        {statusDates.length > 1 && (
          <span className="text-xs text-blue-600 font-medium ml-1">
            +{statusDates.length - 1} more
          </span>
        )}
      </div>

      {typeof window !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
}
