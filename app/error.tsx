"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { StaticTechBackground } from "@/components/static-tech-background"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("应用错误:", error)
  }, [error])

  return (
    <StaticTechBackground variant="minimal">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">应用加载错误</CardTitle>
            <CardDescription>抱歉，应用在加载过程中遇到了问题</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">错误详情</h4>
              <p className="text-sm text-red-700 font-mono">{error.message || "未知错误"}</p>
              {error.digest && <p className="text-xs text-red-600 mt-2">错误ID: {error.digest}</p>}
            </div>

            <div className="space-y-2">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">如果问题持续存在，请联系技术支持</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticTechBackground>
  )
}
