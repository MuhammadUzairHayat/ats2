"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { AuthExpiredError } from "@/lib/errors";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "@/components/auth/SignoutButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    console.error("Application error:", error);

    if (error instanceof AuthExpiredError) {
      toast.error("Your session has expired. Please log in again.");
      signOut({ callbackUrl: "/login" });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-sm">
          {/* Icon Header */}
          <div className="bg-red-50 py-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We’re sorry for the inconvenience. This could be due to:
            </p>

            <ul className="text-left text-gray-700 space-y-2 mb-6 mx-auto max-w-xs">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Network or connectivity issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Your session expired</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Temporary server problems</span>
              </li>
            </ul>

            <p className="text-gray-600 mb-8 text-sm">
              Try refreshing the page or signing out and back in.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                aria-label="Try again"
              >
                <ArrowPathIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Try Again
              </button>

              <SignOutButton
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                aria-label="Sign out and log in again"
              />
            </div>
          </div>
        </div>

        {/* Error Reference */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Error ID: <span className="font-mono">{error.digest || "UNKNOWN"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}