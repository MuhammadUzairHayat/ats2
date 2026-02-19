import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { toast } from "sonner"

type Context = {
  params: Record<string, string>
}

type Handler = (req: NextRequest, context: Context) => Promise<NextResponse>

export function withAuth(handler: Handler) {
  return async function GET(
    req: NextRequest,
    context: Context
  ): Promise<NextResponse> {
    try {
      const token = await getToken({ req })

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }

      return handler(req, context)
    } catch (error) {
      toast.error(`Auth error: ${ error}`)
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      )
    }
  }
}
