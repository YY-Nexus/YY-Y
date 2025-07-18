"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Video,
  Upload,
  Download,
  Play,
  Pause,
  Volume2,
  Scissors,
  Sparkles,
  ArrowLeft,
  Settings,
  Mic,
  Type,
  Zap,
  Film,
} from "lucide-react"
import Link from "next/link"

export default function VideoHubPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoUpload = () => {
    // 模拟视频上传
    setUploadedVideo("/video-preview.png")
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)

    // 模拟处理过程
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 1
      })
    }, 50)
  }

  const videoEffects = ["美颜滤镜", "复古风格", "黑白经典", "暖色调", "冷色调", "高对比度", "柔光效果", "锐化增强"]

  const audioEffects = ["降噪处理", "音量增强", "回声效果", "混响效果", "低音增强", "高音清晰", "立体声", "环绕音效"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
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
          <Video className="w-10 h-10 text-purple-400" />
          语枢视频
        </h1>
        <p className="text-white/80 text-lg">光影流转述故事，智能剪辑展才华，视听盛宴惊四座</p>
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
                编辑工具
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 视频上传 */}
              <div>
                <Button
                  onClick={handleVideoUpload}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传视频
                </Button>
              </div>

              {/* 视频效果 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">视频效果</label>
                <div className="grid grid-cols-1 gap-2">
                  {videoEffects.map((effect) => (
                    <Button
                      key={effect}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 音频处理 */}
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">音频处理</label>
                <div className="grid grid-cols-1 gap-2">
                  {audioEffects.map((effect) => (
                    <Button
                      key={effect}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <Volume2 className="w-3 h-3 mr-2" />
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI功能 */}
              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
                  <Mic className="w-4 h-4 mr-2" />
                  AI配音
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  <Type className="w-4 h-4 mr-2" />
                  自动字幕
                </Button>
              </div>

              {/* 处理按钮 */}
              <Button
                onClick={handleProcess}
                disabled={isProcessing || !uploadedVideo}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 mr-2" />
                    开始处理
                  </>
                )}
              </Button>

              {/* 进度条 */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>处理进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="bg-white/10" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 中间预览区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5" />
                视频预览
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedVideo ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <img
                      src={uploadedVideo || "/placeholder.svg"}
                      alt="视频预览"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
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

                  {/* 时间轴控制 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-white/70 text-sm">00:00</span>
                      <Slider defaultValue={[0]} max={100} step={1} className="flex-1" />
                      <span className="text-white/70 text-sm">02:30</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Scissors className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Video className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">还没有上传视频</p>
                  <p className="text-white/40">点击左侧"上传视频"按钮开始编辑</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧时间轴 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Film className="w-5 h-5" />
                时间轴
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="video" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="video" className="text-white data-[state=active]:bg-white/20">
                    视频轨
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="text-white data-[state=active]:bg-white/20">
                    音频轨
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="mt-4">
                  <div className="space-y-2">
                    {uploadedVideo ? (
                      <>
                        <div className="bg-purple-500/20 border border-purple-400/30 rounded p-2">
                          <div className="text-white/80 text-xs mb-1">视频轨道 1</div>
                          <div className="bg-purple-500/40 h-8 rounded flex items-center px-2">
                            <span className="text-white/70 text-xs">主视频</span>
                          </div>
                        </div>
                        <div className="bg-pink-500/20 border border-pink-400/30 rounded p-2">
                          <div className="text-white/80 text-xs mb-1">效果轨道</div>
                          <div className="bg-pink-500/40 h-6 rounded flex items-center px-2">
                            <span className="text-white/70 text-xs">滤镜效果</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/40 text-sm">上传视频后显示时间轴</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="mt-4">
                  <div className="space-y-2">
                    {uploadedVideo ? (
                      <>
                        <div className="bg-green-500/20 border border-green-400/30 rounded p-2">
                          <div className="text-white/80 text-xs mb-1">音频轨道 1</div>
                          <div className="bg-green-500/40 h-8 rounded flex items-center px-2">
                            <span className="text-white/70 text-xs">原始音频</span>
                          </div>
                        </div>
                        <div className="bg-teal-500/20 border border-teal-400/30 rounded p-2">
                          <div className="text-white/80 text-xs mb-1">配音轨道</div>
                          <div className="bg-teal-500/40 h-6 rounded flex items-center px-2">
                            <span className="text-white/70 text-xs">AI配音</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/40 text-sm">上传视频后显示音频轨</p>
                      </div>
                    )}
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
