#!/usr/bin/env node
// Auditoría local de indexabilidad: recorre products/categories/blog/geo-data/sitemap/
// redirects/enlaces internos y produce un inventario reproducible por URL, sin usar red.
// Genera:
//   reports/local-indexability-inventory.csv
//   reports/noindex-audit.csv
//   reports/canonical-audit.csv
//   reports/indexable-product-quality.csv
//   reports/sitemap-indexability-audit.csv
//   reports/internal-link-graph.csv
//   reports/orphan-pages.csv
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'out');
const REPORTS = join(ROOT, 'reports');
const SITE = 'https://www.kronosolopromocionales.com';

process.on('uncaughtException', (err) => {
  console.error(`[audit-indexability] ERROR DE CÓDIGO: ${err.message}`);
  process.exit(1);
});

mkdirSync(REPORTS, { recursive: true });

function csvField(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(header, rows) {
  return [header.join(','), ...rows.map((r) => header.map((h) => csvField(r[h])).join(','))].join('\n') + '\n';
}

// ─── Cargar datos fuente ─────────────────────────────────────────────────────

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const posts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));

const geoText = readFileSync(join(ROOT, 'data', 'geo-data.js'), 'utf-8');
const ciudadesBlockMatch = geoText.match(/ciudades:\s*\[([\s\S]*?)\n\s*\],?\s*\n\}/);
const ciudadesBlock = ciudadesBlockMatch ? ciudadesBlockMatch[1] : geoText;
const ciudades = [...ciudadesBlock.matchAll(/slug:\s*'([a-z-]+)'/g)].map((m) => m[1]);

const staticRoutes = [
  { path: '/', priority: 'commercial' },
  { path: '/contacto/', priority: 'commercial' },
  { path: '/nosotros/', priority: 'legal' },
  { path: '/blog/', priority: 'commercial' },
  { path: '/catalogos-digitales/', priority: 'commercial' },
  { path: '/politica-de-privacidad/', priority: 'legal' },
  { path: '/productos-promocionales-ecuador/', priority: 'commercial' },
  { path: '/regalos-corporativos/', priority: 'commercial' },
  { path: '/articulos-promocionales/', priority: 'commercial' },
  { path: '/material-publicitario/', priority: 'commercial' },
  { path: '/merchandising-corporativo/', priority: 'commercial' },
  { path: '/parlantes-bluetooth/', priority: 'commercial' },
  { path: '/audifonos-promocionales/', priority: 'commercial' },
  { path: '/soportes-para-celular/', priority: 'commercial' },
];

// ─── Redirects (public/_redirects + netlify.toml) ───────────────────────────

const redirectSources = new Map(); // path (sin trailing slash) -> target
function loadRedirects() {
  const redirectsText = readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8');
  for (const raw of redirectsText.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length >= 3) redirectSources.set(parts[0].replace(/\/$/, ''), parts[1]);
  }
  const netlifyText = readFileSync(join(ROOT, 'netlify.toml'), 'utf-8');
  const lines = netlifyText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '[[redirects]]') {
      const block = {};
      for (let j = i + 1; j < lines.length && lines[j].trim() !== '' && !lines[j].trim().startsWith('[['); j++) {
        const m = lines[j].match(/^\s*(from|to|status)\s*=\s*"?([^"\n]+)"?/);
        if (m) block[m[1]] = m[2].trim();
      }
      if (block.from && block.to && !block.from.includes('*')) {
        redirectSources.set(block.from.replace(/\/$/, ''), block.to);
      }
    }
  }
}
loadRedirects();

// ─── Enlaces internos (para internal_links_in) ──────────────────────────────

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (['node_modules', '.next', 'out'].includes(entry)) continue;
      walk(full, exts, out);
    } else if (exts.includes(extname(entry))) out.push(full);
  }
  return out;
}

const linkCounts = new Map(); // '/productos/slug/' -> count
const hrefPattern = /href=\{?[`"']([^`"'{}]+)[`"']\}?/g;
const codeFiles = [
  ...walk(join(ROOT, 'src'), ['.tsx', '.ts', '.jsx', '.js']),
  ...walk(join(ROOT, 'data', 'blog', 'content'), ['.js']),
];
for (const file of codeFiles) {
  const content = readFileSync(file, 'utf-8');
  let m;
  hrefPattern.lastIndex = 0;
  while ((m = hrefPattern.exec(content)) !== null) {
    let href = m[1];
    if (/^https?:\/\//.test(href)) {
      try {
        const u = new URL(href);
        if (!['www.kronosolopromocionales.com', 'kronosolopromocionales.com'].includes(u.host)) continue;
        href = u.pathname;
      } catch { continue; }
    }
    if (!href.startsWith('/')) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href.endsWith('/') && !href.includes('.')) href += '/';
    linkCounts.set(href, (linkCounts.get(href) || 0) + 1);
  }
}
// Categorías y ciudades también reciben enlaces vía componentes dinámicos (grids/menus)
// que no son detectables por regex estático — se documenta como límite conocido.

// ─── Sitemap generado (si existe) ───────────────────────────────────────────

let sitemapUrls = new Set();
const sitemapPath = join(OUT, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, 'utf-8');
  sitemapUrls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
} else {
  console.warn('[audit-indexability] AVISO: out/sitemap.xml no existe — ejecuta "pnpm build" primero para in_sitemap real. Usando estimación desde código.');
}
function inSitemap(path) {
  if (sitemapUrls.size > 0) return sitemapUrls.has(path);
  return null; // desconocido sin build
}

// ─── Detección de duplicados de nombre no cubiertos por el canonical dual-slug ──

const byName = new Map();
for (const p of products) {
  if (!byName.has(p.name)) byName.set(p.name, []);
  byName.get(p.name).push(p);
}
const duplicateGroups = new Map(); // slug -> groupId
let groupId = 0;
for (const [name, list] of byName) {
  if (list.length <= 1) continue;
  const bases = list.map((p) => p.slug.replace(/-\d+$/, ''));
  const allSameBase = bases.every((b) => b === bases[0]);
  if (allSameBase) continue; // ya cubierto por el canonical dual-slug de productos/[slug]
  groupId++;
  for (const p of list) duplicateGroups.set(p.slug, `dup-${groupId}`);
}

// ─── Content score de productos (heurística reproducible, 0-100) ───────────

function scoreProduct(p) {
  let score = 0;
  const flags = [];
  if (p.name && p.name.length >= 8) score += 10; else flags.push('nombre_corto');
  if (p.seoDescription && p.seoDescription.length >= 80) score += 20; else flags.push('seoDescription_debil');
  if (p.story && p.story.length >= 120) score += 20; else flags.push('story_debil');
  if (Array.isArray(p.features) && p.features.length >= 2) score += 15; else flags.push('features_insuficientes');
  if (Array.isArray(p.useCases) && p.useCases.length >= 1) score += 10; else flags.push('sin_useCases');
  if (Array.isArray(p.images) && p.images.length >= 1) score += 15; else flags.push('sin_imagen');
  if (p.categoryId) score += 10; else flags.push('sin_categoria');
  if (duplicateGroups.has(p.slug)) { score -= 20; flags.push('nombre_duplicado_sin_canonical'); }
  return { score: Math.max(0, Math.min(100, score)), flags };
}

function classifyProduct(p, score) {
  if (duplicateGroups.has(p.slug)) return 'C'; // consolidar
  if (!p.is_ai_optimized) return 'D'; // noindex ya aplicado
  if (score >= 70) return 'A';
  if (score >= 45) return 'B';
  return 'D';
}

// ─── Construcción del inventario ────────────────────────────────────────────

const inventory = [];

for (const r of staticRoutes) {
  inventory.push({
    url: `${SITE}${r.path}`,
    type: r.priority === 'legal' ? 'legal' : 'commercial',
    exists_in_build: existsSync(join(OUT, r.path === '/' ? 'index.html' : `${r.path.replace(/\/$/, '')}/index.html`)) ? 'true' : (sitemapUrls.size > 0 ? 'false' : 'unknown'),
    http_expected: 200,
    index_expected: 'true',
    in_sitemap: inSitemap(r.path),
    robots_index: 'true',
    robots_follow: 'true',
    canonical: `${SITE}${r.path}`,
    canonical_self_referential: 'true',
    redirect_target: '',
    internal_links_in: linkCounts.get(r.path) || 0,
    content_score: '',
    quality_flags: '',
    recommended_state: 'A_INDEXABLE',
    notes: '',
  });
}

for (const c of categories) {
  const path = `/categorias/${c.slug}/`;
  inventory.push({
    url: `${SITE}${path}`,
    type: 'category',
    exists_in_build: sitemapUrls.size > 0 ? (sitemapUrls.has(path) ? 'true' : 'unknown') : 'unknown',
    http_expected: 200,
    index_expected: 'true',
    in_sitemap: inSitemap(path),
    robots_index: 'true',
    robots_follow: 'true',
    canonical: `${SITE}${path}`,
    canonical_self_referential: 'true',
    redirect_target: '',
    internal_links_in: linkCounts.get(path) || 0,
    content_score: '',
    quality_flags: (c.productCount || 0) < 5 ? 'pocos_productos' : '',
    recommended_state: 'A_INDEXABLE',
    notes: `productCount=${c.productCount ?? 'n/a'}`,
  });
}

for (const ciudad of ciudades) {
  const path = `/productos-promocionales-ecuador/${ciudad}/`;
  inventory.push({
    url: `${SITE}${path}`,
    type: 'city',
    exists_in_build: 'true',
    http_expected: 200,
    index_expected: 'true',
    in_sitemap: inSitemap(path),
    robots_index: 'true',
    robots_follow: 'true',
    canonical: `${SITE}${path}`,
    canonical_self_referential: 'true',
    redirect_target: '',
    internal_links_in: linkCounts.get(path) || 0,
    content_score: '',
    quality_flags: '',
    recommended_state: 'A_INDEXABLE',
    notes: 'Página de ciudad — near-duplicate por diseño (5 ciudades, bajo el umbral de 30 páginas del hallazgo de sitemap.ts)',
  });
}

for (const post of posts) {
  const path = `/blog/${post.slug}/`;
  inventory.push({
    url: `${SITE}${path}`,
    type: 'blog',
    exists_in_build: 'true',
    http_expected: 200,
    index_expected: 'true',
    in_sitemap: inSitemap(path),
    robots_index: 'true',
    robots_follow: 'true',
    canonical: `${SITE}${path}`,
    canonical_self_referential: 'true',
    redirect_target: '',
    internal_links_in: linkCounts.get(path) || 0,
    content_score: '',
    quality_flags: '',
    recommended_state: 'A_INDEXABLE',
    notes: '',
  });
}

const productQualityRows = [];
for (const p of products) {
  const path = `/productos/${p.slug}/`;
  const { score, flags } = scoreProduct(p);
  const grade = classifyProduct(p, score);
  const isDualSlugCanonical = p.slug.replace(/-\d+$/, '') !== p.slug
    && products.some((o) => o.slug === p.slug.replace(/-\d+$/, '') && o.name === p.name);

  let recommended = 'A_INDEXABLE';
  let robotsIndex = 'true';
  let notes = '';
  if (isDualSlugCanonical) {
    recommended = 'B_NOINDEX_INTENCIONAL';
    robotsIndex = 'false';
    notes = 'Variante de slug con ID — canonical hacia la base, noindex intencional (lógica ya implementada en productos/[slug]/page.tsx)';
  } else if (!p.is_ai_optimized) {
    recommended = 'B_NOINDEX_INTENCIONAL';
    robotsIndex = 'false';
    notes = 'is_ai_optimized=false — pendiente de enriquecimiento, excluido del sitemap intencionalmente';
  } else if (duplicateGroups.has(p.slug)) {
    recommended = 'E_DUPLICADO';
    notes = `Mismo nombre que otro producto con slug no relacionado por ID (grupo ${duplicateGroups.get(p.slug)}) — candidato a "duplicada sin canonical" de GSC`;
  }

  inventory.push({
    url: `${SITE}${path}`,
    type: 'product',
    exists_in_build: 'true',
    http_expected: 200,
    index_expected: robotsIndex,
    in_sitemap: inSitemap(path),
    robots_index: robotsIndex,
    robots_follow: 'false',
    canonical: isDualSlugCanonical ? `${SITE}/productos/${p.slug.replace(/-\d+$/, '')}/` : `${SITE}${path}`,
    canonical_self_referential: isDualSlugCanonical ? 'false' : 'true',
    redirect_target: '',
    internal_links_in: linkCounts.get(path) || 0,
    content_score: score,
    quality_flags: flags.join(';'),
    recommended_state: recommended,
    notes,
  });

  productQualityRows.push({
    url: `${SITE}${path}`,
    slug: p.slug,
    is_ai_optimized: p.is_ai_optimized === true,
    content_score: score,
    quality_flags: flags.join(';'),
    existing_quality_score_field: p.quality_score ?? '',
    grade,
    notes,
  });
}

for (const [source, target] of redirectSources) {
  inventory.push({
    url: `${SITE}${source}/`,
    type: 'redirect',
    exists_in_build: 'false',
    http_expected: 301,
    index_expected: 'false',
    in_sitemap: inSitemap(`${source}/`),
    robots_index: 'n/a',
    robots_follow: 'n/a',
    canonical: '',
    canonical_self_referential: 'false',
    redirect_target: target,
    internal_links_in: linkCounts.get(`${source}/`) || 0,
    content_score: '',
    quality_flags: '',
    recommended_state: 'C_REDIRECT_LEGACY',
    notes: '',
  });
}

// ─── Escribir reportes ───────────────────────────────────────────────────────

const inventoryHeader = ['url', 'type', 'exists_in_build', 'http_expected', 'index_expected', 'in_sitemap', 'robots_index', 'robots_follow', 'canonical', 'canonical_self_referential', 'redirect_target', 'internal_links_in', 'content_score', 'quality_flags', 'recommended_state', 'notes'];
writeFileSync(join(REPORTS, 'local-indexability-inventory.csv'), toCsv(inventoryHeader, inventory), 'utf-8');

// noindex-audit.csv — productos/páginas con robots_index=false
const noindexRows = inventory
  .filter((r) => r.robots_index === 'false')
  .map((r) => ({
    url: r.url,
    type: r.type,
    reason_in_code: r.notes,
    in_sitemap: r.in_sitemap,
    canonical: r.canonical,
    internal_links: r.internal_links_in,
    content_score: r.content_score,
    current_robots: `${r.robots_index === 'false' ? 'noindex' : 'index'},${r.robots_follow === 'false' ? 'nofollow' : 'follow'}`,
    recommended_robots: r.recommended_state === 'E_DUPLICADO' ? 'noindex,follow (revisar canonical)' : `${r.robots_index === 'false' ? 'noindex' : 'index'},follow`,
    recommended_action: r.recommended_state,
  }));
const noindexHeader = ['url', 'type', 'reason_in_code', 'in_sitemap', 'canonical', 'internal_links', 'content_score', 'current_robots', 'recommended_robots', 'recommended_action'];
writeFileSync(join(REPORTS, 'noindex-audit.csv'), toCsv(noindexHeader, noindexRows), 'utf-8');

// canonical-audit.csv
const canonicalRows = inventory
  .filter((r) => ['product', 'category', 'blog', 'city', 'commercial', 'legal'].includes(r.type))
  .map((r) => ({
    url: r.url,
    status: 200,
    title: '',
    canonical: r.canonical,
    canonical_status: r.canonical_self_referential === 'true' ? 'self' : 'points_to_other_page',
    self_canonical: r.canonical_self_referential,
    duplicate_group: r.recommended_state === 'E_DUPLICADO' ? (r.notes.match(/grupo (dup-\d+)/)?.[1] || '') : '',
    content_hash: '',
    in_sitemap: r.in_sitemap,
    recommended_action: r.recommended_state === 'E_DUPLICADO' ? 'Definir canonical entre el grupo o consolidar contenido' : 'Ninguna',
  }));
const canonicalHeader = ['url', 'status', 'title', 'canonical', 'canonical_status', 'self_canonical', 'duplicate_group', 'content_hash', 'in_sitemap', 'recommended_action'];
writeFileSync(join(REPORTS, 'canonical-audit.csv'), toCsv(canonicalHeader, canonicalRows), 'utf-8');

// indexable-product-quality.csv
const qualityHeader = ['url', 'slug', 'is_ai_optimized', 'content_score', 'quality_flags', 'existing_quality_score_field', 'grade', 'notes'];
writeFileSync(join(REPORTS, 'indexable-product-quality.csv'), toCsv(qualityHeader, productQualityRows), 'utf-8');

// sitemap-indexability-audit.csv
const sitemapAuditRows = inventory.map((r) => {
  const issues = [];
  if (r.recommended_state.startsWith('A') && r.in_sitemap === false) issues.push('FALTA_EN_SITEMAP');
  if (!r.recommended_state.startsWith('A') && r.in_sitemap === true) issues.push('NO_DEBERIA_ESTAR_EN_SITEMAP');
  if (r.type === 'redirect' && r.in_sitemap === true) issues.push('REDIRECT_EN_SITEMAP');
  return {
    url: r.url,
    type: r.type,
    in_sitemap: r.in_sitemap,
    recommended_state: r.recommended_state,
    robots_index: r.robots_index,
    canonical_self_referential: r.canonical_self_referential,
    issues: issues.join(';'),
  };
});
const sitemapHeader = ['url', 'type', 'in_sitemap', 'recommended_state', 'robots_index', 'canonical_self_referential', 'issues'];
writeFileSync(join(REPORTS, 'sitemap-indexability-audit.csv'), toCsv(sitemapHeader, sitemapAuditRows), 'utf-8');

// internal-link-graph.csv — cuántos enlaces internos ESTÁTICOS (href literal en JSX)
// recibe cada URL indexable, detectados por regex sobre src/**/*.tsx,ts,jsx,js y
// data/blog/content/*.js.
// LÍMITE CONOCIDO E IMPORTANTE: productos y posts de blog se enlazan en la práctica
// desde componentes que arman el href en runtime a partir de datos
// (src/components/ProductCard.tsx, QuickViewModal.tsx, src/app/blog/page.tsx —
// p.ej. href={`/productos/${slug}/`}), lo cual la regex NO puede resolver a un slug
// concreto. Por eso, para type=product y type=blog, internal_links_in=0 NO significa
// "página huérfana": significa "el conteo no es fiable con este método". Para
// type=category/city/commercial/legal sí es una señal razonable porque esos enlaces
// suelen ser literales (menús, footer, home).
const linkGraphRows = inventory
  .filter((r) => r.recommended_state.startsWith('A'))
  .map((r) => ({
    url: r.url,
    type: r.type,
    internal_links_in: r.internal_links_in,
    in_sitemap: r.in_sitemap,
    link_count_reliable: ['product', 'blog'].includes(r.type) ? 'false' : 'true',
  }))
  .sort((a, b) => a.internal_links_in - b.internal_links_in);
const linkGraphHeader = ['url', 'type', 'internal_links_in', 'in_sitemap', 'link_count_reliable'];
writeFileSync(join(REPORTS, 'internal-link-graph.csv'), toCsv(linkGraphHeader, linkGraphRows), 'utf-8');

// orphan-pages.csv — solo para tipos donde el conteo estático es fiable (ver nota arriba).
// Productos y blog quedan fuera de esta lista porque el método no puede confirmar
// que estén realmente huérfanos (ver internal-link-graph.csv + su columna
// link_count_reliable para no perder la visibilidad de esos datos crudos).
const orphanRows = linkGraphRows
  .filter((r) => r.internal_links_in === 0 && r.link_count_reliable === 'true')
  .map((r) => ({ ...r, notes: 'Sin enlaces internos estáticos detectados por regex en menús/footer/home/listados — candidata real a huérfana, revisar manualmente' }));
const orphanHeader = ['url', 'type', 'internal_links_in', 'in_sitemap', 'notes'];
writeFileSync(join(REPORTS, 'orphan-pages.csv'), toCsv(orphanHeader, orphanRows), 'utf-8');

// ─── Resumen en consola ──────────────────────────────────────────────────────

const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
for (const r of productQualityRows) gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;

console.log(`[audit-indexability] Inventario local: ${inventory.length} URLs`);
console.log(`  - Estáticas/comerciales: ${staticRoutes.length}`);
console.log(`  - Categorías: ${categories.length}`);
console.log(`  - Ciudades: ${ciudades.length}`);
console.log(`  - Posts de blog: ${posts.length}`);
console.log(`  - Productos: ${products.length}`);
console.log(`  - Reglas de redirect: ${redirectSources.size}`);
console.log(`[audit-indexability] Distribución de calidad de productos: A=${gradeCounts.A} B=${gradeCounts.B} C=${gradeCounts.C} D=${gradeCounts.D} E=${gradeCounts.E}`);
console.log(`[audit-indexability] Grupos de nombre duplicado sin canonical dual-slug: ${new Set(duplicateGroups.values()).size} grupos, ${duplicateGroups.size} URLs afectadas`);
console.log(`[audit-indexability] Páginas huérfanas potenciales (solo tipos con conteo fiable — categorías/ciudades/comerciales/legales): ${orphanRows.length}`);
console.log('[audit-indexability] AVISO: productos y blog quedan excluidos de orphan-pages.csv porque se enlazan vía componentes dinámicos (ProductCard.tsx, blog/page.tsx) que la regex estática no puede resolver — ver internal-link-graph.csv columna link_count_reliable=false para esos casos.');
console.log('[audit-indexability] Reportes generados en reports/: local-indexability-inventory.csv, noindex-audit.csv, canonical-audit.csv, indexable-product-quality.csv, sitemap-indexability-audit.csv, internal-link-graph.csv, orphan-pages.csv');

process.exit(0);
