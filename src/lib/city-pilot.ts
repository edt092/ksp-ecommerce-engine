// Fase 6/7 (plan-seo.md) — piloto de páginas de ciudad.
//
// Hallazgo confirmado: cada página de ciudad emitía su propio LocalBusiness
// independiente ("KS Promocionales Quito", "KS Promocionales Guayaquil"...)
// sin @id compartido, lo que declara ante Google 5 negocios distintos
// cuando en realidad existe una sola entidad real (ver el LocalBusiness con
// @id estable en src/app/layout.tsx, #localbusiness).
//
// Piloto validado en Quito (build, canonicals, revisión visual — commit
// a2eed60), extendido a Guayaquil el 2026-07-20: es la única de las 4
// ciudades restantes sin advertencia de rendimiento histórico en GSC en el
// plan. Cuenca, Ambato y Manta SÍ tienen esa advertencia ("ya mostraron
// rendimiento positivo en GSC histórico") — el cambio de schema no toca
// contenido visible, pero se dejan fuera hasta revisar esos datos reales
// antes de tocar esas páginas, por decisión explícita del usuario. No
// añadir esos 3 slugs aquí sin esa revisión.
export const CITY_PILOT_SLUGS = new Set<string>(['quito', 'guayaquil']);

export function isPilotCity(slug: string): boolean {
  return CITY_PILOT_SLUGS.has(slug);
}
