"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../ui/FormError";

interface AddStatusFormProps {
  isModal?: boolean;
}

const AddStatusForm = ({ isModal = false }: AddStatusFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    color: "#00aaff",
    description: "",
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

      const response = await fetch("/api/statuses", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Failed to add status");
        return;
      }

      router.push("/statuses");
      router.refresh();
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
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Status Information
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Define the status properties for candidate pipeline tracking
          </p>
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Interview Scheduled, Offer Sent, Rejected"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                <div className="relative">
                  <input
                    type="color"
                    name="color"
                    id="color"
                    required
                    className="w-16 h-16 rounded-xl border border-gray-300 cursor-pointer shadow-sm"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    Choose a color that represents this status stage
                  </p>
                  <p className="text-xs text-gray-500">
                    The color will be used in charts, badges, and visual
                    indicators
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-vertical"
                placeholder="Describe what this status represents in the recruitment process..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              {isSubmitting ? "Creating..." : "Create Status"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStatusForm;
