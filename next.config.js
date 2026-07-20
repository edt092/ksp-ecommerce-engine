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
        hostname: 'catalogospromocionales.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.catalogospromocionales.com',
        pathname: '/**',
      },
      {
        // catalogospromocionales.com ahora redirige (308) todas las imágenes
        // aquí — es el dominio final real que sirve los archivos.
        protocol: 'https',
        hostname: 'cataprom.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cataprom.com',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
