import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // App router is stable in Next.js 15
  },
}

export default nextConfig
