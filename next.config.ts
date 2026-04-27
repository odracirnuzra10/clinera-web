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
        source: '/presentacion',
        destination: '/presentacion/index.html',
      },
      {
        source: '/test-prompt',
        destination: '/test-prompt/index.html',
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
      {
        source: '/contrata',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/contrata/:path*',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/gracias.html',
        destination: '/gracias',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
