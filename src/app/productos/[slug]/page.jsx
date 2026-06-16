import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';

import productsData from '../../../../data/products.json';
import categoriesData from '../../../../data/categories.json';

export function generateStaticParams() {
  return productsData.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const product = productsData.find(p => p.slug === params.slug);
  if (!product) return { title: 'Producto no encontrado', description: 'El producto que buscas no está disponible' };

  const baseSlug = product.slug.replace(/-\d+$/, '');
  if (baseSlug !== product.slug) {
    const baseProduct = productsData.find(p => p.slug === baseSlug);
    if (baseProduct && baseProduct.name === product.name) {
      return {
        title: product.name,
        robots: { index: false, follow: false },
        alternates: { canonical: `https://www.kronosolopromocionales.com/productos/${baseSlug}/` },
      };
    }
  }

  if (!product.is_ai_optimized) {
    return { title: product.name, robots: { index: false, follow: false } };
  }

  const category = categoriesData.find(c => c.id === product.categoryId);

  return {
    title: product.seoTitle || `${product.name} Personalizado | KS Promocionales`,
    description: product.seoDescription || product.shortDescription,
    keywords: product.keywords || `${product.name}, regalo corporativo, articulo promocional, ${category?.name || ''}`,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: product.images?.length > 0 ? [{ url: product.images[0], width: 800, height: 600, alt: product.name }] : [],
      type: 'website',
      locale: 'es_EC',
      siteName: 'KS Promocionales Ecuador',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: product.images?.length > 0 ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `https://www.kronosolopromocionales.com/productos/${params.slug}/`,
      languages: {
        'es-EC': `https://www.kronosolopromocionales.com/productos/${params.slug}/`,
        'es-CO': `https://www.kronosolopromocionales.com/productos/${params.slug}/`,
        'x-default': `https://www.kronosolopromocionales.com/productos/${params.slug}/`,
      },
    },
  };
}

/* ─── Helpers ──────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#0F2178] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

export default function ProductPage({ params }) {
  const product = productsData.find(p => p.slug === params.slug);
  if (!product) notFound();

  const category = categoriesData.find(c => c.id === product.categoryId);

  const relatedProducts = productsData
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.is_ai_optimized)
    .slice(0, 4);

  const BASE_URL = 'https://www.kronosolopromocionales.com';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.shortDescription,
    image: product.images?.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`),
    sku: String(product.id),
    brand: { '@type': 'Brand', name: 'KS Promocionales' },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/productos/${product.slug}/`,
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      seller: { '@type': 'Organization', '@id': `${BASE_URL}/#localbusiness`, name: 'KS Promocionales' },
    },
    url: `${BASE_URL}/productos/${product.slug}/`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: category?.name || 'Categorías', item: `${BASE_URL}/categorias/${category?.slug}/` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}/productos/${product.slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ─── PRODUCT DETAIL ─────────────────────────────────── */}
      {/* pt accounts for the fixed header (h-16/68px) instead of a bare spacer div */}
      <section className="bg-white pt-[6.5rem] md:pt-[8.25rem] pb-10 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <li><Link href="/" className="hover:text-[#0F2178] transition-colors">Inicio</Link></li>
              <li className="text-gray-300">/</li>
              <li>
                <Link href={`/categorias/${category?.slug}/`} className="hover:text-[#0F2178] transition-colors">
                  {category?.name}
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-800 font-medium line-clamp-1 max-w-[180px]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left: Image Gallery */}
            <div className="animate-fade-in">
              <ProductImageGallery product={product} category={category} />
            </div>

            {/* Right: Product Info */}
            <div className="animate-slide-up">
              {/* Category link */}
              <Link
                href={`/categorias/${category?.slug}/`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#0F2178]/60 hover:text-[#0F2178] transition-colors mb-3"
              >
                {category?.name}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Product name */}
              <h1
                className="font-black text-[#0A0A23] mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}
              >
                {product.name}
              </h1>

              {/* Short description */}
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-7">
                {product.shortDescription}
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { emoji: '✨', text: 'Calidad Premium' },
                  { emoji: '⚡', text: 'Cotización en 48h' },
                  { emoji: '🎨', text: '100% Personalizable' },
                  { emoji: '🚚', text: 'Envío Ecuador' },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-[#F8F9FC] border border-gray-100 rounded-full px-3 py-1.5"
                  >
                    <span>{item.emoji}</span>
                    {item.text}
                  </span>
                ))}
              </div>

              {/* Story */}
              {product.story && (
                <div
                  className="mb-8 p-5 md:p-6"
                  style={{
                    background: 'linear-gradient(135deg, #F0F3FA, #E8EEF8)',
                    borderRadius: '14px',
                    borderLeft: '3px solid #0F2178',
                  }}
                >
                  <h2 className="text-sm font-bold text-[#0F2178] mb-2 uppercase tracking-wide">Sobre este producto</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">{product.story}</p>
                </div>
              )}

              {/* Features */}
              {product.features?.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-bold text-[#0A0A23] text-base mb-4">Características</h2>
                  <ul className="space-y-2.5">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Use cases */}
              {product.useCases?.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-bold text-[#0A0A23] text-base mb-3">Ideal para</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.useCases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#0F2178]/30 hover:text-[#0F2178] transition-colors cursor-default"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider + CTAs */}
              <div className="border-t border-gray-100 pt-7 mb-7">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold text-[#0A0A23]">Personalización con tu logo.</span> Serigrafía, tampografía, sublimación, láser, bordado y UV.
                </p>
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DESCRIPTION TABS ───────────────────────────────── */}
      <ProductTabs product={product} />

      {/* ─── RELATED PRODUCTS ───────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F8F9FC] border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-bold text-[#0A0A23] text-2xl md:text-3xl" style={{ letterSpacing: '-0.025em' }}>
                También te puede interesar
              </h2>
              <Link
                href={`/categorias/${category?.slug}/`}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0F2178] hover:text-[#F5A520] transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ProductCard product={p} category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ─── Product Tabs (client would be better, but we'll use server-safe accordion) ── */
function ProductTabs({ product }) {
  const tabs = [];

  if (product.shortDescription || product.story) {
    tabs.push({ id: 'desc', label: 'Descripción', content: product.shortDescription });
  }
  if (product.features?.length > 0) {
    tabs.push({ id: 'feat', label: 'Características', items: product.features });
  }
  if (product.useCases?.length > 0) {
    tabs.push({ id: 'uses', label: 'Usos', items: product.useCases });
  }
  tabs.push({
    id: 'tech',
    label: 'Técnicas',
    techniques: ['Serigrafía', 'Tampografía', 'Sublimación', 'Láser', 'Bordado', 'UV'],
  });

  if (tabs.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-[#F8F9FC] border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-4">
          {tabs.map((tab) => (
            <details key={tab.id} className="group bg-white border border-gray-100 overflow-hidden" style={{ borderRadius: '14px' }}>
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none font-semibold text-[#0A0A23] text-sm hover:text-[#0F2178] transition-colors">
                {tab.label}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 border-t border-gray-50">
                {tab.content && <p className="text-gray-600 leading-relaxed pt-4 text-sm">{tab.content}</p>}
                {tab.items && (
                  <ul className="mt-4 space-y-2">
                    {tab.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#0F2178] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {tab.techniques && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tab.techniques.map((t) => (
                      <span key={t} className="badge-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
