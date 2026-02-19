import { NextResponse } from "next/server"

export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status })
  }

  static error(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status })
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401)
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403)
  }

  static notFound(message = "Not found") {
    return this.error(message, 404)
  }
}
