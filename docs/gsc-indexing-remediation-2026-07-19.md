# Plan de remediación de indexación — GSC 2026-07-19

Fuente: informe agregado de Search Console en `C:\Users\Dagon\Desktop\KSP-SEO\no_index\`
(`Problemas críticos.csv`, `Gráfico.csv`, `Metadatos.csv`), normalizado en
`reports/gsc-indexing-summary-2026-07-19.csv` y `reports/gsc-indexing-trend-2026-07-19.csv`.

**Corrección sobre la fuente**: `Gráfico.csv` no termina el 2026-06-16 — el último dato real es
**2026-07-09**. Los 593 URL sin indexar están estables desde el 2026-06-30 (11 días corridos al
cierre del export), y 593 = 373 + 23 + 7 + 85 + 1 + 104, que cuadra exactamente con
`Problemas críticos.csv`.

**Objetivo explícito de este plan** (igual que en `noindex.md`): no indexar las 593 URL
indiscriminadamente. El objetivo real es que las páginas valiosas sean indexables, que las
débiles/duplicadas/redirigidas/inexistentes sigan excluidas correctamente, y que las señales
(sitemap, canonical, robots, enlaces internos) sean coherentes entre sí.

## 1. Duplicada: el usuario no ha indicado ninguna versión canónica (1 URL) — P0

**Estado**: único hallazgo marcado como error técnico real; GSC aún no inició validación.

**Lo que hice sin necesitar el export**: el mecanismo de canonical dual-slug en
`src/app/productos/[slug]/page.tsx` (que noindexa variantes tipo `slug-1234` y las canonicaliza
hacia `slug`) **hoy no aplica a ningún producto** (`dualSlug: 0` al recalcular sobre
`data/products.json` actual). En cambio encontré **6 grupos de productos con el mismo `name`**
cuyos slugs no están relacionados por sufijo numérico y que por tanto ese mecanismo no cubre —
documentados en `reports/canonical-audit.csv` (columna `duplicate_group`, `dup-1`..`dup-6`):

| Grupo | Nombre | Slugs | Señal |
| --- | --- | --- | --- |
| dup-1 | Reloj Led Bamboo | `reloj-led-bamboo-oferta-9721`, `reloj-led-bamboo-9721` | imágenes idénticas, misma categoría — duplicado fuerte |
| dup-2 | Alcancia Piggy Max | `relojes-alcancia-piggy-max`, `alcancia-piggy-max-13495` | categoría distinta (relojes vs novedades) — posible error de categorización, no necesariamente duplicado de contenido |
| dup-3 | Cobija Pillow | `relojes-cobija-pillow`, `cobija-pillow-13501` | misma categoría |
| dup-4 | Paraguas Brook Ergo 27 | `paraguas-brook-ergo-27-9187`, `paraguas-brook-ergo-27-7512-3865` | mismo nombre |
| dup-5 | Bolígrafo Ventura Clean Set | `boligrafo-ventura-clean-set-10840`, `boligrafo-ventura-clean-set-articulos-promocionales` | mismo nombre |
| dup-6 | Paraguas 27 | `paraguas-27-5913-3858` (is_ai_optimized=false), `paraguas-27-9218` | seoTitle idéntico, uno ya está en noindex por is_ai_optimized=false |

**Confirmado con el build real** (no solo con el código fuente): las 12 URLs de estos 6 grupos
están **las 12 dentro del sitemap generado, todas indexables (`robots: index`) y todas
auto-canónicas** — es decir, ningún mecanismo del sitio les asigna una canonical hacia la otra
mitad del par. Esto es exactamente el patrón técnico que produce un hallazgo de "duplicada sin
canonical" en GSC: dos URLs con contenido muy similar, ambas sirviéndose como si fueran la
versión canónica. Ver `reports/sitemap-indexability-audit.csv`, columna `issues` =
`NO_DEBERIA_ESTAR_EN_SITEMAP` para las 12 filas.

**Por qué no toqué el código todavía**: `noindex.md` prohíbe consolidar o eliminar productos y
cambiar slugs sin verificación. Aunque el patrón técnico está confirmado, no sé **cuál de estos 6
grupos específicamente** es el que GSC reporta (GSC solo reporta 1 URL, no 6) — podría ser uno de
estos, o una URL completamente distinta (parámetros, paginación, una variante histórica que ya no
existe). Actuar sobre los 6 a ciegas asignando canonicals sin confirmar cuál es el real violaría
la instrucción explícita del brief de no tocar más de 20 productos sin evidencia.

**Acción pendiente y de quién**: exportar la URL exacta desde Inspección de URLs en GSC (ver
`docs/gsc-indexing-export-checklist.md`). Con eso, la corrección más segura para cualquiera de
estos grupos que resulte real es añadir `alternates.canonical` explícito hacia la variante más
fuerte de contenido en `generateMetadata` — el mismo patrón que ya usa el código para las
variantes de ID, sin borrar ningún producto ni cambiar slugs.

## 2. Rastreada: actualmente sin indexar (85 URL) — P1

Decisión de calidad/duplicación de Google, no un error del sitio. Sin el export de las 85 URLs
concretas, usé `reports/indexable-product-quality.csv` (2,185 productos puntuados 0-100 por una
heurística reproducible: nombre, `seoDescription`, `story`, `features`, `useCases`, imágenes,
categoría) como proxy de qué páginas son candidatas plausibles:

- Distribución de calificación A-E: **A (mantener)=2089, B (mejorar)=1, C (consolidar)=12,
  D (noindex, ya aplicado)=83, E (redirect/retirar)=0**.
- Los 12 productos `C` son exactamente los 12 URLs de los 6 grupos duplicados de la sección 1.
- El campo preexistente `quality_score` de `data/products.json` (1,830/2,185 productos lo tienen;
  distribución: 1,673 en 100, 141 en 80, y solo 10 por debajo de 90) es una señal *distinta* —
  probablemente de un scoring del pipeline de IA de generación de contenido, no de SEO técnico —
  y se incluye en `indexable-product-quality.csv` como columna informativa
  (`existing_quality_score_field`), sin mezclarlo con el cálculo propio.

**Acción pendiente**: exportar aunque sea una muestra de 10 URLs reales de este motivo (ver
checklist) para confirmar si el patrón "duplicado de nombre" o "contenido débil" se sostiene.

## 3. Descubierta: actualmente sin indexar (104 URL) — P1

Backlog de rastreo/prioridad de Google, no un error de sitio. `Validación: Iniciada` (a diferencia
de los otros motivos en `Error`) sugiere que Google ya está trabajando en esto activamente.

Generé `reports/discovered-not-indexed-strategy.csv` con niveles P0-P4 a partir de
`reports/local-indexability-inventory.csv`, cruzando `in_sitemap` + enlaces internos estáticos +
`content_score`. Distribución real tras la corrida: **P0=1, P1=23, P2=0, P3=9, P4=2154**.

**Limitación honesta y explícita**: la mayoría de productos y posts de blog se enlazan en
producción mediante componentes que arman el `href` en runtime a partir de datos
(`src/components/ProductCard.tsx`, `src/app/blog/page.tsx`), no mediante `href` literal en JSX.
Mi detector de enlaces internos (regex estática) **no puede resolver esos casos**, así que para
`type=product` y `type=blog` NO usé el conteo de enlaces como señal de prioridad — solo
`in_sitemap` + `content_score` (por eso la mayoría cae en P4 = "confirmar manualmente", no en P1).
Donde el conteo SÍ es fiable (categorías, ciudades, páginas comerciales/legales) identifiqué
**24 páginas huérfanas reales** (`reports/orphan-pages.csv`) sin ningún enlace estático detectado
desde menús, footer, home o listados — ver sección de sitemap/enlaces internos más abajo.

**Acción pendiente**: exportar la lista real de 104 URLs para reemplazar esta estimación por
datos verificados, y priorizar enlazado interno o mejora de contenido según corresponda.

## 4. Página con redirección (23 URL) — P2

`Validación: Error`, pero el repo ya tiene **303 reglas de redirect** activas
(`public/_redirects` + `netlify.toml`), incluyendo los 5 redirects de productos legacy que se
añadieron en la tarea de `404.md` (commit `5131356`: `portacomida-produccion-nacional`,
`canguro-dior`, `bola-para-mascotas`, `copa-para-vino-7oz-produccion-nacional`,
`speaker-bluetooth-con-lampara-oferta` → sus slugs con ID) y todos los redirects de Colombia del
commit `b8a7ca8`.

Es probable que buena parte de las 23 URL sean redirects **intencionales y correctos**, y que
GSC solo los reporte como "no indexados" porque, por definición, una URL con 301 no debe
indexarse — eso sería el comportamiento esperado, no un error. Generé
`reports/indexing-redirect-audit.csv` con las 303 reglas existentes marcadas como
`regla_existente_en_repo_pendiente_de_cotejar_con_export_gsc`: el script
`scripts/analyze-indexing-reasons.mjs` está listo para cruzar automáticamente contra el export
real de GSC (`redirect.csv`) en cuanto lo tengas, y decidir cuáles de las 23 son redirects sanos
vs cuáles apuntan a un destino que ya no existe (redirect roto).

## 5. No se ha encontrado — 404 (7 URL) — P2

Este motivo se solapa con el trabajo ya ejecutado y comprometido en la tarea `404.md`
(commit `5131356`, ya en `main`). Ese trabajo resolvió 5 URLs de productos legacy con 404 real
detectadas en el propio análisis de esa sesión (top 10 con impresiones y cero clics). **No sé si
esas 5 son las mismas 7 que reporta este informe** — podrían solaparse total, parcialmente, o ser
un lote distinto. No se debe repetir ni revertir ese trabajo sin confirmar primero.

**Acción pendiente**: exportar las 7 URLs exactas (`404.csv`) para confirmar solape con el trabajo
ya hecho, sin tocar nada de código hasta tenerlas.

## 6. Excluida por noindex (373 URL) — P3

`Validación: Error`, pero un `noindex` es, casi por definición, una señal **intencional** — que
GSC lo marque como "Error" no implica que el sitio esté mal configurado, solo que Google detectó
la directiva y la respetó.

Localmente solo pude verificar **84 productos** con `robots: {index:false}` explícito, todos por
`is_ai_optimized=false` (pendientes de enriquecimiento de contenido) — ver
`reports/noindex-audit.csv`. La discrepancia 373 vs 84 (289 URLs) puede deberse a varias causas
que no puedo distinguir sin el export:
- URLs históricas que ya no existen en el sitio actual (productos eliminados, categorías
  renombradas, rutas de una estructura anterior).
- Parámetros de URL o rutas con trailing slash / sin trailing slash contadas por separado.
- Páginas noindex por otros mecanismos no cubiertos por mi inventario (p. ej. si alguna vez
  existieron rutas de Colombia con noindex antes de ser eliminadas — la limpieza de Colombia del
  commit `b8a7ca8` borró rutas completas, lo que generaría justamente noindex/404 históricos en
  GSC durante un tiempo).

**Acción pendiente**: exportar `noindex.csv` para reconciliar la diferencia real. Mientras tanto,
no se recomienda ninguna acción — no hay evidencia de que las 373 sean un problema; es más
probable que sea ruido histórico + los 84 casos intencionales ya conocidos.

## Referencia cruzada: Core Web Vitals

No se ejecutó una nueva auditoría de rendimiento para este trabajo — no aporta a un problema de
*indexación* directamente. `reports/core-web-vitals-lab.md` (generado 2026-07-18) ya documenta que
LCP está lejos del objetivo en las 6 plantillas medidas y que CLS ya cumple; eso es relevante para
"crawlability"/calidad de página solo como contexto adicional, no como causa de las 593 URL.

## Resumen de prioridades (P0 → P3)

| Prioridad | Motivo | Acción |
| --- | --- | --- |
| P0 | Duplicada sin canonical (1) | Exportar URL exacta vía Inspección de URLs; candidatos ya identificados en `reports/canonical-audit.csv` |
| P1 | Rastreada sin indexar (85) + Descubierta sin indexar (104) | Exportar tablas reales; mientras tanto, reforzar enlazado interno en las 24 huérfanas confirmadas de `reports/orphan-pages.csv` |
| P2 | Redirección (23) + 404 (7) | Exportar tablas reales para confirmar solape con trabajo ya hecho antes de tocar redirects |
| P3 | Noindex (373 vs 84 local) | Exportar `noindex.csv` para reconciliar; sin evidencia de problema real hoy |
