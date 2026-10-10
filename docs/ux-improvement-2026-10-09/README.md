# Mejora UX/UI — 2026-10-09

Ejecución de `auditoria_uxui_kspromocionales.md`
(`C:\Users\Dagon\Desktop\MIS PROYECTOS PERSONALES\SITIOS_WEB\UX-UI-ANALISI-GENERAL\UX-UI-KRONOSOLOPROMOCIONALES.COM\UX-UI-ANALISI_09-10-2026`).
Se aplicó sobre el árbol de trabajo que ya tenía los cambios SEO del mismo día (`docs/seo-improvement-2026-10-09/`).
Todo local, **sin commit ni deploy**.

Estados: `corregido` (local, con build y pruebas) · `parcial` · `requiere_decision` · `requiere_dato` · `no_aplicado`.

## Registro de evidencias de la auditoría (E01–E14)

| ID | Hallazgo | Estado | Qué se hizo |
|---|---|---|---|
| E01 | Plazos de respuesta distintos (inmediata/24/48 h) | corregido | Una sola fuente (`business-facts.ts`): 48 h. Se eliminaron "24 h", "garantizada" e "inmediata" (sesión SEO, B01) |
| E02 | Mínimos de mugs 100 vs 24 | corregido (condicional) | Mínimos publicados como dependencia "se confirma en la cotización" hasta tener datos por SKU |
| E03 | Inicio del plazo de producción contradictorio | corregido (condicional) | `leadTimeAnswer`: depende de técnica, cantidad y aprobación del arte; envío aparte |
| E04 | "Ordenar" cambia el selector pero no el orden | corregido | Selector falso retirado; orden A–Z/Z–A real sobre toda la categoría en `/buscar/?categoria=…&orden=…` (enlace desde cada categoría) |
| E05 | Sin búsqueda | corregido (sin facetas) | `/buscar/`: nombre, referencia y sinónimos; filtro por categoría. Facetas por material/técnica: sin datos verificados → no se crearon |
| E06 | Story antes del CTA; técnicas genéricas | corregido / parcial | CTA tras el H1; técnicas en condicional; datos comerciales por SKU → `requiere_dato` |
| E07 | Salida a WhatsApp sin expediente ni cantidades | parcial | Mensaje con nombre, ref., URL, cantidad, ciudad y fecha; lista multiproducto `/cotizacion/`. Sin backend: no hay "solicitud recibida" (ver UX-06) |
| E08 | Mega-menú solo con ratón | corregido | Clic/Enter/Espacio, `aria-expanded`/`aria-controls`, Escape devuelve el foco, cierre al salir |
| E09 | Vista rápida sin semántica de diálogo | corregido | `role=dialog`, `aria-modal`, `aria-labelledby`, cierre nombrado, foco inicial, Tab contenido, retorno del foco |
| E10 | Imagen y banner desplazan la acción; flechas solo hover | corregido | Galería 4:3/`contain` en móvil, banner compacto, flechas visibles en táctil y con foco, 44 px |
| E11 | `whatsapp_click` no es conversión | parcial | Eventos diferenciados (ver Medición). La vinculación con CRM requiere sistema comercial → `requiere_decision` |
| E12 | Cookies sin reapertura | corregido | "Preferencias de cookies" en el pie reabre el banner; Rechazar revoca en la sesión |
| E13 | CTA de catálogo con icono de descarga que abre mailto | corregido | "Pedir catálogo por correo" con icono de correo, correo visible y WhatsApp alternativo; láminas en HTML con alt descriptivo y rótulo de temporada |
| E14 | Colombia | no_aplicado | Mercado no confirmado: no se añadió moneda, pagos ni cobertura (la auditoría lo condiciona) |

## Tickets (UX-01 – UX-14)

| Ticket | Estado | Archivos | Notas |
|---|---|---|---|
| UX-01 SLA/mínimos/plazos | corregido (condicional) | `business-facts.ts`, 10 páginas | Cifras reales pendientes del negocio (`docs/seo-improvement-2026-10-09/business-data-needed.md` B1–B3) |
| UX-02 Orden real | corregido | `src/lib/catalog-search.ts`, `src/app/buscar/*`, categorías | `Intl.Collator('es')`, orden antes de paginar, URL + Atrás |
| UX-03 Menú por teclado | corregido | `Header.tsx` | También drawer: `inert` cerrado, foco al abrir/cerrar, Escape, 44 px |
| UX-04 Datos por SKU | requiere_dato | — | 30 SKUs candidatos en `reports/seo-improvement-2026-10-09/product-pilot-candidates.csv` |
| UX-05 Jerarquía de ficha y CTA móvil | corregido | producto, `ProductActions.tsx`, galería | Re-medición móvil pendiente (servidor detenido por memoria) |
| UX-06 Cotizador multiproducto | parcial (MVP sin backend) | `src/lib/quote-list.ts`, `src/app/cotizacion/*`, `ProductActions.tsx`, `Header.tsx` | Lista con edición/eliminación, cantidad validada, ciudad, fecha (≥ hoy), notas; envío por WhatsApp, correo o copiar. Solo slug+cantidad en `localStorage` (7 días). **No hay persistencia en servidor ni referencia de recepción**: `requiere_decision` (API externa o hosting con servidor) |
| UX-07 Búsqueda y filtros | corregido (búsqueda) / requiere_dato (facetas) | `/search-index.json` (ruta estática), `/buscar/` | Estados de carga, error con reintento, cero resultados con salidas; `role=status`; índice 2.036 productos solo en esa página |
| UX-08 Diálogo y galería | corregido | `QuickViewModal.tsx`, `ProductImageGallery.tsx` | — |
| UX-09 Trazabilidad web→CRM | requiere_decision | — | Sin CRM identificado |
| UX-10 Catálogo | corregido | `CatalogosClient.tsx` | No hay PDF publicado: no se ofrece "Descargar" |
| UX-11 Preferencias de cookies | corregido | `Footer.tsx`, `CookieConsent.tsx` | Muestra el estado actual al reabrir |
| UX-12 Colombia | no_aplicado | — | Condicionado a decisión de mercado |
| UX-13 Movimiento reducido | corregido | `globals.css`, `HomePageClient.tsx` | Sin autoavance del hero; `.reveal` visible; animaciones casi instantáneas |
| UX-14 Seguimiento y recompra | requiere_decision | — | Depende de UX-06 con backend |

## Microcopy aplicado

| Ubicación | Antes | Después |
|---|---|---|
| Ficha, bajo CTA | "Respuesta inmediata" | "Respuesta en 48h" + "Se abrirá WhatsApp con el nombre, la referencia y el enlace de este producto." |
| Tarjeta de producto | "Solicitar Precio" | "Cotizar por WhatsApp" (nombre accesible con el producto) |
| Catálogos | "Solicita tu Catálogo Ahora" + icono descarga | "Pedir catálogo por correo" + correo visible + WhatsApp |
| Lista vacía | — | "Aún no has añadido productos. Explora el catálogo…" |
| Sin resultados | — | "No encontramos productos para esta búsqueda…" + Quitar filtros / Pedir asesoría |
| Error de cantidad | — | "Escribe una cantidad entera desde 1, o déjala vacía si aún no la sabes." |
| Tras abrir WhatsApp | — | "Abrimos WhatsApp con tu lista. Tu solicitud nos llega cuando envías el mensaje…" (no se afirma recepción) |
| Ticker del header | "100% personalizable con tu logo" | "Personalización con tu logo" |
| Cookies | — | Muestra "Ahora: aceptadas/rechazadas" al reabrir |

## Medición (eventos GA4, sin datos personales, bajo Consent Mode)

| Evento | Disparador | Parámetros |
|---|---|---|
| `whatsapp_click` | Cualquier botón de WhatsApp | `page_type`, `placement` (`pdp_primary`, `product_card`, `quick_view`, `floating`, `quote_list`), `product_ref`, `product_category` |
| `quote_item_added` | "Añadir a mi cotización" | `product_ref`, `category`, `origin` |
| `quote_whatsapp_opened` / `quote_email_opened` | Envío de la lista | `items` |
| `quote_validation_error` | Validación falla | `field` (sin el valor) |
| `search_performed` | Búsqueda o filtro aplicado | `result_count`, `has_query`, `has_category` (nunca el texto) |
| `sort_changed` | Cambio de orden | `sort`, `category` |

Un clic o una apertura de WhatsApp **no** es una solicitud recibida ni una venta.

## Accesibilidad adicional

- Contraste: texto legal del pie `white/25` → `white/60`; hover de la tarjeta, blanco sobre naranja (~2:1) → texto oscuro.
- Buscador y cotizador: labels persistentes, `aria-invalid`, mensajes de error enlazados desde un resumen con foco, `role=status` para resultados y confirmaciones.

## Verificación ejecutada

`python scripts/seo-improvement/ux-check.py reports/ux-improvement-2026-10-09/screenshots` (sirve `out/` desde Playwright, sin servidor aparte): **58/58 OK** (`reports/ux-improvement-2026-10-09/ux-check-output.txt`). Incluye: 0 elementos fuera del viewport en home, gorras, producto, buscar, cotización y catálogos a 320/375/390/768/1366; CTA de producto dentro del primer viewport y sobre el banner a 320/375/390 (y=554/596/583); mega-menú, drawer y vista rápida por teclado; búsqueda por sinónimo y referencia; orden A–Z con collation es; Atrás; cero resultados; validación de cantidad/fecha; localStorage solo con slug+cantidad; reapertura de cookies. Además: build OK, `run-seo-tests` 60 OK, `seo:links` 0 rotos.

## Pendiente de verificación

- Contraste completo, zoom 200 % y lector de pantalla: no medidos.
- Prueba con usuarios (formativa 5–6 compradores): planificada en la auditoría, no ejecutada.
