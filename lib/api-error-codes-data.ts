// API错误代码定义系统
export interface ApiErrorCode {
  code: string
  message: string
  description: string
  httpStatus: number
  category:
    | "validation"
    | "authentication"
    | "authorization"
    | "resource"
    | "system"
    | "network"
    | "rate_limit"
    | "external"
  severity: "low" | "medium" | "high" | "critical"
  userMessage: string
  solutions: string[]
  documentation?: string
}

// 错误代码映射表
export const API_ERROR_CODES: Record<string, ApiErrorCode> = {
  // 验证错误 (1000-1999)
  E1001: {
    code: "E1001",
    message: "Invalid request format",
    description: "请求格式不正确，无法解析JSON数据",
    httpStatus: 400,
    category: "validation",
    severity: "medium",
    userMessage: "请求格式错误，请检查输入数据",
    solutions: ["检查JSON格式是否正确", "确认Content-Type为application/json", "验证必填字段是否完整"],
    documentation: "/docs/api/validation",
  },

  E1002: {
    code: "E1002",
    message: "Missing required fields",
    description: "缺少必需的请求字段",
    httpStatus: 400,
    category: "validation",
    severity: "medium",
    userMessage: "缺少必填信息，请完善后重试",
    solutions: ["检查API文档中的必填字段", "确认所有required字段都已提供", "验证字段名称拼写是否正确"],
    documentation: "/docs/api/fields",
  },

  E1003: {
    code: "E1003",
    message: "Invalid field value",
    description: "字段值不符合预期格式或范围",
    httpStatus: 400,
    category: "validation",
    severity: "medium",
    userMessage: "输入值格式不正确，请检查后重试",
    solutions: ["检查字段值的数据类型", "确认值在允许的范围内", "参考API文档中的示例值"],
    documentation: "/docs/api/validation",
  },

  // 认证错误 (2000-2999)
  E2001: {
    code: "E2001",
    message: "Authentication required",
    description: "需要身份验证才能访问此资源",
    httpStatus: 401,
    category: "authentication",
    severity: "high",
    userMessage: "请先登录后再进行操作",
    solutions: ["提供有效的认证令牌", "检查Authorization头部格式", "确认令牌未过期"],
    documentation: "/docs/api/auth",
  },

  E2002: {
    code: "E2002",
    message: "Invalid authentication token",
    description: "提供的认证令牌无效或已过期",
    httpStatus: 401,
    category: "authentication",
    severity: "high",
    userMessage: "登录状态已过期，请重新登录",
    solutions: ["重新获取认证令牌", "检查令牌格式是否正确", "确认令牌签名有效"],
    documentation: "/docs/api/auth",
  },

  // 授权错误 (3000-3999)
  E3001: {
    code: "E3001",
    message: "Insufficient permissions",
    description: "当前用户权限不足，无法执行此操作",
    httpStatus: 403,
    category: "authorization",
    severity: "high",
    userMessage: "权限不足，无法执行此操作",
    solutions: ["联系管理员获取相应权限", "确认用户角色配置正确", "检查资源访问权限设置"],
    documentation: "/docs/api/permissions",
  },

  // 资源错误 (4000-4999)
  E4001: {
    code: "E4001",
    message: "Resource not found",
    description: "请求的资源不存在",
    httpStatus: 404,
    category: "resource",
    severity: "medium",
    userMessage: "请求的资源不存在",
    solutions: ["检查资源ID是否正确", "确认资源未被删除", "验证API路径是否正确"],
    documentation: "/docs/api/resources",
  },

  E4002: {
    code: "E4002",
    message: "Resource already exists",
    description: "尝试创建的资源已存在",
    httpStatus: 409,
    category: "resource",
    severity: "medium",
    userMessage: "资源已存在，无法重复创建",
    solutions: ["使用PUT方法更新现有资源", "检查唯一性约束字段", "考虑使用PATCH方法部分更新"],
    documentation: "/docs/api/resources",
  },

  // 系统错误 (5000-5999)
  E5001: {
    code: "E5001",
    message: "Internal server error",
    description: "服务器内部发生未预期的错误",
    httpStatus: 500,
    category: "system",
    severity: "critical",
    userMessage: "服务器暂时出现问题，请稍后重试",
    solutions: ["稍后重试请求", "联系技术支持", "检查服务状态页面"],
    documentation: "/docs/api/errors",
  },

  E5002: {
    code: "E5002",
    message: "Database connection failed",
    description: "数据库连接失败",
    httpStatus: 503,
    category: "system",
    severity: "critical",
    userMessage: "数据服务暂时不可用，请稍后重试",
    solutions: ["等待服务恢复", "检查网络连接", "查看系统状态公告"],
    documentation: "/docs/api/status",
  },

  // 网络错误 (6000-6999)
  E6001: {
    code: "E6001",
    message: "Request timeout",
    description: "请求处理超时",
    httpStatus: 408,
    category: "network",
    severity: "medium",
    userMessage: "请求超时，请重试",
    solutions: ["减少请求数据量", "检查网络连接稳定性", "稍后重试请求"],
    documentation: "/docs/api/timeouts",
  },

  // 限流错误 (7000-7999)
  E7001: {
    code: "E7001",
    message: "Rate limit exceeded",
    description: "请求频率超过限制",
    httpStatus: 429,
    category: "rate_limit",
    severity: "medium",
    userMessage: "请求过于频繁，请稍后重试",
    solutions: ["降低请求频率", "实现指数退避重试", "考虑升级API配额"],
    documentation: "/docs/api/rate-limits",
  },

  // 外部服务错误 (8000-8999)
  E8001: {
    code: "E8001",
    message: "External service unavailable",
    description: "依赖的外部服务不可用",
    httpStatus: 503,
    category: "external",
    severity: "high",
    userMessage: "外部服务暂时不可用，请稍后重试",
    solutions: ["等待外部服务恢复", "检查服务状态页面", "使用备用服务（如果可用）"],
    documentation: "/docs/api/external-services",
  },
}

// 错误统计接口
export interface ErrorStats {
  code: string
  count: number
  lastOccurred: Date
  trend: "increasing" | "decreasing" | "stable"
}

// 错误处理工具类
export class ApiErrorHandler {
  private static errorStats = new Map<string, ErrorStats>()

  // 获取错误信息
  static getError(code: string): ApiErrorCode | null {
    return API_ERROR_CODES[code] || null
  }

  // 创建标准化错误响应
  static createErrorResponse(code: string, details?: any) {
    const error = this.getError(code)
    if (!error) {
      return {
        success: false,
        error: {
          code: "E5001",
          message: "Unknown error occurred",
          userMessage: "发生未知错误",
          timestamp: new Date().toISOString(),
        },
      }
    }

    // 记录错误统计
    this.recordError(code)

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        category: error.category,
        severity: error.severity,
        solutions: error.solutions,
        documentation: error.documentation,
        details,
        timestamp: new Date().toISOString(),
      },
    }
  }

  // 记录错误统计
  private static recordError(code: string) {
    const existing = this.errorStats.get(code)
    if (existing) {
      existing.count++
      existing.lastOccurred = new Date()
    } else {
      this.errorStats.set(code, {
        code,
        count: 1,
        lastOccurred: new Date(),
        trend: "stable",
      })
    }
  }

  // 获取错误统计
  static getErrorStats(): ErrorStats[] {
    return Array.from(this.errorStats.values())
  }

  // 获取高频错误
  static getTopErrors(limit = 10): ErrorStats[] {
    return this.getErrorStats()
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // 按类别获取错误
  static getErrorsByCategory(category: string): ApiErrorCode[] {
    return Object.values(API_ERROR_CODES).filter((error) => error.category === category)
  }

  // 按严重程度获取错误
  static getErrorsBySeverity(severity: string): ApiErrorCode[] {
    return Object.values(API_ERROR_CODES).filter((error) => error.severity === severity)
  }

  // 清理过期统计
  static cleanupStats(olderThanDays = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    for (const [code, stats] of this.errorStats.entries()) {
      if (stats.lastOccurred < cutoffDate) {
        this.errorStats.delete(code)
      }
    }
  }

  // 导出错误统计报告
  static generateErrorReport() {
    const stats = this.getErrorStats()
    const totalErrors = stats.reduce((sum, stat) => sum + stat.count, 0)

    return {
      summary: {
        totalErrors,
        uniqueErrors: stats.length,
        reportGeneratedAt: new Date().toISOString(),
      },
      topErrors: this.getTopErrors(5),
      byCategory: {
        validation: this.getErrorsByCategory("validation").length,
        authentication: this.getErrorsByCategory("authentication").length,
        authorization: this.getErrorsByCategory("authorization").length,
        resource: this.getErrorsByCategory("resource").length,
        system: this.getErrorsByCategory("system").length,
        network: this.getErrorsByCategory("network").length,
        rate_limit: this.getErrorsByCategory("rate_limit").length,
        external: this.getErrorsByCategory("external").length,
      },
      bySeverity: {
        critical: this.getErrorsBySeverity("critical").length,
        high: this.getErrorsBySeverity("high").length,
        medium: this.getErrorsBySeverity("medium").length,
        low: this.getErrorsBySeverity("low").length,
      },
    }
  }
}

// 错误代码验证器
export function validateErrorCode(code: string): boolean {
  return code in API_ERROR_CODES
}

// 获取所有错误代码
export function getAllErrorCodes(): string[] {
  return Object.keys(API_ERROR_CODES)
}

// 按HTTP状态码分组
export function getErrorsByHttpStatus(status: number): ApiErrorCode[] {
  return Object.values(API_ERROR_CODES).filter((error) => error.httpStatus === status)
}

// 搜索错误代码
export function searchErrors(query: string): ApiErrorCode[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(API_ERROR_CODES).filter(
    (error) =>
      error.code.toLowerCase().includes(lowerQuery) ||
      error.message.toLowerCase().includes(lowerQuery) ||
      error.description.toLowerCase().includes(lowerQuery) ||
      error.userMessage.toLowerCase().includes(lowerQuery),
  )
}

// 错误代码常量导出
export const ERROR_CODES = {
  // 验证错误
  INVALID_REQUEST_FORMAT: "E1001",
  MISSING_REQUIRED_FIELDS: "E1002",
  INVALID_FIELD_VALUE: "E1003",

  // 认证错误
  AUTHENTICATION_REQUIRED: "E2001",
  INVALID_TOKEN: "E2002",

  // 授权错误
  INSUFFICIENT_PERMISSIONS: "E3001",

  // 资源错误
  RESOURCE_NOT_FOUND: "E4001",
  RESOURCE_ALREADY_EXISTS: "E4002",

  // 系统错误
  INTERNAL_SERVER_ERROR: "E5001",
  DATABASE_CONNECTION_FAILED: "E5002",

  // 网络错误
  REQUEST_TIMEOUT: "E6001",

  // 限流错误
  RATE_LIMIT_EXCEEDED: "E7001",

  // 外部服务错误
  EXTERNAL_SERVICE_UNAVAILABLE: "E8001",
} as const

// 类型导出
export type ErrorCodeType = keyof typeof ERROR_CODES
export type ErrorCategory = ApiErrorCode["category"]
export type ErrorSeverity = ApiErrorCode["severity"]
