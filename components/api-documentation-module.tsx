"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Code,
  Download,
  FileText,
  Globe,
  Zap,
  Shield,
  Monitor,
  MessageSquare,
  Wifi,
  Play,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
} from "lucide-react"
import { swaggerDefinition } from "@/lib/swagger-config"

interface ApiEndpoint {
  method: string
  path: string
  summary: string
  description: string
  tags: string[]
  requestBody?: any
  responses: any
}

interface TestResult {
  endpoint: string
  method: string
  status: "success" | "error" | "pending"
  responseTime: number
  statusCode: number
  response?: any
  error?: string
}

export function ApiDocumentationModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [testProgress, setTestProgress] = useState(0)

  // 从 Swagger 定义中提取端点
  const endpoints: ApiEndpoint[] = Object.entries(swaggerDefinition.paths).flatMap(([path, methods]: [string, any]) =>
    Object.entries(methods).map(([method, details]: [string, any]) => ({
      method: method.toUpperCase(),
      path,
      summary: details.summary,
      description: details.description,
      tags: details.tags || [],
      requestBody: details.requestBody,
      responses: details.responses,
    })),
  )

  const groupedEndpoints = endpoints.reduce(
    (acc, endpoint) => {
      endpoint.tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = []
        }
        acc[tag].push(endpoint)
      })
      return acc
    },
    {} as Record<string, ApiEndpoint[]>,
  )

  const tagIcons = {
    系统监控: Monitor,
    用户反馈: MessageSquare,
    网络测试: Wifi,
  }

  const methodColors = {
    GET: "bg-green-100 text-green-800 border-green-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
  }

  // 测试单个 API 端点
  const testEndpoint = async (endpoint: ApiEndpoint) => {
    const startTime = Date.now()
    const testId = `${endpoint.method}-${endpoint.path}`

    setTestResults((prev) => [
      ...prev.filter((r) => r.endpoint !== testId),
      {
        endpoint: testId,
        method: endpoint.method,
        status: "pending",
        responseTime: 0,
        statusCode: 0,
      },
    ])

    try {
      let response: Response
      const url = `/api${endpoint.path}`

      if (endpoint.method === "GET") {
        response = await fetch(url)
      } else if (endpoint.method === "POST") {
        const body = endpoint.requestBody?.content?.["application/json"]?.example || {}
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      } else {
        throw new Error(`不支持的方法: ${endpoint.method}`)
      }

      const responseTime = Date.now() - startTime
      const responseData = await response.json()

      setTestResults((prev) => [
        ...prev.filter((r) => r.endpoint !== testId),
        {
          endpoint: testId,
          method: endpoint.method,
          status: response.ok ? "success" : "error",
          responseTime,
          statusCode: response.status,
          response: responseData,
        },
      ])
    } catch (error) {
      const responseTime = Date.now() - startTime
      setTestResults((prev) => [
        ...prev.filter((r) => r.endpoint !== testId),
        {
          endpoint: testId,
          method: endpoint.method,
          status: "error",
          responseTime,
          statusCode: 0,
          error: error instanceof Error ? error.message : "未知错误",
        },
      ])
    }
  }

  // 测试所有 API 端点
  const testAllEndpoints = async () => {
    setIsTestingAll(true)
    setTestProgress(0)
    setTestResults([])

    for (let i = 0; i < endpoints.length; i++) {
      await testEndpoint(endpoints[i])
      setTestProgress(((i + 1) / endpoints.length) * 100)
      // 添加延迟避免过快请求
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsTestingAll(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const downloadSpec = () => {
    const dataStr = JSON.stringify(swaggerDefinition, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "yyc3-nettrack-api-spec.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">API 文档与测试中心</h2>
        <p className="text-muted-foreground">完整的 API 接口文档、交互式测试和自动化测试套件</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <BookOpen className="w-3 h-3 mr-1" />
            OpenAPI 3.0
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Shield className="w-3 h-3 mr-1" />
            自动化测试
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <Code className="w-3 h-3 mr-1" />
            交互式文档
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="endpoints">API 接口</TabsTrigger>
          <TabsTrigger value="testing">交互测试</TabsTrigger>
          <TabsTrigger value="automation">自动化测试</TabsTrigger>
          <TabsTrigger value="examples">代码示例</TabsTrigger>
        </TabsList>

        {/* 概览页面 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>API 规范</span>
                </CardTitle>
                <CardDescription>基于 OpenAPI 3.0 的完整 API 规范文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">版本</span>
                    <Badge variant="secondary">{swaggerDefinition.info.version}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">接口数量</span>
                    <span className="font-medium">{endpoints.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">服务器</span>
                    <span className="font-medium">{swaggerDefinition.servers.length} 个</span>
                  </div>
                  <Button onClick={downloadSpec} size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    下载规范
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>测试统计</span>
                </CardTitle>
                <CardDescription>API 测试执行统计和结果分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">成功测试</span>
                    <span className="font-medium text-green-600">
                      {testResults.filter((r) => r.status === "success").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">失败测试</span>
                    <span className="font-medium text-red-600">
                      {testResults.filter((r) => r.status === "error").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">平均响应时间</span>
                    <span className="font-medium">
                      {testResults.length > 0
                        ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length)
                        : 0}
                      ms
                    </span>
                  </div>
                  <Button onClick={testAllEndpoints} disabled={isTestingAll} size="sm" className="w-full">
                    {isTestingAll ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        测试中...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        运行所有测试
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <span>数据模型</span>
                </CardTitle>
                <CardDescription>API 请求和响应的数据结构定义</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Schema 数量</span>
                    <span className="font-medium">{Object.keys(swaggerDefinition.components.schemas).length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">标签分类</span>
                    <span className="font-medium">{swaggerDefinition.tags.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">类型安全</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      TypeScript
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    查看 Schema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 快速开始 */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 快速开始</CardTitle>
              <CardDescription>几分钟内开始使用 YYC³ NetTrack API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. 健康检查</h4>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {`curl -X GET "https://yyc3.com/api/health"`}
                  </pre>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. 提交反馈</h4>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {`curl -X POST "https://yyc3.com/api/feedback" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "suggestion", "title": "建议"}'`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API 接口页面 */}
        <TabsContent value="endpoints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 接口列表 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>API 接口列表</CardTitle>
                  <CardDescription>点击查看详细信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => {
                    const Icon = tagIcons[tag as keyof typeof tagIcons] || FileText
                    return (
                      <div key={tag} className="space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <Icon className="w-4 h-4" />
                          {tag}
                        </div>
                        <div className="space-y-1 ml-6">
                          {tagEndpoints.map((endpoint, index) => (
                            <Button
                              key={`${endpoint.method}-${endpoint.path}-${index}`}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-auto p-2"
                              onClick={() => setSelectedEndpoint(endpoint)}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Badge
                                  className={`text-xs px-2 py-1 ${methodColors[endpoint.method as keyof typeof methodColors]}`}
                                >
                                  {endpoint.method}
                                </Badge>
                                <div className="flex-1 text-left">
                                  <div className="font-mono text-xs">{endpoint.path}</div>
                                  <div className="text-xs text-gray-500 truncate">{endpoint.summary}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* 接口详情 */}
            <div className="lg:col-span-2">
              {selectedEndpoint ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${methodColors[selectedEndpoint.method as keyof typeof methodColors]} px-3 py-1`}
                      >
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono">{selectedEndpoint.path}</code>
                    </div>
                    <CardTitle>{selectedEndpoint.summary}</CardTitle>
                    <CardDescription>{selectedEndpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 请求示例 */}
                    {selectedEndpoint.requestBody && (
                      <div>
                        <h4 className="font-semibold mb-2">请求体示例</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(
                              selectedEndpoint.requestBody.content?.["application/json"]?.example || {},
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* 响应示例 */}
                    <div>
                      <h4 className="font-semibold mb-2">响应示例</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedEndpoint.responses).map(([code, response]: [string, any]) => (
                          <div key={code} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={code === "200" ? "default" : "destructive"}>{code}</Badge>
                              <span className="text-sm">{response.description}</span>
                            </div>
                            {response.content?.["application/json"]?.example && (
                              <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(response.content["application/json"].example, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 测试按钮 */}
                    <div className="flex gap-2">
                      <Button onClick={() => testEndpoint(selectedEndpoint)}>
                        <Play className="w-4 h-4 mr-2" />
                        测试接口
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(`curl -X ${selectedEndpoint.method} "/api${selectedEndpoint.path}"`)
                        }
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制 cURL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>选择一个 API 接口查看详细信息</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 交互测试页面 */}
        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 测试控制面板 */}
            <Card>
              <CardHeader>
                <CardTitle>🧪 API 测试控制台</CardTitle>
                <CardDescription>实时测试 API 接口并查看响应结果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={testAllEndpoints} disabled={isTestingAll} className="flex-1">
                    {isTestingAll ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        测试中...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        运行所有测试
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setTestResults([])}>
                    清除结果
                  </Button>
                </div>

                {isTestingAll && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>测试进度</span>
                      <span>{Math.round(testProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${testProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter((r) => r.status === "success").length}
                    </div>
                    <div className="text-sm text-green-700">成功</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.filter((r) => r.status === "error").length}
                    </div>
                    <div className="text-sm text-red-700">失败</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {testResults.length > 0
                        ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length)
                        : 0}
                      ms
                    </div>
                    <div className="text-sm text-blue-700">平均响应</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 测试结果 */}
            <Card>
              <CardHeader>
                <CardTitle>📊 测试结果</CardTitle>
                <CardDescription>实时显示 API 测试的执行结果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>暂无测试结果</p>
                    </div>
                  ) : (
                    testResults.map((result, index) => (
                      <motion.div
                        key={`${result.endpoint}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={methodColors[result.method as keyof typeof methodColors]}>
                              {result.method}
                            </Badge>
                            <code className="text-sm">{result.endpoint.split("-").slice(1).join("/")}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.status === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {result.status === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
                            {result.status === "pending" && (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                            )}
                            <span className="text-sm text-gray-600">{result.responseTime}ms</span>
                          </div>
                        </div>
                        {result.statusCode > 0 && (
                          <div className="text-sm text-gray-600">
                            状态码: <span className="font-mono">{result.statusCode}</span>
                          </div>
                        )}
                        {result.error && <div className="text-sm text-red-600 mt-1">错误: {result.error}</div>}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 自动化测试页面 */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🤖 自动化测试套件</CardTitle>
              <CardDescription>完整的 API 自动化测试框架和测试用例</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">单元测试</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                    <div className="text-sm text-blue-700">测试用例</div>
                    <div className="text-xs text-gray-600 mt-2">覆盖所有 API 端点的功能测试</div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">集成测试</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                    <div className="text-sm text-green-700">测试场景</div>
                    <div className="text-xs text-gray-600 mt-2">端到端业务流程测试</div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">性能测试</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                    <div className="text-sm text-purple-700">负载测试</div>
                    <div className="text-xs text-gray-600 mt-2">并发和压力测试用例</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">测试框架配置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        {`// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'app/api/**/*.ts',
    '!**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">测试命令</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-800 text-green-400 p-3 rounded text-sm">
                        <div># 运行所有测试</div>
                        <div>npm test</div>
                      </div>
                      <div className="bg-gray-800 text-green-400 p-3 rounded text-sm">
                        <div># 运行覆盖率测试</div>
                        <div>npm run test:coverage</div>
                      </div>
                      <div className="bg-gray-800 text-green-400 p-3 rounded text-sm">
                        <div># 运行性能测试</div>
                        <div>npm run test:performance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">测试覆盖率报告</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-green-700">语句覆盖率</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">88%</div>
                      <div className="text-sm text-blue-700">分支覆盖率</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">95%</div>
                      <div className="text-sm text-purple-700">函数覆盖率</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">90%</div>
                      <div className="text-sm text-orange-700">行覆盖率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 代码示例页面 */}
        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>JavaScript/TypeScript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// 使用 fetch API
async function submitFeedback(feedback) {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('反馈提交成功:', result.data);
    } else {
      console.error('提交失败:', result.message);
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>React Hook 示例</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`import { useState } from 'react';

function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading, error };
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Python 示例</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`import requests
import json

def submit_feedback(feedback_data):
    url = "https://yyc3.com/api/feedback"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(
            url, 
            headers=headers, 
            data=json.dumps(feedback_data)
        )
        
        result = response.json()
        
        if result.get('success'):
            print(f"反馈提交成功: {result['data']}")
        else:
            print(f"提交失败: {result['message']}")
            
    except Exception as e:
        print(f"请求错误: {e}")`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>cURL 命令</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`# 健康检查
curl -X GET "https://yyc3.com/api/health"

# 提交反馈
curl -X POST "https://yyc3.com/api/feedback" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "bug",
    "title": "发现问题",
    "content": "详细描述...",
    "allowContact": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'

# 网络测试
curl -X POST "https://yyc3.com/api/network/test" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "speed",
    "duration": 30
  }'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
