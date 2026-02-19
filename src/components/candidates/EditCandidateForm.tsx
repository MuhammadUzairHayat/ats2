"use client";
import { Candidate, Position, Status } from "@/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneNumberInput from "./add/PhoneNoInput";
import PositionsSelect from "./add/PositionsSelect";
import StatusesSelect from "./add/StatusesSelect";
import EditCVUploadInput from "./EditCVUploadInput";
import FormError from "../ui/FormError";
import { statusFlag } from "@/lib/utils/candidate-utils";
import { useCandidateForm } from "@/hooks/useCandidateForm";
import { FormField, TextInput, TextArea, FormSection } from "../ui/form";
import { FORM_STYLES } from "@/lib/constants/form-styles";
import { getDuplicateError } from "@/lib/utils/validation-utils";

interface EditCandidateFormProps {
  candidates: Candidate[];
  candidate: Candidate;
  positions: Position[];
  statuses: Status[];
}

const EditCandidateForm = ({
  candidates,
  candidate,
  positions,
  statuses,
}: EditCandidateFormProps) => {
  const router = useRouter();
  const { formData, updateField, updateExperience } = useCandidateForm(candidate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!isPhoneValid) {
      setFormError("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const submitData = new FormData(formElement);

      console.log(submitData)

      const response = await fetch(`/api/candidates/${candidate.id}/edit`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Failed to update candidate");
        return;
      }

      router.push("/candidates");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={FORM_STYLES.formContainer}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="candidateId" value={candidate.id} />

        {/*=== Form Header ===*/}
        <div className={FORM_STYLES.formHeader}>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Candidate Information
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Update the candidate details below
          </p>
        </div>

        {/*=== Form Fields ===*/}
        <div className={FORM_STYLES.formContent}>
          {formError && <FormError formError={formError} />}
          <div className={FORM_STYLES.gridTwoColumns}>
            {/*=== Personal Information ===*/}
            <FormSection title="Personal Details">
              <TextInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                type="text"
                placeholder="Enter full name"
                required
              />

              <TextInput
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                type="email"
                placeholder="candidate@email.com"
                required
                error={getDuplicateError(
                  "email",
                  formData.email,
                  candidates,
                  candidate.id
                )}
              />

              <PhoneNumberInput
                extractNumber={formData.phoneNumber}
                onValidationChange={setIsPhoneValid}
                onChangeHandler={(phone) => updateField("phoneNumber", phone)}
              />

              <TextInput
                label="LinkedIn Profile"
                name="linkedin"
                value={formData.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
                type="url"
                placeholder="https://linkedin.com/in/username"
                error={getDuplicateError(
                  "linkedin",
                  formData.linkedin ?? "",
                  candidates,
                  candidate.id
                )}
              />
            </FormSection>

            {/*=== Professional Information ===*/}
            <FormSection title="Professional Details">
              <PositionsSelect
                positions={positions}
                value={formData.position}
                onChangeHandler={(value) => updateField("position", value)}
              />

              {/* Experience */}
              <FormField label="Experience" htmlFor="experience-years">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="experience-years"
                    id="experience-years"
                    min="0"
                    value={formData.experience?.[0] ?? ""}
                    onChange={(e) =>
                      updateExperience(e.target.value, formData.experience?.[1] ?? "")
                    }
                    className={FORM_STYLES.input}
                    placeholder="Years"
                  />
                  <input
                    type="number"
                    name="experience-months"
                    id="experience-months"
                    min="0"
                    max="11"
                    value={formData.experience?.[1] ?? ""}
                    onChange={(e) =>
                      updateExperience(formData.experience?.[0] ?? "", e.target.value)
                    }
                    className={FORM_STYLES.input}
                    placeholder="Months"
                  />
                </div>
              </FormField>

              {/* Status */}
              <StatusesSelect
                value={formData.status}
                statuses={statuses}
                onChangeHandler={(value) => updateField("status", value)}
              />

              {/* Status Flag */}
              <FormField label="Status Flag" htmlFor="statusFlag">
                <select
                  title="Status Flag"
                  name="statusFlag"
                  id="statusFlag"
                  defaultValue={formData.statusFlag}
                  // value={formData.statusFlag}
                  onChange={(e) => updateField("statusFlag", e.target.value)}
                  className={`${FORM_STYLES.input} py-[14px]`}
                >
                  {statusFlag.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Notice Period */}
              <TextInput
                label="Notice Period"
                name="noticePeriod"
                min={0}
                value={formData.noticePeriod}
                onChange={(e) => updateField("noticePeriod", e.target.value)}
                type="number"
                placeholder="e.g., 2 days"
              />
            </FormSection>

            {/*=== Salary Information ===*/}
            <FormSection title="Salary Information" className="sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextInput
                  label="Current Salary"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={(e) => updateField("currentSalary", e.target.value)}
                  type="number"
                  placeholder="0.00"
                  min={0}
                />

                {/* Expected Salary */}
                <TextInput
                  label="Expected Salary"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={(e) => updateField("expectedSalary", e.target.value)}
                  type="number"
                  placeholder="0.00"
                  min={0}
                />
              </div>
            </FormSection>

            {/*=== CV Upload Section ===*/}
            <div className="space-y-6 sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Resume & Documents
              </h3>

              {/* Current CV Display */}
              {candidate.fileId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2.5">
                    Current CV
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {candidate.name}-resume.pdf
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to view current CV
                      </p>
                    </div>
                    <a
                      href={`https://drive.google.com/file/d/${candidate.fileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                    >
                      View CV
                    </a>
                  </div>
                </div>
              )}

              {/* CV Upload */}
              <EditCVUploadInput
                currentFileId={candidate.fileId}
                candidateName={candidate.name}
              />
            </div>

            {/*=== Additional Information ===*/}
            <FormSection title="Additional Information" className="sm:col-span-2">
              <TextInput
                label="Reference"
                name="reference"
                value={formData.reference}
                onChange={(e) => updateField("reference", e.target.value)}
                type="text"
                placeholder="Reference name or source"
                className="sm:col-span-2"
              />

              <TextArea
                label="Comments & Notes"
                name="comments"
                value={formData.comments}
                onChange={(e) => updateField("comments", e.target.value)}
                placeholder="Add any additional notes or comments about the candidate..."
                className="sm:col-span-2"
              />
            </FormSection>
          </div>
        </div>

        {/*=== Form Actions ===*/}
        <div className={FORM_STYLES.formActions}>
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
            <Link href="/candidates" className={FORM_STYLES.secondaryButton}>
              Cancel
            </Link>
            <button
              title={!isPhoneValid ? "Phone No is not Valid" : "Submit now"}
              type="submit"
              disabled={isSubmitting || !isPhoneValid}
              className={`${FORM_STYLES.primaryButton} ${
                !isPhoneValid || isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              {isSubmitting ? "Updating..." : "Update Candidate"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCandidateForm;
