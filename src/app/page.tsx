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

// Mismo @id que el LocalBusiness de src/app/layout.tsx (#localbusiness):
// permite que Google fusione ambos bloques en una sola entidad del grafo en
// vez de interpretar la tienda online como un negocio distinto (Fase 7,
// plan-seo.md).
const onlineStoreJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  '@id': 'https://www.kronosolopromocionales.com/#localbusiness',
  name: 'KS Promocionales',
  url: 'https://www.kronosolopromocionales.com',
  description: 'Tienda de artículos promocionales y material publicitario personalizado con logo en Ecuador.',
  areaServed: [
    { '@type': 'Country', name: 'Ecuador' },
  ],
  currenciesAccepted: 'USD',
  priceRange: '$-$$$',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
};

export default function HomePage() {
  // Filter server-side — only 24 products reach the client bundle (3 tabs × 8)
  const latest = productsData.slice(0, 8);
  const featured = productsData.filter(p => p.featured).slice(0, 8);
  const bestsellers = productsData.filter(p => p.bestseller).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(onlineStoreJsonLd) }} />
      <HomePageClient
        latestProducts={latest}
        featuredProducts={featured}
        bestsellerProducts={bestsellers}
        categories={categoriesData}
      />
    </>
  );
}
