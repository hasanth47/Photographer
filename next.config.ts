import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Photo uploads from the admin area go through a Server Action.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
