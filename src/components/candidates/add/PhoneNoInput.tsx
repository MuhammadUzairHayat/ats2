"use client";

import { useState, useEffect, useCallback } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

interface PhoneNumberInputProps {
  extractNumber?: string;
  validationChecked?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  onChangeHandler?: (phone: string) => void;
}

export default function PhoneNumberInput({
  extractNumber,
  validationChecked = true,
  onValidationChange,
  onChangeHandler,
}: PhoneNumberInputProps) {
  const [phone, setPhone] = useState<string>(extractNumber || "");
  const [error, setError] = useState<string>("");

  /* _______________________________________
     Check if phone has actual digits beyond country code
     _________________________________________
  */
  const hasActualNumber = useCallback((phoneValue: string): boolean => {
    // Remove all non-digit characters except +
    const digitsOnly = phoneValue.replace(/[^\d+]/g, "");
    // Check if there are digits beyond the country code (e.g., +92)
    // Country codes are typically 1-3 digits
    return digitsOnly.length > 4; // +92 (3 chars) + at least 1 digit
  }, []);

  /* _______________________________________
     Validate phone number
     _________________________________________
  */
  const validatePhone = useCallback(
    (phoneValue: string): { isValid: boolean; errorMsg: string } => {
      if (!phoneValue || phoneValue.trim() === "") {
        return { isValid: false, errorMsg: "Phone number is required" };
      }

      if (!hasActualNumber(phoneValue)) {
        return { isValid: false, errorMsg: "Please enter a complete phone number" };
      }

      const isValidFormat = matchIsValidTel(phoneValue);
      if (!isValidFormat) {
        return { isValid: false, errorMsg: "Invalid phone number format" };
      }

      return { isValid: true, errorMsg: "" };
    },
    [hasActualNumber]
  );

  useEffect(() => {
    if (extractNumber) {
      const { isValid, errorMsg } = validatePhone(extractNumber);
      setPhone(extractNumber);
      setError(errorMsg);
      onValidationChange?.(isValid);
    }
  }, [extractNumber, validatePhone, onValidationChange]);

  const handleChange = useCallback(
    (newPhone: string) => {
      const { isValid, errorMsg } = validatePhone(newPhone);
      setPhone(newPhone);
      setError(errorMsg);
      onValidationChange?.(isValid);
      onChangeHandler?.(newPhone);
    },
    [validatePhone, onValidationChange, onChangeHandler]
  );

  return (
    <div className="sm:col-span-3 flex flex-col gap-3 w-full text-sm font-medium text-gray-700">
      <div className="flex items-center justify-between">
        <span>Phone Number *</span>
      </div>
      <MuiTelInput
        name="phoneNumber"
        id="phoneNumber"
        value={validationChecked ? phone : ""}
        onChange={handleChange}
        defaultCountry="PK"
        fullWidth
        error={Boolean(error)}
        helperText={error || ""}
        required
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "0.75rem",
            height: "50px",
          },
          "& input": {
            padding: "14px 16px",
          },
        }}
      />
      {/* ✅ Hidden validation input - blocks form submission when phone is invalid */}
      {error && (
        <input
          type="text"
          required
          value=""
          onChange={() => {}}
          style={{
            position: "absolute",
            opacity: 0,
            height: 0,
            width: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  );
}
