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
