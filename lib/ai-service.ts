export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

export class AIService {
  private static instance: AIService
  private baseURL = "/api/chat"

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async streamChat(messages: AIMessage[], settings: AISettings): Promise<ReadableStream> {
    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        settings,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.body!
  }

  async generateResponse(messages: AIMessage[], settings: AISettings): Promise<string> {
    const stream = await this.streamChat(messages, settings)
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let result = ""

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              return result
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                result += parsed.choices[0].delta.content
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return result
  }
}
