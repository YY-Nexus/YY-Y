/**
 * API错误代码和详细说明
 */

export interface ErrorCodeInfo {
  code: string
  message: string
  description: string
  httpStatus: number
  possibleCauses: string[]
  solutions: string[]
  example?: {
    request?: string
    response: string
  }
}

export const API_ERROR_CODES: ErrorCodeInfo[] = [
  {
    code: "AUTH_001",
    message: "无效的API密钥",
    description: "提供的API密钥无效或不存在",
    httpStatus: 401,
    possibleCauses: ["API密钥输入错误", "API密钥已被撤销", "API密钥格式不正确"],
    solutions: ["检查API密钥是否正确输入", "在控制台中重新生成API密钥", "确保API密钥以正确的格式包含在请求头中"],
    example: {
      response: `{
  "error": {
    "code": "AUTH_001",
    "message": "无效的API密钥",
    "details": {
      "header": "X-API-KEY"
    }
  }
}`,
    },
  },
  {
    code: "AUTH_002",
    message: "过期的访问令牌",
    description: "提供的访问令牌已过期",
    httpStatus: 401,
    possibleCauses: ["令牌已超过有效期", "系统时间不同步"],
    solutions: ["使用刷新令牌获取新的访问令牌", "重新登录获取新的访问令牌", "检查系统时间是否正确"],
    example: {
      response: `{
  "error": {
    "code": "AUTH_002",
    "message": "过期的访问令牌",
    "details": {
      "expiredAt": "2023-10-15T08:30:00Z"
    }
  }
}`,
    },
  },
  {
    code: "AUTH_003",
    message: "权限不足",
    description: "当前用户没有执行此操作的权限",
    httpStatus: 403,
    possibleCauses: ["用户角色权限不足", "资源访问权限未授予", "操作超出用户权限范围"],
    solutions: ["联系管理员提升权限", "检查用户角色配置", "确认操作是否在权限范围内"],
    example: {
      response: `{
  "error": {
    "code": "AUTH_003",
    "message": "权限不足",
    "details": {
      "requiredPermission": "admin:write",
      "userPermissions": ["user:read", "user:write"]
    }
  }
}`,
    },
  },
  {
    code: "RATE_001",
    message: "请求频率超限",
    description: "请求频率超过了API限制",
    httpStatus: 429,
    possibleCauses: ["短时间内发送过多请求", "未正确实现请求间隔", "多个客户端使用同一API密钥"],
    solutions: ["减少请求频率", "实现指数退避重试机制", "升级到更高的API配额"],
    example: {
      response: `{
  "error": {
    "code": "RATE_001",
    "message": "请求频率超限",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2023-10-15T09:00:00Z"
    }
  }
}`,
    },
  },
  {
    code: "VALIDATION_001",
    message: "请求参数无效",
    description: "请求中包含无效或缺失的参数",
    httpStatus: 400,
    possibleCauses: ["必需参数缺失", "参数格式不正确", "参数值超出允许范围"],
    solutions: ["检查API文档确认必需参数", "验证参数格式和类型", "确保参数值在有效范围内"],
    example: {
      response: `{
  "error": {
    "code": "VALIDATION_001",
    "message": "请求参数无效",
    "details": {
      "field": "email",
      "issue": "格式不正确",
      "expected": "有效的邮箱地址"
    }
  }
}`,
    },
  },
  {
    code: "RESOURCE_001",
    message: "资源未找到",
    description: "请求的资源不存在",
    httpStatus: 404,
    possibleCauses: ["资源ID不正确", "资源已被删除", "URL路径错误"],
    solutions: ["检查资源ID是否正确", "确认资源是否存在", "验证API端点URL"],
    example: {
      response: `{
  "error": {
    "code": "RESOURCE_001",
    "message": "资源未找到",
    "details": {
      "resourceType": "user",
      "resourceId": "12345"
    }
  }
}`,
    },
  },
  {
    code: "SERVER_001",
    message: "内部服务器错误",
    description: "服务器处理请求时发生内部错误",
    httpStatus: 500,
    possibleCauses: ["服务器内部异常", "数据库连接问题", "第三方服务不可用"],
    solutions: ["稍后重试请求", "联系技术支持", "检查服务状态页面"],
    example: {
      response: `{
  "error": {
    "code": "SERVER_001",
    "message": "内部服务器错误",
    "details": {
      "requestId": "req_abc123",
      "timestamp": "2023-10-15T08:30:00Z"
    }
  }
}`,
    },
  },
  {
    code: "NETWORK_001",
    message: "网络连接超时",
    description: "网络请求超时",
    httpStatus: 408,
    possibleCauses: ["网络连接不稳定", "服务器响应缓慢", "请求数据量过大"],
    solutions: ["检查网络连接", "增加请求超时时间", "分批处理大量数据"],
    example: {
      response: `{
  "error": {
    "code": "NETWORK_001",
    "message": "网络连接超时",
    "details": {
      "timeout": "30s",
      "endpoint": "/api/v1/data"
    }
  }
}`,
    },
  },
]

export function getErrorByCode(code: string): ErrorCodeInfo | undefined {
  return API_ERROR_CODES.find((error) => error.code === code)
}

export function getErrorsByHttpStatus(status: number): ErrorCodeInfo[] {
  return API_ERROR_CODES.filter((error) => error.httpStatus === status)
}

export function getAllErrorCodes(): string[] {
  return API_ERROR_CODES.map((error) => error.code)
}
