#!/usr/bin/env node
'use strict';

const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const ROOT = join(__dirname, '..');
const PRODUCTS_PATH = join(ROOT, 'data', 'products.json');
const OUT_DIR = join(ROOT, 'data', 'category-products');

const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));

const byCategory = {};
for (const p of products) {
  if (!p.is_ai_optimized) continue;
  const cid = p.categoryId;
  if (!cid) continue;
  if (!byCategory[cid]) byCategory[cid] = [];
  byCategory[cid].push({
    id: p.id,
    slug: p.slug,
    name: p.name,
    images: p.images?.length ? [p.images[0]] : [],
    bestseller: p.bestseller || false,
    featured: p.featured || false,
  });
}

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const [categoryId, items] of Object.entries(byCategory)) {
  const total = items.length;
  const sorted = items
    .sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 80);

  writeFileSync(join(OUT_DIR, `${categoryId}.json`), JSON.stringify({ total, products: sorted }), 'utf-8');
  count++;
}

console.log(`[split-products] ${count} category files → data/category-products/`);
