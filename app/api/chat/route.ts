import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, settings } = await req.json()

    // 验证请求数据
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // 构建系统提示词
    const systemPrompt =
      settings?.systemPrompt ||
      `你是YanYuCloud³的智能AI助手，专注于为用户提供专业、友好、准确的帮助。

核心特性：
- 友善专业：始终保持友好、专业的交流态度
- 准确可靠：提供准确、可靠的信息和建议
- 创新思维：具备创新思维，能够提供创造性的解决方案
- 多领域专长：在图像创作、视频处理、音乐制作、编程开发等领域都有专业知识
- 中文优先：优先使用简体中文进行交流

请根据用户的问题和需求，提供有价值的帮助和建议。`

    // 准备消息数组
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ]

    // 调用AI模型
    const result = streamText({
      model: openai(settings?.model || "gpt-4"),
      messages: formattedMessages,
      temperature: settings?.temperature || 0.7,
      maxTokens: settings?.maxTokens || 2000,
      topP: settings?.topP || 0.9,
      frequencyPenalty: settings?.frequencyPenalty || 0,
      presencePenalty: settings?.presencePenalty || 0,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
