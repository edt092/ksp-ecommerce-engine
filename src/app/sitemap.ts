import productsData from '@/data/products.json';
import blogData from '@/data/blog/posts.json';
import categoriesData from '@/data/categories.json';
import { ecuador } from '@/data/geo-data';

const BASE_URL = 'https://www.kronosolopromocionales.com';

// Build date references — use real known dates rather than new Date()
// which causes every lastmod to be identical and lie about modification time.
const BUILD_DATE = '2026-05-31';

export default function sitemap() {
  // --- Static routes -------------------------------------------------------
  const staticRoutes = [
    { url: `${BASE_URL}/`,                                  lastModified: BUILD_DATE, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/contacto/`,                         lastModified: BUILD_DATE, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/nosotros/`,                         lastModified: '2026-01-15', priority: 0.6, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/blog/`,                             lastModified: BUILD_DATE, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/catalogos-digitales/`,              lastModified: '2026-02-01', priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/politica-de-privacidad/`,           lastModified: '2026-01-01', priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/productos-promocionales-ecuador/`,  lastModified: BUILD_DATE, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/regalos-corporativos/`,             lastModified: BUILD_DATE, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/articulos-promocionales/`,          lastModified: BUILD_DATE, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/material-publicitario/`,            lastModified: BUILD_DATE, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/merchandising-corporativo/`,        lastModified: BUILD_DATE, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/parlantes-bluetooth/`,              lastModified: BUILD_DATE, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/audifonos-promocionales/`,          lastModified: BUILD_DATE, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/soportes-para-celular/`,            lastModified: BUILD_DATE, priority: 0.8, changeFrequency: 'monthly' },
  ];

  // --- Product routes ------------------------------------------------------
  // Solo incluir productos con is_ai_optimized: true para evitar thin content.
  // Los productos sin ese campo (generados por el scraper básico con plantillas)
  // se excluyen del sitemap hasta que pasen por el pipeline de enriquecimiento.
  const productRoutes = (productsData as any[])
    .filter((p) => p.is_ai_optimized === true)
    .map((p) => ({
      url: `${BASE_URL}/productos/${p.slug}/`,
      lastModified: p.updatedAt || p.createdAt || BUILD_DATE,
      priority: 0.6,
      changeFrequency: 'monthly',
    }));

  // --- Blog routes ---------------------------------------------------------
  // Use real per-post dates. dateModified takes precedence over date.
  const blogRoutes = blogData.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}/`,
    lastModified: p.dateModified
      ? p.dateModified.slice(0, 10)
      : p.date
        ? p.date.slice(0, 10)
        : BUILD_DATE,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  // --- Category routes -----------------------------------------------------
  const categoryRoutes = categoriesData.map((c) => ({
    url: `${BASE_URL}/categorias/${c.slug}/`,
    lastModified: BUILD_DATE,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  // --- Geo city routes (Ecuador) -------------------------------------------
  // Site is Ecuador-only — 5 city pages. These are near-duplicates (only city
  // name, intro, and caracteristicas differ), well below the 30-page warning
  // threshold. Do NOT add more cities without ensuring 60%+ unique content per page.
  const ecuadorCityRoutes = ecuador.ciudades.map((ciudad) => ({
    url: `${BASE_URL}/productos-promocionales-ecuador/${ciudad.slug}/`,
    lastModified: BUILD_DATE,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
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
