import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['isochimal-unevadible-elmira.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: process.env.NEXT_PUBLIC_SUPABASE_HOST_NAME!,
        protocol: 'https',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
