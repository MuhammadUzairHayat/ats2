import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getCandidates,
  updateCandidate,
} from "@/lib/google-sheet/candidates-sheet";
import {
  uploadResumeToDrive,
  deleteResumeFile,
} from "@/lib/google-sheet/resume-file";
import {
  isDuplicateEmail,
  isDuplicateLinkedIn,
  isDuplicatePhone,
  canUpdateStatusOrPosition,
} from "@/lib/utils/validation-utils";
import { candidateValidators } from "@/lib/utils/candidate-validation";
import { toStandardTitleCase } from "@/lib/utils/text-utils";
import { isHiringLimitReached } from "@/lib/utils/position-utils";
import { getPositions } from "@/lib/google-sheet/positions-sheet";
import { appendCandidateStatusHistory } from "@/lib/google-sheet/status-history-sheet";
import { getStatuses } from "@/lib/google-sheet/statuses-sheet";
import { Status } from "@/types";

// Constants
const HIRED_STATUS = "hired";
const SHORTLISTED_STATUS = "shortlisted";
const REJECTED_STATUS_FLAG = "2";
const REJECTED_STATUS_TEXT = "rejected";
const ACTIVE_STATUS_FLAG = "active";

// Utility functions
function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function isHiredStatus(status: string): boolean {
  return normalizeString(status) === HIRED_STATUS;
}

// Status order validation
function getStatusOrder(statusName: string, statuses: Status[]): number {
  const index = statuses.findIndex(
    (s) =>
      normalizeString(s.name) === normalizeString(statusName) &&
      s.isDeleted === 0
  );
  return index !== -1 ? index : -1;
}

function validateStatusProgression(
  oldStatus: string,
  newStatus: string,
  statuses: Status[]
): { isValid: boolean; error: string | null } {
  // Skip validation if status hasn't changed
  if (normalizeString(oldStatus) === normalizeString(newStatus)) {
    return { isValid: true, error: null };
  }

  const oldOrder = getStatusOrder(oldStatus, statuses);
  const newOrder = getStatusOrder(newStatus, statuses);

  // If either status is not found or doesn't have order
  if (oldOrder === -1 || newOrder === -1) {
    return { isValid: true, error: null }; // Allow if order system not defined
  }

  // Check if moving backward
  if (newOrder < oldOrder) {
    return {
      isValid: false,
      error: `Cannot move candidate backward from "${oldStatus}" to "${newStatus}". Status progression must move forward only.`,
    };
  }

  return { isValid: true, error: null };
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authentication check (early return)
    const session = await getServerSession(authOptions);
    if (!session) {
      return createErrorResponse("Unauthorized", 401);
    }

    const adminName = session.user?.name || "System";
    
    // Await params (Next.js 15 requirement)
    const params = await context.params;
    const candidateId = params.id;

    // 2. Extract form data
    const formData = await request.formData();

    // 3. Fetch candidates once and reuse
    const candidates = await getCandidates();
    const existingCandidate = candidates.find((c) => c.id === candidateId);

    if (!existingCandidate) {
      return createErrorResponse("Candidate not found", 404);
    }

    // 4. Extract and validate basic fields
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const linkedin = (formData.get("linkedin") as string)?.trim();
    const phoneNumber = (formData.get("phoneNumber") as string)?.trim();

    // 5. Field validation (early returns)
    const nameValidation = candidateValidators.name(name);
    if (!nameValidation.isValid) {
      return createErrorResponse(nameValidation.error!);
    }

    const emailValidation = candidateValidators.email(email);
    if (!emailValidation.isValid) {
      return createErrorResponse(emailValidation.error!);
    }

    const phoneValidation = candidateValidators.phone(phoneNumber);
    if (!phoneValidation.isValid) {
      return createErrorResponse(phoneValidation.error!);
    }

    const linkedinValidation = candidateValidators.linkedin(linkedin);
    if (!linkedinValidation.isValid) {
      return createErrorResponse(linkedinValidation.error!);
    }

    // 6. Duplicate checks using cached candidates
    if (isDuplicateEmail(email, candidates, candidateId)) {
      return createErrorResponse("Email already exists");
    }

    if (phoneNumber && isDuplicatePhone(phoneNumber, candidates, candidateId)) {
      return createErrorResponse("Phone number already exists");
    }

    if (linkedin && isDuplicateLinkedIn(linkedin, candidates, candidateId)) {
      return createErrorResponse("LinkedIn profile already exists");
    }

    // 7. Extract and normalize status/position data
    const newStatus = toStandardTitleCase((formData.get("status") as string)?.trim());
    const newPositionName = (formData.get("position") as string)?.trim();
    const newStatusFlag = (formData.get("statusFlag") as string)?.trim();
    
    const { status: oldStatus, position: oldPositionName } = existingCandidate;
    
    const normalizedNewStatus = normalizeString(newStatus);
    const normalizedNewStatusFlag = normalizeString(newStatusFlag);

    // 8. Fetch statuses and validate progression (early return)
    const statuses = await getStatuses();
    const statusProgressionValidation = validateStatusProgression(
      oldStatus,
      newStatus,
      statuses
    );

    if (!statusProgressionValidation.isValid) {
      return createErrorResponse(statusProgressionValidation.error!);
    }

    // 9. Status validation
    const isRejectedStatusFlag =
      newStatusFlag === REJECTED_STATUS_FLAG || 
      normalizedNewStatusFlag === REJECTED_STATUS_TEXT;
    
    const isShortlistedStatus = normalizedNewStatus === SHORTLISTED_STATUS;

    if (isRejectedStatusFlag && isShortlistedStatus) {
      return createErrorResponse("Cannot reject a shortlisted candidate");
    }

    const statusPositionError = canUpdateStatusOrPosition(
      existingCandidate,
      newStatus,
      newPositionName,
      newStatusFlag
    );

    if (statusPositionError) {
      return createErrorResponse(statusPositionError);
    }

    // 10. Hired status validation (conditional execution)
    const oldIsHired = isHiredStatus(oldStatus);
    const newIsHired = normalizedNewStatus === HIRED_STATUS;
    const needsHiringValidation = newIsHired && (!oldIsHired || oldPositionName !== newPositionName);

    if (needsHiringValidation) {
      const positions = await getPositions();
      const position = positions.find(
        (p) => p.name === newPositionName && p.isDeleted === 0
      );

      if (!position) {
        return createErrorResponse(`Position "${newPositionName}" not found`);
      }

      const otherCandidates = candidates.filter((c) => c.id !== candidateId);
      if (isHiringLimitReached(newPositionName, position.criteria, otherCandidates)) {
        return createErrorResponse("Hiring limit reached for this position");
      }
    }

    if (newIsHired && normalizedNewStatusFlag !== ACTIVE_STATUS_FLAG) {
      return createErrorResponse("Status flag must be 'Active' for hired candidates");
    }

    // 11. Experience validation
    const experienceYears = (formData.get("experience-years") as string) || "0";
    const experienceMonths = (formData.get("experience-months") as string) || "0";

    const experienceValidation = candidateValidators.experience(experienceYears, experienceMonths);
    if (!experienceValidation.isValid) {
      return createErrorResponse(experienceValidation.error!);
    }

    // 12. Salary and notice period validation
    const currentSalary = (formData.get("currentSalary") as string)?.trim();
    const expectedSalary = (formData.get("expectedSalary") as string)?.trim();
    const noticePeriod = (formData.get("noticePeriod") as string)?.trim();

    const currentSalaryValidation = candidateValidators.salary(currentSalary, "Current salary");
    if (!currentSalaryValidation.isValid) {
      return createErrorResponse(currentSalaryValidation.error!);
    }

    const expectedSalaryValidation = candidateValidators.salary(expectedSalary, "Expected salary");
    if (!expectedSalaryValidation.isValid) {
      return createErrorResponse(expectedSalaryValidation.error!);
    }

    const noticePeriodValidation = candidateValidators.noticePeriod(noticePeriod);
    if (!noticePeriodValidation.isValid) {
      return createErrorResponse(noticePeriodValidation.error!);
    }

    // 13. Handle file upload (conditional)
    let fileId = existingCandidate.fileId || "";
    const cvFile = formData.get("cvFile") as File;
    const hasNewFile = cvFile && cvFile.size > 0;

    if (hasNewFile) {
      // Delete old file if exists
      if (existingCandidate.fileId) {
        try {
          await deleteResumeFile(existingCandidate.fileId);
        } catch (err) {
          console.warn(`Failed to delete old file ${existingCandidate.fileId}:`, err);
        }
      }

      // Upload new file
      const uploadResult = await uploadResumeToDrive(formData, `${name}-resume.pdf`);
      fileId = uploadResult.id || "";
    }

    // 14. Build candidate object
    const candidate = {
      id: candidateId,
      name,
      position: newPositionName,
      experience: [experienceYears, experienceMonths],
      phoneNumber: phoneNumber.replace(/^\+/, ""),
      email,
      currentSalary,
      expectedSalary,
      noticePeriod,
      status: newStatus,
      statusFlag: newStatusFlag,
      linkedin,
      reference: (formData.get("reference") as string)?.trim() || "",
      comments: (formData.get("comments") as string)?.trim() || "",
      fileId,
      isDeleted: existingCandidate.isDeleted,
      entryDate: existingCandidate.entryDate,
      statusHistory: existingCandidate.statusHistory,
    };

    // 15. Update candidate
    await updateCandidate(candidate.id, candidate);

    // 16. Log status history (conditional)
    const statusChanged = normalizeString(oldStatus) !== normalizedNewStatus;

    if (statusChanged) {
      try {
        await appendCandidateStatusHistory(candidate.id, {
          oldStatus,
          newStatus,
          changedBy: adminName,
        });
      } catch (error) {
        console.error("Failed to log status history:", error);
      }
    }

    // 17. Success response
    return NextResponse.json(
      { success: true, message: "Candidate updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating candidate:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to update candidate: ${error.message}`
        : "Failed to update candidate. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
