"use client"

import { useEffect } from "react"

interface VoiceRecognitionProps {
  isListening: boolean
  onResult: (text: string) => void
  onError: () => void
}

export function VoiceRecognition({ isListening, onResult, onError }: VoiceRecognitionProps) {
  useEffect(() => {
    if (!isListening) return

    // 模拟语音识别
    const timer = setTimeout(() => {
      onResult("这是模拟的语音识别结果")
    }, 2000)

    return () => clearTimeout(timer)
  }, [isListening, onResult])

  return null
}
