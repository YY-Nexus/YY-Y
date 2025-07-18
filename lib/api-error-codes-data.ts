export interface ErrorCodeInfo {
  code: string
  message: string
  description: string
  httpStatus: number
  category: "auth" | "validation" | "resource" | "server" | "network" | "rate_limit"
  solution?: string
  example?: {
    request?: any
    response: any
  }
}

export const API_ERROR_CODES: ErrorCodeInfo[] = [
  {
    code: "AUTH_001",
    message: "认证失败",
    description: "提供的认证凭据无效或已过期",
    httpStatus: 401,
    category: "auth",
    solution: "请检查API密钥或重新登录",
    example: {
      response: {
        error: {
          code: "AUTH_001",
          message: "认证失败",
          timestamp: "2024-01-18T21:18:00Z",
        },
      },
    },
  },
  {
    code: "AUTH_002",
    message: "权限不足",
    description: "当前用户没有执行此操作的权限",
    httpStatus: 403,
    category: "auth",
    solution: "请联系管理员获取相应权限",
    example: {
      response: {
        error: {
          code: "AUTH_002",
          message: "权限不足",
          required_permission: "admin:write",
        },
      },
    },
  },
  {
    code: "RATE_001",
    message: "请求频率超限",
    description: "请求频率超过了API限制",
    httpStatus: 429,
    category: "rate_limit",
    solution: "请降低请求频率或升级API套餐",
    example: {
      response: {
        error: {
          code: "RATE_001",
          message: "请求频率超限",
          retry_after: 60,
          limit: 100,
          remaining: 0,
        },
      },
    },
  },
  {
    code: "VALID_001",
    message: "参数验证失败",
    description: "请求参数格式不正确或缺少必需参数",
    httpStatus: 400,
    category: "validation",
    solution: "请检查请求参数格式和必需字段",
    example: {
      request: {
        email: "invalid-email",
        age: "not-a-number",
      },
      response: {
        error: {
          code: "VALID_001",
          message: "参数验证失败",
          details: [
            { field: "email", message: "邮箱格式不正确" },
            { field: "age", message: "年龄必须是数字" },
          ],
        },
      },
    },
  },
  {
    code: "RESOURCE_001",
    message: "资源不存在",
    description: "请求的资源未找到",
    httpStatus: 404,
    category: "resource",
    solution: "请检查资源ID是否正确",
    example: {
      response: {
        error: {
          code: "RESOURCE_001",
          message: "资源不存在",
          resource_type: "user",
          resource_id: "12345",
        },
      },
    },
  },
  {
    code: "RESOURCE_002",
    message: "资源冲突",
    description: "资源已存在或存在冲突",
    httpStatus: 409,
    category: "resource",
    solution: "请使用不同的标识符或更新现有资源",
    example: {
      response: {
        error: {
          code: "RESOURCE_002",
          message: "资源冲突",
          conflict_field: "email",
          existing_value: "user@example.com",
        },
      },
    },
  },
  {
    code: "SERVER_001",
    message: "内部服务器错误",
    description: "服务器处理请求时发生内部错误",
    httpStatus: 500,
    category: "server",
    solution: "请稍后重试，如问题持续请联系技术支持",
    example: {
      response: {
        error: {
          code: "SERVER_001",
          message: "内部服务器错误",
          request_id: "req_123456789",
          timestamp: "2024-01-18T21:18:00Z",
        },
      },
    },
  },
  {
    code: "NETWORK_001",
    message: "网络连接超时",
    description: "请求处理超时",
    httpStatus: 408,
    category: "network",
    solution: "请检查网络连接并重试",
    example: {
      response: {
        error: {
          code: "NETWORK_001",
          message: "网络连接超时",
          timeout_duration: 30000,
          retry_suggested: true,
        },
      },
    },
  },
]

// 工具函数
export const getErrorByCode = (code: string): ErrorCodeInfo | undefined => {
  return API_ERROR_CODES.find((error) => error.code === code)
}

export const getErrorsByCategory = (category: ErrorCodeInfo["category"]): ErrorCodeInfo[] => {
  return API_ERROR_CODES.filter((error) => error.category === category)
}

export const getErrorByHttpStatus = (status: number): ErrorCodeInfo[] => {
  return API_ERROR_CODES.filter((error) => error.httpStatus === status)
}

export const getAllErrorCodes = (): string[] => {
  return API_ERROR_CODES.map((error) => error.code)
}
