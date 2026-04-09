# SEO Action Plan — kronosolopromocionales.com
**Generated:** 2026-04-06
**Current Score:** 55/100
**Target Score:** 75/100 (achievable in 30 days with Critical + High fixes)

---

## CRITICAL — Fix Before Next Deploy

### C1. Add `offers.price` to Product schema
**File:** `src/app/productos/[slug]/page.jsx`
**Impact:** Unlocks Product rich results for entire product catalog (currently 0% eligible)
**Change:** Add `price: '0'` and a `priceSpecification` block to the `Offer` object. See `FULL-AUDIT-REPORT.md` for the exact corrected block.

### C2. Remove/Unpublish Blog Post Authored by "SEO Agent"
**File:** `data/blog/posts.json` + `data/blog/content/2026-01-09-mug-metalico-vinga-eco-mu-442-impulsa-tu-marca-con-conciencia-ambiental-en-mexico.md`
**Impact:** E-E-A-T — AI-generated post credited to Claudia González; targets Mexico, not Ecuador
**Change:** Delete the `.md` file and remove the corresponding entry from `posts.json`.

### C3. Fix Blog Author Attribution Falsification
**File:** `data/blog/posts.json`
**Impact:** E-E-A-T — All posts display "Claudia González" as author regardless of actual content-file author
**Change:** Audit every `posts.json` entry against its content `.md` file frontmatter. Where the content file lists a different author, either: (a) update `posts.json` to match, or (b) rewrite the content under Claudia's voice and update the content file.

### C4. Remove Fabricated Testimonials from Blog Content
**File:** `data/blog/content/2026-02-02-boligrafos-personalizados-la-mejor-inversion-publicitaria-en-ecuador.md` lines 111-113
**Impact:** E-E-A-T — "Juan Pérez, XYZ Corp." and "María Rodríguez, ABC S.A." are AI placeholders
**Change:** Delete the blockquote testimonials or replace with real client quotes (with permission).

### C5. Create `src/app/sitemap.js`
**File:** Create new — `src/app/sitemap.js`
**Impact:** robots.txt references a sitemap that returns 404; Google cannot discover all pages
**Change:** Create the sitemap function using the template in `FULL-AUDIT-REPORT.md` (Sitemap Analysis section).

### C6. Add Content-Security-Policy header
**File:** `netlify.toml`
**Impact:** Only missing critical security header; affects Google's security scoring
**Change:** Add CSP header to `[[headers]]` block. See draft in `FULL-AUDIT-REPORT.md` (Category 3).

---

## HIGH — Fix Within 1 Week

### H1. Add `/contacto` to desktop navigation
**File:** `src/components/Header.jsx`
**Impact:** The conversion endpoint is unreachable on desktop without this
**Change:** Add `{ name: 'Contacto', href: '/contacto' }` to the navigation array.

### H2. Fix category page WhatsApp href interpolation bug
**File:** `src/app/categorias/[slug]/page.jsx` line 138
**Impact:** WhatsApp messages to category-interested leads send `${category.name}` literally
**Change:**
```jsx
// Before (broken):
href="https://wa.me/593999814838?text=Hola, me interesa la categoría de ${category.name}"
// After (correct):
href={`https://wa.me/593999814838?text=Hola, me interesa la categoría de ${category.name}`}
```

### H3. Fix canonical trailing slash inconsistency
**Files:** `src/app/contacto/page.jsx`, `src/app/blog/page.jsx`, `src/app/catalogos-digitales/page.jsx`, `src/app/productos/[slug]/page.jsx`, `src/app/blog/[slug]/page.jsx`
**Impact:** Canonical/served-URL mismatch; weakens consolidation signals
**Change:** All `alternates.canonical` values must end with `/` to match `next.config.js trailingSlash: true`.

### H4. Remove duplicate GA script from `WhatsAppButton.jsx`
**File:** `src/components/WhatsAppButton.jsx` lines 23-35
**Impact:** Injects a second GA script (`G-XXXXXXXXXX` placeholder) on every page mount; adds main-thread task during hydration
**Change:** Delete the entire `useEffect` block (lines 23-35). GA is already handled in `layout.jsx`.

### H5. Fix `ItemList` ListItem property in category schema
**File:** `src/app/categorias/[slug]/page.jsx`
**Impact:** Google ignores `url:` at the ListItem level — entire ItemList schema produces no rich results
**Change:**
```js
// Before:
{ '@type': 'ListItem', position: idx + 1, url: `${BASE_URL}/productos/${product.slug}/`, name: product.name }
// After:
{ '@type': 'ListItem', position: idx + 1, item: { '@type': 'Product', name: product.name, url: `${BASE_URL}/productos/${product.slug}/` } }
```

### H6. Add `author.url` to BlogPosting schema
**File:** `src/app/blog/[slug]/page.jsx`
**Impact:** Required for Person entity disambiguation in Google Knowledge Graph
**Change:** Add `url: \`${BASE_URL}/nosotros/\`` to the author node in the JSON-LD block.

### H7. Add sitewide hreflang for Ecuador/Colombia
**File:** `src/app/layout.jsx`
**Impact:** Google cannot determine geo-intent for homepage, products, or blog; bi-national business gets no geo signals on 95% of pages
**Change:** Add to root layout metadata:
```js
alternates: {
  languages: {
    'es-EC': 'https://www.kronosolopromocionales.com',
    'es-CO': 'https://www.kronosolopromocionales.com',
    'x-default': 'https://www.kronosolopromocionales.com',
  },
},
```

### H8. Fix hero product image alt text
**File:** `src/components/HeroBanner.jsx`
**Impact:** 5 hero images all have identical generic alt `"Producto promocional"` — zero keyword signal, accessibility failure
**Change:** Add descriptive `alt` field to each entry in the `PRODUCT_IMAGES` array and use it in the `<Image>` component.

### H9. Fix blog keyword tag stuffing
**File:** `data/blog/posts.json`
**Impact:** Mechanical AI-pattern tags are a spam signal; may trigger keyword stuffing assessment
**Change:** Reduce each post to ≤5 unique, genuinely distinct tags. Remove all duplicate prefix variants (`"mejores X"`, `"comprar X"`, `"X 2026"` of the same base phrase).

### H10. Add hero image preload for LCP
**File:** `src/app/layout.jsx`
**Impact:** 3rd-party domain LCP images load without preload hint — most impactful LCP improvement
**Change:** Add in the `<head>` (via `metadata.other` or a custom `layout.jsx` head element):
```html
<link rel="preload" as="image" href="https://catalogospromocionales.com/images/productos/9781.jpg" fetchpriority="high">
```
Update the URL to match whatever `PRODUCT_IMAGES[2].src` (the center/priority card) points to.

---

## MEDIUM — Fix Within 1 Month

### M1. Shorten over-limit title tags
- `contacto/page.jsx`: 80 chars → suggested `"Contacto · Artículos Promocionales Ecuador | KS Promo"` (53 chars)
- `blog/page.jsx`: 71 chars → suggested `"Blog Promocional Ecuador | Marketing y Regalos KS"` (50 chars)
- `catalogos-digitales/page.jsx`: 74 chars → suggested `"Catálogos Digitales Promocionales | KS Promocionales"` (52 chars)

### M2. Fix meta descriptions (over-limit / missing CTA)
- `nosotros/page.jsx`: 193 chars → trim to 155 chars, add `"Conoce nuestra historia. Cotiza hoy."` CTA
- `catalogos-digitales/page.jsx`: 166 chars → trim and add CTA

### M3. Add `Cache-Control` headers for static assets in `netlify.toml`
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=86400, stale-while-revalidate=604800"
```

### M4. Extract static content from `HeroBanner` client component
**File:** `src/components/HeroBanner.jsx`
Create a server-rendered wrapper with the H1, subheading, and CTAs. Move only the `AnimatedCounter` to a client island. This ensures LCP content (H1) is in the initial HTML stream.

### M5. Differentiate Ecuador and Colombia geo pages
**Files:** `src/app/productos-promocionales-ecuador/page.jsx`, `src/app/productos-promocionales-colombia/page.jsx`
Currently near-duplicate. Add ≥2 unique sections per page:
- Ecuador: SRI/RUC invoicing, Quito/Guayaquil delivery carriers, Ecuador-specific event calendar
- Colombia: PSE/Nequi payment options, Bogotá/Medellín logistics, Colombian brand examples

### M6. Add founding year to nosotros page and correct stats
**File:** `src/app/nosotros/page.jsx` + `src/components/HeroBanner.jsx`
The "15+ años" hero stat has no grounding. Add founding year to `nosotros/page.jsx`. If the actual age is less than 15 years, correct `HeroBanner.jsx:11`.

### M7. Link "EXCELENTE" rating widget to real review platform
**File:** `src/app/HomePageClient.jsx` lines 66-86
Change the "Déjanos tu opinión" button to point to Google Business Profile reviews instead of WhatsApp.

### M8. Implement cookie consent banner (LOPDP compliance)
Add a lightweight consent banner (e.g., `next-cookies-consent` or plain JS) that blocks GA initialization until consent. The privacy policy exists but passive consent is not sufficient under LOPDP Article 9.

### M9. Remove or clean `src/app/blog/entradas/` orphan directory
If this directory produces an empty `out/blog/entradas/index.html`, it will be indexed as a thin page. Add a redirect or page with `noindex`.

### M10. Remove stale `randomuser.me` from `netlify.toml` image allowlist
**File:** `netlify.toml` line ~25
Author images migrated to `/images/team/` — `randomuser.me` is no longer used. Remove from `[images].remote_images`.

### M11. Add `streetAddress` to LocalBusiness schema or switch to `serviceArea`
**File:** `src/app/layout.jsx`
Either add `streetAddress` + `postalCode` to the `address` block (for map pin eligibility), or replace with `serviceArea: [{ '@type': 'Country', name: 'Ecuador' }, { '@type': 'Country', name: 'Colombia' }]` for service-area business positioning.

### M12. Fix product and blog page H2s to include keywords
- `src/app/productos/[slug]/page.jsx`: Change `"La Historia"` → `"Historia del ${product.name}"`, `"Características"` → `"Características del ${product.name}"`, `"Casos de Uso"` → `"¿Cómo usar ${product.name} en tu empresa?"`
- `src/app/categorias/[slug]/page.jsx`: Change H1 from just `{category.name}` to `"${category.name} Promocional Personalizado"`

---

## LOW — Backlog

### L1. Dynamic import Konva/react-konva
**File:** `package.json` + wherever Konva is used
`konva` (~200KB) is in production deps. Confirm it's only needed on specific pages and wrap in `dynamic(() => import(...), { ssr: false })`.

### L2. Reduce Google Font families from 4 to 3
**File:** `src/app/layout.jsx`
`Syne_Mono` is used only for animated stat numbers. Replace with Tailwind's `font-mono` (system monospace) to eliminate one font request.

### L3. Add FAQ section for AI citation readiness
Add FAQ sections to `nosotros/page.jsx` and `contacto/page.jsx` answering: minimum order, turnaround, payment methods, file formats for logos, Colombia shipping. Mark up as `FAQPage` schema.

### L4. Add `llms.txt` file
**File:** Create `public/llms.txt`
Helps AI crawlers (ChatGPT, Perplexity, Claude) understand site structure.

### L5. Add AI crawler policy to `robots.txt`
Decide on a policy for GPTBot, ClaudeBot, PerplexityBot, Bytespider. Add explicit allow/deny rules to `public/robots.txt`.

### L6. Add `viewport-fit=cover` for iOS safe areas
**File:** `src/app/layout.jsx`
Export `export const viewport = { viewportFit: 'cover', ... }` to support iPhone notch safe areas.

### L7. Add per-page OG images for blog posts
**File:** `src/app/blog/[slug]/page.jsx`
Currently all blog share previews show the sitewide OG image. Use the post's cover image as `og:image` per post.

### L8. Add `wordCount` and `articleSection` to BlogPosting schema
**File:** `src/app/blog/[slug]/page.jsx`
These strengthen Google News/Discover eligibility.

---

## Score Projection

| Phase | Fixes Applied | Estimated Score |
|-------|--------------|----------------|
| Current | None | 55/100 |
| After Critical fixes | C1–C6 | ~63/100 |
| After Critical + High | C1–C6, H1–H10 | ~73/100 |
| After + Medium | All above + M1–M12 | ~81/100 |
| Full backlog | All | ~86/100 |

---

*Action plan generated: 2026-04-06 by Claude Code SEO Audit*
