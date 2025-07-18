"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Enhanced3DIcon } from "@/components/enhanced-3d-icon"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  change: string
  index: number
}

export function StatsCard({ label, value, icon, change, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card
        className={`relative overflow-hidden group transition-all duration-500
        bg-gradient-to-br from-white/40 via-white/30 to-white/20
        backdrop-blur-xl border-2
        shadow-[0_10px_35px_rgba(0,0,0,0.15),0_3px_18px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.5)]
        hover:shadow-[0_18px_55px_rgba(0,0,0,0.18),0_8px_28px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.6)]
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/12 before:to-transparent before:pointer-events-none
        min-h-[120px]
      `}
        style={{
          borderImage: `linear-gradient(135deg, 
            rgba(34, 211, 238, 0.6), 
            rgba(139, 92, 246, 0.5), 
            rgba(236, 72, 153, 0.4)
          ) 1`,
        }}
      >
        {/* 统计卡片背景图案 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 渐变背景 */}
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 15%, rgba(34, 211, 238, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
              `,
            }}
          />

          {/* 动态光点 */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `rgba(${i === 0 ? "34, 211, 238" : i === 1 ? "139, 92, 246" : "236, 72, 153"}, 0.6)`,
                left: `${20 + i * 30}%`,
                top: `${15 + i * 20}%`,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}
        </div>

        {/* 彩虹边框效果 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 顶部彩虹高光 */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-70"
            style={{
              background:
                "linear-gradient(90deg, rgba(34, 211, 238, 0.8), rgba(139, 92, 246, 0.7), rgba(236, 72, 153, 0.6))",
            }}
          />

          {/* 左侧高光 */}
          <div
            className="absolute top-0 left-0 bottom-0 w-1 opacity-60"
            style={{
              background:
                "linear-gradient(180deg, rgba(34, 211, 238, 0.6), rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.4))",
            }}
          />
        </div>

        <CardContent className="p-6 relative z-10 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <p className="text-sm font-medium text-cyan-600/90 drop-shadow-sm group-hover:text-cyan-500 transition-colors duration-300">
                {label}
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-700 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                {value}
              </p>
              <p className="text-sm text-emerald-400 font-medium drop-shadow-sm">{change}</p>
            </div>
            <Enhanced3DIcon
              icon={icon}
              size="md"
              color="text-cyan-400"
              bgColor="bg-gradient-to-br from-cyan-500/20 to-purple-500/15"
              interactive={true}
            />
          </div>
        </CardContent>

        {/* 悬停彩虹光晕 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, rgba(34,211,238,0.1) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)`,
          }}
        />

        {/* 底部彩虹阴影 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(139,92,246,0.15) 0%, transparent 100%)",
          }}
        />
      </Card>
    </motion.div>
  )
}
