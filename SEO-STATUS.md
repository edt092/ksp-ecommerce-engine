# SEO Status — kronosolopromocionales.com
**Última actualización:** 2026-04-24 (sesión 2)
**Auditoría base:** 2026-04-06 → 55/100
**Re-auditoría:** 2026-04-14 → 58/100
**Proyectado post-deploy (fixes en source):** ~72/100

---

## HECHO ✅

### Críticos resueltos

| Fix | Archivo | Commit |
|-----|---------|--------|
| `offers.price` + `priceSpecification` en Product schema | `src/app/productos/[slug]/page.jsx` | April 9 |
| Post de México ("mug-metálico-en-mexico") eliminado | `data/blog/posts.json` + content | April 8 |
| `src/app/sitemap.js` creado con rutas estáticas + productos + blog + categorías | `src/app/sitemap.js` | April 8–9 |
| `Content-Security-Policy` header añadido a `netlify.toml` | `netlify.toml` | April 10 |
| Autores de blog unificados a "Claudia González" en `posts.json` | `data/blog/posts.json` | April 10 |
| Fake claims eliminados ("500+ empresas", "15+ años", widget 5 estrellas) | `src/app/HomePageClient.jsx` | April 10 |

### Altos resueltos

| Fix | Archivo | Commit |
|-----|---------|--------|
| `/contacto` añadido a nav de escritorio | `src/components/Header.jsx:17` | April 8 |
| Bug WhatsApp href en categorías → template literal + encodeURIComponent | `src/app/categorias/[slug]/page.jsx:146` | April 8 |
| Trailing slashes en todos los canonicals (12 archivos) | múltiples `page.jsx` | April 8–9 |
| Script GA duplicado (`G-XXXXXXXXXX`) eliminado de `WhatsAppButton.jsx` | `src/components/WhatsAppButton.jsx` | April 8 |
| `ItemList` usa `item: { '@type': 'Product' }` en lugar de `url:` | `src/app/categorias/[slug]/page.jsx` | April 9 |
| `author.url` añadido a BlogPosting schema | `src/app/blog/[slug]/page.jsx` | April 9 |
| Hreflang sitewide es-EC / es-CO / x-default | `src/app/layout.jsx:76–78` | April 8 |
| Alt text descriptivo y único en las 5 imágenes del hero | `src/components/HeroBanner.jsx:175–236` | April 8 |

### Performance resuelto

| Fix | Detalle | Commit |
|-----|---------|--------|
| `products.json` movido de HomePageClient (client) a `page.jsx` (server) | Ya no genera 1.9MB de bundle cliente | April 10 |
| `framer-motion`, `konva`, `react-konva`, `use-image` eliminados | `package.json` | April 10 |
| `DigitalAdvisorChat.jsx`, `LogoEditor.jsx`, `LogoEditorModal.jsx` eliminados | componentes muertos | April 10 |
| Cookie consent banner (Consent Mode v2) creado y conectado | `src/components/CookieConsent.jsx` + `layout.jsx` | April 9 |

### Dual-slug resuelto (completo)

| Fix | Archivo | Commit |
|-----|---------|--------|
| 301 redirects para URLs de México, WordPress y slugs sin ID | `public/_redirects` | April 23 |
| `noindex` + canonical para productos con slug-ID duplicado | `src/app/productos/[slug]/page.jsx:26–38` | April 23 |
| **256 pares bulk de 301s generados** (512 líneas) — dual slugs del catálogo completo | `public/_redirects` | April 24 |

### Mobile hero imagen resuelto

| Fix | Archivo | Sesión |
|-----|---------|--------|
| Añadida sección `flex lg:hidden` con 3 cards de producto (96/128/96px, tilted) | `src/components/HeroBanner.jsx:161–202` | April 24 |
| Card central incluye `priority` para LCP móvil y acento dorado | `HeroBanner.jsx:175–189` | April 24 |

---

## PENDIENTE ❌

### CRÍTICO — Máxima prioridad

| Problema | Archivo / Ubicación | Notas |
|----------|---------------------|-------|
| **Build + deploy** — confirmar que los fixes del source están live | — | Último commit: April 24. Sin confirmación de deploy exitoso. Correr `npm run build` + Netlify deploy |

### ALTO — Contenido (impacto de ranking a largo plazo)

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **85% blog posts thin** (28/33 bajo 1,500 palabras, mediana ~1,048) | `data/blog/posts.json` + content | E-E-A-T, thin content penalty |
| **100% category pages thin** (50–75 palabras de prose) | `data/categories.json` — falta campo `editorial` | 34 categorías sin texto descriptivo suficiente |
| **Category page HTML 469KB** — dataset completo de productos en RSC payload | `src/app/categorias/[slug]/page.jsx` | Afecta INP y TTFB |
| **Desktop horizontal overflow +291px** | `src/components/Header.jsx:63` (marquee) y `src/components/RealProductsGallery.jsx` (2 marquees) | CLS y UX en 1280px |

#### Blog posts más cercanos al umbral (expandir primero):
- `cucharas-y-tenedores-set-cubiertos` — 1,448 palabras
- `regalos-corporativos-elegantes` — 1,383 palabras
- `marketing-sostenible-productos-ecologicos` — 1,300 palabras
- `productos-por-mayor-mayoreo-guia-completa` — 1,322 palabras
- `colores-psicologia-merchandising` — 1,142 palabras

### MEDIO — Técnico pendiente

| Problema | Archivo | Fix sugerido |
|----------|---------|-------------|
| Sin `Cache-Control: immutable` para `/_next/static/*` | `netlify.toml` | Añadir `[[headers]]` con `max-age=31536000, immutable` |
| `randomuser.me` sigue en `remotePatterns` | `next.config.js:31` | Eliminar línea |
| H1 del hero sigue en componente `'use client'` — no está en HTML inicial | `src/components/HeroBanner.jsx` | Extraer H1 y CTAs a wrapper server component |
| Ecuador y Colombia pages casi idénticas (>60% contenido duplicado) | `src/app/productos-promocionales-*/page.jsx` | Añadir 2 secciones únicas por país (pagos, logística, casos locales) |
| Títulos de página sobre el límite: contacto (80c), blog (71c), catálogos (74c) | páginas respectivas | Ver sugerencias en `ACTION-PLAN.md` |
| H2s de productos sin nombre del producto (`"La Historia"`, `"Características"`) | `src/app/productos/[slug]/page.jsx` | Cambiar a `"Historia del ${product.name}"`, etc. |
| `blog/entradas/` directorio huérfano — puede indexarse como thin page | `src/app/blog/entradas/` | Añadir redirect o `noindex` |
| `streetAddress` ausente en LocalBusiness schema | `src/app/layout.jsx` | Añadir `streetAddress` o cambiar a `serviceArea` |
| Imágenes de blog desde Unsplash/catalogospromocionales — descalifica Article rich results | `data/blog/posts.json` | Migrar a `/public/images/blog/` |
| Widget "EXCELENTE" 5 estrellas sin link a plataforma real | `src/app/HomePageClient.jsx` | Linkear a Google Business Profile |
| H1 de categorías es solo el nombre (`"Tecnología"`) sin modificador | `src/app/categorias/[slug]/page.jsx` | Cambiar a `"${category.name} Promocional Personalizado"` |

### BAJO — Backlog

| Problema | Fix |
|----------|-----|
| No hay `llms.txt` para AI crawlers | Crear `public/llms.txt` con estructura del sitio |
| No hay política de AI bots en `robots.txt` (GPTBot, ClaudeBot, PerplexityBot) | Añadir reglas explícitas de allow/deny |
| No hay secciones FAQ en ninguna página (AI citation readiness: 31/100) | Añadir FAQ a `nosotros` y `contacto` con `FAQPage` schema |
| OG images de blog son todas la misma imagen sitewide | Usar `post.image` como `og:image` en `blog/[slug]/page.jsx` |
| `Syne_Mono` solo se usa para contadores numéricos | Eliminar la familia — reemplazar con `font-mono` de Tailwind |
| `wordCount` + `articleSection` no añadidos a BlogPosting schema | `src/app/blog/[slug]/page.jsx` |
| `viewport-fit=cover` ausente para iOS notch | `src/app/layout.jsx` — exportar `viewport` object |
| Bios de autores (Andrés Felipe Morales, Camila Salazar) sin LinkedIn ni URL | `data/blog/posts.json` |

---

## Proyección de score

| Fase | Fixes | Score estimado |
|------|-------|---------------|
| Source actual (sin deploy confirmado) | — | ~58/100 |
| Post-deploy (fixes April 8–24 live) | Mobile hero + 256 dual-slug 301s incluidos | ~70/100 |
| + Desktop overflow fix | Marquees `Header.jsx` + `RealProductsGallery.jsx` | ~72/100 |
| + Blog posts expandidos (top 8) + category editorial | Altos de contenido | ~78/100 |
| + Fixes medios técnicos | M1–M12 | ~84/100 |
| + Backlog completo | Todos | ~87/100 |

---

## Orden de acción recomendado

1. `npm run build` + Netlify deploy — activar todos los fixes de source (incluye mobile hero + 256 dual-slug 301s)
2. Corregir horizontal overflow en marquees (`Header.jsx:63`, `RealProductsGallery.jsx`)
3. Añadir campo `editorial` a `categories.json` para las 34 categorías
4. Expandir 8 blog posts más cercanos al umbral de 1,500 palabras
5. Cache-Control headers en `netlify.toml`
6. Limpiar `next.config.js` (randomuser.me) y fixes medios restantes

---

*Generado: 2026-04-24 | Basado en FULL-AUDIT-REPORT.md (April 6) + re-auditoría April 14 + revisión de commits hasta April 24*
