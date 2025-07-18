import { type NextRequest, NextResponse } from "next/server"
import { withApiHandler, createApiResponse, getHealthStatus } from "@/lib/api-utils"

async function handleHealthCheck(request: NextRequest): Promise<NextResponse> {
  const health = await getHealthStatus()

  return NextResponse.json(createApiResponse(health, "系统健康检查"))
}

export const GET = withApiHandler(handleHealthCheck)
