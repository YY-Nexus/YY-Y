"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Play,
  Copy,
  Download,
  Bug,
  Zap,
  ArrowLeft,
  Settings,
  FileCode,
  Terminal,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function CodeAssistantPage() {
  const [code, setCode] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [prompt, setPrompt] = useState("")

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)

    // 模拟分析过程
    setTimeout(() => {
      setAnalysisResult({
        issues: [
          { type: "warning", message: "变量名建议使用驼峰命名法", line: 5 },
          { type: "error", message: "缺少分号", line: 12 },
          { type: "info", message: "可以使用const替代let", line: 8 },
        ],
        suggestions: ["添加错误处理机制", "优化循环性能", "增加代码注释", "使用更语义化的变量名"],
        complexity: 6,
        maintainability: 8,
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // 模拟代码生成
    const generatedCode = `// AI生成的代码 - ${prompt}
function ${prompt.replace(/\s+/g, "")}() {
  // 这里是AI生成的代码实现
  console.log('Hello, World!');
  return true;
}

// 使用示例
${prompt.replace(/\s+/g, "")}();`

    setCode(generatedCode)
  }

  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP"]

  const codeTemplates = [
    "React组件",
    "API接口",
    "数据库查询",
    "算法实现",
    "工具函数",
    "测试用例",
    "配置文件",
    "文档生成",
  ]

  const quickPrompts = [
    "创建一个登录表单组件",
    "实现二分查找算法",
    "编写API请求函数",
    "生成随机密码函数",
    "数组去重方法",
    "日期格式化工具",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-orange-900 p-4">
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
          <Code className="w-10 h-10 text-orange-400" />
          YYC³ CodeX
        </h1>
        <p className="text-white/80 text-lg">代码如诗逻辑清，智能编程效率高，程序世界任遨游</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧工具面板 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                代码工具
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 代码生成 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">代码生成</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述您需要的代码功能..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                />
                <Button
                  onClick={handleGenerate}
                  className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  生成代码
                </Button>
              </div>

              {/* 快速模板 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">快速模板</label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt) => (
                    <Badge
                      key={quickPrompt}
                      className="bg-orange-500/20 text-orange-200 border-orange-400/30 cursor-pointer hover:bg-orange-500/30 text-xs"
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      {quickPrompt}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 编程语言 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">编程语言</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 代码模板 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">代码模板</label>
                <div className="grid grid-cols-1 gap-2">
                  {codeTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <FileCode className="w-3 h-3 mr-2" />
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 中间代码编辑器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                代码编辑器
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 代码输入区 */}
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="在这里输入或粘贴您的代码..."
                  className="bg-black/50 border-white/20 text-green-400 font-mono text-sm min-h-[400px] placeholder:text-white/30"
                />

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !code.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <Bug className="w-4 h-4 mr-2 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Bug className="w-4 h-4 mr-2" />
                        代码分析
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <Play className="w-4 h-4 mr-2" />
                    运行代码
                  </Button>
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <Copy className="w-4 h-4 mr-2" />
                    复制代码
                  </Button>
                  <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    下载文件
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧分析结果 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                分析结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <Tabs defaultValue="issues" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="issues" className="text-white data-[state=active]:bg-white/20">
                      问题
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="text-white data-[state=active]:bg-white/20">
                      建议
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="issues" className="mt-4">
                    <div className="space-y-2">
                      {analysisResult.issues.map((issue: any, index: number) => (
                        <div
                          key={index}
                          className={`p-2 rounded border ${
                            issue.type === "error"
                              ? "bg-red-500/20 border-red-400/30"
                              : issue.type === "warning"
                                ? "bg-yellow-500/20 border-yellow-400/30"
                                : "bg-blue-500/20 border-blue-400/30"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle
                              className={`w-4 h-4 mt-0.5 ${
                                issue.type === "error"
                                  ? "text-red-400"
                                  : issue.type === "warning"
                                    ? "text-yellow-400"
                                    : "text-blue-400"
                              }`}
                            />
                            <div>
                              <p className="text-white/90 text-sm">{issue.message}</p>
                              <p className="text-white/60 text-xs">第 {issue.line} 行</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions" className="mt-4">
                    <div className="space-y-2">
                      {analysisResult.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="p-2 rounded bg-green-500/20 border-green-400/30">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                            <p className="text-white/90 text-sm">{suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Bug className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">等待代码分析</p>
                  <p className="text-white/40">输入代码后点击"代码分析"按钮</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
