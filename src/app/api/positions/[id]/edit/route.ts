import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getPositions,
  updatePosition,
} from "@/lib/google-sheet/positions-sheet";
import {
  getCandidates,
  bulkUpdateCandidatesPosition,
} from "@/lib/google-sheet/candidates-sheet";
import { getHiredCountForPosition } from "@/lib/utils/position-utils";
import { Position } from "@/types";

// Constants
const POSITION_NAME_MIN_LENGTH = 3;
const POSITION_NAME_MAX_LENGTH = 100;
const DEPARTMENT_MIN_LENGTH = 2;
const DEPARTMENT_MAX_LENGTH = 50;
const MAX_CRITERIA = 1000;
const POSITION_NAME_REGEX = /^[a-zA-Z0-9\s\-().&]+$/;
const DEPARTMENT_REGEX = /^[a-zA-Z\s\-&]+$/;

// Utility functions
function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

// Validation functions
function validatePositionName(name: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!name?.trim()) {
    return { isValid: false, error: "Position name is required" };
  }

  const trimmed = name.trim();
  const length = trimmed.length;

  if (length < POSITION_NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Position name must be at least ${POSITION_NAME_MIN_LENGTH} characters long`,
    };
  }

  if (length > POSITION_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Position name must not exceed ${POSITION_NAME_MAX_LENGTH} characters`,
    };
  }

  if (!POSITION_NAME_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Position name can only contain letters, numbers, spaces, hyphens, parentheses, periods, and ampersands",
    };
  }

  return { isValid: true, error: null };
}

function validateDepartment(department: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!department?.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = department.trim();
  const length = trimmed.length;

  if (length < DEPARTMENT_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Department name must be at least ${DEPARTMENT_MIN_LENGTH} characters long`,
    };
  }

  if (length > DEPARTMENT_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Department name must not exceed ${DEPARTMENT_MAX_LENGTH} characters`,
    };
  }

  if (!DEPARTMENT_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Department name can only contain letters, spaces, hyphens, and ampersands",
    };
  }

  return { isValid: true, error: null };
}

function validateCriteria(criteriaValue: string | null): {
  isValid: boolean;
  error: string | null;
  value?: number;
} {
  if (!criteriaValue) {
    return { isValid: true, error: null };
  }

  const criteria = parseInt(criteriaValue);

  if (isNaN(criteria) || criteria < 1) {
    return { isValid: false, error: "Vacancies must be a positive number" };
  }

  if (criteria > MAX_CRITERIA) {
    return { isValid: false, error: `Vacancies cannot exceed ${MAX_CRITERIA}` };
  }

  return { isValid: true, error: null, value: criteria };
}

function checkDuplicatePosition(
  positions: Position[],
  positionName: string,
  excludeId: string
): boolean {
  const normalizedName = normalizeString(positionName);

  return positions.some(
    (p) =>
      p.id !== excludeId &&
      normalizeString(p.name) === normalizedName &&
      p.isDeleted === 0
  );
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

    // 2. Await params (Next.js 15 requirement)
    const params = await context.params;
    const positionId = params.id;

    // 3. Extract and validate form data
    const formData = await request.formData();

    const newName = (formData.get("name") as string)?.trim();
    const department = (formData.get("department") as string)?.trim();
    const description = ((formData.get("description") as string) || "").trim();
    const criteriaValue = formData.get("criteria") as string | null;

    // 4. Input validation (early returns)
    const nameValidation = validatePositionName(newName);
    if (!nameValidation.isValid) {
      return createErrorResponse(nameValidation.error!);
    }

    const departmentValidation = validateDepartment(department);
    if (!departmentValidation.isValid) {
      return createErrorResponse(departmentValidation.error!);
    }

    const criteriaValidation = validateCriteria(criteriaValue);
    if (!criteriaValidation.isValid) {
      return createErrorResponse(criteriaValidation.error!);
    }

    // 5. Fetch positions once and reuse
    const positions = await getPositions();
    const existingPosition = positions.find((p) => p.id === positionId);

    if (!existingPosition) {
      return createErrorResponse("Position not found", 404);
    }

    // 6. Duplicate check using cached positions
    if (checkDuplicatePosition(positions, newName, positionId)) {
      return createErrorResponse("Position name already exists");
    }

    // 7. Validate criteria against hired count (only if criteria changed)
    const newCriteria = criteriaValidation.value;

    if (newCriteria !== undefined && newCriteria !== null) {
      const candidates = await getCandidates();
      const positionNameToCheck =
        newName !== existingPosition.name ? existingPosition.name : newName;
      const hiredCount = getHiredCountForPosition(
        positionNameToCheck,
        candidates
      );

      if (newCriteria < hiredCount) {
        return createErrorResponse(
          `Cannot set vacancies to ${newCriteria}. Currently ${hiredCount} candidate${
            hiredCount === 1 ? " is" : "s are"
          } already hired for this position. Please set vacancies to at least ${hiredCount} or higher.`
        );
      }
    }

    // 8. Update position
    const updatedPosition = {
      id: positionId,
      name: newName,
      description,
      department,
      criteria: newCriteria,
      isDeleted: existingPosition.isDeleted,
    };

    await updatePosition(updatedPosition);

    // 9. Bulk update candidates (only if name changed)
    let updatedCandidates = 0;
    const isNameChanged = newName !== existingPosition.name;

    if (isNameChanged) {
      const result = await bulkUpdateCandidatesPosition(
        existingPosition.name,
        newName
      );
      updatedCandidates = result.updated || 0;
    }

    // 10. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Position updated successfully",
        updatedCandidates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating position:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to update position: ${error.message}`
        : "Failed to update position. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
