#!/usr/bin/env tsx

import { performance } from "perf_hooks"
import autocannon from "autocannon"
import { writeFileSync } from "fs"
import { join } from "path"

interface PerformanceMetrics {
  timestamp: string
  testType: string
  duration: number
  requests: {
    total: number
    average: number
    min: number
    max: number
  }
  latency: {
    average: number
    min: number
    max: number
    p50: number
    p90: number
    p95: number
    p99: number
  }
  throughput: {
    average: number
    min: number
    max: number
  }
  errors: number
  timeouts: number
}

class PerformanceTester {
  private baseUrl: string
  private results: PerformanceMetrics[] = []

  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl
  }

  async runLoadTest(
    endpoint: string,
    options: {
      connections?: number
      duration?: number
      pipelining?: number
      title?: string
    } = {},
  ): Promise<PerformanceMetrics> {
    const { connections = 10, duration = 30, pipelining = 1, title = endpoint } = options

    console.log(`🚀 开始负载测试: ${title}`)
    console.log(`📊 配置: ${connections} 连接, ${duration}s 持续时间, ${pipelining} 管道`)

    const startTime = performance.now()

    try {
      const result = await autocannon({
        url: `${this.baseUrl}${endpoint}`,
        connections,
        duration,
        pipelining,
        headers: {
          "User-Agent": "YYC3-Performance-Test/1.0",
        },
      })

      const endTime = performance.now()
      const testDuration = endTime - startTime

      const metrics: PerformanceMetrics = {
        timestamp: new Date().toISOString(),
        testType: title,
        duration: testDuration,
        requests: {
          total: result.requests.total,
          average: result.requests.average,
          min: result.requests.min,
          max: result.requests.max,
        },
        latency: {
          average: result.latency.average,
          min: result.latency.min,
          max: result.latency.max,
          p50: result.latency.p50,
          p90: result.latency.p90,
          p95: result.latency.p95,
          p99: result.latency.p99,
        },
        throughput: {
          average: result.throughput.average,
          min: result.throughput.min,
          max: result.throughput.max,
        },
        errors: result.errors,
        timeouts: result.timeouts,
      }

      this.results.push(metrics)
      this.logResults(metrics)

      return metrics
    } catch (error) {
      console.error(`❌ 负载测试失败: ${error}`)
      throw error
    }
  }

  private logResults(metrics: PerformanceMetrics) {
    console.log(`\n📈 ${metrics.testType} 测试结果:`)
    console.log(`   总请求数: ${metrics.requests.total}`)
    console.log(`   平均 RPS: ${metrics.requests.average}`)
    console.log(`   平均延迟: ${metrics.latency.average}ms`)
    console.log(`   P95 延迟: ${metrics.latency.p95}ms`)
    console.log(`   P99 延迟: ${metrics.latency.p99}ms`)
    console.log(`   错误数: ${metrics.errors}`)
    console.log(`   超时数: ${metrics.timeouts}`)
    console.log(`   平均吞吐量: ${metrics.throughput.average} bytes/sec`)
  }

  async runFullTestSuite(): Promise<void> {
    console.log("🎯 开始完整性能测试套件...\n")

    const testCases = [
      { endpoint: "/", title: "首页加载测试", connections: 10, duration: 30 },
      { endpoint: "/api/health", title: "API 健康检查", connections: 20, duration: 30 },
      { endpoint: "/api/network/test", title: "网络测试 API", connections: 5, duration: 30 },
      { endpoint: "/api/feedback", title: "反馈 API", connections: 10, duration: 20 },
      { endpoint: "/docs", title: "API 文档页面", connections: 5, duration: 20 },
    ]

    for (const testCase of testCases) {
      try {
        await this.runLoadTest(testCase.endpoint, testCase)
        console.log("\n" + "─".repeat(60) + "\n")

        // 测试间隔
        await new Promise((resolve) => setTimeout(resolve, 5000))
      } catch (error) {
        console.error(`测试失败: ${testCase.title}`, error)
      }
    }

    this.generateReport()
  }

  private generateReport(): void {
    const reportPath = join(process.cwd(), "performance-report.json")
    const htmlReportPath = join(process.cwd(), "performance-report.html")

    // 生成 JSON 报告
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results,
    }

    writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`📄 JSON 报告已生成: ${reportPath}`)

    // 生成 HTML 报告
    const htmlReport = this.generateHtmlReport(report)
    writeFileSync(htmlReportPath, htmlReport)
    console.log(`📄 HTML 报告已生成: ${htmlReportPath}`)
  }

  private generateSummary() {
    if (this.results.length === 0) return null

    const totalRequests = this.results.reduce((sum, r) => sum + r.requests.total, 0)
    const totalErrors = this.results.reduce((sum, r) => sum + r.errors, 0)
    const avgLatency = this.results.reduce((sum, r) => sum + r.latency.average, 0) / this.results.length
    const maxLatency = Math.max(...this.results.map((r) => r.latency.max))

    return {
      totalTests: this.results.length,
      totalRequests,
      totalErrors,
      errorRate: (totalErrors / totalRequests) * 100,
      averageLatency: avgLatency,
      maxLatency,
      overallScore: this.calculateOverallScore(),
    }
  }

  private calculateOverallScore(): string {
    const summary = this.generateSummary()
    if (!summary) return "N/A"

    let score = 100

    // 错误率扣分
    if (summary.errorRate > 1) score -= 30
    else if (summary.errorRate > 0.1) score -= 10

    // 延迟扣分
    if (summary.averageLatency > 1000) score -= 30
    else if (summary.averageLatency > 500) score -= 20
    else if (summary.averageLatency > 200) score -= 10

    if (score >= 90) return "优秀"
    if (score >= 80) return "良好"
    if (score >= 70) return "一般"
    return "需要优化"
  }

  private generateHtmlReport(report: any): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YYC³ NetTrack 性能测试报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #333; }
        .metric-label { color: #666; margin-top: 5px; }
        .test-result { margin-bottom: 30px; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .test-header { background: #f8f9fa; padding: 15px; font-weight: bold; }
        .test-details { padding: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
        .detail-item { text-align: center; }
        .detail-value { font-size: 1.2em; font-weight: bold; }
        .detail-label { color: #666; font-size: 0.9em; }
        .score-excellent { color: #28a745; }
        .score-good { color: #17a2b8; }
        .score-average { color: #ffc107; }
        .score-poor { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 YYC³ NetTrack 性能测试报告</h1>
            <p>生成时间: ${report.timestamp}</p>
        </div>
        <div class="content">
            ${
              report.summary
                ? `
            <div class="summary">
                <div class="metric">
                    <div class="metric-value">${report.summary.totalTests}</div>
                    <div class="metric-label">测试用例</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.totalRequests.toLocaleString()}</div>
                    <div class="metric-label">总请求数</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.errorRate.toFixed(2)}%</div>
                    <div class="metric-label">错误率</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.averageLatency.toFixed(0)}ms</div>
                    <div class="metric-label">平均延迟</div>
                </div>
                <div class="metric">
                    <div class="metric-value score-${report.summary.overallScore === "优秀" ? "excellent" : report.summary.overallScore === "良好" ? "good" : report.summary.overallScore === "一般" ? "average" : "poor"}">${report.summary.overallScore}</div>
                    <div class="metric-label">综合评分</div>
                </div>
            </div>
            `
                : ""
            }
            
            <h2>📊 详细测试结果</h2>
            ${report.results
              .map(
                (result: PerformanceMetrics) => `
            <div class="test-result">
                <div class="test-header">${result.testType}</div>
                <div class="test-details">
                    <div class="detail-item">
                        <div class="detail-value">${result.requests.total}</div>
                        <div class="detail-label">总请求数</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${result.requests.average}</div>
                        <div class="detail-label">平均 RPS</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${result.latency.average.toFixed(1)}ms</div>
                        <div class="detail-label">平均延迟</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${result.latency.p95.toFixed(1)}ms</div>
                        <div class="detail-label">P95 延迟</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${result.latency.p99.toFixed(1)}ms</div>
                        <div class="detail-label">P99 延迟</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-value">${result.errors}</div>
                        <div class="detail-label">错误数</div>
                    </div>
                </div>
            </div>
            `,
              )
              .join("")}
        </div>
    </div>
</body>
</html>
    `
  }
}

// 主函数
async function main() {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000"
  const tester = new PerformanceTester(baseUrl)

  try {
    await tester.runFullTestSuite()
    console.log("\n✅ 性能测试完成!")
  } catch (error) {
    console.error("❌ 性能测试失败:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { PerformanceTester, type PerformanceMetrics }
