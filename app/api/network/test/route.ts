import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  withApiHandler,
  createApiResponse,
  validateRequest,
  ApiError,
  setCache,
  getCache,
  getClientIP,
} from "@/lib/api-utils"

// 测试配置验证
const testConfigSchema = z.object({
  type: z.enum(["speed", "ping", "comprehensive"]),
  duration: z.number().min(5).max(60).default(30),
  servers: z.array(z.string()).optional(),
  options: z
    .object({
      downloadTest: z.boolean().default(true),
      uploadTest: z.boolean().default(true),
      latencyTest: z.boolean().default(true),
      jitterTest: z.boolean().default(true),
    })
    .optional(),
})

type TestConfig = z.infer<typeof testConfigSchema>

interface TestResult {
  testId: string
  type: string
  startTime: string
  endTime: string
  clientIP: string
  results: {
    download?: {
      speed: number
      unit: string
      stability: number
    }
    upload?: {
      speed: number
      unit: string
      stability: number
    }
    latency?: {
      min: number
      max: number
      avg: number
      jitter: number
      unit: string
    }
    quality?: {
      score: number
      grade: string
      issues: string[]
    }
  }
  metadata: {
    userAgent: string
    location?: string
    isp?: string
  }
}

// 模拟网络测试
async function performNetworkTest(config: TestConfig, clientIP: string, userAgent: string): Promise<TestResult> {
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
  const startTime = new Date().toISOString()

  // 模拟测试延迟
  await new Promise((resolve) => setTimeout(resolve, Math.min(config.duration * 100, 3000)))

  const results: TestResult["results"] = {}

  // 模拟下载测试
  if (config.options?.downloadTest !== false) {
    results.download = {
      speed: Math.random() * 900 + 100, // 100-1000 Mbps
      unit: "Mbps",
      stability: Math.random() * 30 + 70, // 70-100%
    }
  }

  // 模拟上传测试
  if (config.options?.uploadTest !== false) {
    results.upload = {
      speed: Math.random() * 500 + 50, // 50-550 Mbps
      unit: "Mbps",
      stability: Math.random() * 25 + 75, // 75-100%
    }
  }

  // 模拟延迟测试
  if (config.options?.latencyTest !== false) {
    const baseLatency = Math.random() * 50 + 10 // 10-60ms
    const jitter = Math.random() * 10 + 1 // 1-11ms

    results.latency = {
      min: baseLatency - jitter,
      max: baseLatency + jitter,
      avg: baseLatency,
      jitter,
      unit: "ms",
    }
  }

  // 计算质量评分
  if (results.download && results.latency) {
    const downloadScore = Math.min(results.download.speed / 10, 40) // 最高40分
    const latencyScore = Math.max(40 - results.latency.avg, 0) // 最高40分
    const stabilityScore = (results.download.stability / 100) * 20 // 最高20分

    const totalScore = downloadScore + latencyScore + stabilityScore

    let grade = "较差"
    if (totalScore >= 90) grade = "优秀"
    else if (totalScore >= 75) grade = "良好"
    else if (totalScore >= 60) grade = "一般"

    const issues: string[] = []
    if (results.download.speed < 50) issues.push("下载速度较慢")
    if (results.latency.avg > 50) issues.push("网络延迟较高")
    if (results.download.stability < 80) issues.push("网络连接不稳定")

    results.quality = {
      score: Math.round(totalScore),
      grade,
      issues,
    }
  }

  return {
    testId,
    type: config.type,
    startTime,
    endTime: new Date().toISOString(),
    clientIP,
    results,
    metadata: {
      userAgent,
      location: "模拟位置", // 这里可以集成真实的地理位置API
      isp: "模拟ISP", // 这里可以集成真实的ISP检测
    },
  }
}

// 启动测试
async function handleStartTest(request: NextRequest): Promise<NextResponse> {
  const validate = validateRequest(testConfigSchema)
  const config = await validate(request)

  const clientIP = getClientIP(request)
  const userAgent = request.headers.get("user-agent") || "Unknown"

  // 检查是否有正在进行的测试
  const activeTestKey = `active_test:${clientIP}`
  const activeTest = getCache(activeTestKey)
  if (activeTest) {
    throw new ApiError("您有正在进行的测试，请等待完成后再试", 409, "TEST_IN_PROGRESS")
  }

  // 标记测试开始
  setCache(activeTestKey, true, config.duration * 1000 + 10000) // 测试时长 + 10秒缓冲

  try {
    // 执行网络测试
    const testResult = await performNetworkTest(config, clientIP, userAgent)

    // 缓存测试结果（1小时）
    setCache(`test_result:${testResult.testId}`, testResult, 3600000)

    return NextResponse.json(createApiResponse(testResult, "网络测试完成"))
  } finally {
    // 清除活跃测试标记
    setCache(activeTestKey, null, 0)
  }
}

// 获取测试结果
async function handleGetResult(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const testId = searchParams.get("testId")

  if (!testId) {
    throw new ApiError("缺少测试ID参数", 400, "MISSING_TEST_ID")
  }

  const result = getCache(`test_result:${testId}`)
  if (!result) {
    throw new ApiError("测试结果不存在或已过期", 404, "TEST_RESULT_NOT_FOUND")
  }

  return NextResponse.json(createApiResponse(result, "获取测试结果成功"))
}

// 路由处理
export const POST = withApiHandler(handleStartTest)
export const GET = withApiHandler(handleGetResult)
