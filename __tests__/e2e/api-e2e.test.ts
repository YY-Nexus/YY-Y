import { spawn } from "child_process"
import { delay } from "../utils/test-helpers"

describe("端到端 API 测试", () => {
  let serverProcess: any

  beforeAll(async () => {
    // 启动测试服务器
    serverProcess = spawn("npm", ["run", "dev"], {
      env: { ...process.env, PORT: "3001" },
      stdio: "pipe",
    })

    // 等待服务器启动
    await delay(5000)
  })

  afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill()
    }
  })

  it("应该能够通过 HTTP 访问所有 API 端点", async () => {
    const baseUrl = "http://localhost:3001"

    // 测试健康检查
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    expect(healthResponse.status).toBe(200)
    const healthData = await healthResponse.json()
    expect(healthData.success).toBe(true)

    // 测试反馈提交
    const feedbackResponse = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "bug",
        title: "E2E 测试反馈",
        content: "这是一个端到端测试反馈",
        timestamp: new Date().toISOString(),
      }),
    })
    expect(feedbackResponse.status).toBe(200)
    const feedbackData = await feedbackResponse.json()
    expect(feedbackData.success).toBe(true)

    // 测试网络测试
    const networkResponse = await fetch(`${baseUrl}/api/network/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "speed",
        duration: 5,
        options: {
          downloadTest: true,
          uploadTest: true,
          latencyTest: true,
        },
      }),
    })
    expect(networkResponse.status).toBe(200)
    const networkData = await networkResponse.json()
    expect(networkData.success).toBe(true)
    expect(networkData.data).toHaveProperty("testId")
  })

  it("应该正确处理 CORS 和安全头", async () => {
    const response = await fetch("http://localhost:3001/api/health")

    // 检查安全头
    expect(response.headers.get("x-request-id")).toBeTruthy()
    expect(response.headers.get("x-response-time")).toBeTruthy()
  })
})
