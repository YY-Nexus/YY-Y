"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User,
  Settings,
  HelpCircle,
  Wifi,
  WifiOff,
  ChevronDown,
  UserCircle,
  Heart,
  History,
  LogOut,
  Sliders,
  Monitor,
  Globe,
  Keyboard,
  Download,
  Upload,
  BookOpen,
  Zap,
  MessageCircle,
  Phone,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TopNavigationMenuProps {
  className?: string
}

export function TopNavigationMenu({ className = "" }: TopNavigationMenuProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [lastOnlineCheck, setLastOnlineCheck] = useState(Date.now())

  // 网络状态检测
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      setLastOnlineCheck(Date.now())
    }

    const handleOnline = () => checkOnlineStatus()
    const handleOffline = () => checkOnlineStatus()

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // 定期检查网络状态
    const interval = setInterval(checkOnlineStatus, 30000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleNetworkCheck = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
      })
      setIsOnline(response.ok)
    } catch {
      setIsOnline(false)
    }
    setLastOnlineCheck(Date.now())
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 网络状态指示器 */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNetworkCheck}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
        >
          {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          <Badge variant={isOnline ? "default" : "destructive"} className="text-xs px-2 py-1">
            {isOnline ? "在线" : "离线"}
          </Badge>
        </Button>
      </motion.div>

      {/* 用户菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
            >
              <User className="h-4 w-4 text-purple-600" />
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-xl rounded-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-medium">我的账户</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <UserCircle className="h-4 w-4 text-purple-600" />
            <span>个人资料</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Heart className="h-4 w-4 text-pink-600" />
            <span>我的收藏</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <History className="h-4 w-4 text-blue-600" />
            <span>使用历史</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600">
            <LogOut className="h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 设置菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
            >
              <Settings className="h-4 w-4 text-purple-600" />
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-xl rounded-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-medium">系统设置</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Sliders className="h-4 w-4 text-purple-600" />
            <span>AI 设置</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Monitor className="h-4 w-4 text-blue-600" />
            <span>界面设置</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Globe className="h-4 w-4 text-green-600" />
            <span>语言设置</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Keyboard className="h-4 w-4 text-orange-600" />
            <span>快捷键</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Download className="h-4 w-4 text-cyan-600" />
            <span>导入设置</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Upload className="h-4 w-4 text-pink-600" />
            <span>导出设置</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 帮助菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
            >
              <HelpCircle className="h-4 w-4 text-purple-600" />
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-xl rounded-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-medium">帮助与支持</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span>使用指南</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>快速入门</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span>常见问题</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Phone className="h-4 w-4 text-green-600" />
            <span>联系支持</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer">
            <Info className="h-4 w-4 text-cyan-600" />
            <span>关于我们</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TopNavigationMenu
