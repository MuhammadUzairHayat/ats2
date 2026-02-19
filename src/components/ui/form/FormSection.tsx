import React from "react";
import { FORM_STYLES } from "@/lib/constants/form-styles";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable form section component for organizing form fields
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className} mt-6`}>
      <div className={FORM_STYLES.sectionHeading}>
        {title}
      </div>
      {description && (
        <p className="text-gray-600 text-sm">{description}</p>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};