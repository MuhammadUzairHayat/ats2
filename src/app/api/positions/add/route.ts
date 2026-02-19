import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addPosition, getPositions } from "@/lib/google-sheet/positions-sheet";
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
    return { isValid: false, error: "Department is required" };
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
    return {
      isValid: false,
      error: "Maximum candidates must be a positive number",
    };
  }

  if (criteria > MAX_CRITERIA) {
    return {
      isValid: false,
      error: `Maximum candidates cannot exceed ${MAX_CRITERIA}`,
    };
  }

  return { isValid: true, error: null, value: criteria };
}

function checkDuplicatePosition(
  positions: Position[],
  positionName: string
): boolean {
  const normalizedName = normalizeString(positionName);

  return positions.some(
    (p) => normalizeString(p.name) === normalizedName && p.isDeleted === 0
  );
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check (early return)
    const session = await getServerSession(authOptions);
    if (!session) {
      return createErrorResponse("Unauthorized", 401);
    }

    // 2. Extract and validate form data
    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim();
    const department = (formData.get("department") as string)?.trim();
    const description = ((formData.get("description") as string) || "").trim();
    const criteriaValue = formData.get("criteria") as string | null;

    // 3. Input validation (early returns)
    const nameValidation = validatePositionName(name);
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

    // 4. Fetch positions once and perform duplicate check
    const positions = await getPositions();

    if (checkDuplicatePosition(positions, name)) {
      return createErrorResponse("Position name already exists");
    }

    // 5. Create and save position
    const position = {
      name,
      department,
      description,
      criteria: criteriaValidation.value,
      isDeleted: 0,
    };

    await addPosition(position);

    // 6. Success response
    return NextResponse.json(
      { success: true, message: "Position added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error adding position:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to add position: ${error.message}`
        : "Failed to add position. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
