"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaticTechBackgroundProps {
  className?: string
  children?: React.ReactNode
  variant?: "default" | "overlay" | "minimal"
}

export function StaticTechBackground({ className, children, variant = "default" }: StaticTechBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* 主背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/backgrounds/tech-network-bg.jpg)`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* 动态覆盖层 - 根据变体调整 */}
      {variant === "default" && (
        <>
          {/* 深度渐变叠加 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg,
                  rgba(30, 58, 138, 0.3) 0%,
                  rgba(37, 99, 235, 0.2) 50%,
                  rgba(29, 78, 216, 0.3) 100%
                )
              `,
            }}
            animate={{
              background: [
                "linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(29, 78, 216, 0.3) 100%)",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(37, 99, 235, 0.2) 100%)",
                "linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(29, 78, 216, 0.3) 100%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* 动态光晕效果 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* 网格动画效果 */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
            animate={{
              x: [0, 60, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* 流动光线效果 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(45deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.03) 25%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.03) 75%,
                  transparent 100%
                )
              `,
              backgroundSize: "200px 200px",
            }}
            animate={{
              x: [-200, 200],
              y: [-200, 200],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </>
      )}

      {variant === "overlay" && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(0, 0, 0, 0.4) 0%,
                rgba(30, 58, 138, 0.3) 50%,
                rgba(0, 0, 0, 0.4) 100%
              )
            `,
          }}
        />
      )}

      {variant === "minimal" && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
          }}
        />
      )}

      {/* 边缘渐变遮罩 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center,
              transparent 0%,
              transparent 70%,
              rgba(0, 0, 0, 0.1) 100%
            )
          `,
        }}
      />

      {/* 内容层 */}
      <div className="relative z-10">{children}</div>

      {/* 背景控制指示器 */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <motion.div
          className="w-2 h-2 bg-white/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-400/50 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
    </div>
  )
}
