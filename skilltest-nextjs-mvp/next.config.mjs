/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverComponentsExternalPackages: [
      'mongoose',
      'vm2',
      '@upstash/redis',
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.posthog.com',
      },
      {
        protocol: 'https',
        hostname: 'upstash.com',
      },
    ],
  },

  transpilePackages: [],

  swcMinify: true,

  output: 'standalone',
};

export default nextConfig;