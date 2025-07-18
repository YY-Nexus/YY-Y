"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Server,
  Download,
  Play,
  Square,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Zap,
  Activity,
  Database,
  Settings,
  TestTube,
} from "lucide-react"

// 类型定义
interface OllamaModel {
  name: string
  tag: string
  series: string
  size: string
  contextLength: number
  capabilities: string[]
  description: string
  downloaded: boolean
  running: boolean
  systemRequirements: {
    minRam: string
    recommendedRam: string
    diskSpace: string
    gpu?: string
  }
}

interface OllamaServiceStatus {
  isOnline: boolean
  version: string
  runningModels: number
  downloadedModels: number
  totalModels: number
  systemInfo: {
    cpu: string
    memory: {
      total: string
      used: string
      available: string
    }
    gpu?: {
      name: string
      memory: string
    }
    storage: {
      total: string
      used: string
      available: string
    }
  }
  models: OllamaModel[]
}

export default function LocalAPIPage() {
  const { toast } = useToast()

  // 状态定义
  const [serviceStatus, setServiceStatus] = useState<OllamaServiceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeries, setSelectedSeries] = useState<string>("all")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [testPrompt, setTestPrompt] = useState("你好，请介绍一下你自己。")
  const [testResult, setTestResult] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set())
  const [operatingModel, setOperatingModel] = useState<string>("")
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({})
  const [seriesDropdownOpen, setSeriesDropdownOpen] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)

  const seriesDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (seriesDropdownRef.current && !seriesDropdownRef.current.contains(event.target as Node)) {
        setSeriesDropdownOpen(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 获取服务状态数据
  const fetchServiceStatus = async () => {
    try {
      // 模拟数据，实际应替换为真实接口请求
      const mockData: OllamaServiceStatus = {
        isOnline: true,
        version: "0.1.26",
        runningModels: 1,
        downloadedModels: 5,
        totalModels: 12,
        systemInfo: {
          cpu: "Intel Core i7-12700K @ 3.60GHz",
          memory: {
            total: "32.0 GB",
            used: "18.5 GB",
            available: "13.5 GB",
          },
          gpu: {
            name: "NVIDIA RTX 4080",
            memory: "16 GB GDDR6X",
          },
          storage: {
            total: "1.0 TB",
            used: "450 GB",
            available: "550 GB",
          },
        },
        models: [
          {
            name: "deepseek-r1",
            tag: "latest",
            series: "DeepSeek",
            size: "14.8 GB",
            contextLength: 32768,
            capabilities: ["推理", "数学", "代码", "中文"],
            description: "DeepSeek-R1 是一个专注于推理能力的大语言模型，在数学和代码生成方面表现优异。",
            downloaded: true,
            running: true,
            systemRequirements: {
              minRam: "16 GB",
              recommendedRam: "32 GB",
              diskSpace: "20 GB",
              gpu: "RTX 3080 或更高",
            },
          },
          {
            name: "gemma2",
            tag: "27b",
            series: "Gemma",
            size: "16.0 GB",
            contextLength: 8192,
            capabilities: ["对话", "文本生成", "翻译"],
            description: "Google Gemma2 27B 是一个高效的开源语言模型，适合各种文本生成任务。",
            downloaded: true,
            running: false,
            systemRequirements: {
              minRam: "32 GB",
              recommendedRam: "64 GB",
              diskSpace: "25 GB",
              gpu: "RTX 4080 或更高",
            },
          },
          {
            name: "qwen2.5",
            tag: "14b",
            series: "Qwen",
            size: "8.7 GB",
            contextLength: 32768,
            capabilities: ["中文", "多语言", "代码", "数学"],
            description: "通义千问2.5 14B 模型，专门优化了中文理解和生成能力。",
            downloaded: true,
            running: false,
            systemRequirements: {
              minRam: "16 GB",
              recommendedRam: "24 GB",
              diskSpace: "12 GB",
              gpu: "RTX 3070 或更高",
            },
          },
          {
            name: "llama3.2",
            tag: "3b",
            series: "Llama",
            size: "2.0 GB",
            contextLength: 128000,
            capabilities: ["对话", "文本生成", "摘要"],
            description: "Meta Llama 3.2 3B 是一个轻量级但功能强大的语言模型。",
            downloaded: true,
            running: false,
            systemRequirements: {
              minRam: "4 GB",
              recommendedRam: "8 GB",
              diskSpace: "4 GB",
            },
          },
          {
            name: "codellama",
            tag: "13b",
            series: "Llama",
            size: "7.4 GB",
            contextLength: 16384,
            capabilities: ["代码生成", "代码解释", "调试"],
            description: "Code Llama 13B 专门针对代码生成和编程任务优化的模型。",
            downloaded: true,
            running: false,
            systemRequirements: {
              minRam: "16 GB",
              recommendedRam: "24 GB",
              diskSpace: "10 GB",
              gpu: "RTX 3060 或更高",
            },
          },
          {
            name: "mistral",
            tag: "7b",
            series: "Mistral",
            size: "4.1 GB",
            contextLength: 32768,
            capabilities: ["对话", "推理", "多语言"],
            description: "Mistral 7B 是一个高效的开源语言模型，在多项基准测试中表现优异。",
            downloaded: false,
            running: false,
            systemRequirements: {
              minRam: "8 GB",
              recommendedRam: "16 GB",
              diskSpace: "6 GB",
            },
          },
          {
            name: "phi3",
            tag: "mini",
            series: "Phi",
            size: "2.3 GB",
            contextLength: 128000,
            capabilities: ["对话", "推理", "数学"],
            description: "Microsoft Phi-3 Mini 是一个小型但功能强大的语言模型。",
            downloaded: false,
            running: false,
            systemRequirements: {
              minRam: "4 GB",
              recommendedRam: "8 GB",
              diskSpace: "4 GB",
            },
          },
        ],
      }

      setServiceStatus(mockData)

      // 自动选择正在运行的模型
      if (mockData.models.length > 0 && !selectedModel) {
        const runningModel = mockData.models.find((m) => m.running)
        if (runningModel) {
          setSelectedModel(`${runningModel.name}:${runningModel.tag}`)
        }
      }
    } catch (error) {
      toast({
        title: "连接失败",
        description: "无法连接到本地模型服务",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据获取
  useEffect(() => {
    fetchServiceStatus()
    const interval = setInterval(fetchServiceStatus, 30000) // 每30秒刷新一次
    return () => clearInterval(interval)
  }, [])

  // 模型操作处理
  const handleModelOperation = async (action: string, modelName: string, tag = "latest") => {
    const modelKey = `${modelName}:${tag}`
    setOperatingModel(modelKey)

    try {
      // 模拟接口延迟，实际应替换为真实接口请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "操作成功",
        description: `${action === "download" ? "下载" : action === "start" ? "启动" : "停止"}模型成功`,
      })

      if (action === "download") {
        simulateDownloadProgress(modelKey)
      }

      // 刷新服务状态
      await fetchServiceStatus()
    } catch (error) {
      toast({
        title: "操作失败",
        description: "网络连接错误",
        variant: "destructive",
      })
    } finally {
      setOperatingModel("")
    }
  }

  // 模拟下载进度
  const simulateDownloadProgress = (modelKey: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => {
          setDownloadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[modelKey]
            return newProgress
          })
        }, 1000)
      }
      setDownloadProgress((prev) => ({
        ...prev,
        [modelKey]: progress,
      }))
    }, 500)
  }

  // 测试模型
  const testModel = async () => {
    if (!selectedModel || !testPrompt.trim()) {
      toast({
        title: "测试失败",
        description: "请选择模型并输入测试提示词",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    const [modelName, tag] = selectedModel.split(":")
    setIsTesting(true)
    setTestResult("正在生成回复...")

    try {
      // 模拟接口延迟，实际应替换为真实接口请求
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 根据模型名称模拟不同回复
      let modelSpecificReply = ""
      if (modelName.includes("deepseek")) {
        modelSpecificReply =
          "我是DeepSeek-R1模型，专注于数学推理和代码生成。我可以帮你解决复杂的数学问题，生成高质量的代码，以及进行各种逻辑分析任务。有什么我可以帮助你的吗？"
      } else if (modelName.includes("gemma")) {
        modelSpecificReply =
          "你好！我是Gemma2模型，一个轻量级的AI助手。我可以进行流畅的对话，生成文本内容，进行翻译和摘要等任务。请问有什么我可以为你做的？"
      } else if (modelName.includes("qwen")) {
        modelSpecificReply =
          "你好！我是通义千问2.5模型，专门优化了中文理解和生成能力。我可以处理多种任务，包括中文对话、多语言交互、代码生成和数学推理。请问需要什么帮助？"
      } else {
        modelSpecificReply =
          "你好！我是一个AI助手，可以帮助你回答问题、进行对话、协助编程、文本处理等多种任务。我会尽力为你提供准确、有用的信息和建议。有什么我可以帮助你的吗？"
      }

      setTestResult(`模型 ${selectedModel} 的回复：\n\n${modelSpecificReply}`)
    } catch (error) {
      setTestResult("测试失败: 网络连接错误")
    } finally {
      setIsTesting(false)
    }
  }

  // 数据过滤与辅助函数
  const getFilteredModels = () => {
    if (!serviceStatus) return []

    let filtered = serviceStatus.models

    if (selectedSeries !== "all") {
      filtered = filtered.filter((m) => m.series === selectedSeries)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.capabilities.some((cap) => cap.toLowerCase().includes(query)),
      )
    }

    return filtered
  }

  const getModelsBySeries = () => {
    const filtered = getFilteredModels()
    const grouped: Record<string, OllamaModel[]> = {}

    filtered.forEach((model) => {
      if (!grouped[model.series]) {
        grouped[model.series] = []
      }
      grouped[model.series].push(model)
    })

    return grouped
  }

  const getStatusIcon = (model: OllamaModel) => {
    if (operatingModel === `${model.name}:${model.tag}`) {
      return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
    }
    if (model.running) {
      return <CheckCircle className="w-4 h-4 text-green-400" />
    }
    if (model.downloaded) {
      return <Square className="w-4 h-4 text-blue-400" />
    }
    return <XCircle className="w-4 h-4 text-gray-400" />
  }

  const getStatusText = (model: OllamaModel) => {
    if (operatingModel === `${model.name}:${model.tag}`) {
      return "操作中..."
    }
    if (model.running) {
      return "运行中"
    }
    if (model.downloaded) {
      return "已下载"
    }
    return "未下载"
  }

  const getSeriesStats = () => {
    if (!serviceStatus) return []

    const series = Array.from(new Set(serviceStatus.models.map((m) => m.series)))
    return series.map((s) => {
      const models = serviceStatus.models.filter((m) => m.series === s)
      return {
        name: s,
        total: models.length,
        downloaded: models.filter((m) => m.downloaded).length,
        running: models.filter((m) => m.running).length,
      }
    })
  }

  const handleSeriesSelect = (series: string) => {
    setSelectedSeries(series)
    setSeriesDropdownOpen(false)
  }

  const handleModelSelect = (modelKey: string) => {
    setSelectedModel(modelKey)
    setModelDropdownOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">正在连接本地模型服务...</span>
        </div>
      </div>
    )
  }

  if (!serviceStatus) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              服务连接失败
            </CardTitle>
            <CardDescription>无法连接到本地 Ollama 服务，请确保服务正在运行。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchServiceStatus} className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              重新连接
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 服务状态卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="w-5 h-5 mr-2 text-green-500" />
            本地模型服务状态
            <Badge variant={serviceStatus.isOnline ? "default" : "destructive"} className="ml-2">
              {serviceStatus.isOnline ? "在线" : "离线"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Ollama 版本 {serviceStatus.version} | 最后更新: {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">运行中模型</p>
                <p className="text-2xl font-bold">{serviceStatus.runningModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Download className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已下载模型</p>
                <p className="text-2xl font-bold">{serviceStatus.downloadedModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">可用模型</p>
                <p className="text-2xl font-bold">{serviceStatus.totalModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MemoryStick className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">内存使用</p>
                <p className="text-2xl font-bold">{serviceStatus.systemInfo.memory.used}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要功能标签页 */}
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">模型管理</TabsTrigger>
          <TabsTrigger value="test">模型测试</TabsTrigger>
          <TabsTrigger value="system">系统信息</TabsTrigger>
          <TabsTrigger value="config">API配置</TabsTrigger>
        </TabsList>

        {/* 模型管理标签页 */}
        <TabsContent value="models" className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索模型名称、描述或功能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="relative" ref={seriesDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setSeriesDropdownOpen(!seriesDropdownOpen)}
                className="w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedSeries === "all" ? "所有系列" : selectedSeries}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {seriesDropdownOpen && (
                <div className="absolute top-full mt-1 w-full sm:w-48 bg-white border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSeriesSelect("all")}
                    >
                      所有系列
                    </button>
                    {getSeriesStats().map((series) => (
                      <button
                        key={series.name}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between"
                        onClick={() => handleSeriesSelect(series.name)}
                      >
                        <span>{series.name}</span>
                        <span className="text-sm text-gray-500">
                          {series.downloaded}/{series.total}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 模型列表 */}
          <div className="space-y-4">
            {Object.entries(getModelsBySeries()).map(([series, models]) => (
              <Card key={series}>
                <Collapsible
                  open={expandedSeries.has(series)}
                  onOpenChange={(open) => {
                    const newExpanded = new Set(expandedSeries)
                    if (open) {
                      newExpanded.add(series)
                    } else {
                      newExpanded.delete(series)
                    }
                    setExpandedSeries(newExpanded)
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          {expandedSeries.has(series) ? (
                            <ChevronDown className="w-5 h-5 mr-2" />
                          ) : (
                            <ChevronRight className="w-5 h-5 mr-2" />
                          )}
                          {series} 系列
                          <Badge variant="secondary" className="ml-2">
                            {models.length} 个模型
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{models.filter((m) => m.downloaded).length} 已下载</Badge>
                          <Badge variant="outline">{models.filter((m) => m.running).length} 运行中</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {models.map((model) => {
                          const modelKey = `${model.name}:${model.tag}`
                          const progress = downloadProgress[modelKey]

                          return (
                            <div key={modelKey} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h4 className="font-semibold text-lg">{model.name}</h4>
                                    <Badge variant="outline" className="ml-2">
                                      {model.tag}
                                    </Badge>
                                    <div className="flex items-center ml-3">
                                      {getStatusIcon(model)}
                                      <span className="ml-1 text-sm">{getStatusText(model)}</span>
                                    </div>
                                  </div>

                                  <p className="text-gray-600 mb-3">{model.description}</p>

                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {model.capabilities.map((cap) => (
                                      <Badge key={cap} variant="secondary" className="text-xs">
                                        {cap}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div>
                                      <span className="font-medium">大小:</span> {model.size}
                                    </div>
                                    <div>
                                      <span className="font-medium">上下文:</span>{" "}
                                      {model.contextLength.toLocaleString()}
                                    </div>
                                    <div>
                                      <span className="font-medium">最小内存:</span> {model.systemRequirements.minRam}
                                    </div>
                                    <div>
                                      <span className="font-medium">推荐内存:</span>{" "}
                                      {model.systemRequirements.recommendedRam}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                  {!model.downloaded ? (
                                    <Button
                                      size="sm"
                                      onClick={() => handleModelOperation("download", model.name, model.tag)}
                                      disabled={operatingModel === modelKey}
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      下载
                                    </Button>
                                  ) : (
                                    <>
                                      {!model.running ? (
                                        <Button
                                          size="sm"
                                          onClick={() => handleModelOperation("start", model.name, model.tag)}
                                          disabled={operatingModel === modelKey}
                                        >
                                          <Play className="w-4 h-4 mr-1" />
                                          启动
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleModelOperation("stop", model.name, model.tag)}
                                          disabled={operatingModel === modelKey}
                                        >
                                          <Square className="w-4 h-4 mr-1" />
                                          停止
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleModelOperation("delete", model.name, model.tag)}
                                        disabled={operatingModel === modelKey}
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        删除
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {progress !== undefined && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>下载进度</span>
                                    <span>{Math.round(progress)}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 模型测试标签页 */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                模型测试
              </CardTitle>
              <CardDescription>选择一个已下载的模型进行测试对话</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-select">选择模型</Label>
                <div className="relative" ref={modelDropdownRef}>
                  <Button
                    variant="outline"
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    className="w-full justify-between"
                  >
                    {selectedModel || "请选择模型"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {modelDropdownOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      <div className="py-1">
                        {serviceStatus.models
                          .filter((m) => m.downloaded)
                          .map((model) => {
                            const modelKey = `${model.name}:${model.tag}`
                            return (
                              <button
                                key={modelKey}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between"
                                onClick={() => handleModelSelect(modelKey)}
                              >
                                <span>{modelKey}</span>
                                {model.running && (
                                  <Badge variant="default" className="text-xs">
                                    运行中
                                  </Badge>
                                )}
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-prompt">测试提示词</Label>
                <Textarea
                  id="test-prompt"
                  placeholder="输入你想测试的提示词..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={testModel} disabled={isTesting || !selectedModel} className="w-full">
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    开始测试
                  </>
                )}
              </Button>

              {testResult && (
                <div className="space-y-2">
                  <Label>测试结果</Label>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统信息标签页 */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  处理器信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{serviceStatus.systemInfo.cpu}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MemoryStick className="w-5 h-5 mr-2" />
                  内存信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>总内存:</span>
                  <span>{serviceStatus.systemInfo.memory.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>已使用:</span>
                  <span>{serviceStatus.systemInfo.memory.used}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>可用:</span>
                  <span>{serviceStatus.systemInfo.memory.available}</span>
                </div>
              </CardContent>
            </Card>

            {serviceStatus.systemInfo.gpu && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    显卡信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>型号:</span>
                    <span>{serviceStatus.systemInfo.gpu.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>显存:</span>
                    <span>{serviceStatus.systemInfo.gpu.memory}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="w-5 h-5 mr-2" />
                  存储信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>总容量:</span>
                  <span>{serviceStatus.systemInfo.storage.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>已使用:</span>
                  <span>{serviceStatus.systemInfo.storage.used}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>可用:</span>
                  <span>{serviceStatus.systemInfo.storage.available}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API配置标签页 */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                API 配置
              </CardTitle>
              <CardDescription>配置本地模型服务的 API 参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-host">服务地址</Label>
                <Input id="api-host" placeholder="http://localhost:11434" defaultValue="http://localhost:11434" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-timeout">请求超时 (秒)</Label>
                <Input id="api-timeout" type="number" placeholder="30" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">最大令牌数</Label>
                <Input id="max-tokens" type="number" placeholder="2048" defaultValue="2048" />
              </div>

              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                保存配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
