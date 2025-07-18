"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Network,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Server,
  Wifi,
  Activity,
  RefreshCw,
  Download,
  Copy,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react"
import { UniversalQueryAnimation } from "@/components/universal-query-animation"

interface DiagnosisResult {
  id: string
  timestamp: Date
  target: string
  type: "ping" | "traceroute" | "dns" | "port" | "comprehensive"
  status: "success" | "failed" | "timeout" | "partial"
  data: any
  duration: number
  score?: number
}

interface PingResult {
  host: string
  packets_sent: number
  packets_received: number
  packet_loss: number
  min_time: number
  max_time: number
  avg_time: number
  times: number[]
  jitter: number
}

interface TracerouteHop {
  hop: number
  ip: string
  hostname?: string
  times: number[]
  status: "success" | "timeout" | "failed"
  location?: string
  asn?: string
}

interface DNSRecord {
  type: string
  name: string
  value: string
  ttl: number
}

interface PortScanResult {
  port: number
  status: "open" | "closed" | "filtered"
  service?: string
  banner?: string
  response_time?: number
}

interface ComprehensiveResult {
  ping: PingResult
  traceroute: TracerouteHop[]
  dns: DNSRecord[]
  ports: PortScanResult[]
  security: {
    ssl_grade?: string
    vulnerabilities: string[]
    recommendations: string[]
  }
  performance: {
    cdn_detected: boolean
    cache_headers: boolean
    compression: boolean
    http2_support: boolean
  }
}

export function EnhancedNetworkDiagnosisModule() {
  const [activeTab, setActiveTab] = useState("comprehensive")
  const [target, setTarget] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<string>("")
  const [results, setResults] = useState<DiagnosisResult[]>([])
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(null)
  const [selectedResult, setSelectedResult] = useState<DiagnosisResult | null>(null)

  // 综合诊断测试
  const runComprehensiveTest = async () => {
    if (!target.trim()) return

    setIsRunning(true)
    setProgress(0)
    setCurrentResult(null)
    setCurrentPhase("初始化")

    try {
      const startTime = Date.now()
      const phases = [
        { name: "DNS解析", weight: 15, duration: 1000 },
        { name: "连通性测试", weight: 25, duration: 2000 },
        { name: "路由跟踪", weight: 30, duration: 3000 },
        { name: "端口扫描", weight: 20, duration: 2500 },
        { name: "安全检测", weight: 10, duration: 1500 },
      ]

      let currentProgress = 0

      for (const phase of phases) {
        setCurrentPhase(phase.name)

        // 模拟阶段执行
        const phaseStart = Date.now()
        while (Date.now() - phaseStart < phase.duration) {
          const phaseProgress = ((Date.now() - phaseStart) / phase.duration) * phase.weight
          setProgress(currentProgress + phaseProgress)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }

        currentProgress += phase.weight
        setProgress(currentProgress)
      }

      // 生成综合结果
      const comprehensiveData = await generateComprehensiveResult(target)
      const score = calculateNetworkScore(comprehensiveData)

      const result: DiagnosisResult = {
        id: `comp_${Date.now()}`,
        timestamp: new Date(),
        target,
        type: "comprehensive",
        status: score > 70 ? "success" : score > 40 ? "partial" : "failed",
        data: comprehensiveData,
        duration: Date.now() - startTime,
        score,
      }

      setCurrentResult(result)
      setResults((prev) => [result, ...prev.slice(0, 9)])
      setProgress(100)
      setCurrentPhase("完成")
    } catch (error) {
      console.error("综合诊断失败:", error)
    } finally {
      setTimeout(() => {
        setIsRunning(false)
        setProgress(0)
        setCurrentPhase("")
      }, 1000)
    }
  }

  // 生成综合诊断结果
  const generateComprehensiveResult = async (host: string): Promise<ComprehensiveResult> => {
    // 模拟各种测试结果
    const ping: PingResult = {
      host,
      packets_sent: 4,
      packets_received: 4,
      packet_loss: Math.random() * 5,
      min_time: Math.random() * 20 + 10,
      max_time: Math.random() * 50 + 30,
      avg_time: Math.random() * 30 + 20,
      times: Array.from({ length: 4 }, () => Math.random() * 40 + 15),
      jitter: Math.random() * 5 + 1,
    }

    const traceroute: TracerouteHop[] = Array.from({ length: Math.floor(Math.random() * 8) + 5 }, (_, i) => ({
      hop: i + 1,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      hostname: i === 0 ? "gateway.local" : `hop${i}.example.com`,
      times: Array.from({ length: 3 }, () => Math.random() * 50 + i * 10),
      status: Math.random() > 0.1 ? "success" : "timeout",
      location: ["北京", "上海", "广州", "深圳"][Math.floor(Math.random() * 4)],
      asn: `AS${Math.floor(Math.random() * 65535)}`,
    }))

    const dns: DNSRecord[] = [
      { type: "A", name: host, value: "93.184.216.34", ttl: 3600 },
      { type: "AAAA", name: host, value: "2606:2800:220:1:248:1893:25c8:1946", ttl: 3600 },
      { type: "MX", name: host, value: "10 mail.example.com", ttl: 3600 },
      { type: "NS", name: host, value: "ns1.example.com", ttl: 86400 },
      { type: "TXT", name: host, value: "v=spf1 include:_spf.example.com ~all", ttl: 3600 },
    ]

    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306]
    const ports: PortScanResult[] = commonPorts.map((port) => ({
      port,
      status: Math.random() > 0.7 ? "open" : "closed",
      service: getServiceName(port),
      banner: Math.random() > 0.5 ? `${getServiceName(port)} Server v1.0` : undefined,
      response_time: Math.random() * 100 + 10,
    }))

    const security = {
      ssl_grade: ["A+", "A", "B", "C"][Math.floor(Math.random() * 4)],
      vulnerabilities: Math.random() > 0.7 ? ["SSL配置不当", "过期证书"] : [],
      recommendations: ["启用HTTPS", "更新SSL证书", "配置安全头", "启用HSTS"],
    }

    const performance = {
      cdn_detected: Math.random() > 0.5,
      cache_headers: Math.random() > 0.6,
      compression: Math.random() > 0.7,
      http2_support: Math.random() > 0.8,
    }

    return { ping, traceroute, dns, ports, security, performance }
  }

  // 计算网络评分
  const calculateNetworkScore = (data: ComprehensiveResult): number => {
    let score = 100

    // 延迟评分 (30%)
    if (data.ping.avg_time > 100) score -= 20
    else if (data.ping.avg_time > 50) score -= 10
    else if (data.ping.avg_time > 20) score -= 5

    // 丢包评分 (20%)
    score -= data.ping.packet_loss * 2

    // 端口安全评分 (20%)
    const openPorts = data.ports.filter((p) => p.status === "open").length
    if (openPorts > 5) score -= 15
    else if (openPorts > 3) score -= 10

    // SSL评分 (15%)
    if (data.security.ssl_grade === "A+") score += 0
    else if (data.security.ssl_grade === "A") score -= 2
    else if (data.security.ssl_grade === "B") score -= 5
    else score -= 10

    // 性能评分 (15%)
    if (!data.performance.cdn_detected) score -= 5
    if (!data.performance.cache_headers) score -= 3
    if (!data.performance.compression) score -= 3
    if (!data.performance.http2_support) score -= 4

    return Math.max(0, Math.min(100, score))
  }

  // 获取服务名称
  const getServiceName = (port: number): string => {
    const services: { [key: number]: string } = {
      21: "FTP",
      22: "SSH",
      23: "Telnet",
      25: "SMTP",
      53: "DNS",
      80: "HTTP",
      110: "POP3",
      143: "IMAP",
      443: "HTTPS",
      993: "IMAPS",
      995: "POP3S",
      3389: "RDP",
      5432: "PostgreSQL",
      3306: "MySQL",
    }
    return services[port] || "Unknown"
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "timeout":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "partial":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  // 获取评分等级
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "优秀", color: "bg-green-100 text-green-800" }
    if (score >= 70) return { grade: "良好", color: "bg-blue-100 text-blue-800" }
    if (score >= 50) return { grade: "一般", color: "bg-yellow-100 text-yellow-800" }
    return { grade: "较差", color: "bg-red-100 text-red-800" }
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  // 导出结果
  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `network-diagnosis-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">增强网络诊断</h2>
          <p className="text-muted-foreground">全面的网络性能分析和安全检测工具</p>
        </div>
        {results.length > 0 && (
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出结果
          </Button>
        )}
      </div>

      {/* 诊断配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            诊断配置
          </CardTitle>
          <CardDescription>输入要诊断的主机名或IP地址</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="例如: google.com 或 8.8.8.8"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isRunning}
              className="flex-1"
            />
            <Button onClick={runComprehensiveTest} disabled={isRunning || !target.trim()} size="lg">
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  诊断中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  开始综合诊断
                </>
              )}
            </Button>
          </div>

          {/* 诊断进度 */}
          {isRunning && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              <div className="flex justify-center">
                <UniversalQueryAnimation
                  size="lg"
                  progress={progress}
                  showProgress={true}
                  showText={true}
                  text={`正在进行${currentPhase}`}
                  subText="深度分析网络性能和安全状况..."
                  variant="scan"
                  color="blue"
                  icon={<Network className="w-12 h-12 text-blue-600" />}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>诊断进度</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">当前阶段: {currentPhase}</div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* 诊断结果 */}
      {currentResult && !isRunning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 综合评分 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                综合评分
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(currentResult.score || 0)}`}>
                    {currentResult.score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">综合得分</div>
                </div>
                <div className="text-center">
                  <Badge className={getScoreGrade(currentResult.score || 0).color}>
                    {getScoreGrade(currentResult.score || 0).grade}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">网络质量</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 详细结果标签页 */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="connectivity">连通性</TabsTrigger>
              <TabsTrigger value="security">安全性</TabsTrigger>
              <TabsTrigger value="performance">性能</TabsTrigger>
              <TabsTrigger value="details">详细信息</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Wifi className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {currentResult.data.ping.avg_time.toFixed(1)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">平均延迟</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {currentResult.data.security.ssl_grade || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">SSL等级</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Server className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {currentResult.data.ports.filter((p: PortScanResult) => p.status === "open").length}
                    </div>
                    <div className="text-sm text-muted-foreground">开放端口</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">
                      {currentResult.data.performance.cdn_detected ? "是" : "否"}
                    </div>
                    <div className="text-sm text-muted-foreground">CDN检测</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connectivity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>连通性测试结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentResult.data.ping.packets_received}</div>
                      <div className="text-sm text-blue-700">成功包数</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {currentResult.data.ping.packet_loss.toFixed(1)}%
                      </div>
                      <div className="text-sm text-red-700">丢包率</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentResult.data.ping.jitter.toFixed(1)}ms
                      </div>
                      <div className="text-sm text-green-700">抖动</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{currentResult.data.traceroute.length}</div>
                      <div className="text-sm text-purple-700">跳数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>安全检测结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">SSL证书等级</div>
                        <div className="text-sm text-gray-600">
                          {currentResult.data.security.ssl_grade || "未检测到SSL"}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {currentResult.data.security.ssl_grade || "N/A"}
                      </Badge>
                    </div>

                    {currentResult.data.security.vulnerabilities.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-800 mb-2">发现的安全问题</div>
                        <ul className="space-y-1">
                          {currentResult.data.security.vulnerabilities.map((vuln: string, index: number) => (
                            <li key={index} className="text-sm text-red-700">
                              • {vuln}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-2">安全建议</div>
                      <ul className="space-y-1">
                        {currentResult.data.security.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-blue-700">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>性能分析结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(currentResult.data.performance).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="font-medium">
                          {key === "cdn_detected" && "CDN检测"}
                          {key === "cache_headers" && "缓存头"}
                          {key === "compression" && "压缩支持"}
                          {key === "http2_support" && "HTTP/2支持"}
                        </div>
                        <Badge variant={value ? "default" : "secondary"}>{value ? "支持" : "不支持"}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>详细技术信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">DNS记录</h4>
                      <div className="space-y-2">
                        {currentResult.data.dns.map((record: DNSRecord, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-2 rounded bg-muted/50">
                            <Badge variant="outline" className="min-w-[60px] justify-center">
                              {record.type}
                            </Badge>
                            <div className="flex-1 font-mono text-sm">{record.value}</div>
                            <div className="text-xs text-muted-foreground">TTL: {record.ttl}s</div>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(record.value)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">开放端口</h4>
                      <div className="grid gap-2">
                        {currentResult.data.ports
                          .filter((port: PortScanResult) => port.status === "open")
                          .map((port: PortScanResult) => (
                            <div
                              key={port.port}
                              className="flex items-center gap-4 p-3 rounded bg-green-50 border border-green-200"
                            >
                              <Badge className="bg-green-100 text-green-800">{port.port}</Badge>
                              <div className="flex-1">
                                <div className="font-semibold">{port.service || "未知服务"}</div>
                                {port.banner && <div className="text-sm text-muted-foreground">{port.banner}</div>}
                              </div>
                              <div className="text-sm text-muted-foreground">{port.response_time?.toFixed(1)}ms</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* 历史记录 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>诊断历史</CardTitle>
            <CardDescription>最近的诊断记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.slice(0, 5).map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-3 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedResult(result)}
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-semibold">{result.target}</div>
                    <div className="text-sm text-muted-foreground">综合诊断 - 评分: {result.score}/100</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.timestamp.toLocaleTimeString()}</div>
                  <Badge className={getScoreGrade(result.score || 0).color}>
                    {getScoreGrade(result.score || 0).grade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
