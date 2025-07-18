"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Zap } from "lucide-react"

interface DynamicWordCloudProps {
  isVisible: boolean
  keywords: string[]
  onKeywordClick: (keyword: string) => void
}

interface CloudWord {
  text: string
  size: number
  color: string
  x: number
  y: number
  category: string
  popularity: number
}

export function DynamicWordCloud({ isVisible, keywords, onKeywordClick }: DynamicWordCloudProps) {
  const [cloudWords, setCloudWords] = useState<CloudWord[]>([])
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)

  // 预定义的热门关键词
  const trendingWords = [
    { text: "AI绘画", category: "创作", popularity: 95 },
    { text: "智能对话", category: "交互", popularity: 88 },
    { text: "视频剪辑", category: "创作", popularity: 82 },
    { text: "音乐生成", category: "创作", popularity: 76 },
    { text: "代码助手", category: "开发", popularity: 90 },
    { text: "图像处理", category: "创作", popularity: 85 },
    { text: "语音识别", category: "交互", popularity: 78 },
    { text: "文本生成", category: "创作", popularity: 80 },
    { text: "智能分析", category: "分析", popularity: 72 },
    { text: "自动化", category: "效率", popularity: 68 },
    { text: "机器学习", category: "技术", popularity: 92 },
    { text: "深度学习", category: "技术", popularity: 89 },
    { text: "神经网络", category: "技术", popularity: 86 },
    { text: "自然语言", category: "技术", popularity: 83 },
    { text: "计算机视觉", category: "技术", popularity: 81 },
  ]

  // 颜色映射
  const categoryColors = {
    创作: "from-pink-400 to-rose-500",
    交互: "from-blue-400 to-cyan-500",
    开发: "from-green-400 to-emerald-500",
    分析: "from-purple-400 to-violet-500",
    效率: "from-orange-400 to-amber-500",
    技术: "from-indigo-400 to-blue-500",
  }

  // 生成词云数据
  useEffect(() => {
    if (!isVisible) return

    const allWords = [...keywords, ...trendingWords.map((w) => w.text)]
    const uniqueWords = Array.from(new Set(allWords))

    const newCloudWords: CloudWord[] = uniqueWords.map((word, index) => {
      const trendingWord = trendingWords.find((tw) => tw.text === word)
      const isKeyword = keywords.includes(word)

      return {
        text: word,
        size: isKeyword ? 1.2 : (trendingWord?.popularity || 50) / 100,
        color: trendingWord
          ? categoryColors[trendingWord.category as keyof typeof categoryColors]
          : "from-gray-400 to-gray-500",
        x: Math.random() * 80 + 10, // 10% - 90%
        y: Math.random() * 80 + 10, // 10% - 90%
        category: trendingWord?.category || "其他",
        popularity: trendingWord?.popularity || (isKeyword ? 100 : 50),
      }
    })

    setCloudWords(newCloudWords)
  }, [isVisible, keywords])

  // 重新排列词云
  const reshuffleCloud = () => {
    setCloudWords((prev) =>
      prev.map((word) => ({
        ...word,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      })),
    )
  }

  return (
    <AnimatePresence>
      {isVisible && cloudWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-30 pointer-events-none"
        >
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* 词云容器 */}
          <div className="relative w-full h-full overflow-hidden">
            {cloudWords.map((word, index) => (
              <motion.div
                key={`${word.text}-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: `${word.x}vw`,
                  y: `${word.y}vh`,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                className="absolute pointer-events-auto"
                style={{
                  fontSize: `${0.8 + word.size * 0.8}rem`,
                  transform: `translate(-50%, -50%)`,
                }}
                onMouseEnter={() => setHoveredWord(word.text)}
                onMouseLeave={() => setHoveredWord(null)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onKeywordClick(word.text)}
                  className={`
                    bg-gradient-to-r ${word.color} text-white font-medium
                    hover:scale-110 transition-all duration-200
                    shadow-lg hover:shadow-xl backdrop-blur-sm
                    border border-white/20 hover:border-white/40
                    ${hoveredWord === word.text ? "scale-110 shadow-xl" : ""}
                  `}
                >
                  {word.text}
                  {word.popularity > 85 && <TrendingUp className="w-3 h-3 ml-1" />}
                </Button>

                {/* 悬浮信息 */}
                <AnimatePresence>
                  {hoveredWord === word.text && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                    >
                      <div className="bg-purple-900/90 backdrop-blur-xl border border-purple-500/30 rounded-lg p-2 shadow-xl">
                        <div className="flex items-center gap-2 text-xs text-white">
                          <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                            {word.category}
                          </Badge>
                          <span className="text-white/60">热度: {word.popularity}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* 控制面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-purple-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">智能词云</span>
                </div>

                <Button
                  size="sm"
                  onClick={reshuffleCloud}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  重新排列
                </Button>

                <div className="text-xs text-white/60">点击关键词快速输入</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
