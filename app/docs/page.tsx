"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Code,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Zap,
  Shield,
  Monitor,
  MessageSquare,
  Wifi,
} from "lucide-react"

// 动态导入 SwaggerUI 以避免 SSR 问题
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
})

// 导入 Swagger UI 样式
import "swagger-ui-react/swagger-ui.css"

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 动态加载 Swagger 规范
    import("@/lib/swagger-config")
      .then((module) => {
        setSwaggerSpec(module.swaggerDefinition)
        setLoading(false)
      })
      .catch((err) => {
        console.error("加载 API 文档失败:", err)
        setError("加载 API 文档失败，请刷新页面重试")
        setLoading(false)
      })
  }, [])

  const downloadSpec = () => {
    if (!swaggerSpec) return

    const dataStr = JSON.stringify(swaggerSpec, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "yyc3-nettrack-api-spec.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">正在加载 API 文档...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">加载失败</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              重新加载
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">YYC³ NetTrack API 文档</h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                v1.0.0
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={downloadSpec} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>下载规范</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://yyc3.com", "_blank")}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>访问平台</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>概览</span>
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>交互式文档</span>
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>示例代码</span>
            </TabsTrigger>
            <TabsTrigger value="changelog" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>更新日志</span>
            </TabsTrigger>
          </TabsList>

          {/* 概览页面 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* API 特性卡片 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>安全可靠</span>
                  </CardTitle>
                  <CardDescription>完整的请求验证、错误处理和安全防护机制</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 输入验证和类型检查</li>
                    <li>• 统一的错误响应格式</li>
                    <li>• 请求限流和防护</li>
                    <li>• 详细的日志记录</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <span>系统监控</span>
                  </CardTitle>
                  <CardDescription>实时的系统健康状态和性能指标监控</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 健康检查接口</li>
                    <li>• 性能指标统计</li>
                    <li>• 内存和CPU监控</li>
                    <li>• 缓存命中率分析</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span>用户反馈</span>
                  </CardTitle>
                  <CardDescription>完整的用户反馈收集和处理系统</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 多种反馈类型支持</li>
                    <li>• 自动邮件通知</li>
                    <li>• 重复提交防护</li>
                    <li>• 用户联系管理</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-orange-600" />
                    <span>网络测试</span>
                  </CardTitle>
                  <CardDescription>全面的网络速度和质量测试功能</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 上传/下载速度测试</li>
                    <li>• 延迟和抖动检测</li>
                    <li>• 网络质量评分</li>
                    <li>• 测试结果缓存</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>高性能</span>
                  </CardTitle>
                  <CardDescription>优化的API性能和响应速度</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 内存缓存系统</li>
                    <li>• 连接池复用</li>
                    <li>• 响应时间优化</li>
                    <li>• 并发处理能力</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-indigo-600" />
                    <span>开发友好</span>
                  </CardTitle>
                  <CardDescription>完整的类型定义和开发工具支持</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• TypeScript 类型支持</li>
                    <li>• OpenAPI 3.0 规范</li>
                    <li>• 详细的错误信息</li>
                    <li>• 交互式文档</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 快速开始 */}
            <Card>
              <CardHeader>
                <CardTitle>🚀 快速开始</CardTitle>
                <CardDescription>几分钟内开始使用 YYC³ NetTrack API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. 基础请求示例</h4>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {`curl -X GET "https://yyc3.com/api/health" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. 提交反馈示例</h4>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {`curl -X POST "https://yyc3.com/api/feedback" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "suggestion",
    "title": "功能建议",
    "content": "希望增加更多测试服务器",
    "allowContact": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'`}
                  </pre>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. 启动网络测试</h4>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {`curl -X POST "https://yyc3.com/api/network/test" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "comprehensive",
    "duration": 30,
    "options": {
      "downloadTest": true,
      "uploadTest": true,
      "latencyTest": true
    }
  }'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 交互式文档 */}
          <TabsContent value="interactive">
            <Card>
              <CardHeader>
                <CardTitle>🔧 交互式 API 文档</CardTitle>
                <CardDescription>直接在浏览器中测试和探索 API 接口</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="swagger-ui-container">
                  {swaggerSpec && (
                    <SwaggerUI
                      spec={swaggerSpec}
                      docExpansion="list"
                      defaultModelsExpandDepth={2}
                      defaultModelExpandDepth={2}
                      displayRequestDuration={true}
                      tryItOutEnabled={true}
                      filter={true}
                      showExtensions={true}
                      showCommonExtensions={true}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 示例代码 */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript/TypeScript</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    {`// 使用 fetch API
async function submitFeedback(feedback) {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('反馈提交成功:', result.data);
    } else {
      console.error('提交失败:', result.message);
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    {`import requests
import json

def submit_feedback(feedback_data):
    url = "https://yyc3.com/api/feedback"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(
            url, 
            headers=headers, 
            data=json.dumps(feedback_data)
        )
        
        result = response.json()
        
        if result.get('success'):
            print(f"反馈提交成功: {result['data']}")
        else:
            print(f"提交失败: {result['message']}")
            
    except Exception as e:
        print(f"请求错误: {e}")`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>React Hook 示例</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    {`import { useState } from 'react';

function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading, error };
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>cURL 命令</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    {`# 健康检查
curl -X GET "https://yyc3.com/api/health"

# 提交反馈
curl -X POST "https://yyc3.com/api/feedback" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "bug",
    "title": "发现问题",
    "content": "详细描述...",
    "allowContact": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'

# 网络测试
curl -X POST "https://yyc3.com/api/network/test" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "speed",
    "duration": 30
  }'`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 更新日志 */}
          <TabsContent value="changelog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📝 更新日志</CardTitle>
                <CardDescription>API 版本更新和功能变更记录</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="default">v1.0.0</Badge>
                    <span className="text-sm text-gray-500">2024-01-15</span>
                  </div>
                  <h4 className="font-semibold mb-2">🎉 首次发布</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 完整的 OpenAPI 3.0 规范</li>
                    <li>• 系统健康检查和监控接口</li>
                    <li>• 用户反馈收集和处理系统</li>
                    <li>• 网络测试和诊断功能</li>
                    <li>• 统一的错误处理和响应格式</li>
                    <li>• 完整的 TypeScript 类型定义</li>
                    <li>• 交互式 Swagger UI 文档</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">计划中</Badge>
                    <span className="text-sm text-gray-500">v1.1.0</span>
                  </div>
                  <h4 className="font-semibold mb-2">🔮 即将推出</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• WebSocket 实时通信支持</li>
                    <li>• 更多网络诊断功能</li>
                    <li>• API 密钥认证系统</li>
                    <li>• 批量操作接口</li>
                    <li>• 数据导出功能</li>
                    <li>• 更详细的监控指标</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
