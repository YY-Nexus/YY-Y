// API错误代码数据定义
export interface ErrorCodeInfo {
  code: string
  httpStatus: number
  message: string
  description: string
  category: "auth" | "validation" | "resource" | "server" | "network" | "rate_limit"
  severity: "low" | "medium" | "high" | "critical"
  userMessage: string
  solutions: string[]
  exampleResponse: {
    success: boolean
    error: string
    code: string
    timestamp: string
    requestId: string
    details?: any
  }
}

// 错误代码定义
export const API_ERROR_CODES: Record<string, ErrorCodeInfo> = {
  // 认证相关错误
  AUTH_REQUIRED: {
    code: "AUTH_REQUIRED",
    httpStatus: 401,
    message: "Authentication required",
    description: "需要用户认证才能访问此资源",
    category: "auth",
    severity: "medium",
    userMessage: "请先登录后再试",
    solutions: ["检查是否已登录", "验证认证令牌是否有效", "重新登录获取新的认证令牌"],
    exampleResponse: {
      success: false,
      error: "Authentication required",
      code: "AUTH_REQUIRED",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_abc123",
    },
  },

  // 权限不足错误
  INSUFFICIENT_PERMISSIONS: {
    code: "INSUFFICIENT_PERMISSIONS",
    httpStatus: 403,
    message: "Insufficient permissions",
    description: "用户权限不足，无法执行此操作",
    category: "auth",
    severity: "medium",
    userMessage: "您没有权限执行此操作",
    solutions: ["联系管理员获取相应权限", "检查用户角色配置", "确认操作是否需要特殊权限"],
    exampleResponse: {
      success: false,
      error: "Insufficient permissions",
      code: "INSUFFICIENT_PERMISSIONS",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_def456",
    },
  },

  // 频率限制错误
  RATE_LIMIT_EXCEEDED: {
    code: "RATE_LIMIT_EXCEEDED",
    httpStatus: 429,
    message: "Rate limit exceeded",
    description: "请求频率超过限制",
    category: "rate_limit",
    severity: "medium",
    userMessage: "请求过于频繁，请稍后再试",
    solutions: ["减少请求频率", "等待一段时间后重试", "检查是否有重复请求", "考虑升级到更高的限制等级"],
    exampleResponse: {
      success: false,
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_ghi789",
      details: {
        limit: 100,
        remaining: 0,
        resetTime: "2024-01-18T21:31:00.000Z",
      },
    },
  },

  // 验证错误
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    httpStatus: 400,
    message: "Validation failed",
    description: "请求数据验证失败",
    category: "validation",
    severity: "low",
    userMessage: "输入数据格式不正确",
    solutions: ["检查输入数据格式", "确认必填字段已填写", "验证数据类型是否正确", "查看API文档了解正确格式"],
    exampleResponse: {
      success: false,
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_jkl012",
      details: {
        fields: ["email", "password"],
        messages: ["邮箱格式不正确", "密码长度不足"],
      },
    },
  },

  // 资源不存在错误
  RESOURCE_NOT_FOUND: {
    code: "RESOURCE_NOT_FOUND",
    httpStatus: 404,
    message: "Resource not found",
    description: "请求的资源不存在",
    category: "resource",
    severity: "low",
    userMessage: "请求的资源不存在",
    solutions: ["检查资源ID是否正确", "确认资源是否已被删除", "验证请求路径是否正确"],
    exampleResponse: {
      success: false,
      error: "Resource not found",
      code: "RESOURCE_NOT_FOUND",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_mno345",
    },
  },

  // 服务器内部错误
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: 500,
    message: "Internal server error",
    description: "服务器内部发生错误",
    category: "server",
    severity: "critical",
    userMessage: "服务器暂时无法处理请求，请稍后再试",
    solutions: ["稍后重试", "联系技术支持", "检查服务器状态"],
    exampleResponse: {
      success: false,
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_pqr678",
    },
  },

  // 网络超时错误
  REQUEST_TIMEOUT: {
    code: "REQUEST_TIMEOUT",
    httpStatus: 408,
    message: "Request timeout",
    description: "请求处理超时",
    category: "network",
    severity: "medium",
    userMessage: "请求超时，请检查网络连接后重试",
    solutions: ["检查网络连接", "重新发送请求", "减少请求数据量", "联系网络管理员"],
    exampleResponse: {
      success: false,
      error: "Request timeout",
      code: "REQUEST_TIMEOUT",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_stu901",
    },
  },

  // 服务不可用错误
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    httpStatus: 503,
    message: "Service unavailable",
    description: "服务暂时不可用",
    category: "server",
    severity: "high",
    userMessage: "服务暂时不可用，请稍后再试",
    solutions: ["等待服务恢复", "检查服务状态页面", "联系技术支持", "使用备用服务"],
    exampleResponse: {
      success: false,
      error: "Service unavailable",
      code: "SERVICE_UNAVAILABLE",
      timestamp: "2024-01-18T21:30:00.000Z",
      requestId: "req_1705614600000_vwx234",
      details: {
        retryAfter: 300,
        maintenanceMode: false,
      },
    },
  },
}

// 工具函数：根据错误代码获取错误信息
export function getErrorByCode(code: string): ErrorCodeInfo | null {
  return API_ERROR_CODES[code] || null
}

// 工具函数：根据HTTP状态码获取可能的错误
export function getErrorsByHttpStatus(status: number): ErrorCodeInfo[] {
  return Object.values(API_ERROR_CODES).filter((error) => error.httpStatus === status)
}

// 工具函数：获取所有错误代码
export function getAllErrorCodes(): string[] {
  return Object.keys(API_ERROR_CODES)
}

// 工具函数：根据分类获取错误
export function getErrorsByCategory(category: ErrorCodeInfo["category"]): ErrorCodeInfo[] {
  return Object.values(API_ERROR_CODES).filter((error) => error.category === category)
}

// 工具函数：根据严重程度获取错误
export function getErrorsBySeverity(severity: ErrorCodeInfo["severity"]): ErrorCodeInfo[] {
  return Object.values(API_ERROR_CODES).filter((error) => error.severity === severity)
}

// 导出默认错误响应格式
export const DEFAULT_ERROR_RESPONSE = {
  success: false,
  error: "Unknown error",
  code: "UNKNOWN_ERROR",
  timestamp: new Date().toISOString(),
  requestId: "req_unknown",
}
