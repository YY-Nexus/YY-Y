"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IntelligentRecommendationsProps {
  isVisible: boolean
  context: string | null
  onRecommendationClick: (action: string) => void
  onClose: () => void
}

export function IntelligentRecommendations({
  isVisible,
  context,
  onRecommendationClick,
  onClose,
}: IntelligentRecommendationsProps) {
  const getRecommendations = (context: string) => {
    switch (context) {
      case "image-creation":
        return ["生成图像", "编辑图片", "图像风格转换"]
      case "video-hub":
        return ["视频剪辑", "添加特效", "AI配音"]
      case "music-studio":
        return ["AI作曲", "音效处理", "节拍制作"]
      case "code-assistant":
        return ["代码生成", "错误检测", "代码优化"]
      default:
        return []
    }
  }

  return (
    <AnimatePresence>
      {isVisible && context && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-80"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">智能推荐</CardTitle>
              <Button size="sm" variant="ghost" onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {getRecommendations(context).map((action) => (
                <Button
                  key={action}
                  variant="ghost"
                  size="sm"
                  onClick={() => onRecommendationClick(action)}
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                >
                  {action}
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
