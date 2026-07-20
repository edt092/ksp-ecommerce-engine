# Mapa de clústeres prioritarios — Fase 12 (plan-seo.md)

Estado al 2026-07-20. Generado a partir de `reports/content-cluster-map.csv`,
`reports/categories-without-blog-support.csv` y `reports/blog-cannibalization.csv`
(`scripts/audit-content-clusters.mjs`). Los 7 clústeres son los que el plan
marca como prioritarios según GSC.

| Clúster | Landing comercial | Categoría/hub | Posts de apoyo | Estado |
|---|---|---|---|---|
| Regalos corporativos | `/regalos-corporativos/` | landing = hub | 17 posts | ✅ Fuerte |
| Bolígrafos promocionales | `/categorias/boligrafos-publicitarios/` | `boligrafos-publicitarios` | 3 posts | ✅ Cubierto |
| Mugs y termos | `/categorias/mugs-y-termos-personalizados/` | `mugs-y-termos-personalizados` | **0 posts** | ⚠️ Sin contenido de apoyo |
| Tecnología promocional | `/categorias/tecnologia-promocional/` | `tecnologia-promocional` | 3 posts | ✅ Cubierto |
| Artículos ecológicos | `/categorias/ecologia/` | `ecologia` | 3 posts | ✅ Cubierto |
| Ferias empresariales | `/merchandising-corporativo/` | landing = hub (sin categoría de producto dedicada — cruza varias) | 1 post | ✅ Cubierto (mínimo) |
| Kits de bienvenida | **ninguna** | **ninguna** | **0 posts** | 🔴 Clúster sin construir |

## Enlazado blog → categoría/landing: cerrado esta sesión

Los 40 posts de blog ya enlazan a al menos una categoría o landing comercial real
(`product_links_count + category_links_count + landing_links_count > 0` en
`reports/content-cluster-map.csv`). Antes de esta sesión, 6 posts no tenían
ningún enlace comercial — 5 de ellos porque su contenido estaba truncado a
mitad de frase (ver `docs/seo-session-pending-2026-07-20.md`).

## Pendiente: enlazado categoría/landing → blog (el otro sentido)

**Ninguna** página de categoría ni landing comercial enlaza de vuelta a un
post de blog relevante (verificado: `grep -rn "href.*\/blog\/" src/app/categorias/
src/app/regalos-corporativos/ ...` no encontró resultados). El plan pide
"enlaces bidireccionales contextuales" por clúster — esta mitad falta.

Implementación sugerida para una sesión futura: una sección "Artículos
relacionados" en `src/app/categorias/[slug]/page.tsx`, mapeando cada
categoría a los posts cuyo `category`/`tags` coincidan (mismo criterio que
`categoryInboundLinks` en el script de auditoría). Empezar por las
categorías de los 6 clústeres ya cubiertos, no por las 37.

## Cannibalización: 4 posts con intención solapada (no 3 — el audit original decía "3")

`reports/blog-cannibalization.csv` tiene 160 pares con similitud de
tags/título ≥ 0.20. El grupo más alto (0.55–0.58 de similitud) es una tanda
de 4 posts de enero 2025, mismo patrón "Guía Completa: Productos
Promocionales X":

- `beneficios-productos-promocionales-ecuador-guia-completa` (beneficios)
- `productos-promocionales-por-mayor-mayoreo-guia-completa` (compra al por mayor)
- `productos-promocionales-baratos-guia-completa` (opciones económicas)
- `productos-promocionales-ecuador` (guía general, la más antigua — nov 2024)

**No se tocaron.** El plan exige comparar consultas reales de GSC antes de
decidir mantener/reenfocar/consolidar, y no hay `GSC_DIR` configurado en
este entorno local. Pendiente de una sesión con datos reales de Search
Console.

## Contenido corregido esta sesión (hallazgo adicional, fuera del plan original)

5 posts del lote `data/blog/content/fase3.js` estaban truncados a mitad de
frase o etiqueta HTML — bug de `max_tokens` insuficiente en
`scripts/generate-blog-fase3.js` (corregido: 6000 → 16000). Sin presupuesto
de API disponible en esta sesión para regenerarlos completos, se cerraron
las etiquetas HTML rotas y se añadió un párrafo de cierre corto + enlace
comercial real a cada uno, sin inventar el contenido que falta:

- `mejores-regalos-corporativos-para-empresas-ecuador-2026`
- `merchandising-para-ferias-empresariales-ecuador`
- `boligrafos-promocionales-personalizados-guia-empresas-ecuador`
- `articulos-promocionales-ecologicos-para-empresas-ecuador`
- `cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador`

Estos 5 quedan **legibles y sin HTML roto, pero más cortos de lo previsto
originalmente** (cortan antes de secciones que el prompt original pedía,
como "errores a evitar" o el FAQ completo). Regenerarlos completos con la
API (con el `max_tokens` ya corregido) queda pendiente para cuando haya
saldo disponible.
