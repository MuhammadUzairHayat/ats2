import React from "react";
import { Candidate } from "@/types";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import { getStatusColor } from "@/lib/utils/candidate-utils";

interface CandidateProfileHeaderProps {
  candidate: Candidate;
  statusColorMap: Map<string, string>;
}

export default function CandidateProfileHeader({
  candidate,
  statusColorMap,
}: CandidateProfileHeaderProps) {
  const colors = getStatusColor(candidate.status, statusColorMap);

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
      <div
        className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg flex-shrink-0"
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      >
        {candidate.name?.charAt(0)?.toUpperCase() || "C"}
      </div>
      
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 truncate">
          {toStandardTitleCase(candidate.name)}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-3 md:mb-4">
          {candidate.position}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
          <span
            className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-white shadow-sm"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
            }}
          >
            {candidate.status}
          </span>
          
          {candidate.fileId && (
            <a
              href={`https://drive.google.com/file/d/${candidate.fileId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-green-200 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 hover:border-green-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 text-xs md:text-sm"
            >
              <DocumentArrowDownIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="font-medium">View Resume</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}