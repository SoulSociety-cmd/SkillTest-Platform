import createNextSentryPlugin from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'vm2', '@upstash/redis'],
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
        hostname: 'sentry.io',
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
  sentry: createNextSentryPlugin({
    silent: true,
    org: 'skilltest',
    project: 'skilltest-nextjs',
  }),
};

const sentryWebpackPlugin = require('@sentry/webpack-plugin');

export default nextConfig;
