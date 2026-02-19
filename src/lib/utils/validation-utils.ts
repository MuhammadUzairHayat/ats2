import { Candidate } from "@/types";

/**
 * Validation utility functions for candidate data
 */

/**
 * Checks if an email already exists in the candidates list (excluding current candidate)
 * @param email - Email to check
 * @param candidates - List of all candidates
 * @param excludeId - ID of candidate to exclude from check (for updates)
 * @returns Boolean indicating if email is duplicate
 */
export const isDuplicateEmail = (
  email: string,
  candidates: Candidate[],
  excludeId?: string
): boolean => {
  if (!email) return false;
  return candidates.some(
    (c) => c.id !== excludeId && c.email.toLowerCase() === email.toLowerCase()
  );
};

/**
 * Checks if a LinkedIn URL already exists in the candidates list (excluding current candidate)
 * @param linkedin - LinkedIn URL to check
 * @param candidates - List of all candidates
 * @param excludeId - ID of candidate to exclude from check (for updates)
 * @returns Boolean indicating if LinkedIn is duplicate
 */
export const isDuplicateLinkedIn = (
  linkedin: string,
  candidates: Candidate[],
  excludeId?: string
): boolean => {
  if (!linkedin) return false;
  const target = linkedin.toLowerCase();
  return candidates.some(
    (c) =>
      c.id !== excludeId && (c.linkedin ?? "").toLowerCase() === target
  );
};

/**
 * Checks if a phone number already exists in the candidates list (excluding current candidate)
 * @param phone - Phone number to check
 * @param candidates - List of all candidates
 * @param excludeId - ID of candidate to exclude from check (for updates)
 * @returns Boolean indicating if phone number is duplicate
 */
export function isDuplicatePhone(
  phone: string,
  candidates: Candidate[],
  excludeId?: string
): boolean {
  if (!phone) return false;

  // Normalize phone number (remove spaces, dashes, parentheses, and leading +)
  const normalizePhone = (p: string) =>
    p.replace(/[\s\-()]/g, "").replace(/^\+/, "");

  const normalizedPhone = normalizePhone(phone);

  return candidates.some((c) => {
    if (excludeId && c.id === excludeId) return false;
    if (!c.phoneNumber) return false;

    return (
      normalizePhone(c.phoneNumber) === normalizedPhone && c.isDeleted === 0
    );
  });
}

/**
 * Checks if status or position change is allowed for a rejected candidate
 * @param candidate - The candidate to check
 * @param newStatus - New status from form
 * @param newPosition - New position from form
 * @returns Error message if change not allowed, empty string if allowed
 */
export const canUpdateStatusOrPosition = (
  candidate: Candidate,
  newStatus?: string,
  newPosition?: string,
  newStatusFlag?: string
): string => {
  const isRejected =
    (candidate.statusFlag === "rejected" && newStatusFlag === "rejected") ||
    (candidate.statusFlag === "2" && newStatusFlag === "2");

  if (!isRejected) {
    return ""; // Not rejected, allow all changes
  }

  // Check if status is being changed
  const isStatusChanged =
    newStatus &&
    newStatus.toLowerCase().trim() !== candidate.status.toLowerCase().trim();

  // Check if position is being changed
  const isPositionChanged =
    newPosition && newPosition.trim() !== candidate.position.trim();

  if (isStatusChanged && isPositionChanged) {
    return "Cannot update status and position for rejected candidates";
  }

  if (isStatusChanged) {
    return "Cannot update status for rejected candidates";
  }

  if (isPositionChanged) {
    return "Cannot update position for rejected candidates";
  }

  return "";
};

export const getDuplicateError = (
  field: "email" | "linkedin",
  value: string,
  candidates: Candidate[],
  excludeId?: string
): string => {
  if (field === "email" && isDuplicateEmail(value, candidates, excludeId)) {
    return "Email already exists";
  }
  if (
    field === "linkedin" &&
    isDuplicateLinkedIn(value, candidates, excludeId)
  ) {
    return "LinkedIn already exists";
  }
  return "";
};
