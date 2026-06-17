# KS Promocionales

Storefront and data pipeline for a promotional products company in Ecuador. The site sells B2B — no cart, no checkout. Every conversion goes through WhatsApp. The technical challenge is scale: roughly 2,000 product pages that need to be indexable without being thin content, served cheaply on a static host.

**Live:** [kronosolopromocionales.com](https://www.kronosolopromocionales.com)

---

## How the system fits together

There are three moving parts: the Next.js storefront, the data pipeline, and the deploy.

**Storefront** — Next.js 14 with `output: 'export'`. At build time it generates static HTML for every product, category, blog post, and landing page, then pushes the result to Netlify's CDN. No server in production. The product catalog (`data/products.json`, `data/categories.json`) is committed to the repo, so Netlify doesn't need a database connection at build time.

**Data pipeline** — Products come from a supplier catalog at `catalogospromocionales.com`. The pipeline has two layers:

1. A Python scraper in `promo-scraper/` (gitignored — not in this repo) that crawls the supplier site and writes a raw JSON dump. This is the original pipeline and is run manually when you need a bulk refresh.

2. `scripts/sync-from-neon.js` — the current approach. Products live in a Neon (serverless Postgres) database. This script pulls all of them, compares against the existing `products.json`, and calls the Anthropic API (Claude Haiku 4.5, batches of 5) to generate `seoTitle`, `seoDescription`, `story`, `features`, and `useCases` for any product that hasn't been enriched yet. After a sync, you commit the updated JSON and deploy. There's no automation wiring the DB to Netlify — the commit is the trigger.

There's a `.github/workflows/daily-scraper.yml` that was set up to run a daily Python scraper on a cron. It references `scripts/daily-scraper.py`, which doesn't exist in the repo right now — the workflow runs but would fail on the scrape step. The daily commit messages you see in the log (`chore(data): daily scraper update [skip ci]`) came from an earlier period when that script was in place.

**Deploy** — `npm run build` runs three things in sequence: `split-products-by-category.js` (prebuild), `next build`, and `next-sitemap` (postbuild). Netlify is configured in `netlify.toml` with security headers (HSTS, CSP, X-Frame-Options) and 301 redirect rules for old slugs. The `out/` directory is the publish target.

---

## Technical decisions worth explaining

**Static export instead of SSR.** All product data is known at build time, so there's nothing to gain from a server. Static files on a CDN are faster and cheaper for this traffic pattern. The tradeoff is that a data update requires a full rebuild — acceptable here since the catalog doesn't change by the hour.

**Category pages use split JSON files, not the full catalog.** Early on, importing `data/products.json` directly on category pages was pushing ~469KB into the client bundle. The `prebuild` step now runs `scripts/split-products-by-category.js`, which writes one slim JSON file per category (6 fields per product, max 80 items). These files are gitignored and regenerated each build.

**Only AI-enriched products get indexed.** 2,096 products are in `products.json`, but 88 of them don't have `is_ai_optimized: true`. Those render fine but get `noindex` in their metadata. The sitemap excludes them. This avoids a thin-content problem without having to delete products from the data.

**Duplicate slugs are handled with canonicals.** Some products exist in the catalog with numeric-suffix variants (e.g., `bolígrafo-metalico` and `bolígrafo-metalico-123`). The suffix variant gets a canonical pointing to the base slug and `noindex`. No redirects needed.

**Claude Haiku 4.5 for enrichment.** The script uses Haiku rather than a larger model because at ~2,000 products the cost difference is meaningful and the task (product descriptions, use cases, SEO titles) doesn't need deeper reasoning. There's a template fallback if the API is unavailable or you run with `--skip-ai`.

**Neon for the product database.** Neon's free tier covers this workload. The main reason to use a database at all (versus just editing JSON) is that it decouples the scraper from the storefront — you can run syncs, enrichment passes, and deduplication without touching the repo each time, then commit the final state when it's ready.

**es-CO hreflang on all pages.** The site is Ecuador-only, but hreflang tags also declare `es-CO`. This is a leftover from an earlier version of the project that included Colombia. It hasn't caused indexing problems, but it's technically incorrect and would be cleaned up in a future pass.

---

## Running locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

The dev server reads directly from `data/products.json` and `data/categories.json`. No database connection needed for development.

To run a production build locally:

```bash
npm run build
# out/ contains the full static site
```

### Syncing products from the database

```bash
# Full sync — enriches new products with Claude Haiku
node scripts/sync-from-neon.js

# Preview what would change without writing
node scripts/sync-from-neon.js --dry-run

# Skip Claude API, use template descriptions instead
node scripts/sync-from-neon.js --skip-ai

# Process only the first N products (useful for testing)
node scripts/sync-from-neon.js --limit=20
```

Requires a `.env` file with:

```
ANTHROPIC_API_KEY=your_key
# DATABASE_URL is hardcoded in sync-from-neon.js for now
```

After a sync, commit `data/products.json` to trigger a Netlify redeploy.

---

## Known limitations

- **The GitHub Actions daily scraper is broken.** The workflow exists but calls `scripts/daily-scraper.py`, which is not in this repo. The Python scraper pipeline was gitignored during a cleanup pass. Fixing this means either re-adding the scraper or rewriting the workflow to call `sync-from-neon.js` instead.

- **`data/products.json` is committed to the repo.** At 2,096 products it's a large JSON file in git history. This was a pragmatic choice to keep Netlify builds self-contained, but it means every product sync adds a large diff to the commit log. An alternative would be to have Netlify pull from Neon at build time, but that adds a build-time dependency on an external service.

- **Images are hosted by the supplier.** Product images come from `catalogospromocionales.com` (the source catalog). If that domain changes or images get reorganized, all product images break. Mirroring to Cloudinary is the fix, but it hasn't been done.

- **es-CO hreflang.** Mentioned above — present on every page but the site only serves Ecuador.

- **No price display.** Prices aren't on the site. The business model is request-a-quote over WhatsApp, so there's no product pricing data in the pipeline. This is intentional, not a gap.

---

## Project structure

```
src/app/                          # Next.js App Router pages
  productos/[slug]/               # Product detail — 2,096 static pages
  categorias/[slug]/              # Category pages — 34 categories
  blog/[slug]/                    # Blog posts
  regalos-corporativos/           # Hub landing pages (several)
  productos-promocionales-ecuador/[ciudad]/  # Geo pages by city
  sitemap.js                      # Dynamic sitemap source

data/
  products.json                   # Full catalog — committed to repo
  categories.json                 # Category definitions
  category-products/              # Split files generated at build (gitignored)
  blog/                           # Blog posts and content

scripts/
  sync-from-neon.js               # DB → products.json sync with AI enrichment
  split-products-by-category.js   # Prebuild: splits catalog by category
  dedupe-products.js              # Deduplication utility

.github/workflows/
  daily-scraper.yml               # Broken — see limitations above

netlify.toml                      # Build config, security headers, 301 redirects
next.config.js                    # output: export, custom image loader
next-sitemap.config.js            # Sitemap generation rules
```
