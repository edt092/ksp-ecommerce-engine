#!/usr/bin/env node
// plan_accion_seo_ksp_vs_articulospromocionales_ec.md — P1 "reclasificar novedades".
// Aplica reports/novedades-reclassification-proposal.csv (generado por
// scripts/audit-novedades-reclassification.mjs) contra data/products.json:
// mueve categoryId a la categoría sugerida SOLO para filas con
// suggested_category != REQUIRES_REVIEW. Los 25 productos con nombre
// ambiguo quedan en novedades, sin tocar.
//
// Idempotente: si un producto ya no tiene categoryId='novedades' (porque
// esto ya se ejecutó antes), se omite en vez de sobreescribir.
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const productsPath = join(ROOT, 'data', 'products.json');
const categoriesPath = join(ROOT, 'data', 'categories.json');
const proposalPath = join(ROOT, 'reports', 'novedades-reclassification-proposal.csv');

const products = JSON.parse(readFileSync(productsPath, 'utf-8'));
const categories = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));

// Parser CSV mínimo: solo esta tabla, sin comas dentro de campos con comillas
// salvo `name`, que puede llevar comas — usamos un split tolerante a comillas.
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const lines = readFileSync(proposalPath, 'utf-8').trim().split('\n').slice(1);

let applied = 0;
let skippedAlreadyMoved = 0;
let skippedReview = 0;
const touchedCategorySlugs = new Set(['novedades']);

for (const line of lines) {
  const [slug, , , suggestedCategory] = parseCsvLine(line);
  if (suggestedCategory === 'REQUIRES_REVIEW') { skippedReview++; continue; }

  const product = productBySlug.get(slug);
  if (!product) throw new Error(`Producto no encontrado en products.json: ${slug}`);
  if (product.categoryId !== 'novedades') { skippedAlreadyMoved++; continue; }

  const targetCategory = categoryBySlug.get(suggestedCategory);
  if (!targetCategory) throw new Error(`Categoría destino inexistente: ${suggestedCategory} (producto ${slug})`);

  product.categoryId = targetCategory.id;
  touchedCategorySlugs.add(suggestedCategory);
  applied++;
}

writeFileSync(productsPath, JSON.stringify(products, null, 2) + '\n', 'utf-8');

// Recalcular productCount solo para las categorías que este script tocó —
// el resto de categories.json queda intacto, incluida cualquier staleness
// preexistente ajena a este cambio.
for (const slug of touchedCategorySlugs) {
  const cat = categoryBySlug.get(slug);
  cat.productCount = products.filter((p) => p.categoryId === cat.id).length;
}
writeFileSync(categoriesPath, JSON.stringify(categories, null, 2) + '\n', 'utf-8');

console.log(`[apply-novedades-reclassification] Aplicados: ${applied}`);
console.log(`[apply-novedades-reclassification] Omitidos (REQUIRES_REVIEW): ${skippedReview}`);
console.log(`[apply-novedades-reclassification] Omitidos (ya no estaban en novedades): ${skippedAlreadyMoved}`);
console.log('[apply-novedades-reclassification] productCount recalculado para:', [...touchedCategorySlugs].sort().join(', '));
