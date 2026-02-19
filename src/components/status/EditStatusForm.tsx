"use client";
import { Status } from "@/types";
import { toast } from "sonner";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../ui/FormError";

interface EditStatusFormProps {
  status: Status;
  isModal?: boolean;
  onSuccess?: () => void;
}

const EditStatusForm = ({
  status,
  isModal = false,
  onSuccess,
}: EditStatusFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: status.name,
    color: status.color,
    description: status.description,
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

      const response = await fetch(`/api/statuses/${status.id}/edit`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Failed to update status");
        return;
      }

      if (result.updatedCandidates !== undefined) {
        if (result.updatedCandidates === 0) {
          toast.success("Status updated successfully.");
        } else {
          toast.success(
            `Status updated successfully. Updated ${result.updatedCandidates} candidate${
              result.updatedCandidates === 1 ? "" : "s"
            }.`
          );
        }
      } else {
        toast.success("Status updated successfully.");
      }

      if (isModal) {
        onSuccess?.();
      } else {
        router.push("/statuses");
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
        <input type="hidden" name="statusId" value={status.id} />

        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Status Details
            </h2>
            <p className="text-gray-600 mt-1">
              Update the information below to modify this status
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-8">
          {formError && <FormError formError={formError} />}
          <div className="grid grid-cols-1 gap-8 max-w-4xl">
            {/* Status Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Status Name *
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
                placeholder="e.g., Interview Scheduled, Offer Sent"
              />
            </div>

            {/* Color Selection */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2.5"
              >
                Status Color *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  name="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  required
                  className="w-16 h-16 rounded-xl border border-gray-300 cursor-pointer shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm font-mono text-gray-600">
                      {formData.color}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Click the color picker to select a new color
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
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
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-vertical"
                placeholder="Describe what this status represents in the recruitment process..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
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
                href="/statuses"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium text-center"
              >
                Cancel
              </Link>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium ${
                isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              {isSubmitting ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStatusForm;
