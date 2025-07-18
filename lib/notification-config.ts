export interface NotificationConfig {
  slack?: {
    webhookUrl: string
    channels: {
      cicd: string
      deployments: string
      alerts: string
    }
  }
  dingtalk?: {
    webhookUrl: string
    secret: string
  }
  email?: {
    smtp: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    from: string
    to: string[]
  }
}

export class NotificationService {
  private config: NotificationConfig

  constructor(config: NotificationConfig) {
    this.config = config
  }

  async sendSlackNotification(message: {
    channel: string
    text: string
    attachments?: any[]
  }): Promise<void> {
    if (!this.config.slack?.webhookUrl) {
      console.warn("Slack webhook URL not configured")
      return
    }

    try {
      const response = await fetch(this.config.slack.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: message.channel,
          text: message.text,
          attachments: message.attachments,
          username: "YYC³ CI/CD Bot",
          icon_emoji: ":rocket:",
        }),
      })

      if (!response.ok) {
        throw new Error(`Slack notification failed: ${response.statusText}`)
      }

      console.log("✅ Slack notification sent successfully")
    } catch (error) {
      console.error("❌ Failed to send Slack notification:", error)
    }
  }

  async sendDingTalkNotification(message: {
    text: string
    markdown?: string
  }): Promise<void> {
    if (!this.config.dingtalk?.webhookUrl) {
      console.warn("DingTalk webhook URL not configured")
      return
    }

    try {
      const timestamp = Date.now()
      const secret = this.config.dingtalk.secret
      const sign = this.generateDingTalkSign(timestamp, secret)

      const response = await fetch(`${this.config.dingtalk.webhookUrl}&timestamp=${timestamp}&sign=${sign}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msgtype: message.markdown ? "markdown" : "text",
          text: message.markdown ? undefined : { content: message.text },
          markdown: message.markdown
            ? {
                title: "YYC³ CI/CD 通知",
                text: message.markdown,
              }
            : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`DingTalk notification failed: ${response.statusText}`)
      }

      console.log("✅ DingTalk notification sent successfully")
    } catch (error) {
      console.error("❌ Failed to send DingTalk notification:", error)
    }
  }

  private generateDingTalkSign(timestamp: number, secret: string): string {
    const crypto = require("crypto")
    const stringToSign = `${timestamp}\n${secret}`
    const sign = crypto.createHmac("sha256", secret).update(stringToSign).digest("base64")
    return encodeURIComponent(sign)
  }

  async sendEmailNotification(message: {
    subject: string
    text: string
    html?: string
  }): Promise<void> {
    if (!this.config.email) {
      console.warn("Email configuration not found")
      return
    }

    try {
      const nodemailer = require("nodemailer")
      const transporter = nodemailer.createTransporter(this.config.email.smtp)

      await transporter.sendMail({
        from: this.config.email.from,
        to: this.config.email.to.join(", "),
        subject: message.subject,
        text: message.text,
        html: message.html,
      })

      console.log("✅ Email notification sent successfully")
    } catch (error) {
      console.error("❌ Failed to send email notification:", error)
    }
  }
}

// 预定义的通知模板
export const NotificationTemplates = {
  deploymentSuccess: (environment: string, version: string, url: string) => ({
    slack: {
      text: `🚀 部署成功`,
      attachments: [
        {
          color: "good",
          fields: [
            { title: "环境", value: environment, short: true },
            { title: "版本", value: version, short: true },
            { title: "URL", value: url, short: false },
          ],
        },
      ],
    },
    dingtalk: {
      markdown: `## 🚀 部署成功\n\n**环境**: ${environment}\n\n**版本**: ${version}\n\n**URL**: [${url}](${url})`,
    },
    email: {
      subject: `YYC³ NetTrack - ${environment} 部署成功`,
      html: `
        <h2>🚀 部署成功</h2>
        <p><strong>环境</strong>: ${environment}</p>
        <p><strong>版本</strong>: ${version}</p>
        <p><strong>URL</strong>: <a href="${url}">${url}</a></p>
      `,
    },
  }),

  deploymentFailure: (environment: string, error: string) => ({
    slack: {
      text: `❌ 部署失败`,
      attachments: [
        {
          color: "danger",
          fields: [
            { title: "环境", value: environment, short: true },
            { title: "错误", value: error, short: false },
          ],
        },
      ],
    },
    dingtalk: {
      markdown: `## ❌ 部署失败\n\n**环境**: ${environment}\n\n**错误**: ${error}`,
    },
    email: {
      subject: `YYC³ NetTrack - ${environment} 部署失败`,
      html: `
        <h2>❌ 部署失败</h2>
        <p><strong>环境</strong>: ${environment}</p>
        <p><strong>错误</strong>: ${error}</p>
      `,
    },
  }),

  testFailure: (testType: string, details: string) => ({
    slack: {
      text: `🧪 测试失败`,
      attachments: [
        {
          color: "warning",
          fields: [
            { title: "测试类型", value: testType, short: true },
            { title: "详情", value: details, short: false },
          ],
        },
      ],
    },
    dingtalk: {
      markdown: `## 🧪 测试失败\n\n**测试类型**: ${testType}\n\n**详情**: ${details}`,
    },
    email: {
      subject: `YYC³ NetTrack - ${testType} 测试失败`,
      html: `
        <h2>🧪 测试失败</h2>
        <p><strong>测试类型</strong>: ${testType}</p>
        <p><strong>详情</strong>: ${details}</p>
      `,
    },
  }),
}
