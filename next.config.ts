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
      {
        source: '/presentacion',
        destination: '/presentacion/index.html',
      },
      {
        // Marketing landing alias — /inicia serves the /start page
        source: '/inicia',
        destination: '/start',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/software',
        destination: '/funciones',
        permanent: true,
      },
      {
        source: '/funcionalidades',
        destination: '/funciones',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
