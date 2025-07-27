"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApi } from "@/hooks/use-api"
import { Loader2, CheckCircle, XCircle, Activity, Zap } from "lucide-react"

interface TestResult {
  name: string
  status: "idle" | "loading" | "success" | "error"
  data?: any
  error?: string
  duration?: number
}

export function ApiTestPanel() {
  const api = useApi()
  const [tests, setTests] = useState<TestResult[]>([
    { name: "基础连接测试", status: "idle" },
    { name: "健康检查", status: "idle" },
    { name: "Ping测试", status: "idle" },
    { name: "速度测试", status: "idle" },
  ])

  const [pingTarget, setPingTarget] = useState("google.com")
  const [pingCount, setPingCount] = useState(4)
  const [speedTestType, setSpeedTestType] = useState("both")
  const [speedDuration, setSpeedDuration] = useState(10)

  const updateTestStatus = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, ...updates } : test)))
  }

  const runTest = async (testIndex: number) => {
    const startTime = Date.now()
    updateTestStatus(testIndex, { status: "loading", error: undefined })

    try {
      let result
      switch (testIndex) {
        case 0: // 基础连接测试
          result = await api.get("/api/test")
          break
        case 1: // 健康检查
          result = await api.get("/api/health")
          break
        case 2: // Ping测试
          result = await api.get(`/api/network/ping?target=${pingTarget}&count=${pingCount}`)
          break
        case 3: // 速度测试
          result = await api.get(`/api/network/speed?type=${speedTestType}&duration=${speedDuration}`)
          break
        default:
          throw new Error("未知测试类型")
      }

      const duration = Date.now() - startTime
      updateTestStatus(testIndex, {
        status: "success",
        data: result,
        duration,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestStatus(testIndex, {
        status: "error",
        error: error instanceof Error ? error.message : "测试失败",
        duration,
      })
    }
  }

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i)
      // 测试间隔500ms
      if (i < tests.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return <Badge variant="secondary">测试中</Badge>
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            成功
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">失败</Badge>
      default:
        return <Badge variant="outline">待测试</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API接口测试面板
          </CardTitle>
          <CardDescription>测试所有API端点的连通性和功能性</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runAllTests} disabled={api.loading}>
              {api.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                "运行所有测试"
              )}
            </Button>
          </div>

          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tests">测试结果</TabsTrigger>
              <TabsTrigger value="config">测试配置</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              {tests.map((test, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <CardTitle className="text-base">{test.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(test.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runTest(index)}
                          disabled={test.status === "loading"}
                        >
                          {test.status === "loading" ? "测试中..." : "重新测试"}
                        </Button>
                      </div>
                    </div>
                    {test.duration && <p className="text-sm text-muted-foreground">耗时: {test.duration}ms</p>}
                  </CardHeader>
                  {(test.data || test.error) && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <ScrollArea className="h-32 w-full rounded border p-3">
                        <pre className="text-xs">{test.error || JSON.stringify(test.data, null, 2)}</pre>
                      </ScrollArea>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ping测试配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ping-target">目标地址</Label>
                      <Input
                        id="ping-target"
                        value={pingTarget}
                        onChange={(e) => setPingTarget(e.target.value)}
                        placeholder="google.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ping-count">测试次数</Label>
                      <Input
                        id="ping-count"
                        type="number"
                        min="1"
                        max="10"
                        value={pingCount}
                        onChange={(e) => setPingCount(Number.parseInt(e.target.value) || 4)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">速度测试配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="speed-type">测试类型</Label>
                      <select
                        id="speed-type"
                        className="w-full p-2 border rounded"
                        value={speedTestType}
                        onChange={(e) => setSpeedTestType(e.target.value)}
                      >
                        <option value="both">上传+下载</option>
                        <option value="download">仅下载</option>
                        <option value="upload">仅上传</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speed-duration">测试时长(秒)</Label>
                      <Input
                        id="speed-duration"
                        type="number"
                        min="5"
                        max="60"
                        value={speedDuration}
                        onChange={(e) => setSpeedDuration(Number.parseInt(e.target.value) || 10)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
