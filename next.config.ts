import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/support',
        destination: '/support/index.html',
      },
      {
        source: '/contrata',
        destination: '/contrata/index.html',
      },
    ];
  },
};

export default nextConfig;
