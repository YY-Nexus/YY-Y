"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Enhanced3DIcon } from "@/components/enhanced-3d-icon"
import type { LucideIcon } from "lucide-react"

interface ModuleCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  featured?: boolean
  onClick: () => void
  className?: string
}

export function ModuleCard({
  id,
  title,
  description,
  icon,
  color,
  bgColor,
  borderColor,
  featured = false,
  onClick,
  className,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group ${className}`}
    >
      <Card
        className={`cursor-pointer transition-all duration-500 h-full relative overflow-hidden
          ${
            featured
              ? "bg-gradient-to-br from-white/45 via-white/35 to-white/25"
              : "bg-gradient-to-br from-white/35 via-white/28 to-white/20"
          }
          backdrop-blur-xl border-2 
          ${
            featured
              ? "border-gradient-to-br from-cyan-300/60 via-blue-300/50 to-purple-300/40"
              : "border-gradient-to-br from-pink-300/50 via-orange-300/40 to-yellow-300/30"
          }
          shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_20px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.5)]
          hover:shadow-[0_25px_70px_rgba(0,0,0,0.2),0_10px_40px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.6)]
          hover:border-opacity-80
          before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:pointer-events-none
          after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/8 after:to-transparent after:pointer-events-none
          min-h-[280px] flex flex-col
        `}
        style={{
          borderImage: featured
            ? "linear-gradient(135deg, rgba(34, 211, 238, 0.6), rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.4)) 1"
            : "linear-gradient(135deg, rgba(236, 72, 153, 0.5), rgba(251, 146, 60, 0.4), rgba(250, 204, 21, 0.3)) 1",
        }}
        onClick={onClick}
      >
        {/* 青春活力背景图案 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 几何图案背景 */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(250, 204, 21, 0.2) 0%, transparent 50%)
              `,
            }}
          />

          {/* 动态波纹效果 */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundImage: [
                "conic-gradient(from 0deg at 30% 30%, transparent 0deg, rgba(34, 211, 238, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 120deg at 70% 70%, transparent 0deg, rgba(236, 72, 153, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 240deg at 50% 50%, transparent 0deg, rgba(250, 204, 21, 0.1) 60deg, transparent 120deg)",
                "conic-gradient(from 360deg at 30% 30%, transparent 0deg, rgba(34, 211, 238, 0.1) 60deg, transparent 120deg)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* 网格图案 */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* 装饰性圆点 */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(45deg, 
                  ${
                    i % 3 === 0
                      ? "rgba(34, 211, 238, 0.4)"
                      : i % 3 === 1
                        ? "rgba(236, 72, 153, 0.4)"
                        : "rgba(250, 204, 21, 0.4)"
                  }
                )`,
                left: `${15 + i * 15}%`,
                top: `${10 + i * 12}%`,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* 立体边框效果 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 顶部彩虹高光 */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-60"
            style={{
              background: featured
                ? "linear-gradient(90deg, rgba(34, 211, 238, 0.8), rgba(59, 130, 246, 0.7), rgba(147, 51, 234, 0.6))"
                : "linear-gradient(90deg, rgba(236, 72, 153, 0.7), rgba(251, 146, 60, 0.6), rgba(250, 204, 21, 0.5))",
            }}
          />

          {/* 左侧彩虹高光 */}
          <div
            className="absolute top-0 left-0 bottom-0 w-1 opacity-50"
            style={{
              background: featured
                ? "linear-gradient(180deg, rgba(34, 211, 238, 0.6), rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.4))"
                : "linear-gradient(180deg, rgba(236, 72, 153, 0.5), rgba(251, 146, 60, 0.4), rgba(250, 204, 21, 0.3))",
            }}
          />

          {/* 右下角阴影增强 */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 opacity-20"
            style={{
              background: "radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <CardHeader className="pb-4 relative z-10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <Enhanced3DIcon
              icon={icon}
              size={featured ? "lg" : "md"}
              color={color}
              bgColor={bgColor}
              interactive={true}
              onClick={onClick}
            />
            <Badge
              variant="outline"
              className={`transition-all duration-300 backdrop-blur-sm border-2
                ${
                  featured
                    ? "bg-gradient-to-r from-cyan-400/30 to-blue-400/25 text-cyan-100 border-cyan-300/60 shadow-lg"
                    : "bg-gradient-to-r from-pink-400/25 to-orange-400/20 text-pink-100 border-pink-300/50 shadow-md"
                }
                group-hover:scale-105 group-hover:shadow-xl
                group-hover:border-opacity-80
              `}
            >
              {featured ? "核心功能" : "辅助工具"}
            </Badge>
          </div>

          <div className="space-y-3">
            <CardTitle
              className={`${featured ? "text-xl" : "text-lg"} font-bold drop-shadow-lg
                ${
                  featured
                    ? "bg-gradient-to-r from-cyan-700 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                }
                group-hover:from-cyan-600 group-hover:via-blue-500 group-hover:to-purple-500 
                transition-all duration-300 leading-tight min-h-[1.5em] flex items-center
              `}
            >
              {title}
            </CardTitle>

            <CardDescription
              className={`${featured ? "text-base" : "text-sm"} drop-shadow-sm
                ${
                  featured
                    ? "text-blue-700/90 group-hover:text-blue-600"
                    : "text-purple-600/90 group-hover:text-purple-500"
                }
                transition-colors duration-300 leading-relaxed min-h-[3em] flex items-start
              `}
            >
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 flex-grow flex items-end pt-0">
          <Button
            className={`w-full transition-all duration-300 font-semibold border-2
              ${
                featured
                  ? `bg-gradient-to-r from-cyan-500/80 to-blue-500/70 text-white border-cyan-400/60
                   hover:from-cyan-400 hover:to-blue-400 hover:border-cyan-300
                   shadow-[0_6px_20px_rgba(34,211,238,0.4),inset_0_2px_0_rgba(255,255,255,0.3)]
                   hover:shadow-[0_10px_30px_rgba(34,211,238,0.5),inset_0_2px_0_rgba(255,255,255,0.5)]`
                  : `bg-gradient-to-r from-pink-500/70 to-orange-500/60 text-white border-pink-400/50
                   hover:from-pink-400/80 hover:to-orange-400/70 hover:border-pink-300/60
                   shadow-[0_4px_16px_rgba(236,72,153,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
                   hover:shadow-[0_8px_24px_rgba(236,72,153,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]`
              }
              backdrop-blur-sm hover:backdrop-blur-md
              hover:scale-105 active:scale-95
              relative overflow-hidden
            `}
            size={featured ? "default" : "sm"}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            {/* 按钮内部光效 */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              animate={{
                background: [
                  "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                  "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                  "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                ],
                x: [-100, 100],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <span className="relative z-10">{featured ? "开始使用" : "进入"}</span>
          </Button>
        </CardContent>

        {/* 悬停时的彩虹光晕效果 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: featured
              ? `radial-gradient(circle at 50% 0%, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)`
              : `radial-gradient(circle at 50% 0%, rgba(236,72,153,0.12) 0%, rgba(251,146,60,0.08) 50%, transparent 70%)`,
          }}
        />

        {/* 底部彩虹阴影 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none"
          style={{
            background: featured
              ? "linear-gradient(to top, rgba(59,130,246,0.15) 0%, transparent 100%)"
              : "linear-gradient(to top, rgba(236,72,153,0.12) 0%, transparent 100%)",
          }}
        />
      </Card>
    </motion.div>
  )
}
