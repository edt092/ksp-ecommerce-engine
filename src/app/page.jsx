import HomePageClient from './HomePageClient';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export const dynamic = 'force-static';

export const metadata = {
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
    languages: {
      'es-EC': 'https://www.kronosolopromocionales.com/',
      'es-CO': 'https://www.kronosolopromocionales.com/',
      'x-default': 'https://www.kronosolopromocionales.com/',
    },
  },
};

export default function HomePage() {
  // Filter server-side — only 24 products reach the client bundle (3 tabs × 8)
  const latest = productsData.slice(0, 8);
  const featured = productsData.filter(p => p.featured).slice(0, 8);
  const bestsellers = productsData.filter(p => p.bestseller).slice(0, 8);

  return (
    <HomePageClient
      latestProducts={latest}
      featuredProducts={featured}
      bestsellerProducts={bestsellers}
      categories={categoriesData}
    />
  );
}
