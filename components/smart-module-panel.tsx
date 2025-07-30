"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, Sparkles, Zap } from "lucide-react"

interface Module {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
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
  fullDisplay = true,
  disabled = false,
}: SmartModulePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleModuleClick = (moduleId: string) => {
    if (!disabled) {
      onModuleClick(moduleId)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position === "left" ? -100 : 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: position === "left" ? -100 : 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${position === "left" ? "left-16" : "right-16"} top-0 h-full z-40 w-80`}
        >
          <div className="h-full bg-gradient-to-b from-purple-900/90 to-indigo-900/90 backdrop-blur-xl border border-white/20 rounded-r-2xl overflow-y-auto">
            {/* 面板头部 */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    {position === "left" ? (
                      <>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        核心功能
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-purple-400" />
                        智能服务
                      </>
                    )}
                  </h2>
                  <p className="text-purple-300 text-sm">
                    {position === "left" ? "AI创作与开发工具" : "智能化应用服务"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-300 hover:text-white hover:bg-white/10"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
              {isExpanded && <div className="mt-2 text-xs text-purple-400">循环到底部</div>}
            </div>

            {/* 模块列表 */}
            <div className="p-4 space-y-3">
              {modules.map((module, index) => {
                const IconComponent = module.icon
                return (
                  <Card
                    key={module.id}
                    className={`bg-gradient-to-r ${module.color} p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm">{module.title}</h3>
                          <p className="text-white/80 text-xs">{module.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {module.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            variant="secondary"
                            className="text-xs bg-white/20 text-white border-0 hover:bg-white/30"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200"
                        size="sm"
                        disabled={disabled}
                      >
                        {disabled ? "即将推出" : "立即体验"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 底部滚动提示 */}
            {isExpanded && (
              <div className="p-4 border-t border-white/20">
                <div className="text-center">
                  <ChevronDown className="w-4 h-4 text-purple-400 mx-auto animate-bounce" />
                  <p className="text-purple-400 text-xs mt-1">向下滚动</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
