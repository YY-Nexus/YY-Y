// Jest 全局设置
import { TextEncoder, TextDecoder } from "util"
import { jest } from "@jest/globals"

// 设置全局变量
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// 模拟环境变量
process.env.NODE_ENV = "test"
process.env.SMTP_HOST = "test-smtp.example.com"
process.env.SMTP_PORT = "587"
process.env.SMTP_USER = "test@example.com"
process.env.SMTP_PASS = "test-password"
process.env.FEEDBACK_EMAIL = "feedback@example.com"

// 模拟 fetch
global.fetch = jest.fn()

// 设置测试超时
jest.setTimeout(30000)

// 清理函数
afterEach(() => {
  jest.clearAllMocks()
})
