"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Music, Code, Brain, ImageIcon, Home, Building2, GraduationCap, Heart } from "lucide-react"
import { AIInteractionHub } from "@/components/ai-interaction-hub"
import { SmartModulePanel } from "@/components/smart-module-panel"
import { VoiceRecognition } from "@/components/voice-recognition"
import { DynamicWordCloud } from "@/components/dynamic-word-cloud"
import { IntelligentRecommendations } from "@/components/intelligent-recommendations"
import { Enhanced3DLogo } from "@/components/enhanced-3d-logo"
import { TopNavigationMenu } from "@/components/top-navigation-menu"
import { EmotionalReminder } from "@/components/emotional-reminder"
import { ModuleModal } from "@/components/module-modal"

export default function YanYuCloudCubePlatform() {
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [currentContext, setCurrentContext] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isIdle, setIsIdle] = useState(true)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showReminder, setShowReminder] = useState(false)
  const [reminderPhase, setReminderPhase] = useState<"gentle" | "playful">("gentle")
  const [isMobile, setIsMobile] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPanelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rightPanelTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 核心功能模块定义
  const coreModules = [
    {
      id: "image-creation",
      title: "YYC³ ImageX",
      icon: ImageIcon,
      color: "from-blue-500 to-cyan-400",
      features: ["文生图", "图生图", "扩图", "美图"],
      description: "AI图像创作工具",
      url: "/image-creation",
    },
    {
      id: "video-hub",
      title: "YYC³ VideoHub",
      icon: Video,
      color: "from-purple-500 to-pink-400",
      features: ["视频剪辑", "特效处理", "AI配音"],
      description: "智能视频处理平台",
      url: "/video-hub",
    },
    {
      id: "music-studio",
      title: "YYC³ MusicStudio",
      icon: Music,
      color: "from-green-500 to-teal-400",
      features: ["AI作曲", "音效生成", "节拍制作"],
      description: "AI音乐创作工作室",
      url: "/music-studio",
    },
    {
      id: "code-assistant",
      title: "YYC³ CodeX",
      icon: Code,
      color: "from-orange-500 to-red-400",
      features: ["代码生成", "智能补全", "错误检测"],
      description: "智能编程助手",
      url: "/code-assistant",
    },
    {
      id: "ai-engine",
      title: "YYC³ AIEngine",
      icon: Brain,
      color: "from-indigo-500 to-blue-400",
      features: ["智谱AI", "Ollama", "DeepSeek"],
      description: "统一AI模型调用平台",
      url: "/ai-engine",
    },
  ]

  // 智能服务模块
  const smartModules = [
    {
      id: "smart-home",
      title: "YYC³ SmartHome",
      icon: Home,
      color: "from-green-500 to-emerald-400",
      url: "/smart-home",
      description: "智慧家居控制系统",
      features: ["设备控制", "场景联动"],
      disabled: true,
    },
    {
      id: "smart-city",
      title: "YYC³ SmartCity",
      icon: Building2,
      color: "from-blue-500 to-sky-400",
      url: "/smart-city",
      description: "城市智能管理平台",
      features: ["数据分析", "智能调度"],
      disabled: true,
    },
    {
      id: "smart-education",
      title: "YYC³ EduSmart",
      icon: GraduationCap,
      color: "from-yellow-500 to-orange-400",
      url: "/smart-education",
      description: "智慧教育平台",
      features: ["个性化学习", "智能评测"],
      disabled: true,
    },
    {
      id: "smart-health",
      title: "YYC³ HealthAI",
      icon: Heart,
      color: "from-rose-500 to-pink-400",
      url: "/smart-health",
      description: "智能健康管理",
      features: ["健康监测", "疾病预测"],
      disabled: true,
    },
  ]

  // 情感化提醒语句
  const gentleReminders = [
    "亲爱的朋友，需要我为您做些什么吗？😊",
    "我在这里静静等候，随时为您服务～",
    "有什么想法想要分享吗？我很乐意倾听💫",
    "让我们一起探索无限可能吧！✨",
  ]

  const playfulReminders = [
    "喂～别光看不说话呀！我会害羞的 (｡･ω･｡)",
    "主人，我等得花儿都谢了～ 🌸",
    "不理我的话，我就要闹小脾气啦！(╯°□°）╯",
    "好无聊呀，快来和我聊天嘛～ (´･ω･`)",
  ]

  // 左侧面板悬浮控制 - 修复自动缩回功能
  const handleLeftPanelEnter = () => {
    if (leftPanelTimeoutRef.current) {
      clearTimeout(leftPanelTimeoutRef.current)
    }
    setShowLeftPanel(true)
  }

  const handleLeftPanelLeave = () => {
    leftPanelTimeoutRef.current = setTimeout(() => {
      setShowLeftPanel(false)
    }, 500) // 增加延迟时间，避免过快缩回
  }

  // 右侧面板悬浮控制 - 修复自动缩回功能
  const handleRightPanelEnter = () => {
    if (rightPanelTimeoutRef.current) {
      clearTimeout(rightPanelTimeoutRef.current)
    }
    setShowRightPanel(true)
  }

  const handleRightPanelLeave = () => {
    rightPanelTimeoutRef.current = setTimeout(() => {
      setShowRightPanel(false)
    }, 500) // 增加延迟时间，避免过快缩回
  }

  // 监听键盘和鼠标事件
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showChatModal && e.key !== "Tab" && e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt") {
        setShowChatModal(true)
        setIsActive(true)
        setIsIdle(false)
        setLastActivity(Date.now())
      }
    }

    const handleActivity = () => {
      setLastActivity(Date.now())
      setShowReminder(false)
    }

    const checkIdle = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity

      if (timeSinceActivity > 10000 && !inputValue && !isListening && showChatModal) {
        setIsIdle(true)
        setShowChatModal(false)
        setIsActive(false)
        setShowReminder(false)
      }

      if (timeSinceActivity > 5000 && timeSinceActivity < 7000 && showChatModal && !showReminder) {
        setShowReminder(true)
        setReminderPhase("gentle")
      }

      if (timeSinceActivity > 7000 && timeSinceActivity < 9000 && showChatModal && reminderPhase === "gentle") {
        setReminderPhase("playful")
      }

      if (timeSinceActivity > 9000 && showReminder) {
        setShowReminder(false)
      }
    }

    const interval = setInterval(checkIdle, 100)

    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("mousemove", handleActivity)
    document.addEventListener("click", handleActivity)

    return () => {
      clearInterval(interval)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("mousemove", handleActivity)
      document.removeEventListener("click", handleActivity)
      if (leftPanelTimeoutRef.current) clearTimeout(leftPanelTimeoutRef.current)
      if (rightPanelTimeoutRef.current) clearTimeout(rightPanelTimeoutRef.current)
    }
  }, [lastActivity, inputValue, isListening, showChatModal, showReminder, reminderPhase])

  // 智能推荐系统
  useEffect(() => {
    if (inputValue) {
      const keywords = inputValue.toLowerCase()
      const newRecommendations = []

      if (keywords.includes("图") || keywords.includes("画") || keywords.includes("设计")) {
        newRecommendations.push("图像创作", "美图处理", "抠图工具")
      }
      if (keywords.includes("视频") || keywords.includes("剪辑")) {
        newRecommendations.push("视频编辑", "AI配音", "特效制作")
      }
      if (keywords.includes("音乐") || keywords.includes("声音")) {
        newRecommendations.push("AI作曲", "音效生成", "节拍制作")
      }
      if (keywords.includes("代码") || keywords.includes("编程")) {
        newRecommendations.push("代码生成", "智能补全", "错误检测")
      }

      setRecommendations(newRecommendations)
    } else {
      setRecommendations([])
    }
  }, [inputValue])

  // 点击主屏幕激活聊天
  const handleMainScreenClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("[data-navigation-area]") || target.closest("[data-no-click]")) {
      return
    }

    if (!showChatModal && !activeModal) {
      setShowChatModal(true)
      setIsActive(true)
      setIsIdle(false)
      setLastActivity(Date.now())
    }
  }

  // 语音识别处理
  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    setLastActivity(Date.now())
  }

  // 文件上传处理
  const handleFileUpload = () => {
    fileInputRef.current?.click()
    setLastActivity(Date.now())
  }

  // 发送消息处理
  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("发送消息:", inputValue)
      setInputValue("")
      setLastActivity(Date.now())

      setTimeout(() => {
        if (inputValue.includes("图")) {
          setCurrentContext("image-creation")
        } else if (inputValue.includes("视频")) {
          setCurrentContext("video-hub")
        } else if (inputValue.includes("音乐")) {
          setCurrentContext("music-studio")
        } else if (inputValue.includes("代码")) {
          setCurrentContext("code-assistant")
        }
      }, 1000)
    }
  }

  // 模块点击处理
  const handleModuleClick = (moduleId: string) => {
    setActiveModal(moduleId)
    setLastActivity(Date.now())
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setActiveModal(null)
    setLastActivity(Date.now())
  }

  // 关闭聊天弹窗
  const handleCloseChatModal = () => {
    setShowChatModal(false)
    setIsActive(false)
    setIsIdle(true)
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden"
      onClick={handleMainScreenClick}
    >
      {/* 动态背景效果 */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.2),transparent_50%)]" />
      </div>

      {/* 智能粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: isMobile ? 8 : 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920)],
              y: [0, Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080)],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* 主Logo和标题 - 完美自适应居中 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          className="flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={handleMainScreenClick}
          style={{ cursor: "pointer" }}
        >
          <Enhanced3DLogo isActive={false} isIdle={isIdle} onClick={handleMainScreenClick} size="hero" />

          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* 主标题 - 优化字体样式 */}
            <motion.div
              className="text-white/90 font-bold italic tracking-wider"
              style={{
                fontSize: isMobile ? "1.75rem" : "clamp(2.25rem, 4.5vw, 3.5rem)",
                lineHeight: 1.2,
                fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                textShadow: "0 4px 20px rgba(147, 51, 234, 0.3)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                YanY
              </span>
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent text-[0.85em]">
                u
              </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Cloud³
              </span>
            </motion.div>

            {/* 副标题 - 更新文字内容 */}
            <motion.div
              className="text-white/80 font-medium"
              style={{
                fontSize: isMobile ? "1rem" : "clamp(1.125rem, 2.5vw, 1.5rem)",
                lineHeight: 1.4,
                letterSpacing: "0.05em",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              万象归元于云枢 丨 深栈智启新纪元
            </motion.div>

            {/* 提示文字 */}
            <motion.div
              className="text-white/60"
              style={{
                fontSize: isMobile ? "0.875rem" : "clamp(0.875rem, 1.5vw, 1.125rem)",
                lineHeight: 1.5,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              点击任意位置开始对话 · 按任意键快速启动
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 右上角导航菜单 */}
      <div data-no-click>
        <TopNavigationMenu isVisible={true} onMenuClick={() => {}} />
      </div>

      {/* 左侧触发区域和面板组合 - 修复自动缩回 */}
      <div
        data-navigation-area
        className="fixed left-0 top-0 bottom-0 z-30"
        onMouseEnter={handleLeftPanelEnter}
        onMouseLeave={handleLeftPanelLeave}
      >
        {/* 触发区域 */}
        <div className="w-16 h-full bg-transparent hover:bg-white/5 transition-colors duration-200" />

        {/* 左侧核心功能面板 */}
        <div onMouseEnter={handleLeftPanelEnter} onMouseLeave={handleLeftPanelLeave}>
          <SmartModulePanel
            modules={coreModules}
            position="left"
            isVisible={showLeftPanel}
            isMobile={isMobile}
            onModuleClick={handleModuleClick}
            fullDisplay={false}
          />
        </div>
      </div>

      {/* 右侧触发区域和面板组合 - 修复自动缩回 */}
      {!isMobile && (
        <div
          data-navigation-area
          className="fixed right-0 top-0 bottom-0 z-30"
          onMouseEnter={handleRightPanelEnter}
          onMouseLeave={handleRightPanelLeave}
        >
          {/* 触发区域 */}
          <div className="w-16 h-full bg-transparent hover:bg-white/5 transition-colors duration-200" />

          {/* 右侧智能服务面板 */}
          <div onMouseEnter={handleRightPanelEnter} onMouseLeave={handleRightPanelLeave}>
            <SmartModulePanel
              modules={smartModules}
              position="right"
              isVisible={showRightPanel}
              isMobile={isMobile}
              onModuleClick={handleModuleClick}
              disabled={true}
            />
          </div>
        </div>
      )}

      {/* 聊天弹窗 - 居中自适应 */}
      <AnimatePresence>
        {showChatModal && !activeModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseChatModal()
              }
            }}
          >
            <div className="w-full max-w-4xl h-full max-h-[85vh] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <AIInteractionHub
                isVisible={showChatModal}
                inputValue={inputValue}
                onInputChange={(value) => {
                  setInputValue(value)
                  setLastActivity(Date.now())
                }}
                isListening={isListening}
                onVoiceToggle={handleVoiceToggle}
                onFileUpload={handleFileUpload}
                onSend={handleSend}
                recommendations={recommendations}
                currentContext={currentContext}
                onContextChange={setCurrentContext}
                onClose={handleCloseChatModal}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 情感化提醒组件 */}
      <EmotionalReminder
        isVisible={showReminder}
        phase={reminderPhase}
        gentleMessages={gentleReminders}
        playfulMessages={playfulReminders}
        onInteraction={() => {
          setLastActivity(Date.now())
          setShowReminder(false)
        }}
      />

      {/* 动态词云 */}
      <DynamicWordCloud
        isVisible={showChatModal && inputValue.length > 0 && !activeModal}
        keywords={recommendations}
        onKeywordClick={(keyword) => {
          setInputValue((prev) => prev + " " + keyword)
          setLastActivity(Date.now())
        }}
      />

      {/* 智能推荐系统 */}
      <IntelligentRecommendations
        isVisible={currentContext !== null && !activeModal}
        context={currentContext}
        onRecommendationClick={(action) => {
          console.log("执行推荐操作:", action)
          setLastActivity(Date.now())
        }}
        onClose={() => {
          setCurrentContext(null)
          setLastActivity(Date.now())
        }}
      />

      {/* 功能模块弹窗 */}
      <ModuleModal
        moduleId={activeModal}
        isOpen={activeModal !== null}
        onClose={handleCloseModal}
        modules={[...coreModules, ...smartModules]}
      />

      {/* 语音识别组件 */}
      <VoiceRecognition
        isListening={isListening}
        onResult={(text) => {
          setInputValue(text)
          setIsListening(false)
          setLastActivity(Date.now())
        }}
        onError={() => {
          setIsListening(false)
          setLastActivity(Date.now())
        }}
      />

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          console.log("上传文件:", files)
          setLastActivity(Date.now())
        }}
      />

      {/* 极简页脚 */}
      {!isMobile && !activeModal && !showChatModal && (
        <motion.footer
          className="absolute bottom-0 left-0 right-0 p-4 text-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs text-white/50 border-t border-white/10 pt-2">
            © 2024 YanYuCloud³ · 言启万象丨语枢未来
          </div>
        </motion.footer>
      )}
    </div>
  )
}
