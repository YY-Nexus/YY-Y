import { type NextRequest, NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export function createApiResponse<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export function createApiError(error: string | ApiError, status = 400): NextResponse<ApiResponse> {
  const errorObj = typeof error === "string" ? { code: "GENERIC_ERROR", message: error } : error

  return NextResponse.json(
    {
      success: false,
      error: errorObj.message,
      timestamp: new Date().toISOString(),
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export function handleCors(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }
  return null
}

export async function validateJsonRequest(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await request.json()
    }
    return null
  } catch (error) {
    throw new Error("Invalid JSON format")
  }
}

export function withErrorHandling<T extends any[]>(handler: (...args: T) => Promise<NextResponse>) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error("API Error:", error)
      return createApiError(error instanceof Error ? error.message : "Internal server error", 500)
    }
  }
}
