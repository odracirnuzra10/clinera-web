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
      {
        source: '/start',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/inicia',
        destination: '/planes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
