"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedLogoHeroProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero"
  interactive?: boolean
  className?: string
  variant?: "default" | "floating" | "spotlight"
}

export function AnimatedLogoHero({
  size = "hero",
  interactive = true,
  className,
  variant = "default",
}: AnimatedLogoHeroProps) {
  const sizeConfig = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
    hero: "w-64 h-64 md:w-80 md:h-80",
  }

  const logoSize = sizeConfig[size]

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* 主Logo容器 */}
      <motion.div
        className={cn("relative", logoSize)}
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* 背景光环效果 */}
        {variant !== "minimal" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              ],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}

        {/* CloudCube Logo主体 */}
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={
            interactive
              ? {
                  rotateY: [0, 10, -10, 0],
                  rotateX: [0, -5, 5, 0],
                  rotateZ: [0, 2, -2, 0],
                }
              : {}
          }
          transition={{
            duration: 8,
            repeat: interactive ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src="/cloudcube-new-logo.png"
            alt="CloudCube Logo"
            className="w-full h-full object-contain drop-shadow-2xl"
            animate={
              interactive
                ? {
                    scale: [1, 1.02, 1],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: interactive ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* 3D立体阴影层 */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            transform: "translateZ(-10px) translateX(8px) translateY(8px)",
            filter: "blur(8px)",
            opacity: 0.3,
          }}
          animate={
            interactive
              ? {
                  opacity: [0.2, 0.4, 0.2],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: interactive ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          <img
            src="/cloudcube-new-logo.png"
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter: "brightness(0.3) saturate(0)",
            }}
          />
        </motion.div>

        {/* 聚光灯效果 */}
        {variant === "spotlight" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(59, 130, 246, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 120deg at 50% 50%, transparent 0deg, rgba(59, 130, 246, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 240deg at 50% 50%, transparent 0deg, rgba(59, 130, 246, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 360deg at 50% 50%, transparent 0deg, rgba(59, 130, 246, 0.1) 60deg, transparent 120deg)",
              ],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )}

        {/* 浮动效果 */}
        {variant === "floating" && (
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}

        {/* 边缘高光 */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: [
              "0 0 30px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              "0 0 50px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              "0 0 30px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* 装饰性粒子 */}
      {interactive && variant !== "minimal" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
              style={{
                left: `${20 + Math.cos(i * 1.047) * 40}%`,
                top: `${20 + Math.sin(i * 1.047) * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
