import productsData from '@/data/products.json';
import blogData from '@/data/blog/posts.json';
import categoriesData from '@/data/categories.json';
import { ecuador, colombia } from '@/data/geo-data';

const BASE_URL = 'https://www.kronosolopromocionales.com';

// Build date references — use real known dates rather than new Date()
// which causes every lastmod to be identical and lie about modification time.
const BUILD_DATE = '2026-04-09';

export default function sitemap() {
  // --- Static routes -------------------------------------------------------
  const staticRoutes = [
    { url: `${BASE_URL}/`,                                  lastModified: BUILD_DATE, priority: 1.0 },
    { url: `${BASE_URL}/contacto/`,                         lastModified: BUILD_DATE, priority: 0.8 },
    { url: `${BASE_URL}/nosotros/`,                         lastModified: '2026-01-15', priority: 0.6 },
    { url: `${BASE_URL}/blog/`,                             lastModified: BUILD_DATE, priority: 0.8 },
    { url: `${BASE_URL}/catalogos-digitales/`,              lastModified: '2026-02-01', priority: 0.6 },
    { url: `${BASE_URL}/politica-de-privacidad/`,           lastModified: '2026-01-01', priority: 0.3 },
    { url: `${BASE_URL}/productos-promocionales-ecuador/`,  lastModified: BUILD_DATE, priority: 0.9 },
    { url: `${BASE_URL}/productos-promocionales-colombia/`, lastModified: BUILD_DATE, priority: 0.9 },
  ];

  // --- Product routes ------------------------------------------------------
  const productRoutes = productsData.map((p) => ({
    url: `${BASE_URL}/productos/${p.slug}/`,
    lastModified: p.updatedAt || p.createdAt || BUILD_DATE,
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
  }));

  // --- Category routes -----------------------------------------------------
  const categoryRoutes = categoriesData.map((c) => ({
    url: `${BASE_URL}/categorias/${c.slug}/`,
    lastModified: BUILD_DATE,
  }));

  // --- Geo city routes (Ecuador) -------------------------------------------
  // WARNING: 5 Ecuador city pages + 5 Colombia city pages = 10 location pages total.
  // This is below the 30-page warning threshold but these pages are near-duplicates
  // (only city name, intro, and caracteristicas differ). Monitor carefully before
  // expanding. Do NOT add more cities without ensuring 60%+ unique content per page.
  const ecuadorCityRoutes = ecuador.ciudades.map((ciudad) => ({
    url: `${BASE_URL}/productos-promocionales-ecuador/${ciudad.slug}/`,
    lastModified: BUILD_DATE,
  }));

  const colombiaCityRoutes = colombia.ciudades.map((ciudad) => ({
    url: `${BASE_URL}/productos-promocionales-colombia/${ciudad.slug}/`,
    lastModified: BUILD_DATE,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...ecuadorCityRoutes,
    ...colombiaCityRoutes,
  ];

  // Guard: warn in dev if approaching the 50,000 URL hard limit.
  if (process.env.NODE_ENV !== 'production' && allRoutes.length > 45000) {
    console.warn(
      `[sitemap] URL count ${allRoutes.length} is approaching the 50,000 per-file limit. Split into a sitemap index.`
    );
  }

  return allRoutes;
}
