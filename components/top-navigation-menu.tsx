"use client"

import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopNavigationMenuProps {
  isVisible: boolean
  onMenuClick: () => void
}

export function TopNavigationMenu({ isVisible, onMenuClick }: TopNavigationMenuProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2"
        >
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-2 py-1">
            <div className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">在线</span>
            </div>

            <Button size="sm" variant="ghost" className="rounded-full text-white/60 hover:text-white hover:bg-white/10">
              <User className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="ghost" className="rounded-full text-white/60 hover:text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="ghost" className="rounded-full text-white/60 hover:text-white hover:bg-white/10">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
