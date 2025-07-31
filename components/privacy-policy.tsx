"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Database, Users, Lock, AlertTriangle } from "lucide-react"

interface PrivacyPolicyProps {
  showHeader?: boolean
  compact?: boolean
}

export function PrivacyPolicy({ showHeader = true, compact = false }: PrivacyPolicyProps) {
  const sections = [
    {
      id: "collection",
      title: "信息收集",
      icon: Database,
      content: [
        "我们收集您主动提供的信息，如IP地址查询、域名查询等输入数据",
        "自动收集的技术信息，包括设备类型、操作系统、浏览器类型等",
        "网络测试数据，如下载/上传速度、延迟、连接质量等测试结果",
        "使用统计信息，如功能使用频率、测试次数等匿名化数据",
      ],
    },
    {
      id: "usage",
      title: "信息使用",
      icon: Eye,
      content: [
        "提供网络测速、诊断、安全检测等核心服务功��",
        "分析和改进服务质量，优化用户体验",
        "生成匿名化的统计报告，用于服务改进",
        "确保平台安全性，防范恶意攻击和滥用",
      ],
    },
    {
      id: "storage",
      title: "数据存储",
      icon: Lock,
      content: [
        "测试结果数据仅在本地浏览器中存储，不上传至服务器",
        "个人偏好设置保存在本地存储中",
        "匿名化统计数据可能被保存用于服务改进",
        "敏感信息采用加密存储，确保数据安全",
      ],
    },
    {
      id: "sharing",
      title: "信息共享",
      icon: Users,
      content: [
        "我们不会向第三方出售、交易或转让您的个人信息",
        "匿名化的统计数据可能用于公开的性能报告",
        "法律要求的情况下，可能需要配合相关部门调查",
        "服务合作伙伴可能需要访问部分技术数据以提供服务",
      ],
    },
    {
      id: "security",
      title: "数据安全",
      icon: Shield,
      content: [
        "采用行业标准的加密技术保护数据传输",
        "定期进行安全审计和漏洞检测",
        "严格的访问控制和权限管理机制",
        "数据备份和灾难恢复计划确保数据完整性",
      ],
    },
    {
      id: "rights",
      title: "您的权利",
      icon: AlertTriangle,
      content: [
        "您有权查看我们收集的关于您的信息",
        "您可以要求更正不准确的个人信息",
        "您可以要求删除您的个人数据",
        "您可以随时撤回对数据处理的同意",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">隐私政策</h2>
          <p className="text-muted-foreground">我们重视您的隐私并致力于保护您的个人信息</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline">版本 1.0.0</Badge>
            <Badge variant="outline">更新日期: 2024年12月</Badge>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            隐私承诺
          </CardTitle>
          <CardDescription>
            YYC³ NetTrack 致力于保护用户隐私，确保您的数据安全。本隐私政策说明我们如何收集、使用和保护您的信息。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">重要提示</h4>
            <p className="text-blue-700 text-sm">
              使用本平台的任何功能即表示您同意本隐私政策。我们承诺不会滥用您的数据，大部分数据仅在您的设备本地存储。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className={`space-y-4 ${compact ? "" : ""}`}>
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <section.icon className="w-5 h-5 text-blue-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            {index < sections.length - 1 && <Separator />}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>联系我们</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div>📧 邮箱: privacy@yyc3.com</div>
            <div>📞 电话: +86-400-123-4567</div>
            <div>📍 地址: 北京市朝阳区网络科技园区</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
