/**
 * API变更日志数据
 */

export interface ChangelogEntry {
  version: string
  releaseDate: string
  highlights: string[]
  details: {
    added?: string[]
    changed?: string[]
    fixed?: string[]
    deprecated?: string[]
    removed?: string[]
    security?: string[]
  }
  breakingChanges?: string[]
}

export const API_CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.3.0",
    releaseDate: "2023-12-15",
    highlights: ["添加了网络监控的WebHook通知支持", "改进了API文档和示例"],
    details: {
      added: ["监控API现在支持WebHook通知", "添加了更多的API使用示例", "添加了批量测试结果导出功能"],
      changed: ["优化了监控API的响应时间", "改进了API文档的结构和内容"],
      fixed: ["修复了监控配置更新时的验证问题"],
    },
  },
  {
    version: "v2.2.1",
    releaseDate: "2023-11-28",
    highlights: ["修复了安全扫描在某些HTTPS网站上的错误"],
    details: {
      fixed: ["修复了安全扫描在处理某些HTTPS证书时的错误", "修复了结果缓存的问题"],
    },
  },
  {
    version: "v2.2.0",
    releaseDate: "2023-11-20",
    highlights: ["添加了微信通知渠道支持", "改进了监控API的性能"],
    details: {
      added: ["监控API现在支持微信通知", "添加了更多的监控指标"],
      changed: ["优化了监控API的性能", "改进了通知消息的格式"],
    },
  },
  {
    version: "v2.1.0",
    releaseDate: "2023-11-15",
    highlights: ["添加了网络监控API", "改进了API响应格式"],
    details: {
      added: ["添加了网络监控API", "添加了监控配置管理功能", "添加了通知渠道配置"],
      changed: ["统一了所有API的响应格式", "改进了错误处理和报告"],
    },
  },
  {
    version: "v2.0.0",
    releaseDate: "2023-11-01",
    highlights: ["v2 API正式发布", "包含多项新功能和改进", "不兼容v1的部分功能"],
    details: {
      added: ["添加了批量测试功能", "添加了更多的安全扫描选项", "添加了更多的性能测试指标", "添加了API密钥管理功能"],
      changed: ["改进了API的响应格式", "优化了所有API的性能", "增强了安全扫描的深度和准确性"],
      removed: ["移除了XML响应格式支持", "移除了旧版性能测试API", "移除了基本认证方式"],
    },
    breakingChanges: ["所有API路径从/api/变更为/v2/", "响应格式结构发生变化", "认证方式变更为API密钥或Bearer令牌"],
  },
  {
    version: "v1.5.2",
    releaseDate: "2023-10-15",
    highlights: ["修复了API密钥验证中的安全漏洞"],
    details: {
      security: ["修复了API密钥验证中的安全漏洞", "增强了API请求的安全检查"],
    },
  },
  {
    version: "v1.5.1",
    releaseDate: "2023-09-20",
    highlights: ["修复了性能测试在移动设备模拟时的问题"],
    details: {
      fixed: ["修复了性能测试在移动设备模拟时的问题", "修复了结果报告中的格式错误"],
    },
  },
  {
    version: "v1.5.0",
    releaseDate: "2023-09-01",
    highlights: ["添加了更多的性能测试指标", "弃用了基本认证方式"],
    details: {
      added: ["添加了更多的性能测试指标", "添加了API密钥认证支持"],
      deprecated: ["弃用了基本认证方式，将在v2.0.0中移除"],
    },
  },
  {
    version: "v1.0.0",
    releaseDate: "2023-06-01",
    highlights: ["初始API版本发布", "包含基本的网络测试功能"],
    details: {
      added: ["网络速度测试API", "网络诊断API", "性能测试API", "安全检测API", "用户反馈API"],
    },
  },
]
