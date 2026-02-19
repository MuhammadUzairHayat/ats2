"use client";
import { Candidate } from "@/types";
import { motion } from "framer-motion";
const TotalCandidatesCard = ({
  filteredCandidates,
}: {
  filteredCandidates: Candidate[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 rounded-xl bg-blue-50 p-3">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-600">
            Total Applicants
          </h3>
          <p className="text-7xl font-bold text-gray-900 mt-2">
            {filteredCandidates.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TotalCandidatesCard;
