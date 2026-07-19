# Instrucciones de staging parcial

**Estado: los commits 0–9 ya se ejecutaron siguiendo estas instrucciones.** Este documento se
conserva como registro reproducible de cómo se separó cada hunk, útil como referencia si se
necesita repetir un staging parcial similar en el futuro (ej. el Commit 10 opcional, aún
pendiente de autorización).

Comandos exactos para dejar cada commit del `docs/proposed-commit-plan.md` (v2) listo para
revisión, usando `git add -p` donde un archivo se reparte entre varios commits. **Ningún comando
de este documento ejecuta `git commit`** — son solo instrucciones de staging para que el usuario
las siga manualmente, revise con `git diff --cached`, y decida cuándo commitear cada bloque.

Después de cada `git add`, revisa antes de commitear:

```bash
git diff --cached --stat
git diff --cached
```

Para retirar algo del stage sin perder el cambio (si te equivocaste de commit):

```bash
git restore --staged <archivo>
```

---

## Commit 0 — `fix(blog): include required pipeline content registry`

```bash
git add data/blog/content/pipeline.js
```

Archivo completo, nuevo, sin partes que excluir.

---

## Commit 1 — `fix(seo): consolidate sitemap generation and validate unique slugs`

```bash
git add next-sitemap.config.js
git add pnpm-lock.yaml
git add scripts/validate-unique-slugs.js
git add -p package.json
```

Al llegar al primer hunk de `package.json` (sección `scripts`), Git preguntará qué hacer.
**Este hunk mezcla dos commits** (este + el Commit 8, alias `seo:*`) — responde `e` (edit) y en el
editor que se abre:

1. Deja intactas las líneas de `prebuild` (cambia a incluir `validate-unique-slugs.js`) y la
   eliminación de `postbuild`.
2. **Quita del parche** (borra esas líneas del editor, no solo las dejes en `-`) las 4 líneas
   añadidas de `seo:analyze`, `seo:redirects`, `seo:links`, `seo:test` — esas van en el Commit 8.
3. **Importante:** la línea `"lint": "next lint"` no debe quedar con una coma al final en este
   commit (agregarle coma sin las líneas siguientes produce JSON inválido). Verifica que en el
   parche editado esa línea quede exactamente como estaba en el original, sin `,` final.
4. Guarda y cierra el editor.

Cuando llegue el segundo hunk de `package.json` (elimina `next-sitemap` de `devDependencies`),
responde `y` — pertenece completo a este commit.

**Verifica antes de continuar:**
```bash
git diff --cached package.json   # debe mostrar JSON válido, sin las líneas seo:*
node -e "JSON.parse(require('fs').readFileSync('package.json','utf-8'))"   # confirma que el archivo en disco sigue siendo válido
```

---

## Commit 2 — `fix(seo): canonicalize protocol and domain redirects`

```bash
git add netlify.toml
```

---

## Commit 3 — `fix(seo): preserve legacy product and category URLs`

```bash
git add public/_redirects
```

---

## Commit 4 — `fix(content): remove duplicate blog post entry`

```bash
git add -p data/blog/posts.json
```

Git mostrará 3 hunks. Responde:
- Hunk con el cambio de `dateModified` de `mejores-productos-promocionales-2025` (línea ~450) → `n`
- Hunk con `metaTitle`/`dateModified` de `regalos-corporativos-fin-ano-ecuador` (línea ~631) → `n`
- Hunk que **elimina** el registro duplicado de `boligrafos-promocionales-personalizados-guia-empresas-ecuador` (al final del archivo) → `y`

---

## Commit 5 — `feat(seo): refresh priority blog content and metadata`

```bash
git add -p data/blog/posts.json
```

Quedan los 2 hunks no incluidos en el Commit 4 — responde `y` a ambos (dateModified del artículo
2025, metaTitle+dateModified del artículo de fin de año).

```bash
git add -p data/blog/content/index.js
```

Git mostrará 12 hunks. Responde `y` **solo** a estos 2 (identifícalos por el contexto que muestra
el parche):
- El hunk dentro de `'mejores-productos-promocionales-2025'` que quita "En 2025", corrige
  "Cuencadad"→"Calidad" y quita la estadística del 89% de power banks.
- El hunk dentro de `'regalos-corporativos-fin-ano-ecuador'` que añade la sección "Checklist Antes
  de Solicitar tu Cotización" y el botón de WhatsApp.

Responde `n` a los otros 10 hunks (van en el Commit 6).

---

## Commit 6 — `fix(content): correct broken internal links and remove unsourced claims across blog articles`

```bash
git add data/blog/content/additions.js
```

Archivo completo — sus 5 hunks pertenecen enteramente a este commit (ya no queda nada de
`additions.js` para otro commit).

```bash
git add -p data/blog/content/index.js
```

Quedan los 10 hunks no incluidos en el Commit 5 (todos son fixes de `/categorias/oficina` →
`/categorias/articulos-de-oficina-personalizados`, `/categorias/confeccion` →
`/categorias/camisetas-y-confeccion-corporativa`, y el enlace nuevo a
`/categorias/mugs-y-termos-personalizados` en el artículo de segmentación de regalos) — responde
`y` a todos los que queden.

**Verifica antes de continuar:**
```bash
git diff --cached data/blog/content/index.js | grep "^+" | grep -v "^+++"
# no debe contener nada del checklist de cotización ni del párrafo de power banks —
# esos ya deben estar en el Commit 5, no en este.
```

---

## Commit 7 — `feat(seo): improve commercial and geographic internal linking`

```bash
git add src/app/HomePageClient.tsx
git add src/components/Footer.tsx
git add data/categories.json
git add data/geo-data.js
```

No incluyas `src/components/StorytellingHero.tsx` aquí (va en el Commit 10, opcional e
independiente).

---

## Commit 8 — `chore(seo): add GSC analysis and validation tooling`

```bash
git add scripts/analyze-gsc.mjs
git add scripts/build-redirect-map.mjs
git add scripts/find-broken-internal-links.mjs
git add scripts/run-seo-tests.mjs
git add scripts/serve-static.mjs
git add package.json
```

Si ya commiteaste el Commit 1 antes de llegar aquí, el `git add package.json` de este paso
debería quedar limpio automáticamente (solo quedan las 4 líneas `seo:*` en el diff restante, sin
necesitar `-p` ni edición manual). Si por algún motivo el Commit 1 todavía no se aplicó, usa
`git add -p package.json` y selecciona únicamente las 4 líneas nuevas de `seo:*`.

**Verifica:**
```bash
git diff --cached package.json
node -e "JSON.parse(require('fs').readFileSync('package.json','utf-8'))"
```

---

## Commit 9 — `docs(seo): add audit roadmap reports and measurement plan`

```bash
git add .gitignore
git add docs/
git add reports/
```

---

## Commit 10 (opcional) — `fix(ui): remove stale storytelling hero asset reference`

```bash
git add src/components/StorytellingHero.tsx
```

---

## Nunca staguear (recordatorio)

```bash
# NO ejecutes git add sobre estos:
# data/products.json.pre-colombia-cleanup-backup
# data/products_backup_before_new_categories_2026-07-10T20-41-39-907Z.json
# data/products_backup_before_new_categories_2026-07-10T20-44-12-215Z.json
# tsconfig.tsbuildinfo
# public/images/blog/_placeholder-ksp.jpg
```

Si alguno queda en el stage por error (por ejemplo, tras un `git add -A` accidental):
```bash
git restore --staged <archivo>
```

## Después de cada bloque de staging

1. `git diff --cached --stat` — confirma que solo están los archivos esperados de ese commit.
2. `git diff --cached` — revisa el contenido línea por línea.
3. Ejecuta la prueba indicada en `docs/proposed-commit-plan.md` para ese commit específico.
4. Solo entonces, si decides proceder, ejecuta `git commit` manualmente con el mensaje indicado —
   este documento y esta sesión no ejecutan `git commit` en ningún caso.
