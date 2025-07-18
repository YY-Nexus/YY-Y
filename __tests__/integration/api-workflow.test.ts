import { POST as feedbackPost } from "@/app/api/feedback/route"
import { POST as networkPost, GET as networkGet } from "@/app/api/network/test/route"
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

describe("API 工作流集成测试", () => {
  it("应该完成完整的网络测试工作流", async () => {
    // 1. 检查系统健康状态
    const healthRequest = createMockRequest("GET", "/api/health")
    const healthResponse = await healthGet(healthRequest)
    const healthData = await healthResponse.json()

    expect(healthResponse.status).toBe(200)
    expect(healthData.success).toBe(true)
    expect(healthData.data.status).toBe("healthy")

    // 2. 启动网络测试
    const testRequest = createMockRequest("POST", "/api/network/test", testData.networkTest.valid)
    const testResponse = await networkPost(testRequest)
    const testData_result = await testResponse.json()

    expect(testResponse.status).toBe(200)
    expect(testData_result.success).toBe(true)
    expect(testData_result.data).toHaveProperty("testId")

    const testId = testData_result.data.testId

    // 3. 获取测试结果
    const resultRequest = createMockRequest("GET", `/api/network/test?testId=${testId}`)
    const resultResponse = await networkGet(resultRequest)
    const resultData = await resultResponse.json()

    expect(resultResponse.status).toBe(200)
    expect(resultData.success).toBe(true)
    expect(resultData.data.testId).toBe(testId)

    // 4. 提交反馈（基于测试结果）
    const feedbackData = {
      ...testData.feedback.valid,
      title: `网络测试反馈 - 测试ID: ${testId}`,
      content: `测试结果：下载速度 ${resultData.data.results.download.speed.toFixed(2)} Mbps`,
    }

    const feedbackRequest = createMockRequest("POST", "/api/feedback", feedbackData)
    const feedbackResponse = await feedbackPost(feedbackRequest)
    const feedbackResult = await feedbackResponse.json()

    expect(feedbackResponse.status).toBe(200)
    expect(feedbackResult.success).toBe(true)
    expect(feedbackResult.data).toHaveProperty("feedbackId")
  })

  it("应该正确处理错误传播", async () => {
    // 1. 尝试获取不存在的测试结果
    const invalidResultRequest = createMockRequest("GET", "/api/network/test?testId=non-existent-id")
    const invalidResultResponse = await networkGet(invalidResultRequest)
    const invalidResultData = await invalidResultResponse.json()

    expect(invalidResultResponse.status).toBe(404)
    expect(invalidResultData.success).toBe(false)
    expect(invalidResultData.error).toContain("测试结果不存在")

    // 2. 尝试提交无效反馈
    const invalidFeedbackRequest = createMockRequest("POST", "/api/feedback", testData.feedback.invalid.missingTitle)
    const invalidFeedbackResponse = await feedbackPost(invalidFeedbackRequest)
    const invalidFeedbackData = await invalidFeedbackResponse.json()

    expect(invalidFeedbackResponse.status).toBe(400)
    expect(invalidFeedbackData.success).toBe(false)
    expect(invalidFeedbackData.error).toContain("标题不能为空")
  })

  it("应该正确处理并发请求", async () => {
    const requests = Array.from({ length: 5 }, (_, i) => {
      return createMockRequest(
        "POST",
        "/api/network/test",
        testData.networkTest.valid,
        { "x-forwarded-for": `192.168.1.${100 + i}` }, // 不同IP
      )
    })

    // 并发发送请求
    const responses = await Promise.all(requests.map((request) => networkPost(request)))

    // 所有请求都应该成功（不同IP）
    for (const response of responses) {
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    }
  })
})
