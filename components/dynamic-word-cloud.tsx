"use client"

import { motion, AnimatePresence } from "framer-motion"

interface DynamicWordCloudProps {
  isVisible: boolean
  keywords: string[]
  onKeywordClick: (keyword: string) => void
}

export function DynamicWordCloud({ isVisible, keywords, onKeywordClick }: DynamicWordCloudProps) {
  return (
    <AnimatePresence>
      {isVisible && keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {keywords.map((keyword, index) => (
              <motion.button
                key={keyword}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onKeywordClick(keyword)}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm hover:bg-white/20 transition-colors pointer-events-auto"
              >
                {keyword}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
