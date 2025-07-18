import { NextRequest } from "next/server"
import { createMocks } from "node-mocks-http"
import { expect, jest } from "@jest/globals"

// 创建模拟请求
export function createMockRequest(
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>,
): NextRequest {
  const { req } = createMocks({
    method,
    url,
    body,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  })

  // 转换为 NextRequest
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  })
}

// 测试数据生成器
export const testData = {
  feedback: {
    valid: {
      type: "bug" as const,
      title: "测试反馈标题",
      content: "这是一个测试反馈内容",
      rating: 4,
      email: "test@example.com",
      name: "测试用户",
      allowContact: true,
      userAgent: "Mozilla/5.0 Test Browser",
      timestamp: new Date().toISOString(),
    },
    invalid: {
      missingTitle: {
        type: "bug" as const,
        content: "缺少标题的反馈",
        timestamp: new Date().toISOString(),
      },
      invalidEmail: {
        type: "suggestion" as const,
        title: "测试标题",
        content: "测试内容",
        email: "invalid-email",
        timestamp: new Date().toISOString(),
      },
      tooLongContent: {
        type: "other" as const,
        title: "测试标题",
        content: "x".repeat(2001), // 超过2000字符限制
        timestamp: new Date().toISOString(),
      },
    },
  },
  networkTest: {
    valid: {
      type: "speed" as const,
      duration: 30,
      options: {
        downloadTest: true,
        uploadTest: true,
        latencyTest: true,
        jitterTest: true,
      },
    },
    invalid: {
      invalidType: {
        type: "invalid-type",
        duration: 30,
      },
      invalidDuration: {
        type: "speed" as const,
        duration: 100, // 超过60秒限制
      },
    },
  },
}

// 响应验证器
export function validateApiResponse(response: any) {
  expect(response).toHaveProperty("success")
  expect(response).toHaveProperty("timestamp")
  expect(response).toHaveProperty("requestId")
  expect(typeof response.success).toBe("boolean")
  expect(typeof response.timestamp).toBe("string")
  expect(typeof response.requestId).toBe("string")
}

// 错误响应验证器
export function validateErrorResponse(response: any, expectedStatus?: number) {
  expect(response.success).toBe(false)
  expect(response).toHaveProperty("error")
  expect(response).toHaveProperty("timestamp")
  expect(response).toHaveProperty("requestId")
  expect(typeof response.error).toBe("string")
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 生成随机字符串
export function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 模拟邮件发送
export function mockNodemailer() {
  const mockSendMail = jest.fn().mockResolvedValue({
    messageId: "test-message-id",
    response: "250 OK",
  })

  const mockVerify = jest.fn().mockResolvedValue(true)

  const mockTransporter = {
    sendMail: mockSendMail,
    verify: mockVerify,
  }

  const mockCreateTransporter = jest.fn().mockReturnValue(mockTransporter)

  jest.doMock("nodemailer", () => ({
    createTransporter: mockCreateTransporter,
  }))

  return {
    mockSendMail,
    mockVerify,
    mockTransporter,
    mockCreateTransporter,
  }
}
