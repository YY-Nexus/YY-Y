"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Settings,
  X,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  RotateCcw,
  Sparkles,
  Brain,
  Zap,
  Download,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isTyping?: boolean
  reactions?: { type: "like" | "dislike"; count: number }[]
}

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
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "你是一个友善、专业的AI助手，能够帮助用户解决各种问题。",
    streamResponse: true,
    showThinking: false,
    autoSave: true,
    smartSuggestions: true,
    language: "zh-CN",
    voiceEnabled: true,
    voiceSpeed: 1.0,
    notifications: true,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 打字机效果
  const typeMessage = (content: string, messageId: string) => {
    setIsTyping(true)
    let currentText = ""
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < content.length) {
        currentText += content[index]
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content: currentText, isTyping: true } : msg)),
        )
        index++
      } else {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isTyping: false } : msg)))
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 30)
  }

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    onInputChange("")

    // 模拟AI回复
    setTimeout(() => {
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      // 模拟AI回复内容
      const responses = [
        "我理解您的问题。让我为您详细分析一下这个情况...",
        "这是一个很有趣的问题！根据我的理解，我可以从以下几个方面来帮助您：",
        "感谢您的提问。基于您提供的信息，我建议采用以下方法：",
        "让我来帮您解决这个问题。首先，我们需要考虑以下几个关键因素：",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setTimeout(() => {
        typeMessage(randomResponse, aiMessageId)
      }, 500)
    }, 800)

    onSend()
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 消息操作
  const handleMessageAction = (messageId: string, action: string) => {
    switch (action) {
      case "like":
        console.log("点赞消息:", messageId)
        break
      case "dislike":
        console.log("点踩消息:", messageId)
        break
      case "copy":
        const message = messages.find((m) => m.id === messageId)
        if (message) {
          navigator.clipboard.writeText(message.content)
        }
        break
      case "speak":
        const msg = messages.find((m) => m.id === messageId)
        if (msg && settings.voiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(msg.content)
          utterance.rate = settings.voiceSpeed
          speechSynthesis.speak(utterance)
        }
        break
      case "regenerate":
        // 重新生成AI回复
        const aiMessageId = (Date.now() + 1).toString()
        const aiMessage: Message = {
          id: aiMessageId,
          type: "ai",
          content: "",
          timestamp: new Date(),
          isTyping: true,
        }
        setMessages((prev) => [...prev, aiMessage])
        setTimeout(() => {
          typeMessage("这是重新生成的回复内容，希望这次能更好地回答您的问题。", aiMessageId)
        }, 500)
        break
    }
  }

  // 清空对话
  const handleClearChat = () => {
    setMessages([])
  }

  // 导出对话
  const handleExportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.type === "user" ? "用户" : "AI"} (${msg.timestamp.toLocaleString()}): ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">YYC³ AI助手</h3>
                <p className="text-white/60 text-xs">{isTyping ? "正在思考..." : "在线"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* 主聊天区域 */}
            <div className="flex-1 flex flex-col">
              {/* 消息区域 */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-white/80 text-lg font-medium mb-2">开始对话</h4>
                      <p className="text-white/60 text-sm">我是您的AI助手，随时为您提供帮助</p>
                    </motion.div>
                  )}

                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                        <Card
                          className={`${
                            message.type === "user" ? "bg-purple-600 border-purple-500" : "bg-white/10 border-white/20"
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <p className="text-white text-sm leading-relaxed">
                                  {message.content}
                                  {message.isTyping && (
                                    <motion.span
                                      animate={{ opacity: [1, 0] }}
                                      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                                      className="inline-block w-2 h-4 bg-white ml-1"
                                    />
                                  )}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-white/50">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>

                                  {/* 消息操作按钮 */}
                                  {message.type === "ai" && !message.isTyping && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center gap-1"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMessageAction(message.id, "like")}
                                        className="h-6 w-6 p-0 text-white/50 hover:text-green-400"
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMessageAction(message.id, "dislike")}
                                        className="h-6 w-6 p-0 text-white/50 hover:text-red-400"
                                      >
                                        <ThumbsDown className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMessageAction(message.id, "copy")}
                                        className="h-6 w-6 p-0 text-white/50 hover:text-blue-400"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMessageAction(message.id, "speak")}
                                        className="h-6 w-6 p-0 text-white/50 hover:text-purple-400"
                                      >
                                        <Volume2 className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMessageAction(message.id, "regenerate")}
                                        className="h-6 w-6 p-0 text-white/50 hover:text-yellow-400"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  ))}

                  {/* 智能推荐 */}
                  {recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                            onClick={() => onInputChange(inputValue + " " + rec)}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {rec}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* 输入区域 */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入您的问题..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFileUpload}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onVoiceToggle}
                    className={`${
                      isListening ? "text-red-400 hover:text-red-300" : "text-white/70 hover:text-white"
                    } hover:bg-white/10`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 设置面板 */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-white/10 bg-white/5 overflow-hidden"
                >
                  <div className="p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">设置</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(false)}
                        className="text-white/70 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <ScrollArea className="h-full">
                      <Tabs defaultValue="ai" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-white/10">
                          <TabsTrigger value="ai" className="text-xs">
                            AI设置
                          </TabsTrigger>
                          <TabsTrigger value="behavior" className="text-xs">
                            行为
                          </TabsTrigger>
                          <TabsTrigger value="interface" className="text-xs">
                            界面
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ai" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-sm text-white/80">AI模型</label>
                            <Select
                              value={settings.model}
                              onValueChange={(value) => setSettings((prev) => ({ ...prev, model: value }))}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3">Claude-3</SelectItem>
                                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-white/80">创造性 ({settings.temperature})</label>
                            <Slider
                              value={[settings.temperature]}
                              onValueChange={([value]) => setSettings((prev) => ({ ...prev, temperature: value }))}
                              max={2}
                              min={0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-white/80">回复长度 ({settings.maxTokens})</label>
                            <Select
                              value={settings.maxTokens.toString()}
                              onValueChange={(value) =>
                                setSettings((prev) => ({ ...prev, maxTokens: Number.parseInt(value) }))
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="500">简短 (500)</SelectItem>
                                <SelectItem value="1000">中等 (1000)</SelectItem>
                                <SelectItem value="2000">详细 (2000)</SelectItem>
                                <SelectItem value="4000">超长 (4000)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-white/80">系统提示词</label>
                            <Textarea
                              value={settings.systemPrompt}
                              onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                              placeholder="自定义AI的角色和行为..."
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="behavior" className="space-y-4 mt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">流式响应</label>
                              <p className="text-xs text-white/60">实时显示AI回复过程</p>
                            </div>
                            <Switch
                              checked={settings.streamResponse}
                              onCheckedChange={(checked) =>
                                setSettings((prev) => ({ ...prev, streamResponse: checked }))
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">思考过程</label>
                              <p className="text-xs text-white/60">显示AI推理步骤</p>
                            </div>
                            <Switch
                              checked={settings.showThinking}
                              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showThinking: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">自动保存</label>
                              <p className="text-xs text-white/60">自动保存聊天记录</p>
                            </div>
                            <Switch
                              checked={settings.autoSave}
                              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSave: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">智能建议</label>
                              <p className="text-xs text-white/60">基于上下文推荐</p>
                            </div>
                            <Switch
                              checked={settings.smartSuggestions}
                              onCheckedChange={(checked) =>
                                setSettings((prev) => ({ ...prev, smartSuggestions: checked }))
                              }
                            />
                          </div>

                          <Separator className="bg-white/10" />

                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleExportChat}
                              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              导出对话
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleClearChat}
                              className="w-full bg-white/10 border-white/20 text-white hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              清空对话
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="interface" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-sm text-white/80">语言</label>
                            <Select
                              value={settings.language}
                              onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="zh-CN">中文</SelectItem>
                                <SelectItem value="en-US">English</SelectItem>
                                <SelectItem value="ja-JP">日本語</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">语音播放</label>
                              <p className="text-xs text-white/60">TTS语音朗读</p>
                            </div>
                            <Switch
                              checked={settings.voiceEnabled}
                              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, voiceEnabled: checked }))}
                            />
                          </div>

                          {settings.voiceEnabled && (
                            <div className="space-y-2">
                              <label className="text-sm text-white/80">语音速度 ({settings.voiceSpeed}x)</label>
                              <Slider
                                value={[settings.voiceSpeed]}
                                onValueChange={([value]) => setSettings((prev) => ({ ...prev, voiceSpeed: value }))}
                                max={2}
                                min={0.5}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <label className="text-sm text-white/80">桌面通知</label>
                              <p className="text-xs text-white/60">新消息提醒</p>
                            </div>
                            <Switch
                              checked={settings.notifications}
                              onCheckedChange={(checked) =>
                                setSettings((prev) => ({ ...prev, notifications: checked }))
                              }
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
