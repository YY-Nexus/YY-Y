"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Monitor,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"

interface TestCase {
  id: string
  name: string
  description: string
  category: "unit" | "integration" | "performance" | "e2e"
  status: "pending" | "running" | "passed" | "failed" | "skipped"
  duration: number
  error?: string
}

interface TestSuite {
  name: string
  description: string
  tests: TestCase[]
  coverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
}

export function TestSuiteModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null)

  // 模拟测试套件数据
  useEffect(() => {
    const mockTestSuites: TestSuite[] = [
      {
        name: "API 单元测试",
        description: "测试各个 API 端点的基本功能",
        coverage: { statements: 92, branches: 88, functions: 95, lines: 90 },
        tests: [
          {
            id: "health-api-test",
            name: "健康检查 API 测试",
            description: "测试 /api/health 端点的响应",
            category: "unit",
            status: "passed",
            duration: 125,
          },
          {
            id: "feedback-api-test",
            name: "反馈提交 API 测试",
            description: "测试 /api/feedback 端点的各种场景",
            category: "unit",
            status: "passed",
            duration: 340,
          },
          {
            id: "network-test-api",
            name: "网络测试 API 测试",
            description: "测试 /api/network/test 端点功能",
            category: "unit",
            status: "failed",
            duration: 280,
            error: "网络连接超时",
          },
          {
            id: "monitor-api-test",
            name: "监控 API 测试",
            description: "测试 /api/monitor 端点的监控数据",
            category: "unit",
            status: "passed",
            duration: 156,
          },
        ],
      },
      {
        name: "集成测试",
        description: "测试 API 之间的交互和业务流程",
        coverage: { statements: 85, branches: 82, functions: 88, lines: 84 },
        tests: [
          {
            id: "feedback-workflow",
            name: "反馈提交完整流程",
            description: "测试从提交到邮件发送的完整流程",
            category: "integration",
            status: "passed",
            duration: 1250,
          },
          {
            id: "network-test-workflow",
            name: "网络测试完整流程",
            description: "测试网络测试的启动、执行和结果获取",
            category: "integration",
            status: "passed",
            duration: 2340,
          },
          {
            id: "error-handling",
            name: "错误处理集成测试",
            description: "测试各种错误情况的处理",
            category: "integration",
            status: "passed",
            duration: 890,
          },
        ],
      },
      {
        name: "性能测试",
        description: "测试 API 的性能和负载处理能力",
        coverage: { statements: 78, branches: 75, functions: 80, lines: 77 },
        tests: [
          {
            id: "load-test",
            name: "负载测试",
            description: "测试高并发请求下的性能表现",
            category: "performance",
            status: "passed",
            duration: 5600,
          },
          {
            id: "stress-test",
            name: "压力测试",
            description: "测试系统在极限负载下的表现",
            category: "performance",
            status: "running",
            duration: 0,
          },
          {
            id: "memory-test",
            name: "内存泄漏测试",
            description: "检测长时间运行的内存使用情况",
            category: "performance",
            status: "pending",
            duration: 0,
          },
        ],
      },
      {
        name: "端到端测试",
        description: "模拟真实用户场景的完整测试",
        coverage: { statements: 70, branches: 68, functions: 72, lines: 69 },
        tests: [
          {
            id: "user-journey",
            name: "用户完整使用流程",
            description: "模拟用户从访问到使用各功能的完整流程",
            category: "e2e",
            status: "passed",
            duration: 3450,
          },
          {
            id: "cross-browser",
            name: "跨浏览器兼容性测试",
            description: "测试在不同浏览器中的兼容性",
            category: "e2e",
            status: "skipped",
            duration: 0,
          },
        ],
      },
    ]

    setTestSuites(mockTestSuites)
    setSelectedSuite(mockTestSuites[0])
  }, [])

  const runAllTests = async () => {
    setIsRunning(true)
    setProgress(0)

    // 模拟测试执行
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setProgress(i)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "running":
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      case "skipped":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "passed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "running":
        return "text-blue-600"
      case "pending":
        return "text-gray-400"
      case "skipped":
        return "text-yellow-600"
      default:
        return "text-gray-400"
    }
  }

  const getCategoryIcon = (category: TestCase["category"]) => {
    switch (category) {
      case "unit":
        return <Shield className="w-4 h-4" />
      case "integration":
        return <Zap className="w-4 h-4" />
      case "performance":
        return <BarChart3 className="w-4 h-4" />
      case "e2e":
        return <Monitor className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0)
  const passedTests = testSuites.reduce(
    (sum, suite) => sum + suite.tests.filter((test) => test.status === "passed").length,
    0,
  )
  const failedTests = testSuites.reduce(
    (sum, suite) => sum + suite.tests.filter((test) => test.status === "failed").length,
    0,
  )
  const averageCoverage = testSuites.reduce((sum, suite) => sum + suite.coverage.statements, 0) / testSuites.length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">自动化测试套件</h2>
        <p className="text-muted-foreground">完整的 API 测试框架，包含单元测试、集成测试、性能测试和端到端测试</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            {passedTests} 通过
          </Badge>
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            {failedTests} 失败
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <BarChart3 className="w-3 h-3 mr-1" />
            {Math.round(averageCoverage)}% 覆盖率
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">测试概览</TabsTrigger>
          <TabsTrigger value="suites">测试套件</TabsTrigger>
          <TabsTrigger value="coverage">覆盖率报告</TabsTrigger>
          <TabsTrigger value="reports">测试报告</TabsTrigger>
        </TabsList>

        {/* 测试概览 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">总测试数</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
                <div className="text-sm text-gray-600">个测试用例</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">通过测试</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-green-600">
                  {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}% 通过率
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">失败测试</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-red-600">
                  {totalTests > 0 ? Math.round((failedTests / totalTests) * 100) : 0}% 失败率
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">平均覆盖率</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{Math.round(averageCoverage)}%</div>
                <div className="text-sm text-purple-600">代码覆盖率</div>
              </CardContent>
            </Card>
          </div>

          {/* 测试控制面板 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                测试控制面板
              </CardTitle>
              <CardDescription>运行和管理自动化测试</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={runAllTests} disabled={isRunning} className="flex-1">
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      测试运行中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      运行所有测试
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  停止测试
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重置
                </Button>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>测试进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {testSuites.map((suite, index) => (
                  <Card key={suite.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {index === 0 && <Shield className="w-4 h-4 text-blue-600" />}
                        {index === 1 && <Zap className="w-4 h-4 text-green-600" />}
                        {index === 2 && <BarChart3 className="w-4 h-4 text-purple-600" />}
                        {index === 3 && <Monitor className="w-4 h-4 text-orange-600" />}
                        <span className="font-medium text-sm">{suite.name}</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{suite.tests.length}</div>
                      <div className="text-sm text-gray-600">测试用例</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>覆盖率</span>
                          <span>{suite.coverage.statements}%</span>
                        </div>
                        <Progress value={suite.coverage.statements} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最近测试结果 */}
          <Card>
            <CardHeader>
              <CardTitle>最近测试结果</CardTitle>
              <CardDescription>显示最新的测试执行结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedSuite?.tests.slice(0, 5).map((test) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-600">{test.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getCategoryIcon(test.category)} {test.category}
                      </Badge>
                      <span className="text-sm text-gray-600">{test.duration}ms</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 测试套件详情 */}
        <TabsContent value="suites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 套件列表 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>测试套件</CardTitle>
                  <CardDescription>选择查看详细信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {testSuites.map((suite, index) => (
                    <Button
                      key={suite.name}
                      variant={selectedSuite?.name === suite.name ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedSuite(suite)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {index === 0 && <Shield className="w-4 h-4 text-blue-600" />}
                        {index === 1 && <Zap className="w-4 h-4 text-green-600" />}
                        {index === 2 && <BarChart3 className="w-4 h-4 text-purple-600" />}
                        {index === 3 && <Monitor className="w-4 h-4 text-orange-600" />}
                        <div className="flex-1 text-left">
                          <div className="font-medium">{suite.name}</div>
                          <div className="text-sm text-gray-600">{suite.tests.length} 个测试</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 套件详情 */}
            <div className="lg:col-span-2">
              {selectedSuite && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedSuite.name}</CardTitle>
                    <CardDescription>{selectedSuite.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 覆盖率统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedSuite.coverage.statements}%</div>
                        <div className="text-sm text-blue-700">语句覆盖率</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedSuite.coverage.branches}%</div>
                        <div className="text-sm text-green-700">分支覆盖率</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedSuite.coverage.functions}%</div>
                        <div className="text-sm text-purple-700">函数覆盖率</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedSuite.coverage.lines}%</div>
                        <div className="text-sm text-orange-700">行覆盖率</div>
                      </div>
                    </div>

                    {/* 测试用例列表 */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">测试用例</h4>
                      {selectedSuite.tests.map((test) => (
                        <div key={test.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium">{test.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{test.category}</Badge>
                              <span className="text-sm text-gray-600">{test.duration}ms</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{test.description}</div>
                          {test.error && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">错误: {test.error}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 覆盖率报告 */}
        <TabsContent value="coverage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                代码覆盖率报告
              </CardTitle>
              <CardDescription>详细的代码覆盖率分析和趋势</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 总体覆盖率 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.statements, 0) / testSuites.length,
                      )}
                      %
                    </div>
                    <div className="text-sm text-blue-700">语句覆盖率</div>
                    <Progress
                      value={Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.statements, 0) / testSuites.length,
                      )}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.branches, 0) / testSuites.length,
                      )}
                      %
                    </div>
                    <div className="text-sm text-green-700">分支覆盖率</div>
                    <Progress
                      value={Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.branches, 0) / testSuites.length,
                      )}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.functions, 0) / testSuites.length,
                      )}
                      %
                    </div>
                    <div className="text-sm text-purple-700">函数覆盖率</div>
                    <Progress
                      value={Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.functions, 0) / testSuites.length,
                      )}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {Math.round(testSuites.reduce((sum, suite) => sum + suite.coverage.lines, 0) / testSuites.length)}
                      %
                    </div>
                    <div className="text-sm text-orange-700">行覆盖率</div>
                    <Progress
                      value={Math.round(
                        testSuites.reduce((sum, suite) => sum + suite.coverage.lines, 0) / testSuites.length,
                      )}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* 各套件覆盖率对比 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">各测试套件覆盖率对比</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testSuites.map((suite, index) => (
                      <div key={suite.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{suite.name}</span>
                          <span className="text-sm text-gray-600">{suite.coverage.statements}%</span>
                        </div>
                        <Progress value={suite.coverage.statements} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 覆盖率趋势 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">覆盖率趋势分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">覆盖率趋势图表</p>
                    <p className="text-sm text-gray-500 mt-2">显示过去30天的覆盖率变化趋势</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 测试报告 */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                测试报告
              </CardTitle>
              <CardDescription>生成和下载详细的测试报告</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 报告生成选项 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold mb-1">HTML 报告</h4>
                    <p className="text-sm text-gray-600 mb-3">可视化的测试结果报告</p>
                    <Button size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      生成 HTML
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold mb-1">JSON 数据</h4>
                    <p className="text-sm text-gray-600 mb-3">机器可读的测试数据</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      导出 JSON
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold mb-1">PDF 报告</h4>
                    <p className="text-sm text-gray-600 mb-3">专业的测试总结报告</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      生成 PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* 报告摘要 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">测试执行摘要</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">测试统计</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>总测试数:</span>
                          <span className="font-medium">{totalTests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>通过测试:</span>
                          <span className="font-medium text-green-600">{passedTests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>失败测试:</span>
                          <span className="font-medium text-red-600">{failedTests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>跳过测试:</span>
                          <span className="font-medium text-yellow-600">
                            {testSuites.reduce(
                              (sum, suite) => sum + suite.tests.filter((test) => test.status === "skipped").length,
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>成功率:</span>
                          <span className="font-medium">
                            {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">性能指标</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>总执行时间:</span>
                          <span className="font-medium">
                            {testSuites.reduce(
                              (sum, suite) => sum + suite.tests.reduce((s, test) => s + test.duration, 0),
                              0,
                            )}
                            ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>平均测试时间:</span>
                          <span className="font-medium">
                            {totalTests > 0
                              ? Math.round(
                                  testSuites.reduce(
                                    (sum, suite) => sum + suite.tests.reduce((s, test) => s + test.duration, 0),
                                    0,
                                  ) / totalTests,
                                )
                              : 0}
                            ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>最慢测试:</span>
                          <span className="font-medium">
                            {Math.max(...testSuites.flatMap((suite) => suite.tests.map((test) => test.duration)))}ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>最快测试:</span>
                          <span className="font-medium">
                            {Math.min(
                              ...testSuites
                                .flatMap((suite) => suite.tests.map((test) => test.duration))
                                .filter((d) => d > 0),
                            )}
                            ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>平均覆盖率:</span>
                          <span className="font-medium">{Math.round(averageCoverage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 历史报告 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">历史报告</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "2024-01-15 14:30", status: "通过", tests: "24/24", coverage: "92%" },
                      { date: "2024-01-15 10:15", status: "失败", tests: "23/24", coverage: "90%" },
                      { date: "2024-01-14 16:45", status: "通过", tests: "24/24", coverage: "91%" },
                      { date: "2024-01-14 09:20", status: "通过", tests: "22/22", coverage: "89%" },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {report.status === "通过" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <div>
                            <div className="font-medium">{report.date}</div>
                            <div className="text-sm text-gray-600">
                              {report.tests} 测试 • {report.coverage} 覆盖率
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
