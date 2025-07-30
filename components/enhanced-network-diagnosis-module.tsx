"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Globe,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react"

interface NetworkDiagnosisResult {
  ping: number
  downloadSpeed: number
  uploadSpeed: number
  jitter: number
  packetLoss: number
  dnsResolution: number
  location: string
  isp: string
  ipAddress: string
  status: "excellent" | "good" | "fair" | "poor"
  recommendations: string[]
}

export default function EnhancedNetworkDiagnosisModule() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<NetworkDiagnosisResult | null>(null)
  const [currentTest, setCurrentTest] = useState("")

  const runDiagnosis = async () => {
    setIsRunning(true)
    setProgress(0)
    setResults(null)

    const tests = [
      { name: "检测网络连接", duration: 1000 },
      { name: "测试延迟", duration: 1500 },
      { name: "测试下载速度", duration: 2000 },
      { name: "测试上传速度", duration: 2000 },
      { name: "检测DNS解析", duration: 1000 },
      { name: "分析网络质量", duration: 500 },
    ]

    let totalProgress = 0
    const progressStep = 100 / tests.length

    for (const test of tests) {
      setCurrentTest(test.name)
      await new Promise((resolve) => setTimeout(resolve, test.duration))
      totalProgress += progressStep
      setProgress(totalProgress)
    }

    // 模拟诊断结果
    const mockResults: NetworkDiagnosisResult = {
      ping: Math.floor(Math.random() * 50) + 10,
      downloadSpeed: Math.floor(Math.random() * 100) + 50,
      uploadSpeed: Math.floor(Math.random() * 50) + 20,
      jitter: Math.floor(Math.random() * 10) + 1,
      packetLoss: Math.random() * 2,
      dnsResolution: Math.floor(Math.random() * 20) + 5,
      location: "北京市, 中国",
      isp: "中国电信",
      ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
      status: "good",
      recommendations: ["网络连接状态良好", "建议在网络高峰期避免大文件下载", "可考虑升级到更高带宽套餐"],
    }

    // 根据测试结果确定状态
    if (mockResults.ping < 20 && mockResults.downloadSpeed > 80) {
      mockResults.status = "excellent"
    } else if (mockResults.ping < 50 && mockResults.downloadSpeed > 50) {
      mockResults.status = "good"
    } else if (mockResults.ping < 100 && mockResults.downloadSpeed > 20) {
      mockResults.status = "fair"
    } else {
      mockResults.status = "poor"
    }

    setResults(mockResults)
    setIsRunning(false)
    setCurrentTest("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "fair":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "fair":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "poor":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "优秀"
      case "good":
        return "良好"
      case "fair":
        return "一般"
      case "poor":
        return "较差"
      default:
        return "未知"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-6 h-6 text-purple-400" />
            增强网络诊断
          </CardTitle>
          <CardDescription className="text-purple-200">全面检测网络连接质量，提供专业的优化建议</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={runDiagnosis}
              disabled={isRunning}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  诊断中...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  开始诊断
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-purple-200 mb-2">{currentTest}</p>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-purple-300 mt-2">{Math.round(progress)}% 完成</p>
              </div>
            </div>
          )}

          {results && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-900/30">
                <TabsTrigger value="overview" className="text-purple-200 data-[state=active]:bg-purple-600">
                  概览
                </TabsTrigger>
                <TabsTrigger value="details" className="text-purple-200 data-[state=active]:bg-purple-600">
                  详细信息
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="text-purple-200 data-[state=active]:bg-purple-600">
                  优化建议
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-300">延迟</p>
                          <p className="text-2xl font-bold text-white">{results.ping}ms</p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-300">下载速度</p>
                          <p className="text-2xl font-bold text-white">{results.downloadSpeed}Mbps</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-300">上传速度</p>
                          <p className="text-2xl font-bold text-white">{results.uploadSpeed}Mbps</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-300">网络状态</p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(results.status)}
                            <span className={`font-bold ${getStatusColor(results.status)}`}>
                              {getStatusText(results.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        网络性能指标
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">延迟 (Ping)</span>
                        <Badge variant="outline" className="text-white border-purple-500">
                          {results.ping}ms
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">抖动 (Jitter)</span>
                        <Badge variant="outline" className="text-white border-purple-500">
                          {results.jitter}ms
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">丢包率</span>
                        <Badge variant="outline" className="text-white border-purple-500">
                          {results.packetLoss.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">DNS解析时间</span>
                        <Badge variant="outline" className="text-white border-purple-500">
                          {results.dnsResolution}ms
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-400" />
                        网络信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">IP地址</span>
                        <span className="text-white font-mono">{results.ipAddress}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">ISP</span>
                        <span className="text-white">{results.isp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">位置</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{results.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Alert className="bg-purple-900/20 border-purple-500/30">
                  <AlertTriangle className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-200">
                    基于您的网络诊断结果，我们为您提供以下优化建议：
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <Card key={index} className="bg-purple-900/20 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-purple-200">{recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
