/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['nodemailer'],
  env: {
    FEEDBACK_EMAIL: process.env.FEEDBACK_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // API 路由优化
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
  // 优化构建性能
  swcMinify: true,
  // 启用 gzip 压缩
  compress: true,
  // 优化字体加载
  optimizeFonts: true,
  // 启用 HTTP/2 服务器推送
  generateEtags: true,
  // 优化静态文件缓存
  poweredByHeader: false,
}

export default nextConfig
