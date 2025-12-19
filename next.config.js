/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Necesario para 'export' estático
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Dominios externos permitidos para imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'catalogospromocionales.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.catalogospromocionales.com',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configuración de webpack para Konva
  webpack: (config, { isServer }) => {
    // Resolver solo la versión del navegador de Konva
    config.resolve.alias = {
      ...config.resolve.alias,
      'konva/lib/index-node': false,
      'konva/lib/index-node.js': false,
    };

    // Ignorar módulos que requieren canvas en servidor
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'konva'];
    }

    return config;
  },
}

module.exports = nextConfig
