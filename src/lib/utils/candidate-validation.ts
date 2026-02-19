export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const candidateValidators = {
  name: (name: string): ValidationResult => {
    if (!name?.trim()) {
      return { isValid: false, error: "Name is required" };
    }

    const trimmed = name.trim();
    if (trimmed.length < 3) {
      return { isValid: false, error: "Name must be at least 3 characters long" };
    }

    if (trimmed.length > 100) {
      return { isValid: false, error: "Name must not exceed 100 characters" };
    }

    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!nameRegex.test(trimmed)) {
      return { isValid: false, error: "Name contain invalid characters" };
    }

    return { isValid: true, error: null };
  },

  email: (email: string): ValidationResult => {
    if (!email?.trim()) {
      return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    if (email.length > 255) {
      return { isValid: false, error: "Email must not exceed 255 characters" };
    }

    return { isValid: true, error: null };
  },

  phone: (phone: string): ValidationResult => {
    if (!phone?.trim()) {
      return { isValid: true, error: null };
    }

    const digitsOnly = phone.replace(/\D/g, '');

        if (digitsOnly.length > 0 && digitsOnly.length < 10) {
          return { isValid: false, error: "Phone number is not Valid" };
        }

        if (digitsOnly.length > 15) {
          return { isValid: false, error: "Phone number is not valid, exceed 15 digits" };
    }

    return { isValid: true, error: null };
  },

  linkedin: (linkedin: string): ValidationResult => {
    if (!linkedin?.trim()) {
      return { isValid: true, error: null };
    }

    try {
      const url = new URL(linkedin.trim());
      const validDomains = ['linkedin.com', 'www.linkedin.com', 'in.linkedin.com', 'uk.linkedin.com'];

      if (!validDomains.some(domain => url.hostname === domain)) {
        return { isValid: false, error: "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)" };
      }

      if (!url.pathname.includes('/in/')) {
        return { isValid: false, error: "LinkedIn URL must be a profile link (containing '/in/')" };
      }

      return { isValid: true, error: null };
    } catch {
      return { isValid: false, error: "Please enter a valid LinkedIn URL" };
    }
  },

  experience: (years: string, months: string): ValidationResult => {
    const yearsNum = parseInt(years || "0");
    const monthsNum = parseInt(months || "0");

    if (isNaN(yearsNum) || yearsNum < 0) {
      return { isValid: false, error: "Experience years must be a positive number" };
    }

    if (yearsNum > 50) {
      return { isValid: false, error: "Experience years cannot exceed 50" };
    }

    if (isNaN(monthsNum) || monthsNum < 0 || monthsNum > 11) {
      return { isValid: false, error: "Experience months must be between 0 and 11" };
    }

    return { isValid: true, error: null };
  },

  salary: (salary: string, fieldName: string): ValidationResult => {
    if (!salary?.trim()) {
      return { isValid: true, error: null };
    }

    const salaryNum = parseFloat(salary);

    if (isNaN(salaryNum) || salaryNum < 0) {
      return { isValid: false, error: `${fieldName} must be a positive number` };
    }

    if (salaryNum > 100000000) {
      return { isValid: false, error: `${fieldName} seems unrealistic` };
    }

    return { isValid: true, error: null };
  },

  noticePeriod: (noticePeriod: string): ValidationResult => {
    if (!noticePeriod?.trim()) {
      return { isValid: true, error: null };
    }

    const days = parseInt(noticePeriod);

    if (isNaN(days) || days < 0) {
      return { isValid: false, error: "Notice period must be a positive number" };
    }

    if (days > 365) {
      return { isValid: false, error: "Notice period cannot exceed 365 days" };
    }

    return { isValid: true, error: null };
  },

  cvFile: (file: File | null): ValidationResult => {
    if (!file) {
      return { isValid: false, error: "CV file is required" };
    }

    if (file.type !== "application/pdf") {
      return { isValid: false, error: "CV must be a PDF file" };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: "CV file size must not exceed 10MB" };
    }

    if (file.size < 1024) {
      return { isValid: false, error: "CV file appears to be empty or corrupted" };
    }

    return { isValid: true, error: null };
  }
};

export function validateAllFields(data: {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  experienceYears: string;
  experienceMonths: string;
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  cvFile: File | null;
}): ValidationResult {
  const validations = [
    candidateValidators.cvFile(data.cvFile),
    candidateValidators.name(data.name),
    candidateValidators.email(data.email),
    candidateValidators.phone(data.phone),
    candidateValidators.linkedin(data.linkedin),
    candidateValidators.experience(data.experienceYears, data.experienceMonths),
    candidateValidators.salary(data.currentSalary, "Current salary"),
    candidateValidators.salary(data.expectedSalary, "Expected salary"),
    candidateValidators.noticePeriod(data.noticePeriod),
  ];

  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true, error: null };
}