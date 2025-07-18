"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Signal,
  Router,
  Smartphone,
} from "lucide-react"

interface NetworkMetrics {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  packetLoss: number
  connectionType: string
  isp: string
  location: string
  ipAddress: string
}

interface DiagnosisResult {
  status: "excellent" | "good" | "fair" | "poor"
  issues: string[]
  recommendations: string[]
  score: number
}

export default function EnhancedNetworkDiagnosisModule() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [activeTab, setActiveTab] = useState("test")

  // 模拟网络测试
  const runNetworkTest = useCallback(async () => {
    setIsRunning(true)
    setProgress(0)
    setMetrics(null)
    setDiagnosis(null)

    // 模拟测试进度
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // 模拟测试结果
    const mockMetrics: NetworkMetrics = {
      downloadSpeed: Math.random() * 100 + 50,
      uploadSpeed: Math.random() * 50 + 20,
      ping: Math.random() * 50 + 10,
      jitter: Math.random() * 10 + 2,
      packetLoss: Math.random() * 2,
      connectionType: "WiFi",
      isp: "中国电信",
      location: "北京市",
      ipAddress: "192.168.1.100",
    }

    const mockDiagnosis: DiagnosisResult = {
      status:
        mockMetrics.downloadSpeed > 80
          ? "excellent"
          : mockMetrics.downloadSpeed > 50
            ? "good"
            : mockMetrics.downloadSpeed > 20
              ? "fair"
              : "poor",
      issues: mockMetrics.ping > 30 ? ["网络延迟较高"] : [],
      recommendations: ["建议使用5GHz WiFi频段", "检查路由器位置是否合适", "考虑升级网络套餐"],
      score: Math.min(100, Math.round(mockMetrics.downloadSpeed + (100 - mockMetrics.ping))),
    }

    setMetrics(mockMetrics)
    setDiagnosis(mockDiagnosis)
    setIsRunning(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">优秀</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">良好</Badge>
      case "fair":
        return <Badge className="bg-yellow-100 text-yellow-800">一般</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-800">较差</Badge>
      default:
        return <Badge>未知</Badge>
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          YYC³ NetTrack
        </h1>
        <p className="text-gray-600">智能网络诊断与优化平台</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test">网络测试</TabsTrigger>
          <TabsTrigger value="diagnosis">智能诊断</TabsTrigger>
          <TabsTrigger value="monitor">实时监控</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                网络速度测试
              </CardTitle>
              <CardDescription>测试您的网络下载速度、上传速度和延迟</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isRunning && !metrics && (
                <div className="text-center py-8">
                  <Button
                    onClick={runNetworkTest}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    开始测试
                  </Button>
                </div>
              )}

              {isRunning && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">测试进行中...</div>
                    <Progress value={progress} className="w-full" />
                    <div className="text-sm text-gray-500 mt-2">{progress}% 完成</div>
                  </div>
                </div>
              )}

              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">{metrics.downloadSpeed.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">Mbps 下载</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">{metrics.uploadSpeed.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">Mbps 上传</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-600">{metrics.ping.toFixed(0)}</div>
                      <div className="text-sm text-gray-500">ms 延迟</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {metrics && (
                <div className="mt-6">
                  <Button onClick={runNetworkTest} variant="outline" className="w-full bg-transparent">
                    重新测试
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                智能网络诊断
              </CardTitle>
              <CardDescription>基于AI算法分析您的网络状况并提供优化建议</CardDescription>
            </CardHeader>
            <CardContent>
              {diagnosis ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">网络状态评估</h3>
                      <p className="text-gray-600">综合评分: {diagnosis.score}/100</p>
                    </div>
                    {getStatusBadge(diagnosis.status)}
                  </div>

                  {diagnosis.issues.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-semibold mb-2">发现的问题:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {diagnosis.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      优化建议
                    </h4>
                    <ul className="space-y-2">
                      {diagnosis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">请先运行网络测试以获取诊断结果</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="h-5 w-5" />
                实时网络监控
              </CardTitle>
              <CardDescription>实时监控网络连接状态和性能指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">连接状态</span>
                    <Badge className="bg-green-100 text-green-800">已连接</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">信号强度</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">数据使用量</span>
                    <span className="text-sm">2.3 GB / 10 GB</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">设备类型</span>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">移动设备</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">路由器</span>
                    <div className="flex items-center gap-2">
                      <Router className="h-4 w-4" />
                      <span className="text-sm">TP-Link AX6000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">频段</span>
                    <span className="text-sm">5GHz</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                测试历史记录
              </CardTitle>
              <CardDescription>查看过往的网络测试结果和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">2024年1月{15 + item}日 14:30</div>
                      <div className="text-sm text-gray-600">下载: 85.2 Mbps | 上传: 42.1 Mbps | 延迟: 15ms</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">优秀</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
