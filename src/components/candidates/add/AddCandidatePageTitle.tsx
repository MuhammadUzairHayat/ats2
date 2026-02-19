"use client";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AddCandidatePageTitle = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Add New Candidate
          </h1>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          Complete the form below to add a new candidate to your talent
          pipeline.
        </p>
      </div>

      <div className="flex-shrink-0">
        <Link
          href="/candidates"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700 transition-colors" />
          Back to Candidates
        </Link>
      </div>
    </div>
  );
};

export default AddCandidatePageTitle;
