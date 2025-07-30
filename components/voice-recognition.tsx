"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"
import type { SpeechRecognition } from "web-speech-api"

interface VoiceRecognitionProps {
  isListening: boolean
  onResult: (text: string) => void
  onError: () => void
}

export function VoiceRecognition({ isListening, onResult, onError }: VoiceRecognitionProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // 检查浏览器支持
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true)

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "zh-CN"

        recognitionRef.current.onstart = () => {
          setTranscript("")
        }

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)

          if (finalTranscript) {
            onResult(finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("语音识别错误:", event.error)
          onError()
        }

        recognitionRef.current.onend = () => {
          if (transcript) {
            onResult(transcript)
          }
        }
      }
    }
  }, [onResult, onError, transcript])

  useEffect(() => {
    if (recognitionRef.current && isSupported) {
      if (isListening) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error("启动语音识别失败:", error)
          onError()
        }
      } else {
        recognitionRef.current.stop()
      }
    }
  }, [isListening, isSupported, onError])

  if (!isSupported) {
    return null
  }

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-4 shadow-2xl border border-red-400/30">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-white"
              >
                <Mic className="w-6 h-6" />
              </motion.div>

              <div className="text-white">
                <p className="text-sm font-medium">正在聆听...</p>
                {transcript && <p className="text-xs opacity-80 max-w-48 truncate">{transcript}</p>}
              </div>

              {/* 音波动画 */}
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
