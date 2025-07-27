import { ApiTestPanel } from "@/components/api-test-panel"

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API接口测试</h1>
        <p className="text-muted-foreground mt-2">测试和验证所有API端点的功能性和性能</p>
      </div>
      <ApiTestPanel />
    </div>
  )
}
