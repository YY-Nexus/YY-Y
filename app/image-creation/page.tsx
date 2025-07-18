"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Wand2, Upload, Download, Palette, Scissors, Sparkles, ArrowLeft, Settings, Zap } from "lucide-react"
import Link from "next/link"

export default function ImageCreationPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProgress(0)

    // 模拟生成过程
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          // 模拟生成的图片
          setGeneratedImages([
            "/ai-generated-abstract.png",
            "/ai-generated-image-2.png",
            "/ai-generated-image-3.png",
            "/ai-generated-image-4.png",
          ])
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const presetStyles = ["写实风格", "动漫风格", "油画风格", "水彩风格", "素描风格", "科幻风格", "古典风格", "现代艺术"]

  const quickPrompts = [
    "美丽的山水风景画",
    "可爱的小猫咪",
    "未来科技城市",
    "梦幻森林场景",
    "抽象艺术作品",
    "人物肖像画",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-cyan-900 p-4">
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
          <Palette className="w-10 h-10 text-blue-400" />
          言创图文
        </h1>
        <p className="text-white/80 text-lg">笔墨丹青绘世界，AI妙手著华章，创意无限展风采</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧控制面板 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                创作控制台
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 提示词输入 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">描述您想要的图像</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只可爱的小猫坐在花园里，阳光明媚，高清摄影风格..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                />
              </div>

              {/* 快速提示词 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">快速提示词</label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt) => (
                    <Badge
                      key={quickPrompt}
                      className="bg-blue-500/20 text-blue-200 border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      {quickPrompt}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 风格选择 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">艺术风格</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetStyles.map((style) => (
                    <Button
                      key={style}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setPrompt((prev) => prev + ` ${style}`)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    开始创作
                  </>
                )}
              </Button>

              {/* 进度条 */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>生成进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="bg-white/10" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧结果展示 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                生成结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-white/20">
                    图片画廊
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="text-white data-[state=active]:bg-white/20">
                    图片编辑
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/20">
                    历史记录
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="mt-6">
                  {generatedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative group"
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`生成图像 ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg border border-white/20"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button size="sm" className="bg-white/20 hover:bg-white/30">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-white/20 hover:bg-white/30">
                              <Scissors className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-white/20 hover:bg-white/30">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 text-lg mb-2">还没有生成图像</p>
                      <p className="text-white/40">输入描述词开始创作您的第一张AI图像</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="editor" className="mt-6">
                  <div className="text-center py-12">
                    <Scissors className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg mb-2">图片编辑器</p>
                    <p className="text-white/40">选择一张图片开始编辑</p>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg mb-2">历史记录</p>
                    <p className="text-white/40">您的创作历史将显示在这里</p>
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
