"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  Send,
  Star,
  Bug,
  Lightbulb,
  Heart,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react"

interface FeedbackItem {
  id: string
  type: "bug" | "suggestion" | "compliment" | "question" | "other"
  title: string
  content: string
  rating?: number
  email?: string
  name?: string
  timestamp: Date
  status: "submitted" | "processing" | "resolved"
  priority: "low" | "medium" | "high"
}

interface ContactInfo {
  name: string
  email: string
  phone?: string
  company?: string
}

export function FeedbackModule() {
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [rating, setRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    email: "",
    name: "",
    allowContact: false,
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([])

  const feedbackTypes = [
    {
      id: "bug",
      label: "问题报告",
      description: "报告系统错误或功能异常",
      icon: Bug,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "suggestion",
      label: "功能建议",
      description: "提出新功能或改进建议",
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "compliment",
      label: "表扬反馈",
      description: "分享您的满意体验",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      id: "question",
      label: "使用咨询",
      description: "询问使用方法或技术问题",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "other",
      label: "其他反馈",
      description: "其他类型的意见或建议",
      icon: MessageSquare,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ]

  const handleSubmitFeedback = async () => {
    if (!feedbackType || !formData.title.trim() || !formData.content.trim()) {
      return
    }

    if (feedbackType === "compliment" && rating === 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // 提交到后端API
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: feedbackType,
          title: formData.title,
          content: formData.content,
          rating: feedbackType === "compliment" ? rating : undefined,
          email: formData.email || undefined,
          name: formData.name || undefined,
          allowContact: formData.allowContact,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // 创建本地记录
        const newFeedback: FeedbackItem = {
          id: result.feedbackId || `feedback_${Date.now()}`,
          type: feedbackType as any,
          title: formData.title,
          content: formData.content,
          rating: feedbackType === "compliment" ? rating : undefined,
          email: formData.email || undefined,
          name: formData.name || undefined,
          timestamp: new Date(),
          status: "submitted",
          priority: feedbackType === "bug" ? "high" : "medium",
        }

        setFeedbackHistory((prev) => [newFeedback, ...prev])
        setSubmitSuccess(true)

        // 重置表单
        setFormData({
          title: "",
          content: "",
          email: "",
          name: "",
          allowContact: false,
        })
        setFeedbackType("")
        setRating(0)

        // 3秒后隐藏成功提示
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError(result.error || "提交失败，请稍后重试")
      }
    } catch (error) {
      console.error("提交反馈失败:", error)
      setSubmitError("网络错误，请检查网络连接后重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async () => {
    if (!contactInfo.name.trim() || !contactInfo.email.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          title: "用户联系请求",
          content: `用户请求主动联系\n公司: ${contactInfo.company || "未提供"}\n电话: ${contactInfo.phone || "未提供"}`,
          email: contactInfo.email,
          name: contactInfo.name,
          allowContact: true,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitSuccess(true)
        setContactInfo({ name: "", email: "", phone: "", company: "" })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError(result.error || "提交失败，请稍后重试")
      }
    } catch (error) {
      console.error("联系信息提交失败:", error)
      setSubmitError("网络错误，请检查网络连接后重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const getTypeInfo = (type: string) => {
    return feedbackTypes.find((t) => t.id === type)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            已提交
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            处理中
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            已解决
          </Badge>
        )
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">高优先级</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">中优先级</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">低优先级</Badge>
      default:
        return <Badge variant="secondary">普通</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">沟通反馈</h2>
        <p className="text-muted-foreground">我们重视您的每一个意见和建议</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feedback">提交反馈</TabsTrigger>
          <TabsTrigger value="contact">联系我们</TabsTrigger>
          <TabsTrigger value="history">反馈记录</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          {/* 成功提示 */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    感谢您的反馈！我们已收到您的意见并发送到我们的邮箱，将尽快处理并回复。
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 错误提示 */}
          <AnimatePresence>
            {submitError && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-700">{submitError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 反馈类型选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                选择反馈类型
              </CardTitle>
              <CardDescription>请选择最符合您反馈内容的类型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbackTypes.map((type) => (
                  <motion.div key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        feedbackType === type.id
                          ? `border-2 border-blue-500 ${type.bgColor}`
                          : "border hover:border-gray-300"
                      }`}
                      onClick={() => setFeedbackType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${type.bgColor}`}>
                            <type.icon className={`w-5 h-5 ${type.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{type.label}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                          {feedbackType === type.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 反馈表单 */}
          {feedbackType && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const typeInfo = getTypeInfo(feedbackType)
                      return (
                        <>
                          {typeInfo && <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />}
                          {typeInfo?.label}
                        </>
                      )
                    })()}
                  </CardTitle>
                  <CardDescription>请详细描述您的反馈内容，我们会通过邮件收到您的反馈</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 评分（仅表扬反馈显示） */}
                  {feedbackType === "compliment" && (
                    <div>
                      <Label className="text-base font-medium">整体评分 *</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </motion.button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {rating === 5 && "非常满意"}
                            {rating === 4 && "满意"}
                            {rating === 3 && "一般"}
                            {rating === 2 && "不满意"}
                            {rating === 1 && "非常不满意"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 标题 */}
                  <div>
                    <Label htmlFor="title">反馈标题 *</Label>
                    <Input
                      id="title"
                      placeholder="请简要概括您的反馈内容"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  {/* 详细内容 */}
                  <div>
                    <Label htmlFor="content">详细描述 *</Label>
                    <Textarea
                      id="content"
                      placeholder="请详细描述您的反馈内容，包括具体情况、期望结果等"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="mt-1 min-h-[120px]"
                    />
                  </div>

                  {/* 联系信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        placeholder="您的姓名（可选）"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="您的邮箱（可选，用于回复）"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* 联系授权 */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowContact"
                      checked={formData.allowContact}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowContact: checked as boolean })}
                    />
                    <Label htmlFor="allowContact" className="text-sm">
                      我同意接收关于此反馈的后续沟通
                    </Label>
                  </div>

                  {/* 隐私说明 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📧 反馈处理说明</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 您的反馈将通过安全邮件系统发送给我们的技术团队</li>
                      <li>• 我们承诺在24小时内查看并回复重要问题</li>
                      <li>• 如果您提供了邮箱，我们会直接回复您的邮件</li>
                      <li>• 所有反馈信息都会被妥善保护，不会泄露给第三方</li>
                    </ul>
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={
                        isSubmitting ||
                        !formData.title.trim() ||
                        !formData.content.trim() ||
                        (feedbackType === "compliment" && rating === 0)
                      }
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          发送中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          发送反馈
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFeedbackType("")
                        setFormData({
                          title: "",
                          content: "",
                          email: "",
                          name: "",
                          allowContact: false,
                        })
                        setRating(0)
                        setSubmitError("")
                      }}
                      disabled={isSubmitting}
                    >
                      重置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 联系方式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  联系方式
                </CardTitle>
                <CardDescription>多种方式与我们取得联系</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">邮箱支持</div>
                    <div className="text-sm text-muted-foreground">通过反馈表单发送邮件给我们</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">电话支持</div>
                    <div className="text-sm text-muted-foreground">+86-400-123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">在线客服</div>
                    <div className="text-sm text-muted-foreground">工作日 9:00-18:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快速联系表单 */}
            <Card>
              <CardHeader>
                <CardTitle>快速联系</CardTitle>
                <CardDescription>留下您的联系方式，我们将主动联系您</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">姓名 *</Label>
                  <Input
                    id="contact-name"
                    placeholder="您的姓名"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">邮箱 *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="您的邮箱"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">电话</Label>
                  <Input
                    id="contact-phone"
                    placeholder="您的电话（可选）"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-company">公司</Label>
                  <Input
                    id="contact-company"
                    placeholder="您的公司（可选）"
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleContactSubmit}
                  disabled={isSubmitting || !contactInfo.name.trim() || !contactInfo.email.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      提交联系信息
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 常见问题 */}
          <Card>
            <CardHeader>
              <CardTitle>常见问题</CardTitle>
              <CardDescription>查看常见问题的解答</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: "如何获得更准确的测速结果？",
                    answer: "建议在测速前关闭其他网络应用，使用有线连接，并选择距离较近的测试服务器。",
                  },
                  {
                    question: "测速数据是否会被保存？",
                    answer: "测速结果主要保存在您的本地浏览器中，我们仅收集匿名化的统计数据用于服务改进。",
                  },
                  {
                    question: "如何联系技术支持？",
                    answer: "您可以通过反馈表单、电话或在线客服联系我们，我们将在24小时内回复您的问题。",
                  },
                  {
                    question: "反馈会如何处理？",
                    answer: "您的反馈会通过安全邮件系统发送给我们的技术团队，我们承诺及时查看并回复。",
                  },
                ].map((faq, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {feedbackHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">暂无反馈记录</h3>
                <p className="text-muted-foreground">您还没有提交过任何反馈</p>
                <Button className="mt-4" onClick={() => setActiveTab("feedback")}>
                  提交第一个反馈
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbackHistory.map((feedback) => {
                const typeInfo = getTypeInfo(feedback.type)
                return (
                  <Card key={feedback.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {typeInfo && (
                            <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                              <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">{feedback.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{typeInfo?.label}</Badge>
                              {getStatusBadge(feedback.status)}
                              {getPriorityBadge(feedback.priority)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {feedback.timestamp.toLocaleString()}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{feedback.content}</p>

                      {feedback.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium">评分:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= feedback.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          {feedback.name && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {feedback.name}
                            </span>
                          )}
                          {feedback.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {feedback.email}
                            </span>
                          )}
                        </div>
                        <span>#{feedback.id.slice(-8)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
