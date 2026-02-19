import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const RATE_LIMIT = 100 // requests
const WINDOW_SIZE = 60 * 60 * 1000 // 1 hour in milliseconds

const ipRequests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous"
  const now = Date.now()
  const windowStart = now - WINDOW_SIZE

  // Clean up old entries
  for (const [key, value] of ipRequests.entries()) {
    if (value.resetTime < windowStart) {
      ipRequests.delete(key)
    }
  }

  // Get or create request count for IP
  const requestData = ipRequests.get(ip) ?? { count: 0, resetTime: now }

  // Check if rate limit exceeded
  if (requestData.count >= RATE_LIMIT) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "Retry-After": "3600",
      },
    })
  }

  // Increment request count
  requestData.count++
  ipRequests.set(ip, requestData)

  return null
}
