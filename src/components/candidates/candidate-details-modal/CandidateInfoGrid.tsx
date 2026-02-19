import React from "react";
import { Candidate } from "@/types";
import { toStandardTitleCase, formatExperience } from "@/lib/utils/text-utils";

interface CandidateInfoGridProps {
  candidate: Candidate;
}

export default function CandidateInfoGrid({ candidate }: CandidateInfoGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Personal Information */}
      <div className="space-y-4 md:space-y-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 md:pb-3">
          Personal Information
        </h3>

        <div className="space-y-3 md:space-y-4">
          <InfoItem label="Full Name" value={toStandardTitleCase(candidate.name)} />
          
          <InfoItem
            label="Email Address"
            value={
              <a
                href={`mailto:${candidate.email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {candidate.email || "Not Provided"}
              </a>
            }
          />
          
          <InfoItem
            label="Phone Number"
            value={
              <a
                href={`tel:${candidate.phoneNumber}`}
                className="text-gray-900 hover:text-blue-600 hover:underline"
              >
                {candidate.phoneNumber || "Not provided"}
              </a>
            }
          />
          
          <InfoItem
            label="LinkedIn Profile"
            value={
              candidate.linkedin ? (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  View Profile
                </a>
              ) : (
                <span className="text-gray-400">Not provided</span>
              )
            }
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-4 md:space-y-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 md:pb-3">
          Professional Details
        </h3>

        <div className="space-y-3 md:space-y-4">
          <InfoItem label="Position" value={candidate.position} />
          
          <InfoItem
            label="Experience"
            value={
              candidate.experience
                ? formatExperience(candidate.experience)
                : "Not specified"
            }
          />
          
          <InfoItem
            label="Current Salary"
            value={
              candidate.currentSalary ? (
                <span className="font-semibold text-green-700">
                  {candidate.currentSalary}
                </span>
              ) : (
                <span className="text-gray-400">Not specified</span>
              )
            }
          />
          
          <InfoItem
            label="Expected Salary"
            value={
              candidate.expectedSalary ? (
                <span className="font-semibold text-blue-700">
                  {candidate.expectedSalary}
                </span>
              ) : (
                <span className="text-gray-400">Not specified</span>
              )
            }
          />
          
          <InfoItem
            label="Notice Period"
            value={
              candidate.noticePeriod
                ? `${candidate.noticePeriod} days`
                : "Not specified"
            }
          />
          
          <InfoItem
            label="Reference"
            value={candidate.reference || "Not provided"}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4 md:space-y-6 lg:col-span-2">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 md:pb-3">
          Comments & Notes
        </h3>

        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          {candidate?.comments ? (
            <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap break-words">
              {candidate.comments}
            </p>
          ) : (
            <p className="text-gray-400 italic text-base md:text-lg">
              No comments or notes available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent info item styling
function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-base md:text-lg text-gray-900 font-medium break-words">
        {value}
      </dd>
    </div>
  );
}