"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Enhanced3DIconProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  bgColor?: string
  variant?: "default" | "floating" | "pressed" | "glow"
  interactive?: boolean
  className?: string
  onClick?: () => void
}

export function Enhanced3DIcon({
  icon: Icon,
  size = "md",
  color = "text-blue-600",
  bgColor = "bg-blue-50",
  variant = "default",
  interactive = true,
  className,
  onClick,
}: Enhanced3DIconProps) {
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      shadow: "shadow-sm",
    },
    md: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      shadow: "shadow-md",
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-8 h-8",
      shadow: "shadow-lg",
    },
    xl: {
      container: "w-20 h-20",
      icon: "w-10 h-10",
      shadow: "shadow-xl",
    },
  }

  const config = sizeConfig[size]

  const variants = {
    default: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
    },
    floating: {
      scale: 1.05,
      rotateX: -5,
      rotateY: 5,
      boxShadow: "0 8px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
      background: "linear-gradient(145deg, #ffffff, #e8e8e8)",
    },
    pressed: {
      scale: 0.95,
      rotateX: 2,
      rotateY: -2,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.1)",
      background: "linear-gradient(145deg, #e8e8e8, #ffffff)",
    },
    glow: {
      scale: 1.1,
      rotateX: -10,
      rotateY: 10,
      boxShadow: "0 12px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 20px rgba(59,130,246,0.3)",
      background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    },
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-xl flex items-center justify-center cursor-pointer select-none",
        "border border-gray-200/50",
        config.container,
        config.shadow,
        interactive && "hover:shadow-lg active:shadow-sm",
        className,
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      variants={variants}
      initial="default"
      whileHover={interactive ? "floating" : "default"}
      whileTap={interactive ? "pressed" : "default"}
      animate={variant !== "default" ? variant : "default"}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
    >
      {/* 3D背景层 */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          transform: "translateZ(-2px)",
        }}
      />

      {/* 高光层 */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-60"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.05) 100%)",
          transform: "translateZ(1px)",
        }}
      />

      {/* 图标容器 */}
      <motion.div
        className={cn("relative z-10 flex items-center justify-center rounded-lg", bgColor, config.container)}
        style={{
          transform: "translateZ(4px)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
        }}
        animate={{
          background: interactive
            ? [
                "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(235,235,235,0.95))",
                "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
              ]
            : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
        }}
        transition={{
          duration: 2,
          repeat: interactive ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={
            interactive
              ? {
                  rotateY: [0, 5, -5, 0],
                  rotateX: [0, -2, 2, 0],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: interactive ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          <Icon className={cn(config.icon, color, "drop-shadow-sm")} />
        </motion.div>
      </motion.div>

      {/* 边缘高光 */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-white/30"
        style={{
          transform: "translateZ(2px)",
        }}
      />
    </motion.div>
  )
}
