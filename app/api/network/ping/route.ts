import type { NextRequest } from "next/server"
import { createApiResponse, handleCors, withErrorHandling } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const target = searchParams.get("target") || "google.com"
    const count = Number.parseInt(searchParams.get("count") || "4")

    // 模拟ping测试结果
    const results = []
    for (let i = 0; i < count; i++) {
      const latency = Math.random() * 100 + 10 // 10-110ms
      results.push({
        sequence: i + 1,
        latency: Math.round(latency * 100) / 100,
        status: latency < 100 ? "success" : "timeout",
        timestamp: new Date().toISOString(),
      })

      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const avgLatency =
      results.filter((r) => r.status === "success").reduce((sum, r) => sum + r.latency, 0) / results.length

    const pingData = {
      target,
      results,
      statistics: {
        sent: count,
        received: results.filter((r) => r.status === "success").length,
        lost: results.filter((r) => r.status === "timeout").length,
        avgLatency: Math.round(avgLatency * 100) / 100,
        minLatency: Math.min(...results.map((r) => r.latency)),
        maxLatency: Math.max(...results.map((r) => r.latency)),
      },
    }

    return createApiResponse(pingData, `Ping测试完成: ${target}`)
  })()
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || createApiResponse()
}
