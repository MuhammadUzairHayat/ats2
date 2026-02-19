"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Code */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The resource may have been moved or deleted.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go Back
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-center"
          >
            Return Home
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}