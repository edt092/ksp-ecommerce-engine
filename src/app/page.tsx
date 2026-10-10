import HomePageClient from './HomePageClient';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export const dynamic = 'force-static';

export const metadata = {
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
    languages: {
      'es-EC': 'https://www.kronosolopromocionales.com/',
      'x-default': 'https://www.kronosolopromocionales.com/',
    },
  },
};

// El bloque OnlineStore que vivía aquí se eliminó (docs/seo-improvement-
// 2026-10-09, T03): reutilizaba el @id #localbusiness del layout con url sin
// barra, otro priceRange y un ContactPoint sin teléfono, es decir, el mismo
// nodo con hechos contradictorios. La entidad única es el LocalBusiness de
// src/app/layout.tsx; el negocio cotiza por WhatsApp, no vende online.

export default function HomePage() {
  // Filter server-side — only 24 products reach the client bundle (3 tabs × 8).
  // Solo productos publicados: el home no debe enlazar fichas noindex.
  const published = productsData.filter(p => p.is_ai_optimized);
  const latest = published.slice(0, 8);
  const featured = published.filter(p => p.featured).slice(0, 8);
  const bestsellers = published.filter(p => p.bestseller).slice(0, 8);

  return (
    <HomePageClient
      latestProducts={latest}
      featuredProducts={featured}
      bestsellerProducts={bestsellers}
      categories={categoriesData}
    />
  );
}
