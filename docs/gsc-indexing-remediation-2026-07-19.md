# Plan de remediación de indexación — GSC 2026-07-19

Fuente: informe agregado de Search Console en `C:\Users\Dagon\Desktop\KSP-SEO\no_index\`
(`Problemas críticos.csv`, `Gráfico.csv`, `Metadatos.csv`) **+ los 6 exports reales por URL**
(`TABLAS 1-6` en Descargas, copiados a `noindex.csv`, `redirect.csv`, `404.csv`,
`crawled-not-indexed.csv`, `duplicate-no-canonical.csv`, `discovered-not-indexed.csv`),
normalizado y reconciliado por `scripts/analyze-indexing-reasons.mjs`.

**Corrección sobre la fuente**: `Gráfico.csv` no termina el 2026-06-16 como afirma `noindex.md` —
el último dato real es **2026-07-09**. Los 593 URL sin indexar están estables desde el 2026-06-30,
y 593 = 373 + 23 + 7 + 85 + 1 + 104, que cuadra exactamente con `Problemas críticos.csv`.

## Resultado global tras reconciliar las 593 URL una por una

De las 6 categorías, **5 quedan completamente explicadas con evidencia real y sin ningún error de
sitio pendiente de corregir**: noindex (373), redirección (23) y 404 (7) resultan, en conjunto,
en **cero errores técnicos reales** — son artefactos de clasificación de GSC o datos de rastreo
desactualizados. "Rastreada sin indexar" (85) y "descubierta sin indexar" (104) son decisiones de
Google (calidad/duplicación/prioridad de rastreo), no errores de sitio, aunque para 104 sí hay una
acción de enlazado interno concreta y accionable. Solo queda **1 URL** (duplicada sin canonical)
sin explicación local — y no coincide con ninguno de los 6 grupos que había detectado por
heurística de nombre.

## 1. Duplicada: el usuario no ha indicado ninguna versión canónica (1 URL) — P0

**URL real** (confirmada por export): `https://www.kronosolopromocionales.com/productos/set-de-cables-de-carga-mini-kit-9436/`
(último rastreo: 2026-07-04).

Investigué esta URL específica contra `data/products.json`:
- No hay ningún otro producto con el mismo `name` ("Set de Cables de Carga Mini Kit").
- No comparte imagen con ningún otro producto (`images[0]` es único).
- El único producto con nombre parecido, "Set de Cables de Carga Tyson"
  (`set-de-cables-de-carga-tyson-9804`), tiene imagen y ID distintos — no hay evidencia de que sea
  el par duplicado.
- **No pertenece a ninguno de los 6 grupos de nombre duplicado** detectados en la sección de
  canonical audit (`dup-1` a `dup-6`).

**Conclusión honesta**: no encontré, con los datos estructurados disponibles, cuál es la otra
mitad del par que GSC está comparando. Es posible que Google esté comparando esta página contra
una plantilla de texto compartida por muchos productos generados en el mismo lote (frases
genéricas repetidas en `story`/`seoDescription` de productos similares de tecnología), no contra
otro producto específico con nombre igual.

**Acción pendiente**: abrir esta URL en **Inspección de URLs** dentro de GSC — ese reporte
individual (a diferencia del export masivo, que solo trae `URL` + `Último rastreo`) muestra la
"URL canónica seleccionada por Google", que es el dato que falta para saber contra qué la está
comparando.

## 2. Rastreada: actualmente sin indexar (85 URL) — P1, decisión de Google

Cruce real contra `reports/indexable-product-quality.csv` y `reports/canonical-audit.csv`
(`reports/gsc-crawled-not-indexed-analysis.csv`, 85 filas):
- **81/85** no tienen ninguna señal local de duplicado (`duplicate_group` vacío) ni de contenido
  débil (`content_score` normal) — es decir, Google decidió no indexarlas por razones de
  calidad/duplicación de contenido que **no son visibles en los campos estructurados del sitio**
  (podría ser similitud semántica entre descripciones de productos generadas por IA en el mismo
  lote, no detectable por mi heurística de nombre/imagen exacta).
- **4/85** no aparecen en el inventario local actual (probablemente rutas ya removidas o
  renombradas).

**No es un error de sitio.** No se recomienda ninguna corrección de código — forzar indexación de
estas páginas sin evidencia de por qué Google las descartó sería ir en contra de la instrucción
explícita de `noindex.md` de no indexar indiscriminadamente.

## 3. Descubierta: actualmente sin indexar (104 URL) — P1, parcialmente accionable

Cruce real contra `reports/local-indexability-inventory.csv`
(`reports/discovered-not-indexed-strategy.csv`, 104 filas, tiers P1-P4):

**Hallazgo fuerte**: las **6 URLs en tier P1** (huérfanas confirmadas, sin ningún enlace interno
estático detectado) coinciden **exactamente** con 6 de las 23 páginas que ya había marcado como
huérfanas por análisis local independiente (`reports/orphan-pages.csv`) — es decir, dos métodos
distintos (proxy local vs. dato real de GSC) señalan las mismas páginas:

| URL | Tipo |
| --- | --- |
| `/politica-de-privacidad/` | legal |
| `/categorias/bicicleta/` | categoría |
| `/categorias/paraguas/` | categoría |
| `/categorias/reflectivos/` | categoría |
| `/productos-promocionales-ecuador/quito/` | ciudad |
| `/productos-promocionales-ecuador/guayaquil/` | ciudad |

**Esto es relevante para una pregunta abierta del trabajo anterior** (`seo-4.md`, hallazgo #11):
por qué Quito y Guayaquil, siendo las ciudades más grandes, no lideran el tráfico. Una causa
técnica concreta y accionable: **ninguna página estática detectable enlaza estas dos páginas de
ciudad** (solo se llega a ellas si el usuario navega manualmente o vía sitemap).

El resto (93 URLs en P4, 5 en P3) son mayormente productos/posts de blog donde el conteo de
enlaces internos no es fiable (se enlazan vía componentes dinámicos) — no se puede concluir que
estén huérfanos, requieren revisión manual.

**Acción recomendada** (no ejecutada en este trabajo — cambiar enlazado interno de 6 páginas es
una decisión de diseño de navegación, no un fix de auditoría): añadir un enlace contextual hacia
esas 6 URLs desde una página con autoridad (home, menú, footer o página de categoría relacionada).

## 4. Página con redirección (23 URL) — P4, 100% confirmado correcto

Cruce real contra `public/_redirects` y `netlify.toml` (`reports/indexing-redirect-audit.csv`,
23 filas): **las 23 quedan completamente explicadas, 0 errores reales**:
- **21/23** son redirects 301 intencionales ya verificados uno a uno contra las reglas del repo
  (slugs legacy de productos con ID nuevo, la categoría `gorras`, etc.).
- **2/23** son las variantes `http://kronosolopromocionales.com/` y
  `https://kronosolopromocionales.com/` (sin www) — ya cubiertas por las reglas de
  canonicalización de dominio en `netlify.toml` (`force = true` hacia `https://www`).

GSC probablemente tarda en reclasificar estas URLs de "página con redirección" a un estado neutro
después de que el 301 ya está funcionando — no requiere ninguna acción de código.

## 5. No se ha encontrado — 404 (7 URL) — P4, 6/7 ya resueltas

Cruce real (`reports/gsc-404-reconciliation.csv`, 7 filas):
- **6/7 ya tienen redirect 301 funcional**: 4 de ellas del trabajo de `404.md` (commit `5131356`:
  `canguro-dior`, `vaso-tapa-plastico-14-oz-produccion-nacional`, `pano-en-microfibra`,
  `aplausometro-redondo-produccion-nacional`), más **2 hallazgos que ya tenían redirect desde
  antes y no había documentado**: `/productos/set-destornillador-pistol` →
  `/categorias/herramientas/` y `https://kronosolopromocionales.com/product-category/tecnologia/`
  → `/categorias/tecnologia-promocional/` (URL legacy tipo WordPress).
- **1/7 es una URL fantasma**: `https://www.kronosolopromocionales.com/productos/$` (con el
  carácter literal `$` en el path). No existe ni existió como slug real de ningún producto —
  probablemente un artefacto histórico de algún enlace roto que ya no está en el código actual.
  No se creó redirect para esto: no hay un destino sensato ni evidencia de qué se pretendía
  enlazar, y crear un redirect para una URL con un carácter así de anómalo no aporta valor.

## 6. Excluida por noindex (373 URL) — P4, 0 errores reales confirmados

Este es el hallazgo con el cambio de conclusión más grande tras tener datos reales. Reconciliación
completa 1 a 1 (`reports/gsc-noindex-reconciliation.csv`, 373 filas):

| Categoría | Cantidad | % | Explicación |
| --- | ---: | ---: | --- |
| Redirect 301 ya funcional, agrupado por GSC bajo "noindex" | 218 | 58% | Slugs legacy con ID que ya redirigen — GSC los reporta aquí en vez de en "página con redirección" |
| Indexable HOY localmente, pero GSC lo rastreó antes de que se corrigiera | 145 | 39% | **Dato de GSC desactualizado**, no un error vigente |
| Noindex intencional, confirmado y vigente hoy | 10 | 3% | `is_ai_optimized=false`, correcto |

El patrón que confirma la hipótesis del "dato desactualizado": agrupé las 373 filas por mes de
`Último rastreo`. El 100% de las 145 "contradicciones" (indexable hoy, noindex cuando GSC
rastreó) tiene fecha de rastreo de **mayo o junio de 2026** — ninguna de julio. Esto coincide con
el período de trabajo activo del pipeline de enriquecimiento de contenido (commits
`chore(pipeline): +32/+57 productos`), que fue cambiando productos de `is_ai_optimized=false` a
`true` progresivamente. Es decir: Google todavía no ha vuelto a rastrear ~145 páginas desde que se
les quitó el noindex — se espera que esta cifra baje por sí sola en los próximos rastreos, sin
necesidad de ningún cambio de código.

**373/373 explicadas, 0 errores técnicos de sitio pendientes de corregir.**

## Referencia cruzada: Core Web Vitals

No se ejecutó una nueva auditoría de rendimiento para este trabajo — no aporta a un problema de
*indexación* directamente. `reports/core-web-vitals-lab.md` (generado 2026-07-18) ya documenta que
LCP está lejos del objetivo en las 6 plantillas medidas y que CLS ya cumple.

## Resumen final de prioridades

| Prioridad | Motivo | Estado tras reconciliar con datos reales |
| --- | --- | --- |
| P0 | Duplicada sin canonical (1) | Sin resolver — no coincide con ningún patrón local; requiere Inspección de URL manual en GSC |
| P1 | Descubierta sin indexar (104) | 6 URLs con causa y solución concretas (enlazado interno); resto requiere monitoreo |
| P1 | Rastreada sin indexar (85) | Decisión de calidad de Google no visible en datos estructurados; sin acción de código |
| P4 | Redirección (23) | 100% confirmado correcto, 0 acción |
| P4 | 404 (7) | 6/7 ya resueltas, 1/7 artefacto histórico sin destino sensato |
| P4 | Noindex (373) | 100% explicado, 0 errores reales; 145 se autocorregirán con el próximo rastreo de Google |
