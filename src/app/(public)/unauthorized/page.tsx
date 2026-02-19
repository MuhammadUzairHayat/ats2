import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

export default async function Unauthorized() {
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Access Denied
          </h2>
          <p className="mt-2 text-base text-gray-600 leading-relaxed">
            You don&apos;t have permission to access this page. Please sign in
            to continue.
          </p>
        </div>
        <div>
          <Link
            href="/auth/login"
            className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
