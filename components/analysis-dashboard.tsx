"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Palette,
  Lock,
  Zap,
  Users,
  Shield,
  Cpu,
} from "lucide-react"
import { FEATURE_COMPLETENESS_REPORT, GLOBAL_COMPLETENESS_STATS } from "../analysis/feature-completeness-analysis"
import { IMPROVEMENT_ROADMAP, KEY_SUCCESS_INDICATORS } from "../analysis/improvement-roadmap"
import { LOCKED_DESIGN_SYSTEM, DESIGN_LOCK_STATUS } from "../analysis/ui-design-analysis"

export function AnalysisDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const getStatusColor = (completeness: number) => {
    if (completeness >= 90) return "text-green-600 bg-green-50"
    if (completeness >= 70) return "text-blue-600 bg-blue-50"
    if (completeness >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 标题区域 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              YYC³ NetTrack 全局分析报告
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            基于当前UI设计风格锁定的功能完整度深度分析与改进路线图规划
          </p>

          {/* 设计系统锁定状态 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-200"
          >
            <Lock className="w-4 h-4" />
            <span className="font-medium">设计系统已锁定</span>
            <Badge variant="secondary" className="text-xs">
              v{DESIGN_LOCK_STATUS.version}
            </Badge>
          </motion.div>
        </motion.div>

        {/* 全局统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                总体完整度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {GLOBAL_COMPLETENESS_STATS.overallCompleteness}%
              </div>
              <Progress value={GLOBAL_COMPLETENESS_STATS.overallCompleteness} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                已完成功能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {GLOBAL_COMPLETENESS_STATS.completedFeatures}
              </div>
              <p className="text-sm text-gray-500">核心功能模块</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                待完善功能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{GLOBAL_COMPLETENESS_STATS.partialFeatures}</div>
              <p className="text-sm text-gray-500">部分实现</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                缺失功能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">{GLOBAL_COMPLETENESS_STATS.missingFeatures}</div>
              <p className="text-sm text-gray-500">需要开发</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              功能模块
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              设计系统
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              改进路线图
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              成功指标
            </TabsTrigger>
          </TabsList>

          {/* 功能模块分析 */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid gap-6">
              {FEATURE_COMPLETENESS_REPORT.map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{module.chineseName}</CardTitle>
                          <CardDescription className="text-sm text-gray-500">{module.name}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(module.completeness)}>{module.completeness}% 完成</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={module.completeness} className="h-3" />

                      {/* 详细指标 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>用户体验: {module.userExperience}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span>性能: {module.performance}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-500" />
                          <span>安全性: {module.security}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-500" />
                          <span>可访问性: {module.accessibility}%</span>
                        </div>
                      </div>

                      {/* 缺失功能 */}
                      {module.missingFeatures.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">待开发功能:</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.missingFeatures.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {module.missingFeatures.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{module.missingFeatures.length - 3} 更多
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 设计系统 */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  设计系统锁定状态
                </CardTitle>
                <CardDescription>当前UI设计风格已锁定，确保视觉一致性和品牌统一性</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 锁定信息 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-1">锁定状态</h4>
                    <p className="text-sm text-green-600">{DESIGN_LOCK_STATUS.isLocked ? "已锁定" : "未锁定"}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">版本</h4>
                    <p className="text-sm text-blue-600">{DESIGN_LOCK_STATUS.version}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-1">审批团队</h4>
                    <p className="text-sm text-purple-600">{DESIGN_LOCK_STATUS.approvedBy}</p>
                  </div>
                </div>

                {/* 色彩系统 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">核心色彩系统</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">主色调</h5>
                      <div className="flex gap-2">
                        {LOCKED_DESIGN_SYSTEM.colorPalette.primary.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">辅助色</h5>
                      <div className="flex gap-2">
                        {LOCKED_DESIGN_SYSTEM.colorPalette.secondary.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">强调色</h5>
                      <div className="flex gap-2">
                        {LOCKED_DESIGN_SYSTEM.colorPalette.accent.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">中性色</h5>
                      <div className="flex gap-2">
                        {LOCKED_DESIGN_SYSTEM.colorPalette.neutral.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 字体系统 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">字体系统</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>字体族:</strong> {LOCKED_DESIGN_SYSTEM.typography.fontFamily}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {Object.entries(LOCKED_DESIGN_SYSTEM.typography.fontSizes).map(([size, value]) => (
                        <div key={size} className="flex items-center gap-2">
                          <span className="text-gray-500">{size}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 改进路线图 */}
          <TabsContent value="roadmap" className="space-y-6">
            {IMPROVEMENT_ROADMAP.map((phase, phaseIndex) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phaseIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{phase.chineseName}</CardTitle>
                    <CardDescription>
                      {phase.phase} • 预计时长: {phase.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 阶段目标 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">阶段目标:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {phase.goals.map((goal, idx) => (
                          <li key={idx}>{goal}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 关键任务 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">关键任务:</h4>
                      <div className="grid gap-3">
                        {phase.tasks.map((task, taskIndex) => (
                          <div
                            key={task.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-medium text-gray-800">{task.chineseTitle}</h5>
                                <p className="text-sm text-gray-500">{task.title}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {task.estimatedDays}天
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {task.tags.map((tag, tagIdx) => (
                                <Badge key={tagIdx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 成功指标 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">成功指标:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {phase.successMetrics.map((metric, idx) => (
                          <li key={idx}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* 成功指标 */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(KEY_SUCCESS_INDICATORS).map(([category, indicators]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {category === "technical" && "技术指标"}
                      {category === "user" && "用户指标"}
                      {category === "business" && "业务指标"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(indicators).map(([key, value]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 capitalize mb-1">
                            {key === "codeQuality" && "代码质量"}
                            {key === "testCoverage" && "测试覆盖率"}
                            {key === "performance" && "性能指标"}
                            {key === "security" && "安全指标"}
                            {key === "satisfaction" && "用户满意度"}
                            {key === "retention" && "用户留存"}
                            {key === "engagement" && "用户参与度"}
                            {key === "conversion" && "转化率"}
                            {key === "growth" && "增长率"}
                            {key === "revenue" && "收入转化"}
                            {key === "cost" && "成本优化"}
                            {key === "market" && "市场份额"}
                          </h4>
                          <p className="text-sm text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
