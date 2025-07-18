/**
 * API版本信息和变更记录
 */

export interface ApiVersion {
  version: string
  status: "开发中" | "测试" | "稳定" | "弃用" | "停用"
  releaseDate: string
  endOfLife: string | null
  baseUrl: string
  major_changes?: string[]
}

export const API_VERSIONS: ApiVersion[] = [
  {
    version: "v1",
    status: "稳定",
    releaseDate: "2023-06-01",
    endOfLife: "2024-12-31",
    baseUrl: "https://api.nettrack.yyc3.tech/v1",
    major_changes: ["初始API版本", "包含基本的网络测速、诊断、性能测试和安全检测功能", "支持用户反馈和系统状态检查"],
  },
  {
    version: "v2",
    status: "测试",
    releaseDate: "2023-11-15",
    endOfLife: null,
    baseUrl: "https://api.nettrack.yyc3.tech/v2",
    major_changes: [
      "增加了批量测试功能",
      "改进了安全扫描的深度和准确性",
      "添加了网络监控和报警功能",
      "支持更多的认证方式",
      "优化了API响应格式",
    ],
  },
  {
    version: "v3",
    status: "开发中",
    releaseDate: "2024-06-01",
    endOfLife: null,
    baseUrl: "https://api.nettrack.yyc3.tech/v3",
    major_changes: [
      "支持WebSocket实时数据流",
      "添加高级数据分析功能",
      "支持自定义测试场景",
      "增加企业级安全合规检查",
      "支持多区域测试节点",
    ],
  },
]

export interface VersionChange {
  version: string
  date: string
  type: "新增" | "修改" | "修复" | "弃用" | "安全"
  description: string
  breaking?: boolean
}

export const VERSION_CHANGES: VersionChange[] = [
  {
    version: "v2.3.0",
    date: "2023-12-15",
    type: "新增",
    description: "添加了网络监控的WebHook通知支持",
  },
  {
    version: "v2.2.1",
    date: "2023-11-28",
    type: "修复",
    description: "修复了安全扫描在某些HTTPS网站上的错误",
  },
  {
    version: "v2.2.0",
    date: "2023-11-20",
    type: "新增",
    description: "添加了微信通知渠道支持",
  },
  {
    version: "v2.1.0",
    date: "2023-11-15",
    type: "新增",
    description: "添加了网络监控API",
  },
  {
    version: "v2.0.0",
    date: "2023-11-01",
    type: "新增",
    description: "v2 API发布，包含多项新功能和改进",
    breaking: true,
  },
  {
    version: "v1.5.2",
    date: "2023-10-15",
    type: "安全",
    description: "修复了API密钥验证中的安全漏洞",
  },
  {
    version: "v1.5.1",
    date: "2023-09-20",
    type: "修复",
    description: "修复了性能测试在移动设备模拟时的问题",
  },
  {
    version: "v1.5.0",
    date: "2023-09-01",
    type: "新增",
    description: "添加了更多的性能测试指标",
  },
  {
    version: "v1.4.0",
    date: "2023-08-15",
    type: "新增",
    description: "添加了安全扫描的深度选项",
  },
  {
    version: "v1.3.0",
    date: "2023-07-20",
    type: "新增",
    description: "添加了网络诊断的高级选项",
  },
  {
    version: "v1.2.1",
    date: "2023-07-05",
    type: "修复",
    description: "修复了速度测试在某些网络环境下的准确性问题",
  },
  {
    version: "v1.2.0",
    date: "2023-06-20",
    type: "新增",
    description: "添加了用户反馈附件支持",
  },
  {
    version: "v1.1.0",
    date: "2023-06-10",
    type: "新增",
    description: "添加了系统状态API",
  },
  {
    version: "v1.0.0",
    date: "2023-06-01",
    type: "新增",
    description: "初始API版本发布",
  },
]

export interface DeprecationNotice {
  feature: string
  deprecatedIn: string
  removeIn: string
  alternative: string
  details: string
}

export const DEPRECATION_NOTICES: DeprecationNotice[] = [
  {
    feature: "/v1/network/test?format=xml",
    deprecatedIn: "v1.3.0",
    removeIn: "v2.0.0",
    alternative: "使用标准JSON响应格式",
    details: "XML响应格式将在v2.0.0中移除，请使用标准的JSON响应格式。",
  },
  {
    feature: "/v1/performance/test/legacy",
    deprecatedIn: "v1.4.0",
    removeIn: "v2.0.0",
    alternative: "使用新的/v1/performance/test端点",
    details: "旧版性能测试API将在v2.0.0中移除，请迁移到新的性能测试API。",
  },
  {
    feature: "Basic认证",
    deprecatedIn: "v1.5.0",
    removeIn: "v2.0.0",
    alternative: "使用API密钥或Bearer令牌认证",
    details: "基本认证方式将在v2.0.0中移除，请迁移到更安全的API密钥或Bearer令牌认证。",
  },
]
