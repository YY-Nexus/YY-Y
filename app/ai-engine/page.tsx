"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Zap,
  Play,
  RotateCcw,
  ArrowLeft,
  Activity,
  Database,
  Cpu,
  Network,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AIEnginePage() {
  const [selectedModel, setSelectedModel] = useState("zhipu-ai")
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState("")
  const [modelStatus, setModelStatus] = useState<Record<string, string>>({
    "zhipu-ai": "online",
    ollama: "online",
    deepseek: "maintenance",
    custom: "offline",
  })

  const aiModels = [
    {
      id: "zhipu-ai",
      name: "智谱AI",
      description: "GLM-4系列大语言模型，支持中文对话",
      version: "GLM-4-Plus",
      capabilities: ["文本生成", "代码编写", "数学推理", "多轮对话"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "本地部署的开源大语言模型",
      version: "Llama-3.1-8B",
      capabilities: ["本地推理", "隐私保护", "自定义微调", "离线使用"],
      color: "from-green-500 to-teal-500",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "深度求索AI模型，专注代码生成",
      version: "DeepSeek-Coder-V2",
      capabilities: ["代码生成", "代码解释", "算法优化", "技术问答"],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "custom",
      name: "自定义模型",
      description: "用户自定义训练的专用模型",
      version: "Custom-1.0",
      capabilities: ["专业领域", "个性化", "私有部署", "定制化"],
      color: "from-orange-500 to-red-500",
    },
  ]

  const handleTest = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    setResponse("")

    // 模拟AI响应
    const responses = {
      "zhipu-ai": "您好！我是智谱AI，很高兴为您服务。我可以帮助您进行文本生成、代码编写、数学推理等任务。",
      ollama:
        "Hello! I'm running locally on Ollama. I can help you with various tasks while keeping your data private.",
      deepseek: "我是DeepSeek代码助手，专门帮助您解决编程相关的问题，包括代码生成、优化和解释���",
      custom: "这是您的自定义模型响应，已根据您的特定需求进行了优化训练。",
    }

    // 模拟打字效果
    const fullResponse = responses[selectedModel as keyof typeof responses] || "模型响应中..."
    let currentText = ""

    for (let i = 0; i < fullResponse.length; i++) {
      currentText += fullResponse[i]
      setResponse(currentText)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    setIsProcessing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "maintenance":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />
      case "offline":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 p-4">
      {/* 返回按钮 */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主页
          </Button>
        </Link>
      </motion.div>

      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Brain className="w-10 h-10 text-indigo-400" />
          智能引擎
        </h1>
        <p className="text-white/80 text-lg">群贤毕至聚一堂，大模型海纳百川，智慧之光照前程</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧模型选择 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                模型管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiModels.map((model) => (
                <motion.div key={model.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? "bg-white/20 border-white/40"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{model.name}</h3>
                        <div className={`flex items-center gap-1 ${getStatusColor(modelStatus[model.id])}`}>
                          {getStatusIcon(modelStatus[model.id])}
                          <span className="text-xs capitalize">{modelStatus[model.id]}</span>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mb-2">{model.description}</p>
                      <Badge className={`bg-gradient-to-r ${model.color} bg-opacity-20 text-white border-0 text-xs`}>
                        {model.version}
                      </Badge>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {model.capabilities.slice(0, 2).map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs text-white/70 border-white/30">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* 中间测试区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                模型测试
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 输入区域 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">测试提示词</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入您想要测试的提示词..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                />
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTest}
                  disabled={isProcessing || !prompt.trim() || modelStatus[selectedModel] !== "online"}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      开始测试
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    setPrompt("")
                    setResponse("")
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重置
                </Button>
              </div>

              {/* 响应区域 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">模型响应</label>
                <div className="bg-black/50 border border-white/20 rounded-lg p-4 min-h-[200px]">
                  {response ? (
                    <p className="text-green-400 font-mono text-sm whitespace-pre-wrap">{response}</p>
                  ) : (
                    <p className="text-white/40 text-sm">模型响应将显示在这里...</p>
                  )}
                  {isProcessing && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-white/60 text-sm">AI正在思考中...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧系统监控 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                系统监控
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="performance" className="text-white data-[state=active]:bg-white/20">
                    性能
                  </TabsTrigger>
                  <TabsTrigger value="network" className="text-white data-[state=active]:bg-white/20">
                    网络
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="mt-4">
                  <div className="space-y-4">
                    {/* CPU使用率 */}
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>CPU使用率</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="bg-white/10" />
                    </div>

                    {/* 内存使用率 */}
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>内存使用率</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="bg-white/10" />
                    </div>

                    {/* GPU使用率 */}
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>GPU使用率</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="bg-white/10" />
                    </div>

                    {/* 响应时间 */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/90 text-sm font-medium mb-1">平均响应时间</div>
                      <div className="text-2xl font-bold text-green-400">1.2s</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="network" className="mt-4">
                  <div className="space-y-4">
                    {/* 网络延迟 */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Network className="w-4 h-4 text-blue-400" />
                        <span className="text-white/90 text-sm font-medium">网络延迟</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">23ms</div>
                    </div>

                    {/* 连接状态 */}
                    <div className="space-y-2">
                      {aiModels.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-white/80 text-sm">{model.name}</span>
                          <div className={`flex items-center gap-1 ${getStatusColor(modelStatus[model.id])}`}>
                            {getStatusIcon(modelStatus[model.id])}
                            <span className="text-xs capitalize">{modelStatus[model.id]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
