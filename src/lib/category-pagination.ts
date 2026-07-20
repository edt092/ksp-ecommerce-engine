// Fase 9 (plan-seo.md) — paginación estática de categorías.
//
// Categorías grandes (ej. boligrafos-publicitarios: 171 productos) solo
// exponían ~12 enlaces <a href> reales en el HTML estático; el resto se
// cargaba vía scroll infinito client-side (CategoryProductsGrid), invisible
// para un crawler que no ejecuta JS y débil para uno que sí lo hace.
//
// Piloto autorizado por el plan: SOLO boligrafos-publicitarios hasta build
// exitoso + auditoría de canonicals + revisión visual + aprobación humana
// para extender a las 37 categorías. No añadir slugs aquí sin esa aprobación.
export const PAGINATED_CATEGORY_SLUGS = new Set<string>(['boligrafos-publicitarios']);

// Balance entre reducir el nº de páginas generadas y mantener cada página
// con un volumen de enlaces reales sano para crawl budget.
export const CATEGORY_PAGE_SIZE = 24;

export function isPaginatedCategory(slug: string): boolean {
  return PAGINATED_CATEGORY_SLUGS.has(slug);
}

export function totalPagesFor(productCount: number, pageSize: number = CATEGORY_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(productCount / pageSize));
}
