"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Volume2, VolumeX } from "lucide-react"

interface VoiceRecognitionProps {
  isListening: boolean
  onResult: (text: string) => void
  onError: (error: string) => void
}

export function VoiceRecognition({ isListening, onResult, onError }: VoiceRecognitionProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [volume, setVolume] = useState(0)
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationRef = useRef<number>()

  // 检查浏览器支持
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "zh-CN"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("语音识别已启动")
      }

      recognition.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            setConfidence(result[0].confidence)
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)

        if (finalTranscript) {
          onResult(finalTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error("语音识别错误:", event.error)
        onError(event.error)
      }

      recognition.onend = () => {
        console.log("语音识别已结束")
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [onResult, onError])

  // 音量检测
  const startVolumeDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.fftSize = 256
      microphoneRef.current.connect(analyserRef.current)

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setVolume(average / 255)
          animationRef.current = requestAnimationFrame(updateVolume)
        }
      }

      updateVolume()
    } catch (error) {
      console.error("无法访问麦克风:", error)
      onError("无法访问麦克风")
    }
  }

  // 控制语音识别
  useEffect(() => {
    if (!isSupported || !recognitionRef.current) return

    if (isListening) {
      setTranscript("")
      setConfidence(0)
      recognitionRef.current.start()
      startVolumeDetection()
    } else {
      recognitionRef.current.stop()
      setVolume(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isListening, isSupported])

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
          <div className="bg-purple-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              {/* 麦克风图标和音量可视化 */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: 1 + volume * 0.5,
                    opacity: 0.7 + volume * 0.3,
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <Mic className="w-8 h-8 text-white" />
                </motion.div>

                {/* 音波效果 */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-red-400/30 rounded-full"
                    animate={{
                      scale: 1 + volume * 2 + i * 0.3,
                      opacity: Math.max(0, volume - i * 0.2),
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* 状态文本 */}
              <div className="text-center">
                <p className="text-white font-medium">正在聆听...</p>
                <p className="text-white/60 text-sm mt-1">请说话，我在认真听</p>
              </div>

              {/* 实时转录 */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 rounded-lg p-3 max-w-xs"
                >
                  <p className="text-white text-sm">{transcript}</p>
                  {confidence > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>置信度</span>
                        <span>{Math.round(confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                        <div
                          className="bg-green-400 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 音量指示器 */}
              <div className="flex items-center space-x-2">
                {volume > 0.1 ? (
                  <Volume2 className="w-4 h-4 text-white/60" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/60" />
                )}
                <div className="w-20 bg-white/20 rounded-full h-1">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-1 rounded-full"
                    animate={{ width: `${volume * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* 提示文本 */}
              <p className="text-white/50 text-xs text-center max-w-xs">
                支持中文普通话识别，请保持环境安静以获得最佳效果
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
