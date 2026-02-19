"use client";
import React, { useState } from "react";

interface EditCVUploadInputProps {
  currentFileId?: string;
  candidateName: string;
}

const EditCVUploadInput = ({ currentFileId }: EditCVUploadInputProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For edit form, we just need to ensure the file is properly set in the form data
    // The actual upload logic is handled in the updateCandidateAction
    setIsUploading(true);

    // Small delay to show loading state
    setTimeout(() => {
      setIsUploading(false);
    }, 500);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2.5">
        {currentFileId ? "Replace CV (Optional)" : "Upload CV"}
      </label>
      <input
        title="Edit CV"
        type="file"
        name="cvFile"
        id="cvFile"
        accept="application/pdf"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      <p className="mt-1 text-sm text-gray-500">
        {currentFileId
          ? "Upload a new CV to replace the current one"
          : "Upload the candidate's resume (PDF format)"}
      </p>
      {isUploading && (
        <div className="mt-2 text-sm text-blue-600">
          Processing file...
        </div>
      )}
    </div>
  );
};

export default EditCVUploadInput;
