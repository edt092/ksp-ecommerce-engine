# SEO — pendientes de la sesión (arrancada 2026-07-19, plan-seo.md)

Continuación de `docs/seo-master-plan-2026-07-19.md` y `reports/audit-findings-validation.csv`.
Este documento es solo el punto de partida para la próxima sesión — no repite el análisis ya
hecho, solo el estado y lo que falta.

## Fase 10 — contenido delgado: CERRADA (commit `51bd3a9`)

- `scripts/audit-product-content-quality.mjs` audita los 2.036 productos indexables y cruza
  con `reports/gsc-product-opportunities.csv` (export real de GSC, período 2025-03-16 a
  2026-07-15, ya existía en el repo de una sesión anterior). Distribución: A=1808, B=147,
  C=81, D/E=0 — la limpieza de duplicados de Fase 2 ya eliminó los peores casos.
- Cohorte piloto de 20 seleccionada con el criterio exacto del plan (impresiones>0, top-20,
  clasificación B/C) contra datos reales de GSC, no una aproximación.
- 13 de 20 productos mejorados reorganizando datos reales que ya existían en `story` pero no
  llegaban a `shortDescription`/`seoDescription` (medidas, materiales, funciones concretas).
- 7 de 20 (5 "Speaker Bluetooth" casi clonados entre sí + 2 más) son contenido de plantilla
  genuinamente delgado sin ficha técnica real disponible localmente — se deduplicó el texto
  idéntico (3 compartían el mismo párrafo palabra por palabra) sin fabricar diferenciadores.
  Un caso sí tenía dato real aprovechable ("Boompods" es una marca de audio real).
- Validado completo, en verde.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### 🔴 Pendiente de Fase 10

- Los 7 productos de plantilla delgada (`speaker-bluetooth-barack-8135`,
  `speaker-bluetooth-rocco-8637`, `speaker-bluetooth-clock-eco-10835`,
  `speaker-bluetooth-lights-eco-9798`, `summit-stylus-5747`,
  `set-de-herramientas-apache-10288`) necesitan ficha técnica real del proveedor (batería,
  alcance Bluetooth, cantidad/tipo de herramientas) para una mejora sustantiva — no se puede
  hacer más sin inventar datos.
- Quedan 12 candidatos más de la lista de 32 (impresiones>0, top-20, clasificación B/C) sin
  tocar — ver `reports/product-content-quality.csv` para la lista completa y decidir si se
  amplía la cohorte en una sesión futura.

## Fase 5 — lastmod del sitemap: CERRADA (commit `849663a`)

- `scripts/audit-sitemap-lastmod.mjs` audita las 2.132 URLs. Hallazgo: `BUILD_DATE` se aplicaba
  al 100% de los 2.036 productos indexables (no "algunos" como sugería el código) porque
  `updatedAt`/`createdAt` no existen en `products.json` — el campo real es `last_ai_update`
  (87.8% de cobertura), que `sitemap.ts` nunca leía.
- `src/app/sitemap.ts`: productos usan `last_ai_update` real cuando existe (si no, se omite
  lastmod, no `BUILD_DATE`); blog sin cambio de lógica (ya 100% real); categorías/paginación
  de categorías/ciudades → lastmod omitido por completo (no hay fecha real por ítem, y usar
  la fecha de git del archivo de datos compartido daría la misma fecha a las 37
  categorías/5 ciudades — el mismo problema con otro valor); páginas estáticas → fecha real
  de git log por archivo en vez de `BUILD_DATE` compartido.
- Resultado: 1.842 de 2.198 URLs (83.8%) con lastmod real y verificable; 356 sin lastmod en
  vez de fecha inventada. Validado completo, en verde.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

## Fase 12 — interlinking blog↔categorías: implementado (commit `dc66fa8`)

Ver `docs/content-cluster-priority-map.md` para el detalle completo. Resumen:

- `scripts/audit-content-clusters.mjs` (nuevo): 6 posts sin ningún enlace comercial → 0. Mapa
  de los 7 clústeres prioritarios del plan (5 cubiertos, "mugs y termos" sin ningún post de
  apoyo, "kits de bienvenida" sin categoría/landing ni posts — clúster sin construir).
- **Hallazgo no planeado**: 5 posts de `data/blog/content/fase3.js` estaban truncados a mitad
  de frase/HTML (bug de `max_tokens=6000` en `scripts/generate-blog-fase3.js`, corregido a
  16000). Se intentó regenerar vía API con autorización del usuario — **saldo de API limitado,
  se detuvo tras 2 intentos** (1 completado bien, 1 aún truncado incluso con más tokens).
  🔴 **Error propio durante la sesión**: un comando de bash con backticks sin escapar corrompió
  `fase3.js` por completo a mitad del proceso — se recuperó con `git checkout`, pero el
  contenido ya generado por la API para "mejores-regalos-corporativos" se perdió (el gasto de
  API ya se había hecho, no se pudo recuperar el texto). Lección para futuras sesiones: nunca
  pasar HTML/JS con backticks embebidos a través de un string de bash `-e`; usar siempre un
  archivo `.js` real ejecutado con `node archivo.js`.
- Sin más presupuesto de API, los 5 posts quedaron con las etiquetas HTML rotas cerradas
  limpiamente + un párrafo de cierre corto y un enlace comercial real (sin inventar el
  contenido que falta). Quedan **más cortos de lo previsto originalmente** — pendiente
  regenerarlos completos cuando haya saldo de API disponible (el fix de `max_tokens` ya está
  hecho, solo falta ejecutar `node scripts/generate-blog-fase3.js --only <slug>` por cada uno).
- Falta la otra mitad del enlazado bidireccional: **ninguna** categoría/landing enlaza de
  vuelta a un post de blog. Sugerencia ya documentada en
  `docs/content-cluster-priority-map.md`: sección "Artículos relacionados" en
  `src/app/categorias/[slug]/page.tsx`.
- 4 posts (no 3, como decía el audit original) con intención muy solapada detectados
  ("Guía Completa: Productos Promocionales X" — beneficios/por mayor/baratos/general, enero
  2025) — **no tocados**, requieren datos reales de GSC antes de decidir
  mantener/reenfocar/consolidar.
- Validado: `validate-unique-slugs`, `seo:links`, `seo:redirects`, `seo:indexability`,
  `pnpm build`, `seo:test` en 0.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

## Fase 11 — metadata a escala: auditoría + muestra corregida (commit `e1fdb8c`)

- `scripts/audit-metadata-quality.mjs` (nuevo, reutilizable): audita title/description de los
  2.036 productos indexables + 37 categorías + 40 posts de blog. Genera
  `reports/metadata-duplication-audit.csv` (productos) y
  `reports/metadata-duplication-audit-categories-blog.csv`.
- **Corregidos 17 de 19 productos** con `seoTitle` exactamente duplicado entre sí (7 títulos
  distintos repetidos). No eran duplicados de producto (imágenes distintas en todos los
  casos) — un bug de pipeline les puso un título genérico de categoría. El peor caso: 9
  productos compartían "Pelota Antiestrés Personalizada | Ecuador", incluyendo un **soporte
  para celular** y un **frisbee** que ni siquiera son pelotas antiestrés. Cada título nuevo
  usa solo datos reales del producto (nombre, medidas cuando existen). Duplicados exactos de
  title: 19 → 2. Descriptions: 0 duplicados exactos en todo el catálogo (ya cumplía el
  principio del plan de no repetir fórmula sin dato real).
- Validado: `validate-unique-slugs`, `seo:links`, `seo:redirects`, `seo:indexability`,
  `pnpm build`, `seo:test` en 0.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### 🔴 Hallazgos de Fase 11 pendientes de decisión (no tocados esta sesión)

- **Par de mugs sin diferenciador real**: `mug-metalico-star-350ml-8986` (categoría Mugs y
  Termos) y `mug-metalico-star-350ml-13197` (categoría Novedades) — mismo nombre exacto,
  misma capacidad (350ml), mismo material descrito, pero imágenes distintas (8986.jpg vs
  13197.jpg) así que NO calificaron para el protocolo de duplicados de Fase 2. Quedaron con
  su `seoTitle` original (duplicado) en vez de forzar un título con un diferenciador
  inventado. Recomendación: revisar visualmente si son el mismo producto fotografiado dos
  veces (posible duplicado no detectado) o de verdad dos productos distintos sin dato que los
  diferencie.
- **4 "productos" que en realidad son portadas de catálogo**: `relojes-catalogo-novelties`,
  `relojes-catalogo-novelties-2026`, `relojes-catalogo-mundial-2026`,
  `relojes-catalogo-produccion-nacional` — todos categoría `relojes`, todos con
  `is_ai_optimized=true` (indexados como si fueran productos cotizables) pero sus imágenes
  son literalmente portadas de catálogo (`PORTADA-*.jpg`, `PRODUCCION_NACIONAL.jpg`), no
  fotos de un reloj específico. `relojes-catalogo-produccion-nacional` es el peor caso: su
  `name` es "Catálogo Producción Nacional" pero su `seoTitle` habla de "Relojes Promocionales
  Personalizados" en general — compite en la misma keyword que relojes reales sin ofrecer un
  producto cotizable. Pendiente decidir: ¿noindex (no son productos reales) o mantener como
  landing de catálogo con contenido honesto sobre qué es?
- **Longitud de title/description en riesgo de truncamiento**: ~38 productos, 8 categorías y
  32 de 40 posts de blog superan 65/165 caracteres. Volumen grande — no se tocó esta sesión
  (el plan pide explícitamente no regenerar metadata a escala sin revisión de muestra;
  arreglar 32 posts de blog uno por uno es trabajo para una sesión dedicada). Ver las columnas
  `title_status`/`description_status` en ambos CSV para la lista completa.

## Fase 6/7 — piloto de página de ciudad (Quito): implementado (commit `a2eed60`)

- `reports/schema-entity-audit.csv` generado (14 URLs muestra, 53 bloques JSON-LD). Confirma
  que las 5 páginas de ciudad emitían cada una su propio `LocalBusiness` sin `@id` compartido
  (5 "negocios" ante Google en vez de la entidad real única en `layout.tsx#localbusiness`).
  También encontró y arregló un caso igual en el `OnlineStore` de la home
  (`src/app/page.tsx`) — le faltaba `@id`, ahora comparte el de `#localbusiness`.
- Piloto solo en Quito (`src/lib/city-pilot.ts`, `CITY_PILOT_SLUGS`): schema pasa de
  `LocalBusiness` independiente a `Service` (`provider` → `#localbusiness`) +
  `BreadcrumbList` + `FAQPage`, más una sección de FAQ visible (misma fuente que el schema,
  verificado que coinciden literalmente). Guayaquil/Cuenca/Manta/Ambato **sin tocar** —
  verificado en `out/` que mantienen exactamente su schema y contenido anteriores.
- De paso: cifra desactualizada "1,200 productos" en `data/geo-data.js` (se había escapado
  del fix de Fase 4 de la sesión anterior porque vive en un string de datos, no en JSX) →
  corregida a "2.100". Enlaces a ciudades sin trailing slash corregidos en 2 archivos.
- Medida similitud Jaccard de contenido entre las 5 ciudades: 20.5%–47.5%, mayoría 22–30% —
  ya razonablemente diferenciado, no fue necesaria reescritura de contenido para el piloto.
- Validado: `validate-unique-slugs`, `seo:links`, `seo:redirects`, `seo:indexability`,
  `pnpm build`, `seo:test` en 0. Revisión visual en navegador confirmada.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### Extendido a Guayaquil (commit `7775596`)

Aprobado por el usuario en la misma sesión: Guayaquil es la única de las 4 ciudades
restantes sin advertencia de rendimiento GSC histórico en el plan, así que recibió el mismo
fix (Service + BreadcrumbList + FAQ). Verificado igual que Quito (FAQ visible = schema,
canonical correcto, resto del sitio sin cambios). Todas las validaciones en 0.

### 🔴 Pendiente antes de extender a Cuenca/Manta/Ambato (requiere revisión de GSC real)

- El plan advierte que **Cuenca, Ambato y Manta ya mostraron rendimiento positivo en GSC
  histórico** — se prefiere revisar esos datos reales de Search Console antes de tocar esas
  3 páginas, aunque el cambio de schema en sí es de bajo riesgo (no modifica contenido
  visible, solo unifica la entidad).
- `reports/schema-entity-audit.csv` deja las 3 filas de Cuenca/Manta/Ambato marcadas
  `duplicate_entity=true`, acción `PENDIENTE`, listas para cuando se revisen esos datos.
- La dirección `streetAddress: "Norte de Quito"` en el `LocalBusiness` global (`layout.tsx`)
  sigue sin verificar — el propio `plan-seo.md` la cita textualmente como ejemplo de qué NO
  usar (Fase 17). Fuera de alcance de Fase 6/7, pero vale la pena resolverlo en una sesión
  futura pidiendo al negocio una dirección real o el área de servicio apropiada.

## Sesión 2026-07-20 — resumen

- Confirmado en producción (vía curl) que el fix de imágenes del commit `bf80bee` funciona:
  `https://www.kronosolopromocionales.com/.netlify/images?url=...cataprom.com/...` devuelve
  200 y sirve WebP correctamente. Sin acción pendiente sobre esto.
- Fase 2 completada para los 59 pares `LIKELY_DUPLICATE`: revisados campo por campo y
  consolidados en 3 sub-lotes de ≤20 (tope explícito de `plan-seo.md`, confirmado con el
  usuario antes de implementar porque técnicamente son `LIKELY_DUPLICATE`, no
  `EXACT_DUPLICATE`, y la regla de redirect automático del plan solo cubre esta última).
  Commits: `76f098b` (Batch 3, 20 pares), `aa0e4b0` (Batch 4, 20 pares), `05f0ec8` (Batch 5,
  19 pares). Ver detalle en `reports/batch3/4/5-duplicate-redirects.csv`.
  - 1 fusión de dato aditivo real (SKU 5693, estructura en fibra de vidrio).
  - 3 pares (`6530`, `7557`, `9587`) venían de un lote de baja calidad `accesorios-auto` con
    reclamos de disponibilidad no verificados ("entrega inmediata", "producto en camino") y
    un caso con referencia a "motociclista mexicano" en un sitio exclusivo de Ecuador — se
    redirigieron descartando todo el contenido de esa fuente, sin fusionar nada (decisión
    aprobada por el usuario).
  - De paso se corrigió una cadena de redirect preexistente
    (`medidor-de-presion-para-neumaticos-nuevo` apuntaba a un slug que este batch consolidó)
    y un enlace interno roto/mal apuntado en `data/blog/content/index.js` (dos anchors
    distintos apuntaban a la misma URL de producto equivocada).
  - Productos: 2169 → 2110 tras los 3 batches. Todas las validaciones (`validate-unique-slugs`,
    `seo:redirects`, `seo:links`, `seo:indexability`, `pnpm build`, `seo:test`) en 0 tras cada
    batch.
- Batch 3/4/5 (`76f098b`, `aa0e4b0`, `05f0ec8`) se pushearon a `origin/main` durante esta sesión.
- Batch 6 (`35ef8c4`) consolida los 18 pares restantes (`LEGITIMATE_VARIANT` +
  `INSUFFICIENT_DATA`) — 10 redirects implementados, 7 variantes reales confirmadas y dejadas
  intactas, 1 caso nuevo bloqueado (SKU 9707). **Esto cierra por completo la Fase 2**: de los
  95 grupos candidatos originales, 75 quedaron consolidados en 6 batches, 8 confirmados como
  variantes legítimas (no se tocan), y 3 siguen BLOCKED pendientes de revisión humana/visual
  (3742, 10282, 9707 — ver `reports/batch2-duplicate-redirects.csv` y
  `reports/batch6-duplicate-redirects.csv` para el detalle de cada bloqueo).

## Fase 2 — Duplicados de producto: CERRADA

- ✅ 16 pares `EXACT_DUPLICATE` (Batch 1 + 2, sesión anterior)
- ✅ 59 pares `LIKELY_DUPLICATE` (Batch 3 + 4 + 5, esta sesión)
- ✅ 10 pares adicionales consolidados desde `LEGITIMATE_VARIANT`/`INSUFFICIENT_DATA` (Batch 6,
  esta sesión) — casos que el script de auditoría automática subestimó (similitud de nombre
  baja por branding distinto, o contaminación del lote `accesorios-auto`)
- ✅ 7 `LEGITIMATE_VARIANT` confirmados como variantes reales (capacidad ml distinta en
  botilitos; dos catálogos de relojes distintos) — revisados y dejados intactos, correctamente
  clasificados desde el inicio
- ⛔ **3742** (`botilito-pvc-mercury-850ml`) — BLOCKED: técnica de personalización en conflicto
  (láser vs. full color). Requiere decisión humana: ¿son variantes de producción reales o error
  de catálogo?
- ⛔ **10282** (`soporte-para-moviles-strike`) — BLOCKED_REQUIRES_VISUAL_VERIFICATION: la
  afirmación "plegable" en el canónico no está confirmada contra la imagen ni ficha técnica.
- ⛔ **9707** (`mug-metalico-warmer-450ml` vs `termo-viajero-calientito-tu-companero-ideal`) —
  BLOCKED_REQUIRES_VISUAL_VERIFICATION: misma imagen pero descripciones materialmente distintas
  (mug metálico abierto vs. termo de doble pared con retención de calor 8h).
- Catálogo tras Fase 2 completa: 2185 → 2100 productos (85 consolidados).
- Ver `reports/product-duplicate-candidates.csv` y `reports/batch{1,2,3,4,5,6}-duplicate-redirects.csv`.

## Fase 9 — Paginación de categorías: PILOTO implementado (commit `192a345`)

- Confirmado en `out/`: `boligrafos-publicitarios` (171 productos tras Fase 2, antes 174) solo
  exponía 12 `<a href>` reales; el resto vivía en `CategoryProductsGrid` (scroll infinito
  client-side).
- Implementada Opción A del plan (paginación estática) **solo para esta categoría**:
  - `src/lib/category-pagination.ts` — whitelist `PAGINATED_CATEGORY_SLUGS` (hoy solo
    `boligrafos-publicitarios`) + `CATEGORY_PAGE_SIZE=24`.
  - `src/components/StaticProductsGrid.tsx` + `src/components/CategoryPagination.tsx` — grid
    servidor sin scroll infinito + nav Anterior/Siguiente con enlaces reales.
  - `src/app/categorias/[slug]/page.tsx` — rama condicional solo para slugs en la whitelist;
    las otras 36 categorías siguen exactamente igual (verificado: `precio-bomba` sigue con 12
    enlaces, sin nav de paginación).
  - `src/app/categorias/[slug]/pagina/[page]/page.tsx` — ruta nueva, páginas 2..8 generadas
    solo para el piloto.
  - `src/app/sitemap.ts` — incluye las 7 páginas adicionales del piloto.
- Verificado: 24 enlaces × 7 páginas + 3 en la última = 171 (exacto, sin duplicados),
  canonicals autorreferenciales por página, títulos distintos, JSON-LD parseable, revisión
  visual en navegador (desktop) con clic real en "Siguiente" confirmando la navegación.
  Todas las validaciones (`validate-unique-slugs`, `seo:links`, `seo:indexability`,
  `seo:redirects`, `pnpm build`, `seo:test`) en 0.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### Extendida a las 26 categorías con más de 24 productos (commit `9e4882c`)

Aprobado por el usuario en la misma sesión. Se generó primero
`reports/category-product-link-coverage.csv` (las 37 categorías, enlaces reales vs. total)
para decidir el umbral: 26 categorías tienen >24 productos y hoy exponían solo 12 enlaces
reales; las 11 restantes ya exponen el 100% sin paginación. Solo se tocó
`PAGINATED_CATEGORY_SLUGS` en `src/lib/category-pagination.ts` — el resto de la
infraestructura ya era genérica. 66 páginas nuevas, 92 páginas totales entre las 26
categorías. Verificado programáticamente (cobertura exacta, sin duplicados, canonicals
correctos) para las 26, más revisión visual del caso límite (relojes, última página con 2
productos). Todas las validaciones en 0.

**Commits `192a345`, `e691af7`, `9e4882c` locales, no pusheados aún al cierre de esta
sesión** — pendiente decisión del usuario.

### 🔴 Pendiente de una sesión futura

- Medir engagement/CTR real de la paginación en producción tras el despliegue.
- No se hizo revisión visual en viewport móvil real en esta sesión (la herramienta de
  `resize_window` del navegador no reflejó el cambio de viewport en las capturas) — el
  componente reutiliza las mismas clases Tailwind responsive que el resto del sitio
  (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`), pero vale la pena una verificación visual
  explícita en móvil real.
- La categoría `novedades` (269 productos, la más grande) es probablemente un bucket
  temporal/de aterrizaje para productos aún sin categorización definitiva final (muchos IDs
  con prefijo `novedades-*` aparecieron durante la revisión de duplicados de Fase 2 de esta
  sesión) — vale la pena confirmar con el negocio si esa categoría debería existir como
  landing pública paginada a largo plazo o si sus productos deberían recategorizarse.
- `reports/category-product-link-coverage.csv` quedó con el conteo de enlaces reales
  pre-cálculo (asume 12 para todo lo no paginado, que es el comportamiento real de
  `CategoryProductsGrid`) — si se cambia el `PER_PAGE` del scroll infinito, regenerar.

## Hallazgos confirmados de la Fase 0 — sin implementar todavía

| Hallazgo | Fase del plan | Estado |
|---|---|---|
| Páginas de ciudad con `LocalBusiness` sin evidencia de sucursal física | Fase 6/7 | Sin empezar — requiere piloto en 1 ciudad + aprobación antes de extender a las 5 |
| Categoría `boligrafos-publicitarios`: 174 productos, solo 12 enlaces `<a>` reales | Fase 9 | Sin empezar — requiere diseño de paginación + piloto |
| Íconos de categoría pesados (hasta 2.61MB) | Fase 15 | Sin empezar — **distinto** del bug de dominio roto ya arreglado; esto es optimización/compresión, no disponibilidad |
| `lastmod` del sitemap | Fase 5 | Parcialmente mitigado en código (`p.updatedAt \|\| p.createdAt \|\| BUILD_DATE`); falta auditar qué % de productos tiene fecha real |
| Product schema sin `offers`/`review`/`aggregateRating` | Fase 7 | Sin empezar — requiere decisión de negocio (mostrar precio "desde $X", recolectar reseñas reales) |
| Dirección pública vs. "solo con cita" | Fase 17 | Sin empezar — requiere confirmación del negocio sobre dirección real |

## Fases del plan no iniciadas

Fase 8 (reseñas/testimonios reales), Fase 10 (contenido delgado — cohorte piloto de 20
productos), Fase 11 (metadata a escala), Fase 12 (interlinking blog↔categorías), Fase 14
(mobile/UX — bugs específicos: H1 pegado "Promocionalesque", CTA bajo banner de cookies), Fase
16 (FAQ cerca del CTA), Fase 19 (CSP — backlog de seguridad separado, no mezclar con SEO), Fase
20 (IndexNow, backlog), Fase 21 (backlinks/YouTube, backlog).

**Ya resueltos como falso positivo / no requieren acción:**
Fase 3 (producto 10589 — el contenido siempre fue correcto), Fase 18 (Machala — el footer ya
enlaza a la landing nacional, no a un 404), Fase 13 (enlace externo del footer — ya eliminado).

## Sesión 2026-07-21

### Fase 14 — H1 mobile: CERRADA (commit `6e505ad`, pusheado pendiente de confirmación)

- El fix ya estaba escrito de la sesión anterior (`{' '}` de respaldo en los dos `<br
  className="hidden sm:block" />` del H1 del home) pero bloqueado por un lock de archivo en
  `out/`. El lock ya no estaba presente esta sesión — `pnpm build` corrió limpio, validado con
  `seo:test` en 0, y commiteado por separado (no mezclado con Fase 8) siguiendo la regla de un
  concern por commit.

### Fase 8 — Reseñas, testimonios y logos: parte automatizable CERRADA (sin commit-hash aún, ver nota abajo)

Alcance acordado con el usuario: hacer todo lo pendiente de Fase 8 **excepto** crear un Google
Business Profile (explícitamente fuera de alcance, decisión del usuario).

- **Auditoría de la afirmación "+1.000 empresas confían en KS"**: sin evidencia interna
  (`src/lib/business-facts.ts` no la respalda) ni pública. Por indicación directa del plan
  ("no repetir la afirmación", "no sustituir por otra cifra inventada"), se removió la tarjeta
  del trust strip de `src/app/HomePageClient.tsx` (usuario eligió "quitar la tarjeta" entre 3
  opciones ofrecidas). El grid pasó de 4 a 3 columnas (`grid-cols-1 sm:grid-cols-3`).
  De paso se eliminó un array `stats` muerto (nunca leído en ningún render) que repetía la
  misma cifra "+1,000" sin usarse — ts ya lo marcaba como "declared but never read".
- **Infraestructura opcional creada** (inerte hasta que existan datos reales):
  - `src/lib/testimonials.ts` — interfaz `Testimonial` con los campos exactos del plan
    (`clientName`, `company`, `role`, `quote`, `rating`, `date`, `permission`,
    `relatedProducts`, `logo`, `source`) + `getPublishableTestimonials()` que filtra por
    `permission===true`.
  - `src/components/TestimonialsSection.tsx` — recibe `testimonials: Testimonial[]` por props,
    devuelve `null` si no hay ninguno publicable. No está importado en ninguna página todavía
    (no hay datos reales que pasarle).
  - `docs/review-collection-workflow.md` — proceso humano completo: solicitud por WhatsApp
    post-entrega, consentimiento explícito (texto/nombre/logo por separado), moderación,
    publicación, retiro, respuesta a críticas, prohibición de incentivos condicionados y de
    comprar reseñas.
- **`data/testimonials.json` deliberadamente NO se creó** — el plan prohíbe publicarlo vacío o
  con contenido inventado, y no hay ningún testimonio real recolectado todavía. Se documentó en
  el propio `testimonials.ts` y en el workflow que ese archivo se crea recién cuando el negocio
  autorice el primer testimonio real.
- Validado: `pnpm build`, `validate-unique-slugs`, `seo:links`, `seo:test` en 0. Revisión visual
  en navegador (localhost:5099 sobre `out/`) confirmando el trust strip en 3 columnas sin la
  tarjeta retirada.
- Pendiente real: la recolección de testimonios en sí es 100% acción humana del negocio (no
  automatizable, tal como dice el propio plan) — no hay nada más que este repo pueda hacer para
  cerrar Fase 8 por completo.
- **GBP (Google Business Profile) sigue explícitamente fuera de alcance** — no crear, no
  investigar setup, no tocar salvo pedido directo del usuario.

## Siguiente paso sugerido

Continuar con los 59 LIKELY_DUPLICATE aplicando el mismo protocolo de Batch 2 (confirmar mismo
producto físico campo por campo antes de fusionar/redirigir, bloquear ante cualquier conflicto
material). Dado el volumen, probablemente convenga dividirlo en sub-lotes de ≤20 como ya se
viene haciendo.
