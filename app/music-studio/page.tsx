"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Music,
  Play,
  Pause,
  Volume2,
  Download,
  Mic,
  Piano,
  Guitar,
  Drum,
  ArrowLeft,
  Settings,
  Sparkles,
  Zap,
  Headphones,
} from "lucide-react"
import Link from "next/link"

export default function MusicStudioPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")

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
          setCurrentTrack("AI生成音乐 - " + prompt)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const musicStyles = ["流行音乐", "古典音乐", "爵士乐", "摇滚乐", "电子音乐", "民谣", "说唱", "蓝调"]

  const instruments = [
    { name: "钢琴", icon: Piano, color: "from-blue-500 to-cyan-500" },
    { name: "吉他", icon: Guitar, color: "from-green-500 to-teal-500" },
    { name: "鼓", icon: Drum, color: "from-red-500 to-orange-500" },
    { name: "小提琴", icon: Music, color: "from-purple-500 to-pink-500" },
  ]

  const quickPrompts = [
    "轻松愉快的背景音乐",
    "深情的钢琴独奏",
    "激昂的摇滚乐",
    "宁静的自然音效",
    "节奏感强的电子乐",
    "温馨的民谣小调",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-green-900 p-4">
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
          <Music className="w-10 h-10 text-green-400" />
          YYC³ Music
        </h1>
        <p className="text-white/80 text-lg">天籁之音自心生，智能谱曲动人心，音律和谐传千里</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧创作面板 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                音乐创作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 音乐描述 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">描述您想要的音乐</label>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：轻松愉快的钢琴曲，适合下午茶时光..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* 快速提示 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">快速创作</label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt) => (
                    <Badge
                      key={quickPrompt}
                      className="bg-green-500/20 text-green-200 border-green-400/30 cursor-pointer hover:bg-green-500/30"
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      {quickPrompt}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 音乐风格 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">音乐风格</label>
                <div className="grid grid-cols-2 gap-2">
                  {musicStyles.map((style) => (
                    <Button
                      key={style}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setPrompt((prev) => prev + ` ${style}风格`)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 乐器选择 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">主要乐器</label>
                <div className="grid grid-cols-2 gap-2">
                  {instruments.map((instrument) => (
                    <Button
                      key={instrument.name}
                      variant="outline"
                      size="sm"
                      className={`bg-gradient-to-r ${instrument.color} bg-opacity-20 border-white/20 text-white hover:bg-opacity-30`}
                      onClick={() => setPrompt((prev) => prev + ` ${instrument.name}`)}
                    >
                      <instrument.icon className="w-3 h-3 mr-1" />
                      {instrument.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium py-3"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    创作中...
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
                    <span>创作进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="bg-white/10" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 中间播放器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                音乐播放器
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrack ? (
                <div className="space-y-6">
                  {/* 专辑封面 */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 to-teal-600 rounded-lg flex items-center justify-center">
                      <Music className="w-16 h-16 text-white/80" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-white/20 hover:bg-white/30 rounded-full w-16 h-16"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 歌曲信息 */}
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-1">{currentTrack}</h3>
                    <p className="text-white/60 text-sm">AI创作音乐</p>
                  </div>

                  {/* 进度条 */}
                  <div className="space-y-2">
                    <Slider defaultValue={[30]} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>01:23</span>
                      <span>03:45</span>
                    </div>
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex items-center justify-center gap-4">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">还没有创作音乐</p>
                  <p className="text-white/40">输入描述开始创作您的第一首AI音乐</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧音效库 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mic className="w-5 h-5" />
                音效库
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="effects" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="effects" className="text-white data-[state=active]:bg-white/20">
                    音效
                  </TabsTrigger>
                  <TabsTrigger value="loops" className="text-white data-[state=active]:bg-white/20">
                    循环
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="effects" className="mt-4">
                  <div className="space-y-2">
                    {["雨声", "海浪声", "鸟鸣", "风声", "钟声", "脚步声", "掌声", "笑声"].map((effect) => (
                      <Button
                        key={effect}
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                      >
                        <Play className="w-3 h-3 mr-2" />
                        {effect}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="loops" className="mt-4">
                  <div className="space-y-2">
                    {[
                      "鼓点循环",
                      "贝斯循环",
                      "和弦循环",
                      "旋律循环",
                      "节拍循环",
                      "氛围循环",
                      "打击乐循环",
                      "合成器循环",
                    ].map((loop) => (
                      <Button
                        key={loop}
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                      >
                        <Play className="w-3 h-3 mr-2" />
                        {loop}
                      </Button>
                    ))}
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
