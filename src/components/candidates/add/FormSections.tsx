import {
  FormField,
  FormSection,
  TextArea,
  TextInput,
} from "@/components/ui/form";
import { FORM_STYLES } from "@/lib/constants/form-styles";
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { PdfDataProps } from "./AddCandidateForm";
import StatusesSelect from "./StatusesSelect";
import PositionsSelect from "./PositionsSelect";
import { Candidate, Position, Status } from "@/types";
import { statusFlag } from "@/lib/utils/candidate-utils";
import PhoneNumberInput from "./PhoneNoInput";
import { getDuplicateError } from "@/lib/utils/validation-utils";

interface FormActionsProps {
  isSubmitting: boolean;
}

interface AdditionalInformationSectionProps {
  formData: PdfDataProps;
  onFieldChange: <K extends keyof PdfDataProps>(
    field: K,
    value: PdfDataProps[K]
  ) => void;
}

interface ProfessionalInformationSectionProps {
  formData: PdfDataProps;
  positions: Position[];
  statuses: Status[];
  onFieldChange: <K extends keyof PdfDataProps>(
    field: K,
    value: PdfDataProps[K]
  ) => void;
}

interface PersonalInformationSectionProps {
  formData: PdfDataProps;
  candidates: Candidate[];
  onFieldChange: <K extends keyof PdfDataProps>(
    field: K,
    value: PdfDataProps[K]
  ) => void;
  onPhoneValidationChange: (isValid: boolean) => void;
}

export const FormHeader = () => (
  <div className={FORM_STYLES.formHeader}>
    <div className="flex items-center space-x-3">
      <h2 className="text-xl font-semibold text-gray-900">
        Candidate Information
      </h2>
    </div>
    <p className="text-gray-600 mt-1">
      Add a new candidate to your talent pipeline
    </p>
  </div>
);

export const FormActions = ({ isSubmitting }: FormActionsProps) => (
  <div className={FORM_STYLES.formActions}>
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
      <Link href="/candidates" className={FORM_STYLES.secondaryButton}>
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Cancel
      </Link>
      <button
        type="submit"
        className={`${FORM_STYLES.primaryButton} ${
          isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        disabled={isSubmitting}
      >
        <PlusCircleIcon className="w-5 h-5" />
        {isSubmitting ? "Adding..." : "Add Candidate"}
      </button>
    </div>
  </div>
);

export const AdditionalInformationSection = ({
  formData,
  onFieldChange,
}: AdditionalInformationSectionProps) => (
  <FormSection title="Additional Information" className="sm:col-span-2">
    <div className="grid grid-cols-1 gap-6">
      <TextInput
        label="Reference"
        name="reference"
        type="text"
        placeholder="Reference name or source"
        value={formData.reference}
        onChange={(e) => onFieldChange("reference", e.target.value)}
      />

      <TextArea
        label="Comments & Notes"
        name="comments"
        value={formData.comments}
        onChange={(e) => onFieldChange("comments", e.target.value)}
        placeholder="Add any additional notes or comments about the candidate..."
        rows={4}
      />
    </div>
  </FormSection>
);

export const ProfessionalInformationSection = ({
  formData,
  positions,
  statuses,
  onFieldChange,
}: ProfessionalInformationSectionProps) => (
  <FormSection title="Professional Information">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PositionsSelect
        positions={positions}
        value={formData.position}
        onChangeHandler={(value) => onFieldChange("position", value)}
      />

      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-2.5">
          <label className={FORM_STYLES.label}>Experience</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            id="experience-years"
            name="experience-years"
            type="number"
            min="0"
            value={formData.experience[0]}
            onChange={(e) =>
              onFieldChange("experience", [
                e.target.value,
                formData.experience[1],
              ])
            }
            className={FORM_STYLES.input}
            placeholder="Years"
          />
          <input
            id="experience-months"
            name="experience-months"
            type="number"
            min="0"
            max="11"
            value={formData.experience[1]}
            onChange={(e) =>
              onFieldChange("experience", [
                formData.experience[0],
                e.target.value,
              ])
            }
            className={FORM_STYLES.input}
            placeholder="Months"
          />
        </div>
      </div>

      <StatusesSelect
        value={formData.status}
        statuses={statuses}
        onChangeHandler={(value) => onFieldChange("status", value)}
      />

      <FormField label="Status Flag" htmlFor="statusFlag">
        <select
          title="Status Flag"
          name="statusFlag"
          id="statusFlag"
          value={formData.statusFlag.toString()}
          onChange={(e) =>
            onFieldChange("statusFlag", parseInt(e.target.value))
          }
          className={FORM_STYLES.input}
        >
          {statusFlag.map((status, index) => {
            if (status.toLowerCase() === "rejected") return;
            return (
              <option key={index} value={index.toString()}>
                {status}
              </option>
            );
          })}
        </select>
      </FormField>

      <TextInput
        label="Current Salary"
        name="current-salary"
        type="number"
        placeholder="PKR 0.00"
        value={formData.currentSalary}
        onChange={(e) => onFieldChange("currentSalary", e.target.value)}
        min={0}
      />

      <TextInput
        label="Expected Salary"
        name="expected-salary"
        type="number"
        placeholder="PKR 0.00"
        value={formData.expectedSalary}
        onChange={(e) => onFieldChange("expectedSalary", e.target.value)}
        min={0}
      />

      <TextInput
        label="Notice Period"
        name="notice-period"
        type="number"
        min={0}
        placeholder="e.g., 2 days"
        value={formData.noticePeriod}
        onChange={(e) => onFieldChange("noticePeriod", e.target.value)}
        className="sm:col-span-2"
      />
    </div>
  </FormSection>
);

export const PersonalInformationSection = ({
  formData,
  candidates,
  onFieldChange,
  onPhoneValidationChange,
}: PersonalInformationSectionProps) => (
  <FormSection title="Personal Information">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label htmlFor="name" className={FORM_STYLES.label}>
            Full Name *
          </label>
        </div>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          required
          className={FORM_STYLES.input}
          placeholder="Enter full name"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label htmlFor="email" className={FORM_STYLES.label}>
            Email Address *
          </label>
        </div>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          required
          className={FORM_STYLES.input}
          placeholder="candidate@email.com"
        />
        <p className="text-red-500 text-sm mt-2">
          {getDuplicateError("email", formData.email, candidates)}
        </p>
      </div>

      <PhoneNumberInput
        extractNumber={formData.phone}
        onValidationChange={onPhoneValidationChange}
        onChangeHandler={(value) => onFieldChange("phone", value)}
      />

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label htmlFor="linkedin" className={FORM_STYLES.label}>
            LinkedIn Profile
          </label>
        </div>
        <input
          type="url"
          name="linkedin"
          id="linkedin"
          value={formData.linkedIn}
          onChange={(e) => onFieldChange("linkedIn", e.target.value)}
          className={FORM_STYLES.input}
          placeholder="https://linkedin.com/in/username"
        />
        <p className="text-red-500 text-sm mt-2">
          {getDuplicateError("linkedin", formData.linkedIn, candidates)}
        </p>
      </div>
    </div>
  </FormSection>
);
