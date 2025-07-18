"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { BrandLogo } from "@/components/brand-logo"
import { Enhanced3DIcon } from "@/components/enhanced-3d-icon"
import { Menu, X, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedHeaderProps {
  onLogoClick?: () => void
  currentModule?: string
  className?: string
}

export function EnhancedHeader({ onLogoClick, currentModule, className }: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const headerVariants = {
    initial: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(8px)",
      borderColor: "rgba(229, 231, 235, 0.8)",
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(229, 231, 235, 1)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  }

  const statusVariants = {
    online: {
      backgroundColor: "#10B981",
      scale: 1,
    },
    offline: {
      backgroundColor: "#EF4444",
      scale: [1, 1.1, 1],
      transition: {
        scale: {
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
        },
      },
    },
  }

  return (
    <motion.header
      className={cn("sticky top-0 z-50 border-b transition-all duration-300", isScrolled && "shadow-sm", className)}
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "initial"}
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* 品牌LOGO区域 */}
          <BrandLogo size="md" showText={true} interactive={true} onClick={onLogoClick} />

          {/* 中间信息区域 - 桌面端显示 */}
          <div className="hidden md:flex items-center gap-4">
            {currentModule && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">当前模块: {currentModule}</span>
              </motion.div>
            )}
          </div>

          {/* 右侧状态区域 */}
          <div className="flex items-center gap-3">
            {/* 网络状态指示器 */}
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div
                className="w-2 h-2 rounded-full"
                variants={statusVariants}
                animate={isOnline ? "online" : "offline"}
              />
              <Badge
                variant="outline"
                className={cn(
                  "transition-colors duration-300",
                  isOnline ? "text-green-600 border-green-600" : "text-red-600 border-red-600",
                )}
              >
                <motion.div className="flex items-center gap-1">
                  <Enhanced3DIcon
                    icon={isOnline ? Wifi : WifiOff}
                    size="sm"
                    color={isOnline ? "text-green-600" : "text-red-600"}
                    bgColor={isOnline ? "bg-green-50" : "bg-red-50"}
                    interactive={false}
                  />
                  <span className="hidden sm:inline">{isOnline ? "在线运行" : "离线状态"}</span>
                  <span className="sm:hidden">{isOnline ? "在线" : "离线"}</span>
                </motion.div>
              </Badge>
            </motion.div>

            {/* 移动端菜单按钮 */}
            <Enhanced3DIcon
              icon={isMobileMenuOpen ? X : Menu}
              size="sm"
              color="text-gray-600"
              bgColor="bg-gray-50"
              interactive={true}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            />
          </div>
        </div>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentModule && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-700">当前模块: {currentModule}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">专业网络监测与诊断平台 - 提供全方位的网络性能分析服务</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
