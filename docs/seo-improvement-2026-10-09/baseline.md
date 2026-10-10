# Baseline — mejora SEO 2026-10-09

Fecha de baseline: 2026-10-09 (America/Guayaquil). Ejecución: Claude Code, a partir de
`PROMPT-MAESTRO-CLAUDE-CODE.md` y las fuentes de
`C:\Users\Dagon\Desktop\MIS PROYECTOS PERSONALES\SITIOS_WEB\SEO-ANALISI-GENERAL\SEO-KRONOSOLOPROMOCIONALES.COM\ANALISI-09-10-2026`.

## 1. Fuentes leídas

| Fuente | Estado |
|---|---|
| `plan-de-accion-seo-claude/PROMPT-MAESTRO-CLAUDE-CODE.md` | Leído completo; es la instrucción de ejecución |
| `plan-de-accion-seo-claude/ANALISIS-Y-PLAN.md` | Leído completo |
| `plan-de-accion-seo-claude/ANEXO-DATOS-COMPLETOS.md` | Usado vía `entregables-seo-2026-10-09/evidencia-calculada.json`; filas recalculadas desde los CSV originales |
| `auditoria-competitiva-seo-codex/AUDIT.md` | Leído (secciones 1–5); artefactos en `reports/competitive-seo-2026-10-09/` conservados |
| `auditoria-seo-claude-agentes-seo/seo-audit-2026-10-09.md` | Es la misma auditoría que `docs/seo-audit-2026-10-09.md` |
| 18 CSV (`Paginas-no-index/`, `rendimiento-3-meses-ecuador/`, `rendimiento-3-meses-todos-los-paises/`) | Procesados con `scripts/seo-improvement/reconcile-gsc.mjs` (parser con comillas/multilínea, vacío ≠ cero) |

Inventario con SHA-256: `reports/seo-improvement-2026-10-09/gsc-reconciliation.json` (`inventario`). La carpeta
contiene hoy 23 archivos: los 20 originales más los 3 del plan (`plan-de-accion-seo-claude/`). Los hashes de los 20
originales no se compararon uno a uno con el anexo; los totales recalculados coinciden con los del anexo (ver §3),
así que no hay indicio de cambio en los datos.

Referencias de repo pedidas por el prompt: existen `pendiente-seo.md`, `plan-seo.md`, `offers.md`, `noindex.md`,
`docs/seo-master-plan-2026-07-19.md`, `docs/seo-session-pending-2026-07-20.md`,
`docs/content-cluster-priority-map.md`, `docs/seo-measurement-plan.md`, `docs/review-collection-workflow.md`.
**No existe** `docs/authority-growth-plan.md` (citado en `pendiente-seo.md` §5 y en el prompt); no se inventó.
No hay `AGENTS.md` ni `CLAUDE.md` en el repo ni en sus ancestros dentro del proyecto.

## 2. Código y despliegue

| Dato | Valor |
|---|---|
| Rama | `main`, 1 commit por delante de `origin/main` |
| HEAD local | `0ef0292` (2026-08-03) — 3 redirects legacy sin SKU |
| `origin/main` | `864dfdf` (2026-07-27) |
| `0ef0292` en producción | **No desplegado**: verificado en vivo 2026-10-09, `/productos/botilito-en-tritan-bugsy-630ml/` y `/productos/gorra-brixton-urban-travel/` devuelven 404 |
| Archivos no seguidos preexistentes | `docs/seo-audit-2026-10-09.md`, `reports/competitive-seo-2026-10-09/`, `scripts/competitive-seo-audit.mjs`, `scripts/summarize-competitive-seo.mjs` — conservados |
| Build | `pnpm build` (Netlify ejecuta `npm run build`), `output: 'export'`, `trailingSlash: true` |
| `out/` local | Export del 2026-08-03 11:04 — **no** es un build de los cambios de esta sesión |
| Toolchain | Node 22.14.0 local (Netlify fija `NODE_VERSION = 18`), pnpm 11.1.1, Playwright Python disponible |

## 3. Search Console (reproducido desde los CSV originales)

Ver `gsc-reconciliation.md` para el detalle. Resumen:

| Dimensión | Ecuador | Global |
|---|---|---|
| Gráfico (propiedad), 7 jul–6 oct, 92 días | 193 clics / 3.217 impr., CTR 6,00 %, pos. 16,03 | 222 / 4.535, CTR 4,90 %, pos. 15,11 |
| Tabla páginas | 18 / 1.301 (66 filas) | 224 / 5.025 (721 filas) |
| Consultas visibles | 18 / 1.083 (190 filas) | 20 / 1.371 (235 filas) |
| Últimos 28 días (9 sep–6 oct) | 74 / 1.161, CTR 6,37 %, pos. 14,97 | 82 / 1.509 |
| 28 días anteriores (12 ago–8 sep) | 66 / 1.064, CTR 6,20 %, pos. 18,65 | 75 / 1.489 |

Indexación (`Paginas-no-index`, "Todas las páginas conocidas"): primer conteo completo 2026-07-23 = 1.863
indexadas / 534 sin indexar; último 2026-10-03 = 1.293 / 1.263. Caída neta −570 (−30,6 %). Escalones: 18 sep −108,
21 sep −407. Motivos: 571 rastreada sin indexar, 370 noindex, 230 descubierta sin indexar, 70 redirección, 15
duplicada sin canónica, 7 404 — suman 1.263, igual al total sin indexar.

## 4. Catálogo (`data/`)

| Dato | Valor |
|---|---|
| Productos | 2.100 (2.036 `is_ai_optimized=true`, 64 retenidos) |
| Categorías | 37 (todas con ruta `/categorias/<slug>/`) |
| Posts | 40 |
| `quality_score` ausente | 298 (248 indexables) |
| `quality_score` = 0 explícito | 5 (0 indexables) |
| Nombres con "Oferta" / "Nuevo" | 145 / 61 |
| Grupos de nombre duplicado | 67 |
| Grupos de `seoTitle` duplicado | 2: Mug Star (`-8986`, `-13197`), Paraguas 27 (`paraguas-27-9218` indexable, `paraguas-27-5913-3858` retenido) |
| Productos con imagen en Cataprom (proveedor) / placeholder | 2.011 / 11 |
| Rama de dedupe por sufijo numérico (`productos/[slug]`) | 0 casos activos hoy (la condición `baseSlug` + mismo nombre no coincide con ningún producto) |
| Corrupciones "Cuenca" | 30: `Cuencadad` ×27, `Cuencaficación`, `Cuencaente`, `Cuencadez` |
| `business-facts.ts` | Comentario obsoleto (2.185 / 2.101) y etiqueta "+2.100 productos"; dato real publicable 2.036 |

Categorías no paginadas: todas tienen ≤12 productos (reflectivos 6, calculadoras 5, camisetas 3, golf 9, gorras 9,
antimicrobianos 10, termos 8), así que `CategoryProductsGrid` las muestra completas en HTML estático.

## 5. Triage de cohorte (en vivo, 47 URLs)

`reports/seo-improvement-2026-10-09/indexing-triage-baseline.csv`. Hallazgos confirmados:

- Los 64 retenidos sirven `noindex, nofollow` con **canonical al home** heredado del layout (12/12 muestreados).
- La 404 (`/productos/no-existe-control-404/`, `/categorias/`) emite dos meta robots y **canonical al home**.
- `/categorias/` responde 404 (padre sin índice).
- Tres artículos con 2 H1 (ecológicos, bolígrafos, cuánto cuestan).
- `/productos-promocionales-colombia/cali/` → 301 de un salto a `/productos-promocionales-ecuador/`.
- Hubs, ciudades, categorías, paginación y controles: 200, `index, follow`, canonical propia, en sitemap.
- Los productos de control tienen 1 enlace HTML entrante (su página de categoría), profundidad 2–3.

`motivo_gsc` y `canonical_elegida_google` quedan como **desconocidos**: los CSV no traen URLs por motivo y no hay
acceso a Inspección de URL.
