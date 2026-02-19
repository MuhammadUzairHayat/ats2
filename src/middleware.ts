import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Define private routes (routes that require authentication)
  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/candidates") ||
    pathname.startsWith("/positions") ||
    pathname.startsWith("/statuses");

  // If user is not authenticated and tries to access private routes → redirect to login
  if (!token && isPrivateRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname); // Optional: preserve the intended destination
    return NextResponse.redirect(url);
  }

  // If user is authenticated and tries to access public auth pages → redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
