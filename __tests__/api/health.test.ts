import { GET } from "@/app/api/health/route"
import { createMockRequest, validateApiResponse } from "../utils/test-helpers"

describe("/api/health", () => {
  describe("GET /api/health", () => {
    it("应该返回系统健康状态", async () => {
      const request = createMockRequest("GET", "/api/health")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      validateApiResponse(data)
      expect(data.success).toBe(true)
      expect(data.message).toContain("系统健康检查")

      // 验证健康检查数据结构
      const healthData = data.data
      expect(healthData).toHaveProperty("status")
      expect(healthData).toHaveProperty("timestamp")
      expect(healthData).toHaveProperty("uptime")
      expect(healthData).toHaveProperty("memory")
      expect(healthData).toHaveProperty("services")

      // 验证内存信息
      expect(healthData.memory).toHaveProperty("used")
      expect(healthData.memory).toHaveProperty("total")
      expect(healthData.memory).toHaveProperty("percentage")
      expect(typeof healthData.memory.used).toBe("number")
      expect(typeof healthData.memory.total).toBe("number")
      expect(typeof healthData.memory.percentage).toBe("number")

      // 验证服务状态
      expect(healthData.services).toHaveProperty("database")
      expect(healthData.services).toHaveProperty("email")
      expect(healthData.services).toHaveProperty("cache")
      expect(typeof healthData.services.database).toBe("boolean")
      expect(typeof healthData.services.email).toBe("boolean")
      expect(typeof healthData.services.cache).toBe("boolean")
    })

    it("应该返回正确的时间戳格式", async () => {
      const request = createMockRequest("GET", "/api/health")

      const response = await GET(request)
      const data = await response.json()

      const timestamp = data.data.timestamp
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

      // 验证时间戳是最近的
      const timestampDate = new Date(timestamp)
      const now = new Date()
      const timeDiff = Math.abs(now.getTime() - timestampDate.getTime())
      expect(timeDiff).toBeLessThan(5000) // 5秒内
    })

    it("应该返回合理的运行时间", async () => {
      const request = createMockRequest("GET", "/api/health")

      const response = await GET(request)
      const data = await response.json()

      const uptime = data.data.uptime
      expect(typeof uptime).toBe("number")
      expect(uptime).toBeGreaterThanOrEqual(0)
    })
  })
})
