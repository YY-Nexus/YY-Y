/**
 * Swagger配置文件 - 定义API文档的结构和内容
 */
export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "YYC³-NetTrack API",
    version: "1.2.0",
    description: "网络测试、诊断和安全检测的完整API文档",
    contact: {
      name: "YYC³技术支持",
      url: "https://yyc3.tech/support",
      email: "api-support@yyc3.tech",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.nettrack.yyc3.tech/v1",
      description: "生产环境",
    },
    {
      url: "https://staging-api.nettrack.yyc3.tech/v1",
      description: "预发布环境",
    },
    {
      url: "http://localhost:3000/api",
      description: "本地开发环境",
    },
  ],
  tags: [
    {
      name: "网络测速",
      description: "测量网络下载和上传速度的API",
    },
    {
      name: "网络诊断",
      description: "诊断网络连接问题的API",
    },
    {
      name: "性能测试",
      description: "测试网络性能和延迟的API",
    },
    {
      name: "安全检测",
      description: "检测网络安全问题的API",
    },
    {
      name: "系统状态",
      description: "检查API系统状态的端点",
    },
    {
      name: "用户反馈",
      description: "提交和管理用户反馈的API",
    },
    {
      name: "监控",
      description: "网络监控和报警的API",
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-KEY",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          code: {
            type: "string",
          },
          message: {
            type: "string",
          },
          details: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
      SpeedTestResult: {
        type: "object",
        properties: {
          downloadSpeed: {
            type: "number",
            description: "下载速度 (Mbps)",
          },
          uploadSpeed: {
            type: "number",
            description: "上传速度 (Mbps)",
          },
          latency: {
            type: "number",
            description: "延迟 (ms)",
          },
          jitter: {
            type: "number",
            description: "抖动 (ms)",
          },
          timestamp: {
            type: "string",
            format: "date-time",
          },
          isp: {
            type: "string",
            description: "互联网服务提供商",
          },
          serverLocation: {
            type: "string",
            description: "测试服务器位置",
          },
        },
      },
      NetworkDiagnosisResult: {
        type: "object",
        properties: {
          connectionStatus: {
            type: "string",
            enum: ["正常", "不稳定", "断开", "受限"],
          },
          packetLoss: {
            type: "number",
            description: "丢包率 (%)",
          },
          routeHops: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hop: {
                  type: "number",
                },
                host: {
                  type: "string",
                },
                ip: {
                  type: "string",
                },
                responseTime: {
                  type: "number",
                },
              },
            },
          },
          dnsResolutionTime: {
            type: "number",
            description: "DNS解析时间 (ms)",
          },
          issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["DNS", "路由", "连接", "带宽", "其他"],
                },
                severity: {
                  type: "string",
                  enum: ["低", "中", "高", "严重"],
                },
                description: {
                  type: "string",
                },
                recommendation: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      PerformanceTestResult: {
        type: "object",
        properties: {
          loadTime: {
            type: "number",
            description: "页面加载时间 (ms)",
          },
          ttfb: {
            type: "number",
            description: "首字节时间 (ms)",
          },
          domComplete: {
            type: "number",
            description: "DOM完成时间 (ms)",
          },
          resourceLoadTimes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                duration: {
                  type: "number",
                },
                size: {
                  type: "number",
                },
              },
            },
          },
          performanceScore: {
            type: "number",
            description: "性能评分 (0-100)",
          },
          recommendations: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      SecurityScanResult: {
        type: "object",
        properties: {
          overallRisk: {
            type: "string",
            enum: ["低", "中", "高", "严重"],
          },
          vulnerabilities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                },
                severity: {
                  type: "string",
                  enum: ["低", "中", "高", "严重"],
                },
                description: {
                  type: "string",
                },
                affectedComponent: {
                  type: "string",
                },
                remediation: {
                  type: "string",
                },
              },
            },
          },
          secureConnectionStatus: {
            type: "boolean",
          },
          certificateInfo: {
            type: "object",
            properties: {
              issuer: {
                type: "string",
              },
              validFrom: {
                type: "string",
                format: "date-time",
              },
              validTo: {
                type: "string",
                format: "date-time",
              },
              isValid: {
                type: "boolean",
              },
            },
          },
          securityHeaders: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
        },
      },
      FeedbackSubmission: {
        type: "object",
        required: ["email", "message"],
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          message: {
            type: "string",
          },
          category: {
            type: "string",
            enum: ["错误报告", "功能请求", "一般反馈", "其他"],
          },
          attachments: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
      HealthStatus: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["正常", "部分可用", "维护中", "故障"],
          },
          version: {
            type: "string",
          },
          uptime: {
            type: "number",
          },
          services: {
            type: "object",
            additionalProperties: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["正常", "降级", "故障"],
                },
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      MonitoringConfig: {
        type: "object",
        properties: {
          targetUrl: {
            type: "string",
            format: "uri",
          },
          interval: {
            type: "number",
            description: "监控间隔 (分钟)",
          },
          alertThresholds: {
            type: "object",
            properties: {
              responseTime: {
                type: "number",
              },
              availability: {
                type: "number",
              },
            },
          },
          notificationChannels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["email", "sms", "webhook", "wechat"],
                },
                target: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/network/test": {
      post: {
        tags: ["网络测速"],
        summary: "执行网络速度测试",
        description: "测量当前网络连接的下载和上传速度以及延迟",
        operationId: "runSpeedTest",
        parameters: [
          {
            name: "server",
            in: "query",
            description: "测试服务器ID",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "duration",
            in: "query",
            description: "测试持续时间(秒)",
            required: false,
            schema: {
              type: "integer",
              default: 10,
            },
          },
        ],
        responses: {
          "200": {
            description: "速度测试结果",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SpeedTestResult",
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["网络测速"],
        summary: "获取最近的速度测试结果",
        description: "获取用户最近的网络速度测试结果",
        operationId: "getRecentSpeedTests",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "返回结果数量",
            required: false,
            schema: {
              type: "integer",
              default: 5,
            },
          },
        ],
        security: [
          {
            apiKey: [],
          },
        ],
        responses: {
          "200": {
            description: "最近的速度测试结果列表",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/SpeedTestResult",
                  },
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/network/diagnosis": {
      post: {
        tags: ["网络诊断"],
        summary: "执行网络诊断",
        description: "诊断网络连接问题并提供解决方案",
        operationId: "runNetworkDiagnosis",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  target: {
                    type: "string",
                    description: "目标主机名或IP地址",
                    example: "example.com",
                  },
                  diagnosticType: {
                    type: "string",
                    enum: ["基本", "完整", "高级"],
                    default: "基本",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "网络诊断结果",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NetworkDiagnosisResult",
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/performance/test": {
      post: {
        tags: ["性能测试"],
        summary: "执行网站性能测试",
        description: "测试网站加载性能并提供优化建议",
        operationId: "runPerformanceTest",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: {
                    type: "string",
                    format: "uri",
                    description: "要测试的网站URL",
                  },
                  device: {
                    type: "string",
                    enum: ["desktop", "mobile", "tablet"],
                    default: "desktop",
                  },
                  connection: {
                    type: "string",
                    enum: ["4g", "3g", "slow-3g", "offline"],
                    default: "4g",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "性能测试结果",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PerformanceTestResult",
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/security/scan": {
      post: {
        tags: ["安全检测"],
        summary: "执行网站安全扫描",
        description: "扫描网站安全漏洞并提供修复建议",
        operationId: "runSecurityScan",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: {
                    type: "string",
                    format: "uri",
                    description: "要扫描的网站URL",
                  },
                  scanDepth: {
                    type: "string",
                    enum: ["基本", "标准", "深度"],
                    default: "标准",
                  },
                  includeCookies: {
                    type: "boolean",
                    default: false,
                  },
                },
              },
            },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
        responses: {
          "200": {
            description: "安全扫描结果",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SecurityScanResult",
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["系统状态"],
        summary: "获取API系统状态",
        description: "检查API系统的健康状态和各个服务的可用性",
        operationId: "getHealthStatus",
        responses: {
          "200": {
            description: "系统状态信息",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthStatus",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/feedback": {
      post: {
        tags: ["用户反馈"],
        summary: "提交用户反馈",
        description: "提交用户反馈、错误报告或功能请求",
        operationId: "submitFeedback",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/FeedbackSubmission",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "反馈提交成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/monitor": {
      post: {
        tags: ["监控"],
        summary: "创建网站监控",
        description: "创建新的网站监控配置",
        operationId: "createMonitor",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MonitoringConfig",
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "201": {
            description: "监控创建成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["监控"],
        summary: "获取监控配置列表",
        description: "获取用户的所有监控配置",
        operationId: "getMonitors",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "监控配置列表",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/MonitoringConfig",
                      },
                      {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                          },
                          status: {
                            type: "string",
                            enum: ["活跃", "暂停", "错误"],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/monitor/{id}": {
      get: {
        tags: ["监控"],
        summary: "获取监控配置详情",
        description: "获取特定监控配置的详细信息",
        operationId: "getMonitorById",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "监控配置ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "监控配置详情",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/MonitoringConfig",
                    },
                    {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        status: {
                          type: "string",
                          enum: ["活跃", "暂停", "错误"],
                        },
                        lastCheck: {
                          type: "object",
                          properties: {
                            timestamp: {
                              type: "string",
                              format: "date-time",
                            },
                            status: {
                              type: "string",
                              enum: ["成功", "失败", "超时"],
                            },
                            responseTime: {
                              type: "number",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "监控配置不存在",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["监控"],
        summary: "更新监控配置",
        description: "更新特定监控配置的信息",
        operationId: "updateMonitor",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "监控配置ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MonitoringConfig",
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "监控配置更新成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "无效的请求参数",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "监控配置不存在",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["监控"],
        summary: "删除监控配置",
        description: "删除特定的监控配置",
        operationId: "deleteMonitor",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "监控配置ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "204": {
            description: "监控配置删除成功",
          },
          "401": {
            description: "未授权",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "监控配置不存在",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "服务器错误",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
}

/**
 * API错误代码定义
 */
export const apiErrorCodes = {
  AUTH_001: "无效的API密钥",
  AUTH_002: "过期的访问令牌",
  AUTH_003: "权限不足",
  AUTH_004: "请求超出速率限制",
  REQ_001: "缺少必需参数",
  REQ_002: "无效的参数值",
  REQ_003: "不支持的内容类型",
  NET_001: "网络测试服务器不可用",
  NET_002: "网络连接中断",
  NET_003: "目标主机无法访问",
  PERF_001: "性能测试超时",
  PERF_002: "无法加载目标URL",
  SEC_001: "安全扫描失败",
  SEC_002: "无法验证SSL证书",
  SYS_001: "内部服务器错误",
  SYS_002: "服务暂时不可用",
  SYS_003: "数据库连接错误",
}

/**
 * API版本信息
 */
export const apiVersions = [
  {
    version: "v1",
    status: "稳定",
    releaseDate: "2023-06-01",
    endOfLife: "2024-12-31",
    baseUrl: "https://api.nettrack.yyc3.tech/v1",
  },
  {
    version: "v2",
    status: "测试",
    releaseDate: "2023-11-15",
    endOfLife: null,
    baseUrl: "https://api.nettrack.yyc3.tech/v2",
  },
]

// 向后兼容性别名
export const swaggerDefinition = swaggerConfig
