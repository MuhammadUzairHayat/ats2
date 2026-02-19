import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  addCandidate,
  getCandidates,
} from "@/lib/google-sheet/candidates-sheet";
import { getPositions } from "@/lib/google-sheet/positions-sheet";
import { validateAllFields } from "@/lib/utils/candidate-validation";
import {
  isDuplicateEmail,
  isDuplicateLinkedIn,
  isDuplicatePhone,
} from "@/lib/utils/validation-utils";
import { isHiringLimitReached } from "@/lib/utils/position-utils";

// Constants
const REJECTED_STATUS_FLAG = "2";
const REJECTED_STATUS_TEXT = "rejected";
const SHORTLISTED_STATUS = "shortlisted";
const HIRED_STATUS = "hired";
const ACTIVE_STATUS_FLAG = "0";
const PHONE_MIN_LENGTH = 10;
const PHONE_MAX_LENGTH = 15;

interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  position: string;
  status: string;
  statusFlag: string;
  experienceYears: string;
  experienceMonths: string;
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  reference: string;
  comments: string;
  cvFile: File | null;
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function extractFormData(formData: FormData): CandidateFormData {
  return {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    linkedin: formData.get("linkedin") as string,
    position: formData.get("position") as string,
    status: formData.get("status") as string,
    statusFlag: formData.get("statusFlag") as string,
    experienceYears: formData.get("experience-years") as string,
    experienceMonths: formData.get("experience-months") as string,
    currentSalary: formData.get("current-salary") as string,
    expectedSalary: formData.get("expected-salary") as string,
    noticePeriod: formData.get("notice-period") as string,
    reference: formData.get("reference") as string,
    comments: formData.get("comments") as string,
    cvFile: formData.get("cvFile") as File | null,
  };
}

function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

function validatePhoneNumber(phone: string): { isValid: boolean; error: string | null } {
  if (!phone?.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove spaces, dashes, parentheses, and leading +
  const normalizedPhone = phone.replace(/[\s\-()]/g, "").replace(/^\+/, "");

  // Check if contains only digits
  if (!/^\d+$/.test(normalizedPhone)) {
    return { isValid: false, error: "Phone number must contain only digits" };
  }

  const length = normalizedPhone.length;

  if (length < PHONE_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Phone number must be at least ${PHONE_MIN_LENGTH} digits`,
    };
  }

  if (length > PHONE_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Phone number must not exceed ${PHONE_MAX_LENGTH} digits`,
    };
  }

  return { isValid: true, error: null };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check (early return)
    const session = await getServerSession(authOptions);
    if (!session) {
      return createErrorResponse("Unauthorized", 401);
    }

    // 2. Extract form data
    const formData = await request.formData();
    const data = extractFormData(formData);

    // 3. Phone validation (early return)
    const phoneValidation = validatePhoneNumber(data.phone);
    if (!phoneValidation.isValid) {
      return createErrorResponse(phoneValidation.error!);
    }

    // 4. Field validation (early return)
    const fieldValidation = validateAllFields({
      name: data.name,
      email: data.email,
      phone: data.phone,
      linkedin: data.linkedin,
      experienceYears: data.experienceYears,
      experienceMonths: data.experienceMonths,
      currentSalary: data.currentSalary,
      expectedSalary: data.expectedSalary,
      noticePeriod: data.noticePeriod,
      cvFile: data.cvFile,
    });

    if (!fieldValidation.isValid) {
      return createErrorResponse(fieldValidation.error!);
    }

    // 5. Fetch candidates once and reuse
    const allCandidates = await getCandidates();

    // 6. Duplicate checks using cached data
    if (isDuplicateEmail(data.email, allCandidates)) {
      return createErrorResponse("Email already exists");
    }

    if (data.phone && isDuplicatePhone(data.phone, allCandidates)) {
      return createErrorResponse("Phone number already exists");
    }

    if (data.linkedin && isDuplicateLinkedIn(data.linkedin, allCandidates)) {
      return createErrorResponse("LinkedIn profile already exists");
    }

    // 7. Status validation - normalized comparison
    const normalizedStatus = normalizeString(data.status);
    const normalizedStatusFlag = normalizeString(data.statusFlag);

    const isRejectedStatus =
      data.statusFlag === REJECTED_STATUS_FLAG ||
      normalizedStatusFlag === REJECTED_STATUS_TEXT;

    const isShortlistedStatus = normalizedStatus === SHORTLISTED_STATUS;

    if (isRejectedStatus && isShortlistedStatus) {
      return createErrorResponse("Cannot reject a shortlisted candidate");
    }

    // 8. Hired status validation (conditional execution)
    if (normalizedStatus === HIRED_STATUS) {
      const positions = await getPositions();

      const selectedPosition = positions.find(
        (p) => p.name === data.position && p.isDeleted === 0
      );

      if (!selectedPosition) {
        return createErrorResponse(`Position "${data.position}" not found`);
      }

      if (
        isHiringLimitReached(
          data.position,
          selectedPosition.criteria,
          allCandidates
        )
      ) {
        return createErrorResponse("Vacancies are full for this position");
      }

      if (data.statusFlag !== ACTIVE_STATUS_FLAG) {
        return createErrorResponse(
          "Status flag must be 'Active' for hired candidates"
        );
      }
    }

    // 9. Add candidate
    await addCandidate(formData);

    // 10. Success response
    return NextResponse.json(
      { success: true, message: "Candidate added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error adding candidate:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to add candidate: ${error.message}`
        : "Failed to add candidate. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
