/**
 * API错误代码和详细说明
 */

export interface ErrorCodeInfo {
  code: string;
  message: string;
  description: string;
  httpStatus: number;
  possibleCauses: string[];
  solutions: string[];
  example?: {
    request?: string;
    response: string;
  };
}

export const API_ERROR_CODES: ErrorCodeInfo[] = [
  {
    code: 'AUTH_001',
    message: '无效的API密钥',
    description: '提供的API密钥无效或不存在',
    httpStatus: 401,
    possibleCauses: [
      'API密钥输入错误',
      'API密钥已被撤销',
      'API密钥格式不正确'
    ],
    solutions: [
      '检查API密钥是否正确输入',
      '在控制台中重新生成API密钥',
      '确保API密钥以正确的格式包含在请求头中'
    ],
    example: {
      response: `{
  "error": {
    "code": "AUTH_001",
    "message": "无效的API密钥",
    "details": {
      "header": "X-API-KEY"
    }
  }
}`
    }
  },
  {
    code: 'AUTH_002',
    message: '过期的访问令牌',
    description: '提供的访问令牌已过期',
    httpStatus: 401,
    possibleCauses: [
      '令牌已超过有效期',
      '系统时间不同步'
    ],
    solutions: [
      '使用刷新令牌获取新的访问令牌',
      '重新登录获取新的访问令牌',
      '检查系统时间是否正确'
    ],
    example: {
      response: `{
  "error": {
    "code": "AUTH_002",
    "message": "过期的访问令牌",
    "details": {
      "expiredAt": "2023-10-15T08:30:00Z"
    }
  }
}`
    }
  },
  {
    code: 'AUTH_003',
    message: '缺少认证信息',
    description: '请求中未包含必要的认证信息',
    httpStatus: 401,
    possibleCauses: [
      '请求头中缺少认证字段',
      '认证信息未正确设置',
      '请求未通过认证中间件'
    ],
    solutions: [
      '检查请求头中是否包含正确的认证字段',
      '确认认证信息的格式和值是否正确',
      '验证认证中间件配置是否正确'
    ],
    example: {
      response: `{
  "error": {
    "code": "AUTH_003",
    "message": "缺少认证信息",
    "details": "Authorization header is missing"
  }
}`
    }
  },
  {
    code: 'AUTH_004',
    message: '权限不足',
    description: '当前用户没有执行该操作的权限',
    httpStatus: 403,
    possibleCauses: [
      '用户角色权限不足',
      'API需要特定权限访问',
      '令牌权限范围不足'
    ],
    solutions: [
      '联系管理员提升用户权限',
      '检查API文档确认所需权限',
      '使用具有足够权限的令牌重新认证'
    ],
    example: {
      request: 'GET /admin/users',
      response: `{
  "error": {
    "code": "AUTH_004",
    "message": "权限不足",
    "details": {
      "requiredRole": "admin",
      "currentRole": "user"
    }
  }
}`
    }
  },
  {
    code: 'VALIDATION_001',
    message: '无效的请求参数',
    description: '请求中包含无效或格式不正确的参数',
    httpStatus: 400,
    possibleCauses: [
      '参数类型不匹配',
      '缺少必需参数',
      '参数值超出允许范围'
    ],
    solutions: [
      '检查请求参数是否符合API文档规范',
      '验证参数类型和格式',
      '补充缺失的必需参数'
    ],
    example: {
      request: 'POST /users?age=abc',
      response: `{
  "error": {
    "code": "VALIDATION_001",
    "message": "无效的请求参数",
    "details": {
      "age": "Expected number, received string"
    }
  }
}`
    }
  },
  {
    code: 'RESOURCE_001',
    message: '资源不存在',
    description: '请求的资源不存在或已被删除',
    httpStatus: 404,
    possibleCauses: [
      '资源ID错误',
      '资源已被删除',
      '请求路径不正确'
    ],
    solutions: [
      '验证资源ID是否正确',
      '检查资源是否已被删除',
      '确认请求路径是否符合API文档'
    ],
    example: {
      request: 'GET /users/999',
      response: `{
  "error": {
    "code": "RESOURCE_001",
    "message": "资源不存在",
    "details": {
      "resourceType": "user",
      "resourceId": "999"
    }
  }
}`
    }
  },
  {
    code: 'RATE_LIMIT_001',
    message: '请求频率超限',
    description: '请求频率超过了API限制',
    httpStatus: 429,
    possibleCauses: [
      '短时间内发送大量请求',
      '未遵守API速率限制规则',
      '共享IP地址被限流'
    ],
    solutions: [
      '降低请求频率',
      '实现请求重试机制',
      '升级API访问权限'
    ],
    example: {
      response: `{
  "error": {
    "code": "RATE_LIMIT_001",
    "message": "请求频率超限",
    "details": {
      "limit": "100 requests per minute",
      "retryAfter": "30 seconds"
    }
  }
}`
    }
  },
  {
    code: 'SERVER_001',
    message: '内部服务器错误',
    description: '服务器处理请求时发生未知错误',
    httpStatus: 500,
    possibleCauses: [
      '服务器临时故障',
      '数据库连接问题',
      '代码逻辑异常'
    ],
    solutions: [
      '稍后重试请求',
      '检查服务状态页面获取最新信息',
      '联系API支持团队'
    ],
    example: {
      response: `{
  "error": {
    "code": "SERVER_001",
    "message": "内部服务器错误",
    "details": "An unexpected error occurred"
  }
}`
    }
  }
];
