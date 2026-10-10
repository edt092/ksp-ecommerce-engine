# Plan de acción y ledger — mejora SEO 2026-10-09

Estados: `confirmado` · `corregido` · `descartado` · `requiere_dato` · `requiere_decision` · `pendiente_medicion`.
"Corregido" = cambio local verificado con build y pruebas; **no desplegado**.

| ID | Prio | Tarea | Estado | Evidencia / prueba | Dependencia | Archivos |
|---|---|---|---|---|---|---|
| D01 | P0 | Reconciliar GSC y cronología de septiembre | confirmado (parcial) | Totales reproducidos; sin cambios de código/datos 27 jul–9 oct | Historial Netlify, tipo de propiedad GSC | `gsc-reconciliation.md`, `scripts/seo-improvement/reconcile-gsc.mjs` |
| D02 | P0 | Triage 571/230/370 por URL | requiere_dato | Cohorte de 47 URLs en vivo; motivo por URL desconocido | Export GSC por motivo | `indexing-triage-baseline.csv`, `scripts/seo-improvement/indexing-triage.mjs` |
| C01 | P1 | 30 palabras corruptas | corregido | Prueba [5] "sin Cuencadad…": 16 páginas → 0 | — | `data/blog/content/*.js` |
| C02 | P1 | Un H1 por artículo | corregido | 3 → 0 artículos con >1 H1; generador valida | — | `fase3.js`, `generate-blog-fase3.js` |
| T01 | P1 | Retenidas: noindex,follow + canonical propia | corregido | 128 problemas → 0 | — | `productos/[slug]/page.tsx` |
| T02 | P1 | ItemList = listado | corregido | 28 desajustes → 0 | — | categorías |
| T03 | P1 | Entidad global y publisher | corregido | 42 conflictos de `@id` → 0 | — | `page.tsx`, `blog/[slug]`, `authors.ts` |
| T04 | P1 | Cadenas legacy | corregido | Destinos con barra; 0 destinos sin barra en `_redirects` | Deploy para verificar en vivo | `_redirects`, `netlify.toml` |
| U01 | P1 | Hero móvil | corregido | 0 elementos fuera del viewport a 320/375/390/768/1366 | — | categorías, home |
| U02 | P1 | CTA móvil y cookies | corregido / pendiente_medicion | Banner −31 %; flotante sobre banner; CTA de producto tras H1 + galería 4:3 (re-medición pendiente) | Servidor local para re-medir | producto, banner, flotante |
| U03 | P1 | Menú, burbuja, táctil | corregido | Flotante oculto con menú; 44 px en controles prioritarios | — | Header, ProductCard… |
| B01 | P1 | Cifras, SLA, MOQ, plazo coherentes | corregido / requiere_dato | Fuente única; cifras por confirmar (B1–B5) | Negocio | `business-facts.ts`, 10 páginas, `categories.json`, `llms.txt` |
| P01 | P1 | displayName | corregido | Prueba [5]: 190 H1 con token → 0 | — | `product-display.ts` + componentes |
| P02 | P1 | Técnicas por producto | corregido (condicional) | Texto condicional en todas las fichas; sin datos por SKU | Fichas proveedor | producto |
| P03 | P1 | Cotización junto a datos de compra | corregido | Bloque "Cómo cotizar" + mensaje con ref/URL/cantidad/ciudad/fecha | — | producto, `whatsapp.ts` |
| N01 | P1 | Audífonos con productos reales | corregido | 0 → 12 enlaces a fichas (también parlantes y soportes) | — | landings |
| P04 | P2 | Ficha verificable, piloto 20–30 SKUs | requiere_dato | 30 candidatos con señal GSC; repetición eliminada | Fichas proveedor (P1) | `product-pilot-candidates.csv` |
| P05 | P2 | Mug Star / Paraguas 27 | requiere_dato / requiere_decision | Comparación visual hecha | Proveedor / aprobación | `duplicates-and-pending-products.csv` |
| N02 | P2 | Relacionados deterministas | corregido | Mediana de enlaces entrantes 1 → 9 | — | `related-products.ts` |
| N03 | P2 | Profundidad | corregido (parcial) | ≥4 clics 432 → 160 | Subhubs (C-03) para seguir bajando | — |
| N04 | P2 | Piloto 3–5 subhubs | requiere_decision | Candidatos con inventario actual | Autorización de alcance | `subcategory-candidates.csv` |
| N05 | P2 | Kits y ferias | requiere_decision | — | Ruta y selección | `intent-map.csv` |
| N06 | P2 | Guías bidireccionales | corregido | 16 → 22 categorías | Guías nuevas para bebidas | `category-blog-links.ts` |
| C03 | P2 | Cifras sin fuente en guías | corregido (parcial) | 6 cifras citadas por el plan reescritas; 109 frases en auditoría | Revisión editorial | `blog-claims-audit.csv` |
| C04 | P2 | Metadatos diferenciados y Twitter | corregido | Categorías, paginación, 404 y retenidos con OG/Twitter propios | — | metadata |
| C05 | P2 | Intención de hubs y drinkware | requiere_dato | Mapa de hipótesis | GSC consulta→página | `intent-map.csv` |
| F01 | P2 | Preload sin uso | corregido | 2.263 páginas → 0 | — | `layout.tsx` |
| F02 | P2 | Comprimir imágenes | corregido | −96 % íconos; hero, fondo y blog convertidos | Verificación visual en producción | `public/images` |
| F03 | P2 | TTFB y caché | requiere_dato | No medido (sin acceso a regiones/CDN) | Medición tras deploy | — |
| F04 | P2 | Piloto imágenes locales del proveedor | requiere_dato | — | Permiso Cataprom | — |
| G01 | P2 | Quito y ciudades | corregido (Quito) / requiere_dato (resto) | H1/title Quito | GSC por ciudad | `geo-data.js` |
| G02 | P2 | Identidad autor/empresa | corregido | Person única | Dirección real (C-08) | `authors.ts` |
| T05 | P2 | 404 y /categorias/ | corregido | 404 sin canonical; `/categorias/` → 301 | Deploy | `not-found.tsx`, `_redirects` |
| T06 | P2 | lastmod | corregido (parcial) | Solo páginas editadas | Fechas reales de cambio por producto | `sitemap.ts` |
| P06 | P2 | Portadas, Mercury/Strike, novedades | requiere_decision / requiere_dato | Sin cambios | Negocio / proveedor | CSV de pendientes |
| X01–X03 | P3 | Búsqueda, técnicas, precios reales | requiere_dato | — | Atributos y fuente de precios | — |
| H01–H02 | Humano | Datos proveedor, testimonios, perfiles | requiere_dato | — | — | `business-data-needed.md` |
| X04 | Fuera | GBP, CSP, IndexNow | descartado (alcance) | — | — | — |

## Próximo lote concreto

1. Re-medir móvil con Playwright (comando en `NEXT-SESSION.md`) y ajustar si el CTA de producto no entra en el primer viewport a 375 px.
2. Con la respuesta del usuario: consolidar `paraguas-27-5913-3858` (C-01) y decidir subcategorías (C-03).
3. Tras el deploy: verificación en vivo (checklist en `deploy-and-measurement.md`) y export GSC por motivo para cerrar D02.
