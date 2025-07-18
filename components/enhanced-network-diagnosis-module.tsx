"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  Gauge,
  Shield,
  RefreshCw,
  History,
  TrendingUp,
  Settings,
  Share2,
  FileText,
  Search,
  Trash2,
  Star,
  StarOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Target,
  Smartphone,
  Monitor,
  Laptop,
} from "lucide-react"

// 网络诊断结果接口
interface NetworkDiagnosisResult {
  id: string
  timestamp: Date
  type: "comprehensive" | "speed" | "latency" | "connectivity" | "security"
  status: "running" | "completed" | "failed" | "cancelled"
  progress: number
  duration: number
  results: {
    // 基础连接性
    connectivity: {
      status: "connected" | "disconnected" | "limited"
      ipAddress: string
      gateway: string
      dns: string[]
      isp: string
      location: {
        country: string
        city: string
        region: string
        coordinates: [number, number]
      }
    }

    // 速度测试
    speed: {
      download: number // Mbps
      upload: number // Mbps
      ping: number // ms
      jitter: number // ms
      packetLoss: number // %
      server: {
        name: string
        location: string
        distance: number
      }
    }

    // 延迟测试
    latency: {
      dns: number
      tcp: number
      http: number
      https: number
      websocket: number
      targets: Array<{
        host: string
        ip: string
        ping: number
        status: "success" | "timeout" | "error"
      }>
    }

    // 安全检测
    security: {
      dnsLeak: boolean
      webrtcLeak: boolean
      vpnDetected: boolean
      proxyDetected: boolean
      torDetected: boolean
      threats: Array<{
        type: string
        severity: "low" | "medium" | "high" | "critical"
        description: string
      }>
    }

    // 网络质量
    quality: {
      score: number // 0-100
      grade: "A+" | "A" | "B" | "C" | "D" | "F"
      factors: {
        speed: number
        latency: number
        stability: number
        security: number
      }
      recommendations: string[]
    }

    // 设备信息
    device: {
      type: "desktop" | "mobile" | "tablet"
      os: string
      browser: string
      screen: string
      connection: string
      userAgent: string
    }

    // 网络路径
    traceroute?: Array<{
      hop: number
      ip: string
      hostname?: string
      rtt: number[]
      location?: string
    }>
  }
  error?: string
  favorite: boolean
  tags: string[]
  notes: string
}

// 测试配置接口
interface TestConfig {
  type: "comprehensive" | "speed" | "latency" | "connectivity" | "security"
  duration: number
  servers: string[]
  targets: string[]
  advanced: {
    multipleConnections: boolean
    ipv6: boolean
    traceroute: boolean
    dnsTest: boolean
    securityScan: boolean
  }
}

// 历史记录过滤器
interface HistoryFilter {
  dateRange: "today" | "week" | "month" | "all"
  testType: "all" | "comprehensive" | "speed" | "latency" | "connectivity" | "security"
  status: "all" | "completed" | "failed"
  favorites: boolean
  search: string
}

export function EnhancedNetworkDiagnosisModule() {
  // 状态管理
  const [activeTab, setActiveTab] = useState("diagnosis")
  const [currentTest, setCurrentTest] = useState<NetworkDiagnosisResult | null>(null)
  const [testHistory, setTestHistory] = useState<NetworkDiagnosisResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [testConfig, setTestConfig] = useState<TestConfig>({
    type: "comprehensive",
    duration: 60,
    servers: ["auto"],
    targets: ["google.com", "cloudflare.com", "github.com"],
    advanced: {
      multipleConnections: true,
      ipv6: false,
      traceroute: false,
      dnsTest: true,
      securityScan: true,
    },
  })
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>({
    dateRange: "week",
    testType: "all",
    status: "all",
    favorites: false,
    search: "",
  })
  const [selectedResults, setSelectedResults] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30)

  // Refs
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 预定义测试目标
  const testTargets = {
    popular: [
      { name: "Google", host: "google.com", category: "搜索引擎" },
      { name: "Cloudflare", host: "cloudflare.com", category: "CDN" },
      { name: "GitHub", host: "github.com", category: "开发平台" },
      { name: "YouTube", host: "youtube.com", category: "视频平台" },
      { name: "Facebook", host: "facebook.com", category: "社交媒体" },
    ],
    chinese: [
      { name: "百度", host: "baidu.com", category: "搜索引擎" },
      { name: "腾讯", host: "qq.com", category: "社交平台" },
      { name: "阿里巴巴", host: "alibaba.com", category: "电商平台" },
      { name: "新浪", host: "sina.com.cn", category: "门户网站" },
      { name: "网易", host: "163.com", category: "门户网站" },
    ],
    gaming: [
      { name: "Steam", host: "steampowered.com", category: "游戏平台" },
      { name: "Epic Games", host: "epicgames.com", category: "游戏平台" },
      { name: "Battle.net", host: "battle.net", category: "游戏平台" },
      { name: "Origin", host: "origin.com", category: "游戏平台" },
      { name: "Uplay", host: "ubisoft.com", category: "游戏平台" },
    ],
    streaming: [
      { name: "Netflix", host: "netflix.com", category: "流媒体" },
      { name: "Disney+", host: "disneyplus.com", category: "流媒体" },
      { name: "Twitch", host: "twitch.tv", category: "直播平台" },
      { name: "Spotify", host: "spotify.com", category: "音乐平台" },
      { name: "Apple Music", host: "music.apple.com", category: "音乐平台" },
    ],
  }

  // 开始网络诊断
  const startDiagnosis = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setIsPaused(false)

    // 创建新的测试结果
    const newTest: NetworkDiagnosisResult = {
      id: `test_${Date.now()}`,
      timestamp: new Date(),
      type: testConfig.type,
      status: "running",
      progress: 0,
      duration: 0,
      results: {
        connectivity: {
          status: "connected",
          ipAddress: "",
          gateway: "",
          dns: [],
          isp: "",
          location: {
            country: "",
            city: "",
            region: "",
            coordinates: [0, 0],
          },
        },
        speed: {
          download: 0,
          upload: 0,
          ping: 0,
          jitter: 0,
          packetLoss: 0,
          server: {
            name: "",
            location: "",
            distance: 0,
          },
        },
        latency: {
          dns: 0,
          tcp: 0,
          http: 0,
          https: 0,
          websocket: 0,
          targets: [],
        },
        security: {
          dnsLeak: false,
          webrtcLeak: false,
          vpnDetected: false,
          proxyDetected: false,
          torDetected: false,
          threats: [],
        },
        quality: {
          score: 0,
          grade: "F",
          factors: {
            speed: 0,
            latency: 0,
            stability: 0,
            security: 0,
          },
          recommendations: [],
        },
        device: {
          type: "desktop",
          os: navigator.platform,
          browser: navigator.userAgent.split(" ").pop() || "Unknown",
          screen: `${screen.width}x${screen.height}`,
          connection: (navigator as any).connection?.effectiveType || "unknown",
          userAgent: navigator.userAgent,
        },
      },
      favorite: false,
      tags: [],
      notes: "",
    }

    setCurrentTest(newTest)
    abortControllerRef.current = new AbortController()

    try {
      // 模拟测试过程
      const totalSteps = testConfig.type === "comprehensive" ? 10 : 5
      const stepDuration = (testConfig.duration * 1000) / totalSteps

      for (let step = 0; step < totalSteps; step++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Test cancelled")
        }

        // 等待暂停状态
        while (isPaused && !abortControllerRef.current?.signal.aborted) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // 更新进度
        const progress = ((step + 1) / totalSteps) * 100
        const duration = (step + 1) * (stepDuration / 1000)

        setCurrentTest((prev) =>
          prev
            ? {
                ...prev,
                progress,
                duration,
                results: {
                  ...prev.results,
                  // 模拟实时数据更新
                  speed: {
                    ...prev.results.speed,
                    download: Math.random() * 100 + 50,
                    upload: Math.random() * 50 + 20,
                    ping: Math.random() * 50 + 10,
                    jitter: Math.random() * 10 + 1,
                    packetLoss: Math.random() * 2,
                  },
                  connectivity: {
                    ...prev.results.connectivity,
                    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
                    gateway: "192.168.1.1",
                    dns: ["8.8.8.8", "8.8.4.4"],
                    isp: "Example ISP",
                    location: {
                      country: "China",
                      city: "Beijing",
                      region: "Beijing",
                      coordinates: [116.4074, 39.9042],
                    },
                  },
                },
              }
            : null,
        )

        await new Promise((resolve) => setTimeout(resolve, stepDuration))
      }

      // 完成测试
      setCurrentTest((prev) =>
        prev
          ? {
              ...prev,
              status: "completed",
              progress: 100,
              results: {
                ...prev.results,
                quality: {
                  score: Math.floor(Math.random() * 40) + 60,
                  grade: ["A+", "A", "B", "C"][Math.floor(Math.random() * 4)] as any,
                  factors: {
                    speed: Math.random() * 100,
                    latency: Math.random() * 100,
                    stability: Math.random() * 100,
                    security: Math.random() * 100,
                  },
                  recommendations: [
                    "考虑升级到更高速度的网络套餐",
                    "优化路由器位置以改善信号强度",
                    "使用有线连接以获得更稳定的性能",
                  ],
                },
              },
            }
          : null,
      )

      // 添加到历史记录
      if (currentTest) {
        setTestHistory((prev) => [currentTest, ...prev.slice(0, 49)]) // 保留最近50条记录
      }
    } catch (error) {
      console.error("Network diagnosis failed:", error)
      setCurrentTest((prev) =>
        prev
          ? {
              ...prev,
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error",
            }
          : null,
      )
    } finally {
      setIsRunning(false)
      setIsPaused(false)
      abortControllerRef.current = null
    }
  }, [testConfig, isRunning, isPaused, currentTest])

  // 暂停/恢复测试
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // 停止测试
  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsRunning(false)
    setIsPaused(false)
    setCurrentTest((prev) => (prev ? { ...prev, status: "cancelled" } : null))
  }

  // 重新运行测试
  const retryTest = () => {
    if (currentTest) {
      startDiagnosis()
    }
  }

  // 清除当前测试
  const clearCurrentTest = () => {
    setCurrentTest(null)
  }

  // 过滤历史记录
  const filteredHistory = testHistory.filter((result) => {
    // 日期过滤
    const now = new Date()
    const resultDate = new Date(result.timestamp)
    let dateMatch = true

    switch (historyFilter.dateRange) {
      case "today":
        dateMatch = resultDate.toDateString() === now.toDateString()
        break
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateMatch = resultDate >= weekAgo
        break
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateMatch = resultDate >= monthAgo
        break
    }

    // 类型过滤
    const typeMatch = historyFilter.testType === "all" || result.type === historyFilter.testType

    // 状态过滤
    const statusMatch = historyFilter.status === "all" || result.status === historyFilter.status

    // 收藏过滤
    const favoriteMatch = !historyFilter.favorites || result.favorite

    // 搜索过滤
    const searchMatch =
      !historyFilter.search ||
      result.id.toLowerCase().includes(historyFilter.search.toLowerCase()) ||
      result.notes.toLowerCase().includes(historyFilter.search.toLowerCase()) ||
      result.tags.some((tag) => tag.toLowerCase().includes(historyFilter.search.toLowerCase()))

    return dateMatch && typeMatch && statusMatch && favoriteMatch && searchMatch
  })

  // 获取网络质量颜色
  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    if (score >= 30) return "text-orange-600"
    return "text-red-600"
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  // 导出测试结果
  const exportResults = (results: NetworkDiagnosisResult[]) => {
    const data = JSON.stringify(results, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `network-diagnosis-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 分享测试结果
  const shareResults = async (result: NetworkDiagnosisResult) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "网络诊断结果",
          text: `网络质量评分: ${result.results.quality.score}/100`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("分享失败:", error)
      }
    } else {
      // 复制到剪贴板
      const text = `网络诊断结果\n质量评分: ${result.results.quality.score}/100\n下载速度: ${result.results.speed.download.toFixed(1)} Mbps\n上传速度: ${result.results.speed.upload.toFixed(1)} Mbps\n延迟: ${result.results.speed.ping.toFixed(0)} ms`
      navigator.clipboard.writeText(text)
    }
  }

  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    setTestHistory((prev) =>
      prev.map((result) => (result.id === id ? { ...result, favorite: !result.favorite } : result)),
    )
  }

  // 删除测试结果
  const deleteResult = (id: string) => {
    setTestHistory((prev) => prev.filter((result) => result.id !== id))
    setSelectedResults((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  // 批量删除
  const deleteSelected = () => {
    setTestHistory((prev) => prev.filter((result) => !selectedResults.includes(result.id)))
    setSelectedResults([])
  }

  // 自动刷新效果
  useEffect(() => {
    if (autoRefresh && !isRunning) {
      autoRefreshRef.current = setInterval(() => {
        startDiagnosis()
      }, refreshInterval * 1000)
    } else if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current)
      autoRefreshRef.current = null
    }

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
      }
    }
  }, [autoRefresh, refreshInterval, isRunning, startDiagnosis])

  // 清理效果
  useEffect(() => {
    return () => {
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current)
      }
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* 标题和控制区域 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">增强网络诊断</h2>
          <p className="text-muted-foreground">全面检测网络连接质量和性能指标</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="w-4 h-4 mr-2" />
            高级设置
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-blue-50 border-blue-200" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            自动刷新
          </Button>
        </div>
      </div>

      {/* 高级设置面板 */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">测试配置</CardTitle>
                <CardDescription>自定义网络诊断参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 测试类型 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">测试类型</label>
                    <select
                      value={testConfig.type}
                      onChange={(e) => setTestConfig((prev) => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="comprehensive">综合诊断</option>
                      <option value="speed">速度测试</option>
                      <option value="latency">延迟测试</option>
                      <option value="connectivity">连接性测试</option>
                      <option value="security">安全检测</option>
                    </select>
                  </div>

                  {/* 测试时长 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">测试时长 (秒)</label>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={testConfig.duration}
                      onChange={(e) =>
                        setTestConfig((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  {/* 自动刷新间隔 */}
                  {autoRefresh && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">刷新间隔 (秒)</label>
                      <input
                        type="number"
                        min="10"
                        max="3600"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number.parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* 高级选项 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">高级选项</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(testConfig.advanced).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setTestConfig((prev) => ({
                              ...prev,
                              advanced: { ...prev.advanced, [key]: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagnosis">实时诊断</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        {/* 实时诊断标签页 */}
        <TabsContent value="diagnosis" className="space-y-6">
          {/* 控制按钮 */}
          <div className="flex flex-wrap items-center gap-3">
            {!isRunning ? (
              <Button onClick={startDiagnosis} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                开始诊断
              </Button>
            ) : (
              <>
                <Button onClick={togglePause} variant="outline" className="flex items-center gap-2 bg-transparent">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "继续" : "暂停"}
                </Button>
                <Button onClick={stopTest} variant="destructive" className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  停止
                </Button>
              </>
            )}

            {currentTest && currentTest.status === "failed" && (
              <Button onClick={retryTest} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                重试
              </Button>
            )}

            {currentTest && !isRunning && (
              <Button onClick={clearCurrentTest} variant="ghost" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                清除
              </Button>
            )}
          </div>

          {/* 当前测试结果 */}
          {currentTest && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 测试进度和基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(currentTest.status)}
                      测试进度
                    </span>
                    <Badge variant={currentTest.status === "completed" ? "default" : "secondary"}>
                      {currentTest.status === "running"
                        ? "进行中"
                        : currentTest.status === "completed"
                          ? "已完成"
                          : currentTest.status === "failed"
                            ? "失败"
                            : "已取消"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>进度</span>
                      <span>{currentTest.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentTest.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">测试类型</span>
                      <p className="font-medium capitalize">{currentTest.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">已用时间</span>
                      <p className="font-medium">{currentTest.duration.toFixed(1)}s</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">开始时间</span>
                      <p className="font-medium">{currentTest.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">测试ID</span>
                      <p className="font-medium font-mono text-xs">{currentTest.id.slice(-8)}</p>
                    </div>
                  </div>

                  {currentTest.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-700">{currentTest.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* 实时指标 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    实时指标
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Download className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-blue-600">
                        {currentTest.results.speed.download.toFixed(1)}
                      </div>
                      <div className="text-xs text-blue-600">Mbps 下载</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Upload className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-green-600">
                        {currentTest.results.speed.upload.toFixed(1)}
                      </div>
                      <div className="text-xs text-green-600">Mbps 上传</div>
                    </div>

                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {currentTest.results.speed.ping.toFixed(0)}
                      </div>
                      <div className="text-xs text-yellow-600">ms 延迟</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Gauge className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <div className={`text-2xl font-bold ${getQualityColor(currentTest.results.quality.score)}`}>
                        {currentTest.results.quality.score}
                      </div>
                      <div className="text-xs text-purple-600">质量评分</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 详细结果 */}
              {currentTest.status === "completed" && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          详细结果
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => shareResults(currentTest)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            分享
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => exportResults([currentTest])}>
                            <Download className="w-4 h-4 mr-2" />
                            导出
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="overview">概览</TabsTrigger>
                          <TabsTrigger value="speed">速度</TabsTrigger>
                          <TabsTrigger value="latency">延迟</TabsTrigger>
                          <TabsTrigger value="security">安全</TabsTrigger>
                          <TabsTrigger value="device">设备</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">网络质量评估</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>总体评分</span>
                                  <span className={`font-bold ${getQualityColor(currentTest.results.quality.score)}`}>
                                    {currentTest.results.quality.score}/100 ({currentTest.results.quality.grade})
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {Object.entries(currentTest.results.quality.factors).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="capitalize">{key}</span>
                                      <span>{value.toFixed(0)}/100</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">连接信息</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>IP地址</span>
                                  <span className="font-mono">{currentTest.results.connectivity.ipAddress}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ISP</span>
                                  <span>{currentTest.results.connectivity.isp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>位置</span>
                                  <span>
                                    {currentTest.results.connectivity.location.city},{" "}
                                    {currentTest.results.connectivity.location.country}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {currentTest.results.quality.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">优化建议</h4>
                              <ul className="space-y-1">
                                {currentTest.results.quality.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="speed" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">
                                  {currentTest.results.speed.download.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">Mbps 下载速度</div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4 text-center">
                                <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-600">
                                  {currentTest.results.speed.upload.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">Mbps 上传速度</div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4 text-center">
                                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-yellow-600">
                                  {currentTest.results.speed.ping.toFixed(0)}
                                </div>
                                <div className="text-sm text-muted-foreground">ms 延迟</div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">网络稳定性</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>抖动</span>
                                  <span>{currentTest.results.speed.jitter.toFixed(1)} ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>丢包率</span>
                                  <span>{currentTest.results.speed.packetLoss.toFixed(2)}%</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">测试服务器</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>服务器</span>
                                  <span>{currentTest.results.speed.server.name || "自动选择"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>位置</span>
                                  <span>{currentTest.results.speed.server.location || "未知"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>距离</span>
                                  <span>{currentTest.results.speed.server.distance || 0} km</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="latency" className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(currentTest.results.latency)
                              .filter(([key]) => key !== "targets")
                              .map(([key, value]) => (
                                <Card key={key}>
                                  <CardContent className="p-4 text-center">
                                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                    <div className="text-xl font-bold">{(value as number).toFixed(0)}</div>
                                    <div className="text-xs text-muted-foreground capitalize">{key} ms</div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>

                          {currentTest.results.latency.targets.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">目标主机延迟测试</h4>
                              <div className="space-y-2">
                                {currentTest.results.latency.targets.map((target, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-3 h-3 rounded-full ${
                                          target.status === "success"
                                            ? "bg-green-500"
                                            : target.status === "timeout"
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                        }`}
                                      />
                                      <div>
                                        <div className="font-medium">{target.host}</div>
                                        <div className="text-sm text-muted-foreground">{target.ip}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{target.ping.toFixed(0)} ms</div>
                                      <div className="text-sm text-muted-foreground capitalize">{target.status}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="security" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">隐私检测</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>DNS泄露</span>
                                  <Badge variant={currentTest.results.security.dnsLeak ? "destructive" : "default"}>
                                    {currentTest.results.security.dnsLeak ? "检测到" : "正常"}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>WebRTC泄露</span>
                                  <Badge variant={currentTest.results.security.webrtcLeak ? "destructive" : "default"}>
                                    {currentTest.results.security.webrtcLeak ? "检测到" : "正常"}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>VPN检测</span>
                                  <Badge variant={currentTest.results.security.vpnDetected ? "secondary" : "outline"}>
                                    {currentTest.results.security.vpnDetected ? "使用中" : "未使用"}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>代理检测</span>
                                  <Badge variant={currentTest.results.security.proxyDetected ? "secondary" : "outline"}>
                                    {currentTest.results.security.proxyDetected ? "使用中" : "未使用"}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">安全威胁</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {currentTest.results.security.threats.length === 0 ? (
                                  <div className="text-center py-4">
                                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-green-600 font-medium">未发现安全威胁</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {currentTest.results.security.threats.map((threat, index) => (
                                      <Alert
                                        key={index}
                                        className={`border-${
                                          threat.severity === "critical"
                                            ? "red"
                                            : threat.severity === "high"
                                              ? "orange"
                                              : threat.severity === "medium"
                                                ? "yellow"
                                                : "blue"
                                        }-200`}
                                      >
                                        <AlertTriangle className="w-4 h-4" />
                                        <AlertDescription>
                                          <div className="flex justify-between items-start">
                                            <span>{threat.description}</span>
                                            <Badge
                                              variant={
                                                threat.severity === "critical"
                                                  ? "destructive"
                                                  : threat.severity === "high"
                                                    ? "destructive"
                                                    : threat.severity === "medium"
                                                      ? "secondary"
                                                      : "outline"
                                              }
                                            >
                                              {threat.severity}
                                            </Badge>
                                          </div>
                                        </AlertDescription>
                                      </Alert>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="device" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {currentTest.results.device.type === "mobile" ? (
                                    <Smartphone className="w-5 h-5" />
                                  ) : currentTest.results.device.type === "tablet" ? (
                                    <Monitor className="w-5 h-5" />
                                  ) : (
                                    <Laptop className="w-5 h-5" />
                                  )}
                                  设备信息
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                  <span>设备类型</span>
                                  <span className="capitalize">{currentTest.results.device.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>操作系统</span>
                                  <span>{currentTest.results.device.os}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>浏览器</span>
                                  <span>{currentTest.results.device.browser}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>屏幕分辨率</span>
                                  <span>{currentTest.results.device.screen}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>连接类型</span>
                                  <span>{currentTest.results.device.connection}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">技术详情</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm font-medium">User Agent</span>
                                    <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                                      {currentTest.results.device.userAgent}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* 历史记录标签页 */}
        <TabsContent value="history" className="space-y-6">
          {/* 过滤器和控制 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>历史记录过滤器</span>
                <div className="flex items-center gap-2">
                  {selectedResults.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportResults(testHistory.filter((r) => selectedResults.includes(r.id)))}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        导出选中 ({selectedResults.length})
                      </Button>
                      <Button variant="destructive" size="sm" onClick={deleteSelected}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除选中
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => exportResults(filteredHistory)}>
                    <FileText className="w-4 h-4 mr-2" />
                    导出全部
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">时间范围</label>
                  <select
                    value={historyFilter.dateRange}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="today">今天</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一月</option>
                    <option value="all">全部</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">测试类型</label>
                  <select
                    value={historyFilter.testType}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, testType: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">全部类型</option>
                    <option value="comprehensive">综合诊断</option>
                    <option value="speed">速度测试</option>
                    <option value="latency">延迟测试</option>
                    <option value="connectivity">连接性测试</option>
                    <option value="security">安全检测</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">状态</label>
                  <select
                    value={historyFilter.status}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">全部状态</option>
                    <option value="completed">已完成</option>
                    <option value="failed">失败</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">搜索</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索测试记录..."
                      value={historyFilter.search}
                      onChange={(e) => setHistoryFilter((prev) => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={historyFilter.favorites}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, favorites: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">仅显示收藏</span>
                </label>

                <div className="text-sm text-muted-foreground">
                  显示 {filteredHistory.length} / {testHistory.length} 条记录
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 历史记录列表 */}
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">暂无历史记录</h3>
                <p className="text-muted-foreground mb-4">
                  {testHistory.length === 0 ? "还没有进行过网络诊断测试" : "没有符合筛选条件的记录"}
                </p>
                <Button onClick={() => setActiveTab("diagnosis")}>开始第一次诊断</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedResults.includes(result.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedResults((prev) => [...prev, result.id])
                            } else {
                              setSelectedResults((prev) => prev.filter((id) => id !== result.id))
                            }
                          }}
                          className="mt-1"
                        />

                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(result.status)}
                            <h4 className="font-semibold">
                              {result.type === "comprehensive"
                                ? "综合诊断"
                                : result.type === "speed"
                                  ? "速度测试"
                                  : result.type === "latency"
                                    ? "延迟测试"
                                    : result.type === "connectivity"
                                      ? "连接性测试"
                                      : "安全检测"}
                            </h4>
                            <Badge variant="outline">
                              {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">质量评分</span>
                              <p className={`font-bold ${getQualityColor(result.results.quality.score)}`}>
                                {result.results.quality.score}/100
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">下载速度</span>
                              <p className="font-medium">{result.results.speed.download.toFixed(1)} Mbps</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">延迟</span>
                              <p className="font-medium">{result.results.speed.ping.toFixed(0)} ms</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">测试时长</span>
                              <p className="font-medium">{result.duration.toFixed(1)}s</p>
                            </div>
                          </div>

                          {result.notes && <p className="text-sm text-muted-foreground mt-2">{result.notes}</p>}

                          {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(result.id)}>
                          {result.favorite ? (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => shareResults(result)}>
                          <Share2 className="w-4 h-4" />
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => exportResults([result])}>
                          <Download className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResult(result.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 数据分析标签页 */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{testHistory.length}</div>
                <div className="text-sm text-muted-foreground">总测试次数</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {testHistory.length > 0
                    ? (testHistory.reduce((sum, r) => sum + r.results.quality.score, 0) / testHistory.length).toFixed(0)
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">平均质量评分</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {testHistory.length > 0
                    ? (testHistory.reduce((sum, r) => sum + r.results.speed.download, 0) / testHistory.length).toFixed(
                        1,
                      )
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">平均下载速度 (Mbps)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {testHistory.length > 0
                    ? (testHistory.reduce((sum, r) => sum + r.results.speed.ping, 0) / testHistory.length).toFixed(0)
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">平均延迟 (ms)</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>测试趋势分析</CardTitle>
              <CardDescription>基于历史数据的网络性能趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>趋势图表功能开发中...</p>
                <p className="text-sm">将显示网络质量、速度和延迟的历史趋势</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 设置标签页 */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>诊断设置</CardTitle>
              <CardDescription>自定义网络诊断的默认参数和行为</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">默认测试配置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">默认测试类型</label>
                    <select
                      value={testConfig.type}
                      onChange={(e) => setTestConfig((prev) => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="comprehensive">综合诊断</option>
                      <option value="speed">速度测试</option>
                      <option value="latency">延迟测试</option>
                      <option value="connectivity">连接性测试</option>
                      <option value="security">安全检测</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">默认测试时长 (秒)</label>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={testConfig.duration}
                      onChange={(e) =>
                        setTestConfig((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">自动化设置</h4>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded"
                    />
                    <span>启用自动刷新</span>
                  </label>

                  {autoRefresh && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">自动刷新间隔 (秒)</label>
                      <input
                        type="number"
                        min="10"
                        max="3600"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number.parseInt(e.target.value))}
                        className="w-full max-w-xs p-2 border rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">数据管理</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">历史记录</p>
                      <p className="text-sm text-muted-foreground">当前保存了 {testHistory.length} 条测试记录</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTestHistory([])
                        setSelectedResults([])
                      }}
                      disabled={testHistory.length === 0}
                    >
                      清空历史
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">导出数据</p>
                      <p className="text-sm text-muted-foreground">导出所有测试数据为JSON格式</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => exportResults(testHistory)}
                      disabled={testHistory.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      导出全部
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">测试目标管理</h4>
                <div className="space-y-4">
                  {Object.entries(testTargets).map(([category, targets]) => (
                    <div key={category}>
                      <h5 className="font-medium mb-2 capitalize">{category}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {targets.map((target, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{target.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">({target.host})</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {target.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
