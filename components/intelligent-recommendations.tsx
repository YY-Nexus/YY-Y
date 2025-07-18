"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, Zap, ImageIcon, Video, Music, Code, Brain, TrendingUp, Clock, Star } from "lucide-react"

interface IntelligentRecommendationsProps {
  isVisible: boolean
  context: string | null
  onRecommendationClick: (action: string) => void
  onClose: () => void
}

interface Recommendation {
  id: string
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  priority: "high" | "medium" | "low"
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
}

export function IntelligentRecommendations({
  isVisible,
  context,
  onRecommendationClick,
  onClose,
}: IntelligentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // 根据上下文生成推荐
  useEffect(() => {
    if (!context) return

    const contextRecommendations: Record<string, Recommendation[]> = {
      "image-creation": [
        {
          id: "1",
          title: "创建艺术肖像",
          description: "使用AI生成高质量的人物肖像画",
          action: "create_portrait",
          icon: ImageIcon,
          category: "创作",
          priority: "high",
          estimatedTime: "2-3分钟",
          difficulty: "easy",
        },
        {
          id: "2",
          title: "风景画生成",
          description: "创作美丽的自然风景或城市景观",
          action: "create_landscape",
          icon: ImageIcon,
          category: "创作",
          priority: "high",
          estimatedTime: "1-2分钟",
          difficulty: "easy",
        },
        {
          id: "3",
          title: "抽象艺术创作",
          description: "探索抽象艺术风格，创造独特的视觉效果",
          action: "create_abstract",
          icon: ImageIcon,
          category: "创作",
          priority: "medium",
          estimatedTime: "3-5分钟",
          difficulty: "medium",
        },
        {
          id: "4",
          title: "图像风格转换",
          description: "将现有图像转换为不同的艺术风格",
          action: "style_transfer",
          icon: Zap,
          category: "处理",
          priority: "medium",
          estimatedTime: "2-4分钟",
          difficulty: "medium",
        },
      ],
      "video-hub": [
        {
          id: "5",
          title: "智能视频剪辑",
          description: "自动识别精彩片段并进行智能剪辑",
          action: "smart_edit",
          icon: Video,
          category: "编辑",
          priority: "high",
          estimatedTime: "5-10分钟",
          difficulty: "easy",
        },
        {
          id: "6",
          title: "添加字幕",
          description: "自动生成和同步视频字幕",
          action: "add_subtitles",
          icon: Video,
          category: "编辑",
          priority: "high",
          estimatedTime: "3-5分钟",
          difficulty: "easy",
        },
        {
          id: "7",
          title: "视频特效",
          description: "添加专业级视频特效和转场",
          action: "add_effects",
          icon: Zap,
          category: "特效",
          priority: "medium",
          estimatedTime: "10-15分钟",
          difficulty: "hard",
        },
      ],
      "music-studio": [
        {
          id: "8",
          title: "AI作曲",
          description: "根据情绪和风格创作原创音乐",
          action: "compose_music",
          icon: Music,
          category: "创作",
          priority: "high",
          estimatedTime: "3-5分钟",
          difficulty: "easy",
        },
        {
          id: "9",
          title: "节拍制作",
          description: "创建各种风格的音乐节拍",
          action: "create_beat",
          icon: Music,
          category: "创作",
          priority: "medium",
          estimatedTime: "2-3分钟",
          difficulty: "medium",
        },
      ],
      "code-assistant": [
        {
          id: "10",
          title: "代码生成",
          description: "根据需求自动生成代码片段",
          action: "generate_code",
          icon: Code,
          category: "开发",
          priority: "high",
          estimatedTime: "1-2分钟",
          difficulty: "easy",
        },
        {
          id: "11",
          title: "代码优化",
          description: "分析并优化现有代码性能",
          action: "optimize_code",
          icon: TrendingUp,
          category: "优化",
          priority: "medium",
          estimatedTime: "3-5分钟",
          difficulty: "medium",
        },
      ],
      "ai-engine": [
        {
          id: "12",
          title: "模型对比",
          description: "比较不同AI模型的性能和特点",
          action: "compare_models",
          icon: Brain,
          category: "分析",
          priority: "high",
          estimatedTime: "2-3分钟",
          difficulty: "medium",
        },
      ],
    }

    setRecommendations(contextRecommendations[context] || [])
  }, [context])

  // 获取所有类别
  const categories = ["all", ...Array.from(new Set(recommendations.map((r) => r.category)))]

  // 过滤推荐
  const filteredRecommendations =
    selectedCategory === "all" ? recommendations : recommendations.filter((r) => r.category === selectedCategory)

  // 优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  // 难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-400/20 text-green-200"
      case "medium":
        return "bg-yellow-400/20 text-yellow-200"
      case "hard":
        return "bg-red-400/20 text-red-200"
      default:
        return "bg-gray-400/20 text-gray-200"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[80vh] bg-purple-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">智能推荐</h2>
                  <p className="text-white/60 text-sm">基于当前上下文的个性化建议</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-purple-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 类别筛选 */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      selectedCategory === category
                        ? "bg-purple-500/30 border-purple-400/50 text-white"
                        : "border-purple-400/30 text-white/70 hover:bg-purple-500/20"
                    }`}
                  >
                    {category === "all" ? "全部" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* 推荐列表 */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecommendations.map((rec, index) => {
                  const IconComponent = rec.icon
                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-purple-800/30 border-purple-400/30 hover:bg-purple-700/40 hover:border-purple-300/40 transition-all duration-200 cursor-pointer group">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white flex items-center gap-3 text-base">
                            <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span>{rec.title}</span>
                                <Star className={`w-3 h-3 ${getPriorityColor(rec.priority)}`} />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="bg-purple-600/30 border-purple-400/30 text-white/80 text-xs"
                                >
                                  {rec.category}
                                </Badge>
                                <Badge className={`text-xs ${getDifficultyColor(rec.difficulty)}`}>
                                  {rec.difficulty === "easy" ? "简单" : rec.difficulty === "medium" ? "中等" : "困难"}
                                </Badge>
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-white/70 text-sm mb-3 leading-relaxed">{rec.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <Clock className="w-3 h-3" />
                              <span>{rec.estimatedTime}</span>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => onRecommendationClick(rec.action)}
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              开始
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {filteredRecommendations.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无相关推荐</p>
                  <p className="text-sm mt-1">尝试切换其他类别或开始新的对话</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
