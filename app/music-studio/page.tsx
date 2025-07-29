"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Music,
  Play,
  Pause,
  Volume2,
  Download,
  Mic,
  Piano,
  Guitar,
  Drum,
  ArrowLeft,
  Settings,
  Sparkles,
  Zap,
  Headphones,
  Heart,
  Share2,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Layers,
  Sliders,
  Users,
  TrendingUp,
  Edit3,
  Eye,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Star,
  Palette,
  Video,
  FileAudio,
  EqualIcon as Equalizer,
  Upload,
  Save,
  Copy,
  RefreshCw,
  Mic2,
  MoreHorizontal,
  Clock,
  User,
  HelpCircle,
  Bell,
  Moon,
  Sun,
  Globe,
  Wifi,
  WifiOff,
} from "lucide-react"
import Link from "next/link"

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  genre: string
  mood: string
  bpm: number
  key: string
  isPlaying: boolean
  isLiked: boolean
  plays: number
  likes: number
  comments: number
  coverUrl: string
  waveform: number[]
  createdAt: Date
  lyrics?: string
  description?: string
  audioUrl?: string
}

interface CreationMode {
  id: string
  name: string
  description: string
  icon: any
  gradient: string
  features: string[]
  isActive: boolean
}

interface AudioEffect {
  id: string
  name: string
  type: "reverb" | "delay" | "chorus" | "distortion" | "compressor" | "equalizer"
  enabled: boolean
  parameters: Record<string, number>
}

export default function MusicStudioPage() {
  const [activeMode, setActiveMode] = useState("simple")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [prompt, setPrompt] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [volume, setVolume] = useState([80])
  const [playbackPosition, setPlaybackPosition] = useState([30])
  const [userTracks, setUserTracks] = useState<Track[]>([])
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGenre, setFilterGenre] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showLyrics, setShowLyrics] = useState(false)
  const [activeTab, setActiveTab] = useState("create")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [audioEffects, setAudioEffects] = useState<AudioEffect[]>([])
  const [masterVolume, setMasterVolume] = useState([75])
  const [tempo, setTempo] = useState([120])
  const [keySignature, setKeySignature] = useState("C")
  const [timeSignature, setTimeSignature] = useState("4/4")
  const [isInstrumental, setIsInstrumental] = useState(false)
  const [aiModel, setAiModel] = useState("versatile")
  const [generationQuality, setGenerationQuality] = useState("high")
  const [autoSave, setAutoSave] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 右上角功能状态
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)

  const creationModes: CreationMode[] = [
    {
      id: "simple",
      name: "极简模式",
      description: "快速创作，一键生成",
      icon: Zap,
      gradient: "from-green-500 to-teal-500",
      features: ["智能作词", "自动编曲", "一键生成", "快速导出"],
      isActive: true,
    },
    {
      id: "lyrics",
      name: "好歌改词",
      description: "基于经典旋律重新填词",
      icon: Edit3,
      gradient: "from-blue-500 to-cyan-500",
      features: ["经典旋律库", "智能押韵", "情感匹配", "风格适配"],
      isActive: true,
    },
    {
      id: "master",
      name: "大师模式",
      description: "专业音乐制作工具",
      icon: Sliders,
      gradient: "from-purple-500 to-pink-500",
      features: ["多轨编辑", "专业混音", "MIDI编辑", "音效处理"],
      isActive: true,
    },
  ]

  const musicGenres = [
    "流行音乐",
    "古典音乐",
    "爵士乐",
    "摇滚乐",
    "电子音乐",
    "民谣",
    "说唱",
    "蓝调",
    "乡村音乐",
    "R&B",
    "雷鬼",
    "朋克",
    "中国风",
    "新世纪",
    "氛围音乐",
    "Lo-Fi",
    "House",
    "Techno",
    "Dubstep",
    "Trap",
    "Indie",
    "Alternative",
  ]

  const musicMoods = [
    "快乐",
    "忧伤",
    "激昂",
    "平静",
    "浪漫",
    "神秘",
    "怀旧",
    "梦幻",
    "紧张",
    "放松",
    "励志",
    "深情",
    "活力",
    "温馨",
    "史诗",
    "空灵",
    "愤怒",
    "希望",
    "孤独",
    "兴奋",
    "沉思",
    "庆祝",
  ]

  const instruments = [
    { name: "钢琴", icon: Piano, color: "from-blue-500 to-cyan-500" },
    { name: "吉他", icon: Guitar, color: "from-green-500 to-teal-500" },
    { name: "鼓", icon: Drum, color: "from-red-500 to-orange-500" },
    { name: "小提琴", icon: Music, color: "from-purple-500 to-pink-500" },
    { name: "萨克斯", icon: Music, color: "from-yellow-500 to-orange-500" },
    { name: "贝斯", icon: Music, color: "from-indigo-500 to-blue-500" },
    { name: "长笛", icon: Music, color: "from-pink-500 to-rose-500" },
    { name: "大提琴", icon: Music, color: "from-gray-500 to-slate-500" },
    { name: "古筝", icon: Music, color: "from-emerald-500 to-green-500" },
    { name: "二胡", icon: Music, color: "from-amber-500 to-yellow-500" },
    { name: "琵琶", icon: Music, color: "from-rose-500 to-pink-500" },
    { name: "笛子", icon: Music, color: "from-cyan-500 to-blue-500" },
  ]

  const quickPrompts = [
    "轻松愉快的背景音乐",
    "深情的钢琴独奏",
    "激昂的摇滚乐",
    "宁静的自然音效",
    "节奏感强的电子乐",
    "温馨的民谣小调",
    "古典风格的交响乐",
    "现代流行歌曲",
    "爵士风格的慢歌",
    "充满活力的舞曲",
    "中国风古典音乐",
    "Lo-Fi学习背景音乐",
  ]

  const hotTopics = [
    "古典思念曲，爱情遐想",
    "轻快神秘，在森林漫步",
    "恋爱进行曲，心跳共鸣",
    "赞美我母亲的勤劳，坚强",
    "青春校园，美好回忆",
    "都市夜晚，霓虹闪烁",
    "江南水乡，诗意朦胧",
    "现代都市，快节奏生活",
    "田园牧歌，自然和谐",
    "科幻未来，电子合成",
  ]

  // 初始化音效
  useEffect(() => {
    const defaultEffects: AudioEffect[] = [
      {
        id: "reverb",
        name: "混响",
        type: "reverb",
        enabled: false,
        parameters: { roomSize: 50, damping: 30, wetLevel: 25 },
      },
      {
        id: "delay",
        name: "延迟",
        type: "delay",
        enabled: false,
        parameters: { delayTime: 250, feedback: 30, wetLevel: 20 },
      },
      {
        id: "chorus",
        name: "合唱",
        type: "chorus",
        enabled: false,
        parameters: { rate: 1.5, depth: 25, wetLevel: 30 },
      },
      {
        id: "compressor",
        name: "压缩器",
        type: "compressor",
        enabled: false,
        parameters: { threshold: -20, ratio: 4, attack: 3, release: 100 },
      },
      {
        id: "equalizer",
        name: "均衡器",
        type: "equalizer",
        enabled: false,
        parameters: { low: 0, mid: 0, high: 0 },
      },
    ]
    setAudioEffects(defaultEffects)
  }, [])

  // 模拟用户作品数据
  useEffect(() => {
    const mockUserTracks: Track[] = [
      {
        id: "1",
        title: "破茧向光",
        artist: "AI创作",
        duration: "3:45",
        genre: "Alternative Rock",
        mood: "励志",
        bpm: 120,
        key: "C Major",
        isPlaying: false,
        isLiked: true,
        plays: 1234,
        likes: 89,
        comments: 23,
        coverUrl: "/placeholder.svg?height=200&width=200&text=破茧向光",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 86400000),
        lyrics: "黑暗中寻找光明\n勇敢地向前飞行\n破茧而出的瞬间\n世界为我而精彩",
        description: "一首关于成长和突破的励志歌曲",
        audioUrl: "/audio/sample1.mp3",
      },
      {
        id: "2",
        title: "云极星轨",
        artist: "AI创作",
        duration: "4:12",
        genre: "Electronic",
        mood: "梦幻",
        bpm: 128,
        key: "A Minor",
        isPlaying: false,
        isLiked: false,
        plays: 856,
        likes: 67,
        comments: 15,
        coverUrl: "/placeholder.svg?height=200&width=200&text=云极星轨",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 172800000),
        lyrics: "星河璀璨夜空中\n云朵轻舞伴月明\n极光绚烂如梦境\n星轨划过心中情",
        description: "电子音乐风格的梦幻作品",
        audioUrl: "/audio/sample2.mp3",
      },
      {
        id: "3",
        title: "午后时光",
        artist: "AI创作",
        duration: "2:58",
        genre: "Folk",
        mood: "平静",
        bpm: 90,
        key: "G Major",
        isPlaying: false,
        isLiked: true,
        plays: 2341,
        likes: 156,
        comments: 42,
        coverUrl: "/placeholder.svg?height=200&width=200&text=午后时光",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 259200000),
        lyrics: "午后阳光透过窗\n温暖洒在桌案上\n一杯茶香伴书香\n时光静好心安详",
        description: "温馨的民谣风格音乐",
        audioUrl: "/audio/sample3.mp3",
      },
    ]
    setUserTracks(mockUserTracks)

    const mockTrendingTracks: Track[] = [
      {
        id: "t1",
        title: "无悔",
        artist: "Cinematic Chinese Traditional Folk",
        duration: "4:23",
        genre: "Folk",
        mood: "深情",
        bpm: 85,
        key: "D Minor",
        isPlaying: false,
        isLiked: false,
        plays: 15420,
        likes: 892,
        comments: 156,
        coverUrl: "/placeholder.svg?height=200&width=200&text=无悔",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 86400000),
        description: "中国传统民谣风格的深情作品",
        audioUrl: "/audio/trending1.mp3",
      },
      {
        id: "t2",
        title: "Glass house",
        artist: "Verses feature whispered vocals",
        duration: "3:56",
        genre: "Indie",
        mood: "神秘",
        bpm: 110,
        key: "F# Major",
        isPlaying: false,
        isLiked: true,
        plays: 12890,
        likes: 743,
        comments: 98,
        coverUrl: "/placeholder.svg?height=200&width=200&text=Glass+House",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 172800000),
        description: "独立音乐风格的神秘作品",
        audioUrl: "/audio/trending2.mp3",
      },
      {
        id: "t3",
        title: "心碎茧",
        artist: "Sweeping orchestral pop ballad",
        duration: "5:12",
        genre: "Pop",
        mood: "忧伤",
        bpm: 75,
        key: "Bb Major",
        isPlaying: false,
        isLiked: false,
        plays: 18765,
        likes: 1024,
        comments: 234,
        coverUrl: "/placeholder.svg?height=200&width=200&text=心碎茧",
        waveform: Array.from({ length: 100 }, () => Math.random() * 100),
        createdAt: new Date(Date.now() - 259200000),
        description: "管弦乐流行民谣风格的忧伤作品",
        audioUrl: "/audio/trending3.mp3",
      },
    ]
    setTrendingTracks(mockTrendingTracks)
  }, [])

  // 监听在线状态
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

  // 自动保存功能
  useEffect(() => {
    if (autoSave && (prompt || lyrics)) {
      const timer = setTimeout(() => {
        // 模拟自动保存
        console.log("自动保存草稿...")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [prompt, lyrics, autoSave])

  const handleGenerate = async () => {
    if (!prompt.trim() && !lyrics.trim()) return

    setIsGenerating(true)
    setProgress(0)

    // 模拟生成过程
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)

          // 创建新的音轨
          const newTrack: Track = {
            id: Date.now().toString(),
            title: prompt.slice(0, 20) || "AI生成音乐",
            artist: "AI创作",
            duration: "3:30",
            genre: selectedGenre || "流行音乐",
            mood: selectedMood || "快乐",
            bpm: tempo[0],
            key: keySignature + " Major",
            isPlaying: false,
            isLiked: false,
            plays: 0,
            likes: 0,
            comments: 0,
            coverUrl: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(prompt.slice(0, 10) || "AI音乐")}`,
            waveform: Array.from({ length: 100 }, () => Math.random() * 100),
            createdAt: new Date(),
            lyrics: lyrics || "AI生成的歌词内容...",
            description: prompt || "AI智能创作的音乐作品",
            audioUrl: "/audio/generated.mp3",
          }

          setCurrentTrack(newTrack)
          setUserTracks((prev) => [newTrack, ...prev])
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const togglePlayback = (track?: Track) => {
    if (track) {
      setCurrentTrack(track)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const toggleInstrument = (instrument: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(instrument) ? prev.filter((i) => i !== instrument) : [...prev, instrument],
    )
  }

  const toggleLike = (trackId: string) => {
    setUserTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, isLiked: !track.isLiked, likes: track.isLiked ? track.likes - 1 : track.likes + 1 }
          : track,
      ),
    )
    setTrendingTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, isLiked: !track.isLiked, likes: track.isLiked ? track.likes - 1 : track.likes + 1 }
          : track,
      ),
    )
  }

  const toggleEffect = (effectId: string) => {
    setAudioEffects((prev) =>
      prev.map((effect) => (effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect)),
    )
  }

  const updateEffectParameter = (effectId: string, parameter: string, value: number) => {
    setAudioEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId ? { ...effect, parameters: { ...effect.parameters, [parameter]: value } } : effect,
      ),
    )
  }

  const startRecording = () => {
    setIsRecording(true)
    // 实际录音逻辑
  }

  const stopRecording = () => {
    setIsRecording(false)
    // 停止录音逻辑
  }

  const saveProject = () => {
    // 保存项目逻辑
    console.log("保存项目...")
  }

  const exportTrack = (format: string) => {
    // 导出音轨逻辑
    console.log(`导出为 ${format} 格式`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredTracks = [...userTracks, ...trendingTracks]
    .filter((track) => {
      const matchesSearch =
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = filterGenre === "all" || track.genre.toLowerCase().includes(filterGenre.toLowerCase())
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.plays - a.plays
        case "liked":
          return b.likes - a.likes
        case "recent":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-green-900 p-4">
      {/* 顶部导航栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        {/* 左侧返回按钮 */}
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主页
          </Button>
        </Link>

        {/* 右侧功能图标 */}
        <div className="flex items-center gap-2">
          {/* 网络状态 */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-white/80 text-sm">{isOnline ? "在线" : "离线"}</span>
            {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
          </div>

          {/* 通知 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 z-50"
                >
                  <h3 className="text-white font-medium mb-3">通知</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-white/5 rounded text-white/80 text-sm">
                      🎵 您的音乐"破茧向光"获得了新的点赞
                    </div>
                    <div className="p-2 bg-white/5 rounded text-white/80 text-sm">✨ AI模型已更新，创作效果更佳</div>
                    <div className="p-2 bg-white/5 rounded text-white/80 text-sm">🎼 新的音效库已上线</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 z-50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">音乐创作者</div>
                      <div className="text-white/60 text-sm">创作等级: 专业</div>
                    </div>
                  </div>
                  <Separator className="bg-white/20 mb-3" />
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <User className="w-4 h-4 mr-2" />
                      个人资料
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <Star className="w-4 h-4 mr-2" />
                      我的收藏
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <Clock className="w-4 h-4 mr-2" />
                      创作历史
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 设置菜单 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <Settings className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showSettingsMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 z-50"
                >
                  <h3 className="text-white font-medium mb-3">设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">深色模式</span>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-white/60" />
                        <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                        <Moon className="w-4 h-4 text-white/60" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">自动保存</span>
                      <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                    <div className="space-y-2">
                      <span className="text-white/80 text-sm">音质设置</span>
                      <Select value={generationQuality} onValueChange={setGenerationQuality}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="low">标准音质</SelectItem>
                          <SelectItem value="medium">高音质</SelectItem>
                          <SelectItem value="high">无损音质</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-white/80 text-sm">语言设置</span>
                      <Select defaultValue="zh-CN">
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="zh-CN">简体中文</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="ja-JP">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 帮助菜单 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowHelpMenu(!showHelpMenu)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showHelpMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 z-50"
                >
                  <h3 className="text-white font-medium mb-3">帮助与支持</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      使用教程
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      在线客服
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
                      <Globe className="w-4 h-4 mr-2" />
                      官方网站
                    </Button>
                    <Separator className="bg-white/20" />
                    <div className="text-white/60 text-xs text-center pt-2">版本 v1.2.0</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            YYC³ Music Studio
          </h1>
          <div className="absolute -top-2 -right-8 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
            Pro版本
          </div>
        </div>
        <p className="text-white/80 text-lg mb-4">好歌改词，创作无限</p>
        <p className="text-white/60 text-sm">为您喜欢的音乐，填上您的歌词</p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-white/20">
              <Sparkles className="w-4 h-4 mr-2" />
              音乐创作
            </TabsTrigger>
            <TabsTrigger value="mv" className="text-white data-[state=active]:bg-white/20">
              <Video className="w-4 h-4 mr-2" />
              音乐MV
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-white data-[state=active]:bg-white/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              大家都在听
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              我的
            </TabsTrigger>
          </TabsList>

          {/* 音乐创作页面 */}
          <TabsContent value="create" className="space-y-6">
            {/* 创作模式选择 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 flex">
                {creationModes.map((mode) => (
                  <Button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`rounded-full px-6 py-2 transition-all duration-300 ${
                      activeMode === mode.id
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {mode.name}
                  </Button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧创作面板 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {activeMode === "simple" && "灵感描述"}
                      {activeMode === "lyrics" && "好歌改词"}
                      {activeMode === "master" && "大师模式"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {activeMode === "simple" && (
                      <>
                        {/* 灵感描述 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-white/90 text-sm font-medium">灵感描述</label>
                            <div className="flex items-center gap-2">
                              <span className="text-white/60 text-sm">纯音乐</span>
                              <Switch checked={isInstrumental} onCheckedChange={setIsInstrumental} />
                            </div>
                          </div>
                          <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="在此处输入您的灵感，例如：写一首关于爱情的，中国风的歌曲，要求中文，有古筝和二胡，打击乐。"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] resize-none"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Select value={aiModel} onValueChange={setAiModel}>
                                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="versatile">百变模型</SelectItem>
                                  <SelectItem value="classical">古典模型</SelectItem>
                                  <SelectItem value="modern">现代模型</SelectItem>
                                  <SelectItem value="electronic">电子模型</SelectItem>
                                </SelectContent>
                              </Select>
                              {autoSave && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                                  自动保存
                                </Badge>
                              )}
                            </div>
                            <span className="text-white/50 text-xs">{prompt.length}/500</span>
                          </div>
                        </div>

                        {/* 想不出来？选择一个热门主题吧 */}
                        <div>
                          <label className="text-white/90 text-sm font-medium mb-3 block">
                            想不出来？选择一个热门主题吧
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {hotTopics.map((topic) => (
                              <Button
                                key={topic}
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start text-left h-auto py-3 px-4"
                                onClick={() => setPrompt(topic)}
                              >
                                <div className="text-sm leading-relaxed">{topic}</div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeMode === "lyrics" && (
                      <>
                        {/* 歌词创作界面 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-white/90 text-sm font-medium mb-2 block">原始歌词</label>
                            <Textarea
                              placeholder="输入原始歌词或上传歌词文件..."
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[200px]"
                            />
                            <div className="mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                上传文件
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="text-white/90 text-sm font-medium mb-2 block">改写歌词</label>
                            <Textarea
                              value={lyrics}
                              onChange={(e) => setLyrics(e.target.value)}
                              placeholder="AI将在这里生成改写后的歌词..."
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[200px]"
                            />
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                复制
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                重新生成
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* 改词设置 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-white/90 text-sm font-medium mb-2 block">改词风格</label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="选择风格" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="romantic">浪漫风格</SelectItem>
                                <SelectItem value="inspirational">励志风格</SelectItem>
                                <SelectItem value="nostalgic">怀旧风格</SelectItem>
                                <SelectItem value="modern">现代风格</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-white/90 text-sm font-medium mb-2 block">押韵方式</label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="选择押韵" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="abab">ABAB押韵</SelectItem>
                                <SelectItem value="aabb">AABB押韵</SelectItem>
                                <SelectItem value="abcb">ABCB押韵</SelectItem>
                                <SelectItem value="free">自由押韵</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-white/90 text-sm font-medium mb-2 block">情感色彩</label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="选择情感" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="happy">欢快</SelectItem>
                                <SelectItem value="sad">忧伤</SelectItem>
                                <SelectItem value="passionate">激情</SelectItem>
                                <SelectItem value="peaceful">平和</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}

                    {activeMode === "master" && (
                      <>
                        {/* 专业制作界面 */}
                        <div className="space-y-6">
                          {/* 多轨编辑 */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                多轨编辑
                              </h4>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-green-500 hover:bg-green-400">
                                  <Layers className="w-4 h-4 mr-2" />
                                  添加音轨
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  导入音频
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {["主旋律", "和声", "鼓点", "贝斯", "钢琴", "弦乐"].map((track, index) => (
                                <div key={track} className="bg-white/5 rounded-lg p-4">
                                  <div className="flex items-center gap-4 mb-3">
                                    <Button size="sm" variant="ghost" className="text-white">
                                      <Play className="w-3 h-3" />
                                    </Button>
                                    <span className="text-white text-sm flex-1">{track}</span>
                                    <div className="flex items-center gap-2">
                                      <Button size="sm" variant="ghost" className="text-white">
                                        <Volume2 className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-white">
                                        <Settings className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-white">
                                        <Mic2 className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-white">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white/10 rounded-full h-2 relative">
                                      <div
                                        className="bg-green-400 h-2 rounded-full"
                                        style={{ width: `${(index + 1) * 15}%` }}
                                      />
                                    </div>
                                    <Slider defaultValue={[80]} max={100} step={1} className="w-20" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* MIDI编辑器 */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <Piano className="w-4 h-4" />
                              MIDI编辑器
                            </h4>
                            <div className="bg-white/5 rounded-lg p-6 h-40 flex items-center justify-center">
                              <div className="text-center">
                                <Piano className="w-12 h-12 text-white/50 mx-auto mb-3" />
                                <p className="text-white/60 text-sm mb-3">点击开始MIDI编辑</p>
                                <Button className="bg-green-500 hover:bg-green-400">
                                  <Piano className="w-4 h-4 mr-2" />
                                  打开MIDI编辑器
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* 音效处理 */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <Equalizer className="w-4 h-4" />
                              音效处理
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {audioEffects.map((effect) => (
                                <Card key={effect.id} className="bg-white/5 border-white/20">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-white font-medium">{effect.name}</span>
                                      <Switch
                                        checked={effect.enabled}
                                        onCheckedChange={() => toggleEffect(effect.id)}
                                      />
                                    </div>
                                    {effect.enabled && (
                                      <div className="space-y-2">
                                        {Object.entries(effect.parameters).map(([param, value]) => (
                                          <div key={param} className="flex items-center gap-2">
                                            <span className="text-white/70 text-sm w-16">{param}</span>
                                            <Slider
                                              value={[value]}
                                              onValueChange={([newValue]) =>
                                                updateEffectParameter(effect.id, param, newValue)
                                              }
                                              max={100}
                                              step={1}
                                              className="flex-1"
                                            />
                                            <span className="text-white/60 text-sm w-8">{value}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* 音乐参数设置 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">音乐风格</label>
                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="选择风格" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {musicGenres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">情绪氛围</label>
                        <Select value={selectedMood} onValueChange={setSelectedMood}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="选择情绪" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {musicMoods.map((mood) => (
                              <SelectItem key={mood} value={mood}>
                                {mood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 高级参数 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">节拍 (BPM)</label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={tempo}
                            onValueChange={setTempo}
                            min={60}
                            max={200}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-white/60 text-sm w-12">{tempo[0]}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">调性</label>
                        <Select value={keySignature} onValueChange={setKeySignature}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
                              <SelectItem key={key} value={key}>
                                {key} Major
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">拍号</label>
                        <Select value={timeSignature} onValueChange={setTimeSignature}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="4/4">4/4</SelectItem>
                            <SelectItem value="3/4">3/4</SelectItem>
                            <SelectItem value="2/4">2/4</SelectItem>
                            <SelectItem value="6/8">6/8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 乐器选择 */}
                    <div>
                      <label className="text-white/90 text-sm font-medium mb-3 block">主要乐器</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {instruments.map((instrument) => (
                          <Button
                            key={instrument.name}
                            variant="outline"
                            size="sm"
                            className={`${
                              selectedInstruments.includes(instrument.name)
                                ? `bg-gradient-to-r ${instrument.color} bg-opacity-30 border-white/40`
                                : "bg-white/5 border-white/20 hover:bg-white/10"
                            } text-white transition-all`}
                            onClick={() => toggleInstrument(instrument.name)}
                          >
                            <instrument.icon className="w-3 h-3 mr-1" />
                            {instrument.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || (!prompt.trim() && !lyrics.trim())}
                        className="flex-1 bg-white text-black hover:bg-white/90 font-medium py-4 text-lg rounded-full"
                      >
                        {isGenerating ? "生成中..." : "开始生成"}
                      </Button>
                      <Button
                        onClick={saveProject}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 px-6 bg-transparent"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant="outline"
                        className={`border-white/20 text-white hover:bg-white/10 px-6 ${
                          isRecording ? "bg-red-500/20 border-red-400/30" : ""
                        }`}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? "停止录音" : "录音"}
                      </Button>
                    </div>

                    {/* 进度条 */}
                    {isGenerating && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-white/70">
                          <span>创作进度</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="bg-white/10" />
                        <p className="text-white/60 text-sm text-center">
                          {progress < 30 && "正在分析您的创意..."}
                          {progress >= 30 && progress < 60 && "正在生成旋律..."}
                          {progress >= 60 && progress < 90 && "正在编排乐器..."}
                          {progress >= 90 && "正在完成最后的润色..."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* 右侧播放器 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* 音乐播放器 */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Headphones className="w-5 h-5" />
                      音乐播放器
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentTrack ? (
                      <div className="space-y-6">
                        {/* 专辑封面 */}
                        <div className="relative">
                          <div className="w-full h-48 bg-gradient-to-br from-green-400 to-teal-600 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={currentTrack.coverUrl || "/placeholder.svg"}
                              alt={currentTrack.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <Button
                              onClick={() => togglePlayback()}
                              className="bg-white/20 hover:bg-white/30 rounded-full w-16 h-16"
                            >
                              {isPlaying ? (
                                <Pause className="w-8 h-8 text-white" />
                              ) : (
                                <Play className="w-8 h-8 text-white ml-1" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* 歌曲信息 */}
                        <div className="text-center">
                          <h3 className="text-white font-medium mb-1">{currentTrack.title}</h3>
                          <p className="text-white/60 text-sm">{currentTrack.artist}</p>
                          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-white/50">
                            <span>{currentTrack.genre}</span>
                            <span>•</span>
                            <span>{currentTrack.mood}</span>
                            <span>•</span>
                            <span>{currentTrack.bpm} BPM</span>
                          </div>
                        </div>

                        {/* 波形显示 */}
                        <div className="h-16 bg-white/5 rounded-lg flex items-end justify-center gap-1 p-2">
                          {currentTrack.waveform.slice(0, 50).map((height, index) => (
                            <div
                              key={index}
                              className="bg-green-400 rounded-full transition-all duration-300"
                              style={{
                                height: `${Math.max(height * 0.4, 4)}px`,
                                width: "3px",
                                opacity: index < playbackPosition[0] / 2 ? 1 : 0.3,
                              }}
                            />
                          ))}
                        </div>

                        {/* 进度条 */}
                        <div className="space-y-2">
                          <Slider
                            value={playbackPosition}
                            onValueChange={setPlaybackPosition}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-white/60">
                            <span>01:23</span>
                            <span>{currentTrack.duration}</span>
                          </div>
                        </div>

                        {/* 控制按钮 */}
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <Shuffle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => togglePlayback()}
                            className="bg-green-500 hover:bg-green-400 w-12 h-12 rounded-full"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-white" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <Repeat className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* 音量控制 */}
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-white/70" />
                          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                          <span className="text-white/60 text-sm w-8">{volume[0]}</span>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => toggleLike(currentTrack.id)}
                          >
                            <Heart className={`w-4 h-4 ${currentTrack.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => exportTrack("mp3")}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => setShowLyrics(!showLyrics)}
                          >
                            <FileAudio className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* 歌词显示 */}
                        {showLyrics && currentTrack.lyrics && (
                          <div className="bg-white/5 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">歌词</h4>
                            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                              {currentTrack.lyrics}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/60 text-lg mb-2">还没有创作音乐</p>
                        <p className="text-white/40">输入描述开始创作您的第一首AI音乐</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 音效库 */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      音效库
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="effects" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/10">
                        <TabsTrigger value="effects" className="text-white data-[state=active]:bg-white/20">
                          音效
                        </TabsTrigger>
                        <TabsTrigger value="loops" className="text-white data-[state=active]:bg-white/20">
                          循环
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="effects" className="mt-4">
                        <div className="space-y-2">
                          {["雨声", "海浪声", "鸟鸣", "风声", "钟声", "脚步声", "掌声", "笑声"].map((effect) => (
                            <Button
                              key={effect}
                              variant="outline"
                              size="sm"
                              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                            >
                              <Play className="w-3 h-3 mr-2" />
                              {effect}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="loops" className="mt-4">
                        <div className="space-y-2">
                          {[
                            "鼓点循环",
                            "贝斯循环",
                            "和弦循环",
                            "旋律循环",
                            "节拍循环",
                            "氛围循环",
                            "打击乐循环",
                            "合成器循环",
                          ].map((loop) => (
                            <Button
                              key={loop}
                              variant="outline"
                              size="sm"
                              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                            >
                              <Play className="w-3 h-3 mr-2" />
                              {loop}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* 音乐MV页面 */}
          <TabsContent value="mv" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">音乐の视觉之旅</h2>
              <p className="text-white/70">Visual Journey</p>
            </div>

            {/* 魔法MV功能 */}
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">魔法MV</h3>
                    <p className="text-white/80">制作您的专属音乐MV</p>
                  </div>
                  <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">一键生成</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-white font-medium mb-1">一键成片</h4>
                      <p className="text-white/60 text-sm">AI自动生成MV</p>
                      <Badge className="mt-2 bg-blue-500/20 text-blue-300 border-blue-400/30">New</Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Palette className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-white font-medium mb-1">相册MV</h4>
                      <p className="text-white/60 text-sm">使用照片制作MV</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-white font-medium mb-1">模板MV</h4>
                      <p className="text-white/60 text-sm">选择专业模板</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* MV作品展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Loneliness is silent lie",
                  subtitle: "作词：Muse AI\n作曲：Muse AI",
                  cover: "/placeholder.svg?height=300&width=400&text=MV1",
                },
                {
                  title: "梦境之歌",
                  subtitle: "作词：AI创作\n作曲：AI创作",
                  cover: "/placeholder.svg?height=300&width=400&text=MV2",
                },
              ].map((mv, index) => (
                <Card key={index} className="bg-white/10 border-white/20 overflow-hidden group">
                  <div className="relative">
                    <img src={mv.cover || "/placeholder.svg"} alt={mv.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button className="bg-white/20 hover:bg-white/30 rounded-full w-16 h-16">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-500/80 text-white border-0">魔法MV</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium mb-1">{mv.title}</h3>
                    <p className="text-white/60 text-sm whitespace-pre-line">{mv.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 大家都在听页面 */}
          <TabsContent value="trending" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">大家都在听</h2>
              <p className="text-white/70">发现最受欢迎的AI创作音乐</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img
                          src={track.coverUrl || "/placeholder.svg"}
                          alt={track.title}
                          className="w-full h-48 rounded-lg object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500/80 text-white border-0">#{index + 1}</Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => togglePlayback(track)}
                            className="bg-white/20 hover:bg-white/30 rounded-full w-16 h-16"
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-black/40 hover:bg-black/60 text-white w-8 h-8 p-0"
                            onClick={() => toggleLike(track.id)}
                          >
                            <Heart className={`w-4 h-4 ${track.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-white font-semibold text-lg">{track.title}</h3>
                        <p className="text-white/70 text-sm">{track.artist}</p>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">{track.genre}</Badge>
                          <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">{track.mood}</Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {track.plays.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {track.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {track.comments}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 我的页面 */}
          <TabsContent value="profile" className="space-y-6">
            {/* 用户信息卡片 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">音乐爱好者 0379</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/70">积分: 9941</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userTracks.length}</div>
                    <div className="text-white/60 text-sm">我的作品</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {userTracks.reduce((sum, track) => sum + track.plays, 0).toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">总播放</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {userTracks.reduce((sum, track) => sum + track.likes, 0)}
                    </div>
                    <div className="text-white/60 text-sm">获得点赞</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {userTracks.reduce((sum, track) => sum + track.comments, 0)}
                    </div>
                    <div className="text-white/60 text-sm">收到评论</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 我的作品列表 */}
            <div className="space-y-4">
              {userTracks.map((track) => (
                <Card
                  key={track.id}
                  className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={track.coverUrl || "/placeholder.svg"}
                        alt={track.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{track.title}</h3>
                        <p className="text-white/60 text-sm">{track.artist}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-white/50">
                          <span>{track.genre}</span>
                          <span>•</span>
                          <span>{track.duration}</span>
                          <span>•</span>
                          <span>{track.plays} 播放</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/60 hover:text-white hover:bg-white/10"
                          onClick={() => togglePlayback(track)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} />
    </div>
  )
}
