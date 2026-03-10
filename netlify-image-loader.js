/**
 * Netlify Image CDN Loader para Next.js
 * Convierte automáticamente imágenes a WebP/AVIF y las redimensiona.
 * Docs: https://docs.netlify.com/image-cdn/overview/
 */
export default function netlifyImageLoader({ src, width, quality }) {
  // Construir URL absoluta para imágenes locales
  const imageUrl = src.startsWith('http')
    ? src
    : `https://www.kronosolopromocionales.com${src}`;

  const params = new URLSearchParams({
    url: imageUrl,
    w: width.toString(),
    q: (quality || 75).toString(),
  });

  return `/.netlify/images?${params.toString()}`;
}
