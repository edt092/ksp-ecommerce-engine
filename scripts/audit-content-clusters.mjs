#!/usr/bin/env node
// Fase 12 del plan SEO 2026-07-19: interlinking blog <-> categorías.
//
// Audita, para cada post de blog (agregando TODAS sus fuentes de contenido,
// igual que src/app/blog/[slug]/page.tsx: content/index.js + additions.js +
// fase3.js + pipeline.js + archivos individuales por slug):
//   - Enlaces comerciales reales (<a href> a /productos/ o /categorias/)
//   - Categorías sin ningún post que las enlace ("sin posts de apoyo")
//   - Solapamiento de intención entre posts (canibalización) vía similitud
//     de tags/título — no reescribe nada, solo señala pares a revisar
//
// Genera: reports/content-cluster-map.csv, reports/blog-cannibalization.csv
//
// Este script SOLO AUDITA. No crea artículos nuevos ni aplica redirects —
// el plan exige comparar consultas/contenido y decidir mantener/reenfocar/
// consolidar antes de tocar nada.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');

process.on('uncaughtException', (err) => {
  console.error(`[audit-content-clusters] ERROR DE CÓDIGO: ${err.message}`);
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
function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Cargar todas las fuentes de contenido de blog dinámicamente ──────────

const posts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categorySlugSet = new Set(categories.map((c) => c.slug));
const productSlugSet = new Set(products.map((p) => p.slug));

const contentDir = join(ROOT, 'data', 'blog', 'content');
const contentFiles = readdirSync(contentDir).filter((f) => f.endsWith('.js'));

const contentMaps = [];
for (const file of contentFiles) {
  const mod = await import(pathToFileURL(join(contentDir, file)).href);
  for (const exportName of Object.keys(mod)) {
    if (typeof mod[exportName] === 'object' && mod[exportName] !== null) {
      contentMaps.push(mod[exportName]);
    }
  }
}

function fullContentFor(slug) {
  return contentMaps.map((m) => m[slug] || '').join('\n');
}

// ─── Enlaces comerciales por post ──────────────────────────────────────────

// Acepta href relativo ("/productos/x/") o absoluto con el dominio del sitio
// ("https://www.kronosolopromocionales.com/productos/x/") — el contenido de
// blog mezcla ambos estilos según qué lote lo generó.
const hrefPattern = /href="(?:https?:\/\/(?:www\.)?kronosolopromocionales\.com)?(\/(?:productos|categorias)\/([a-z0-9-]+)\/?)"[^>]*>([^<]*)</g;

// Landings comerciales top-level (no son /categorias/ pero cumplen el mismo
// rol de "1 landing comercial" que pide la Fase 12 para un clúster).
const commercialLandingSlugs = new Set([
  'regalos-corporativos', 'articulos-promocionales', 'material-publicitario',
  'merchandising-corporativo', 'audifonos-promocionales', 'parlantes-bluetooth',
  'soportes-para-celular',
]);
const landingHrefPattern = /href="(?:https?:\/\/(?:www\.)?kronosolopromocionales\.com)?\/([a-z0-9-]+)\/?"[^>]*>([^<]*)</g;

const categoryInboundLinks = new Map(categories.map((c) => [c.slug, []]));
const clusterRows = [];

for (const post of posts) {
  const html = fullContentFor(post.slug);
  const productLinks = [];
  const categoryLinks = [];
  const landingLinks = [];
  let match;
  hrefPattern.lastIndex = 0;
  while ((match = hrefPattern.exec(html)) !== null) {
    const [, path, slug, anchorText] = match;
    if (path.startsWith('/productos/')) {
      productLinks.push({ slug, anchorText: anchorText.trim(), validSlug: productSlugSet.has(slug) });
    } else if (path.startsWith('/categorias/')) {
      categoryLinks.push({ slug, anchorText: anchorText.trim(), validSlug: categorySlugSet.has(slug) });
      if (categorySlugSet.has(slug)) categoryInboundLinks.get(slug).push(post.slug);
    }
  }
  landingHrefPattern.lastIndex = 0;
  while ((match = landingHrefPattern.exec(html)) !== null) {
    const [, slug] = match;
    if (commercialLandingSlugs.has(slug)) landingLinks.push(slug);
  }

  const genericAnchors = [...productLinks, ...categoryLinks].filter((l) =>
    /^(aqu[ií]|click|ver m[aá]s|este enlace|link|m[aá]s info)$/i.test(normalize(l.anchorText))
  );

  clusterRows.push({
    post_slug: post.slug,
    post_category: post.category || '',
    product_links_count: productLinks.length,
    category_links_count: categoryLinks.length,
    landing_links_count: landingLinks.length,
    total_commercial_links: productLinks.length + categoryLinks.length + landingLinks.length,
    has_zero_commercial_links: productLinks.length + categoryLinks.length + landingLinks.length === 0,
    invalid_product_links: productLinks.filter((l) => !l.validSlug).map((l) => l.slug).join('|'),
    invalid_category_links: categoryLinks.filter((l) => !l.validSlug).map((l) => l.slug).join('|'),
    generic_anchor_count: genericAnchors.length,
    linked_category_slugs: [...new Set(categoryLinks.map((l) => l.slug))].join('|'),
  });
}

const clusterHeader = [
  'post_slug', 'post_category', 'product_links_count', 'category_links_count',
  'landing_links_count', 'total_commercial_links', 'has_zero_commercial_links',
  'invalid_product_links', 'invalid_category_links', 'generic_anchor_count',
  'linked_category_slugs',
];
writeFileSync(join(REPORTS, 'content-cluster-map.csv'), toCsv(clusterHeader, clusterRows));

// ─── Categorías sin posts de apoyo ─────────────────────────────────────────

const categoriesWithoutSupport = categories
  .filter((c) => categoryInboundLinks.get(c.slug).length === 0)
  .map((c) => ({ slug: c.slug, name: c.name, product_count: c.productCount || 0 }));

writeFileSync(
  join(REPORTS, 'categories-without-blog-support.csv'),
  toCsv(['slug', 'name', 'product_count'], categoriesWithoutSupport)
);

// ─── Canibalización: similitud de tags/título entre pares de posts ────────

function tagTokenSet(post) {
  const tagText = (post.tags || []).join(' ') + ' ' + (post.title || '');
  return new Set(normalize(tagText).split(' ').filter((t) => t.length >= 4));
}
function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

const tagSets = posts.map((p) => ({ slug: p.slug, title: p.title, category: p.category, set: tagTokenSet(p) }));
const cannibalizationRows = [];
for (let i = 0; i < tagSets.length; i++) {
  for (let j = i + 1; j < tagSets.length; j++) {
    const sim = jaccard(tagSets[i].set, tagSets[j].set);
    if (sim >= 0.2) {
      cannibalizationRows.push({
        post_a: tagSets[i].slug,
        title_a: tagSets[i].title,
        post_b: tagSets[j].slug,
        title_b: tagSets[j].title,
        tag_title_similarity: sim.toFixed(2),
        same_category: tagSets[i].category === tagSets[j].category,
      });
    }
  }
}
cannibalizationRows.sort((a, b) => Number(b.tag_title_similarity) - Number(a.tag_title_similarity));

writeFileSync(
  join(REPORTS, 'blog-cannibalization.csv'),
  toCsv(['post_a', 'title_a', 'post_b', 'title_b', 'tag_title_similarity', 'same_category'], cannibalizationRows)
);

// ─── Resumen en consola ─────────────────────────────────────────────────

console.log(`[audit-content-clusters] Posts auditados: ${posts.length}`);
const zeroLinks = clusterRows.filter((r) => r.has_zero_commercial_links);
console.log(`[audit-content-clusters] Posts SIN enlaces comerciales (ni /productos/ ni /categorias/): ${zeroLinks.length}`);
zeroLinks.forEach((r) => console.log('  -', r.post_slug));

const invalidLinks = clusterRows.filter((r) => r.invalid_product_links || r.invalid_category_links);
console.log(`[audit-content-clusters] Posts con enlaces a slugs que NO existen: ${invalidLinks.length}`);
invalidLinks.forEach((r) => console.log('  -', r.post_slug, '| productos:', r.invalid_product_links, '| categorias:', r.invalid_category_links));

console.log(`[audit-content-clusters] Categorías sin ningún post de apoyo: ${categoriesWithoutSupport.length} de ${categories.length}`);

console.log(`[audit-content-clusters] Pares de posts con similitud de tags/título >= 0.20: ${cannibalizationRows.length}`);
cannibalizationRows.slice(0, 15).forEach((r) =>
  console.log(`  ${r.tag_title_similarity}  ${r.post_a}  <->  ${r.post_b}`)
);

console.log('\n[audit-content-clusters] Reportes generados:');
console.log('  reports/content-cluster-map.csv');
console.log('  reports/categories-without-blog-support.csv');
console.log('  reports/blog-cannibalization.csv');
