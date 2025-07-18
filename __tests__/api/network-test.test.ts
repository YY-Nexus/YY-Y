import { POST, GET } from "@/app/api/network/test/route"
import { createMockRequest, testData, validateApiResponse, validateErrorResponse } from "../utils/test-helpers"

describe("/api/network/test", () => {
  describe("POST /api/network/test", () => {
    it("应该成功启动网络测试", async () => {
      const request = createMockRequest("POST", "/api/network/test", testData.networkTest.valid)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      validateApiResponse(data)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty("testId")
      expect(data.data).toHaveProperty("type", "speed")
      expect(data.data).toHaveProperty("results")
      expect(data.data).toHaveProperty("clientIP")
      expect(data.message).toContain("网络测试完成")
    })

    it("应该返回正确的测试结果结构", async () => {
      const request = createMockRequest("POST", "/api/network/test", testData.networkTest.valid)

      const response = await POST(request)
      const data = await response.json()

      const results = data.data.results
      expect(results).toHaveProperty("download")
      expect(results).toHaveProperty("upload")
      expect(results).toHaveProperty("latency")
      expect(results).toHaveProperty("quality")

      // 验证下载测试结果
      expect(results.download).toHaveProperty("speed")
      expect(results.download).toHaveProperty("unit", "Mbps")
      expect(results.download).toHaveProperty("stability")
      expect(typeof results.download.speed).toBe("number")
      expect(results.download.speed).toBeGreaterThan(0)

      // 验证延迟测试结果
      expect(results.latency).toHaveProperty("min")
      expect(results.latency).toHaveProperty("max")
      expect(results.latency).toHaveProperty("avg")
      expect(results.latency).toHaveProperty("jitter")
      expect(results.latency).toHaveProperty("unit", "ms")

      // 验证质量评分
      expect(results.quality).toHaveProperty("score")
      expect(results.quality).toHaveProperty("grade")
      expect(results.quality).toHaveProperty("issues")
      expect(typeof results.quality.score).toBe("number")
      expect(results.quality.score).toBeGreaterThanOrEqual(0)
      expect(results.quality.score).toBeLessThanOrEqual(100)
    })

    it("应该拒绝无效的测试类型", async () => {
      const request = createMockRequest("POST", "/api/network/test", testData.networkTest.invalid.invalidType)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("验证失败")
    })

    it("应该拒绝无效的测试时长", async () => {
      const request = createMockRequest("POST", "/api/network/test", testData.networkTest.invalid.invalidDuration)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("验证失败")
    })

    it("应该防止并发测试", async () => {
      const request1 = createMockRequest("POST", "/api/network/test", testData.networkTest.valid, {
        "x-forwarded-for": "192.168.1.100",
      })
      const request2 = createMockRequest("POST", "/api/network/test", testData.networkTest.valid, {
        "x-forwarded-for": "192.168.1.100",
      })

      // 启动第一个测试
      const response1Promise = POST(request1)

      // 立即启动第二个测试（应该被拒绝）
      const response2Promise = POST(request2)

      const [response1, response2] = await Promise.all([response1Promise, response2Promise])

      // 第一个测试应该成功
      expect(response1.status).toBe(200)

      // 第二个测试应该被拒绝
      const data2 = await response2.json()
      expect(response2.status).toBe(409)
      validateErrorResponse(data2)
      expect(data2.error).toContain("正在进行的测试")
    })
  })

  describe("GET /api/network/test", () => {
    it("应该能够获取测试结果", async () => {
      // 先启动一个测试
      const postRequest = createMockRequest("POST", "/api/network/test", testData.networkTest.valid)
      const postResponse = await POST(postRequest)
      const postData = await postResponse.json()
      const testId = postData.data.testId

      // 获取测试结果
      const getRequest = createMockRequest("GET", `/api/network/test?testId=${testId}`)
      const getResponse = await GET(getRequest)
      const getData = await getResponse.json()

      expect(getResponse.status).toBe(200)
      validateApiResponse(getData)
      expect(getData.data.testId).toBe(testId)
      expect(getData.message).toContain("获取测试结果成功")
    })

    it("应该拒绝无效的测试ID", async () => {
      const request = createMockRequest("GET", "/api/network/test?testId=invalid-test-id")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      validateErrorResponse(data)
      expect(data.error).toContain("测试结果不存在或已过期")
    })

    it("应该拒绝缺少测试ID的请求", async () => {
      const request = createMockRequest("GET", "/api/network/test")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      validateErrorResponse(data)
      expect(data.error).toContain("缺少测试ID参数")
    })
  })
})
