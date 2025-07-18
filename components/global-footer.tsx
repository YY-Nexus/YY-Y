"use client"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, MessageSquare } from "lucide-react"

interface GlobalFooterProps {
  onPrivacyClick?: () => void
  onFeedbackClick?: () => void
  className?: string
}

export function GlobalFooter({ onPrivacyClick, onFeedbackClick, className }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`mt-20 border-t bg-gray-50/50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <BrandLogo size="md" showText={true} interactive={false} variant="default" />
            <p className="text-sm text-gray-600 max-w-xs">专业的网络监测与诊断平台，提供全方位的网络性能分析服务。</p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">快速链接</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrivacyClick}
                className="justify-start p-0 h-auto text-gray-600 hover:text-gray-900"
              >
                <Shield className="w-4 h-4 mr-2" />
                隐私政策
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFeedbackClick}
                className="justify-start p-0 h-auto text-gray-600 hover:text-gray-900"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                意见反馈
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* 版权信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">© {currentYear} YYC³ NetTrack. 保留所有权利。</div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>使用即代表同意隐私协议</span>
            <Separator orientation="vertical" className="h-4" />
            <span>数据本地存储</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
