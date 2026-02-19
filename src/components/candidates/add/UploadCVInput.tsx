import React, { Dispatch, SetStateAction, useState } from "react";
import { extractedDataProps } from "./AddCandidateForm";
import ValidationCheckbox from "./ValidationCheckbox";

interface UploadCVInputProps {
  setFormData: Dispatch<SetStateAction<extractedDataProps>>;
  isExtract: boolean;
  setIsExtract: Dispatch<SetStateAction<boolean>>
  
}

const UploadCVInput = ({ setFormData, isExtract, setIsExtract }: UploadCVInputProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const parseExperience: (exp: string) => string[] = (
    exp: string
  ): string[] => {
    const num = parseFloat(exp);
    if (isNaN(num)) return ["", ""];
    const years = Math.floor(num);
    const months = Math.round((num - years) * 12);
    return [years.toString(), months.toString()];
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setUploadedFile(null);
      setFileName("");
      setFormData((prev) => ({ ...prev, cvFile: null }));
      return;
    }

    // ✅ Always store the file first
    setUploadedFile(file);
    setFileName(file.name);

    // ✅ If extract is disabled, just store the file and return
    if (!isExtract) {
      setFormData((prev) => ({ ...prev, cvFile: file }));
      console.log("✅ CV file stored (extraction disabled)");
      return;
    }

    // ✅ If extract is enabled, process the file
    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(25);

      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(75);

      if (!res.ok) {
        throw new Error("Failed to extract CV data");
      }

      const responseData = await res.json();

      // Safely extract parsed data with fallback
      const parsed = responseData?.parsed || responseData || {};

      // Transform experience from string to array with null safety
      const transformedData = {
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        linkedIn: parsed.linkedIn || parsed.linkedin || "",
        experience: parsed.experience
          ? parseExperience(parsed.experience)
          : ["", ""],
        cvFile: file, 
      };

      setFormData(transformedData);
      setUploadProgress(100);
    } catch (error) {
      console.error(`❌ Error extracting data from CV:`, error);
      setFormData((prev) => ({ ...prev, cvFile: file }));
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setUploadProgress(0);
      }, 500);
    }
  }

  return (
    <div className="sm:col-span-4">
      <div className="flex justify-between">
        <label
          htmlFor="cv"
          className="block text-sm font-medium text-gray-700 mb-2.5"
        >
          Upload CV (PDF) *
        </label>

        <ValidationCheckbox
          checked={isExtract}
          onChange={() => setIsExtract((prev) => !prev)}
          label="extract data from PDF"
        />
      </div>

      <input
        title="CV File"
        type="file"
        name="cvFile"
        id="cvFile"
        accept="application/pdf"
        onChange={handleFileUpload}
        disabled={isLoading}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        required
      />

      {/* ✅ Show selected file name */}
      {uploadedFile && !isLoading && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{fileName}</span>
          <span className="ml-2 text-gray-400">
            ({(uploadedFile.size / 1024).toFixed(1)} KB)
          </span>
        </div>
      )}

      {isLoading && isExtract && (
        <div className="mt-3 w-full p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin [animation-duration:0.5s]"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Extracting data from CV
              </div>
              <div className="text-xs text-gray-500">
                This may take a few seconds
              </div>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              {uploadProgress}%
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCVInput;
