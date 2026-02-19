import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addStatus, getStatuses } from "@/lib/google-sheet/statuses-sheet";
import { Status } from "@/types";

// Constants
const STATUS_NAME_MIN_LENGTH = 2;
const STATUS_NAME_MAX_LENGTH = 50;
const STATUS_NAME_REGEX = /^[a-zA-Z0-9\s\-()&]+$/;
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Utility functions
function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

// Validation functions
function validateStatusName(name: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!name?.trim()) {
    return { isValid: false, error: "Status name is required" };
  }

  const trimmed = name.trim();
  const length = trimmed.length;

  if (length < STATUS_NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Status name must be at least ${STATUS_NAME_MIN_LENGTH} characters long`,
    };
  }

  if (length > STATUS_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Status name must not exceed ${STATUS_NAME_MAX_LENGTH} characters`,
    };
  }

  if (!STATUS_NAME_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Status name can only contain letters, numbers, spaces, hyphens, parentheses, and ampersands",
    };
  }

  return { isValid: true, error: null };
}

function validateColor(color: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!color?.trim()) {
    return { isValid: false, error: "Status color is required" };
  }

  if (!HEX_COLOR_REGEX.test(color)) {
    return {
      isValid: false,
      error:
        "Invalid color format. Please use a valid hex color (e.g., #00aaff)",
    };
  }

  return { isValid: true, error: null };
}

// Optimized duplicate checking - single database fetch
function checkDuplicates(
  statuses: Status[],
  field: "name" | "color",
  value: string
): boolean {
  const normalizedValue = normalizeString(value);

  return statuses.some(
    (s) => normalizeString(s[field]) === normalizedValue && s.isDeleted === 0
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
    const color = (formData.get("color") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";

    // 3. Input validation (early returns)
    const nameValidation = validateStatusName(name);
    if (!nameValidation.isValid) {
      return createErrorResponse(nameValidation.error!);
    }

    const colorValidation = validateColor(color);
    if (!colorValidation.isValid) {
      return createErrorResponse(colorValidation.error!);
    }

    // 4. Fetch statuses once and perform all duplicate checks
    const statuses = await getStatuses();

    if (checkDuplicates(statuses, "name", name)) {
      return createErrorResponse("Status name already exists");
    }

    if (checkDuplicates(statuses, "color", color)) {
      return createErrorResponse(
        "Status color already exists. Please choose a different color"
      );
    }

    // 5. Create and save status
    const status = {
      name,
      color,
      description,
      isDeleted: 0,
    };

    await addStatus(status);

    // 6. Success response
    return NextResponse.json(
      { success: true, message: "Status added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error adding status:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to add status: ${error.message}`
        : "Failed to add status. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
