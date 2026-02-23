import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'isochimal-unevadible-elmira.ngrok-free.dev'
  ],
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com',
        protocol: 'https',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
