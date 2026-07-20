// Fase 9 (plan-seo.md) — paginación estática de categorías.
//
// Categorías grandes solo exponían ~12 enlaces <a href> reales en el HTML
// estático; el resto se cargaba vía scroll infinito client-side
// (CategoryProductsGrid), invisible para un crawler que no ejecuta JS y
// débil para uno que sí lo hace.
//
// Piloto en boligrafos-publicitarios (171 productos) validado: build
// exitoso, canonicals autorreferenciales correctos, revisión visual en
// navegador, todas las pruebas seo:* en 0. Aprobado por el usuario el
// 2026-07-20 para extender a toda categoría con más productos que
// CATEGORY_PAGE_SIZE (umbral usado para generar
// reports/category-product-link-coverage.csv). Categorías con ≤24
// productos ya exponen el 100% de sus enlaces sin paginación — no se
// añaden aquí porque no tienen el problema que esto resuelve.
export const PAGINATED_CATEGORY_SLUGS = new Set<string>([
  'novedades',
  'boligrafos-publicitarios',
  'mochilas-y-maletines-personalizados',
  'tecnologia-promocional',
  'tomatodos-y-botilitos-personalizados',
  'precio-bomba',
  'ecologia',
  'hogar',
  'articulos-de-oficina-personalizados',
  'medicos',
  'produccion-nacional',
  'variedades',
  'deportes',
  'master-line',
  'mugs-y-termos-personalizados',
  'econature',
  'infantil',
  'bar-y-vino',
  'iluminacion',
  'juegos',
  'paraguas',
  'herramientas',
  'antiestres',
  'cuidado-personal',
  'llaveros-personalizados',
  'relojes',
]);

// Balance entre reducir el nº de páginas generadas y mantener cada página
// con un volumen de enlaces reales sano para crawl budget.
export const CATEGORY_PAGE_SIZE = 24;

export function isPaginatedCategory(slug: string): boolean {
  return PAGINATED_CATEGORY_SLUGS.has(slug);
}

export function totalPagesFor(productCount: number, pageSize: number = CATEGORY_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(productCount / pageSize));
}
