#!/usr/bin/env node
'use strict';
/**
 * Fix: ~1930 products in data/products.json point images[0] to a local
 * `/img/productos/<slug>.jpg` path that was never written to public/ — the
 * script that introduced this naming scheme (and was supposed to download
 * the images) was removed in a later cleanup, leaving the broken paths
 * behind. Result: ~half of all category-page product cards render a
 * placeholder instead of a photo.
 *
 * Fix: every such id/slug carries the original numeric product ID as its
 * trailing segment (e.g. `morral-backpack-bound-10172`). That numeric ID
 * maps 1:1 to the working CDN image the site has always used:
 *   https://catalogospromocionales.com/images/productos/<id>.jpg
 * Verified reachable (200) for a sample spanning old and newly-scraped
 * products. Rewrite images[0] to that URL instead.
 *
 * Also dedupes exact-duplicate `id` entries (same id repeated verbatim),
 * which were causing React "duplicate key" warnings in product grids.
 *
 * Run: node scripts/fix-broken-product-images.js
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const PRODUCTS_PATH = join(__dirname, '..', 'data', 'products.json');

const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));

let fixedImages = 0;
let skippedNoId = 0;

for (const p of products) {
  const img = p.images?.[0];
  if (!img || !img.startsWith('/img/productos/')) continue;

  const m = p.id.match(/-(\d+)$/) || p.slug.match(/-(\d+)$/);
  if (!m) {
    skippedNoId++;
    continue;
  }
  p.images = [`https://catalogospromocionales.com/images/productos/${m[1]}.jpg`];
  fixedImages++;
}

// Dedupe exact-duplicate ids (keep first occurrence)
const seenIds = new Set();
const deduped = [];
let removedDupes = 0;
for (const p of products) {
  if (seenIds.has(p.id)) {
    removedDupes++;
    continue;
  }
  seenIds.add(p.id);
  deduped.push(p);
}

writeFileSync(PRODUCTS_PATH, JSON.stringify(deduped, null, 2) + '\n', 'utf-8');

console.log(`Fixed images: ${fixedImages}`);
console.log(`Skipped (no numeric id found): ${skippedNoId}`);
console.log(`Removed duplicate-id entries: ${removedDupes}`);
console.log(`Total products: ${products.length} -> ${deduped.length}`);
