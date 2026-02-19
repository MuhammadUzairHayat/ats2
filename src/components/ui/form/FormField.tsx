import React from "react";
import { FORM_STYLES } from "@/lib/constants/form-styles";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable form field component with consistent styling and error display
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={FORM_STYLES.label}>
        {label} {required && "*"}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};