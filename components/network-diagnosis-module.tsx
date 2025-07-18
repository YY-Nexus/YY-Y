"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Network,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Server,
  Wifi,
  Activity,
  RefreshCw,
  Download,
  Copy,
} from "lucide-react"
import { UniversalQueryAnimation } from "@/components/universal-query-animation"

interface DiagnosisResult {
  id: string
  timestamp: Date
  target: string
  type: "ping" | "traceroute" | "dns" | "port"
  status: "success" | "failed" | "timeout" | "partial"
  data: any
  duration: number
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
}

interface TracerouteHop {
  hop: number
  ip: string
  hostname?: string
  times: number[]
  status: "success" | "timeout" | "failed"
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
}

export function NetworkDiagnosisModule() {
  const [activeTab, setActiveTab] = useState("connectivity")
  const [target, setTarget] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<DiagnosisResult[]>([])
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(null)

  // 网络连通性测试
  const runConnectivityTest = async () => {
    if (!target.trim()) return

    setIsRunning(true)
    setProgress(0)
    setCurrentResult(null)

    try {
      const startTime = Date.now()

      // 模拟ping测试
      setProgress(20)
      const pingResult = await simulatePing(target)

      setProgress(60)
      // 模拟traceroute
      const tracerouteResult = await simulateTraceroute(target)

      setProgress(100)

      const result: DiagnosisResult = {
        id: `diag_${Date.now()}`,
        timestamp: new Date(),
        target,
        type: "ping",
        status: pingResult.packet_loss < 100 ? "success" : "failed",
        data: { ping: pingResult, traceroute: tracerouteResult },
        duration: Date.now() - startTime,
      }

      setCurrentResult(result)
      setResults((prev) => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error("连通性测试失败:", error)
    } finally {
      setIsRunning(false)
      setProgress(0)
    }
  }

  // DNS解析测试
  const runDNSTest = async () => {
    if (!target.trim()) return

    setIsRunning(true)
    setProgress(0)

    try {
      const startTime = Date.now()

      setProgress(30)
      const dnsRecords = await simulateDNSLookup(target)

      setProgress(100)

      const result: DiagnosisResult = {
        id: `dns_${Date.now()}`,
        timestamp: new Date(),
        target,
        type: "dns",
        status: dnsRecords.length > 0 ? "success" : "failed",
        data: { records: dnsRecords },
        duration: Date.now() - startTime,
      }

      setCurrentResult(result)
      setResults((prev) => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error("DNS测试失败:", error)
    } finally {
      setIsRunning(false)
      setProgress(0)
    }
  }

  // 端口扫描测试
  const runPortScan = async () => {
    if (!target.trim()) return

    setIsRunning(true)
    setProgress(0)

    try {
      const startTime = Date.now()
      const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306]
      const scanResults: PortScanResult[] = []

      for (let i = 0; i < commonPorts.length; i++) {
        const port = commonPorts[i]
        setProgress((i / commonPorts.length) * 100)

        const result = await simulatePortScan(target, port)
        scanResults.push(result)

        // 模拟扫描延迟
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const result: DiagnosisResult = {
        id: `port_${Date.now()}`,
        timestamp: new Date(),
        target,
        type: "port",
        status: scanResults.some((r) => r.status === "open") ? "success" : "failed",
        data: { ports: scanResults },
        duration: Date.now() - startTime,
      }

      setCurrentResult(result)
      setResults((prev) => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error("端口扫描失败:", error)
    } finally {
      setIsRunning(false)
      setProgress(0)
    }
  }

  // 模拟函数
  const simulatePing = async (host: string): Promise<PingResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const times = Array.from({ length: 4 }, () => Math.random() * 100 + 10)
    const packetLoss = Math.random() > 0.9 ? Math.floor(Math.random() * 25) : 0

    return {
      host,
      packets_sent: 4,
      packets_received: 4 - Math.floor((packetLoss / 100) * 4),
      packet_loss: packetLoss,
      min_time: Math.min(...times),
      max_time: Math.max(...times),
      avg_time: times.reduce((a, b) => a + b, 0) / times.length,
      times,
    }
  }

  const simulateTraceroute = async (host: string): Promise<TracerouteHop[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const hops: TracerouteHop[] = []
    const hopCount = Math.floor(Math.random() * 10) + 5

    for (let i = 1; i <= hopCount; i++) {
      hops.push({
        hop: i,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        hostname: i === hopCount ? host : `hop${i}.example.com`,
        times: Array.from({ length: 3 }, () => Math.random() * 50 + i * 10),
        status: Math.random() > 0.1 ? "success" : "timeout",
      })
    }

    return hops
  }

  const simulateDNSLookup = async (domain: string): Promise<DNSRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return [
      { type: "A", name: domain, value: "93.184.216.34", ttl: 3600 },
      { type: "AAAA", name: domain, value: "2606:2800:220:1:248:1893:25c8:1946", ttl: 3600 },
      { type: "MX", name: domain, value: "10 mail.example.com", ttl: 3600 },
      { type: "NS", name: domain, value: "ns1.example.com", ttl: 86400 },
      { type: "TXT", name: domain, value: "v=spf1 include:_spf.example.com ~all", ttl: 3600 },
    ]
  }

  const simulatePortScan = async (host: string, port: number): Promise<PortScanResult> => {
    await new Promise((resolve) => setTimeout(resolve, 50))

    const commonServices: { [key: number]: string } = {
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

    const isOpen = Math.random() > 0.7

    return {
      port,
      status: isOpen ? "open" : "closed",
      service: isOpen ? commonServices[port] : undefined,
      banner: isOpen && Math.random() > 0.5 ? `${commonServices[port]} Server v1.0` : undefined,
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "timeout":
        return "secondary"
      case "partial":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">网络诊断</h2>
          <p className="text-muted-foreground">全面的网络连接性和故障诊断工具</p>
        </div>
        {results.length > 0 && (
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出结果
          </Button>
        )}
      </div>

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
            <Button
              onClick={() => {
                switch (activeTab) {
                  case "connectivity":
                    runConnectivityTest()
                    break
                  case "dns":
                    runDNSTest()
                    break
                  case "ports":
                    runPortScan()
                    break
                }
              }}
              disabled={isRunning || !target.trim()}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  开始诊断
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-center">
                <UniversalQueryAnimation
                  size="lg"
                  progress={progress}
                  showProgress={true}
                  showText={true}
                  text="正在进行连通性测试"
                  subText="检测网络连接状态..."
                  variant="scan"
                  color="blue"
                  icon={<Network className="w-12 h-12 text-blue-600" />}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connectivity">连通性测试</TabsTrigger>
          <TabsTrigger value="dns">DNS解析</TabsTrigger>
          <TabsTrigger value="ports">端口扫描</TabsTrigger>
        </TabsList>

        <TabsContent value="connectivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                网络连通性测试
              </CardTitle>
              <CardDescription>测试与目标主机的网络连接质量和路由路径</CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult && currentResult.type === "ping" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    <Badge variant={getStatusBadgeVariant(currentResult.status)}>
                      {currentResult.status === "success" ? "连接正常" : "连接异常"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">耗时 {currentResult.duration}ms</span>
                  </div>

                  {/* Ping 结果 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {currentResult.data.ping.packets_received}
                        </div>
                        <div className="text-sm text-muted-foreground">成功包数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{currentResult.data.ping.packet_loss}%</div>
                        <div className="text-sm text-muted-foreground">丢包率</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentResult.data.ping.avg_time.toFixed(1)}ms
                        </div>
                        <div className="text-sm text-muted-foreground">平均延迟</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {currentResult.data.ping.max_time.toFixed(1)}ms
                        </div>
                        <div className="text-sm text-muted-foreground">最大延迟</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Traceroute 结果 */}
                  <div>
                    <h4 className="font-semibold mb-2">路由跟踪</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentResult.data.traceroute.map((hop: TracerouteHop) => (
                        <div key={hop.hop} className="flex items-center gap-4 p-2 rounded bg-muted/50">
                          <div className="w-8 text-center font-mono text-sm">{hop.hop}</div>
                          <div className="flex-1">
                            <div className="font-mono text-sm">{hop.ip}</div>
                            {hop.hostname && <div className="text-xs text-muted-foreground">{hop.hostname}</div>}
                          </div>
                          <div className="text-sm">
                            {hop.status === "success" ? (
                              `${hop.times[0].toFixed(1)}ms`
                            ) : (
                              <span className="text-muted-foreground">超时</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                DNS解析测试
              </CardTitle>
              <CardDescription>查询域名的DNS记录和解析情况</CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult && currentResult.type === "dns" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    <Badge variant={getStatusBadgeVariant(currentResult.status)}>
                      {currentResult.status === "success" ? "DNS解析成功" : "DNS解析失败"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">耗时 {currentResult.duration}ms</span>
                  </div>

                  <div className="space-y-2">
                    {currentResult.data.records.map((record: DNSRecord, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded bg-muted/50">
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
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                端口扫描
              </CardTitle>
              <CardDescription>扫描常用端口的开放状态和服务信息</CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult && currentResult.type === "port" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    <Badge variant={getStatusBadgeVariant(currentResult.status)}>扫描完成</Badge>
                    <span className="text-sm text-muted-foreground">
                      扫描了 {currentResult.data.ports.length} 个端口
                    </span>
                  </div>

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
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            开放
                          </Badge>
                        </div>
                      ))}

                    {currentResult.data.ports
                      .filter((port: PortScanResult) => port.status !== "open")
                      .slice(0, 5)
                      .map((port: PortScanResult) => (
                        <div key={port.port} className="flex items-center gap-4 p-3 rounded bg-muted/50">
                          <Badge variant="outline">{port.port}</Badge>
                          <div className="flex-1">
                            <div className="text-muted-foreground">{port.service || "未知服务"}</div>
                          </div>
                          <Badge variant="secondary">关闭</Badge>
                        </div>
                      ))}
                  </div>

                  {currentResult.data.ports.filter((port: PortScanResult) => port.status !== "open").length > 5 && (
                    <div className="text-center text-sm text-muted-foreground">
                      还有{" "}
                      {currentResult.data.ports.filter((port: PortScanResult) => port.status !== "open").length - 5}{" "}
                      个端口未显示...
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                  className="flex items-center gap-4 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => setCurrentResult(result)}
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-semibold">{result.target}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.type === "ping" && "连通性测试"}
                      {result.type === "dns" && "DNS解析"}
                      {result.type === "port" && "端口扫描"}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.timestamp.toLocaleTimeString()}</div>
                  <Badge variant={getStatusBadgeVariant(result.status)}>{result.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
