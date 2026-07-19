# Auditoría SEO — GSC KS Promocionales

Periodo analizado: 2025-03-16 a 2026-07-15 (16 meses, export de Google Search Console).
Datos completos en `reports/gsc-summary.md` y los CSV asociados, generados por `scripts/analyze-gsc.mjs`.
Los totales de este documento pueden diferir ligeramente de los reportados por pestaña en la UI de GSC
por agregación y anonimización de consultas — no se han "cuadrado" artificialmente.

## 1. Estado de partida

- 95 clics / 3.224 impresiones en los 16 meses exportados (`Páginas.csv`).
- Últimos 28 días disponibles: 26 clics, 853 impresiones, CTR 3,72%.
- Tendencia mensual claramente ascendente desde 2025-12 (ver tabla en `reports/gsc-summary.md`), con salto marcado en 2026-05 y 2026-06.
- Objetivo del negocio: ~100 clics / 28 días. No se garantiza — este documento y el roadmap solo describen las condiciones para intentarlo.

## 2. Hallazgos técnicos confirmados y corregidos

### 2.1 Sitemap duplicado (P0 — corregido)

`next-sitemap` (postbuild) estaba **sobrescribiendo** el sitemap generado por `src/app/sitemap.ts`. Evidencia: el `out/sitemap.xml` que existía en el repo antes de este trabajo tenía `lastmod` con timestamp de hora de build (`2026-07-13T02:54:29Z`) en URLs sin fecha real — exactamente el patrón de "lastmod que miente" que penaliza la confianza del rastreador.

**Corrección aplicada:** se eliminó `next-sitemap` (script `postbuild`, `next-sitemap.config.js`, dependencia en `package.json`/`pnpm-lock.yaml`). `src/app/sitemap.ts` queda como única fuente de verdad: usa `BUILD_DATE` fijo para rutas estáticas/categoría y fechas reales (`dateModified`/`date`) para posts de blog y productos.

### 2.2 Fragmentación de dominio (P0 — mitigado en repo, falta verificación externa)

GSC reporta clics repartidos entre `https://www...` (86), `https://` sin www (7) y `http://` sin www (2). El repo no tenía ninguna regla de redirect a nivel de dominio en `netlify.toml` — solo redirects puntuales de posts de blog.

**Corrección aplicada:** se añadieron 3 reglas `[[redirects]]` en `netlify.toml` (antes de cualquier otra regla, para tener prioridad) que fuerzan `http://` y `https://` sin `www` hacia `https://www.kronosolopromocionales.com/:splat` con 301, preservando path y query string.

**Pendiente de verificación manual (fuera del repo):** confirmar en Netlify → Domain management que `www.kronosolopromocionales.com` es el dominio primario, y que no hay una regla de dashboard contradictoria. No se pudo verificar con solicitudes HTTP reales desde este entorno (sin acceso de red saliente).

También se detectaron 2 impresiones residuales en rutas `/product-tag/*` (WordPress heredado) en el dominio sin `www` — bajo volumen, quedan documentadas en `reports/gsc-summary.md` sección "Fragmentación de dominio" para una limpieza futura de baja prioridad.

### 2.3 Blog duplicado (P0 — corregido)

`data/blog/posts.json` tenía el registro de metadata de `boligrafos-promocionales-personalizados-guia-empresas-ecuador` duplicado byte a byte (2 entradas idénticas). El contenido del artículo vive en `src/data/blog/content/*`, indexado por slug como objeto (no array), por lo que no había riesgo de contenido duplicado — solo el registro de metadata en `posts.json`.

**Corrección aplicada:** se eliminó la entrada duplicada, conservando una. Se añadió `scripts/validate-unique-slugs.js`, enganchado al `prebuild`, que falla el build si vuelve a haber slugs duplicados en `products.json`, `categories.json` o `blog/posts.json`.

### 2.4 Productos indexados que devuelven 404 (P0 — corregido)

Cruzando `reports/gsc-product-opportunities.csv` contra `data/products.json`, **5 de los 7 productos "top 10 con cero clics"** listados en el brief ya no existen con su slug indexado por Google — los slugs actuales llevan un sufijo numérico:

| Slug indexado por Google (404 hoy) | Impresiones | Posición | Slug actual |
| --- | ---: | ---: | --- |
| `/productos/portacomida-produccion-nacional` | 36 | 5.42 | `portacomida-produccion-nacional-4857` |
| `/productos/canguro-dior` | 31 | 8.55 | `canguro-dior-9823` |
| `/productos/bola-para-mascotas` | 28 | 4.32 | `bola-para-mascotas-10979` |
| `/productos/copa-para-vino-7oz-produccion-nacional` | 24 | 7.08 | `copa-para-vino-7oz-produccion-nacional-2007` |
| `/productos/speaker-bluetooth-con-lampara-oferta` | 16 | 6.25 | `speaker-bluetooth-con-lampara-oferta-9579` |

135 impresiones acumuladas se perdían en 404s reales, no solo en CTR bajo. Los otros 2 productos del hallazgo #12 (`aplausometro-redondo-produccion-nacional-5685`, `resaltador-magico-en-cera-4672`) **ya coinciden** con su slug actual y ya tenían redirect vigente en `public/_redirects` desde la limpieza anterior — no requerían cambio.

**Corrección aplicada:** se añadieron los 5 pares de 301 (con y sin trailing slash) a `public/_redirects`, verificando previamente que cada slug destino existe y tiene `is_ai_optimized: true` (por lo tanto está en el sitemap).

El script `scripts/analyze-gsc.mjs` generaliza esta detección a **todas** las URLs `/productos/` del export de GSC, no solo las 7 del brief — ver `reports/gsc-product-opportunities.csv`, columna `notes`, para cualquier otra alerta similar.

### 2.5 Enlaces internos rotos (P0 — corregido)

`scripts/find-broken-internal-links.mjs` escaneó 49 archivos (`src/` + `data/blog/content/`) en busca de `href="/productos/..."` y `href="/categorias/..."` hardcodeados. Se encontraron y corrigieron 4 problemas reales (12 ocurrencias):

- `/productos/speaker-bluetooth-bass-swisspeak-8933` (typo, falta guion) → `/productos/speaker-bluetooth-bass-swiss-peak-8933/` (en `data/blog/content/additions.js`, 2 ocurrencias).
- `/categorias/anti-estres/` (slug incorrecto, sin redirect existente — era un 404 real) → `/categorias/antiestres/` (en `additions.js`).
- `/categorias/oficina` (slug antiguo) → `/categorias/articulos-de-oficina-personalizados` (en `data/blog/content/index.js`, 6 ocurrencias).
- `/categorias/confeccion` (slug antiguo) → `/categorias/camisetas-y-confeccion-corporativa` (en `index.js`, 3 ocurrencias).

Reporte final (vacío tras la corrección, resultado válido): `reports/broken-internal-links.csv`.

### 2.6 URLs de Colombia (ya resuelto en commit previo `b8a7ca8`)

`/productos-promocionales-colombia/cali/` (20 impresiones, posición 19.6 en GSC) y sus variantes de Bogotá/Medellín/Barranquilla/Cartagena, más los 6 productos con "colombia" en el slug, ya tenían 301 verificados en `public/_redirects` antes de esta sesión. No se requirió ningún cambio nuevo — se documenta el estado en `reports/gsc-legacy-urls.csv` (cruce automático entre GSC y `public/_redirects`).

## 3. Hallazgos de contenido y enlazado interno

### 3.1 Home

La home concentra ~37% de los clics históricos (35 de 95) con 952 impresiones y posición 19.11. El **cuerpo** de la página (`src/app/HomePageClient.tsx`) enlazaba `/regalos-corporativos/` (4 veces) y categorías destacadas dinámicamente, pero no enlazaba en el contenido principal `/articulos-promocionales/`, `/productos-promocionales-ecuador/` ni `/merchandising-corporativo/` — esas 3 URLs solo estaban en el `Footer.tsx` compartido por todo el sitio (enlace de bajo peso relativo por ser boilerplate repetido en cada página, no señal específica de la home). Se añadió un enlace contextual en el cuerpo de la home hacia esas 3 URLs.

**Bug de enlazado geográfico encontrado en `Footer.tsx` (aplica a todo el sitio, no solo home):** `geoLinks` enlazaba "Cuenca" y "Ambato" hacia la landing genérica `/productos-promocionales-ecuador` en lugar de sus páginas dedicadas (`/productos-promocionales-ecuador/cuenca`, `/productos-promocionales-ecuador/ambato`), pese a que ambas páginas existen y ya reciben clics reales en GSC (4 y 2 respectivamente, con buen CTR). Manta (1 clic, 21 impresiones) ni siquiera estaba en la lista. Esto es exactamente lo que pide el hallazgo #11 del brief ("Enlazarlas desde la landing nacional") — se corrigió apuntando cada ciudad a su página real y añadiendo Manta, sin tocar el contenido de las páginas de Cuenca/Ambato (CTR ya positivo, no se arriesga).

### 3.2 Clúster bolígrafos

La categoría `/categorias/boligrafos-publicitarios/` y el artículo de blog homónimo compartían H1/título muy similares ("Bolígrafos Promocionales Personalizados para Empresas" en ambos), diluyendo la diferenciación de intención transaccional vs. informacional que pide el hallazgo #9.

### 3.3 Ciudades

Las 5 ciudades del brief (Quito, Guayaquil, Cuenca, Manta, Ambato) **ya existen** como páginas en `data/geo-data.js` — el hallazgo #11 no es de páginas faltantes sino de por qué Quito/Guayaquil no lideran en clics pese a ser los mercados más grandes; ver roadmap para hipótesis (probable competencia de intención con la home y con `/productos-promocionales-ecuador/` genérica).

### 3.4 Datos estructurados

JSON-LD (Product, BreadcrumbList, ItemList, etc.) ya está implementado en 16 plantillas (`src/app/productos/[slug]`, `categorias/[slug]`, `blog/[slug]`, landings, home, etc.). No se encontraron datos inventados (precios/ratings/reviews) en la revisión de las plantillas tocadas en esta sesión.

## 4. Clasificación de oportunidades

Generada automáticamente por `scripts/analyze-gsc.mjs` con el criterio de posición del brief (A: 1–10, B: 11–20, C: 21–50, D: >50, E: no canónica/legacy):

- Páginas (`reports/gsc-page-opportunities.csv`): 329 en bucket A, 67 en B, 19 en C, 9 en D, 27 en E (no canónicas/redirigidas).
- Consultas (`reports/gsc-query-opportunities.csv`): 38 en A, 9 en B, 29 en C, 24 en D.

El bucket A es grande porque casi todas las páginas del export tienen pocas impresiones y por tanto una posición registrada favorable pero inestable (muestra pequeña) — no tratar el tamaño del bucket como 329 "quick wins" reales; cruzar siempre con impresiones absolutas antes de priorizar (ver `docs/seo-roadmap-100-clicks.md`).

## 5. Validación técnica de reproducibilidad (sesión seo-5, 2026-07-18)

Se auditaron y endurecieron los 5 scripts de la sesión anterior. Hallazgos nuevos, todos corregidos salvo donde se indica:

- **`scripts/analyze-gsc.mjs`**: no distinguía "carpeta de CSV inexistente" (fallo de configuración) de un fallo de código; no fallaba con código de salida ≠0 en ningún escenario; el resumen no explicaba por qué Páginas.csv (3.224 impresiones) y Gráfico.csv (2.555 impresiones) difieren pese a que los clics sí reconcilian (95 en ambos). Corregido: validación temprana de ruta, manejo global de excepciones, sección explícita "Totales — dos vistas, NO intercambiables", y periodo exacto (2025-03-16 a 2026-07-15) + últimos 28 días disponibles (2026-06-18 a 2026-07-15: 26 clics, 853 impresiones) calculados dinámicamente, no hardcodeados.
- **`scripts/build-redirect-map.mjs`**: la columna `verified` era un bug — el ternario devolvía `'true'` en ambas ramas, siempre, sin haber verificado nada contra producción. Corregido: columnas separadas `config_verified` (la regla existe y es válida en el archivo de config — sí verificable desde el repo) y `production_verified` (requiere una petición HTTP real contra el sitio desplegado — **no realizada en esta sesión**, sin acceso de red saliente). Además se detectó y corrigió una **cadena de redirects real de 2 saltos**: `/product-category/tecnologia` y `/product/auriculares-inalambricos-auriculares-bluetooth` apuntaban a `/categorias/tecnologia/`, un slug de categoría que ya no existe (renombrado a `tecnologia-promocional` en un redirect posterior). Se corrigió el target de esas 4 reglas para apuntar directo al destino final, sin eliminar los redirects históricos. También se detectó que la detección de "duplicados" confundía pares intencionales con/sin trailing slash con duplicados reales — corregido para comparar el string exacto del source.
- **`scripts/find-broken-internal-links.mjs`**: tenía un bug que trataba enlaces a **dominios externos** (ej. `https://otrositio.com/productos/x`) como si fueran rutas internas del sitio, arriesgando falsos positivos. No comprobaba blog, ciudades, rutas estáticas ni imágenes locales, y no separaba anchors/query strings antes de validar el slug. Corregido: guard de host (`www.kronosolopromocionales.com` / `kronosolopromocionales.com` únicamente), cobertura de blog/ciudades/rutas estáticas/assets, separación de `#`/`?`, y verificación de 205 imágenes locales contra `public/`. Encontró y se corrigieron 2 problemas reales: un enlace a `/categorias/` (no existe como página índice — no hay `src/app/categorias/page.tsx`) redirigido a `/regalos-corporativos/`, y una referencia a `/images/grid-pattern.svg` (inexistente) en `src/components/StorytellingHero.tsx`, un componente que **no se usa en ninguna página** (verificado con grep en `src/app`) — se quitó la referencia rota sin impacto en producción.
- **`scripts/run-seo-tests.mjs`**: no cubría "solo un generador de sitemap", "productos no optimizados fuera del sitemap" (equivalente de "sin noindex" en este proyecto, que no usa meta-tag noindex sino exclusión del sitemap), redirects sin bucles/cadenas, destinos de redirects existentes, rutas legacy conservadas, ni imágenes locales contra `out/`. Todas añadidas; la suite completa pasa con código de salida 0 tras las correcciones anteriores.

**2 redirects genuinamente rotos, sin corregir (requieren decisión humana):** `/blog/plumas-ecologicas-baltimore-impulsa-tu-marca-con-conciencia-ambiental-en-mexico` y `/blog/mug-metalico-vinga-eco-mu-442-impulsa-tu-marca-con-conciencia-ambiental-en-mexico` (y sus variantes con trailing slash) apuntan a slugs de blog (`...-en-ecuador`) que **no existen en `data/blog/posts.json` bajo ningún slug similar**. No se inventó un destino — no hay forma de saber desde el repo si el post fue eliminado, renombrado a otra cosa, o si el redirect nunca tuvo un destino válido. Además, estas 4 reglas están duplicadas exactamente entre `public/_redirects` y `netlify.toml` (redundante mas no contradictorio). Ver `reports/redirect-map.csv`, columna `notes` (`TARGET_NO_ENCONTRADO`).

## 5.1 Auditoría detallada de los redirects de blog con target dudoso (sesión seo-6)

Los 4 redirects "México → Ecuador" en `public/_redirects` y `netlify.toml` se auditaron
individualmente contra `data/blog/posts.json` y los 4 archivos de contenido
(`index.js`, `additions.js`, `fase3.js`, `pipeline.js`). Metodología: buscar el slug destino
exacto como registro en `posts.json` y como clave en los archivos de contenido; si no aparece,
buscar coincidencias parciales por tema (fuzzy match) antes de concluir que no hay equivalente.

| Redirect (origen) | Destino declarado | Estado | Evidencia | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| `/blog/promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-mexico` (+ variante `-en-ecuador-y-colombia`) | `/blog/promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-ecuador` | **Válido** | El slug destino existe en `posts.json` y tiene contenido real en `additions.js:1098` e `index.js:2692`. | **A — mantener el redirect tal cual**, ya apunta al equivalente exacto. | Conservado sin cambios — su destino es válido. |
| `/blog/plumas-ecologicas-baltimore-impulsa-tu-marca-con-conciencia-ambiental-en-mexico` (con y sin trailing slash) | `/blog/plumas-ecologicas-baltimore-impulsa-tu-marca-con-conciencia-ambiental-en-ecuador` | **Roto** | El slug destino NO existe en `posts.json` ni como clave en `index.js`, `additions.js`, `fase3.js` ni `pipeline.js`. Búsqueda difusa por tema ("pluma", "ecologic") solo encuentra artículos genéricos de sostenibilidad sin relación clara con un producto "Baltimore". Sin impresiones en `Páginas.csv` de GSC (no aparece en el export). | **D — retirado.** | **Regla eliminada el 2026-07-19** (ver sección 5.1.1). |
| `/blog/mug-metalico-vinga-eco-mu-442-impulsa-tu-marca-con-conciencia-ambiental-en-mexico` (con y sin trailing slash) | `/blog/mug-metalico-vinga-eco-mu-442-impulsa-tu-marca-con-conciencia-ambiental-en-ecuador` | **Roto** | Misma situación que el anterior: destino no existe en ningún archivo de contenido ni en `posts.json`. Sin impresiones en `Páginas.csv`. | **D — retirado.** | **Regla eliminada el 2026-07-19** (ver sección 5.1.1). |

### 5.1.1 Decisión adoptada (2026-07-19)

**Decisión:** retirar las reglas de redirect rotas de `plumas-ecologicas-baltimore` y
`mug-metalico-vinga` (4 bloques en `netlify.toml`, 4 líneas en `public/_redirects` — con y sin
trailing slash cada uno).

**Fecha:** 2026-07-19.

**Motivo:** los destinos no existen en `posts.json` ni en ningún archivo de contenido de blog;
las URLs de origen no aparecen en el export disponible de GSC (sin clics ni impresiones
registradas); no existe un equivalente semántico inequívoco al que redirigir. Mantener un 301
hacia un destino que en la práctica es un 404 añade un salto de red innecesario sin beneficio de
SEO. **No se creó ni inventó contenido** para llenar el vacío, y no se redirigió a home, a
`/blog/` ni a un artículo genérico.

**Comportamiento esperado:** las 4 URLs de origen ahora responden 404 directamente (regla
catch-all `/* → /404.html` ya existente en `netlify.toml`), en vez de un 301 hacia otro 404.

**El redirect de `promocionales-antimicrobianos` se conservó sin cambios** — su destino
(`/blog/promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-ecuador`) es
un post real y existente.

**Nota para referencia futura (no accionada en esta decisión):** el catálogo sí tiene productos
con nombres parecidos — `mug-metalico-vinga-eco-350-ml-13313` y
`set-de-boligrafos-baltimore-vinga-eco-13400` — pero son fichas de **producto**, no los artículos
de **blog** a los que apuntaban estas reglas (slugs y tipo de contenido distintos). No se redirigió
a ellos porque esa habría sido una decisión distinta (equivalente semántico de producto, no de
blog) no autorizada en este cambio.

**Actualización 2026-07-19:** las 2 reglas rotas se retiraron (ver sección 5.1.1) — no se
redirigieron a home, a `/blog/` ni a una categoría genérica, y no se inventó un destino. La regla
de `promocionales-antimicrobianos` (destino válido) no se tocó.

## 5.2 Corrección del generador de razones de `reports/redirect-map.csv` (revisión post-commit)

Tras crear los 10 commits, se detectó que la columna `reason` de `reports/redirect-map.csv`
asociaba **razones incorrectas o mal formadas** a ciertas filas — no un problema de los datos de
`config_verified`/`production_verified`/`notes` (esos siempre fueron correctos), sino del texto
descriptivo generado por `scripts/build-redirect-map.mjs`. Dos bugs distintos, ambos corregidos
con cambio mínimo, sin tocar `targets` ni `status` de ningún redirect:

1. **`public/_redirects` — arrastre de razón entre secciones no relacionadas.** El parser
   mantenía `currentReason` indefinidamente hasta ver un nuevo comentario `#`, pero el archivo
   tiene un bloque de 10 redirects de blog (`plumas-ecologicas-baltimore`, `mug-metalico-vinga`,
   `promocionales-antimicrobianos`) que sigue a la sección "Slugs de producto con 'colombia'"
   separado solo por una línea en blanco, **sin comentario propio**. Resultado: esas filas
   heredaban la razón "Slugs de producto con 'colombia', renombrados" — topicalmente incorrecta
   (son redirects de contenido de blog, no de renombrado de producto). **Corrección:** el parser
   ahora reinicia `currentReason` a un valor neutral (`"Redirect histórico sin razón específica
   documentada"`) en cada línea en blanco; un comentario nuevo lo sobrescribe inmediatamente si
   existe. Se verificó que ninguna sección legítima del archivo tiene líneas en blanco *dentro*
   de un mismo bloque comentado (solo *entre* bloques), por lo que este cambio no afecta ninguna
   atribución correcta existente.
2. **`netlify.toml` — comentarios multilínea truncados a la última línea.** El parser sobrescribía
   `lastComment` en cada línea `#` en vez de acumularlas, perdiendo las primeras líneas de
   comentarios de varias líneas (ej. la explicación completa de "canonicalización de dominio"
   quedaba reducida a solo su última oración, "regla de redirect para tener prioridad."). También
   dejaba caracteres decorativos de caja (`─`) sin limpiar. **Corrección:** el parser ahora
   acumula todas las líneas de comentario consecutivas en un único texto antes de asignarlo como
   razón, y limpia los caracteres de caja (sin tocar guiones largos `—` legítimos de puntuación).

**Verificación:** ambas correcciones son generales (no hardcodean las 2 URLs de blog específicas)
— se validan contra la estructura real de comentarios/secciones de ambos archivos. Se añadió
`scripts/run-seo-tests.mjs` → prueba `"reports/redirect-map.csv: razones no heredadas de una
sección no relacionada"`, que falla si cualquier fila cuya URL no mencione "colombia" recibe una
razón que sí la mencione — cobertura general, no solo de las 2 URLs de este caso. Después de la
corrección: `plumas-ecologicas-baltimore` y `mug-metalico-vinga` (origen `_redirects`) muestran
`"Redirect histórico sin razón específica documentada"`; sus equivalentes en `netlify.toml`
muestran `"301 Redirects: limpieza de URLs con señal de México"` (el encabezado real y completo
de esa sección). `config_verified=true`, `production_verified=false` y `TARGET_NO_ENCONTRADO` se
conservaron sin cambios en las 8 filas afectadas.

## 5.3 Auditoría de 404 reportados por GSC Coverage Validation (2026-07-19)

Origen: `C:\Users\Dagon\Desktop\KSP-SEO\404_error\` (`Tabla.csv`, `Metadatos.csv` — incidencia
"No se ha encontrado (404)", sitemap "Todas las páginas conocidas"). 7 URLs reportadas,
auditadas una por una contra `data/products.json` y `public/_redirects`/`netlify.toml` vigentes:

| URL reportada | Último rastreo GSC | Estado GSC | Diagnóstico | Acción |
| --- | --- | --- | --- | --- |
| `/productos/pano-en-microfibra/` | 2026-05-17 | Pendiente | Slug real sin sufijo de ID — el producto existe como `pano-en-microfibra-3192` (`is_ai_optimized: true`). Sin redirect previo. 14 impresiones reales en `Páginas.csv`. | **Corregido**: 301 añadido en `public/_redirects` (con y sin trailing slash). |
| `/productos/aplausometro-redondo-produccion-nacional/` | 2026-04-14 | Pendiente | Ya tiene 301 vigente hacia `aplausometro-redondo-produccion-nacional-5685/` desde la sesión seo-4. | **Sin acción** — dato de GSC anterior al fix; pendiente de que Google re-rastree. |
| `/productos/set-destornillador-pistol/` | 2026-02-23 | Pendiente | Ya tiene 301 vigente hacia `/categorias/herramientas/` desde la sesión seo-4. | **Sin acción** — dato de GSC anterior al fix. |
| `https://kronosolopromocionales.com/product-category/tecnologia/` (dominio sin `www`) | 2026-01-29 | Pendiente | Requiere 2 saltos ya cubiertos: canonicalización de dominio (`netlify.toml`, sesión seo-4) + `/product-category/tecnologia/` → `/categorias/tecnologia-promocional/` (`public/_redirects`, corregido en sesión seo-5 tras detectar una cadena rota). | **Sin acción** — dato de GSC anterior a ambos fixes. |
| `/productos/canguro-dior/` | 2026-07-11 | Error | Ya tiene 301 vigente hacia `canguro-dior-9823/` desde la sesión seo-4 (anterior a este rastreo, pero Google aún no revalidó). | **Sin acción** — dato de GSC anterior a la re-validación; el fix ya está desplegado (commit `a3c5a3c`, pusheado). |
| `/productos/vaso-tapa-plastico-14-oz-produccion-nacional/` | 2026-07-08 | Error | Slug real sin sufijo de ID — el producto existe como `vaso-tapa-plastico-14-oz-produccion-nacional-2871` (`is_ai_optimized: true`). Sin redirect previo. 14 impresiones en la URL rota, 1 impresión ya en la URL correcta (Google está en transición). | **Corregido**: 301 añadido en `public/_redirects` (con y sin trailing slash). |
| `/productos/$` | 2026-07-05 | Error | URL inválida/manipulada — no corresponde a ningún patrón generado por el código (`grep` de `${product.slug}` en todos los templates confirma que siempre interpola un slug real; ningún archivo de contenido contiene literalmente `productos/$`). Probable bot, escáner o enlace externo roto/truncado. | **Sin acción** — no se crea un redirect ni una página falsa para una URL sin origen identificable en el sitio. Sigue respondiendo 404 vía la regla catch-all existente (`/* → /404.html`), que es el comportamiento correcto. |

**Principio aplicado en los 2 casos corregidos:** mismo patrón que el hallazgo #12 de `seo-4.md`
(slugs indexados por Google antes de que el pipeline de datos añadiera el sufijo numérico de ID).
Se verificó `is_ai_optimized: true` en ambos destinos antes de redirigir (confirma que están en
el sitemap y son indexables). No se redirigió ninguna URL a home ni se inventó contenido.

**Nota sobre "Pendiente" vs "Error" en GSC:** ambos estados en este reporte corresponden a
rastreos previos a los fixes ya desplegados (commits de las sesiones seo-4 a seo-6, ya
pusheados a `origin/main` en `cb062c0`). GSC no vuelve a marcar una URL como resuelta hasta que
Google Search Console la re-rastrea — puede tardar días o semanas independientemente de que el
fix ya esté en producción. No se debe interpretar "Pendiente"/"Error" en este export como prueba
de que un fix ya desplegado no funcionó.

## 6. Qué falta validar

- **Verificación en producción (`production_verified`)**: ningún redirect fue probado con una petición HTTP real. Ejecutar manualmente `curl -I https://www.kronosolopromocionales.com/<ruta>` para cada regla crítica tras el próximo deploy.
- **Dominio primario en Netlify**: esta sesión no operó Netlify (prohibido explícitamente). Falta confirmar en el dashboard que `www.kronosolopromocionales.com` es el dominio primario.
- **Core Web Vitals de campo**: requieren Search Console/CrUX/PageSpeed Insights con acceso de red — no disponibles en este entorno. Ver `docs/core-web-vitals-field-checklist.md`.

## 7. Riesgos

- Los 2 redirects rotos de blog (`plumas-ecologicas-baltimore`, `mug-metalico-vinga`) se retiraron el 2026-07-19 (ver sección 5.1.1) — cualquier visitante o bot que llegue por esas URLs antiguas ahora recibe un 404 directo en vez de un 301 hacia otro 404. Riesgo residual mínimo: si existiera algún backlink externo desconocido hacia esas URLs, dejaría de recibir cualquier redirect (antes tampoco llegaba a contenido real, así que el cambio no empeora la experiencia del usuario final).
- **`data/blog/content/pipeline.js` está sin trackear en git y SÍ es requerido para el build**: `src/app/blog/[slug]/page.tsx` lo importa de forma estática (`import { blogContentPipeline } from '@/data/blog/content/pipeline'`) y lo usa en la concatenación de contenido de cada post. Un import de ES module que no resuelve rompe el build de Next.js — no es un fallback silencioso. **Corrección de esta sesión (seo-6): se decidió Opción A — versionar el archivo tal cual está** (un registro vacío `export const blogContentPipeline = {}`, con los comentarios que documentan que solo `pipeline/publish/blog_adapter.py` debe escribir ahí). No se eliminó el import (Opción B) porque el propio archivo documenta que un pipeline externo espera escribir/ampliarlo — quitar el import rompería ese contrato.
- **Corrección de clasificación (seo-6):** en la sesión anterior se afirmó incorrectamente que `public/images/blog/_placeholder-ksp.jpg` (sin trackear) era el fallback de imagen de 11 productos. Verificado con evidencia: los 11 productos en `data/products.json` referencian `/images/products/_placeholder-ksp.jpg` (nótese `products`, no `blog`), que **ya está versionado** (`git ls-files` lo confirma) — esos 11 productos no corren ningún riesgo. El archivo `public/images/blog/_placeholder-ksp.jpg` es un archivo distinto, sin ninguna referencia en `src/` ni `data/` (verificado con búsqueda exhaustiva) — procedencia desconocida, no relacionado con ningún producto ni con esta tarea SEO. No se debe incluir en ningún commit SEO ni eliminar sin autorización.
- Los redirects de dominio (`netlify.toml`) son una garantía a nivel de repo, pero si el dashboard de Netlify tiene una configuración de dominio contradictoria, el comportamiento real en producción puede diferir de lo que este repo declara.

## 8. Limitaciones de los datos

- Los CSV de GSC truncan y anonimizan consultas por privacidad — los totales de la pestaña "Consultas" nunca reconciliarán exactamente con "Páginas" ni con el "Gráfico".
- El export de Páginas.csv y Consultas.csv parece limitado a ~450/~100 filas (probablemente el tope de exportación de la UI, no la totalidad de URLs/consultas con datos) — puede haber URLs o consultas con impresiones que no aparecen en ningún reporte de esta sesión.
- No hay datos de campo de Core Web Vitals en este análisis — solo pueden auditarse en código/laboratorio desde este entorno.

## 9. Qué no se tocó (y por qué)

- Snippets con CTR ya positivo (`/categorias/antiestres/`, home) — el brief prohíbe explícitamente reescribir agresivamente lo que ya funciona.
- Cuenca y Ambato (title/description) — CTR 16% y 11.76% respectivamente, no se arriesgan.
- Slugs de productos/categorías posicionados — ningún cambio de slug sin plan de migración con redirect, y en esta sesión no se cambió ningún slug existente (solo se repararon enlaces rotos hacia slugs ya vigentes).
- Datos de precio, stock, reviews, autores o casos de éxito — no se inventó ninguno.
