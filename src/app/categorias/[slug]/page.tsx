import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';
import StaticProductsGrid from '@/components/StaticProductsGrid';
import CategoryPagination from '@/components/CategoryPagination';
import categoriesData from '@/data/categories.json';
import { isPaginatedCategory, totalPagesFor, CATEGORY_PAGE_SIZE } from '@/lib/category-pagination';
import { CATEGORY_LANDING_LINKS } from '@/lib/category-landing-links';
import { buildNeutralItemList } from '@/lib/structured-data';
import WAIcon from '@/components/icons/WhatsAppIcon';

export async function generateStaticParams() {
  return categoriesData.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const category = categoriesData.find(c => c.slug === params.slug);
  if (!category) return { title: 'Categoría no encontrada' };

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.kronosolopromocionales.com/categorias/${params.slug}/`,
      languages: {
        'es-EC': `https://www.kronosolopromocionales.com/categorias/${params.slug}/`,
        'x-default': `https://www.kronosolopromocionales.com/categorias/${params.slug}/`,
      },
    },
  };
}

export default function CategoryPage({ params }) {
  const category = categoriesData.find(c => c.slug === params.slug);
  if (!category) notFound();

  let categoryProducts = [];
  let totalProducts = 0;
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'category-products', `${category.id}.json`), 'utf-8');
    const parsed = JSON.parse(raw);
    categoryProducts = parsed.products;
    totalProducts = parsed.total;
  } catch {
    /* no products yet */
  }

  const BASE_URL = 'https://www.kronosolopromocionales.com';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Categorías', item: `${BASE_URL}/regalos-corporativos/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/categorias/${category.slug}/` },
    ],
  };

  const itemListJsonLd = buildNeutralItemList({
    name: `${category.name} — KS Promocionales`,
    description: category.seoDescription,
    url: `${BASE_URL}/categorias/${category.slug}/`,
    entries: categoryProducts.slice(0, 20).map((product) => ({
      name: product.name,
      url: `${BASE_URL}/productos/${product.slug}/`,
    })),
  });

  /* Related categories (same first letter group or just a few others) */
  const relatedCategories = categoriesData
    .filter(c => c.id !== category.id && c.image)
    .slice(0, 6);

  const landingLinks = CATEGORY_LANDING_LINKS[category.slug] || [];

  // Fase 9 (plan-seo.md): categorías grandes en la lista de piloto usan
  // paginación estática con enlaces reales en vez de scroll infinito
  // client-side. Ver src/lib/category-pagination.ts.
  const paginated = isPaginatedCategory(category.slug);
  const totalPages = paginated ? totalPagesFor(categoryProducts.length) : 1;
  const pageOneProducts = paginated ? categoryProducts.slice(0, CATEGORY_PAGE_SIZE) : categoryProducts;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      {/* pt accounts for the fixed header (h-16/68px) — gradient runs full-bleed
          to the top edge so the navy header sits on matching navy instead of a
          bare spacer div, while inner content still clears the header. */}
      <section
        className="relative overflow-hidden pt-16 md:pt-[68px]"
        style={{ background: 'linear-gradient(135deg, #091557 0%, #0F2178 50%, #0F2178 100%)' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-70" />
        <div
          className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,119,34,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 container mx-auto px-4 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/50">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li className="text-white/25">/</li>
              <li><Link href="/regalos-corporativos/" className="hover:text-white transition-colors">Categorías</Link></li>
              <li className="text-white/25">/</li>
              <li className="text-white/80 font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 text-white/70 text-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A520]" />
                {totalProducts || category.productCount || 0} productos disponibles
              </div>

              <h1 className="font-black text-white leading-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', letterSpacing: '-0.03em' }}>
                {category.h1 || `${category.name} Personalizados con Logo Ecuador`}
              </h1>

              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl">
                {category.story}
              </p>

              {/* Benefits pills */}
              {category.benefits && (
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {category.benefits.slice(0, 4).map((benefit) => (
                    <span
                      key={benefit}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/8 border border-white/12 rounded-full px-3.5 py-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-[#F5A520] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </span>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/593999814838?text=${encodeURIComponent(`Hola, me interesa la categoría de ${category.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-primary"
                >
                  <WAIcon />
                  Cotizar Esta Categoría
                </a>
                <Link href="/catalogos-digitales" className="btn-hero-ghost">
                  Ver Catálogos
                </Link>
              </div>
            </div>

            {/* Right: Category image */}
            <div className="flex items-center justify-center">
              {category.image ? (
                <div
                  className="relative w-full max-w-md aspect-square overflow-hidden float-1"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                  }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-contain p-8 md:p-12"
                    priority
                  />
                </div>
              ) : (
                <div
                  className="w-full max-w-md aspect-square flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                  }}
                >
                  <span className="text-8xl opacity-20">📦</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL ────────────────────────────────────────── */}
      {category.editorial && (
        <section className="py-12 md:py-16 bg-[#F8F9FC] border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold text-[#0A0A23] text-2xl md:text-3xl mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              {category.h2Editorial || `${category.name} Promocionales para Empresas en Ecuador`}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {category.editorial.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PRODUCTS GRID ────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-[#0A0A23] text-2xl md:text-3xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Productos en {category.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {categoryProducts.length} productos personalizables con tu logo
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-gray-500 shrink-0">Ordenar:</span>
              <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0F2178] transition-colors"
              >
                <option>Más relevantes</option>
                <option>Nombre A-Z</option>
                <option>Nombre Z-A</option>
              </select>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            paginated ? (
              <>
                <StaticProductsGrid products={pageOneProducts} category={category} />
                <CategoryPagination basePath={`/categorias/${category.slug}`} currentPage={1} totalPages={totalPages} />
              </>
            ) : (
              <CategoryProductsGrid products={categoryProducts} category={category} />
            )
          ) : (
            <div className="text-center py-20 bg-[#F8F9FC] rounded-2xl border border-gray-100">
              <div
                className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl"
                style={{ background: '#F0F3FA', borderRadius: '16px' }}
              >
                📦
              </div>
              <p className="font-semibold text-[#0A0A23] mb-2">Próximamente más productos</p>
              <p className="text-gray-500 text-sm mb-6">Estamos actualizando esta categoría.</p>
              <Link
                href="/regalos-corporativos/"
                className="btn-blue text-sm"
              >
                Ver otras categorías
              </Link>
            </div>
          )}

          {/* Help finding a specific product — always shown after the grid,
              regardless of category size, so the page never appears to dead-end. */}
          {categoryProducts.length > 0 && (
            <div
              className="mt-10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#0F2178]/10 bg-[#F8F9FC]"
              style={{ borderRadius: '14px' }}
            >
              <div>
                <p className="font-semibold text-[#0A0A23] text-sm">
                  ¿Buscas algo específico en {category.name}?
                </p>
                <p className="text-gray-500 text-sm mt-0.5">
                  Tenemos {totalProducts} productos en esta categoría. Escríbenos y te ayudamos a encontrar el ideal.
                </p>
              </div>
              <a
                href={`https://wa.me/593999814838?text=${encodeURIComponent(`Hola, busco un producto específico dentro de la categoría ${category.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-sm shrink-0"
              >
                <WAIcon />
                Pedir ayuda por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ─── SPECIALIZED LANDINGS ─────────────────────────────── */}
      {landingLinks.length > 0 && (
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-[#0A0A23] text-2xl mb-8" style={{ letterSpacing: '-0.02em' }}>
              Guías especializadas en {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {landingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-[#0F2178] mb-1">{link.title}</h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RELATED CATEGORIES ───────────────────────────────── */}
      {relatedCategories.length > 0 && (
        <section className="py-14 md:py-20 bg-[#F8F9FC] border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-[#0A0A23] text-2xl mb-8" style={{ letterSpacing: '-0.02em' }}>
              Otras categorías
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categorias/${cat.slug}/`}
                  className="category-card group p-4 text-center hover:border-[#0F2178]/20"
                >
                  <div className="relative aspect-square mx-auto mb-3 max-w-[80px] overflow-hidden" style={{ borderRadius: '12px' }}>
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F0F3FA] text-2xl">📦</div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#0A0A23] group-hover:text-[#0F2178] transition-colors leading-tight">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BOTTOM CTA ───────────────────────────────────────── */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #091557 0%, #0F2178 100%)' }}
      >
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h3 className="font-bold text-white text-2xl md:text-3xl mb-3" style={{ letterSpacing: '-0.025em' }}>
            ¿Necesitas ayuda para elegir?
          </h3>
          <p className="text-white/60 mb-7 max-w-md mx-auto">
            Nuestros asesores te ayudan a encontrar el producto perfecto para tu empresa.
          </p>
          <a
            href="https://wa.me/593999814838?text=Hola, necesito asesoría sobre productos promocionales"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-base px-8 py-3.5 pulse-whatsapp inline-flex"
          >
            <WAIcon />
            Hablar con un Asesor
          </a>
        </div>
      </section>
    </>
  );
}
