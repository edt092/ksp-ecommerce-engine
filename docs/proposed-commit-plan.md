# Plan de commits propuesto — v2, corregido en sesión seo-6

**Estado: commits 0–9 ejecutados y validados; este documento se conserva como registro del plan
aplicado**, no como un plan pendiente. Hashes reales del historial (`git log --oneline`):

```text
9a173e2 fix(blog): include required pipeline content registry
7d13323 fix(seo): consolidate sitemap generation and validate unique slugs
fd5605f fix(seo): canonicalize protocol and domain redirects
a3c5a3c fix(seo): preserve legacy product and category URLs
d14d71e fix(content): remove duplicate blog post entry
61d47c7 feat(seo): refresh priority blog content and metadata
907737c fix(content): correct broken internal links and remove unsourced claims across blog articles
173afd2 feat(seo): improve commercial and geographic internal linking
eb47adc chore(seo): add GSC analysis and validation tooling
4dae389 docs(seo): add audit roadmap reports and measurement plan
```

El Commit 10 (opcional, `StorytellingHero.tsx`) **no se ejecutó** — sigue pendiente de decisión
del usuario. Ver `docs/seo-audit-gsc.md` para la corrección post-commit del generador de razones
de `reports/redirect-map.csv` (sesión de revisión posterior a estos 10 commits).

Esta es la **versión corregida** del plan original (la v1 tenía 3 errores de hecho, corregidos
abajo con evidencia). Basado en la clasificación completa de
`reports/working-tree-classification.csv` y en la inspección hunk-por-hunk de cada archivo de
contenido (ver `docs/seo-audit-gsc.md`).

## Veredicto sobre el plan anterior (v1)

1. **Error de clasificación del placeholder** — v1 afirmaba que `public/images/blog/_placeholder-ksp.jpg`
   (sin trackear) era el fallback de imagen de 11 productos. **Falso, verificado**: los 11
   productos en `data/products.json` referencian `/images/products/_placeholder-ksp.jpg`
   (`products`, no `blog`), que ya está versionado (`git ls-files` lo confirma). El archivo de
   `blog/` es distinto, sin ninguna referencia en `src/` ni `data/` — procedencia desconocida.
   **Corregido en v2.**
2. **`pipeline.js` no tenía una decisión tomada** — v1 solo señalaba el riesgo. **v2 decide
   Opción A** (versionar el registro vacío tal cual) con evidencia: `src/app/blog/[slug]/page.tsx`
   lo importa estáticamente y lo usa en la línea de concatenación de contenido; un import de ES
   module no resuelto rompe el build de Next.js. El propio archivo documenta que un pipeline
   externo (`pipeline/publish/blog_adapter.py`) espera escribir ahí — eliminar el import (Opción B)
   rompería ese contrato sin necesidad, ya que versionar el registro vacío no tiene costo ni riesgo.
3. **Dedupe y quick-wins editoriales estaban mezclados en un solo commit propuesto** — v1 agrupaba
   todo `data/blog/posts.json` en un commit de "dedupe". **v2 separa por hunk exacto** (ver Commit 4
   vs Commit 5 abajo) — la eliminación del duplicado y los cambios de `metaTitle`/`dateModified`
   son hunks distintos y no dependen entre sí.
4. **Los enlaces rotos corregidos en artículos NO relacionados con fin de año/2025 estaban
   mezclados con la "refresh de contenido prioritario"** — v1 agrupaba todo `data/blog/content/*.js`
   en un solo commit. **v2 separa un Commit 6 nuevo** exclusivamente para correcciones de enlaces y
   remoción de una estadística sin fuente, ya que tocan 9+ artículos sin relación con fin de
   año/2025 y ninguno tuvo su `dateModified` actualizado (correctamente, porque no fue una
   actualización editorial de esos artículos, solo una corrección mecánica de un enlace).
5. **`reports/redirect-map.csv` ya distinguía `config_verified`/`production_verified`
   correctamente** desde la sesión anterior — v1 no tenía el bug que este documento sugiere
   confirmar; se revisó y se confirma que `production_verified=false` nunca se trata como fallo,
   solo como "pendiente de verificar en producción" (ver `scripts/build-redirect-map.mjs`, líneas
   con el comentario `NOTA`).
6. **Rutas personales (`C:\Users\Dagon`, `KSP-SEO`) aparecían en `reports/gsc-summary.md` y en 2
   scripts** — corregido en esta sesión: los scripts ya no tienen un valor por defecto hardcodeado
   (ahora exigen la ruta por argumento o variable de entorno `GSC_DIR`, con mensaje de uso
   genérico), y `reports/gsc-summary.md` usa una frase neutral con la fecha de corte en vez de la
   ruta local.

Orden sugerido de aplicación: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 (→ 10 opcional). Cada uno
asume que el anterior ya se aplicó.

---

## Commit 0 — `fix(blog): include required pipeline content registry`

**Archivos incluidos:**
- `data/blog/content/pipeline.js` (nuevo — registro vacío `export const blogContentPipeline = {}`, tal como existe hoy, sin modificar)

**Archivos excluidos:** ninguno más.

**Dependencias:** ninguna — debe ir primero porque sin este archivo un clon limpio no compila
(ver Fase 12, comprobación de clon limpio).

**Riesgo:** ninguno. El archivo ya existe en el working tree exactamente en el estado que se
versiona — no se genera ni edita contenido nuevo.

**Prueba que debe pasar antes del commit:** `pnpm build` (exit 0) confirmando que
`src/app/blog/[slug]/page.tsx` resuelve el import sin error.

---

## Commit 1 — `fix(seo): consolidate sitemap generation and validate unique slugs`

**Archivos incluidos:**
- `next-sitemap.config.js` (eliminado)
- `package.json` — **solo el hunk de `prebuild`/eliminación de `postbuild`/eliminación de la
  dependencia `next-sitemap`** (ver nota de staging parcial abajo — este archivo también cambia en
  el Commit 8, mismo hunk de la sección `scripts`)
- `pnpm-lock.yaml`
- `scripts/validate-unique-slugs.js` (nuevo)

**Archivos excluidos:** `netlify.toml` (Commit 2).

**Dependencias:** Commit 0 (para que el build funcione de principio a fin al validar).

**Riesgo:** medio. Cambia el pipeline de build.

**Prueba que debe pasar antes del commit:** `node scripts/validate-unique-slugs.js` (exit 0) y
`pnpm build` (exit 0), confirmando que `out/sitemap.xml` no tiene `lastmod` con hora de build.

**Nota de staging parcial:** `package.json` tiene cambios de **dos commits distintos en el mismo
hunk** de la sección `scripts` (este commit + los 4 alias `seo:*` del Commit 8). Ver
`docs/staging-instructions.md` para el procedimiento exacto con `git add -p` + edición manual del
hunk.

---

## Commit 2 — `fix(seo): canonicalize protocol and domain redirects`

**Archivos incluidos:**
- `netlify.toml` (3 reglas de redirect de dominio http/no-www → https+www)

**Archivos excluidos:** todo lo demás.

**Dependencias:** ninguna.

**Riesgo:** medio. `config_verified=true` (la regla existe y es sintácticamente válida — se
verificó parseando el archivo). `production_verified=false` — **no se probó contra el sitio
desplegado** porque esta tarea prohíbe explícitamente operar Netlify o acceder a la red externa.
Esto no es un fallo, es una verificación pendiente documentada.

**Prueba que debe pasar antes del commit:** `node scripts/build-redirect-map.mjs` (exit 0) y
revisión manual de que las 3 reglas nuevas aparecen en `reports/redirect-map.csv` con
`config_verified=true`.

---

## Commit 3 — `fix(seo): preserve legacy product and category URLs`

**Archivos incluidos:**
- `public/_redirects` (5 pares nuevos para productos 404 + fix de la cadena de 2 saltos de
  `/product-category/tecnologia` y `/product/auriculares-inalambricos-auriculares-bluetooth`)

**Archivos excluidos:** todo lo demás.

**Riesgo:** bajo. No elimina ningún redirect histórico, solo añade/corrige targets.

**No se afirma que todos los redirects de este archivo sean válidos** — 2 reglas preexistentes
(no tocadas en este commit) siguen apuntando a contenido de blog que no existe (ver Commit
"decisión pendiente" en la sección de redirects rotos de `docs/seo-audit-gsc.md`, sección 5.1).

**Prueba que debe pasar antes del commit:** `node scripts/build-redirect-map.mjs` (exit 0) — sin
`TARGET_NO_ENCONTRADO` para las filas tocadas en este commit específicamente (las 2 filas rotas
preexistentes son de otro alcance, no de este commit).

---

## Commit 4 — `fix(content): remove duplicate blog post entry`

**Archivos incluidos (mediante staging parcial):**
- `data/blog/posts.json` — **únicamente el hunk que elimina el registro duplicado**
  (`boligrafos-promocionales-personalizados-guia-empresas-ecuador`, segunda ocurrencia, id
  `"boligrafos-promocionales-para-empresas"` repetido)

**Archivos excluidos de este commit:**
- Los otros 2 hunks de `data/blog/posts.json` (cambios de `metaTitle`/`dateModified` de los
  artículos de fin de año y 2025) — van en el Commit 5.

**Riesgo:** ninguno. Los dos registros eran idénticos byte a byte (verificado antes de eliminar en
la sesión original).

**Prueba que debe pasar antes del commit:** `node scripts/validate-unique-slugs.js` (exit 0).

**Comando de staging:** `git add -p data/blog/posts.json` → responder `y` solo al hunk de la
eliminación del registro duplicado, `n` a los otros dos. Ver `docs/staging-instructions.md`.

---

## Commit 5 — `feat(seo): refresh priority blog content and metadata`

**Archivos incluidos (mediante staging parcial):**
- `data/blog/posts.json` — los 2 hunks restantes: `dateModified` de
  `mejores-productos-promocionales-2025` (2025-01-15 → 2026-07-18) y `metaTitle` +
  `dateModified` de `regalos-corporativos-fin-ano-ecuador` (2024-12-28 → 2026-07-18)
- `data/blog/content/index.js` — **únicamente 2 de los 12 hunks**: el hunk `@@ -539,17 +539,17@@`
  (contenido evergreen del artículo 2025: quita "En 2025", corrige typo "Cuencadad"→"Calidad",
  quita estadística inventada del 89% de power banks) y el hunk `@@ -1030,10 +1030,26@@` (checklist
  de cotización + CTA WhatsApp + enlace a `/regalos-corporativos/` del artículo de fin de año)

**Archivos excluidos de este commit:** los otros 10 hunks de `index.js` y los 5 hunks de
`additions.js` (van en el Commit 6 — son correcciones de enlaces en artículos sin relación con
esta actualización editorial).

**Verificación de `dateModified: 2026-07-18`:** se confirmó que ambos artículos tuvieron cambios
editoriales materiales en el cuerpo del contenido en esa fecha (no es un bump de fecha por haber
tocado el archivo en un build) — ver el detalle de cada hunk arriba.

**Riesgo:** bajo. Ninguna cifra inventada se añadió (se removieron 2 estadísticas sin fuente en
esta y en el Commit 6); no se cambiaron slugs ni URLs.

**Prueba que debe pasar antes del commit:** `pnpm build` (exit 0).

**Comando de staging:** `git add -p data/blog/posts.json data/blog/content/index.js` — ver
`docs/staging-instructions.md` para la secuencia exacta de respuestas y/o edición manual de hunks.

---

## Commit 6 (nuevo, no estaba en v1) — `fix(content): correct broken internal links and remove unsourced claims across blog articles`

**Justificación de por qué es un commit aparte:** estos cambios tocan 9+ artículos de blog
distintos, sin relación temática con fin de año/2025, y ninguno recibió un bump de
`dateModified` (correcto — son correcciones mecánicas de enlaces, no actualizaciones editoriales).
Mezclarlos con el Commit 5 habría oscurecido qué cambio corresponde a qué propósito.

**Archivos incluidos (mediante staging parcial):**
- `data/blog/content/index.js` — los 10 hunks restantes (no incluidos en el Commit 5): fix de
  enlace `/categorias/oficina` → `/categorias/articulos-de-oficina-personalizados` (6
  ocurrencias, en 5 artículos distintos), fix de `/categorias/confeccion` →
  `/categorias/camisetas-y-confeccion-corporativa` (2 ocurrencias, 2 artículos), y adición de un
  enlace contextual a `/categorias/mugs-y-termos-personalizados` en el artículo de segmentación de
  regalos (hunk `@@ -313`)
- `data/blog/content/additions.js` — los 5 hunks completos: typo `speaker-bluetooth-bass-swisspeak`
  → `speaker-bluetooth-bass-swiss-peak` (2 ocurrencias), `/categorias/anti-estres/` →
  `/categorias/antiestres/`, `/categorias/` → `/regalos-corporativos/` (destino inexistente
  corregido a uno real), y remoción de una estadística atribuida a "PPAI" sin fuente verificable

**Archivos excluidos:** los 2 hunks de `index.js` ya asignados al Commit 5.

**Riesgo:** bajo. Todos los targets corregidos se verificaron contra `data/categories.json` /
`data/products.json` antes de aplicar el cambio (ver `reports/broken-internal-links.csv`, que
debe estar vacío tras este commit).

**Prueba que debe pasar antes del commit:** `node scripts/find-broken-internal-links.mjs` (exit 0,
"Broken links: 0").

**Comando de staging:** ver `docs/staging-instructions.md` — requiere `git add -p` cuidadoso sobre
`index.js` para excluir los 2 hunks ya aplicados en el Commit 5.

---

## Commit 7 (era Commit 6 en v1) — `feat(seo): improve commercial and geographic internal linking`

**Archivos incluidos:**
- `src/app/HomePageClient.tsx`
- `src/components/Footer.tsx`
- `data/categories.json`
- `data/geo-data.js`

**Archivos excluidos:** `src/components/StorytellingHero.tsx` — no forma parte inseparable de
este cambio (ver Commit 10 opcional). No es un enlace nuevo ni geográfico, es la remoción de una
referencia a un asset inexistente en un componente no utilizado.

**Riesgo:** bajo-medio. El cambio de H1/seoTitle de la categoría de bolígrafos no tiene CTR
positivo que proteger (0 clics, posición 36 en el export de GSC).

**Prueba que debe pasar antes del commit:** `node scripts/find-broken-internal-links.mjs` (exit 0)
y `pnpm build` (exit 0).

---

## Commit 8 (era Commit 7 en v1) — `chore(seo): add GSC analysis and validation tooling`

**Archivos incluidos:**
- `scripts/analyze-gsc.mjs`
- `scripts/build-redirect-map.mjs`
- `scripts/find-broken-internal-links.mjs`
- `scripts/run-seo-tests.mjs`
- `scripts/serve-static.mjs`
- `package.json` — **solo el hunk de los 4 alias `seo:analyze`/`seo:redirects`/`seo:links`/`seo:test`**
  añadidos en la sección `scripts` (mismo hunk físico que el Commit 1 — requiere staging parcial,
  ver nota abajo)

**Archivos excluidos:** `scripts/validate-unique-slugs.js` (ya va en el Commit 1).

**Riesgo:** bajo. Los alias `seo:*` solo invocan los scripts ya commiteados; no afectan
`prebuild`/`postbuild`.

**Prueba que debe pasar antes del commit:** ejecutar `pnpm run seo:analyze "<directorio-exportacion-gsc>"`,
`pnpm run seo:redirects`, `pnpm run seo:links`, `pnpm run seo:test` (tras un build) y confirmar
exit 0 en los 4. **Nota:** no uses `--` antes de la ruta — con la versión local de pnpm ese
separador se reenvía literalmente como argumento al script y falla (exit 1). Esto es una
desviación de sintaxis de invocación de pnpm, no un bug de `analyze-gsc.mjs` (verificado: el
mismo script con la misma ruta, invocado sin `--`, termina en exit 0).

**⚠️ Nota de staging parcial obligatoria:** `package.json` cambia en el Commit 1 (prebuild/postbuild)
y en este Commit 8 (alias `seo:*`), **en el mismo hunk físico** del diff (están a menos de 3 líneas
de distancia en el archivo). `git add -p` no podrá separarlos automáticamente con `y`/`n` — hay
que usar la opción `e` (editar manualmente el hunk) en ambos commits. Procedimiento exacto en
`docs/staging-instructions.md`.

---

## Commit 9 (era Commit 8 en v1) — `docs(seo): add audit roadmap reports and measurement plan`

**Archivos incluidos:**
- `.gitignore`
- `docs/seo-audit-gsc.md`
- `docs/seo-roadmap-100-clicks.md`
- `docs/keyword-url-map.md`
- `docs/seo-measurement-plan.md`
- `docs/core-web-vitals-field-checklist.md`
- `docs/phase-4-authority-playbook.md`
- `docs/templates/seo-case-study-template.md`
- `docs/editorial-link-outreach-plan.md`
- `docs/proposed-commit-plan.md` (este archivo)
- `docs/staging-instructions.md`
- `reports/gsc-summary.md`
- `reports/gsc-page-opportunities.csv`
- `reports/gsc-query-opportunities.csv`
- `reports/gsc-product-opportunities.csv`
- `reports/gsc-domain-variants.csv`
- `reports/gsc-legacy-urls.csv`
- `reports/redirect-map.csv`
- `reports/broken-internal-links.csv`
- `reports/core-web-vitals-lab.md`
- `reports/working-tree-classification.csv`

**Antes de incluir reportes, verificado en esta sesión:**
- ✅ Rutas personales eliminadas (`C:\Users\Dagon`, `KSP-SEO` ya no aparecen en ningún doc/reporte —
  confirmado con `rg`, ver Fase 8).
- ✅ Sin secretos (verificado con grep de patrones de credenciales — solo falsos positivos: "el
  secreto mejor guardado" en copy de marketing, y el paquete npm `js-tokens`).
- ✅ Sin datos personales de terceros (los CSV de GSC no se copian al repo, solo se leen in-place).
- ✅ Los CSV generados son pequeños (reportes derivados, no los CSV originales de GSC).
- ✅ Fecha de corte indicada explícitamente (2026-07-15) en `gsc-summary.md` y en los docs.
- ✅ Clasificación del placeholder corregida (ver veredicto arriba).
- ✅ Estado de `pipeline.js` corregido (Opción A, documentado).
- ✅ `config_verified`/`production_verified` correctamente distinguidos y explicados.

**Riesgo:** ninguno — solo documentación y reportes, no afectan build ni sitio.

**Prueba que debe pasar antes del commit:** verificar manualmente que ningún documento tiene
mojibake (`file docs/*.md reports/*.md` debe reportar "UTF-8 text" en todos).

---

## Commit 10 (opcional, independiente) — `fix(ui): remove stale storytelling hero asset reference`

**Archivos incluidos:**
- `src/components/StorytellingHero.tsx`

**Justificación de independencia:** el componente **no se usa en ninguna página** (`grep -rln
"StorytellingHero" src/app` no encuentra ningún importador). El cambio quita una referencia CSS
a `/images/grid-pattern.svg`, que no existe en `public/`. Es una corrección válida pero no
relacionada con SEO ni con enlazado — es limpieza de código muerto.

**Riesgo:** ninguno. Cero impacto en build o experiencia (componente no renderizado).

**Prueba que debe pasar antes del commit:** `pnpm build` (exit 0) — no debería haber ninguna
diferencia de output ya que el componente no se usa.

---

## Commit futuro de rendimiento (NO implementar en esta tarea)

`perf(ui): improve hero loading and remove global reveal delay` — requiere autorización explícita
del usuario porque toca UX visible (el patrón de animación "reveal on scroll" de
`src/app/layout.tsx`) y un asset de imagen pesado (`/images/regalos-promocionales.png`, 1.84MB, en
el hero de `/regalos-corporativos/`). Ver hallazgos completos en `reports/core-web-vitals-lab.md`.
Mantener separado de los commits de contenido SEO y housekeeping de Git.

---

## Nunca incluir en ningún commit (salvo autorización expresa y evidencia nueva)

- `data/products.json.pre-colombia-cleanup-backup`
- `data/products_backup_before_new_categories_2026-07-10T20-41-39-907Z.json`
- `data/products_backup_before_new_categories_2026-07-10T20-44-12-215Z.json`
- `tsconfig.tsbuildinfo`
- `public/images/blog/_placeholder-ksp.jpg` — reclasificado en esta sesión: procedencia incierta,
  no relacionado con los 11 productos (ver veredicto arriba). No es un artefacto de build ni un
  backup, pero tampoco pertenece a esta tarea SEO — requiere que el usuario confirme su origen
  antes de decidir si se versiona, se descarta o se archiva.
