"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  User,
  LogOut,
  Bell,
  MessageCircle,
  History,
  HelpCircle,
  Zap,
  Globe,
  Wifi,
  WifiOff,
  ChevronDown,
} from "lucide-react"

interface TopNavigationMenuProps {
  isVisible: boolean
  onMenuClick: (menu: string) => void
}

export function TopNavigationMenu({ isVisible, onMenuClick }: TopNavigationMenuProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [currentTime, setCurrentTime] = useState(new Date())

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 right-0 left-0 z-40 bg-purple-900/20 backdrop-blur-xl border-b border-purple-500/20"
        >
          <div className="flex items-center justify-between px-6 py-3">
            {/* 左侧品牌信息 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold hidden sm:inline">言语云³</span>
              </div>

              {/* 服务状态 */}
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-400/20 border-green-400/40 text-green-200 hidden md:flex">
                  <Globe className="w-3 h-3 mr-1" />
                  智能服务
                </Badge>

                <Badge
                  variant="outline"
                  className={`${
                    isOnline
                      ? "bg-green-400/20 border-green-400/40 text-green-200"
                      : "bg-red-400/20 border-red-400/40 text-red-200"
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                  {isOnline ? "在线" : "离线"}
                </Badge>
              </div>
            </div>

            {/* 中间导航菜单 */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMenuClick("chat")}
                className="text-white/70 hover:text-white hover:bg-purple-500/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                对话
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMenuClick("history")}
                className="text-white/70 hover:text-white hover:bg-purple-500/20"
              >
                <History className="w-4 h-4 mr-2" />
                历史
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMenuClick("settings")}
                className="text-white/70 hover:text-white hover:bg-purple-500/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>

            {/* 右侧用户区域 */}
            <div className="flex items-center gap-3">
              {/* 时间显示 */}
              <div className="hidden sm:block text-white/60 text-sm">
                {currentTime.toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* 通知按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-purple-500/20 relative"
                onClick={() => onMenuClick("notifications")}
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* 用户菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-purple-500/20"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs">
                        YY
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">用户</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-purple-900/90 backdrop-blur-xl border-purple-500/30"
                >
                  <DropdownMenuLabel className="text-white">我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-500/30" />
                  <DropdownMenuItem
                    className="text-white/80 hover:bg-purple-500/20 hover:text-white cursor-pointer"
                    onClick={() => onMenuClick("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    个人资料
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white/80 hover:bg-purple-500/20 hover:text-white cursor-pointer"
                    onClick={() => onMenuClick("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    设置
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white/80 hover:bg-purple-500/20 hover:text-white cursor-pointer"
                    onClick={() => onMenuClick("help")}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    帮助
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-500/30" />
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                    onClick={() => onMenuClick("logout")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
