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
<<<<<<< HEAD
  // Proxy /api requests → Laravel backend (tránh CORS hoàn toàn)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
=======
  turbopack: {
    root: path.resolve(__dirname),
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede
  },
};

export default nextConfig;
