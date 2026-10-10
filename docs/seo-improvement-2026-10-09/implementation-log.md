# Registro de implementación — 2026-10-09

Todo es local y sin commit (el prompt pide cambios revisables, sin commits ni deploy). Rama `main`, base `0ef0292`.

## Fase 0 — baseline y diagnóstico

- `scripts/seo-improvement/reconcile-gsc.mjs` → `reports/seo-improvement-2026-10-09/gsc-reconciliation.json`. Reproduce
  exactamente los totales del plan (Ecuador 193/3.217; global 222/4.535; −570 indexadas; motivos = 1.263).
- `scripts/seo-improvement/indexing-triage.mjs` → `indexing-triage-baseline.csv` (47 URLs en vivo). Confirmó retenidos con
  canonical al home, 404 con canonical al home, 3 artículos con 2 H1, `0ef0292` sin desplegar.
- Cronología: sin commits ni cambios de datos entre el 27 jul y el 9 oct (`docs/.../gsc-reconciliation.md` §4).
- Docs: `baseline.md`, `gsc-reconciliation.md`.

## Lote 1 — datos y plantillas

| Tarea | Archivos | Resultado |
|---|---|---|
| C01 corrupción "Cuenca" | `data/blog/content/{index,fase3,additions}.js` | 30 reemplazos exactos; "Cuenca" ciudad intacta (14+4+5+6 apariciones sin cambio) |
| C02 un H1 por artículo | `data/blog/content/fase3.js`, `scripts/generate-blog-fase3.js` | 3 H1 de cuerpo eliminados (repetían el título); el generador rechaza HTML con `<h1>`; 4 `<article>` sin cerrar cerrados |
| Posts "truncados" | — | Los 5 terminan completos en fuente y en vivo; pendiente obsoleto |
| T01 retenidos | `src/app/productos/[slug]/page.tsx` | `noindex, follow` + canonical propia; rama heurística eliminada (0 casos) |
| T02 ItemList | `src/app/categorias/[slug]/page.tsx`, `pagina/[page]/page.tsx` | Mismo conjunto que la rejilla (24 en página 1, posiciones continuas) |
| T03 entidad y autor | `src/app/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/nosotros/page.tsx`, `src/lib/authors.ts` | Sin `OnlineStore`; publisher por `@id`; Person única con `alternateName` |
| T04 redirects | `public/_redirects`, `netlify.toml` | 2 destinos antimicrobianos con barra final (líneas 59/61 y 2 en netlify.toml); `/categorias` y `/categorias/` → `/regalos-corporativos/` |
| T05 404 | `src/app/not-found.tsx` | Sin canonical; robots coherentes (`noindex` + `noindex, follow`) |
| F01 preload | `src/app/layout.tsx` | Fuera `/images/hero/9781.jpg`; logo `loading="eager"` sin `priority` |
| P01 displayName | `src/lib/product-display.ts` + ProductCard, QuickViewModal, ProductImageGallery, ProductActions, categorías, ItemList | 206 nombres; 104 seoTitle, 52 seoDescription, 29 shortDescription normalizados al render |
| B01 hechos | `src/lib/business-facts.ts`, 10 páginas, `data/categories.json`, `public/llms.txt` | "+2.000"; 48 h único; mínimos/plazos como dependencia; hub con 37 categorías |
| Enlaces legacy | `src/app/productos-promocionales-ecuador/page.tsx` | 5 enlaces a URLs 301 corregidos; `x-default` propio |
| `<main>` anidados | 7 páginas | Sustituidos por `<div>` |

## Lote 2 — móvil y cotización

| Tarea | Archivos | Resultado |
|---|---|---|
| U01 hero recortado | categoría base/paginada, `HomePageClient.tsx` | `grid-cols-1` + `min-w-0` + fuente por `vw`; H1 del home sin `reveal` (visible sin JS) |
| U02 CTA y banner | `CookieConsent.tsx`, `WhatsAppButton.tsx`, `Header.tsx`, `globals.css`, `ProductImageGallery.tsx`, producto | Banner 187 → 129 px (375) con enlace a política; botón flotante sobre la altura real del banner (`--cookie-banner-h`); oculto con menú abierto; CTA tras el H1; galería 4:3 en móvil |
| U03 táctil | ProductCard, ProductActions, banner, pestañas del home | `min-h-[44px]` en controles prioritarios |
| P03 mensaje | `src/lib/whatsapp.ts` | Nombre limpio + ref + URL + cantidad/ciudad/fecha/arte; evento `whatsapp_click` con `page_type`, `placement`, `product_ref`, `product_category` (sin PII) |
| `.reveal` | `layout.tsx`, `globals.css` | Secciones de la primera pantalla ya no se ocultan tras cargar |

## Lote 3 — producto y enlaces

| Tarea | Archivos | Resultado |
|---|---|---|
| P04 repetición | producto | Fuera el acordeón que repetía descripción/características/usos; "Calidad Premium" y "100% Personalizable" retirados; técnicas en condicional |
| N02 relacionados | `src/lib/related-products.ts` | 8 alternativas deterministas |
| G3 categorías | `src/lib/related-categories.ts` | Familias semánticas |
| N01 landings | `LandingProductShortlist.tsx`, `src/lib/landing-products.ts` | 12 fichas reales en audífonos, parlantes y soportes |
| N06 blog | `src/lib/category-blog-links.ts` | 16 → 22 categorías |
| C03 cifras | contenido del blog, `posts.json` | 6 cifras sin fuente reescritas; "precios reales" → "rangos de precio orientativos"; años 2025 sueltos fuera de títulos |
| G01 Quito | `data/geo-data.js` | H1/title con "Regalos Corporativos"; claim de stock inmediato retirado |
| F02 imágenes | `public/images/...`, `src/lib/category-icons.ts` | Íconos 73,8 → 2,7 MB; hero 5×~2 MB → 67–86 KB; fondo de regalos 1,84 MB → 49 KB; 4 imágenes del blog 5,6 MB → 0,62 MB; 3 íconos rotos del home corregidos |
| Payload | `toCardProduct` | Ficha de producto 158,7 → 132,8 KB tras pasar solo los campos que usa la tarjeta |
| T06 sitemap | `src/app/sitemap.ts` | `lastmod` 2026-10-09 solo en 8 páginas con cambios de contenido |

## Pruebas ejecutadas (reales)

| Comando | Resultado |
|---|---|
| `pnpm exec tsc --noEmit` | 0 errores (ejecutado tras cada lote) |
| `pnpm build` | OK (4 builds; avisos `no-img-element` preexistentes) |
| `node scripts/run-seo-tests.mjs` | **60 OK, 0 FAIL** (`reports/.../seo-test-after.txt`). La sección nueva [5] con 10 reglas falló 8/8 contra el export anterior (`seo-test-before-old-out.txt`) |
| `pnpm run seo:links` | 0 enlaces rotos (605 revisados) |
| `pnpm run seo:redirects` | 0 redirects al home, 0 destinos inexistentes |
| `pnpm run seo:indexability` | 0 huérfanas; regeneró `reports/internal-link-graph.csv`, `local-indexability-inventory.csv`, `sitemap-indexability-audit.csv` (diff revisado: cambios por los nuevos enlaces) y `redirect-map.csv` (nuevas reglas) |
| `scripts/seo-improvement/link-graph.mjs` | Productos con 1 enlace entrante 1.853 → 29; mediana 1 → 9; máx. 222 → 30; ≥4 clics 432 → 160; 0 huérfanos |
| `scripts/seo-improvement/mobile-check.py` (Playwright, 320/375/390/768/1366) | 0 elementos fuera del viewport en las 5 páginas × 5 anchos; banner 129–145 px; rechazar = `denied` persistente; menú abierto oculta el flotante |

## Limitaciones y pendientes de verificación

- ~~Re-medición móvil~~ **Hecha después en la sesión UX** (58/58 OK, ver `docs/ux-improvement-2026-10-09/README.md`). Texto original: **Re-medición móvil tras los últimos ajustes** (padding de producto/categoría, galería 4:3, pestañas del home a 320 px):
  NO ejecutada. El sistema detuvo el servidor estático por falta de memoria y no se reinició por indicación del entorno.
  La medición anterior a esos ajustes mostró CTA de producto en y=769 a 375 px (fuera del primer viewport) y viewport de
  333 px en el home a 320. Comando en `NEXT-SESSION.md`.
- Sin CWV de campo ni Lighthouse nuevos; los pesos de imagen son de archivo origen, no bytes transferidos por el CDN.
- Sin acceso a GSC/Netlify: canónica elegida por Google, motivos por URL y cronología de deploy siguen desconocidos.
- `tmp/ux-audit/roadmap.png` apareció sin seguimiento (20:38) y no lo creó esta sesión; no se tocó.
