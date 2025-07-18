import { POST as feedbackPost } from "@/app/api/feedback/route"
import { POST as networkPost } from "@/app/api/network/test/route"
import { GET as healthGet } from "@/app/api/health/route"
import { createMockRequest, testData } from "../utils/test-helpers"

// 模拟 nodemailer
jest.mock("nodemailer", () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
      messageId: "test-message-id",
      response: "250 OK",
    }),
    verify: jest.fn().mockResolvedValue(true),
  })),
}))

describe("API 性能测试", () => {
  it("健康检查 API 应该在 100ms 内响应", async () => {
    const startTime = Date.now()

    const request = createMockRequest("GET", "/api/health")
    const response = await healthGet(request)

    const endTime = Date.now()
    const responseTime = endTime - startTime

    expect(response.status).toBe(200)
    expect(responseTime).toBeLessThan(100)
  })

  it("反馈 API 应该在 2 秒内响应", async () => {
    const startTime = Date.now()

    const request = createMockRequest("POST", "/api/feedback", testData.feedback.valid)
    const response = await feedbackPost(request)

    const endTime = Date.now()
    const responseTime = endTime - startTime

    expect(response.status).toBe(200)
    expect(responseTime).toBeLessThan(2000)
  })

  it("网络测试 API 应该在配置时间内完成", async () => {
    const testConfig = {
      ...testData.networkTest.valid,
      duration: 5, // 5秒测试
    }

    const startTime = Date.now()

    const request = createMockRequest("POST", "/api/network/test", testConfig)
    const response = await networkPost(request)

    const endTime = Date.now()
    const responseTime = endTime - startTime

    expect(response.status).toBe(200)
    // 应该在测试时长 + 1秒缓冲时间内完成
    expect(responseTime).toBeLessThan((testConfig.duration + 1) * 1000)
  })

  it("应该能处理并发请求而不显著降低性能", async () => {
    const concurrentRequests = 10
    const requests = Array.from({ length: concurrentRequests }, (_, i) => {
      return createMockRequest("GET", "/api/health", undefined, { "x-forwarded-for": `192.168.1.${100 + i}` })
    })

    const startTime = Date.now()

    const responses = await Promise.all(requests.map((request) => healthGet(request)))

    const endTime = Date.now()
    const totalTime = endTime - startTime

    // 所有请求都应该成功
    for (const response of responses) {
      expect(response.status).toBe(200)
    }

    // 并发处理时间不应该超过单个请求时间的 2 倍
    expect(totalTime).toBeLessThan(200)
  })

  it("内存使用应该保持在合理范围内", async () => {
    const initialMemory = process.memoryUsage()

    // 执行多个请求
    const requests = Array.from({ length: 50 }, (_, i) => {
      return createMockRequest("POST", "/api/feedback", {
        ...testData.feedback.valid,
        title: `性能测试反馈 ${i}`,
        timestamp: new Date(Date.now() + i).toISOString(),
      })
    })

    await Promise.all(requests.map((request) => feedbackPost(request)))

    const finalMemory = process.memoryUsage()
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed

    // 内存增长不应该超过 50MB
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
  })
})
