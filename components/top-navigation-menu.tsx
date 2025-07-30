"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, HelpCircle, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TopNavigationMenuProps {
  isVisible: boolean
  onMenuClick: () => void
}

export function TopNavigationMenu({ isVisible, onMenuClick }: TopNavigationMenuProps) {
  const [isOnline, setIsOnline] = useState(true)

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

  const handleUserAction = (action: string) => {
    console.log(`用户操作: ${action}`)
  }

  const handleSettingsAction = (action: string) => {
    console.log(`设置操作: ${action}`)
  }

  const handleHelpAction = (action: string) => {
    console.log(`帮助操作: ${action}`)
  }

  const handleNetworkStatus = () => {
    console.log("网络状态检查")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-3"
        >
          {/* 在线状态指示器 */}
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant="outline"
              className={cn(
                "transition-colors duration-300 cursor-pointer",
                isOnline
                  ? "text-green-400 border-green-400 bg-green-400/10 hover:bg-green-400/20"
                  : "text-red-400 border-red-400 bg-red-400/10 hover:bg-red-400/20",
              )}
              onClick={handleNetworkStatus}
            >
              <div className="flex items-center gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span className="hidden sm:inline">{isOnline ? "在线" : "离线"}</span>
              </div>
            </Badge>
          </motion.div>

          {/* 用户按钮 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <DropdownMenuLabel className="text-purple-200">我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleUserAction("profile")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUserAction("favorites")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                我的收藏
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUserAction("history")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                使用记录
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleUserAction("logout")}
                className="text-red-400 hover:bg-red-700/50 hover:text-red-300 cursor-pointer"
              >
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 设置按钮 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <DropdownMenuLabel className="text-purple-200">系统设置</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleSettingsAction("ai")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                AI设置
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSettingsAction("interface")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                界面设置
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSettingsAction("language")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                语言设置
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSettingsAction("shortcuts")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                快捷键
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleSettingsAction("export")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                导入/导出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 帮助按钮 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <DropdownMenuLabel className="text-purple-200">帮助与支持</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleHelpAction("guide")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                使用指南
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleHelpAction("quickstart")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                快速入门
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleHelpAction("faq")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                常见问题
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleHelpAction("contact")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                联系支持
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleHelpAction("about")}
                className="text-purple-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                关于我们
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
