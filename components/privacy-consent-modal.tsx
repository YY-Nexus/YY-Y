"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PrivacyPolicy } from "@/components/privacy-policy"
import { Shield, FileText, CheckCircle, AlertCircle, X } from "lucide-react"

interface PrivacyConsentModalProps {
  isOpen: boolean
  onConsent: () => void
  onDecline?: () => void
}

export function PrivacyConsentModal({ isOpen, onConsent, onDecline }: PrivacyConsentModalProps) {
  const [showFullPolicy, setShowFullPolicy] = useState(false)
  const [hasRead, setHasRead] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleConsent = () => {
    onConsent()
  }

  // 必须同时勾选两个复选框才能继续
  const canProceed = hasRead && agreedToTerms

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // 点击背景关闭弹窗
            if (e.target === e.currentTarget && onDecline) {
              onDecline()
            }
          }}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!showFullPolicy ? (
              <>
                {/* 固定头部 */}
                <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    {onDecline && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDecline}
                        className="rounded-full w-8 h-8 p-0 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">欢迎使用 YYC³ NetTrack</h2>
                  <p className="text-muted-foreground">在开始使用我们的网络监测工具前，请了解我们的隐私政策</p>
                </div>

                {/* 可滚动内容区域 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        隐私政策要点
                      </CardTitle>
                      <CardDescription>我们承诺保���您的隐私，以下是关键信息</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-800">本地优先</h4>
                            <p className="text-sm text-green-700">测试数据主要存储在您的设备本地</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-800">数据安全</h4>
                            <p className="text-sm text-blue-700">采用加密技术保护数据���输</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-purple-800">最少收集</h4>
                            <p className="text-sm text-purple-700">仅收集提供服务必需的信息</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <FileText className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-orange-800">透明公开</h4>
                            <p className="text-sm text-orange-700">清楚说明数据使用目的</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">我们收集的信息</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• 网络测试数据（速度、延迟、连接质量）</li>
                          <li>• 输入的查询数据（IP地址、域名等）</li>
                          <li>• 基本设备信息（浏览器类型、操作系统）</li>
                          <li>• 匿名化的使用统计信息</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">数据使用目的</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 提供网络测速、诊断、安全检测等核心服务</li>
                          <li>• 分析和改进服务质量，优化用户体验</li>
                          <li>• 生成匿名化统计报告，用于服务改进</li>
                          <li>• 确保平台安全性，防范恶意攻击和滥用</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">您的权利</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 您有权查看我们收集的关于您的信息</li>
                          <li>• 您可以要求更正不准确的个人信息</li>
                          <li>• 您可以要求删除您的个人数据</li>
                          <li>• 您可以随时撤回对数据处理的同意</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 同意选项 */}
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-3">⚠️ 请完成以下两个步骤才能继续使用：</div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="read-policy"
                        checked={hasRead}
                        onCheckedChange={(checked) => setHasRead(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="read-policy" className="text-sm font-medium leading-relaxed cursor-pointer">
                        <span className="text-red-600">*</span> 我已阅读并理解上述隐私要点
                        <Button
                          variant="link"
                          className="h-auto p-0 ml-1 text-blue-600 underline"
                          onClick={() => setShowFullPolicy(true)}
                        >
                          （查看完整隐私政策）
                        </Button>
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agree-terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="agree-terms" className="text-sm font-medium leading-relaxed cursor-pointer">
                        <span className="text-red-600">*</span> 我同意按照隐私政策收集和使用我的信息
                      </label>
                    </div>

                    {!canProceed && (hasRead || agreedToTerms) && (
                      <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 mt-2">
                        💡 请同时勾选上述两个选项才能继续使用平台功能
                      </div>
                    )}
                  </div>

                  {/* 进度指示器 */}
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            hasRead ? "bg-blue-500 scale-110" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-gray-500">已阅读</span>
                      </div>
                      <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            agreedToTerms ? "bg-blue-500 scale-110" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-gray-500">已同意</span>
                      </div>
                      <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            canProceed ? "bg-green-500 scale-110" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-gray-500">可继续</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 固定底部 */}
                <div className="flex-shrink-0 p-6 border-t bg-white">
                  <div className="flex gap-3">
                    <motion.div className="flex-1">
                      <Button
                        onClick={handleConsent}
                        disabled={!canProceed}
                        className={`w-full transition-all duration-300 ${
                          canProceed
                            ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                        whileHover={canProceed ? { scale: 1.02 } : {}}
                        whileTap={canProceed ? { scale: 0.98 } : {}}
                      >
                        {canProceed ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            同意并开始使用
                          </span>
                        ) : (
                          "请勾选上述两个选项后继续"
                        )}
                      </Button>
                    </motion.div>
                    {onDecline && (
                      <Button variant="outline" onClick={onDecline} className="px-6">
                        不同意
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      使用任何功能即表示您同意本隐私政策
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              /* 完整隐私政策页面 */
              <>
                {/* 固定头部 */}
                <div className="flex-shrink-0 p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">完整隐私政策</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowFullPolicy(false)}>
                        返回
                      </Button>
                      {onDecline && (
                        <Button variant="ghost" size="sm" onClick={onDecline} className="rounded-full w-8 h-8 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 可滚动的完整政策内容 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <PrivacyPolicy showHeader={false} compact={false} />
                  </div>
                </div>

                {/* 固定底部操作栏 */}
                <div className="flex-shrink-0 p-4 border-t bg-white">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setHasRead(true)
                        setShowFullPolicy(false)
                      }}
                      className="flex-1"
                    >
                      我已阅读完整政策
                    </Button>
                    <Button variant="outline" onClick={() => setShowFullPolicy(false)}>
                      返回
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
