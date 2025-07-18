import { POST, GET } from "@/app/api/feedback/route"
import { createMockRequest, testData, validateApiResponse, validateErrorResponse } from "../utils/test-helpers"

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

describe("/api/feedback", () => {
  describe("POST /api/feedback", () => {
    it("应该成功提交有效的反馈", async () => {
      const request = createMockRequest("POST", "/api/feedback", testData.feedback.valid)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      validateApiResponse(data)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty("feedbackId")
      expect(data.data).toHaveProperty("status", "submitted")
      expect(data.message).toContain("反馈已成功提交")
    })

    it("应该拒绝缺少标题的反馈", async () => {
      const request = createMockRequest("POST", "/api/feedback", testData.feedback.invalid.missingTitle)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("标题不能为空")
    })

    it("应该拒绝无效的邮箱格式", async () => {
      const request = createMockRequest("POST", "/api/feedback", testData.feedback.invalid.invalidEmail)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("邮箱格式不正确")
    })

    it("应该拒绝过长的内容", async () => {
      const request = createMockRequest("POST", "/api/feedback", testData.feedback.invalid.tooLongContent)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("内容不能超过2000字符")
    })

    it("应该防止重复提交", async () => {
      const feedbackData = { ...testData.feedback.valid }
      const request1 = createMockRequest("POST", "/api/feedback", feedbackData)
      const request2 = createMockRequest("POST", "/api/feedback", feedbackData)

      // 第一次提交
      const response1 = await POST(request1)
      expect(response1.status).toBe(200)

      // 第二次提交（重复）
      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(response2.status).toBe(409)
      validateErrorResponse(data2)
      expect(data2.error).toContain("请勿重复提交")
    })

    it("应该处理邮件发送失败的情况", async () => {
      // 模拟邮件发送失败
      const nodemailer = require("nodemailer")
      nodemailer.createTransporter.mockReturnValueOnce({
        sendMail: jest.fn().mockRejectedValue(new Error("SMTP Error")),
        verify: jest.fn().mockResolvedValue(true),
      })

      const request = createMockRequest("POST", "/api/feedback", testData.feedback.valid)

      const response = await POST(request)
      const data = await response.json()

      // 即使邮件发送失败，也应该返回成功（用户体验优先）
      expect(response.status).toBe(200)
      validateApiResponse(data)
      expect(data.success).toBe(true)
    })
  })

  describe("GET /api/feedback", () => {
    it("应该返回健康检查信息", async () => {
      const request = createMockRequest("GET", "/api/feedback")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      validateApiResponse(data)
      expect(data.data).toHaveProperty("service", "feedback")
      expect(data.data).toHaveProperty("status", "healthy")
      expect(data.data).toHaveProperty("version")
      expect(data.data).toHaveProperty("endpoints")
    })
  })
})
