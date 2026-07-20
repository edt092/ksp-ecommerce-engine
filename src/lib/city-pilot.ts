// Fase 6/7 (plan-seo.md) — piloto de páginas de ciudad.
//
// Hallazgo confirmado: cada página de ciudad emitía su propio LocalBusiness
// independiente ("KS Promocionales Quito", "KS Promocionales Guayaquil"...)
// sin @id compartido, lo que declara ante Google 5 negocios distintos
// cuando en realidad existe una sola entidad real (ver el LocalBusiness con
// @id estable en src/app/layout.tsx, #localbusiness).
//
// Piloto: SOLO Quito. Es la ciudad de la dirección real ya declarada en el
// LocalBusiness global (layout.tsx), por lo que un modelo Service→provider
// apuntando a ese @id es honesto sin necesitar verificar nada nuevo del
// negocio. Las otras 4 ciudades (Cuenca, Ambato, Manta con rendimiento
// histórico positivo en GSC según el plan; Guayaquil sin dato) mantienen su
// schema y contenido actuales sin cambios hasta aprobación explícita para
// extender. No añadir slugs aquí sin esa aprobación.
export const CITY_PILOT_SLUGS = new Set<string>(['quito']);

export function isPilotCity(slug: string): boolean {
  return CITY_PILOT_SLUGS.has(slug);
}
