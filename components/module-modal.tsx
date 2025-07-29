"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Maximize2,
  Minimize2,
  Move,
  Settings,
  HelpCircle,
  Upload,
  Play,
  Zap,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Module {
  id: string
  title: string
  icon: LucideIcon
  color: string
  features: string[]
  description: string
  url: string
  disabled?: boolean
}

interface ModuleModalProps {
  moduleId: string | null
  isOpen: boolean
  onClose: () => void
  modules: Module[]
}

export function ModuleModal({ moduleId, isOpen, onClose, modules }: ModuleModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const module = modules.find((m) => m.id === moduleId)

  // 监听窗口大小变化
  useEffect(() => {
    const updateWindowSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowSize({ width, height })
      setIsMobile(width < 768)

      // 如果窗口变小，自动调整位置避免超出边界
      if (!isFullscreen) {
        setPosition((prev) => ({
          x: Math.max(-width * 0.4, Math.min(width * 0.4, prev.x)),
          y: Math.max(-height * 0.3, Math.min(height * 0.3, prev.y)),
        }))
      }
    }

    updateWindowSize()
    window.addEventListener("resize", updateWindowSize)
    return () => window.removeEventListener("resize", updateWindowSize)
  }, [isFullscreen])

  // 重置位置当模块改变时
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 })
      setIsFullscreen(false)
    }
  }, [moduleId, isOpen])

  // 计算自适应尺寸
  const getModalSize = () => {
    if (isFullscreen) {
      return {
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        borderRadius: "0",
      }
    }

    if (isMobile) {
      return {
        width: "95vw",
        height: "90vh",
        maxWidth: "95vw",
        maxHeight: "90vh",
        borderRadius: "1rem",
      }
    }

    // 桌面端自适应
    const padding = 64 // 总边距
    const maxWidth = Math.min(1200, windowSize.width - padding)
    const maxHeight = Math.min(800, windowSize.height - padding)

    return {
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
      maxWidth: `${maxWidth}px`,
      maxHeight: `${maxHeight}px`,
      borderRadius: "1.5rem",
    }
  }

  // 拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen || isMobile) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isFullscreen || isMobile) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // 智能边界检测
    const modal = modalRef.current
    if (modal) {
      const rect = modal.getBoundingClientRect()
      const safeZone = 100 // 保持可见的安全区域

      const maxX = windowSize.width - safeZone
      const maxY = windowSize.height - 60 // 保持标题栏可见
      const minX = -rect.width + safeZone
      const minY = -rect.height + 60

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ""
    }
  }, [isDragging, dragStart, windowSize])

  // 双击全屏切换
  const handleDoubleClick = () => {
    if (!isMobile) {
      setIsFullscreen(!isFullscreen)
    }
  }

  // 全屏切换
  const toggleFullscreen = () => {
    if (!isMobile) {
      setIsFullscreen(!isFullscreen)
    }
  }

  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
    }

    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, isFullscreen, onClose])

  if (!module) return null

  const IconComponent = module.icon
  const modalSize = getModalSize()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: isFullscreen || isMobile ? 0 : position.x,
              y: isFullscreen || isMobile ? 0 : position.y,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-purple-900/25 backdrop-blur-xl border border-purple-500/25 shadow-2xl overflow-hidden flex flex-col"
            style={{
              width: modalSize.width,
              height: modalSize.height,
              maxWidth: modalSize.maxWidth,
              maxHeight: modalSize.maxHeight,
              borderRadius: modalSize.borderRadius,
              cursor: isDragging ? "grabbing" : "default",
            }}
          >
            {/* 标题栏 - 调整背景色 */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b border-purple-400/25 bg-purple-800/30 flex-shrink-0",
                !isFullscreen && !isMobile && "cursor-grab active:cursor-grabbing select-none",
              )}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={cn("p-2 rounded-lg bg-gradient-to-r shadow-lg flex-shrink-0", module.color)}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-white font-semibold text-lg truncate">{module.title}</h2>
                  <p className="text-white/70 text-sm truncate">{module.description}</p>
                </div>
                <div className="hidden sm:flex gap-2 flex-shrink-0">
                  {module.features.slice(0, isMobile ? 2 : 3).map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="bg-purple-600/30 border-purple-400/30 text-white/80 text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!isFullscreen && !isMobile && (
                  <div className="hidden lg:flex items-center gap-1 text-white/50 text-xs mr-4">
                    <Move className="w-3 h-3" />
                    <span>拖拽移动</span>
                  </div>
                )}

                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white/60 hover:text-white hover:bg-purple-500/20"
                    title={isFullscreen ? "退出全屏" : "全屏显示"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/60 hover:text-white hover:bg-purple-500/20"
                  title="关闭 (ESC)"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="workspace" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-purple-800/30 border-b border-purple-400/20 rounded-none flex-shrink-0">
                  <TabsTrigger value="workspace" className="data-[state=active]:bg-purple-600/30">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">工作台</span>
                    <span className="sm:hidden">工作</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600/30">
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">设置</span>
                    <span className="sm:hidden">设置</span>
                  </TabsTrigger>
                  <TabsTrigger value="help" className="data-[state=active]:bg-purple-600/30">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">帮助</span>
                    <span className="sm:hidden">帮助</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                  <TabsContent value="workspace" className="h-full m-0 p-4 sm:p-6">
                    {renderWorkspace(module, isMobile)}
                  </TabsContent>

                  <TabsContent value="settings" className="h-full m-0 p-4 sm:p-6">
                    {renderSettings(module, isMobile)}
                  </TabsContent>

                  <TabsContent value="help" className="h-full m-0 p-4 sm:p-6">
                    {renderHelp(module, isMobile)}
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* 状态栏 - 调整背景色 */}
            <div className="px-4 py-2 bg-purple-800/30 border-t border-purple-400/20 flex items-center justify-between text-xs text-white/60 flex-shrink-0">
              <div className="flex items-center gap-4">
                <span>状态: 就绪</span>
                <span className="hidden sm:inline">版本: v1.0.0</span>
                {!isFullscreen && !isMobile && (
                  <span className="hidden lg:inline">
                    位置: ({Math.round(position.x)}, {Math.round(position.y)})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>在线</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 渲染工作台内容
function renderWorkspace(module: Module, isMobile: boolean) {
  switch (module.id) {
    case "image-creation":
      return (
        <div className={cn("gap-6 h-full", isMobile ? "flex flex-col" : "grid grid-cols-1 lg:grid-cols-2")}>
          <Card className="bg-purple-800/20 border-purple-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                创作输入
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">描述您想要的图像</label>
                <Textarea
                  placeholder="例如：一只可爱的小猫坐在彩虹桥上，背景是星空..."
                  className="bg-purple-700/20 border-purple-400/30 text-white placeholder:text-white/50 min-h-[120px] resize-none"
                />
              </div>
              <div className={cn("gap-4", isMobile ? "space-y-4" : "grid grid-cols-2")}>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">图像尺寸</label>
                  <Select>
                    <SelectTrigger className="bg-purple-700/20 border-purple-400/30 text-white">
                      <SelectValue placeholder="选择尺寸" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">512×512</SelectItem>
                      <SelectItem value="768x768">768×768</SelectItem>
                      <SelectItem value="1024x1024">1024×1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">艺术风格</label>
                  <Select>
                    <SelectTrigger className="bg-purple-700/20 border-purple-400/30 text-white">
                      <SelectValue placeholder="选择风格" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">写实风格</SelectItem>
                      <SelectItem value="anime">动漫风格</SelectItem>
                      <SelectItem value="oil">油画风格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={cn("gap-3", isMobile ? "flex flex-col" : "flex")}>
                <Button className={cn("bg-gradient-to-r text-white", module.color, isMobile ? "w-full" : "flex-1")}>
                  <Play className="w-4 h-4 mr-2" />
                  开始创作
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-400/30 text-white hover:bg-purple-500/20 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/20 border-purple-400/20">
            <CardHeader>
              <CardTitle className="text-white">预览结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-purple-700/10 rounded-lg border-2 border-dashed border-purple-400/30 flex flex-col items-center justify-center mb-4">
                <div className="text-white/50 text-center p-6">
                  <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>生成的图像将显示在这里</p>
                  <p className="text-xs mt-1">完成创作后自动更新预览</p>
                </div>
              </div>
              <div className={cn("gap-2", isMobile ? "flex flex-col" : "flex justify-between")}>
                <Button
                  variant="outline"
                  className="flex-1 border-purple-400/30 text-white hover:bg-purple-500/20 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新生成
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-purple-400/30 text-white hover:bg-purple-500/20 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
                {!isMobile && (
                  <Button
                    variant="outline"
                    className="border-purple-400/30 text-white hover:bg-purple-500/20 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    default:
      return (
        <Card className="bg-purple-800/20 border-purple-400/20 h-full">
          <CardHeader>
            <CardTitle className="text-white">模块工作台</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/60 text-center py-10">请选择具体功能模块以使用工作台</div>
          </CardContent>
        </Card>
      )
  }
}

// 渲染设置内容
function renderSettings(module: Module, isMobile: boolean) {
  return (
    <Card className="bg-purple-800/20 border-purple-400/20 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {module.title} 设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-white/80 text-sm block">API 访问密钥</label>
          <Textarea
            placeholder="输入您的API密钥（留空使用默认配置）"
            className="bg-purple-700/20 border-purple-400/30 text-white placeholder:text-white/50 resize-none"
            defaultValue=""
          />
          <p className="text-white/50 text-xs">配置自定义API密钥可提高处理优先级和访问更多功能</p>
        </div>

        <div className={cn("gap-4", isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2")}>
          <div className="space-y-2">
            <label className="text-white/80 text-sm block">默认图像尺寸</label>
            <Select defaultValue="768x768">
              <SelectTrigger className="bg-purple-700/20 border-purple-400/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="512x512">512×512</SelectItem>
                <SelectItem value="768x768">768×768</SelectItem>
                <SelectItem value="1024x1024">1024×1024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm block">处理超时设置</label>
            <Select defaultValue="60">
              <SelectTrigger className="bg-purple-700/20 border-purple-400/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30秒</SelectItem>
                <SelectItem value="60">60秒</SelectItem>
                <SelectItem value="120">120秒</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-400/20">
          <Button className={cn("w-full bg-gradient-to-r text-white", module.color)}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            保存设置
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// 渲染帮助内容
function renderHelp(module: Module, isMobile: boolean) {
  return (
    <Card className="bg-purple-800/20 border-purple-400/20 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          {module.title} 使用帮助
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-white/80">
        <div>
          <h3 className="text-white font-medium mb-2">功能介绍</h3>
          <p className="text-sm leading-relaxed">
            {module.description}。通过简单的文字描述，您可以快速生成符合预期的图像内容，支持多种风格和尺寸定制。
          </p>
        </div>

        <div>
          <h3 className="text-white font-medium mb-2">使用步骤</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>在"创作输入"区域填写详细的图像描述（越具体效果越好）</li>
            <li>选择合适的图像尺寸和艺术风格</li>
            <li>点击"开始创作"按钮等待生成结果</li>
            <li>可对生成结果进行重新生成或下载操作</li>
          </ol>
        </div>

        <div>
          <h3 className="text-white font-medium mb-2">常见问题</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white font-medium">生成图像需要多长时间？</p>
              <p>通常需要5-30秒，取决于图像复杂度和当前服务器负载</p>
            </div>
            <div>
              <p className="text-white font-medium">如何获得更好的生成效果？</p>
              <p>尽量详细描述主体、背景、风格、光线等要素，避免模糊表述</p>
            </div>
            <div>
              <p className="text-white font-medium">生成的图像可以商用吗？</p>
              <p>基础模型生成的图像仅供个人学习使用，商用需升级专业版并获得授权</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-400/20">
          <Button
            variant="outline"
            className="w-full border-purple-400/30 text-white hover:bg-purple-500/20 bg-transparent"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            查看完整文档
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
