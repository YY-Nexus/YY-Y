"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Brain,
  Video,
  BarChart3,
  ArrowLeft,
  Search,
  Play,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  User,
  CheckCircle,
  Target,
  Zap,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  level: string
  duration: number
  progress: number
  rating: number
  students: number
  thumbnail: string
  status: "active" | "completed" | "upcoming"
}

interface Student {
  id: string
  name: string
  grade: string
  avatar: string
  progress: number
  lastActive: string
  performance: "excellent" | "good" | "average" | "needs_improvement"
}

interface Analytics {
  totalStudents: number
  activeCourses: number
  completionRate: number
  averageScore: number
  monthlyGrowth: number
  engagementRate: number
}

export default function SmartEducationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [analytics, setAnalytics] = useState<Analytics>({
    totalStudents: 2847,
    activeCourses: 156,
    completionRate: 87.5,
    averageScore: 92.3,
    monthlyGrowth: 15.8,
    engagementRate: 94.2,
  })

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "人工智能基础与应用",
      instructor: "张教授",
      category: "AI技术",
      level: "中级",
      duration: 120,
      progress: 75,
      rating: 4.8,
      students: 324,
      thumbnail: "/placeholder.svg?height=200&width=300&text=AI课程",
      status: "active",
    },
    {
      id: "2",
      title: "数据科学与机器学习",
      instructor: "李博士",
      category: "数据科学",
      level: "高级",
      duration: 180,
      progress: 45,
      rating: 4.9,
      students: 256,
      thumbnail: "/placeholder.svg?height=200&width=300&text=数据科学",
      status: "active",
    },
    {
      id: "3",
      title: "Web前端开发实战",
      instructor: "王老师",
      category: "编程开发",
      level: "初级",
      duration: 90,
      progress: 100,
      rating: 4.7,
      students: 512,
      thumbnail: "/placeholder.svg?height=200&width=300&text=前端开发",
      status: "completed",
    },
    {
      id: "4",
      title: "区块链技术与应用",
      instructor: "陈专家",
      category: "区块链",
      level: "高级",
      duration: 150,
      progress: 0,
      rating: 4.6,
      students: 189,
      thumbnail: "/placeholder.svg?height=200&width=300&text=区块链",
      status: "upcoming",
    },
  ])

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "小明",
      grade: "高三",
      avatar: "/placeholder.svg?height=40&width=40&text=小明",
      progress: 92,
      lastActive: "2小时前",
      performance: "excellent",
    },
    {
      id: "2",
      name: "小红",
      grade: "高二",
      avatar: "/placeholder.svg?height=40&width=40&text=小红",
      progress: 78,
      lastActive: "1天前",
      performance: "good",
    },
    {
      id: "3",
      name: "小刚",
      grade: "高一",
      avatar: "/placeholder.svg?height=40&width=40&text=小刚",
      progress: 65,
      lastActive: "3小时前",
      performance: "average",
    },
    {
      id: "4",
      name: "小丽",
      grade: "高三",
      avatar: "/placeholder.svg?height=40&width=40&text=小丽",
      progress: 45,
      lastActive: "2天前",
      performance: "needs_improvement",
    },
  ])

  const categories = ["all", "AI技术", "数据科学", "编程开发", "区块链", "设计创意", "商业管理"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-200 border-green-400/30"
      case "completed":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30"
      case "upcoming":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-400"
      case "good":
        return "text-blue-400"
      case "average":
        return "text-yellow-400"
      case "needs_improvement":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "优秀"
      case "good":
        return "良好"
      case "average":
        return "一般"
      case "needs_improvement":
        return "待提升"
      default:
        return "未知"
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-purple-400" />
                智能教育平台
              </h1>
              <p className="text-purple-200 mt-1">个性化学习，智慧启迪未来</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
            {analytics.totalStudents.toLocaleString()} 名学生在线学习
          </Badge>
        </motion.div>

        {/* 数据概览 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-white/70">总学生数</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.activeCourses}</div>
                <div className="text-sm text-white/70">活跃课程</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.completionRate}%</div>
                <div className="text-sm text-white/70">完成率</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.averageScore}</div>
                <div className="text-sm text-white/70">平均分</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">+{analytics.monthlyGrowth}%</div>
                <div className="text-sm text-white/70">月增长</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.engagementRate}%</div>
                <div className="text-sm text-white/70">参与度</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-500/30">
              课程管理
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-500/30">
              学生管理
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="data-[state=active]:bg-purple-500/30">
              AI功能
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/30">
              学习分析
            </TabsTrigger>
          </TabsList>

          {/* 课程管理 */}
          <TabsContent value="courses" className="space-y-6">
            {/* 搜索和筛选 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      placeholder="搜索课程或讲师..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={
                          selectedCategory === category
                            ? "bg-purple-500 hover:bg-purple-400"
                            : "border-white/20 text-white hover:bg-white/10"
                        }
                      >
                        {category === "all" ? "全部" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 课程列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status === "active"
                            ? "进行中"
                            : course.status === "completed"
                              ? "已完成"
                              : "即将开始"}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-400">
                          <Play className="w-4 h-4 mr-2" />
                          开始学习
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                          <p className="text-white/70 text-sm flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {course.instructor}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}分钟
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students}人
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {course.rating}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">学习进度</span>
                            <span className="text-white">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 学生管理 */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 学生列表 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    学生管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <img
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{student.name}</h4>
                            <Badge
                              className={`text-xs ${getPerformanceColor(student.performance)} bg-white/10 border-white/20`}
                            >
                              {getPerformanceText(student.performance)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>{student.grade}</span>
                            <span>进度: {student.progress}%</span>
                            <span>最后活跃: {student.lastActive}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={student.progress} className="h-1" />
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                          查看详情
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 学生统计 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    学习统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">优秀学生</span>
                        <span className="text-green-400">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">良好学生</span>
                        <span className="text-blue-400">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">一般学生</span>
                        <span className="text-yellow-400">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">待提升学生</span>
                        <span className="text-red-400">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI功能 */}
          <TabsContent value="ai-features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI智能辅导",
                  description: "个性化学习路径推荐，智能答疑解惑",
                  icon: Brain,
                  color: "from-purple-500 to-pink-400",
                  features: ["个性化推荐", "智能答疑", "学习路径规划", "知识点分析"],
                },
                {
                  title: "虚拟课堂",
                  description: "沉浸式虚拟现实学习环境",
                  icon: Video,
                  color: "from-blue-500 to-cyan-400",
                  features: ["VR/AR体验", "互动式教学", "虚拟实验室", "3D模型展示"],
                },
                {
                  title: "智能评测",
                  description: "自动化作业批改和学习评估",
                  icon: CheckCircle,
                  color: "from-green-500 to-teal-400",
                  features: ["自动批改", "智能评分", "错误分析", "改进建议"],
                },
                {
                  title: "学习分析",
                  description: "深度学习数据分析和预测",
                  icon: BarChart3,
                  color: "from-orange-500 to-red-400",
                  features: ["学习轨迹", "能力评估", "预测分析", "个性报告"],
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                            <p className="text-white/60 text-sm">{feature.description}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {feature.features.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/80 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                        <Button className={`w-full mt-4 bg-gradient-to-r ${feature.color} hover:opacity-90`}>
                          启用功能
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* 学习分析 */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 学习趋势 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    学习趋势分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>学习趋势图表将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 课程热度 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    课程热度排行
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course, index) => (
                      <div key={course.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{course.title}</h4>
                          <p className="text-white/60 text-sm">{course.students} 名学生</p>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{course.rating}</div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-white/60 text-xs">评分</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 详细分析报告 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  学习分析报告
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-purple-400" />
                      <h4 className="text-white font-medium">日报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每日学习活动和进度分析</p>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                      生成报告
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-purple-400" />
                      <h4 className="text-white font-medium">周报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每周学习效果和趋势分析</p>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                      生成报告
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-purple-400" />
                      <h4 className="text-white font-medium">月报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每月综合学习成果分析</p>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                      生成报告
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
