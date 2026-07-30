import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Proxy /api requests → Laravel backend (tránh CORS hoàn toàn)
 async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  }, // <-- Thêm dòng này (ngoặc nhọn và dấu phẩy)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
