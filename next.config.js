/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Netlify Image CDN: convierte a WebP/AVIF automáticamente en producción.
    // En local (next dev) usará el optimizador de Next.js si hay servidor,
    // o caerá al comportamiento sin optimización.
    loader: 'custom',
    loaderFile: './netlify-image-loader.js',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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
