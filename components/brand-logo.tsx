"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  interactive?: boolean
  onClick?: () => void
  className?: string
  variant?: "default" | "white" | "minimal"
}

export function BrandLogo({
  size = "md",
  showText = true,
  interactive = true,
  onClick,
  className,
  variant = "default",
}: BrandLogoProps) {
  const sizeConfig = {
    sm: {
      logo: "w-8 h-8",
      text: "text-sm",
      container: "gap-2",
    },
    md: {
      logo: "w-10 h-10",
      text: "text-lg",
      container: "gap-3",
    },
    lg: {
      logo: "w-12 h-12",
      text: "text-xl",
      container: "gap-3",
    },
    xl: {
      logo: "w-16 h-16",
      text: "text-2xl",
      container: "gap-4",
    },
  }

  const config = sizeConfig[size]

  const textVariants = {
    default: "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent",
    white: "text-white drop-shadow-lg",
    minimal: "text-gray-800",
  }

  return (
    <motion.div
      className={cn(
        "flex items-center cursor-pointer select-none",
        config.container,
        interactive && "hover:scale-105 active:scale-95",
        className,
      )}
      onClick={onClick}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* 新的言语云LOGO */}
      <motion.div
        className={cn("relative", config.logo)}
        animate={
          interactive
            ? {
                rotateY: [0, 8, -8, 0],
                rotateX: [0, -4, 4, 0],
                rotateZ: [0, 1, -1, 0],
              }
            : {}
        }
        transition={{
          duration: 6,
          repeat: interactive ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.img
          src="/yanyu-cloud-logo.png"
          alt="言语云 YanYu Cloud Logo"
          className={cn("w-full h-full object-contain drop-shadow-lg", config.logo)}
          animate={
            interactive
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: interactive ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        />

        {/* 3D深度阴影效果 */}
        {interactive && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                "0 4px 20px rgba(59, 130, 246, 0.2), 0 8px 40px rgba(59, 130, 246, 0.1)",
                "0 8px 30px rgba(59, 130, 246, 0.3), 0 12px 50px rgba(59, 130, 246, 0.15)",
                "0 4px 20px rgba(59, 130, 246, 0.2), 0 8px 40px rgba(59, 130, 246, 0.1)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}

        {/* 微妙的光晕效果 */}
        {interactive && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-30"
            animate={{
              backgroundImage: [
                "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                "radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* 品牌文字 */}
      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className={cn("font-bold leading-tight", config.text, textVariants[variant])}
            animate={
              interactive
                ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: interactive ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            言语云³
          </motion.h1>
          <p
            className={cn(
              "text-xs leading-tight",
              variant === "white" ? "text-white/80" : "text-gray-600",
              size === "sm" ? "hidden" : "block",
            )}
          >
            YanYu Cloud³
          </p>
        </div>
      )}
    </motion.div>
  )
}
