"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CVDataValidation } from "@/types";

interface CVValidationContextType {
  validationChecks: CVDataValidation;
  setValidationChecks: (checks: CVDataValidation) => void;
  toggleValidation: (field: keyof CVDataValidation) => void;
}

const CVValidationContext = createContext<CVValidationContextType | undefined>(
  undefined
);

export function CVValidationProvider({ children }: { children: ReactNode }) {
  const [validationChecks, setValidationChecks] = useState<CVDataValidation>({
    name: true,
    email: true,
    phone: true,
    linkedIn: true,
    experience: true,
  });

  const toggleValidation = (field: keyof CVDataValidation) => {
    setValidationChecks((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <CVValidationContext.Provider
      value={{
        validationChecks,
        setValidationChecks,
        toggleValidation,
      }}
    >
      {children}
    </CVValidationContext.Provider>
  );
}

export const useValidation = () => {
  const context = useContext(CVValidationContext);
  if (!context) {
    throw new Error("useValidation must be used within a CVValidationProvider");
  }
  return context;
};
