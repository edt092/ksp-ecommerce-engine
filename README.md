# KS Promocionales — Conversion-Focused Promotional Products Platform

> Full-stack e-commerce platform with an AI-powered product enrichment pipeline, WhatsApp conversion system, and 10+ SEO-targeted landing pages. Built for a promotional products company in Ecuador.

**Live site:** [kspromocionales.com](https://kspromocionales.com)

---

## Overview

KS Promocionales is a production marketing platform designed around one goal: turning organic search traffic into WhatsApp conversations that close as sales. The technical stack supports that by combining a Next.js storefront with a multi-stage Python + AI data pipeline that keeps the catalog enriched and up to date.

Key outcomes delivered:
- AI-generated product descriptions via Gemini API (Claude Haiku as fallback) — zero manual copywriting at scale
- WhatsApp-first conversion flow: every product page drives users to a direct WhatsApp chat
- 10+ category-specific landing pages targeting high-intent keywords in Ecuador
- Automated daily scraping pipeline with deduplication, SEO enrichment, and Neon PostgreSQL sync
- `llms.txt` implemented for AI search visibility (Google AI Overviews, ChatGPT, Perplexity)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Static Export) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS |
| Database | Neon (PostgreSQL — serverless) |
| AI Enrichment | Google Gemini API + Anthropic Claude Haiku (fallback) |
| Analytics | Google Analytics 4 |
| Deployment | Netlify (CDN + CI/CD) |
| Automation | Python 3 + BeautifulSoup + GitHub Actions |
| SEO | next-sitemap, JSON-LD schema, llms.txt, security headers |

---

## Features

### Storefront
- **Product catalog** with category filtering, quick-view modal, and image gallery
- **WhatsApp CTA on every page** — direct link to WhatsApp Business with pre-filled product message
- **Storytelling hero** — conversion-optimized above-the-fold section
- **Blog with product carousel** — content marketing integrated with product discovery
- **Cookie consent** — GDPR-compliant consent banner
- **Google Analytics 4** — event tracking for key conversion touchpoints

### SEO Architecture
- **10+ dedicated landing pages** targeting high-intent keywords:
  - `/articulos-promocionales/` · `/merchandising-corporativo/` · `/regalos-corporativos/`
  - `/audifonos-promocionales/` · `/parlantes-bluetooth/` · `/soportes-para-celular/`
  - `/material-publicitario/` · `/catalogos-digitales/`
  - `/productos-promocionales-ecuador/[ciudad]/` — city-level geo pages
- JSON-LD structured data on all product and category pages
- `llms.txt` — machine-readable site summary for AI crawler visibility
- Security headers via `netlify.toml` (HSTS, CSP, X-Frame-Options, Permissions-Policy)
- Auto-generated XML sitemap via `next-sitemap`

### Automation Pipeline

```
promo-scraper/ejecutar_pipeline_completo.py
  ├── scraper_completo_catalogos.py   → scrapes full supplier catalog
  ├── scraper_subcategorias.py        → deep-scrapes subcategory pages
  ├── generador_seo_avanzado.py       → calls Gemini API to write unique descriptions
  │     └── Claude Haiku fallback     → activates on Gemini 503/rate limit
  ├── merge_con_datos_existentes.py   → merges new products, deduplicates
  └── convertir_a_nextjs_optimizado.py → outputs products.json + categories.json
```

GitHub Actions runs this pipeline daily. Updated data commits back to the repo, triggering a Netlify rebuild automatically.

### Database (Neon PostgreSQL)
- Product data synced to a serverless Neon PostgreSQL instance
- `scripts/sync-from-neon.js` — pulls latest product state from the database for local dev
- Enables product state persistence independent of the static build cycle

---

## Project Structure

```
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── productos/[slug]/           # Product detail pages (SSG)
│   │   ├── categorias/[slug]/          # Category pages
│   │   ├── articulos-promocionales/    # SEO landing page
│   │   ├── merchandising-corporativo/  # SEO landing page
│   │   ├── regalos-corporativos/       # SEO landing page
│   │   ├── audifonos-promocionales/    # SEO landing page
│   │   ├── productos-promocionales-ecuador/[ciudad]/  # Geo pages
│   │   ├── blog/                       # Blog listing + posts
│   │   └── sitemap.js                  # Dynamic sitemap
│   ├── components/                     # Reusable UI components
│   │   ├── StorytellingHero.jsx        # Conversion-focused hero
│   │   ├── WhatsAppButton.jsx          # Persistent WhatsApp CTA
│   │   ├── QuickViewModal.jsx          # Product quick-view
│   │   ├── ProductImageGallery.jsx     # Product image viewer
│   │   └── CookieConsent.jsx           # GDPR consent banner
│   └── lib/                            # Shared utilities
├── data/
│   ├── products.json                   # Full product catalog (updated by pipeline)
│   ├── categories.json                 # Category definitions
│   └── geo-data.js                     # Location data for city pages
├── promo-scraper/                      # Python scraping & AI enrichment pipeline
│   ├── ejecutar_pipeline_completo.py   # Orchestrator — run this
│   ├── scraper_completo_catalogos.py   # Product scraper
│   ├── generador_seo_avanzado.py       # AI description generator (Gemini + Claude)
│   └── requirements.txt
├── scripts/                            # Node.js utility scripts
│   ├── split-products-by-category.js  # Pre-build: splits catalog by category
│   ├── sync-from-neon.js              # Syncs from Neon PostgreSQL
│   └── dedupe-products.js             # Deduplication utility
├── public/
│   ├── llms.txt                        # AI crawler visibility file
│   ├── robots.txt
│   └── _redirects                      # Netlify redirect rules
└── netlify.toml                        # Build config + security headers
```

---

## Local Development

**Requirements:** Node.js 18+, npm, Python 3.9+

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in: NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SITE_URL

# Run development server
npm run dev
```

### Running the scraping pipeline

```bash
cd promo-scraper
pip install -r requirements.txt

# Set your API keys
export GEMINI_API_KEY=your_key
export ANTHROPIC_API_KEY=your_key  # optional fallback

# Run full pipeline (scrape → enrich with AI → output products.json)
python ejecutar_pipeline_completo.py
```

### Sync from Neon database

```bash
# Set DATABASE_URL in .env, then:
node scripts/sync-from-neon.js
```

---

## Automation Architecture

```
GitHub Actions (cron: daily)
        │
        ▼
ejecutar_pipeline_completo.py
  ├── Scrapes supplier catalog (BeautifulSoup)
  ├── Generates unique descriptions (Gemini API → Claude fallback)
  ├── Deduplicates and merges with existing data
  └── Outputs products.json + categories.json
        │
        ├── Commits data → triggers Netlify rebuild
        │
        ▼
Netlify Build
  ├── prebuild: split-products-by-category.js
  ├── next build → static export (SSG)
  ├── postbuild: next-sitemap
  └── Deploy to global CDN
```

---

## Environment Variables

See `.env.example` for the full list. Required for production:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business number (e.g. `593999999999`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_SITE_URL` | Production URL (`https://kspromocionales.com`) |
| `GEMINI_API_KEY` | Google Gemini API — used by the scraping pipeline only |
| `ANTHROPIC_API_KEY` | Claude Haiku — fallback when Gemini hits rate limits |

---

## License

Private project — all rights reserved. Code samples available for portfolio review purposes.
