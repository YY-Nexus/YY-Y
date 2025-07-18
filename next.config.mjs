/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除过时的 experimental.appDir 配置
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // 图片优化配置
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
  
  // 构建优化
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack 配置优化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },
  
  // 环境变量
  env: {
    FEEDBACK_EMAIL: process.env.FEEDBACK_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },
  
  // 启用压缩
  compress: true,
  
  // 移除 X-Powered-By 头
  poweredByHeader: false,
  
  // 服务器外部包
  serverExternalPackages: ['nodemailer'],
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          }
        ]
      },
      {
        source: '/api/health',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/(.*)',
        destination: '/api/$1'
      }
    ]
  },
  
  // 重定向规则
  async redirects() {
    return [
      {
        source: '/health',
        destination: '/api/health',
        permanent: false
      }
    ]
  }
}

export default nextConfig
