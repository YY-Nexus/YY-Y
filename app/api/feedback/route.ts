import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import nodemailer from "nodemailer"
import { withApiHandler, createApiResponse, validateRequest, ApiError, setCache, getCache } from "@/lib/api-utils"

// 反馈数据验证模式
const feedbackSchema = z.object({
  type: z.enum(["bug", "suggestion", "compliment", "question", "other", "contact"]),
  title: z.string().min(1, "标题不能为空").max(200, "标题不能超过200字符"),
  content: z.string().min(1, "内容不能为空").max(2000, "内容不能超过2000字符"),
  rating: z.number().min(1).max(5).optional(),
  email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
  name: z.string().max(100, "姓名不能超过100字符").optional().or(z.literal("")),
  allowContact: z.boolean().default(false),
  userAgent: z.string().optional(),
  timestamp: z.string(),
})

type FeedbackData = z.infer<typeof feedbackSchema>

// 邮件传输器缓存
let transporter: nodemailer.Transporter | null = null

function getEmailTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.exmail.qq.com",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true, // 启用连接池
      maxConnections: 5, // 最大连接数
      maxMessages: 100, // 每个连接最大消息数
    })
  }
  return transporter
}

function generateEmailContent(data: FeedbackData): string {
  const typeLabels: { [key: string]: string } = {
    bug: "问题报告",
    suggestion: "功能建议",
    compliment: "表扬反馈",
    question: "使用咨询",
    other: "其他反馈",
    contact: "联系请求",
  }

  const ratingText = data.rating
    ? `⭐ 用户评分: ${data.rating}/5 (${
        data.rating === 5
          ? "非常满意"
          : data.rating === 4
            ? "满意"
            : data.rating === 3
              ? "一般"
              : data.rating === 2
                ? "不满意"
                : "非常不满意"
      })`
    : ""

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>YYC³ NetTrack 用户反馈</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h2 { margin: 0 0 10px 0; font-size: 24px; }
        .header p { margin: 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #555; margin-bottom: 8px; display: block; }
        .value { padding: 12px 16px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea; }
        .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 10px; }
        .priority-high { background: #fee2e2; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #d97706; }
        .priority-low { background: #dcfce7; color: #16a34a; }
        .footer { background: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .footer h4 { margin: 0 0 15px 0; color: #334155; }
        .footer ul { margin: 0; padding-left: 20px; }
        .footer li { margin-bottom: 8px; color: #64748b; }
        .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
        .meta { font-size: 12px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 YYC³ NetTrack 用户反馈</h2>
            <p>收到新的用户反馈，请及时处理</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">反馈类型</span>
                <div class="value">
                    ${typeLabels[data.type] || data.type}
                    <span class="priority ${data.type === "bug" ? "priority-high" : data.type === "contact" ? "priority-medium" : "priority-low"}">
                        ${data.type === "bug" ? "高优先级" : data.type === "contact" ? "中优先级" : "普通优先级"}
                    </span>
                </div>
            </div>
            
            <div class="field">
                <span class="label">反馈标题</span>
                <div class="value">${data.title}</div>
            </div>
            
            <div class="field">
                <span class="label">详细内容</span>
                <div class="value">${data.content.replace(/\n/g, "<br>")}</div>
            </div>
            
            ${
              ratingText
                ? `
            <div class="field">
                <span class="label">用户评分</span>
                <div class="value">${ratingText}</div>
            </div>
            `
                : ""
            }
            
            ${
              data.name
                ? `
            <div class="field">
                <span class="label">用户姓名</span>
                <div class="value">${data.name}</div>
            </div>
            `
                : ""
            }
            
            ${
              data.email
                ? `
            <div class="field">
                <span class="label">联系邮箱</span>
                <div class="value">${data.email}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
                <span class="label">后续联系</span>
                <div class="value">${data.allowContact ? "✅ 用户同意后续联系" : "❌ 用户不希望被联系"}</div>
            </div>
            
            <div class="field">
                <span class="label">提交时间</span>
                <div class="value">${new Date(data.timestamp).toLocaleString("zh-CN", {
                  timeZone: "Asia/Shanghai",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}</div>
            </div>
            
            ${
              data.userAgent
                ? `
            <div class="field">
                <span class="label">用户环境</span>
                <div class="value" style="font-size: 11px; color: #6b7280; font-family: monospace;">${data.userAgent}</div>
            </div>
            `
                : ""
            }
        </div>
        
        <div class="footer">
            <h4>📋 处理建议</h4>
            <ul>
                ${data.type === "bug" ? "<li>🔴 <strong>高优先级问题</strong>，建议24小时内响应并解决</li>" : ""}
                ${data.email && data.allowContact ? "<li>📧 用户同意后续联系，可直接回复此邮件进行沟通</li>" : ""}
                ${data.type === "suggestion" ? "<li>💡 功能建议，建议纳入产品规划并评估可行性</li>" : ""}
                ${data.type === "compliment" ? "<li>❤️ 用户表扬，可用于产品推广和团队激励</li>" : ""}
                ${data.type === "contact" ? "<li>📞 用户主动联系请求，建议优先处理</li>" : ""}
                <li>📊 建议将反馈内容录入知识库，用于产品改进</li>
            </ul>
            <div class="divider"></div>
            <div class="meta">
                <p>此邮件由 YYC³ NetTrack 反馈系统自动发送</p>
                <p>平台地址: <a href="https://yyc3.com" style="color: #667eea;">https://yyc3.com</a></p>
                <p>如需技术支持，请联系开发团队</p>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim()
}

async function sendFeedbackEmail(
  content: string,
  data: FeedbackData,
): Promise<{ success: boolean; messageId?: string }> {
  const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL || "china@0379.email"

  try {
    const transporter = getEmailTransporter()

    // 验证邮件配置
    await transporter.verify()

    const mailOptions = {
      from: `"YYC³ NetTrack 反馈系统" <${process.env.SMTP_USER}>`,
      to: FEEDBACK_EMAIL,
      subject: `[YYC³反馈] ${data.type === "bug" ? "🔴" : data.type === "suggestion" ? "💡" : data.type === "contact" ? "📞" : "📝"} ${data.title}`,
      html: content,
      replyTo: data.email && data.allowContact ? data.email : undefined,
      headers: {
        "X-Priority": data.type === "bug" ? "1" : "3",
        "X-MSMail-Priority": data.type === "bug" ? "High" : "Normal",
      },
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("✅ 邮件发送成功:", result.messageId)

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("❌ SMTP邮件发送失败:", error)

    // 记录到服务器日志作为备用
    console.log("=== 用户反馈记录 ===")
    console.log(`时间: ${new Date(data.timestamp).toLocaleString()}`)
    console.log(`类型: ${data.type}`)
    console.log(`标题: ${data.title}`)
    console.log(`内容: ${data.content}`)
    console.log(`用户: ${data.name || "匿名"} (${data.email || "无邮箱"})`)
    console.log("==================")

    // 即使邮件发送失败，也返回成功以免影响用户体验
    return { success: true }
  }
}

// 主处理函数
async function handleFeedback(request: NextRequest): Promise<NextResponse> {
  // 验证请求数据
  const validate = validateRequest(feedbackSchema)
  const feedbackData = await validate(request)

  // 检查缓存，防止重复提交
  const cacheKey = `feedback:${feedbackData.timestamp}:${feedbackData.title}`
  const cached = getCache(cacheKey)
  if (cached) {
    throw new ApiError("请勿重复提交相同的反馈", 409, "DUPLICATE_SUBMISSION")
  }

  // 生成邮件内容
  const emailContent = generateEmailContent(feedbackData)

  // 发送邮件
  const emailResult = await sendFeedbackEmail(emailContent, feedbackData)

  // 缓存请求，防止重复提交（5分钟）
  setCache(cacheKey, true, 300000)

  // 生成反馈ID
  const feedbackId = `FB${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  return NextResponse.json(
    createApiResponse(
      {
        feedbackId,
        messageId: emailResult.messageId,
        status: "submitted",
      },
      "反馈已成功提交，我们将尽快处理您的反馈",
    ),
  )
}

// 导出处理器
export const POST = withApiHandler(handleFeedback)

// 健康检查
export const GET = withApiHandler(async () => {
  return NextResponse.json(
    createApiResponse({
      service: "feedback",
      status: "healthy",
      version: "1.0.0",
      endpoints: {
        POST: "提交反馈",
        GET: "健康检查",
      },
    }),
  )
})
