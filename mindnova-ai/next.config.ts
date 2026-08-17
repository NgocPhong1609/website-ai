import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "pub-bfe1280f0c5041a4bd4e8104c0aa9ae6.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-fec983cf8e334817b4c2983707bf8eef.r2.dev",
      },
    ],
  },
  // Proxy /api requests → Laravel backend (tránh CORS hoàn toàn)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
