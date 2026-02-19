import React from "react";
import { FormField } from "./FormField";
import { FORM_STYLES } from "@/lib/constants/form-styles";

interface TextAreaProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

/**
 * Reusable textarea component with consistent styling
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 4,
  className = "",
}) => {
  return (
    <FormField
      label={label}
      htmlFor={name}
      required={required}
      error={error}
      className={className}
    >
      <textarea
        name={name}
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        className={`${FORM_STYLES.input} resize-vertical`}
        placeholder={placeholder}
      />
    </FormField>
  );
};