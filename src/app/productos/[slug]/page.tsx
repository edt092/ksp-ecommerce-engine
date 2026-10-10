import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';
import { displayName, cleanProductText, toCardProduct } from '@/lib/product-display';
import { selectRelatedProducts } from '@/lib/related-products';
import { leadTimeAnswer, minimumOrderAnswer, quoteChecklist, responseTimeLabel } from '@/lib/business-facts';

import productsData from '../../../../data/products.json';
import categoriesData from '../../../../data/categories.json';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export function generateStaticParams() {
  return productsData.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const product = productsData.find(p => p.slug === params.slug);
  if (!product) return { title: 'Producto no encontrado', robots: { index: false, follow: false } };

  const name = displayName(product);
  const url = `${BASE_URL}/productos/${product.slug}/`;
  const image = product.images?.length > 0 ? product.images[0] : null;

  // Productos retenidos (is_ai_optimized=false, 64 al 2026-10-09): ficha real
  // y distinta, pero sin contenido revisado. noindex,follow + canonical propia
  // y explícita: antes heredaban del layout la canonical y el hreflang del
  // home (señal contradictoria), y nofollow cortaba los enlaces de la página.
  // Siguen fuera del sitemap (src/app/sitemap.ts).
  //
  // Se eliminó la rama que canonicalizaba "<slug>-<n>" a "<slug>" cuando ambos
  // tenían el mismo nombre: no tenía casos activos y un nombre igual no prueba
  // que sean el mismo producto. Los duplicados se resuelven con el protocolo
  // de consolidación (301 de un salto), no con una heurística de build.
  if (!product.is_ai_optimized) {
    const description = cleanProductText(product.shortDescription, product) || `${name} personalizable con el logo de tu empresa en Ecuador.`;
    return {
      title: `${name} | KS Promocionales`,
      description,
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
      alternates: { canonical: url },
      openGraph: { title: name, description, url, type: 'website', locale: 'es_EC', siteName: 'KS Promocionales', ...(image && { images: [{ url: image, alt: name }] }) },
      twitter: { card: 'summary_large_image', title: name, description, ...(image && { images: [image] }) },
    };
  }

  const category = categoriesData.find(c => c.id === product.categoryId);
  const title = cleanProductText(product.seoTitle, product) || `${name} Personalizado | KS Promocionales`;
  const description = cleanProductText(product.seoDescription || product.shortDescription, product);

  return {
    title,
    description,
    keywords: product.keywords || `${name}, regalo corporativo, articulo promocional, ${category?.name || ''}`,
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image, width: 800, height: 600, alt: name }] : [],
      type: 'website',
      locale: 'es_EC',
      siteName: 'KS Promocionales Ecuador',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        'es-EC': url,
        'x-default': url,
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
  const name = displayName(product);
  const shortDescription = cleanProductText(product.shortDescription, product);
  const relatedProducts = selectRelatedProducts(product, productsData, 8);

  // offers.md — no se emite Product JSON-LD aquí: el negocio cotiza solo
  // por WhatsApp (sin precio público) y no existe ninguna reseña real
  // todavía (data/testimonials.json no existe, ver src/lib/testimonials.ts).
  // Google exige offers, review o aggregateRating en todo Product; emitir
  // uno sin ellos es la causa de la incidencia de Search Console. Cuando
  // exista una oferta u opinión real y visible en esta página, usar
  // buildProductJsonLd (src/lib/structured-data.ts) para construirlo.

  // Misma jerarquía que las páginas de categoría: Inicio > Categorías
  // (/regalos-corporativos/, el directorio de las 37 categorías) > categoría.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Categorías', item: `${BASE_URL}/regalos-corporativos/` },
      ...(category ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/categorias/${category.slug}/` }] : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name, item: `${BASE_URL}/productos/${product.slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ─── PRODUCT DETAIL ─────────────────────────────────── */}
      {/* El header ocupa espacio en el flujo (globals.css: .header-accent-line
          { position: relative } anula su clase fixed desde junio 2026), así que
          el antiguo pt-[6.5rem] dejaba ~90 px vacíos sobre la miga de pan. Si el
          header vuelve a ser fijo, restaurar el padding (ver
          docs/seo-improvement-2026-10-09/decisions.md, D-07). */}
      <section className="bg-white pt-4 md:pt-10 pb-10 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-4 md:mb-8 animate-fade-in" aria-label="Breadcrumb">
            <ol className="flex items-center gap-x-2 gap-y-1 text-sm text-gray-500 flex-wrap">
              <li><Link href="/" className="inline-block py-2 hover:text-[#0F2178] transition-colors">Inicio</Link></li>
              <li className="text-gray-300" aria-hidden="true">/</li>
              <li><Link href="/regalos-corporativos/" className="inline-block py-2 hover:text-[#0F2178] transition-colors">Categorías</Link></li>
              {category && (
                <>
                  <li className="text-gray-300" aria-hidden="true">/</li>
                  <li>
                    <Link href={`/categorias/${category.slug}/`} className="inline-block py-2 hover:text-[#0F2178] transition-colors">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li className="text-gray-300" aria-hidden="true">/</li>
              <li className="text-gray-800 font-medium line-clamp-1 max-w-[180px]" aria-current="page">{name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-start">
            {/* Left: Image Gallery */}
            <div className="min-w-0 animate-fade-in">
              <ProductImageGallery product={product} category={category} />
            </div>

            {/* Right: Product Info */}
            <div className="min-w-0 animate-slide-up">
              {/* Category link */}
              {category && (
                <Link
                  href={`/categorias/${category.slug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#0F2178]/60 hover:text-[#0F2178] transition-colors py-2 mb-1"
                >
                  {category.name}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {/* Product name */}
              <h1
                className="font-black text-[#0A0A23] mb-4 break-words"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}
              >
                {name}
              </h1>

              {/* CTA — antes del texto largo para que la cotización sea visible
                  pronto en móvil (docs/seo-improvement-2026-10-09, U02). */}
              <div className="mb-7">
                <ProductActions product={product} />
              </div>

              {/* Short description */}
              {shortDescription && (
                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6">
                  {shortDescription}
                </p>
              )}

              {/* Trust pills — solo hechos publicados de forma central
                  (src/lib/business-facts.ts). "Calidad Premium" y "100%
                  Personalizable" se retiraron: no tienen fuente por producto. */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { emoji: '⚡', text: responseTimeLabel },
                  { emoji: '🎨', text: 'Personalización con tu logo' },
                  { emoji: '🚚', text: 'Envíos a todo Ecuador' },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-[#F8F9FC] border border-gray-100 rounded-full px-3 py-1.5"
                  >
                    <span aria-hidden="true">{item.emoji}</span>
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
                  <p className="text-gray-700 text-sm leading-relaxed">{cleanProductText(product.story, product)}</p>
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
                        className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalización — el catálogo no tiene técnicas confirmadas por
                  SKU. En vez de prometer las seis técnicas en todas las fichas
                  (bordado en un soporte plástico, sublimación en un termo sin
                  recubrimiento…), se explica de qué depende. */}
              <div className="border-t border-gray-100 pt-7">
                <h2 className="font-bold text-[#0A0A23] text-base mb-2">Personalización</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  La técnica (serigrafía, tampografía, láser, bordado, sublimación o UV) depende del material, del acabado y del área de impresión de este modelo. Te recomendamos la adecuada y te enviamos una prueba digital antes de producir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CÓMO COTIZAR ───────────────────────────────────── */}
      <QuoteGuide />

      {/* ─── RELATED PRODUCTS ───────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F8F9FC] border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 mb-10">
              <h2 className="font-bold text-[#0A0A23] text-2xl md:text-3xl" style={{ letterSpacing: '-0.025em' }}>
                Alternativas en {category?.name || 'esta categoría'}
              </h2>
              {category && (
                <Link
                  href={`/categorias/${category.slug}/`}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0F2178] hover:text-[#F5A520] transition-colors"
                >
                  Ver todos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ProductCard product={toCardProduct(p)} category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ─── Cómo cotizar ──────────────────────────────────────────
   Sustituye al acordeón que repetía descripción, características y usos ya
   mostrados arriba, más una lista fija de técnicas. Datos centrales de
   src/lib/business-facts.ts: mínimos y plazos se presentan como dependencia
   real porque el negocio todavía no confirmó valores por modelo. */
function QuoteGuide() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-bold text-[#0A0A23] text-xl md:text-2xl mb-6" style={{ letterSpacing: '-0.02em' }}>
          Cómo cotizar este producto
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#F8F9FC] border border-gray-100">
            <h3 className="font-semibold text-[#0A0A23] text-sm mb-3">Datos que necesitamos</h3>
            <ul className="space-y-2">
              {quoteChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#0A0A23] text-sm mb-1">Cantidad mínima</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{minimumOrderAnswer}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#0A0A23] text-sm mb-1">Plazos de producción y envío</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{leadTimeAnswer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
