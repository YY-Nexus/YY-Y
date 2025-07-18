"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Zap, Lock } from "lucide-react"
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

interface SmartModulePanelProps {
  modules: Module[]
  position: "left" | "right"
  isVisible: boolean
  isMobile: boolean
  onModuleClick: (moduleId: string) => void
  fullDisplay?: boolean
  disabled?: boolean
}

export function SmartModulePanel({
  modules,
  position,
  isVisible,
  isMobile,
  onModuleClick,
  fullDisplay = false,
  disabled = false,
}: SmartModulePanelProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  // 计算每个模块卡片的高度（包括间距）
  const CARD_HEIGHT = 180 // 卡片高度
  const CARD_SPACING = 16 // 卡片间距
  const ITEM_HEIGHT = CARD_HEIGHT + CARD_SPACING

  // 计算可见区域高度
  const VISIBLE_HEIGHT = isMobile ? window.innerHeight - 200 : window.innerHeight - 100
  const VISIBLE_ITEMS = Math.floor(VISIBLE_HEIGHT / ITEM_HEIGHT)

  // 自动隐藏逻辑优化
  useEffect(() => {
    if (isVisible && !isHovered && !isMobile) {
      // 3秒后自动隐藏
      const timer = setTimeout(() => {
        if (!isHovered) {
          // 这里需要通知父组件隐藏面板
          // 由于我们没有直接的隐藏回调，我们通过鼠标离开事件来模拟
          const event = new MouseEvent("mouseleave", { bubbles: true })
          document.dispatchEvent(event)
        }
      }, 3000)

      setAutoHideTimer(timer)

      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [isVisible, isHovered, isMobile])

  // 鼠标进入处理
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      setAutoHideTimer(null)
    }
  }

  // 鼠标离开处理
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // 更新滚动状态
  const updateScrollState = (newPosition: number) => {
    const maxScroll = Math.max(0, modules.length - VISIBLE_ITEMS)
    setCanScrollUp(newPosition > 0)
    setCanScrollDown(newPosition < maxScroll)
  }

  // 滚动处理
  const handleScroll = (direction: "up" | "down") => {
    if (isScrolling) return

    setIsScrolling(true)
    const maxScroll = Math.max(0, modules.length - VISIBLE_ITEMS)

    let newPosition = scrollPosition
    if (direction === "up") {
      newPosition = scrollPosition > 0 ? scrollPosition - 1 : maxScroll // 循环到底部
    } else {
      newPosition = scrollPosition < maxScroll ? scrollPosition + 1 : 0 // 循环到顶部
    }

    setScrollPosition(newPosition)
    updateScrollState(newPosition)

    // 防止快速连续滚动
    setTimeout(() => setIsScrolling(false), 300)
  }

  // 鼠标滚轮处理
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (isScrolling) return

    if (e.deltaY > 0) {
      handleScroll("down")
    } else {
      handleScroll("up")
    }
  }

  // 初始化滚动状态
  useEffect(() => {
    updateScrollState(scrollPosition)
  }, [modules.length, VISIBLE_ITEMS])

  // 获取当前可见的模块
  const getVisibleModules = () => {
    const visibleModules = []
    for (let i = 0; i < VISIBLE_ITEMS && i < modules.length; i++) {
      const moduleIndex = (scrollPosition + i) % modules.length
      visibleModules.push({
        ...modules[moduleIndex],
        displayIndex: i,
      })
    }
    return visibleModules
  }

  const visibleModules = getVisibleModules()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position === "left" ? -100 : 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: position === "left" ? -100 : 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-0 bottom-0 z-40 flex flex-col",
            position === "left" ? "left-16" : "right-16",
            isMobile ? "w-72" : "w-80",
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 主面板容器 - 调整为微透明紫色背景 */}
          <div className="flex-1 flex flex-col bg-purple-900/20 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl">
            {/* 面板标题 - 调整背景色 */}
            <div className="p-4 border-b border-purple-400/20 bg-purple-800/30 rounded-t-2xl">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                {position === "left" ? (
                  <>
                    <Zap className="w-5 h-5 text-cyan-400" />
                    核心功能
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-amber-400" />
                    智能服务
                  </>
                )}
              </h3>
              <p className="text-white/70 text-sm mt-1">
                {position === "left" ? "AI创作与开发工具" : "即将推出的智能服务"}
              </p>

              {/* 自动隐藏提示 */}
              {!isMobile && !isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/50 mt-2 flex items-center gap-1"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                  3秒后自动收回
                </motion.div>
              )}
            </div>

            {/* 滚动控制按钮 - 上 */}
            {modules.length > VISIBLE_ITEMS && (
              <div className="p-2 border-b border-purple-400/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleScroll("up")}
                  disabled={isScrolling}
                  className={cn(
                    "w-full text-white/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200",
                    canScrollUp && "text-cyan-400 hover:text-cyan-300",
                  )}
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  {canScrollUp ? "向上滚动" : "循环到底部"}
                </Button>
              </div>
            )}

            {/* 模块列表容器 */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-hidden p-4 space-y-4"
              onWheel={handleWheel}
              style={{ height: VISIBLE_HEIGHT }}
            >
              <AnimatePresence mode="popLayout">
                {visibleModules.map((module, index) => {
                  const IconComponent = module.icon
                  const isDisabled = disabled || module.disabled

                  return (
                    <motion.div
                      key={`${module.id}-${scrollPosition}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      layout
                    >
                      <Card
                        className={cn(
                          "bg-purple-800/20 border-purple-400/20 hover:bg-purple-700/30 hover:border-purple-300/30 transition-all duration-300 cursor-pointer group relative overflow-hidden",
                          isDisabled && "opacity-50 cursor-not-allowed hover:bg-purple-800/20",
                        )}
                        onClick={() => !isDisabled && onModuleClick(module.id)}
                        style={{ height: CARD_HEIGHT }}
                      >
                        {/* 渐变背景效果 */}
                        <div
                          className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r",
                            module.color,
                          )}
                        />

                        <CardHeader className="pb-2">
                          <CardTitle className="text-white flex items-center gap-3 text-base">
                            <div className={cn("p-2 rounded-lg bg-gradient-to-r shadow-lg", module.color)}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{module.title}</div>
                              <div className="text-xs text-white/70 font-normal mt-1 truncate">
                                {module.description}
                              </div>
                            </div>
                            {isDisabled && <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {module.features.slice(0, 3).map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="bg-purple-600/30 border-purple-400/30 text-white/80 text-xs px-2 py-0.5"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            size="sm"
                            disabled={isDisabled}
                            className={cn(
                              "w-full text-white font-medium transition-all duration-200",
                              isDisabled
                                ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                                : `bg-gradient-to-r ${module.color} hover:shadow-lg hover:scale-[1.02]`,
                            )}
                          >
                            {isDisabled ? "即将推出" : "立即体验"}
                          </Button>
                        </CardContent>

                        {/* 悬浮指示器 */}
                        {!isDisabled && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* 滚动控制按钮 - 下 */}
            {modules.length > VISIBLE_ITEMS && (
              <div className="p-2 border-t border-purple-400/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleScroll("down")}
                  disabled={isScrolling}
                  className={cn(
                    "w-full text-white/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200",
                    canScrollDown && "text-cyan-400 hover:text-cyan-300",
                  )}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {canScrollDown ? "向下滚动" : "循环到顶部"}
                </Button>
              </div>
            )}

            {/* 滚动指示器 */}
            {modules.length > VISIBLE_ITEMS && (
              <div className="px-4 py-2 border-t border-purple-400/10 bg-purple-800/20 rounded-b-2xl">
                <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(modules.length, 5) }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                          i === scrollPosition % 5 ? "bg-cyan-400" : "bg-white/30",
                        )}
                      />
                    ))}
                  </div>
                  <span>
                    {scrollPosition + 1}-{Math.min(scrollPosition + VISIBLE_ITEMS, modules.length)} / {modules.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
