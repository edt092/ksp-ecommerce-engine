import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StaticProductsGrid from '@/components/StaticProductsGrid';
import CategoryPagination from '@/components/CategoryPagination';
import categoriesData from '@/data/categories.json';
import WAIcon from '@/components/icons/WhatsAppIcon';
import { PAGINATED_CATEGORY_SLUGS, CATEGORY_PAGE_SIZE, totalPagesFor } from '@/lib/category-pagination';

const BASE_URL = 'https://www.kronosolopromocionales.com';

function readCategoryProducts(categoryId: string) {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'category-products', `${categoryId}.json`), 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.products as any[];
  } catch {
    return [];
  }
}

// Fase 9 (plan-seo.md) — solo genera páginas 2..N para las categorías del
// piloto (PAGINATED_CATEGORY_SLUGS). No extender sin aprobación humana tras
// revisar build + canonicals + revisión visual del piloto.
export async function generateStaticParams() {
  const params: { slug: string; page: string }[] = [];

  for (const slug of PAGINATED_CATEGORY_SLUGS) {
    const category = categoriesData.find((c) => c.slug === slug);
    if (!category) continue;
    const products = readCategoryProducts(category.id);
    const totalPages = totalPagesFor(products.length);
    for (let page = 2; page <= totalPages; page++) {
      params.push({ slug, page: String(page) });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const category = categoriesData.find((c) => c.slug === params.slug);
  const page = Number(params.page);
  if (!category || !PAGINATED_CATEGORY_SLUGS.has(params.slug) || !Number.isInteger(page) || page < 2) {
    return { title: 'Página no encontrada' };
  }

  const products = readCategoryProducts(category.id);
  const totalPages = totalPagesFor(products.length);
  if (page > totalPages) return { title: 'Página no encontrada' };

  const canonical = `${BASE_URL}/categorias/${category.slug}/pagina/${page}/`;

  return {
    title: `${category.seoTitle} — Página ${page} de ${totalPages}`,
    description: `${category.seoDescription} Página ${page} de ${totalPages}.`,
    alternates: {
      canonical,
      languages: {
        'es-EC': canonical,
        'x-default': canonical,
      },
    },
  };
}

export default function CategoryPagePaginated({ params }) {
  const category = categoriesData.find((c) => c.slug === params.slug);
  const page = Number(params.page);

  if (!category || !PAGINATED_CATEGORY_SLUGS.has(params.slug) || !Number.isInteger(page) || page < 2) {
    notFound();
  }

  const allProducts = readCategoryProducts(category.id);
  const totalPages = totalPagesFor(allProducts.length);
  if (page > totalPages) notFound();

  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const pageProducts = allProducts.slice(start, start + CATEGORY_PAGE_SIZE);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Categorías', item: `${BASE_URL}/regalos-corporativos/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/categorias/${category.slug}/` },
      { '@type': 'ListItem', position: 4, name: `Página ${page}`, item: `${BASE_URL}/categorias/${category.slug}/pagina/${page}/` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — Página ${page} — KS Promocionales`,
    url: `${BASE_URL}/categorias/${category.slug}/pagina/${page}/`,
    numberOfItems: pageProducts.length,
    itemListElement: pageProducts.map((product, idx) => ({
      '@type': 'ListItem',
      position: start + idx + 1,
      item: { '@type': 'Product', name: product.name, url: `${BASE_URL}/productos/${product.slug}/` },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* ─── HERO (compacto — el contenido editorial completo vive solo en
          la página 1 para no duplicar texto entre páginas) ────────────── */}
      <section
        className="relative overflow-hidden pt-16 md:pt-[68px]"
        style={{ background: 'linear-gradient(135deg, #091557 0%, #0F2178 50%, #0F2178 100%)' }}
      >
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-70" />

        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/50">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li className="text-white/25">/</li>
              <li><Link href="/regalos-corporativos/" className="hover:text-white transition-colors">Categorías</Link></li>
              <li className="text-white/25">/</li>
              <li><Link href={`/categorias/${category.slug}/`} className="hover:text-white transition-colors">{category.name}</Link></li>
              <li className="text-white/25">/</li>
              <li className="text-white/80 font-medium">Página {page}</li>
            </ol>
          </nav>

          <h1 className="font-black text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}>
            {category.name} — Página {page} de {totalPages}
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xl">
            {allProducts.length} productos personalizables con tu logo en esta categoría.
          </p>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <StaticProductsGrid products={pageProducts} category={category} />
          <CategoryPagination basePath={`/categorias/${category.slug}`} currentPage={page} totalPages={totalPages} />

          <div
            className="mt-10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#0F2178]/10 bg-[#F8F9FC]"
            style={{ borderRadius: '14px' }}
          >
            <div>
              <p className="font-semibold text-[#0A0A23] text-sm">
                ¿Buscas algo específico en {category.name}?
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                Escríbenos y te ayudamos a encontrar el producto ideal.
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
        </div>
      </section>
    </>
  );
}
