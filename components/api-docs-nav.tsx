"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Globe, Monitor, MessageSquare, Wifi, FileText, Code2 } from "lucide-react"

interface ApiEndpoint {
  method: string
  path: string
  summary: string
  tags: string[]
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/health",
    summary: "系统健康检查",
    tags: ["系统监控"],
  },
  {
    method: "GET",
    path: "/monitor",
    summary: "获取系统监控指标",
    tags: ["系统监控"],
  },
  {
    method: "POST",
    path: "/feedback",
    summary: "提交用户反馈",
    tags: ["用户反馈"],
  },
  {
    method: "GET",
    path: "/feedback",
    summary: "反馈服务健康检查",
    tags: ["用户反馈"],
  },
  {
    method: "POST",
    path: "/network/test",
    summary: "启动网络测试",
    tags: ["网络测试"],
  },
  {
    method: "GET",
    path: "/network/test",
    summary: "获取测试结果",
    tags: ["网络测试"],
  },
]

const tagIcons = {
  系统监控: Monitor,
  用户反馈: MessageSquare,
  网络测试: Wifi,
}

const methodColors = {
  GET: "bg-green-100 text-green-800 border-green-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
}

export function ApiDocsNav() {
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set(["系统监控"]))

  const toggleTag = (tag: string) => {
    const newExpanded = new Set(expandedTags)
    if (newExpanded.has(tag)) {
      newExpanded.delete(tag)
    } else {
      newExpanded.add(tag)
    }
    setExpandedTags(newExpanded)
  }

  const groupedEndpoints = apiEndpoints.reduce(
    (acc, endpoint) => {
      endpoint.tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = []
        }
        acc[tag].push(endpoint)
      })
      return acc
    },
    {} as Record<string, ApiEndpoint[]>,
  )

  const scrollToEndpoint = (method: string, path: string) => {
    const elementId = `operations-${method.toLowerCase()}-${path.replace(/\//g, "_").replace(/[{}]/g, "")}`
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">API 接口</h2>
        </div>
        <p className="text-sm text-gray-600">点击接口名称快速跳转到对应文档</p>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(groupedEndpoints).map(([tag, endpoints]) => {
          const Icon = tagIcons[tag as keyof typeof tagIcons] || FileText
          const isExpanded = expandedTags.has(tag)

          return (
            <div key={tag} className="space-y-2">
              <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => toggleTag(tag)}>
                <div className="flex items-center space-x-2 w-full">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{tag}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {endpoints.length}
                  </Badge>
                </div>
              </Button>

              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {endpoints.map((endpoint, index) => (
                    <Button
                      key={`${endpoint.method}-${endpoint.path}-${index}`}
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto text-left"
                      onClick={() => scrollToEndpoint(endpoint.method, endpoint.path)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Badge
                          className={`text-xs font-mono px-2 py-1 ${methodColors[endpoint.method as keyof typeof methodColors]}`}
                        >
                          {endpoint.method}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-gray-900 truncate">{endpoint.path}</div>
                          <div className="text-xs text-gray-500 truncate">{endpoint.summary}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open("/api/docs", "_blank")}
          >
            <Code2 className="h-4 w-4 mr-2" />
            JSON 规范
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open("/docs/api-reference.md", "_blank")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Markdown 文档
          </Button>
        </div>
      </div>
    </div>
  )
}
