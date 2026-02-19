import React from "react";
import { FormField } from "./FormField";
import { FORM_STYLES } from "@/lib/constants/form-styles";

interface TextInputProps {
  label: string;
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "url" | "number";
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * Reusable text input component with consistent styling
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  min,
  step,
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
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        className={FORM_STYLES.input}
        placeholder={placeholder}
      />
    </FormField>
  );
};