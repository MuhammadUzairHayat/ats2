"use client";
import { Position } from "@/types";
import { toast } from "sonner";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../ui/FormError";

interface EditPositionFormProps {
  position: Position;
  isModal?: boolean;
  onSuccess: () => void;
}

const EditPositionForm = ({
  position,
  isModal = false,
  onSuccess,
}: EditPositionFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Position>({
    id: position.id,
    name: position.name,
    description: position.description,
    department: position.department,
    criteria: position.criteria,
    isDeleted: position.isDeleted,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const submitData = new FormData(formElement);

      const response = await fetch(`/api/positions/${position.id}/edit`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Failed to update position");
        return;
      }

      if (result.updatedCandidates !== undefined) {
        if (result.updatedCandidates === 0) {
          toast.success("Position updated successfully.");
        } else {
          toast.success(
            `Position updated successfully. Updated ${
              result.updatedCandidates
            } candidate${result.updatedCandidates === 1 ? "" : "s"}.`
          );
        }
      } else {
        toast.success("Position updated successfully.");
      }

      if (isModal) {
        onSuccess?.();
      } else {
        router.push("/positions");
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="positionId" value={position.id} />

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Position Details
              </h2>
              <p className="text-gray-600 mt-1">
                Update the information below to modify this position
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {formError && <FormError formError={formError} />}

          <div className="grid grid-cols-1 gap-8 max-w-4xl">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Position Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Engineering, Marketing, Sales"
              />
            </div>

            {/*=== Criteria ===*/}
            <div>
              <label
                htmlFor="criteria"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Maximum Candidates
              </label>
              <input
                type="number"
                name="criteria"
                id="criteria"
                min="1"
                value={formData.criteria || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="e.g., 5 (leave empty for unlimited)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum number of candidates that can be assigned to this
                position. Leave empty for unlimited.
              </p>
            </div>

            {/*=== Description ===*/}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-vertical"
                placeholder="Describe the position responsibilities, requirements, and key details..."
              />
            </div>
          </div>
        </div>

        {/*=== Form Actions ===*/}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div
            className={`flex ${
              isModal
                ? "justify-end"
                : "flex-col-reverse sm:flex-row sm:justify-end"
            } sm:space-x-4 space-y-3 sm:space-y-0`}
          >
            {!isModal && (
              <Link
                href="/positions"
                className="inline-flex cursor-pointer items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium text-center"
              >
                Cancel
              </Link>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium ${
                isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              {isSubmitting ? "Updating..." : "Update Position"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPositionForm;
