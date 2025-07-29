"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Wand2, Upload, Download, Palette, Sparkles, Zap, Eye } from "lucide-react"

export function ImageCreationModule() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [imageSize, setImageSize] = useState("1024x1024")
  const [steps, setSteps] = useState([30])
  const [guidance, setGuidance] = useState([7.5])

  const styles = [
    { id: "realistic", name: "写实风格", preview: "🎨" },
    { id: "anime", name: "动漫风格", preview: "🎭" },
    { id: "oil-painting", name: "油画风格", preview: "🖼️" },
    { id: "watercolor", name: "水彩风格", preview: "🎨" },
    { id: "digital-art", name: "数字艺术", preview: "💻" },
    { id: "sketch", name: "素描风格", preview: "✏️" },
  ]

  const sizes = [
    { value: "512x512", label: "512×512 (正方形)" },
    { value: "768x768", label: "768×768 (正方形)" },
    { value: "1024x1024", label: "1024×1024 (正方形)" },
    { value: "1024x768", label: "1024×768 (横向)" },
    { value: "768x1024", label: "768×1024 (纵向)" },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // 模拟AI图像生成过程
    setTimeout(() => {
      const newImages = [
        `/placeholder.svg?height=400&width=400&text=生成图像1`,
        `/placeholder.svg?height=400&width=400&text=生成图像2`,
        `/placeholder.svg?height=400&width=400&text=生成图像3`,
        `/placeholder.svg?height=400&width=400&text=生成图像4`,
      ]
      setGeneratedImages(newImages)
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="h-full flex gap-6">
      {/* 左侧控制面板 */}
      <div className="w-80 space-y-4 overflow-y-auto">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              创作控制台
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 提示词输入 */}
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">描述您想要的图像</label>
              <Textarea
                placeholder="例如：一只可爱的小猫坐在彩虹桥上，背景是星空，梦幻风格..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
              />
            </div>

            {/* 风格选择 */}
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">艺术风格</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedStyle === style.id ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`justify-start ${
                      selectedStyle === style.id
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-100"
                        : "border-white/20 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-2">{style.preview}</span>
                    {style.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 图像尺寸 */}
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">图像尺寸</label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  {sizes.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-white">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 高级设置 */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">生成步数: {steps[0]}</label>
                <Slider value={steps} onValueChange={setSteps} max={50} min={10} step={5} className="w-full" />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">引导强度: {guidance[0]}</label>
                <Slider value={guidance} onValueChange={setGuidance} max={20} min={1} step={0.5} className="w-full" />
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  AI创作中...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  开始创作
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 快速模板 */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-sm">快速模板</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["科幻城市夜景", "梦幻森林仙境", "抽象艺术作品", "可爱动物肖像", "未来机器人"].map((template) => (
                <Button
                  key={template}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrompt(template)}
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  {template}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右侧结果展示区 */}
      <div className="flex-1 space-y-4">
        <Card className="bg-white/5 border-white/10 h-full">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                创作结果
              </div>
              {generatedImages.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    批量下载
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    上传到云端
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {isGenerating ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"
                  />
                  <p className="text-white/80 text-lg">AI正在为您创作...</p>
                  <p className="text-white/60 text-sm mt-2">预计需要 30-60 秒</p>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 h-full">
                {generatedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`生成图像 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4 mr-2" />
                        预览
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-white/60">
                <div className="text-center">
                  <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">准备开始您的创作之旅</p>
                  <p className="text-sm mt-2">输入描述，让AI为您创造独特的艺术作品</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
