"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"
import { PrivacyConsentModal } from "@/components/privacy-consent-modal"
import { Shield, Lock, AlertTriangle } from "lucide-react"

interface FeatureGuardProps {
  children: React.ReactNode
  featureName: string
  description?: string
  requiresConsent?: boolean
}

export function FeatureGuard({ children, featureName, description, requiresConsent = true }: FeatureGuardProps) {
  const { hasConsented, isLoading, giveConsent, requiresConsent: needsConsent } = usePrivacyConsent()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (requiresConsent && needsConsent()) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[400px] p-8"
        >
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">需要隐私授权</CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  功能受限
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">访问"{featureName}"需要您的授权</h4>
                <p className="text-sm text-orange-700">
                  {description || "此功能需要收集和处理一些数据以提供服务。请阅读并同意我们的隐私政策后继续。"}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">使用此功能我们将：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>收集必要的测试数据</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>本地存储测试结果</span>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full max-w-xs">
                查看隐私政策并授权
              </Button>

              <p className="text-xs text-muted-foreground">点击授权即表示您同意我们的隐私政策和数据使用条款</p>
            </CardContent>
          </Card>
        </motion.div>

        <PrivacyConsentModal isOpen={true} onConsent={giveConsent} />
      </>
    )
  }

  return <>{children}</>
}
