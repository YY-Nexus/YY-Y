/**
 * YYC³ NetTrack UI设计风格分析
 * 设计系统锁定与标准化文档
 */

export interface UIDesignSystem {
  colorPalette: {
    primary: string[]
    secondary: string[]
    accent: string[]
    neutral: string[]
    semantic: {
      success: string[]
      warning: string[]
      error: string[]
      info: string[]
    }
  }
  typography: {
    fontFamily: string
    fontSizes: Record<string, string>
    fontWeights: Record<string, number>
    lineHeights: Record<string, string>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  animations: Record<string, any>
}

// 🎨 当前UI设计系统锁定配置
export const LOCKED_DESIGN_SYSTEM: UIDesignSystem = {
  colorPalette: {
    // 主色调：科技蓝渐变系
    primary: [
      "#3B82F6", // 主蓝色
      "#1D4ED8", // 深蓝色
      "#60A5FA", // 浅蓝色
      "#DBEAFE", // 极浅蓝
    ],
    // 辅助色：紫色系
    secondary: [
      "#8B5CF6", // 紫色
      "#7C3AED", // 深紫色
      "#A78BFA", // 浅紫色
      "#EDE9FE", // 极浅紫
    ],
    // 强调色：青色系
    accent: [
      "#06B6D4", // 青色
      "#0891B2", // 深青色
      "#67E8F9", // 浅青色
      "#CFFAFE", // 极浅青
    ],
    // 中性色：灰色系
    neutral: [
      "#1F2937", // 深灰
      "#374151", // 中灰
      "#6B7280", // 浅灰
      "#F9FAFB", // 背景灰
    ],
    semantic: {
      success: ["#10B981", "#059669", "#6EE7B7", "#D1FAE5"],
      warning: ["#F59E0B", "#D97706", "#FCD34D", "#FEF3C7"],
      error: ["#EF4444", "#DC2626", "#FCA5A5", "#FEE2E2"],
      info: ["#3B82F6", "#2563EB", "#93C5FD", "#DBEAFE"],
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
}

// 🔒 设计系统锁定状态
export const DESIGN_LOCK_STATUS = {
  isLocked: true,
  lockedAt: new Date().toISOString(),
  version: "1.0.0",
  approvedBy: "YYC³ Design Team",
  changeRequiresApproval: true,
} as const
