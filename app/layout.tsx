import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "言语云³ - YanYu Cloud³ 智能交互平台",
  description: "万象归源于云枢，深栈智启新纪元 - 专业的AI智能交互与创作平台",
  keywords: "言语云,YanYu Cloud,AI交互,智能创作,云计算平台",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
