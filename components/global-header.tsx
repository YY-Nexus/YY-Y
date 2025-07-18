"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { Menu, X, Wifi, WifiOff, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalHeaderProps {
  onLogoClick?: () => void
  onBackClick?: () => void
  currentModule?: string
  showBackButton?: boolean
  className?: string
}

export function GlobalHeader({
  onLogoClick,
  onBackClick,
  currentModule,
  showBackButton = false,
  className,
}: GlobalHeaderProps) {
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

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm transition-all duration-300",
        isScrolled && "shadow-sm",
        className,
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮 + Logo */}
          <div className="flex items-center gap-3">
            {showBackButton && onBackClick && (
              <Button variant="ghost" size="sm" onClick={onBackClick} className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <BrandLogo size="md" showText={true} interactive={true} onClick={onLogoClick} variant="default" />
          </div>

          {/* 中间：模块信息 */}
          {currentModule && (
            <motion.div
              className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">{currentModule}</span>
            </motion.div>
          )}

          {/* 右侧：状态 + 菜单 */}
          <div className="flex items-center gap-3">
            {/* 网络状态 */}
            <Badge
              variant="outline"
              className={cn(
                "transition-colors duration-300",
                isOnline ? "text-green-600 border-green-600" : "text-red-600 border-red-600",
              )}
            >
              <div className="flex items-center gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span className="hidden sm:inline">{isOnline ? "在线" : "离线"}</span>
              </div>
            </Badge>

            {/* 移动端菜单 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 移动端展开菜单 */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pt-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {currentModule && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">当前模块: {currentModule}</span>
              </div>
            )}
            <p className="text-xs text-gray-500">专业网络监测与诊断平台 - 提供全方位的网络性能分析服务</p>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
