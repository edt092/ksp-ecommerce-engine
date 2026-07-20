import { readFileSync } from 'fs';
import { join } from 'path';
import productsData from '@/data/products.json';
import blogData from '@/data/blog/posts.json';
import categoriesData from '@/data/categories.json';
import { ecuador } from '@/data/geo-data';
import { PAGINATED_CATEGORY_SLUGS, totalPagesFor } from '@/lib/category-pagination';

const BASE_URL = 'https://www.kronosolopromocionales.com';

// Fase 5 (plan-seo.md): estrategia real de lastmod, auditada en
// reports/sitemap-lastmod-audit.csv (scripts/audit-sitemap-lastmod.mjs).
//
// Regla del plan: "Es preferible omitir lastmod a publicar una fecha
// falsa." Antes, TODO lo que no tuviera un campo de fecha real caía en un
// único BUILD_DATE hardcodeado — incluidos el 100% de los 2.036 productos
// indexables (updatedAt/createdAt no existen en products.json; el campo
// real es last_ai_update, que sitemap.ts nunca leía), las 37 categorías y
// las 5 ciudades. Ahora:
//   - Productos: last_ai_update si existe (87.8% de los indexables);
//     si no, se omite lastmod para ese producto.
//   - Blog: dateModified o date (100% de cobertura real, sin cambios).
//   - Categorías y ciudades: SIN lastmod — no existe un campo de fecha
//     real por categoría/ciudad en los datos (categories.json y
//     geo-data.js no lo tienen), y usar la fecha de git del archivo
//     compartido daría la MISMA fecha a las 37 categorías o las 5
//     ciudades, que es exactamente el patrón que el plan pide evitar.
//   - Páginas estáticas: fecha real de "último commit que tocó ese
//     archivo" (git log), capturada en la auditoría del 2026-07-20 —
//     no es new Date() ni un valor inventado, es un hecho verificable.
//     Si esas páginas cambian de forma significativa, actualizar aquí.
function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export default function sitemap() {
  // --- Static routes (fecha real por página, ver nota arriba) --------------
  const staticRoutes = [
    { url: `${BASE_URL}/`,                                  lastModified: '2026-07-20', priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/contacto/`,                         lastModified: '2026-06-20', priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/nosotros/`,                         lastModified: '2026-07-19', priority: 0.6, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/blog/`,                             lastModified: '2026-07-16', priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/catalogos-digitales/`,              lastModified: '2026-06-20', priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/politica-de-privacidad/`,           lastModified: '2026-06-20', priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/productos-promocionales-ecuador/`,  lastModified: '2026-07-20', priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/regalos-corporativos/`,             lastModified: '2026-07-19', priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/articulos-promocionales/`,          lastModified: '2026-07-19', priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/material-publicitario/`,            lastModified: '2026-07-19', priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/merchandising-corporativo/`,        lastModified: '2026-07-19', priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/parlantes-bluetooth/`,              lastModified: '2026-07-16', priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/audifonos-promocionales/`,          lastModified: '2026-07-16', priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/soportes-para-celular/`,            lastModified: '2026-07-16', priority: 0.8, changeFrequency: 'monthly' },
  ];

  // --- Product routes ------------------------------------------------------
  // Solo incluir productos con is_ai_optimized: true para evitar thin content.
  // Los productos sin ese campo (generados por el scraper básico con plantillas)
  // se excluyen del sitemap hasta que pasen por el pipeline de enriquecimiento.
  const productRoutes = (productsData as any[])
    .filter((p) => p.is_ai_optimized === true)
    .map((p) => ({
      url: `${BASE_URL}/productos/${p.slug}/`,
      ...(p.last_ai_update ? { lastModified: dateOnly(p.last_ai_update) } : {}),
      priority: 0.6,
      changeFrequency: 'monthly',
    }));

  // --- Blog routes ---------------------------------------------------------
  // Use real per-post dates. dateModified takes precedence over date.
  // Sin fallback a una fecha compartida — si un post no tuviera ninguna de
  // las dos, se omite lastmod para esa URL en vez de inventar una fecha.
  const blogRoutes = blogData.map((p) => {
    const real = p.dateModified || p.date;
    return {
      url: `${BASE_URL}/blog/${p.slug}/`,
      ...(real ? { lastModified: dateOnly(real) } : {}),
      priority: 0.7,
      changeFrequency: 'monthly',
    };
  });

  // --- Category routes -----------------------------------------------------
  // Sin lastmod — no existe un campo de fecha real por categoría (ver nota
  // arriba). Se prioriza y clasifica igual; solo se omite el campo de fecha.
  const categoryRoutes = categoriesData.map((c) => ({
    url: `${BASE_URL}/categorias/${c.slug}/`,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  // --- Category pagination routes (Fase 9 piloto, plan-seo.md) -------------
  // Solo páginas 2..N de las categorías en PAGINATED_CATEGORY_SLUGS. Sin
  // lastmod por la misma razón que las categorías base.
  const categoryPaginationRoutes: { url: string; priority: number; changeFrequency: string }[] = [];
  for (const slug of PAGINATED_CATEGORY_SLUGS) {
    const category = categoriesData.find((c) => c.slug === slug);
    if (!category) continue;
    let products: any[] = [];
    try {
      const raw = readFileSync(join(process.cwd(), 'data', 'category-products', `${category.id}.json`), 'utf-8');
      products = JSON.parse(raw).products;
    } catch {
      continue;
    }
    const totalPages = totalPagesFor(products.length);
    for (let page = 2; page <= totalPages; page++) {
      categoryPaginationRoutes.push({
        url: `${BASE_URL}/categorias/${slug}/pagina/${page}/`,
        priority: 0.5,
        changeFrequency: 'weekly',
      });
    }
  }

  // --- Geo city routes (Ecuador) -------------------------------------------
  // Site is Ecuador-only — 5 city pages. These are near-duplicates (only city
  // name, intro, and caracteristicas differ), well below the 30-page warning
  // threshold. Do NOT add more cities without ensuring 60%+ unique content per page.
  // Sin lastmod por la misma razón que las categorías (sin fecha real por
  // ciudad — ver nota arriba).
  const ecuadorCityRoutes = ecuador.ciudades.map((ciudad) => ({
    url: `${BASE_URL}/productos-promocionales-ecuador/${ciudad.slug}/`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...categoryPaginationRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...ecuadorCityRoutes,
  ];

  // Guard: warn in dev if approaching the 50,000 URL hard limit.
  if (process.env.NODE_ENV !== 'production' && allRoutes.length > 45000) {
    console.warn(
      `[sitemap] URL count ${allRoutes.length} is approaching the 50,000 per-file limit. Split into a sitemap index.`
    );
  }

  return allRoutes;
}
