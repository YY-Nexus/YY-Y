"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Home,
  Lightbulb,
  Thermometer,
  Shield,
  Zap,
  Camera,
  Speaker,
  Fan,
  Tv,
  ArrowLeft,
  Settings,
  Activity,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Device {
  id: string
  name: string
  type: string
  status: boolean
  value?: number
  room: string
  icon: any
  color: string
}

interface Scene {
  id: string
  name: string
  description: string
  devices: string[]
  icon: any
  active: boolean
}

export default function SmartHomePage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "客厅主灯",
      type: "light",
      status: true,
      value: 80,
      room: "客厅",
      icon: Lightbulb,
      color: "text-yellow-400",
    },
    { id: "2", name: "空调", type: "ac", status: false, value: 24, room: "客厅", icon: Fan, color: "text-blue-400" },
    { id: "3", name: "智能电视", type: "tv", status: true, room: "客厅", icon: Tv, color: "text-purple-400" },
    { id: "4", name: "安防摄像头", type: "camera", status: true, room: "门口", icon: Camera, color: "text-green-400" },
    { id: "5", name: "智能音箱", type: "speaker", status: false, room: "卧室", icon: Speaker, color: "text-pink-400" },
    {
      id: "6",
      name: "卧室灯",
      type: "light",
      status: false,
      value: 60,
      room: "卧室",
      icon: Lightbulb,
      color: "text-yellow-400",
    },
  ])

  const [scenes, setScenes] = useState<Scene[]>([
    { id: "1", name: "回家模式", description: "开启客厅灯光和空调", devices: ["1", "2"], icon: Home, active: false },
    { id: "2", name: "离家模式", description: "关闭所有设备，开启安防", devices: ["4"], icon: Shield, active: false },
    { id: "3", name: "睡眠模式", description: "关闭客厅设备，调暗卧室灯", devices: ["6"], icon: Clock, active: false },
    { id: "4", name: "娱乐模式", description: "开启电视和音响系统", devices: ["3", "5"], icon: Tv, active: false },
  ])

  const [energyData, setEnergyData] = useState({
    today: 12.5,
    thisMonth: 345.2,
    savings: 23.8,
  })

  const toggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, status: !device.status } : device)),
    )
  }

  const updateDeviceValue = (deviceId: string, value: number) => {
    setDevices((prev) => prev.map((device) => (device.id === deviceId ? { ...device, value } : device)))
  }

  const activateScene = (sceneId: string) => {
    setScenes((prev) =>
      prev.map((scene) => ({
        ...scene,
        active: scene.id === sceneId ? !scene.active : false,
      })),
    )

    // 模拟场景激活效果
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene) {
      scene.devices.forEach((deviceId) => {
        setDevices((prev) => prev.map((device) => (device.id === deviceId ? { ...device, status: true } : device)))
      })
    }
  }

  const getRoomDevices = (room: string) => {
    return devices.filter((device) => device.room === room)
  }

  const rooms = Array.from(new Set(devices.map((device) => device.room)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 p-4">
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
                <Home className="w-8 h-8 text-green-400" />
                智能家居控制中心
              </h1>
              <p className="text-green-200 mt-1">让科技为生活添彩，让智慧点亮家园</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
            {devices.filter((d) => d.status).length} / {devices.length} 设备在线
          </Badge>
        </motion.div>

        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="devices" className="data-[state=active]:bg-green-500/30">
              设备控制
            </TabsTrigger>
            <TabsTrigger value="scenes" className="data-[state=active]:bg-green-500/30">
              场景模式
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-green-500/30">
              能耗统计
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-green-500/30">
              自动化
            </TabsTrigger>
          </TabsList>

          {/* 设备控制 */}
          <TabsContent value="devices" className="space-y-6">
            {rooms.map((room, roomIndex) => (
              <motion.div
                key={room}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: roomIndex * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Home className="w-5 h-5 text-green-400" />
                      {room}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getRoomDevices(room).map((device) => {
                        const Icon = device.icon
                        return (
                          <Card key={device.id} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Icon className={`w-5 h-5 ${device.color}`} />
                                  <span className="text-white font-medium">{device.name}</span>
                                </div>
                                <Switch checked={device.status} onCheckedChange={() => toggleDevice(device.id)} />
                              </div>

                              {device.value !== undefined && device.status && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-white/70">
                                    <span>
                                      {device.type === "light" ? "亮度" : device.type === "ac" ? "温度" : "数值"}
                                    </span>
                                    <span>
                                      {device.value}
                                      {device.type === "light" ? "%" : device.type === "ac" ? "°C" : ""}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[device.value]}
                                    onValueChange={(value) => updateDeviceValue(device.id, value[0])}
                                    max={device.type === "ac" ? 30 : 100}
                                    min={device.type === "ac" ? 16 : 0}
                                    step={1}
                                    className="w-full"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-3 text-xs text-white/50">
                                <span>{device.status ? "在线" : "离线"}</span>
                                <div
                                  className={`w-2 h-2 rounded-full ${device.status ? "bg-green-400" : "bg-gray-400"}`}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* 场景模式 */}
          <TabsContent value="scenes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenes.map((scene, index) => {
                const Icon = scene.icon
                return (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 ${
                        scene.active
                          ? "bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      } backdrop-blur-xl`}
                      onClick={() => activateScene(scene.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <Icon
                          className={`w-12 h-12 mx-auto mb-4 ${scene.active ? "text-green-400" : "text-white/70"}`}
                        />
                        <h3 className="text-white font-semibold mb-2">{scene.name}</h3>
                        <p className="text-white/60 text-sm mb-4">{scene.description}</p>
                        <Button
                          variant={scene.active ? "default" : "outline"}
                          size="sm"
                          className={
                            scene.active
                              ? "bg-green-500 hover:bg-green-400"
                              : "border-white/20 text-white hover:bg-white/10"
                          }
                        >
                          {scene.active ? "已激活" : "激活场景"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* 能耗统计 */}
          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    今日用电
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{energyData.today} kWh</div>
                  <p className="text-white/60 text-sm">比昨日节省 8.5%</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    本月用电
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{energyData.thisMonth} kWh</div>
                  <p className="text-white/60 text-sm">预计月底 420 kWh</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-400" />
                    节能效果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">¥{energyData.savings}</div>
                  <p className="text-white/60 text-sm">本月节省电费</p>
                </CardContent>
              </Card>
            </div>

            {/* 设备能耗排行 */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">设备能耗排行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "空调", consumption: 8.5, percentage: 68 },
                    { name: "智能电视", consumption: 2.1, percentage: 17 },
                    { name: "照明系统", consumption: 1.2, percentage: 10 },
                    { name: "其他设备", consumption: 0.7, percentage: 5 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-white/70 text-sm w-16 text-right">{item.consumption} kWh</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 自动化规则 */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "定时开关灯",
                  description: "每天 18:00 自动开启客厅灯，23:00 自动关闭",
                  status: true,
                  icon: Clock,
                },
                {
                  name: "温度自动调节",
                  description: "室温超过 26°C 时自动开启空调",
                  status: true,
                  icon: Thermometer,
                },
                {
                  name: "安防联动",
                  description: "检测到异常时自动开启所有灯光和警报",
                  status: false,
                  icon: Shield,
                },
                {
                  name: "节能模式",
                  description: "无人时自动关闭非必要设备",
                  status: true,
                  icon: Zap,
                },
              ].map((rule, index) => {
                const Icon = rule.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-green-400" />
                            <div>
                              <h3 className="text-white font-semibold">{rule.name}</h3>
                              <p className="text-white/60 text-sm mt-1">{rule.description}</p>
                            </div>
                          </div>
                          <Switch checked={rule.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">{rule.status ? "规则已启用" : "规则已禁用"}</span>
                          <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-500/20">
                            编辑规则
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
