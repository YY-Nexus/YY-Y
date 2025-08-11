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

interface NetworkStatus {
  isOnline: boolean
  speed: string
  latency: number
}

export function TopNavigationMenu() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    speed: "检测中...",
    latency: 0,
  })

  useEffect(() => {
    const checkNetworkStatus = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
      }))
    }

    const measureNetworkSpeed = async () => {
      try {
        const startTime = performance.now()
        await fetch("/api/health", { method: "HEAD" })
        const endTime = performance.now()
        const latency = Math.round(endTime - startTime)

        let speed = "良好"
        if (latency > 1000) speed = "较慢"
        else if (latency > 500) speed = "一般"
        else if (latency < 100) speed = "极快"

        setNetworkStatus((prev) => ({
          ...prev,
          speed,
          latency,
        }))
      } catch (error) {
        setNetworkStatus((prev) => ({
          ...prev,
          speed: "离线",
          latency: 0,
        }))
      }
    }

    checkNetworkStatus()
    measureNetworkSpeed()

    window.addEventListener("online", checkNetworkStatus)
    window.addEventListener("offline", checkNetworkStatus)

    const interval = setInterval(measureNetworkSpeed, 30000)

    return () => {
      window.removeEventListener("online", checkNetworkStatus)
      window.removeEventListener("offline", checkNetworkStatus)
      clearInterval(interval)
    }
  }, [])

  const userMenuItems = [
    { icon: UserCircle, label: "个人资料", color: "text-blue-500" },
    { icon: Heart, label: "我的收藏", color: "text-red-500" },
    { icon: History, label: "使用历史", color: "text-green-500" },
    { icon: LogOut, label: "退出登录", color: "text-gray-500" },
  ]

  const settingsMenuItems = [
    { icon: Palette, label: "AI设置", color: "text-purple-500" },
    { icon: Palette, label: "界面设置", color: "text-pink-500" },
    { icon: Globe, label: "语言设置", color: "text-cyan-500" },
    { icon: Keyboard, label: "快捷键", color: "text-orange-500" },
    { icon: Download, label: "导入数据", color: "text-green-500" },
    { icon: Upload, label: "导出数据", color: "text-blue-500" },
  ]

  const helpMenuItems = [
    { icon: BookOpen, label: "使用指南", color: "text-indigo-500" },
    { icon: Zap, label: "快速入门", color: "text-yellow-500" },
    { icon: MessageCircle, label: "常见问题", color: "text-green-500" },
    { icon: Phone, label: "联系支持", color: "text-red-500" },
    { icon: Info, label: "关于我们", color: "text-gray-500" },
  ]

  return (
    <div className="flex items-center gap-4">
      {/* 网络状态指示器 */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-sm">
        {networkStatus.isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-xs font-medium text-gray-700">{networkStatus.speed}</span>
        {networkStatus.latency > 0 && (
          <Badge variant="secondary" className="text-xs">
            {networkStatus.latency}ms
          </Badge>
        )}
      </div>

      {/* 用户菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <User className="w-4 h-4 text-purple-600" />
            </motion.div>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-white/90 border border-purple-200/50">
          <DropdownMenuLabel className="text-purple-700 font-semibold">用户中心</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userMenuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-gray-700">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 设置菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="w-4 h-4 text-purple-600" />
            </motion.div>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-white/90 border border-purple-200/50">
          <DropdownMenuLabel className="text-purple-700 font-semibold">系统设置</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {settingsMenuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-gray-700">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 帮助菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <HelpCircle className="w-4 h-4 text-purple-600" />
            </motion.div>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-white/90 border border-purple-200/50">
          <DropdownMenuLabel className="text-purple-700 font-semibold">帮助支持</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {helpMenuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-gray-700">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TopNavigationMenu
