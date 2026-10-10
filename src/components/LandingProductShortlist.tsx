import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import categoriesData from '@/data/categories.json';
import { toCardProduct } from '@/lib/product-display';

// Selección de productos reales del catálogo para landings temáticas
// (docs/seo-improvement-2026-10-09, N01). Se renderiza en el servidor, así
// que cada tarjeta es un <a href> real en el HTML exportado. La auditoría
// competitiva midió 0 enlaces a fichas en /audifonos-promocionales/.
export default function LandingProductShortlist({ title, intro, products, viewAllHref, viewAllLabel }) {
  if (!products?.length) return null;
  return (
    <section className="py-16 md:py-20 bg-[#F8F9FC] border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-2">{title}</h2>
            {intro && <p className="text-gray-500 max-w-2xl">{intro}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0F2178] hover:text-[#F5A520] transition-colors shrink-0">
              {viewAllLabel || 'Ver todos'} →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={toCardProduct(product)}
              category={categoriesData.find((c) => c.id === product.categoryId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
