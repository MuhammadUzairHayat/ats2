import { NextRequest, NextResponse } from "next/server";
import { getStatuses, updateStatus } from "@/lib/google-sheet/statuses-sheet";
import { bulkUpdateCandidatesStatus } from "@/lib/google-sheet/candidates-sheet";
import { getSession } from "@/lib/auth";
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

// Database check functions - optimized to reduce redundant filtering
function checkDuplicates(
  statuses: Status[],
  field: "name" | "color",
  value: string,
  excludeId: string
): boolean {
  const normalizedValue = normalizeString(value);

  return statuses.some(
    (s) =>
      s.id !== excludeId &&
      normalizeString(s[field]) === normalizedValue &&
      s.isDeleted === 0
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
    const userSession = await getSession();
    if (!userSession) {
      return createErrorResponse("Unauthorized", 401);
    }

    // 2. Await params (Next.js 15 requirement)
    const params = await context.params;
    const statusId = params.id;

    // 3. Extract and validate form data
    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim();
    const color = (formData.get("color") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";

    // 4. Input validation (early returns)
    const nameValidation = validateStatusName(name);
    if (!nameValidation.isValid) {
      return createErrorResponse(nameValidation.error!);
    }

    const colorValidation = validateColor(color);
    if (!colorValidation.isValid) {
      return createErrorResponse(colorValidation.error!);
    }

    // 5. Fetch statuses once and reuse
    const statuses = await getStatuses();
    const existingStatus = statuses.find((s) => s.id === statusId);

    if (!existingStatus) {
      return createErrorResponse("Status not found", 404);
    }

    // 6. Duplicate checks using optimized function
    if (checkDuplicates(statuses, "name", name, statusId)) {
      return createErrorResponse("Status name already exists");
    }

    if (checkDuplicates(statuses, "color", color, statusId)) {
      return createErrorResponse(
        "Status color already exists. Please choose a different color"
      );
    }

    // 7. Status order validation (only if name changed)
    const isNameChanged = name !== existingStatus.name;

    // 8. Update status
    const updatedStatus = {
      id: statusId,
      name,
      color,
      description,
      isDeleted: existingStatus.isDeleted,
    };

    await updateStatus(updatedStatus);

    // 9. Bulk update candidates (only if name changed)
    let updatedCandidates = 0;

    if (isNameChanged) {
      const adminName = userSession?.user?.name || "System";

      const result = await bulkUpdateCandidatesStatus(
        existingStatus.name,
        name,
        adminName
      );
      updatedCandidates = result.updated || 0;
    }

    // 10. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
        updatedCandidates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating status:", error);

    const errorMessage =
      error instanceof Error
        ? `Failed to update status: ${error.message}`
        : "Failed to update status. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
