"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  MicOff,
  Upload,
  Send,
  X,
  Sparkles,
  MessageCircle,
  History,
  Settings,
  User,
  Bot,
  ImageIcon,
  Video,
  Music,
  Code,
  Brain,
} from "lucide-react"

interface AIInteractionHubProps {
  isVisible: boolean
  inputValue: string
  onInputChange: (value: string) => void
  isListening: boolean
  onVoiceToggle: () => void
  onFileUpload: () => void
  onSend: () => void
  recommendations: string[]
  currentContext: string | null
  onContextChange: (context: string | null) => void
  onClose: () => void
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  context?: string
}

export function AIInteractionHub({
  isVisible,
  inputValue,
  onInputChange,
  isListening,
  onVoiceToggle,
  onFileUpload,
  onSend,
  recommendations,
  currentContext,
  onContextChange,
  onClose,
}: AIInteractionHubProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "history" | "settings">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 处理发送消息
  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      context: currentContext || undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    onSend()

    // 模拟AI回复
    setIsTyping(true)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputValue, currentContext),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  // 生成AI回复
  const generateAIResponse = (input: string, context: string | null): string => {
    const responses = {
      "image-creation": [
        "我可以帮您创作精美的图像！您想要什么风格的图片呢？",
        "图像创作是我的强项，请描述您想要的画面内容。",
        "让我们一起创造视觉艺术！您有什么具体的创意想法吗？",
      ],
      "video-hub": [
        "视频制作很有趣！您想要制作什么类型的视频？",
        "我可以协助您进行视频剪辑和特效处理，请告诉我您的需求。",
        "视频创作需要什么帮助？我可以提供专业的建议。",
      ],
      "music-studio": [
        "音乐创作是艺术的灵魂！您想要什么风格的音乐？",
        "让我们一起谱写美妙的旋律，您有什么音乐想法吗？",
        "我可以帮您创作原创音乐，请描述您想要的音乐风格。",
      ],
      "code-assistant": [
        "编程问题交给我！您需要什么编程语言的帮助？",
        "代码开发是我的专长，请告诉我您遇到的技术问题。",
        "让我们一起解决编程挑战！您想要实现什么功能？",
      ],
      "ai-engine": [
        "AI模型调用服务已就绪！您想要使用哪个AI模型？",
        "我可以帮您调用各种AI模型，包括智谱AI、Ollama和DeepSeek。",
        "AI引擎已启动，请告诉我您的具体需求。",
      ],
    }

    if (context && responses[context as keyof typeof responses]) {
      const contextResponses = responses[context as keyof typeof responses]
      return contextResponses[Math.floor(Math.random() * contextResponses.length)]
    }

    const generalResponses = [
      "您好！我是言语云³的AI助手，很高兴为您服务！",
      "我理解了您的需求，让我为您提供最佳的解决方案。",
      "这是一个很有趣的问题，让我们一起探索答案。",
      "我会尽我所能帮助您，请告诉我更多详细信息。",
    ]

    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 获取上下文图标
  const getContextIcon = (context: string) => {
    const icons = {
      "image-creation": ImageIcon,
      "video-hub": Video,
      "music-studio": Music,
      "code-assistant": Code,
      "ai-engine": Brain,
    }
    return icons[context as keyof typeof icons] || Sparkles
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-full flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
        >
          {/* 顶部导航栏 */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">YYC³ AI助手</span>
              </div>

              {currentContext && (
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                  {React.createElement(getContextIcon(currentContext), { className: "w-3 h-3 mr-1" })}
                  {currentContext === "image-creation" && "图像创作"}
                  {currentContext === "video-hub" && "视频制作"}
                  {currentContext === "music-studio" && "音乐创作"}
                  {currentContext === "code-assistant" && "代码助手"}
                  {currentContext === "ai-engine" && "AI引擎"}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("chat")}
                className={`text-white/70 hover:text-white ${activeTab === "chat" ? "bg-white/20" : ""}`}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("history")}
                className={`text-white/70 hover:text-white ${activeTab === "history" ? "bg-white/20" : ""}`}
              >
                <History className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("settings")}
                className={`text-white/70 hover:text-white ${activeTab === "settings" ? "bg-white/20" : ""}`}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === "chat" && (
              <>
                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-white/60 py-8">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">欢迎使用言语云³ AI助手</p>
                      <p className="text-sm">我可以帮助您进行图像创作、视频制作、音乐创作、代码开发等各种任务</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                            : "bg-white/10 text-white border border-white/20"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 text-white border border-white/20 p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 推荐词汇 */}
                {recommendations.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/20">
                    <div className="flex flex-wrap gap-2">
                      {recommendations.map((rec, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => onInputChange(inputValue + " " + rec)}
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                          {rec}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 输入区域 */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入您的问题或需求..."
                        className="min-h-[48px] max-h-32 bg-white/10 border-white/30 text-white placeholder:text-white/50 resize-none pr-24"
                        rows={1}
                      />
                      <div className="absolute right-2 bottom-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={onVoiceToggle}
                          className={`w-8 h-8 p-0 ${
                            isListening ? "text-red-400 hover:text-red-300" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={onFileUpload}
                          className="w-8 h-8 p-0 text-white/70 hover:text-white"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="w-12 h-12 p-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "history" && (
              <div className="flex-1 p-4">
                <div className="text-center text-white/60 py-8">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">对话历史</p>
                  <p className="text-sm">您的对话记录将显示在这里</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="flex-1 p-4">
                <div className="text-center text-white/60 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">设置</p>
                  <p className="text-sm">AI助手设置选项</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
