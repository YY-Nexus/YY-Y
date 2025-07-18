"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Copy,
  ExternalLink,
} from "lucide-react"

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "timeout":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failed: "destructive",
      timeout: "secondary",
      partial: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === "success" && "成功"}
        {status === "failed" && "失败"}
        {status === "timeout" && "超时"}
        {status === "partial" && "部分成功"}
      </Badge>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Network className="h-8 w-8 text-blue-500" />
          网络诊断工具
        </h1>
        <p className="text-muted-foreground">全面的网络连通性、DNS解析和端口扫描诊断工具</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            目标设置
          </CardTitle>
          <CardDescription>输入要诊断的域名或IP地址</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="例如: google.com 或 8.8.8.8"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (activeTab === "connectivity") runConnectivityTest()
                else if (activeTab === "dns") runDNSTest()
                else if (activeTab === "port") runPortScan()
              }}
              disabled={isRunning || !target.trim()}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  诊断中...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  开始诊断
                </>
              )}
            </Button>
          </div>
          {isRunning && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">诊断进度: {Math.round(progress)}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connectivity" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            连通性测试
          </TabsTrigger>
          <TabsTrigger value="dns" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            DNS解析
          </TabsTrigger>
          <TabsTrigger value="port" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            端口扫描
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connectivity" className="space-y-4">
          {currentResult && currentResult.type === "ping" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    连通性测试结果
                  </span>
                  {getStatusBadge(currentResult.status)}
                </CardTitle>
                <CardDescription>
                  目标: {currentResult.target} | 耗时: {currentResult.duration}ms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ping结果 */}
                <div>
                  <h4 className="font-semibold mb-2">Ping 统计</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{currentResult.data.ping.packets_sent}</div>
                      <div className="text-sm text-muted-foreground">发送包数</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentResult.data.ping.packets_received}</div>
                      <div className="text-sm text-muted-foreground">接收包数</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{currentResult.data.ping.packet_loss}%</div>
                      <div className="text-sm text-muted-foreground">丢包率</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(currentResult.data.ping.avg_time)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">平均延迟</div>
                    </div>
                  </div>
                </div>

                {/* Traceroute结果 */}
                <div>
                  <h4 className="font-semibold mb-2">路由跟踪</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentResult.data.traceroute.map((hop: TracerouteHop) => (
                      <div key={hop.hop} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{hop.hop}</Badge>
                          <span className="font-mono text-sm">{hop.ip}</span>
                          {hop.hostname && <span className="text-sm text-muted-foreground">({hop.hostname})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(hop.status)}
                          <span className="text-sm">{Math.round(hop.times[0])}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          {currentResult && currentResult.type === "dns" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    DNS解析结果
                  </span>
                  {getStatusBadge(currentResult.status)}
                </CardTitle>
                <CardDescription>
                  域名: {currentResult.target} | 耗时: {currentResult.duration}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentResult.data.records.map((record: DNSRecord, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{record.type}</Badge>
                        <span className="font-mono text-sm">{record.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">TTL: {record.ttl}s</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(record.value)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="port" className="space-y-4">
          {currentResult && currentResult.type === "port" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(currentResult.status)}
                    端口扫描结果
                  </span>
                  {getStatusBadge(currentResult.status)}
                </CardTitle>
                <CardDescription>
                  目标: {currentResult.target} | 耗时: {currentResult.duration}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {currentResult.data.ports.map((port: PortScanResult, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">端口 {port.port}</Badge>
                        {port.service && <span className="text-sm font-medium">{port.service}</span>}
                        {port.banner && <span className="text-sm text-muted-foreground">{port.banner}</span>}
                      </div>
                      <Badge variant={port.status === "open" ? "default" : "secondary"}>
                        {port.status === "open" ? "开放" : "关闭"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 历史记录 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              诊断历史
            </CardTitle>
            <CardDescription>最近的诊断记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.target}</span>
                    <Badge variant="outline">{result.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                    <Button size="sm" variant="ghost" onClick={() => setCurrentResult(result)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
