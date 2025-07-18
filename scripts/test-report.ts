import fs from "fs"
import path from "path"
import { execSync } from "child_process"

interface TestResult {
  name: string
  status: "passed" | "failed" | "skipped"
  duration: number
  error?: string
}

interface TestSuite {
  name: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
  skippedTests: number
  duration: number
}

class TestReporter {
  private results: TestSuite[] = []

  async runTests(): Promise<void> {
    console.log("🚀 开始运行自动化测试...\n")

    const testSuites = [
      { name: "API 单元测试", command: "npm run test:api" },
      { name: "集成测试", command: "npm run test:integration" },
      { name: "性能测试", command: "npm run test:performance" },
    ]

    for (const suite of testSuites) {
      console.log(`📋 运行 ${suite.name}...`)
      const startTime = Date.now()

      try {
        const output = execSync(suite.command, {
          encoding: "utf8",
          stdio: "pipe",
        })

        const duration = Date.now() - startTime
        const result = this.parseTestOutput(suite.name, output, duration)
        this.results.push(result)

        console.log(`✅ ${suite.name} 完成 (${duration}ms)`)
      } catch (error: any) {
        const duration = Date.now() - startTime
        const result = this.parseTestOutput(suite.name, error.stdout || "", duration, error.stderr)
        this.results.push(result)

        console.log(`❌ ${suite.name} 失败 (${duration}ms)`)
      }
    }
  }

  private parseTestOutput(suiteName: string, output: string, duration: number, error?: string): TestSuite {
    // 简化的测试结果解析
    const lines = output.split("\n")
    const tests: TestResult[] = []

    let totalTests = 0
    let passedTests = 0
    let failedTests = 0
    let skippedTests = 0

    // 解析 Jest 输出
    for (const line of lines) {
      if (line.includes("✓") || line.includes("PASS")) {
        passedTests++
        totalTests++
      } else if (line.includes("✗") || line.includes("FAIL")) {
        failedTests++
        totalTests++
      } else if (line.includes("○") || line.includes("SKIP")) {
        skippedTests++
        totalTests++
      }
    }

    return {
      name: suiteName,
      tests,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      duration,
    }
  }

  generateReport(): void {
    const reportPath = path.join(process.cwd(), "test-reports")

    // 确保报告目录存在
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true })
    }

    // 生成 HTML 报告
    this.generateHtmlReport(reportPath)

    // 生成 JSON 报告
    this.generateJsonReport(reportPath)

    // 生成控制台摘要
    this.generateConsoleSummary()
  }

  private generateHtmlReport(reportPath: string): void {
    const totalTests = this.results.reduce((sum, suite) => sum + suite.totalTests, 0)
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passedTests, 0)
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failedTests, 0)
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0)

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YYC³ NetTrack API 测试报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { text-align: center; padding: 20px; border-radius: 8px; }
        .metric.passed { background: #dcfce7; color: #16a34a; }
        .metric.failed { background: #fee2e2; color: #dc2626; }
        .metric.total { background: #dbeafe; color: #2563eb; }
        .metric.duration { background: #fef3c7; color: #d97706; }
        .metric h3 { margin: 0 0 10px 0; font-size: 32px; font-weight: bold; }
        .metric p { margin: 0; font-size: 14px; opacity: 0.8; }
        .suites { padding: 0 30px 30px; }
        .suite { margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #f9fafb; padding: 20px; border-bottom: 1px solid #e5e7eb; }
        .suite-header h3 { margin: 0 0 10px 0; color: #374151; }
        .suite-stats { display: flex; gap: 20px; font-size: 14px; color: #6b7280; }
        .suite-content { padding: 20px; }
        .progress-bar { width: 100%; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden; margin-top: 10px; }
        .progress-fill { height: 100%; background: #10b981; transition: width 0.3s ease; }
        .timestamp { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 API 自动化测试报告</h1>
            <p>YYC³ NetTrack 平台 API 测试结果</p>
        </div>
        
        <div class="summary">
            <div class="metric total">
                <h3>${totalTests}</h3>
                <p>总测试数</p>
            </div>
            <div class="metric passed">
                <h3>${totalPassed}</h3>
                <p>通过测试</p>
            </div>
            <div class="metric failed">
                <h3>${totalFailed}</h3>
                <p>失败测试</p>
            </div>
            <div class="metric duration">
                <h3>${(totalDuration / 1000).toFixed(1)}s</h3>
                <p>总耗时</p>
            </div>
        </div>
        
        <div class="suites">
            ${this.results
              .map(
                (suite) => `
                <div class="suite">
                    <div class="suite-header">
                        <h3>${suite.name}</h3>
                        <div class="suite-stats">
                            <span>总计: ${suite.totalTests}</span>
                            <span>通过: ${suite.passedTests}</span>
                            <span>失败: ${suite.failedTests}</span>
                            <span>耗时: ${(suite.duration / 1000).toFixed(1)}s</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${suite.totalTests > 0 ? (suite.passedTests / suite.totalTests) * 100 : 0}%"></div>
                        </div>
                    </div>
                    <div class="suite-content">
                        <p>测试套件执行${suite.failedTests > 0 ? "部分失败" : "成功"}，详细结果请查看控制台输出。</p>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        
        <div class="timestamp">
            <p>报告生成时间: ${new Date().toLocaleString("zh-CN")}</p>
        </div>
    </div>
</body>
</html>
    `

    fs.writeFileSync(path.join(reportPath, "test-report.html"), html)
    console.log(`📊 HTML 报告已生成: ${path.join(reportPath, "test-report.html")}`)
  }

  private generateJsonReport(reportPath: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSuites: this.results.length,
        totalTests: this.results.reduce((sum, suite) => sum + suite.totalTests, 0),
        passedTests: this.results.reduce((sum, suite) => sum + suite.passedTests, 0),
        failedTests: this.results.reduce((sum, suite) => sum + suite.failedTests, 0),
        skippedTests: this.results.reduce((sum, suite) => sum + suite.skippedTests, 0),
        totalDuration: this.results.reduce((sum, suite) => sum + suite.duration, 0),
      },
      suites: this.results,
    }

    fs.writeFileSync(path.join(reportPath, "test-report.json"), JSON.stringify(report, null, 2))
    console.log(`📄 JSON 报告已生成: ${path.join(reportPath, "test-report.json")}`)
  }

  private generateConsoleSummary(): void {
    const totalTests = this.results.reduce((sum, suite) => sum + suite.totalTests, 0)
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passedTests, 0)
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failedTests, 0)
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0)

    console.log("\n" + "=".repeat(60))
    console.log("📊 测试结果摘要")
    console.log("=".repeat(60))
    console.log(`📋 总测试数: ${totalTests}`)
    console.log(`✅ 通过测试: ${totalPassed}`)
    console.log(`❌ 失败测试: ${totalFailed}`)
    console.log(`⏱️  总耗时: ${(totalDuration / 1000).toFixed(1)}s`)
    console.log(`📈 成功率: ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}%`)
    console.log("=".repeat(60))

    if (totalFailed === 0) {
      console.log("🎉 所有测试通过！")
    } else {
      console.log(`⚠️  有 ${totalFailed} 个测试失败，请检查详细日志`)
    }
  }
}

// 主函数
async function main() {
  const reporter = new TestReporter()

  try {
    await reporter.runTests()
    reporter.generateReport()
  } catch (error) {
    console.error("❌ 测试运行失败:", error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

export { TestReporter }
