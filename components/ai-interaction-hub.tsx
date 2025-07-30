"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff, Paperclip, X, Sparkles, Brain, Zap, MessageCircle, Palette } from "lucide-react"
import type { SpeechRecognition } from "web-speech-api"

interface AIInteractionHubProps {
  isVisible?: boolean
  inputValue?: string
  onInputChange?: (value: string) => void
  isListening?: boolean
  onVoiceToggle?: () => void
  onFileUpload?: () => void
  onSend?: () => void
  recommendations?: string[]
  currentContext?: string | null
  onContextChange?: (context: string | null) => void
  onClose?: () => void
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isTyping?: boolean
  reactions?: { type: string; count: number }[]
  attachments?: { name: string; type: string; url: string }[]
}

interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
  enableVoice: boolean
  voiceSpeed: number
  autoSave: boolean
  darkMode: boolean
  language: string
  notifications: boolean
  streamResponse: boolean
  showThinking: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: string
    language: string
    autoSave: boolean
  }
}

export function AIInteractionHub({
  isVisible = true,
  inputValue = "",
  onInputChange = () => {},
  isListening = false,
  onVoiceToggle = () => {},
  onFileUpload = () => {},
  onSend = () => {},
  recommendations = [],
  currentContext = null,
  onContextChange = () => {},
  onClose = () => {},
}: AIInteractionHubProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [aiModel, setAiModel] = useState("gpt-4")
  const [creativity, setCreativity] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState("2048")
  const [systemPrompt, setSystemPrompt] = useState("你是YanYuCloud³的智能助手，专注于为用户提供专业、友好的帮助。")
  const [showSettings, setShowSettings] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [chatHistory, setChatHistory] = useState<
    Array<{ id: string; title: string; messages: Message[]; timestamp: Date }>
  >([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [settings, setSettings] = useState<AISettings>({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: "你是YanYuCloud³的智能助手，专注于为用户提供专业、友好的帮助。",
    enableVoice: true,
    voiceSpeed: 1.0,
    autoSave: true,
    darkMode: false,
    language: "zh-CN",
    notifications: true,
    streamResponse: true,
    showThinking: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化语音识别
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = settings.language

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          onInputChange(inputValue + transcript)
        }

        recognitionRef.current.onerror = (event) => {
          console.error("语音识别错误:", event.error)
        }
      }
    }
  }, [settings.language, inputValue, onInputChange])

  // 语音识别控制
  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.start()
      } else {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  // 本地存储管理
  useEffect(() => {
    // 加载设置
    const savedSettings = localStorage.getItem("yyc-ai-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // 加载聊天历史
    const savedHistory = localStorage.getItem("yyc-chat-history")
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }

    // 加载用户信息
    const savedUser = localStorage.getItem("yyc-user-profile")
    if (savedUser) {
      setUserProfile(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  // 保存设置到本地存储
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem("yyc-ai-settings", JSON.stringify(settings))
    }
  }, [settings])

  // 保存聊天记录
  useEffect(() => {
    if (settings.autoSave && messages.length > 0) {
      const currentChat = {
        id: currentChatId || Date.now().toString(),
        title: messages[0]?.content.slice(0, 30) + "..." || "新对话",
        messages,
        timestamp: new Date(),
      }

      const updatedHistory = chatHistory.filter((chat) => chat.id !== currentChat.id)
      updatedHistory.unshift(currentChat)

      setChatHistory(updatedHistory.slice(0, 50)) // 只保留最近50个对话
      localStorage.setItem("yyc-chat-history", JSON.stringify(updatedHistory.slice(0, 50)))

      if (!currentChatId) {
        setCurrentChatId(currentChat.id)
      }
    }
  }, [messages, currentChatId, chatHistory, settings.autoSave])

  // AI回复流式处理
  const streamAIResponse = async (userMessage: string) => {
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { type: "user", content: userMessage }],
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error("网络请求失败")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("无法读取响应流")
      }

      const aiMessageId = Date.now().toString()
      const aiMessage: Message = {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      const decoder = new TextDecoder()
      let accumulatedContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isTyping: false } : msg)))
              setIsTyping(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                accumulatedContent += parsed.choices[0].delta.content
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: accumulatedContent } : msg)),
                )
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error("AI回复错误:", error)
      setIsTyping(false)

      // 添加错误消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: "抱歉，我遇到了一些技术问题。请稍后再试。",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = inputValue.trim()
    onInputChange("")

    // 流式AI回复
    await streamAIResponse(messageContent)
    onSend()
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 复制消息
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // 可以添加toast提示
  }

  // 消息反馈
  const reactToMessage = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.type === reaction)
          if (existingReaction) {
            existingReaction.count += 1
          } else {
            reactions.push({ type: reaction, count: 1 })
          }
          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  // 重新生成回复
  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1].content
      // 移除当前AI回复
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      // 重新生成
      await streamAIResponse(userMessage)
    }
  }

  // 语音播放
  const playVoice = (text: string) => {
    if (settings.enableVoice && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settings.voiceSpeed
      utterance.lang = settings.language
      speechSynthesis.speak(utterance)
    }
  }

  // 设置更新
  const updateSettings = (key: keyof AISettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // 用户登录
  const handleLogin = () => {
    // 模拟登录
    const mockUser: UserProfile = {
      id: "user_" + Date.now(),
      name: "用户",
      email: "user@example.com",
      preferences: {
        theme: "dark",
        language: "zh-CN",
        autoSave: true,
      },
    }
    setUserProfile(mockUser)
    setIsLoggedIn(true)
    localStorage.setItem("yyc-user-profile", JSON.stringify(mockUser))
  }

  // 用户登出
  const handleLogout = () => {
    setUserProfile(null)
    setIsLoggedIn(false)
    localStorage.removeItem("yyc-user-profile")
  }

  // 加载历史对话
  const loadChatHistory = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setCurrentChatId(chatId)
    }
  }

  // 新建对话
  const startNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
  }

  // 导出对话
  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.type === "user" ? "用户" : "AI"} (${msg.timestamp.toLocaleString()}): ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `YYC³-Chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { role: "user" as const, content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    onInputChange("")
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: `我理解您的问题："${inputValue}"。作为YanYuCloud³的智能助手，我很乐意为您提供帮助。请告诉我您需要什么具体的协助？`,
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)

    onSend()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">YYC³ AI助手</h2>
            <p className="text-purple-200 text-sm">智能对话与创作平台</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex">
        {/* 聊天区域 */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 mx-4 mt-4">
              <TabsTrigger value="chat" className="text-purple-200 data-[state=active]:bg-purple-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                对话
              </TabsTrigger>
              <TabsTrigger value="model" className="text-purple-200 data-[state=active]:bg-purple-600">
                <Brain className="w-4 h-4 mr-2" />
                模型
              </TabsTrigger>
              <TabsTrigger value="behavior" className="text-purple-200 data-[state=active]:bg-purple-600">
                <Zap className="w-4 h-4 mr-2" />
                行为
              </TabsTrigger>
              <TabsTrigger value="interface" className="text-purple-200 data-[state=active]:bg-purple-600">
                <Palette className="w-4 h-4 mr-2" />
                界面
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col p-4 space-y-4">
              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto space-y-4 max-h-96">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200 text-lg mb-2">欢迎使用YYC³ AI助手</p>
                    <p className="text-purple-300 text-sm">开始对话，探索无限可能</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white/10 text-purple-100 border border-white/20"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/10 text-purple-100 border border-white/20 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
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
                <div className="flex flex-wrap gap-2">
                  {recommendations.map((rec, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer text-purple-200 border-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
                      onClick={() => onInputChange(inputValue + " " + rec)}
                    >
                      {rec}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 输入区域 */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题或想法..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 resize-none min-h-[60px] pr-20"
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onFileUpload}
                      className="text-purple-300 hover:text-white hover:bg-white/10"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onVoiceToggle}
                      className={`${
                        isListening ? "text-red-400 hover:text-red-300" : "text-purple-300 hover:text-white"
                      } hover:bg-white/10`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="model" className="flex-1 p-4 space-y-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI模型
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">选择模型</label>
                    <Select value={aiModel} onValueChange={setAiModel}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900/95 border-purple-500/30 text-white">
                        <SelectItem value="gpt-4">GPT-4 (推荐)</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude-3 Sonnet</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">创造性 ({creativity[0]})</label>
                    <Slider
                      value={creativity}
                      onValueChange={setCreativity}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-300 mt-1">
                      <span>保守</span>
                      <span>创新</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">回复长度</label>
                    <Select value={maxTokens} onValueChange={setMaxTokens}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900/95 border-purple-500/30 text-white">
                        <SelectItem value="512">简短 (512)</SelectItem>
                        <SelectItem value="1024">中等 (1024)</SelectItem>
                        <SelectItem value="2048">详细 (2048)</SelectItem>
                        <SelectItem value="4096">完整 (4096)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="flex-1 p-4 space-y-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    行为设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">系统提示词</label>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 min-h-[120px]"
                      placeholder="定义AI助手的行为和角色..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interface" className="flex-1 p-4 space-y-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    界面设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-purple-200 text-sm">界面设置功能正在开发中，敬请期待...</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
