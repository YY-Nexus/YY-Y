"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface EmotionalReminderProps {
  isVisible: boolean
  phase: "gentle" | "playful"
  gentleMessages: string[]
  playfulMessages: string[]
  onInteraction: () => void
}

export function EmotionalReminder({
  isVisible,
  phase,
  gentleMessages,
  playfulMessages,
  onInteraction,
}: EmotionalReminderProps) {
  const [currentMessage, setCurrentMessage] = useState("")

  useEffect(() => {
    if (isVisible) {
      const messages = phase === "gentle" ? gentleMessages : playfulMessages
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
    }
  }, [isVisible, phase, gentleMessages, playfulMessages])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-30"
          onClick={onInteraction}
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-2xl cursor-pointer hover:bg-white/15 transition-colors">
            <p className="text-white/90 text-center text-sm max-w-xs">{currentMessage}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
