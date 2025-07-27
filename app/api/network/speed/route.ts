import type { NextRequest } from "next/server"
import { createApiResponse, handleCors, withErrorHandling } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type") || "both" // download, upload, both
    const duration = Number.parseInt(searchParams.get("duration") || "10") // seconds

    // 模拟速度测试
    const downloadSpeed = Math.random() * 100 + 10 // 10-110 Mbps
    const uploadSpeed = Math.random() * 50 + 5 // 5-55 Mbps
    const latency = Math.random() * 50 + 10 // 10-60ms
    const jitter = Math.random() * 10 + 1 // 1-11ms

    const speedData = {
      testType,
      duration,
      results: {
        download:
          testType === "upload"
            ? null
            : {
                speed: Math.round(downloadSpeed * 100) / 100,
                unit: "Mbps",
                bytes: Math.round(downloadSpeed * duration * 125000), // Convert to bytes
              },
        upload:
          testType === "download"
            ? null
            : {
                speed: Math.round(uploadSpeed * 100) / 100,
                unit: "Mbps",
                bytes: Math.round(uploadSpeed * duration * 125000), // Convert to bytes
              },
        latency: Math.round(latency * 100) / 100,
        jitter: Math.round(jitter * 100) / 100,
      },
      server: {
        name: "YanYu Cloud³ 测试服务器",
        location: "北京",
        distance: Math.round(Math.random() * 1000 + 100), // km
      },
      timestamp: new Date().toISOString(),
    }

    return createApiResponse(speedData, "网络速度测试完成")
  })()
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || createApiResponse()
}
