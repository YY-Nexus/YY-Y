"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Github,
  GitBranch,
  GitCommit,
  Play,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UniversalQueryAnimation } from "@/components/universal-query-animation"

// 工作流状态类型
type WorkflowStatus = "success" | "failure" | "pending" | "running"

// 工作流运行记录类型
interface WorkflowRun {
  id: string
  name: string
  branch: string
  commit: string
  status: WorkflowStatus
  startedAt: Date
  duration: string
  triggeredBy: string
  url: string
  jobs: {
    name: string
    status: WorkflowStatus
    duration: string
  }[]
}

// 环境类型
interface Environment {
  name: string
  url: string
  status: "active" | "inactive"
  lastDeployment: {
    id: string
    version: string
    date: Date
    status: "success" | "failure"
  }
}

// 模拟数据 - 实际应用中应从 GitHub API 获取
const mockWorkflowRuns: WorkflowRun[] = [
  {
    id: "1234567890",
    name: "YYC³ NetTrack Enhanced CI/CD",
    branch: "main",
    commit: "a1b2c3d",
    status: "success",
    startedAt: new Date(Date.now() - 3600000),
    duration: "18分钟",
    triggeredBy: "自动触发",
    url: "https://github.com/yanyu-cloud/nettrack/actions/runs/1234567890",
    jobs: [
      { name: "代码质量检查", status: "success", duration: "3分钟" },
      { name: "测试套件", status: "success", duration: "8分钟" },
      { name: "性能测试", status: "success", duration: "4分钟" },
      { name: "安全扫描", status: "success", duration: "2分钟" },
      { name: "构建", status: "success", duration: "3分钟" },
      { name: "部署到生产环境", status: "success", duration: "2分钟" },
    ],
  },
  {
    id: "0987654321",
    name: "YYC³ NetTrack CI/CD",
    branch: "develop",
    commit: "e5f6g7h",
    status: "running",
    startedAt: new Date(Date.now() - 1800000),
    duration: "进行中",
    triggeredBy: "手动触发",
    url: "https://github.com/yanyu-cloud/nettrack/actions/runs/0987654321",
    jobs: [
      { name: "代码检查", status: "success", duration: "2分钟" },
      { name: "测试", status: "success", duration: "6分钟" },
      { name: "构建", status: "running", duration: "进行中" },
      { name: "部署到测试环境", status: "pending", duration: "等待中" },
    ],
  },
  {
    id: "2468013579",
    name: "YYC³ NetTrack CI/CD",
    branch: "feature/api-docs",
    commit: "i9j0k1l",
    status: "failure",
    startedAt: new Date(Date.now() - 86400000),
    duration: "8分钟",
    triggeredBy: "拉取请求",
    url: "https://github.com/yanyu-cloud/nettrack/actions/runs/2468013579",
    jobs: [
      { name: "代码检查", status: "success", duration: "2分钟" },
      { name: "测试", status: "failure", duration: "6分钟" },
      { name: "构建", status: "pending", duration: "未执行" },
      { name: "部署到测试环境", status: "pending", duration: "未执行" },
    ],
  },
]

// 模拟环境数据
const mockEnvironments: Environment[] = [
  {
    name: "生产环境",
    url: "https://yyc3-nettrack.vercel.app",
    status: "active",
    lastDeployment: {
      id: "prod-1234",
      version: "v1.2.3",
      date: new Date(Date.now() - 86400000),
      status: "success",
    },
  },
  {
    name: "测试环境",
    url: "https://staging.yyc3-nettrack.vercel.app",
    status: "active",
    lastDeployment: {
      id: "stage-5678",
      version: "v1.3.0-beta",
      date: new Date(Date.now() - 3600000),
      status: "success",
    },
  },
]

// 状态徽章组件
function StatusBadge({ status }: { status: WorkflowStatus }) {
  switch (status) {
    case "success":
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          成功
        </Badge>
      )
    case "failure":
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
          <XCircle className="w-3 h-3 mr-1" />
          失败
        </Badge>
      )
    case "running":
      return (
        <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          运行中
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
          <Clock className="w-3 h-3 mr-1" />
          等待中
        </Badge>
      )
    default:
      return null
  }
}

// 工作流详情组件
function WorkflowDetail({ workflow }: { workflow: WorkflowRun }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">{workflow.name}</CardTitle>
            <CardDescription className="text-white/70">运行 ID: {workflow.id}</CardDescription>
          </div>
          <StatusBadge status={workflow.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-white/80">
              <GitBranch className="w-4 h-4 mr-2" />
              <span className="font-medium">分支:</span>
              <span className="ml-2">{workflow.branch}</span>
            </div>
            <div className="flex items-center text-white/80">
              <GitCommit className="w-4 h-4 mr-2" />
              <span className="font-medium">提交:</span>
              <span className="ml-2">{workflow.commit}</span>
            </div>
            <div className="flex items-center text-white/80">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">开始时间:</span>
              <span className="ml-2">{workflow.startedAt.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-white/80">
              <Play className="w-4 h-4 mr-2" />
              <span className="font-medium">触发方式:</span>
              <span className="ml-2">{workflow.triggeredBy}</span>
            </div>
            <div className="flex items-center text-white/80">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="font-medium">持续时间:</span>
              <span className="ml-2">{workflow.duration}</span>
            </div>
            <div className="flex items-center text-white/80">
              <Github className="w-4 h-4 mr-2" />
              <a
                href={workflow.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                查看 GitHub 工作流
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div>
          <h4 className="text-lg font-medium text-white mb-3">任务状态</h4>
          <div className="space-y-3">
            {workflow.jobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {job.status === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />}
                  {job.status === "failure" && <XCircle className="w-4 h-4 text-red-500 mr-2" />}
                  {job.status === "running" && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin mr-2" />}
                  {job.status === "pending" && <Clock className="w-4 h-4 text-yellow-500 mr-2" />}
                  <span className="text-white/90">{job.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white/70 text-sm">{job.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full flex justify-between items-center">
          <Button variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新状态
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10">
            查看详细日志
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// 环境卡片组件
function EnvironmentCard({ environment }: { environment: Environment }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">{environment.name}</CardTitle>
          <Badge
            variant="outline"
            className={
              environment.status === "active"
                ? "bg-green-500/20 text-green-500 border-green-500/50"
                : "bg-gray-500/20 text-gray-400 border-gray-500/50"
            }
          >
            {environment.status === "active" ? "活跃" : "不活跃"}
          </Badge>
        </div>
        <CardDescription className="text-white/70">
          <a
            href={environment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            <Server className="w-3 h-3 mr-1" />
            {environment.url}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">最近部署</span>
            <Badge
              variant="outline"
              className={
                environment.lastDeployment.status === "success"
                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                  : "bg-red-500/20 text-red-500 border-red-500/50"
              }
            >
              {environment.lastDeployment.status === "success" ? "成功" : "失败"}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">版本</span>
            <span className="text-white">{environment.lastDeployment.version}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">部署时间</span>
            <span className="text-white">{environment.lastDeployment.date.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full flex justify-between">
          <Button variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10">
            查看部署
          </Button>
          <Button variant="default" size="sm">
            重新部署
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// 工作流配置组件
function WorkflowConfig() {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">GitHub Actions 工作流配置</h3>
        <div className="bg-gray-900/80 rounded-md p-4 overflow-auto max-h-[400px]">
          <pre className="text-sm text-white/90 font-mono">
            <code>{`name: YYC³ NetTrack CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  lint:
    name: 代码检查
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: 安装依赖
        run: npm ci
      - name: 运行代码检查
        run: npm run lint
      - name: 类型检查
        run: npm run type-check

  test:
    name: 测试
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      # ... 更多步骤 ...

  build:
    name: 构建
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      # ... 更多步骤 ...

  deploy-staging:
    name: 部署到测试环境
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')
    # ... 更多步骤 ...

  deploy-production:
    name: 部署到生产环境
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production')
    # ... 更多步骤 ...`}</code>
          </pre>
        </div>
      </div>

      <Alert className="bg-blue-500/20 border-blue-500/50 text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>配置说明</AlertTitle>
        <AlertDescription>
          此工作流配置了完整的 CI/CD 流程，包括代码检查、测试、构建和部署。 您可以通过推送到 main 或 develop
          分支自动触发，也可以手动触发并选择部署环境。
        </AlertDescription>
      </Alert>

      <Alert className="bg-green-500/20 border-green-500/50 text-white">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>✨ 新增功能</AlertTitle>
        <AlertDescription>
          增强版 CI/CD 流水线包含：性能测试、安全扫描、自动版本管理、多渠道通知、详细测试覆盖率报告和自动发布说明生成。
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">设置 GitHub Secrets</CardTitle>
            <CardDescription className="text-white/70">需要在 GitHub 仓库中配置以下密钥</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start">
                <span className="font-mono bg-gray-800/50 px-2 py-0.5 rounded text-sm mr-2">VERCEL_TOKEN</span>
                <span>Vercel API 令牌</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-800/50 px-2 py-0.5 rounded text-sm mr-2">VERCEL_ORG_ID</span>
                <span>Vercel 组织 ID</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-800/50 px-2 py-0.5 rounded text-sm mr-2">VERCEL_PROJECT_ID</span>
                <span>Vercel 项目 ID</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">分支策略</CardTitle>
            <CardDescription className="text-white/70">推荐的 Git 分支工作流</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start">
                <GitBranch className="w-4 h-4 mr-2 text-green-500" />
                <div>
                  <span className="font-medium">main</span>
                  <span className="block text-sm text-white/60">生产环境代码，自动部署到生产</span>
                </div>
              </li>
              <li className="flex items-start">
                <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <span className="font-medium">develop</span>
                  <span className="block text-sm text-white/60">开发分支，自动部署到测试环境</span>
                </div>
              </li>
              <li className="flex items-start">
                <GitBranch className="w-4 h-4 mr-2 text-purple-500" />
                <div>
                  <span className="font-medium">feature/*</span>
                  <span className="block text-sm text-white/60">功能分支，合并到 develop</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 主 CI/CD 模块组件
export function CiCdModule() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowRun | null>(null)
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([])
  const [environments, setEnvironments] = useState<Environment[]>([])

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkflowRuns(mockWorkflowRuns)
      setEnvironments(mockEnvironments)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 处理工作流点击
  const handleWorkflowClick = (workflow: WorkflowRun) => {
    setActiveWorkflow(workflow)
  }

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <UniversalQueryAnimation size="lg" />
        <h3 className="text-xl font-medium text-white mt-4">加载 CI/CD 数据...</h3>
        <p className="text-white/70 mt-2">正在从 GitHub 获取最新工作流信息</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white mb-2">GitHub Actions CI/CD</h1>
          <p className="text-white/70 max-w-2xl mx-auto">自动化构建、测试和部署流程，确保代码质量和快速交付</p>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
            概览
          </TabsTrigger>
          <TabsTrigger value="workflows" className="text-white data-[state=active]:bg-white/20">
            工作流
          </TabsTrigger>
          <TabsTrigger value="environments" className="text-white data-[state=active]:bg-white/20">
            环境
          </TabsTrigger>
          <TabsTrigger value="config" className="text-white data-[state=active]:bg-white/20">
            配置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">工作流状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-4">
                  {workflowRuns.filter((w) => w.status === "success").length}/{workflowRuns.length}
                </div>
                <Progress
                  value={(workflowRuns.filter((w) => w.status === "success").length / workflowRuns.length) * 100}
                  className="h-2 bg-white/20"
                  indicatorClassName="bg-green-500"
                />
                <div className="flex justify-between mt-2 text-sm text-white/70">
                  <span>成功率</span>
                  <span>
                    {Math.round(
                      (workflowRuns.filter((w) => w.status === "success").length / workflowRuns.length) * 100,
                    )}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">活跃环境</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-4">
                  {environments.filter((e) => e.status === "active").length}
                </div>
                <div className="space-y-2">
                  {environments.map((env, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white/80">{env.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          env.status === "active"
                            ? "bg-green-500/20 text-green-500 border-green-500/50"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                        }
                      >
                        {env.status === "active" ? "活跃" : "不活跃"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflowRuns.slice(0, 3).map((run, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        {run.status === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />}
                        {run.status === "failure" && <XCircle className="w-4 h-4 text-red-500 mr-2" />}
                        {run.status === "running" && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin mr-2" />}
                        {run.status === "pending" && <Clock className="w-4 h-4 text-yellow-500 mr-2" />}
                        <span className="text-white/90 text-sm">{run.branch}</span>
                      </div>
                      <span className="text-white/70 text-xs">{new Date(run.startedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                  查看所有活动
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">最近工作流运行</CardTitle>
                <CardDescription className="text-white/70">显示最近的 CI/CD 工作流运行状态</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70">状态</TableHead>
                      <TableHead className="text-white/70">工作流</TableHead>
                      <TableHead className="text-white/70">分支</TableHead>
                      <TableHead className="text-white/70">提交</TableHead>
                      <TableHead className="text-white/70">触发方式</TableHead>
                      <TableHead className="text-white/70">开始时间</TableHead>
                      <TableHead className="text-white/70">持续时间</TableHead>
                      <TableHead className="text-white/70 text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflowRuns.map((run) => (
                      <TableRow
                        key={run.id}
                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => handleWorkflowClick(run)}
                      >
                        <TableCell>
                          <StatusBadge status={run.status} />
                        </TableCell>
                        <TableCell className="font-medium text-white">{run.name}</TableCell>
                        <TableCell className="text-white/80">{run.branch}</TableCell>
                        <TableCell className="text-white/80">{run.commit}</TableCell>
                        <TableCell className="text-white/80">{run.triggeredBy}</TableCell>
                        <TableCell className="text-white/80">{run.startedAt.toLocaleString()}</TableCell>
                        <TableCell className="text-white/80">{run.duration}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(run.url, "_blank")
                            }}
                          >
                            <Github className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {activeWorkflow ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setActiveWorkflow(null)}
                  >
                    返回工作流列表
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white/80 hover:bg-white/10"
                    onClick={() => window.open(activeWorkflow.url, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />在 GitHub 中查看
                  </Button>
                </div>
                <WorkflowDetail workflow={activeWorkflow} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">所有工作流运行</h3>
                  <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新
                  </Button>
                </div>
                {workflowRuns.map((run, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                    onClick={() => handleWorkflowClick(run)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <StatusBadge status={run.status} />
                          <span className="ml-2 text-white font-medium">{run.name}</span>
                        </div>
                        <span className="text-white/70 text-sm">{run.startedAt.toLocaleString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-white/80">
                          <GitBranch className="w-4 h-4 mr-2" />
                          <span>{run.branch}</span>
                        </div>
                        <div className="flex items-center text-white/80">
                          <GitCommit className="w-4 h-4 mr-2" />
                          <span>{run.commit}</span>
                        </div>
                        <div className="flex items-center text-white/80">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{run.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full">
                        <div className="flex space-x-2 overflow-x-auto pb-1">
                          {run.jobs.map((job, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={`
                                ${job.status === "success" ? "bg-green-500/20 text-green-500 border-green-500/50" : ""}
                                ${job.status === "failure" ? "bg-red-500/20 text-red-500 border-red-500/50" : ""}
                                ${job.status === "running" ? "bg-blue-500/20 text-blue-500 border-blue-500/50" : ""}
                                ${job.status === "pending" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" : ""}
                              `}
                            >
                              {job.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="environments" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environments.map((env, index) => (
              <EnvironmentCard key={index} environment={env} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="mt-0">
          <WorkflowConfig />
        </TabsContent>
      </Tabs>
    </div>
  )
}
