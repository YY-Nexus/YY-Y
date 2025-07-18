import fs from "fs"
import path from "path"
import { swaggerDefinition } from "../lib/swagger-config"

// 生成 JSON 格式的 API 规范
function generateJsonSpec() {
  const outputPath = path.join(process.cwd(), "public", "api-docs.json")

  // 确保目录存在
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 写入文件
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDefinition, null, 2), "utf8")
  console.log(`✅ API 规范已生成: ${outputPath}`)
}

// 生成 YAML 格式的 API 规范
function generateYamlSpec() {
  try {
    const yaml = require("yaml")
    const outputPath = path.join(process.cwd(), "public", "api-docs.yaml")

    const yamlString = yaml.stringify(swaggerDefinition)
    fs.writeFileSync(outputPath, yamlString, "utf8")
    console.log(`✅ YAML 规范已生成: ${outputPath}`)
  } catch (error) {
    console.error("❌ 生成 YAML 规范失败:", error)
  }
}

// 生成 Markdown 文档
function generateMarkdownDocs() {
  const outputPath = path.join(process.cwd(), "docs", "api-reference.md")

  // 确保目录存在
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const markdown = `# YYC³ NetTrack API 参考文档

${swaggerDefinition.info.description}

## 基础信息

- **版本**: ${swaggerDefinition.info.version}
- **基础URL**: ${swaggerDefinition.servers?.[0]?.url || "https://yyc3.com/api"}
- **联系方式**: ${swaggerDefinition.info.contact?.email}

## 接口列表

${Object.entries(swaggerDefinition.paths)
  .map(([path, methods]) => {
    return `### ${path}\n\n${Object.entries(methods as any)
      .map(([method, details]: [string, any]) => {
        return `#### ${method.toUpperCase()} ${path}

**描述**: ${details.description || details.summary}

**标签**: ${details.tags?.join(", ") || "无"}

**请求参数**:
${details.requestBody ? "- Body: 见 Schema 定义" : "- 无请求体"}
${details.parameters ? details.parameters.map((param: any) => `- ${param.name} (${param.in}): ${param.description}`).join("\n") : ""}

**响应**:
${Object.entries(details.responses)
  .map(([code, response]: [string, any]) => `- ${code}: ${response.description}`)
  .join("\n")}

---`
      })
      .join("\n\n")}`
  })
  .join("\n\n")}

## 数据模型

${Object.entries(swaggerDefinition.components?.schemas || {})
  .map(([name, schema]: [string, any]) => {
    return `### ${name}

\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\``
  })
  .join("\n\n")}

---

*此文档由脚本自动生成，最后更新时间: ${new Date().toLocaleString("zh-CN")}*
`

  fs.writeFileSync(outputPath, markdown, "utf8")
  console.log(`✅ Markdown 文档已生成: ${outputPath}`)
}

// 主函数
function main() {
  console.log("🚀 开始生成 API 文档...")

  try {
    generateJsonSpec()
    generateYamlSpec()
    generateMarkdownDocs()

    console.log("\n✨ 所有文档生成完成！")
    console.log("\n📁 生成的文件:")
    console.log("  - public/api-docs.json (JSON 规范)")
    console.log("  - public/api-docs.yaml (YAML 规范)")
    console.log("  - docs/api-reference.md (Markdown 文档)")
    console.log("\n🌐 访问交互式文档: http://localhost:3000/docs")
  } catch (error) {
    console.error("❌ 文档生成失败:", error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

export { generateJsonSpec, generateYamlSpec, generateMarkdownDocs }
