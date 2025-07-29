"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Enhanced3DLogoProps {
  isActive: boolean
  isIdle: boolean
  onClick: () => void
  size: "sm" | "hero"
}

export function Enhanced3DLogo({ isActive, isIdle, onClick, size }: Enhanced3DLogoProps) {
  return (
    <motion.div
      className={cn("relative cursor-pointer select-none", size === "hero" ? "w-32 h-32" : "w-12 h-12")}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 外层光环 */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60",
          size === "hero" ? "blur-sm" : "blur-[2px]",
        )}
        animate={{
          rotate: 360,
          scale: isIdle ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      />

      {/* 中层渐变 */}
      <motion.div
        className={cn(
          "absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 shadow-2xl",
          size === "hero" ? "inset-2" : "inset-1",
        )}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* 内核 */}
      <div
        className={cn(
          "absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/30",
          size === "hero" ? "inset-4" : "inset-2",
        )}
      >
        <span className={cn("font-bold text-white drop-shadow-lg", size === "hero" ? "text-2xl" : "text-xs")}>YC³</span>
      </div>

      {/* 粒子效果 */}
      {size === "hero" && (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-80"
              animate={{
                x: [0, Math.cos((i * 60 * Math.PI) / 180) * 60],
                y: [0, Math.sin((i * 60 * Math.PI) / 180) * 60],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}
