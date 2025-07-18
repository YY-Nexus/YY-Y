"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Car,
  Leaf,
  Zap,
  Droplets,
  Shield,
  Users,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  MapPin,
  Clock,
  BarChart,
  Map,
  Server,
  Settings,
  RefreshCw,
  Calendar,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface CityMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical"
  icon: any
  color: string
}

interface SystemStatus {
  id: string
  name: string
  status: "online" | "warning" | "offline"
  uptime: number
  lastUpdate: string
  icon: any
}

interface Alert {
  id: string
  type: "warning" | "info" | "success" | "error"
  message: string
  time: string
  location: string
}

interface SensorData {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  lastUpdate: string
  location: string
}

export default function SmartCityPage() {
  const router = useRouter()

  const [cityMetrics, setCityMetrics] = useState<CityMetric[]>([
    {
      id: "1",
      name: "人口总数",
      value: 1250000,
      unit: "人",
      trend: "up",
      status: "good",
      icon: Users,
      color: "text-blue-400",
    },
    {
      id: "2",
      name: "空气质量指数",
      value: 45,
      unit: "AQI",
      trend: "down",
      status: "good",
      icon: Leaf,
      color: "text-green-400",
    },
    {
      id: "3",
      name: "交通拥堵指数",
      value: 3.2,
      unit: "/10",
      trend: "stable",
      status: "warning",
      icon: Car,
      color: "text-yellow-400",
    },
    {
      id: "4",
      name: "能源消耗",
      value: 2850,
      unit: "MWh",
      trend: "down",
      status: "good",
      icon: Zap,
      color: "text-purple-400",
    },
    {
      id: "5",
      name: "水资源利用率",
      value: 78,
      unit: "%",
      trend: "up",
      status: "good",
      icon: Droplets,
      color: "text-cyan-400",
    },
    {
      id: "6",
      name: "安全事件",
      value: 12,
      unit: "起",
      trend: "down",
      status: "good",
      icon: Shield,
      color: "text-red-400",
    },
  ])

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { id: "1", name: "交通管理系统", status: "online", uptime: 99.8, lastUpdate: "2分钟前", icon: Car },
    { id: "2", name: "环境监测系统", status: "online", uptime: 99.5, lastUpdate: "1分钟前", icon: Leaf },
    { id: "3", name: "能源管理系统", status: "warning", uptime: 97.2, lastUpdate: "5分钟前", icon: Zap },
    { id: "4", name: "水务管理系统", status: "online", uptime: 99.9, lastUpdate: "30秒前", icon: Droplets },
    { id: "5", name: "安全监控系统", status: "online", uptime: 99.7, lastUpdate: "1分钟前", icon: Shield },
    { id: "6", name: "人口管理系统", status: "online", uptime: 98.8, lastUpdate: "3分钟前", icon: Users },
  ])

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", type: "warning", message: "第三区域交通流量异常增高", time: "5分钟前", location: "中心商业区" },
    { id: "2", type: "info", message: "空气质量监测站点维护完成", time: "15分钟前", location: "工业园区" },
    { id: "3", type: "success", message: "能源消耗较昨日下降12%", time: "1小时前", location: "全市" },
  ])

  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      id: "s1",
      name: "东门交通传感器",
      value: 85,
      unit: "km/h",
      status: "normal",
      lastUpdate: "45秒前",
      location: "东门大道",
    },
    {
      id: "s2",
      name: "北湖水质监测站",
      value: 6.8,
      unit: "pH",
      status: "normal",
      lastUpdate: "2分钟前",
      location: "北湖公园",
    },
    {
      id: "s3",
      name: "南区空气质量站",
      value: 58,
      unit: "AQI",
      status: "warning",
      lastUpdate: "1分钟前",
      location: "南区广场",
    },
    {
      id: "s4",
      name: "中央变电站",
      value: 92,
      unit: "%",
      status: "normal",
      lastUpdate: "30秒前",
      location: "中央商务区",
    },
    {
      id: "s5",
      name: "西湖水位监测",
      value: 3.2,
      unit: "米",
      status: "normal",
      lastUpdate: "50秒前",
      location: "西湖景区",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 border-green-400/30"
      case "warning":
        return "bg-yellow-500/20 border-yellow-400/30"
      case "offline":
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-blue-400" />
    }
  }

  const getSensorStatusColor = (status: string) => {
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

  const refreshData = () => {
    // 模拟数据刷新
    setCityMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value:
          metric.trend === "up" ? metric.value * 1.01 : metric.trend === "down" ? metric.value * 0.99 : metric.value,
      })),
    )

    setAlerts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "info",
        message: "系统数据已刷新",
        time: "刚刚",
        location: "全市",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-900 p-4">
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
                <Building2 className="w-8 h-8 text-blue-400" />
                智慧城市管理中心
              </h1>
              <p className="text-blue-200 mt-1">数据驱动城市治理，智慧点亮美好生活</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">
              {systemStatus.filter((s) => s.status === "online").length} / {systemStatus.length} 系统正常
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              className="text-white hover:bg-white/10 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/30">
              城市概览
            </TabsTrigger>
            <TabsTrigger value="systems" className="data-[state=active]:bg-blue-500/30">
              系统管理
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-500/30">
              实时监控
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/30">
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 城市概览 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 关键指标 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityMetrics.map((metric, index) => {
                const Icon = metric.icon
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
                          <Icon className={`w-8 h-8 ${metric.color}`} />
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-white/70 text-sm">{metric.name}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</span>
                            <span className="text-white/50 text-sm">{metric.unit}</span>
                          </div>
                          <Badge
                            className={`text-xs ${
                              metric.status === "good"
                                ? "bg-green-500/20 text-green-200 border-green-400/30"
                                : metric.status === "warning"
                                  ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                                  : "bg-red-500/20 text-red-200 border-red-400/30"
                            }`}
                          >
                            {metric.status === "good" ? "正常" : metric.status === "warning" ? "警告" : "异常"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* 实时警报 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  实时警报
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                        查看详情
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 系统管理 */}
          <TabsContent value="systems" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 系统状态总览 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    系统状态概览
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    {systemStatus.filter((s) => s.status === "online").length} 个系统正常运行，
                    {systemStatus.filter((s) => s.status === "warning").length} 个系统需要注意
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {systemStatus.map((system, index) => (
                      <motion.div
                        key={system.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBg(system.status)}`}
                        >
                          <system.icon className={`w-5 h-5 ${getStatusColor(system.status)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium">{system.name}</h4>
                            <Badge className={`text-xs ${getStatusBg(system.status)}`}>
                              {system.status === "online" ? "在线" : system.status === "warning" ? "警告" : "离线"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {system.lastUpdate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {system.uptime}% 可用性
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 系统性能监控 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-400" />
                    系统性能监控
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">过去24小时系统负载和响应时间</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-white/5 rounded-lg p-4">
                    {/* 这里应该是图表组件 */}
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>系统性能监控图表将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 系统配置 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  系统配置
                </CardTitle>
                <CardDescription className="text-white/60 text-sm">管理和配置智慧城市各子系统</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 系统配置卡片 */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Car className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">交通管理系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">配置交通流量监控、信号灯控制和智能停车系统</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Leaf className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">环境监测系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">管理空气质量、噪音和水质监测设备网络</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">能源管理系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">监控城市能源消耗，优化电网分配和智能用电</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Droplets className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">水务管理系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">监控水资源使用、污水处理和防洪预警系统</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">安全监控系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">管理公共安全摄像头网络和事件响应系统</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">人口管理系统</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">城市人口统计、流动分析和公共服务规划</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      配置
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 实时监控 */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 传感器数据 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    传感器实时数据
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">来自全市各监测点的实时数据</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {sensorData.map((sensor, index) => (
                      <motion.div
                        key={sensor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{sensor.name}</h4>
                          <Badge
                            className={`text-xs ${
                              sensor.status === "normal"
                                ? "bg-green-500/20 text-green-200 border-green-400/30"
                                : sensor.status === "warning"
                                  ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                                  : "bg-red-500/20 text-red-200 border-red-400/30"
                            }`}
                          >
                            {sensor.status === "normal" ? "正常" : sensor.status === "warning" ? "警告" : "严重"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-white">{sensor.value}</p>
                            <p className="text-white/60 text-sm">{sensor.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {sensor.lastUpdate}
                            </p>
                            <p className="text-white/60 text-sm flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {sensor.location}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 城市地图 */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-400" />
                    城市实时监控地图
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">全市传感器和监控点分布</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-white/5 rounded-lg p-4">
                    {/* 这里应该是地图组件 */}
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>城市地图将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 事件日志 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  最近事件日志
                </CardTitle>
                <CardDescription className="text-white/60 text-sm">系统记录的最近活动和事件</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 text-white/70">时间</th>
                        <th className="pb-3 text-white/70">事件类型</th>
                        <th className="pb-3 text-white/70">位置</th>
                        <th className="pb-3 text-white/70">描述</th>
                        <th className="pb-3 text-white/70 text-right">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(8)].map((_, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 text-white/80">
                            {`${Math.floor(Math.random() * 24)
                              .toString()
                              .padStart(2, "0")}:${Math.floor(Math.random() * 60)
                              .toString()
                              .padStart(2, "0")}`}
                          </td>
                          <td className="py-3 text-white">
                            {["交通事件", "环境监测", "能源消耗", "安全事件"][Math.floor(Math.random() * 4)]}
                          </td>
                          <td className="py-3 text-white/80">
                            {["中心区", "东区", "西区", "南区", "北区"][Math.floor(Math.random() * 5)]}
                          </td>
                          <td className="py-3 text-white/80">
                            {
                              ["交通流量异常", "空气质量下降", "能源消耗峰值", "安全监控触发"][
                                Math.floor(Math.random() * 4)
                              ]
                            }
                          </td>
                          <td className="py-3 text-right">
                            <Badge
                              className={`text-xs ${
                                Math.random() > 0.7
                                  ? "bg-red-500/20 text-red-200 border-red-400/30"
                                  : Math.random() > 0.5
                                    ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                                    : "bg-green-500/20 text-green-200 border-green-400/30"
                              }`}
                            >
                              {Math.random() > 0.7 ? "未处理" : Math.random() > 0.5 ? "处理中" : "已解决"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics" className="space-y-6">
            {/* 数据分析图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-400" />
                    城市关键指标趋势
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">近30天城市关键指标变化趋势</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    {/* 这里应该是图表组件 */}
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>趋势图表将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-400" />
                    资源消耗分析
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">城市能源和水资源消耗分布</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 bg-white/5 rounded-lg p-4">
                    {/* 这里应该是图表组件 */}
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <p>资源分析图表将在这里显示</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 预测分析 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  趋势预测分析
                </CardTitle>
                <CardDescription className="text-white/60 text-sm">基于历史数据的城市发展趋势预测</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 bg-white/5 rounded-lg p-4">
                  {/* 这里应该是图表组件 */}
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <p>预测分析图表将在这里显示</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 数据分析报告 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  数据分析报告
                </CardTitle>
                <CardDescription className="text-white/60 text-sm">生成和查看城市运行状况分析报告</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">日报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每日城市运行状况详细分析</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      生成报告
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">周报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每周城市运行趋势和问题分析</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                      生成报告
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      <h4 className="text-white font-medium">月报</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-3">每月城市综合运行状况分析</p>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
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
