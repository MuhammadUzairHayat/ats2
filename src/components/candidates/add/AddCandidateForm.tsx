"use client";
import { Candidate, Position, Status } from "@/types";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadCVInput from "./UploadCVInput";
import FormError from "@/components/ui/FormError";
import { CVValidationProvider } from "./ValidationContext";
import { FormSection } from "@/components/ui/form";
import { FORM_STYLES } from "@/lib/constants/form-styles";
import {
  AdditionalInformationSection,
  FormActions,
  FormHeader,
  PersonalInformationSection,
  ProfessionalInformationSection,
} from "./FormSections";

interface AddCandidateFormProps {
  candidates: Candidate[];
  positions: Position[];
  statuses: Status[];
}

export interface PdfDataProps {
  name: string;
  email: string;
  phone: string;
  linkedIn: string;
  experience: string[];
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  reference: string;
  comments: string;
  position?: string;
  status?: string;
  statusFlag: number;
  cvFile?: File | null;
}

export interface extractedDataProps {
  name: string;
  email: string;
  phone: string;
  linkedIn: string;
  cvFile?: File | null;
}

const INITIAL_FORM_DATA: PdfDataProps = {
  name: "",
  email: "",
  phone: "",
  linkedIn: "",
  experience: ["", ""],
  currentSalary: "",
  expectedSalary: "",
  noticePeriod: "",
  reference: "",
  comments: "",
  position: "",
  status: "",
  statusFlag: 0,
  cvFile: null,
};

const INITIAL_EXTRACTED_DATA: extractedDataProps = {
  name: "",
  email: "",
  phone: "",
  linkedIn: "",
  cvFile: null,
};

const AddCandidateForm = ({
  positions,
  statuses,
  candidates,
}: AddCandidateFormProps) => {
  return (
    <CVValidationProvider>
      <AddCandidateFormContent
        positions={positions}
        statuses={statuses}
        candidates={candidates}
      />
    </CVValidationProvider>
  );
};

const AddCandidateFormContent = ({
  positions,
  statuses,
  candidates,
}: AddCandidateFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState<PdfDataProps>(INITIAL_FORM_DATA);
  const [extractedData, setExtractedData] = useState<extractedDataProps>(
    INITIAL_EXTRACTED_DATA
  );
  const [uploadedCVFile, setUploadedCVFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isExtract, setIsExtract] = useState<boolean>(true)

  useEffect(() => {
    if (!extractedData.name && !extractedData.email && !extractedData.cvFile) {
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev };

      if (extractedData.cvFile) {
        updated.cvFile = extractedData.cvFile;
        setUploadedCVFile(extractedData.cvFile);
      }

      // Only process extracted data if CV validation checkbox is checked
      if (isExtract) {
        (Object.keys(extractedData) as (keyof extractedDataProps)[]).forEach(
          (field) => {
            const extractedValue = extractedData[field];

            if (
              extractedValue &&
              typeof extractedValue === "string" &&
              extractedValue.trim()
            ) {
              if (
                field === "name" ||
                field === "email" ||
                field === "phone" ||
                field === "linkedIn"
              ) {
                updated[field] = extractedValue;
              }
            }
          }
        );
      }

      return updated;
    });
  }, [extractedData, isExtract]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!isPhoneValid) {
      setFormError("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("linkedin", formData.linkedIn);
      submitData.append("position", formData.position || "");
      submitData.append("status", formData.status || "");
      submitData.append("statusFlag", formData.statusFlag.toString());
      submitData.append("experience-years", formData.experience[0] || "0");
      submitData.append("experience-months", formData.experience[1] || "0");
      submitData.append("current-salary", formData.currentSalary);
      submitData.append("expected-salary", formData.expectedSalary);
      submitData.append("notice-period", formData.noticePeriod);
      submitData.append("reference", formData.reference);
      submitData.append("comments", formData.comments);

      if (uploadedCVFile) {
        submitData.append("cvFile", uploadedCVFile);
      }

      const response = await fetch("/api/candidates/add", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Failed to add candidate");
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

  const updateFormField = <K extends keyof PdfDataProps>(
    field: K,
    value: PdfDataProps[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={FORM_STYLES.formContainer}>
      <form onSubmit={handleSubmit}>
        <FormHeader />

        <div className={FORM_STYLES.formContent}>
          {formError && <FormError formError={formError} />}

          <PersonalInformationSection
            formData={formData}
            candidates={candidates}
            onFieldChange={updateFormField}
            onPhoneValidationChange={setIsPhoneValid}
          />

          <FormSection title="Documents & Resume" className="sm:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <UploadCVInput setFormData={setExtractedData} isExtract={isExtract} setIsExtract={setIsExtract} />
            </div>
          </FormSection>

          <ProfessionalInformationSection
            formData={formData}
            positions={positions}
            statuses={statuses}
            onFieldChange={updateFormField}
          />

          <AdditionalInformationSection
            formData={formData}
            onFieldChange={updateFormField}
          />
        </div>

        <FormActions isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default AddCandidateForm;
