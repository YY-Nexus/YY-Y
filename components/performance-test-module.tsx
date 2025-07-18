"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Zap, Clock, Play, BarChart3 } from "lucide-react"
import { UniversalQueryAnimation } from "@/components/universal-query-animation"

interface PerformanceMetrics {
  latency: number
  throughput: number
  packetLoss: number
  stability: number
  score: number
}

export function PerformanceTestModule() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  const runPerformanceTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setMetrics(null)

    try {
      // 模拟性能测试
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      const testMetrics: PerformanceMetrics = {
        latency: Math.random() * 50 + 10,
        throughput: Math.random() * 500 + 100,
        packetLoss: Math.random() * 5,
        stability: Math.random() * 30 + 70,
        score: 0,
      }

      // 计算综合评分
      testMetrics.score = Math.round(
        (100 - testMetrics.latency) * 0.3 +
          (testMetrics.throughput / 10) * 0.4 +
          (100 - testMetrics.packetLoss * 20) * 0.2 +
          testMetrics.stability * 0.1,
      )

      setMetrics(testMetrics)
    } catch (error) {
      console.error("性能测试失败:", error)
    } finally {
      setIsRunning(false)
      setProgress(0)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "优秀", color: "bg-green-100 text-green-800" }
    if (score >= 80) return { grade: "良好", color: "bg-blue-100 text-blue-800" }
    if (score >= 60) return { grade: "一般", color: "bg-yellow-100 text-yellow-800" }
    return { grade: "较差", color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">性能测试</h2>
        <p className="text-muted-foreground">全面评估网络性能和连接稳定性</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            网络性能评估
          </CardTitle>
          <CardDescription>测试网络延迟、吞吐量、稳定性等关键指标</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning && !metrics && (
            <div className="text-center">
              <Button onClick={runPerformanceTest} size="lg">
                <Play className="w-5 h-5 mr-2" />
                开始性能测试
              </Button>
            </div>
          )}

          {isRunning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center">
                <UniversalQueryAnimation
                  size="xl"
                  progress={progress}
                  showProgress={true}
                  showText={true}
                  text="正在测试网络性能"
                  subText="评估延迟、吞吐量和稳定性..."
                  variant="wave"
                  color="green"
                  icon={<TrendingUp className="w-12 h-12 text-green-600" />}
                />
              </div>
            </motion.div>
          )}

          {metrics && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* 综合评分 */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(metrics.score)} mb-2`}>{metrics.score}</div>
                <Badge className={getScoreGrade(metrics.score).color}>{getScoreGrade(metrics.score).grade}</Badge>
              </div>

              {/* 详细指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">网络延迟</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{metrics.latency.toFixed(1)}ms</div>
                    <Progress value={Math.max(0, 100 - metrics.latency * 2)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">吞吐量</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{metrics.throughput.toFixed(0)} Mbps</div>
                    <Progress value={Math.min(100, metrics.throughput / 5)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">丢包率</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{metrics.packetLoss.toFixed(2)}%</div>
                    <Progress value={Math.max(0, 100 - metrics.packetLoss * 20)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">稳定性</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{metrics.stability.toFixed(1)}%</div>
                    <Progress value={metrics.stability} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button onClick={runPerformanceTest} variant="outline">
                  重新测试
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
