import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// API 响应类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId: string
}

// 错误类型定义
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// 生成请求ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// API 响应包装器
export function createApiResponse<T>(data?: T, message?: string, requestId?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: requestId || generateRequestId(),
  }
}

// API 错误响应
export function createApiError(error: string, statusCode = 500, requestId?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId(),
    },
    { status: statusCode },
  )
}

// 请求验证中间件
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(`验证失败: ${error.errors.map((e) => e.message).join(", ")}`, 400, "VALIDATION_ERROR")
      }
      throw new ApiError("请求体格式错误", 400, "INVALID_JSON")
    }
  }
}

// 速率限制
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  // 清理过期记录
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key)
    }
  }

  const current = rateLimitMap.get(identifier)

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now })
    return true
  }

  if (current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

// 获取客户端IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return "unknown"
}

// API 路由包装器
export function withApiHandler(handler: (request: NextRequest, context: { params?: any }) => Promise<NextResponse>) {
  return async (request: NextRequest, context: { params?: any } = {}) => {
    const requestId = generateRequestId()
    const startTime = Date.now()
    const clientIP = getClientIP(request)

    // 添加请求日志
    console.log(`[${requestId}] ${request.method} ${request.url} - IP: ${clientIP}`)

    try {
      // 速率限制检查
      if (!rateLimit(clientIP, 100, 60000)) {
        return createApiError("请求过于频繁，请稍后再试", 429, requestId)
      }

      // 执行处理器
      const response = await handler(request, context)

      // 添加响应头
      response.headers.set("X-Request-ID", requestId)
      response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`)

      // 记录成功日志
      console.log(`[${requestId}] Success - ${Date.now() - startTime}ms`)

      return response
    } catch (error) {
      // 错误处理
      console.error(`[${requestId}] Error:`, error)

      if (error instanceof ApiError) {
        return createApiError(error.message, error.statusCode, requestId)
      }

      // 未知错误
      return createApiError("服务器内部错误", 500, requestId)
    }
  }
}

// 缓存工具
const cache = new Map<string, { data: any; expiry: number }>()

export function setCache(key: string, data: any, ttlMs = 300000): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  })
}

export function getCache<T>(key: string): T | null {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data as T
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear()
    return
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// 健康检查工具
export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  services: {
    database: boolean
    email: boolean
    cache: boolean
  }
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const memUsage = process.memoryUsage()

  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: memUsage.heapUsed,
      total: memUsage.heapTotal,
      percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
    },
    services: {
      database: true, // 这里可以添加实际的数据库检查
      email: true, // 这里可以添加实际的邮件服务检查
      cache: true, // 这里可以添加实际的缓存检查
    },
  }
}
