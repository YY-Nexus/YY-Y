import type { NextRequest } from "next/server"
import { createApiResponse, handleCors, withErrorHandling } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  return withErrorHandling(async () => {
    const testData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      server: "YanYu Cloud³ OS",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
      },
    }

    return createApiResponse(testData, "API测试成功")
  })()
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || createApiResponse()
}
