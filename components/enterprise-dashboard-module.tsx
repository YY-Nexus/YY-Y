"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, Globe, AlertTriangle, TrendingUp, Settings, Bell, Download, BarChart3 } from "lucide-react"

interface NetworkNode {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "warning"
  latency: number
  bandwidth: number
  lastCheck: Date
}

interface AlertItem {
  id: string
  type: "critical" | "warning" | "info"
  message: string
  timestamp: Date
  resolved: boolean
}

export function EnterpriseDashboardModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")

  const networkNodes: NetworkNode[] = [
    {
      id: "node-1",
      name: "北京数据中心",
      location: "北京市朝阳区",
      status: "online",
      latency: 12.3,
      bandwidth: 1000,
      lastCheck: new Date(),
    },
    {
      id: "node-2",
      name: "上海分支机构",
      location: "上海市浦东新区",
      status: "warning",
      latency: 45.7,
      bandwidth: 500,
      lastCheck: new Date(),
    },
    {
      id: "node-3",
      name: "深圳办事处",
      location: "深圳市南山区",
      status: "online",
      latency: 23.1,
      bandwidth: 300,
      lastCheck: new Date(),
    },
  ]

  const alerts: AlertItem[] = [
    {
      id: "alert-1",
      type: "warning",
      message: "上海分支机构网络延迟异常，当前延迟45.7ms",
      timestamp: new Date(),
      resolved: false,
    },
    {
      id: "alert-2",
      type: "info",
      message: "深圳办事处完成网络设备升级",
      timestamp: new Date(Date.now() - 3600000),
      resolved: true,
    },
    {
      id: "alert-3",
      type: "critical",
      message: "检测到潜在的DDoS攻击尝试",
      timestamp: new Date(Date.now() - 7200000),
      resolved: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "offline":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">在线</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800">离线</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <Bell className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">企业网络监控中心</h2>
          <p className="text-muted-foreground">实时监控企业网络基础设施和性能指标</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Building className="w-3 h-3 mr-1" />
            企业版
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="nodes">节点监控</TabsTrigger>
          <TabsTrigger value="alerts">告警中心</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="settings">系统设置</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* 关键指标概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">网络节点</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-green-600">↗ 3个在线</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">活跃用户</span>
                </div>
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-green-600">↗ +8.3% 较昨日</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">平均带宽</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">856 Mbps</div>
                <div className="text-sm text-green-600">↗ +12.1% 较昨日</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">待处理告警</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-red-600">↗ +2 较昨日</div>
              </CardContent>
            </Card>
          </div>

          {/* 网络拓扑概览 */}
          <Card>
            <CardHeader>
              <CardTitle>网络拓扑状态</CardTitle>
              <CardDescription>企业网络节点实时状态监控</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {networkNodes.map((node) => (
                  <Card key={node.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{node.name}</h4>
                        {getStatusBadge(node.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>位置: {node.location}</div>
                        <div>
                          延迟: <span className={getStatusColor(node.status)}>{node.latency}ms</span>
                        </div>
                        <div>带宽: {node.bandwidth}Mbps</div>
                        <div>最后检查: {node.lastCheck.toLocaleTimeString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 实时告警 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                实时告警
              </CardTitle>
              <CardDescription>最新的系统告警和通知</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">{alert.timestamp.toLocaleString()}</div>
                    </div>
                    <Badge variant={alert.resolved ? "secondary" : "destructive"}>
                      {alert.resolved ? "已解决" : "待处理"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>网络节点详细监控</CardTitle>
              <CardDescription>查看所有网络节点的详细状态和性能指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkNodes.map((node) => (
                  <Card key={node.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{node.name}</h3>
                          <p className="text-sm text-muted-foreground">{node.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(node.status)}
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            配置
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{node.latency}ms</div>
                          <div className="text-sm text-blue-700">延迟</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{node.bandwidth}</div>
                          <div className="text-sm text-green-700">带宽(Mbps)</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">99.8%</div>
                          <div className="text-sm text-purple-700">可用性</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">156</div>
                          <div className="text-sm text-orange-700">连接数</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>告警管理中心</CardTitle>
              <CardDescription>管理和处理系统告警信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`border-l-4 ${
                      alert.type === "critical"
                        ? "border-l-red-500"
                        : alert.type === "warning"
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-sm text-muted-foreground">{alert.timestamp.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.resolved ? "secondary" : "destructive"}>
                            {alert.resolved ? "已解决" : "待处理"}
                          </Badge>
                          {!alert.resolved && (
                            <Button size="sm" variant="outline">
                              处理
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                企业网络分析
              </CardTitle>
              <CardDescription>深度分析企业网络使用模式和性能趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">流量分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Web浏览</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>视频会议</span>
                          <span>30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>文件传输</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>其他</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">成本分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium">月度网络成本</span>
                        <span className="text-xl font-bold text-blue-600">¥12,450</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="font-medium">较上月节省</span>
                        <span className="text-xl font-bold text-green-600">¥1,230</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                        <span className="font-medium">预计年度成本</span>
                        <span className="text-xl font-bold text-purple-600">¥149,400</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统配置</CardTitle>
              <CardDescription>配置企业网络监控系统参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">监控设置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">检查间隔</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>30秒</option>
                        <option>1分钟</option>
                        <option>5分钟</option>
                        <option>15分钟</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">告警阈值</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>延迟 > 100ms</option>
                        <option>延迟 > 200ms</option>
                        <option>延迟 > 500ms</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">通知设置</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">邮件通知</div>
                        <div className="text-sm text-gray-600">接收告警邮件通知</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">短信通知</div>
                        <div className="text-sm text-gray-600">紧急告警短信通知</div>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">微信通知</div>
                        <div className="text-sm text-gray-600">企业微信群通知</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button>保存设置</Button>
                  <Button variant="outline">重置默认</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
