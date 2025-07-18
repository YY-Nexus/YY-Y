import { NextResponse } from "next/server"
import { swaggerConfig } from "@/lib/swagger-config"

// 获取 OpenAPI 规范
export async function GET() {
  return NextResponse.json(swaggerConfig, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // 缓存1小时
    },
  })
}
