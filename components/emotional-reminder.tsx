"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Sparkles, Coffee, Music } from "lucide-react"

interface EmotionalReminderProps {
  isVisible: boolean
  phase: "gentle" | "playful"
  gentleMessages: string[]
  playfulMessages: string[]
  onInteraction: () => void
}

export function EmotionalReminder({
  isVisible,
  phase,
  gentleMessages,
  playfulMessages,
  onInteraction,
}: EmotionalReminderProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // 选择消息
  useEffect(() => {
    const messages = phase === "gentle" ? gentleMessages : playfulMessages
    if (messages.length > 0) {
      setCurrentMessage(messages[messageIndex % messages.length])
    }
  }, [phase, messageIndex, gentleMessages, playfulMessages])

  // 自动切换消息
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setMessageIndex((prev) => prev + 1)
        setIsAnimating(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible])

  // 获取阶段样式
  const getPhaseStyles = () => {
    if (phase === "gentle") {
      return {
        bgColor: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-400/30",
        iconColor: "text-blue-400",
        icon: Heart,
      }
    } else {
      return {
        bgColor: "bg-gradient-to-r from-pink-500/20 to-purple-500/20",
        borderColor: "border-pink-400/30",
        iconColor: "text-pink-400",
        icon: Sparkles,
      }
    }
  }

  const styles = getPhaseStyles()
  const IconComponent = styles.icon

  // 快速操作按钮
  const quickActions = [
    { icon: MessageCircle, label: "开始对话", action: "chat" },
    { icon: Coffee, label: "休息一下", action: "break" },
    { icon: Music, label: "播放音乐", action: "music" },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-32 right-6 z-50 max-w-sm"
        >
          <div
            className={`
            ${styles.bgColor} backdrop-blur-xl border ${styles.borderColor} 
            rounded-2xl p-4 shadow-2xl
          `}
          >
            {/* 头部 */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: phase === "playful" ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className={`w-8 h-8 ${styles.iconColor} flex items-center justify-center`}
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>

              <div>
                <h3 className="text-white font-medium text-sm">{phase === "gentle" ? "温馨提醒" : "俏皮提醒"}</h3>
                <p className="text-white/60 text-xs">{phase === "gentle" ? "我在这里陪伴您" : "来和我互动吧！"}</p>
              </div>
            </div>

            {/* 消息内容 */}
            <motion.div
              animate={{
                opacity: isAnimating ? 0.5 : 1,
                y: isAnimating ? -5 : 0,
              }}
              className="mb-4"
            >
              <p className="text-white/90 text-sm leading-relaxed">{currentMessage}</p>
            </motion.div>

            {/* 快速操作 */}
            <div className="flex gap-2">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon
                return (
                  <Button
                    key={action.action}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onInteraction()
                      // 这里可以添加具体的操作逻辑
                    }}
                    className="flex-1 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <ActionIcon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                )
              })}
            </div>

            {/* 装饰性动画元素 */}
            <div className="absolute -top-2 -right-2">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className={`w-4 h-4 ${styles.iconColor} opacity-60`}
              >
                {phase === "gentle" ? <Heart className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </motion.div>
            </div>

            {/* 底部指示器 */}
            <div className="flex justify-center mt-3 gap-1">
              {(phase === "gentle" ? gentleMessages : playfulMessages).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    index === (messageIndex % (phase === "gentle" ? gentleMessages : playfulMessages).length)
                      ? styles.iconColor.replace("text-", "bg-")
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 连接线 */}
          <div
            className={`
            absolute -bottom-2 right-8 w-0 h-0 
            border-l-8 border-r-8 border-t-8 
            border-l-transparent border-r-transparent 
            ${styles.borderColor.replace("border-", "border-t-")}
          `}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
