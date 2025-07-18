"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, XCircle, Scan } from "lucide-react"
import { UniversalQueryAnimation } from "@/components/universal-query-animation"

interface SecurityCheck {
  id: string
  name: string
  status: "safe" | "warning" | "danger" | "checking"
  description: string
  recommendation?: string
}

export function SecurityDetectionModule() {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [checks, setChecks] = useState<SecurityCheck[]>([])

  const securityChecks = [
    {
      id: "ssl",
      name: "SSL/TLS 加密",
      description: "检查连接是否使用安全加密协议",
    },
    {
      id: "dns",
      name: "DNS 安全",
      description: "检测DNS劫持和污染风险",
    },
    {
      id: "firewall",
      name: "防火墙状态",
      description: "检查网络防火墙配置",
    },
    {
      id: "ports",
      name: "开放端口",
      description: "扫描潜在的安全风险端口",
    },
    {
      id: "malware",
      name: "恶意软件检测",
      description: "检查网络流量中的恶意内容",
    },
  ]

  const runSecurityScan = async () => {
    setIsScanning(true)
    setProgress(0)
    setChecks([])

    try {
      for (let i = 0; i < securityChecks.length; i++) {
        const check = securityChecks[i]

        // 设置为检查中状态
        setChecks((prev) => [...prev, { ...check, status: "checking" }])

        // 模拟检查延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 随机生成检查结果
        const statuses: ("safe" | "warning" | "danger")[] = ["safe", "warning", "danger"]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        const recommendations = {
          ssl: "建议启用HTTPS加密连接",
          dns: "建议使用安全的DNS服务器",
          firewall: "建议配置适当的防火墙规则",
          ports: "建议关闭不必要的开放端口",
          malware: "建议安装最新的安全软件",
        }

        setChecks((prev) =>
          prev.map((c) =>
            c.id === check.id
              ? {
                  ...c,
                  status: randomStatus,
                  recommendation:
                    randomStatus !== "safe" ? recommendations[check.id as keyof typeof recommendations] : undefined,
                }
              : c,
          ),
        )

        setProgress(((i + 1) / securityChecks.length) * 100)
      }
    } catch (error) {
      console.error("安全扫描失败:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "danger":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "checking":
        return <Scan className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "safe":
        return <Badge className="bg-green-100 text-green-800">安全</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>
      case "danger":
        return <Badge className="bg-red-100 text-red-800">危险</Badge>
      case "checking":
        return <Badge className="bg-blue-100 text-blue-800">检查中</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getOverallStatus = () => {
    if (checks.length === 0) return null

    const dangerCount = checks.filter((c) => c.status === "danger").length
    const warningCount = checks.filter((c) => c.status === "warning").length

    if (dangerCount > 0) return { level: "danger", message: `发现 ${dangerCount} 个严重安全风险` }
    if (warningCount > 0) return { level: "warning", message: `发现 ${warningCount} 个安全警告` }
    return { level: "safe", message: "网络安全状况良好" }
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">安全检测</h2>
        <p className="text-muted-foreground">全面检测网络安全威胁和漏洞风险</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            网络安全扫描
          </CardTitle>
          <CardDescription>检测潜在的安全威胁和漏洞</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isScanning && checks.length === 0 && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <Button onClick={runSecurityScan} size="lg">
                <Scan className="w-5 h-5 mr-2" />
                开始安全扫描
              </Button>
            </div>
          )}

          {isScanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center">
                <UniversalQueryAnimation
                  size="xl"
                  progress={progress}
                  showProgress={true}
                  showText={true}
                  text="正在扫描安全威胁"
                  subText="检测潜在风险和漏洞..."
                  variant="pulse"
                  color="red"
                  icon={<Shield className="w-12 h-12 text-red-600" />}
                />
              </div>
            </motion.div>
          )}

          {checks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {overallStatus && (
                <Alert
                  className={
                    overallStatus.level === "danger"
                      ? "border-red-200 bg-red-50"
                      : overallStatus.level === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-green-200 bg-green-50"
                  }
                >
                  <AlertDescription className="flex items-center gap-2">
                    {overallStatus.level === "danger" && <XCircle className="w-4 h-4 text-red-600" />}
                    {overallStatus.level === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {overallStatus.level === "safe" && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {overallStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {checks.map((check) => (
                  <Card key={check.id} className="border-l-4 border-l-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="font-semibold">{check.name}</div>
                            <div className="text-sm text-muted-foreground">{check.description}</div>
                            {check.recommendation && (
                              <div className="text-sm text-orange-600 mt-1">💡 {check.recommendation}</div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(check.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!isScanning && (
                <div className="text-center">
                  <Button onClick={runSecurityScan} variant="outline">
                    <Scan className="w-4 h-4 mr-2" />
                    重新扫描
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
