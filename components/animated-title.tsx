"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTitleProps {
  title: string
  subtitle?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "gradient" | "rainbow" | "neon" | "wave"
  className?: string
}

export function AnimatedTitle({ title, subtitle, size = "lg", variant = "rainbow", className }: AnimatedTitleProps) {
  const sizeConfig = {
    sm: {
      title: "text-2xl md:text-3xl",
      subtitle: "text-base",
    },
    md: {
      title: "text-3xl md:text-4xl",
      subtitle: "text-lg",
    },
    lg: {
      title: "text-4xl md:text-6xl",
      subtitle: "text-xl",
    },
    xl: {
      title: "text-5xl md:text-7xl",
      subtitle: "text-2xl",
    },
  }

  const config = sizeConfig[size]

  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return {
          backgroundImage: "linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899)",
          backgroundSize: "200% 200%",
        }
      case "rainbow":
        return {
          backgroundImage: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #98D8C8)",
          backgroundSize: "400% 400%",
        }
      case "neon":
        return {
          backgroundImage: "linear-gradient(45deg, #00F5FF, #FF1493, #00FF00, #FFD700)",
          backgroundSize: "300% 300%",
        }
      case "wave":
        return {
          backgroundImage: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)",
          backgroundSize: "600% 600%",
        }
      default:
        return {
          backgroundImage: "linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899)",
          backgroundSize: "200% 200%",
        }
    }
  }

  const variantStyles = getVariantStyles()

  const getAnimationPattern = () => {
    switch (variant) {
      case "gradient":
        return {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }
      case "rainbow":
        return {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }
      case "neon":
        return {
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          filter: ["brightness(1) saturate(1)", "brightness(1.2) saturate(1.3)", "brightness(1) saturate(1)"],
        }
      case "wave":
        return {
          backgroundPosition: ["0% 50%", "50% 100%", "100% 50%", "50% 0%", "0% 50%"],
        }
      default:
        return {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }
    }
  }

  const animationPattern = getAnimationPattern()

  // 将标题分割成字符以实现逐字动画
  const titleChars = title.split("")

  return (
    <div className={cn("text-center", className)}>
      {/* 主标题 */}
      <motion.h1
        className={cn("font-bold leading-tight mb-4 drop-shadow-lg", config.title)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* 英文部分 - 彩色旋转动画 */}
        <motion.span
          className="inline-block bg-gradient-to-r bg-clip-text text-transparent"
          style={variantStyles}
          animate={animationPattern}
          transition={{
            duration: variant === "wave" ? 5 : 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {titleChars.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.1,
                rotateY: 15,
                transition: { duration: 0.2 },
              }}
              style={{
                transformOrigin: "center",
                display: "inline-block",
                transformStyle: "preserve-3d",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>

        {/* 3D旋转效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            rotateX: [0, 5, -5, 0],
            rotateY: [0, 2, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        />
      </motion.h1>

      {/* 副标题 */}
      {subtitle && (
        <motion.p
          className={cn("text-white/90 mb-8 max-w-2xl mx-auto drop-shadow", config.subtitle)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.span
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {subtitle}
          </motion.span>
        </motion.p>
      )}

      {/* 装饰性光效 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundImage: [
            "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
