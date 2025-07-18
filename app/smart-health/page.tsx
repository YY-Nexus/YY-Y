"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Heart,
  Activity,
  Brain,
  Stethoscope,
  Pill,
  Calendar,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Moon,
  Footprints,
  Thermometer,
  Droplets,
  Eye,
  Bell,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface HealthMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  lastUpdate: string
  icon: any
  color: string
  range: { min: number; max: number }
}

interface HealthRecord {
  id: string
  date: string
  type: string
  description: string
  doctor: string
  status: "completed" | "pending" | "cancelled"
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  taken: boolean
  nextDose: string
}

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  department: string
  type: string
  status: "confirmed" | "pending" | "completed"
}

export default function SmartHealthPage() {
  const router = useRouter()

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: "1",
      name: "心率",
      value: 72,
      unit: "bpm",
      status: "normal",
      trend: "stable",
      lastUpdate: "2分钟前",
      icon: Heart,
      color: "text-red-400",
      range: { min: 60, max: 100 },
    },
    {
      id: "2",
      name: "血压",
      value: 120,
      unit: "mmHg",
      status: "normal",
      trend: "down",
      lastUpdate: "1小时前",
      icon: Activity,
      color: "text-blue-400",
      range: { min: 90, max: 140 },
    },
    {
      id: "3",
      name: "血氧",
      value: 98,
      unit: "%",
      status: "normal",
      trend: "stable",
      lastUpdate: "5分钟前",
      icon: Droplets,
      color: "text-cyan-400",
      range: { min: 95, max: 100 },
    },
    {
      id: "4",
      name: "体温",
      value: 36.5,
      unit: "°C",
      status: "normal",
      trend: "stable",
      lastUpdate: "30分钟前",
      icon: Thermometer,
      color: "text-orange-400",
      range: { min: 36, max: 37.5 },
    },
    {
      id: "5",
      name: "步数",
      value: 8542,
      unit: "步",
      status: "normal",
      trend: "up",
      lastUpdate: "实时",
      icon: Footprints,
      color: "text-green-400",
      range: { min: 6000, max: 10000 },
    },
    {
      id: "6",
      name: "睡眠",
      value: 7.5,
      unit: "小时",
      status: "normal",
      trend: "up",
      lastUpdate: "今晨",
      icon: Moon,
      color: "text-purple-400",
      range: { min: 7, max: 9 },
    },
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "阿司匹林",
      dosage: "100mg",
      frequency: "每日一次",
      startDate: "2024-01-01",
      endDate: "2024-03-01",
      taken: true,
      nextDose: "明天 08:00",
    },
    {
      id: "2",
      name: "维生素D",
      dosage: "1000IU",
      frequency: "每日一次",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      taken: false,
      nextDose: "今天 20:00",
    },
    {
      id: "3",
      name: "钙片",
      dosage: "500mg",
      frequency: "每日两次",
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      taken: true,
      nextDose: "明天 12:00",
    },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: "2024-01-25",
      time: "09:00",
      doctor: "张医生",
      department: "心内科",
      type: "复查",
      status: "confirmed",
    },
    {
      id: "2",
      date: "2024-01-28",
      time: "14:30",
      doctor: "李医生",
      department: "内分泌科",
      type: "常规检查",
      status: "pending",
    },
    {
      id: "3",
      date: "2024-02-02",
      time: "10:15",
      doctor: "王医生",
      department: "眼科",
      type: "视力检查",
      status: "confirmed",
    },
  ])

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      date: "2024-01-20",
      type: "体检报告",
      description: "年度健康体检，各项指标正常",
      doctor: "体检中心",
      status: "completed",
    },
    {
      id: "2",
      date: "2024-01-15",
      type: "血液检查",
      description: "血常规检查，血糖血脂正常",
      doctor: "张医生",
      status: "completed",
    },
    {
      id: "3",
      date: "2024-01-10",
      type: "心电图",
      description: "心电图检查，心律正常",
      doctor: "李医生",
      status: "completed",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500/20 border-green-400/30"
      case "warning":
        return "bg-yellow-500/20 border-yellow-400/30"
      case "critical":
        return "bg-red-500/20 border-red-400/30"
      default:
        return "bg-gray-500/20 border-gray-400/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-200 border-green-400/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
      case "completed":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30"
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30"
    }
  }

  const toggleMedication = (medicationId: string) => {
    setMedications((prev) => prev.map((med) => (med.id === medicationId ? { ...med, taken: !med.taken } : med)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-800 to-red-900 p-4">
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
                <Heart className="w-8 h-8 text-red-400" />
                智享健康管理中心
              </h1>
              <p className="text-red-200 mt-1">科技守护健康，智慧点亮生命</p>
            </div>
          </div>
          <Badge className="bg-red-500/20 text-red-200 border-red-400/30">
            {healthMetrics.filter((m) => m.status === "normal").length} / {healthMetrics.length} 指标正常
          </Badge>
        </motion.div>

        {/* 健康指标概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {healthMetrics.map((metric, index) => {
            const Icon = metric.icon
            const progressValue = ((metric.value - metric.range.min) / (metric.range.max - metric.range.min)) * 100
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-8 h-8 ${metric.color}`} />
                        <div>
                          <h3 className="text-white font-semibold">{metric.name}</h3>
                          <p className="text-white/60 text-sm">{metric.lastUpdate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <Badge className={getStatusBg(metric.status)}>
                          {metric.status === "normal" ? "正常" : metric.status === "warning" ? "警告" : "异常"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{metric.value}</span>
                        <span className="text-white/50">{metric.unit}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-white/60">
                          <span>{metric.range.min}</span>
                          <span>正常范围</span>
                          <span>{metric.range.max}</span>
                        </div>
                        <Progress value={Math.max(0, Math.min(100, progressValue))} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-500/30">
              健康仪表盘
            </TabsTrigger>
            <TabsTrigger value="medications" className="data-[state=active]:bg-red-500/30">
              用药管理
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-red-500/30">
              预约挂号
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-red-500/30">
              健康档案
            </TabsTrigger>
            <TabsTrigger value="ai-services" className="data-[state=active]:bg-red-500/30">
              AI服务
            </TabsTrigger>
          </TabsList>

          {/* 健康仪表盘 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 今日健康摘要 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    今日健康摘要
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white">步数目标</span>
                      </div>
                      <span className="text-green-400 font-semibold">85%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white">用药提醒</span>
                      </div>
                      <span className="text-green-400 font-semibold">已完成</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">睡眠质量</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">良好</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white">体重记录</span>
                      </div>
                      <span className="text-green-400 font-semibold">已更新</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 健康趋势图 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-400" />
                    健康趋势分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>健康趋势图表将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 快速操作 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-red-500 to-pink-400 hover:opacity-90">
                    <Stethoscope className="w-6 h-6" />
                    <span>健康检测</span>
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90">
                    <Calendar className="w-6 h-6" />
                    <span>预约挂号</span>
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90">
                    <Pill className="w-6 h-6" />
                    <span>用药提醒</span>
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-violet-400 hover:opacity-90">
                    <Brain className="w-6 h-6" />
                    <span>AI咨询</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用药管理 */}
          <TabsContent value="medications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 用药列表 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-red-400" />
                    当前用药
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medications.map((medication, index) => (
                      <motion.div
                        key={medication.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-400 rounded-full flex items-center justify-center">
                          <Pill className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{medication.name}</h4>
                            <Switch
                              checked={medication.taken}
                              onCheckedChange={() => toggleMedication(medication.id)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                            <span>剂量: {medication.dosage}</span>
                            <span>频次: {medication.frequency}</span>
                            <span>下次服药: {medication.nextDose}</span>
                            <span className={medication.taken ? "text-green-400" : "text-yellow-400"}>
                              {medication.taken ? "已服用" : "待服用"}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                          详情
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 用药提醒设置 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-400" />
                    提醒设置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">用药提醒</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">声音提醒</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">振动提醒</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">邮件提醒</span>
                      <Switch />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-3">提醒时间</h4>
                      <div className="space-y-2 text-sm text-white/70">
                        <div>早晨: 08:00</div>
                        <div>中午: 12:00</div>
                        <div>晚上: 20:00</div>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-400 hover:opacity-90">
                      保存设置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 预约挂号 */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 预约列表 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-400" />
                    我的预约
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <User className="w-8 h-8 text-red-400" />
                            <div>
                              <h4 className="text-white font-semibold">{appointment.doctor}</h4>
                              <p className="text-white/60 text-sm">{appointment.department}</p>
                            </div>
                          </div>
                          <Badge className={getAppointmentStatusColor(appointment.status)}>
                            {appointment.status === "confirmed"
                              ? "已确认"
                              : appointment.status === "pending"
                                ? "待确认"
                                : "已完成"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </span>
                          <span className="col-span-2">类型: {appointment.type}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                            详情
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                            改期
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 快速预约 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-400" />
                    快速预约
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "内科", icon: Stethoscope, color: "from-blue-500 to-cyan-400" },
                        { name: "外科", icon: Activity, color: "from-green-500 to-teal-400" },
                        { name: "心内科", icon: Heart, color: "from-red-500 to-pink-400" },
                        { name: "眼科", icon: Eye, color: "from-purple-500 to-violet-400" },
                      ].map((dept, index) => {
                        const Icon = dept.icon
                        return (
                          <Button
                            key={index}
                            className={`h-20 flex flex-col gap-2 bg-gradient-to-r ${dept.color} hover:opacity-90`}
                          >
                            <Icon className="w-6 h-6" />
                            <span>{dept.name}</span>
                          </Button>
                        )
                      })}
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-3">在线咨询</h4>
                      <div className="space-y-2">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          图文咨询
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          电话咨询
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 健康档案 */}
          <TabsContent value="records" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-400" />
                  健康档案
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-400 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{record.type}</h4>
                          <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                            {record.status === "completed"
                              ? "已完成"
                              : record.status === "pending"
                                ? "待处理"
                                : "已取消"}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm mb-2">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.doctor}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                        查看详情
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI服务 */}
          <TabsContent value="ai-services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI健康诊断",
                  description: "基于症状描述进行初步健康评估",
                  icon: Brain,
                  color: "from-purple-500 to-violet-400",
                  features: ["症状分析", "疾病预测", "就医建议", "风险评估"],
                },
                {
                  title: "智能健康监测",
                  description: "24小时实时健康数据监控分析",
                  icon: Activity,
                  color: "from-blue-500 to-cyan-400",
                  features: ["实时监控", "异常预警", "趋势分析", "健康报告"],
                },
                {
                  title: "远程医疗咨询",
                  description: "在线医生咨询和远程诊疗服务",
                  icon: Stethoscope,
                  color: "from-green-500 to-teal-400",
                  features: ["在线问诊", "视频咨询", "处方开具", "复诊跟踪"],
                },
                {
                  title: "智能用药管理",
                  description: "个性化用药方案和智能提醒",
                  icon: Pill,
                  color: "from-orange-500 to-red-400",
                  features: ["用药提醒", "剂量管理", "副作用监控", "药物相互作用"],
                },
              ].map((service, index) => {
                const Icon = service.icon
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
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                            <p className="text-white/60 text-sm">{service.description}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/80 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button className={`w-full mt-4 bg-gradient-to-r ${service.color} hover:opacity-90`}>
                          立即使用
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* AI健康助手 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-red-400" />
                  AI健康助手
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-400 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">智能健康助手</h4>
                      <p className="text-white/60 text-sm">我是您的专属健康顾问，有什么健康问题都可以问我</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-white/80 text-sm">
                        您好！我注意到您今天的心率略有升高，建议您注意休息。需要我为您分析一下可能的原因吗？
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90">
                        分析原因
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        健康建议
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        预约医生
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="输入您的健康问题..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-red-400/50"
                  />
                  <Button className="bg-gradient-to-r from-red-500 to-pink-400 hover:opacity-90">发送</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
