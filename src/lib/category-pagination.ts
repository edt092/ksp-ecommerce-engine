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
// reports/category-product-link-coverage.csv).
//
// CORRECCIÓN 2026-07-26 (plan_accion_seo_ksp_vs_articulospromocionales_ec.md,
// P0 páginas huérfanas): el supuesto original de que "categorías con ≤24
// productos ya exponen el 100% de sus enlaces sin paginación" era falso.
// CategoryProductsGrid.tsx (la ruta no-paginada) solo renderiza los primeros
// 12 productos en el HTML estático — el resto se carga con
// IntersectionObserver, invisible para un crawler o para el propio build
// estático. Cualquier categoría con más de 12 productos tiene ese problema,
// no solo las de más de 24. Auditoría real vía out/**/*.html confirmó
// productos huérfanos exactamente en las categorías de este rango:
// automovil (34 — además superaba el umbral de 24 original y se había
// quedado fuera por un descuido, no por diseño), bicicleta (21),
// vasos-personalizados (18) y memorias-usb-personalizadas (16). El resto de
// categorías no listadas aquí tiene ≤12 productos, así que sí quedan 100%
// cubiertas por el HTML estático de CategoryProductsGrid sin necesitar esto.
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
  'automovil',
  'bicicleta',
  'vasos-personalizados',
  'memorias-usb-personalizadas',
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
