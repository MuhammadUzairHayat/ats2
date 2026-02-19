import { useState } from "react";
import { Candidate } from "@/types";

/**
 * Custom hook for managing candidate form state
 * @param candidate - The candidate object (for edit forms)
 * @returns Form state and handlers
 */
export const useCandidateForm = (candidate?: Candidate) => {
  const [formData, setFormData] = useState<Candidate>(() => ({
    id: candidate?.id || "",
    name: candidate?.name || "",
    position: candidate?.position || "",
    experience: candidate?.experience || ["", ""],
    phoneNumber: candidate?.phoneNumber || "",
    email: candidate?.email || "",
    currentSalary: candidate?.currentSalary || "",
    expectedSalary: candidate?.expectedSalary || "",
    noticePeriod: candidate?.noticePeriod || "",
    status: candidate?.status || "",
    statusFlag: candidate?.statusFlag || "",
    linkedin: candidate?.linkedin || "",
    reference: candidate?.reference || "",
    comments: candidate?.comments || "",
    fileId: candidate?.fileId || "",
    isDeleted: candidate?.isDeleted || 0,
  }));

  const updateField = <K extends keyof Candidate>(
    field: K,
    value: Candidate[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateExperience = (years: string, months: string) => {
    setFormData(prev => ({
      ...prev,
      experience: [years, months]
    }));
  };

  const resetForm = () => {
    if (candidate) {
      setFormData({
        id: candidate.id,
        name: candidate.name,
        position: candidate.position,
        experience: candidate.experience,
        phoneNumber: candidate.phoneNumber,
        email: candidate.email,
        currentSalary: candidate.currentSalary,
        expectedSalary: candidate.expectedSalary,
        noticePeriod: candidate.noticePeriod,
        status: candidate.status,
        statusFlag: candidate.statusFlag,
        linkedin: candidate.linkedin,
        reference: candidate.reference,
        comments: candidate.comments,
        fileId: candidate.fileId,
        isDeleted: candidate.isDeleted,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        position: "",
        experience: ["", ""],
        phoneNumber: "",
        email: "",
        currentSalary: "",
        expectedSalary: "",
        noticePeriod: "",
        status: "",
        statusFlag: "",
        linkedin: "",
        reference: "",
        comments: "",
        fileId: "",
        isDeleted: 0,
      });
    }
  };

  return {
    formData,
    setFormData,
    updateField,
    updateExperience,
    resetForm,
  };
};