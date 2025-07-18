"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { StaticTechBackground } from "@/components/static-tech-background"

export default function NotFound() {
  return (
    <StaticTechBackground variant="minimal">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <BrandLogo size="md" showText={true} interactive={false} className="justify-center mb-4" />
            <CardTitle className="text-2xl">页面未找到</CardTitle>
            <CardDescription>抱歉，您访问的页面不存在</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
              <p className="text-muted-foreground mb-6">页面可能已被移动或删除</p>
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={() => (window.location.href = "/")}>
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                <Search className="w-4 h-4 mr-2" />
                返回上页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticTechBackground>
  )
}
