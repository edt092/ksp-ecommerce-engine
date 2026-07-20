#!/usr/bin/env node
// Fase 11 del plan SEO 2026-07-19: audita titles y descriptions a escala.
//
// Cubre productos (el conjunto grande, ~2.1k), categorías (37) y posts de
// blog (40). Para cada uno calcula longitud, detecta duplicados exactos y
// agrupa por "firma de fórmula" (el texto que queda tras reemplazar el
// nombre del producto/categoría por un placeholder) para encontrar plantillas
// repetidas sin dato diferencial — no todo texto compartido es un problema,
// pero una fórmula idéntica repetida cientos de veces sin variar por
// material/capacidad/técnica/uso sí lo es (ver plan-seo.md Fase 11).
//
// Genera: reports/metadata-duplication-audit.csv (productos indexables) y
// reports/metadata-duplication-audit-categories-blog.csv (categorías+blog).
//
// Este script SOLO AUDITA. No reescribe ninguna metadata — el plan exige
// revisar una muestra antes de regenerar cualquier cosa a escala.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');

process.on('uncaughtException', (err) => {
  console.error(`[audit-metadata-quality] ERROR DE CÓDIGO: ${err.message}`);
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

// Reemplaza el nombre del producto/categoría (y variantes normalizadas) por
// un placeholder para revelar la plantilla subyacente.
function formulaSignature(text, name) {
  if (!text) return '';
  let sig = text;
  const nameVariants = [name, normalize(name)];
  for (const v of nameVariants) {
    if (!v) continue;
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sig = sig.replace(new RegExp(escaped, 'gi'), '{NOMBRE}');
  }
  return normalize(sig);
}

function titleStatus(len) {
  if (len === 0) return 'EMPTY';
  if (len < 15) return 'TOO_SHORT';
  if (len > 65) return 'TOO_LONG_TRUNCATION_RISK';
  return 'OK';
}
function descriptionStatus(len) {
  if (len === 0) return 'EMPTY';
  if (len < 50) return 'TOO_SHORT';
  if (len > 165) return 'TOO_LONG_TRUNCATION_RISK';
  return 'OK';
}

// ─── Productos ────────────────────────────────────────────────────────────

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const categoryById = new Map(categories.map((c) => [c.id, c]));

const indexable = products.filter((p) => p.is_ai_optimized === true);

const titleCounts = new Map();
const descCounts = new Map();
const formulaTitleCounts = new Map();
const formulaDescCounts = new Map();

const productRows = indexable.map((p) => {
  const title = p.seoTitle || `${p.name} Personalizado | KS Promocionales`;
  const description = p.seoDescription || p.shortDescription || '';
  const titleLen = title.length;
  const descLen = description.length;

  titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
  descCounts.set(description, (descCounts.get(description) || 0) + 1);

  const titleFormula = formulaSignature(title, p.name);
  const descFormula = formulaSignature(description, p.name);
  formulaTitleCounts.set(titleFormula, (formulaTitleCounts.get(titleFormula) || 0) + 1);
  formulaDescCounts.set(descFormula, (formulaDescCounts.get(descFormula) || 0) + 1);

  // Producto incorrecto: ¿el título menciona el producto? Compara tokens
  // significativos (>=4 caracteres) del nombre contra el título.
  const nameTokens = normalize(p.name).split(' ').filter((t) => t.length >= 4);
  const titleNorm = normalize(title);
  const matchedTokens = nameTokens.filter((t) => titleNorm.includes(t));
  const nameMatchRatio = nameTokens.length > 0 ? matchedTokens.length / nameTokens.length : 1;

  const category = categoryById.get(p.categoryId);

  return {
    slug: p.slug,
    name: p.name,
    category: category?.name || p.categoryId || '',
    title,
    title_length: titleLen,
    title_status: titleStatus(titleLen),
    description,
    description_length: descLen,
    description_status: descriptionStatus(descLen),
    title_formula_signature: titleFormula,
    description_formula_signature: descFormula,
    name_match_ratio: nameMatchRatio.toFixed(2),
    possible_wrong_product: nameMatchRatio < 0.5 ? true : false,
    keywords: p.seoKeywords || '',
  };
});

// Anota conteos de duplicados/fórmulas ahora que se conocen los totales.
for (const row of productRows) {
  row.duplicate_title_count = titleCounts.get(row.title);
  row.duplicate_description_count = descCounts.get(row.description);
  row.title_formula_count = formulaTitleCounts.get(row.title_formula_signature);
  row.description_formula_count = formulaDescCounts.get(row.description_formula_signature);
}

const productHeader = [
  'slug', 'name', 'category', 'title', 'title_length', 'title_status',
  'duplicate_title_count', 'title_formula_count',
  'description', 'description_length', 'description_status',
  'duplicate_description_count', 'description_formula_count',
  'name_match_ratio', 'possible_wrong_product', 'keywords',
];
writeFileSync(join(REPORTS, 'metadata-duplication-audit.csv'), toCsv(productHeader, productRows));

// ─── Categorías y blog (conjuntos pequeños — chequeo más simple) ──────────

const blogPosts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));

const catBlogRows = [];
const catTitleCounts = new Map();
const catDescCounts = new Map();
for (const c of categories) {
  catTitleCounts.set(c.seoTitle, (catTitleCounts.get(c.seoTitle) || 0) + 1);
  catDescCounts.set(c.seoDescription, (catDescCounts.get(c.seoDescription) || 0) + 1);
}
for (const b of blogPosts) {
  const t = b.seoTitle || b.title;
  const d = b.seoDescription || b.excerpt || '';
  catTitleCounts.set(t, (catTitleCounts.get(t) || 0) + 1);
  catDescCounts.set(d, (catDescCounts.get(d) || 0) + 1);
}
for (const c of categories) {
  const titleLen = (c.seoTitle || '').length;
  const descLen = (c.seoDescription || '').length;
  catBlogRows.push({
    type: 'category',
    slug: c.slug,
    title: c.seoTitle || '',
    title_length: titleLen,
    title_status: titleStatus(titleLen),
    duplicate_title_count: catTitleCounts.get(c.seoTitle),
    description: c.seoDescription || '',
    description_length: descLen,
    description_status: descriptionStatus(descLen),
    duplicate_description_count: catDescCounts.get(c.seoDescription),
  });
}
for (const b of blogPosts) {
  const t = b.seoTitle || b.title;
  const d = b.seoDescription || b.excerpt || '';
  const titleLen = (t || '').length;
  const descLen = (d || '').length;
  catBlogRows.push({
    type: 'blog',
    slug: b.slug,
    title: t || '',
    title_length: titleLen,
    title_status: titleStatus(titleLen),
    duplicate_title_count: catTitleCounts.get(t),
    description: d,
    description_length: descLen,
    description_status: descriptionStatus(descLen),
    duplicate_description_count: catDescCounts.get(d),
  });
}
const catBlogHeader = [
  'type', 'slug', 'title', 'title_length', 'title_status', 'duplicate_title_count',
  'description', 'description_length', 'description_status', 'duplicate_description_count',
];
writeFileSync(join(REPORTS, 'metadata-duplication-audit-categories-blog.csv'), toCsv(catBlogHeader, catBlogRows));

// ─── Resumen en consola ────────────────────────────────────────────────────

console.log(`[audit-metadata-quality] Productos indexables auditados: ${productRows.length}`);

const exactDupTitles = productRows.filter((r) => r.duplicate_title_count > 1);
const exactDupDescs = productRows.filter((r) => r.duplicate_description_count > 1);
console.log(`[audit-metadata-quality] Titles duplicados exactos: ${exactDupTitles.length} filas (${new Set(exactDupTitles.map(r => r.title)).size} títulos distintos repetidos)`);
console.log(`[audit-metadata-quality] Descriptions duplicadas exactas: ${exactDupDescs.length} filas (${new Set(exactDupDescs.map(r => r.description)).size} descripciones distintas repetidas)`);

const titleStatusCounts = {};
const descStatusCounts = {};
for (const r of productRows) {
  titleStatusCounts[r.title_status] = (titleStatusCounts[r.title_status] || 0) + 1;
  descStatusCounts[r.description_status] = (descStatusCounts[r.description_status] || 0) + 1;
}
console.log('[audit-metadata-quality] Distribución title_status:', titleStatusCounts);
console.log('[audit-metadata-quality] Distribución description_status:', descStatusCounts);

const wrongProduct = productRows.filter((r) => r.possible_wrong_product);
console.log(`[audit-metadata-quality] possible_wrong_product=true: ${wrongProduct.length}`);

console.log('\n[audit-metadata-quality] Top 10 fórmulas de description más repetidas:');
[...formulaDescCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([sig, count]) => console.log(`  ${count}x  "${sig.slice(0, 90)}${sig.length > 90 ? '…' : ''}"`));

console.log('\n[audit-metadata-quality] Top 10 fórmulas de title más repetidas:');
[...formulaTitleCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([sig, count]) => console.log(`  ${count}x  "${sig.slice(0, 90)}${sig.length > 90 ? '…' : ''}"`));

console.log('\n[audit-metadata-quality] Reportes generados:');
console.log('  reports/metadata-duplication-audit.csv');
console.log('  reports/metadata-duplication-audit-categories-blog.csv');
