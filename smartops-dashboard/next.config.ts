import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Salesforce tooling rewrites its metadata catalog continuously. It is not
    // application source, and watching it causes an endless Fast Refresh loop.
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.sf/**'],
    }
    return config
  },
  experimental: {
    // App router is stable in Next.js 15
  },
}

export default nextConfig
