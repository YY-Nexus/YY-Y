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
  Palette,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TopNavigationMenuProps {
  className?: string
}

export function TopNavigationMenu({ className }: TopNavigationMenuProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [networkSpeed, setNetworkSpeed] = useState<string>("检测中...")

  // 网络状态检测
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const checkNetworkSpeed = async () => {
      if (!navigator.onLine) {
        setNetworkSpeed("离线")
        return
      }

      try {
        const startTime = Date.now()
        await fetch("/api/health", { method: "HEAD" })
        const endTime = Date.now()
        const latency = endTime - startTime

        if (latency < 100) {
          setNetworkSpeed("极速")
        } else if (latency < 300) {
          setNetworkSpeed("良好")
        } else if (latency < 600) {
          setNetworkSpeed("一般")
        } else {
          setNetworkSpeed("较慢")
        }
      } catch (error) {
        setNetworkSpeed("异常")
      }
    }

    // 初始检测
    updateOnlineStatus()
    checkNetworkSpeed()

    // 监听网络状态变化
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // 定期检测网络速度
    const speedInterval = setInterval(checkNetworkSpeed, 30000)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      clearInterval(speedInterval)
    }
  }, [])

  const handleUserAction = (action: string) => {
    console.log(`用户操作: ${action}`)
    // 这里可以添加具体的用户操作逻辑
  }

  const handleSettingsAction = (action: string) => {
    console.log(`设置操作: ${action}`)
    // 这里可以添加具体的设置操作逻辑
  }

  const handleHelpAction = (action: string) => {
    console.log(`帮助操作: ${action}`)
    // 这里可以添加具体的帮助操作逻辑
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 网络状态指示器 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-sm border border-purple-200/30"
      >
        {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
        <span className="text-xs font-medium text-gray-700">{isOnline ? networkSpeed : "离线"}</span>
        <Badge variant={isOnline ? "default" : "destructive"} className="text-xs px-1.5 py-0.5">
          {isOnline ? "在线" : "离线"}
        </Badge>
      </motion.div>

      {/* 用户菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative group hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-purple-600 transition-colors" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/30 shadow-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-semibold">用户中心</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem
            onClick={() => handleUserAction("profile")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <UserCircle className="w-4 h-4 mr-2 text-blue-500" />
            个人资料
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleUserAction("favorites")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            我的收藏
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleUserAction("history")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <History className="w-4 h-4 mr-2 text-green-500" />
            使用历史
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem
            onClick={() => handleUserAction("logout")}
            className="hover:bg-red-50/50 cursor-pointer text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 设置菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative group hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-purple-600" />
              <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-purple-600 transition-colors" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/30 shadow-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-semibold">系统设置</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem
            onClick={() => handleSettingsAction("ai-settings")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            AI 设置
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSettingsAction("theme")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Palette className="w-4 h-4 mr-2 text-pink-500" />
            界面设置
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSettingsAction("language")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-500" />
            语言设置
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSettingsAction("shortcuts")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Keyboard className="w-4 h-4 mr-2 text-green-500" />
            快捷键
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem
            onClick={() => handleSettingsAction("export")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2 text-orange-500" />
            导出设置
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSettingsAction("import")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2 text-cyan-500" />
            导入设置
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 帮助菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative group hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-purple-600 transition-colors" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/95 backdrop-blur-md border border-purple-200/30 shadow-xl"
        >
          <DropdownMenuLabel className="text-purple-700 font-semibold">帮助中心</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem onClick={() => handleHelpAction("guide")} className="hover:bg-purple-50/50 cursor-pointer">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
            使用指南
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleHelpAction("quickstart")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            快速入门
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleHelpAction("faq")} className="hover:bg-purple-50/50 cursor-pointer">
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            常见问题
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleHelpAction("contact")}
            className="hover:bg-purple-50/50 cursor-pointer"
          >
            <Phone className="w-4 h-4 mr-2 text-orange-500" />
            联系支持
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-purple-200/30" />

          <DropdownMenuItem onClick={() => handleHelpAction("about")} className="hover:bg-purple-50/50 cursor-pointer">
            <Info className="w-4 h-4 mr-2 text-purple-500" />
            关于我们
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TopNavigationMenu
