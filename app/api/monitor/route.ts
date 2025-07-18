import { type NextRequest, NextResponse } from "next/server"
import { withApiHandler, createApiResponse } from "@/lib/api-utils"

interface SystemMetrics {
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
  }
  requests: {
    total: number
    success: number
    error: number
    avgResponseTime: number
  }
  cache: {
    hitRate: number
    size: number
  }
}

// 简单的指标收集器
class MetricsCollector {
  private static instance: MetricsCollector
  private requestCount = 0
  private successCount = 0
  private errorCount = 0
  private responseTimes: number[] = []
  private cacheHits = 0
  private cacheMisses = 0

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector()
    }
    return MetricsCollector.instance
  }

  recordRequest(success: boolean, responseTime: number): void {
    this.requestCount++
    if (success) {
      this.successCount++
    } else {
      this.errorCount++
    }

    this.responseTimes.push(responseTime)
    // 只保留最近1000个响应时间
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000)
    }
  }

  recordCacheHit(): void {
    this.cacheHits++
  }

  recordCacheMiss(): void {
    this.cacheMisses++
  }

  getMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage()
    const avgResponseTime =
      this.responseTimes.length > 0 ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length : 0

    const totalCacheRequests = this.cacheHits + this.cacheMisses
    const cacheHitRate = totalCacheRequests > 0 ? (this.cacheHits / totalCacheRequests) * 100 : 0

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      },
      cpu: {
        usage: 0, // 在生产环境中可以使用 os.loadavg() 等方法
      },
      requests: {
        total: this.requestCount,
        success: this.successCount,
        error: this.errorCount,
        avgResponseTime: Math.round(avgResponseTime),
      },
      cache: {
        hitRate: Math.round(cacheHitRate * 100) / 100,
        size: this.cacheHits + this.cacheMisses,
      },
    }
  }

  reset(): void {
    this.requestCount = 0
    this.successCount = 0
    this.errorCount = 0
    this.responseTimes = []
    this.cacheHits = 0
    this.cacheMisses = 0
  }
}

async function handleMonitor(request: NextRequest): Promise<NextResponse> {
  const metrics = MetricsCollector.getInstance().getMetrics()

  return NextResponse.json(createApiResponse(metrics, "系统监控数据"))
}

export const GET = withApiHandler(handleMonitor)

// 导出指标收集器供其他模块使用
export { MetricsCollector }
