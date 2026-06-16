#!/usr/bin/env node
'use strict';
/**
 * One-off cleanup of two systemic duplication bugs left by past merge/scrape
 * passes (legacy `categoryId-numericId` ids alongside newer `slug-numericId`
 * ids for the SAME product):
 *
 * 1. "Double-suffix" corrupted entries: a second copy of a product whose
 *    slug is `<base-slug>-<extraId>`, where <extraId> is an unrelated
 *    product's numeric id — so its image is wrong (e.g. a cap showing a USB
 *    drive). These are garbage; we drop them and keep the base entry.
 *
 * 2. Exact-slug duplicates: the same slug appears 2-4 times under different
 *    `id`s (e.g. "calculadoras-4335" and "calculadora-executive-12-digitos
 *    -4335"), sometimes with conflicting categoryId. We keep one entry per
 *    slug: prefer the majority categoryId among the duplicates (so a
 *    correctly-categorized item doesn't lose to a stray mis-tagged one),
 *    then the highest quality_score.
 *
 * Run: node scripts/dedupe-products.js
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const PRODUCTS_PATH = join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));

// ── Step 1: drop double-suffix corrupted entries ──────────────────────────
const byName = new Map();
for (const p of products) {
  if (!byName.has(p.name)) byName.set(p.name, []);
  byName.get(p.name).push(p);
}

const corruptedIds = new Set();
for (const arr of byName.values()) {
  if (arr.length < 2) continue;
  for (const a of arr) {
    for (const b of arr) {
      if (a === b) continue;
      if (b.slug.startsWith(a.slug + '-') && a.images?.[0] !== b.images?.[0]) {
        corruptedIds.add(b.id);
      }
    }
  }
}

let step1 = products.filter((p) => !corruptedIds.has(p.id));
console.log(`Step 1 — dropped double-suffix corrupted entries: ${corruptedIds.size}`);

// ── Step 2: dedupe exact-slug duplicates ──────────────────────────────────
const bySlug = new Map();
for (const p of step1) {
  if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
  bySlug.get(p.slug).push(p);
}

const result = [];
let slugDupesRemoved = 0;
for (const [slug, arr] of bySlug) {
  if (arr.length === 1) {
    result.push(arr[0]);
    continue;
  }
  // Majority categoryId vote
  const counts = new Map();
  for (const p of arr) counts.set(p.categoryId, (counts.get(p.categoryId) || 0) + 1);
  const maxCount = Math.max(...counts.values());
  const majorityCategories = new Set([...counts.entries()].filter(([, c]) => c === maxCount).map(([cid]) => cid));

  const candidates = arr.filter((p) => majorityCategories.has(p.categoryId));
  const pool = candidates.length ? candidates : arr;

  // Among candidates, prefer is_ai_optimized, then highest quality_score
  pool.sort((a, b) => {
    const aOpt = a.is_ai_optimized ? 1 : 0;
    const bOpt = b.is_ai_optimized ? 1 : 0;
    if (aOpt !== bOpt) return bOpt - aOpt;
    return (b.quality_score || 0) - (a.quality_score || 0);
  });

  result.push(pool[0]);
  slugDupesRemoved += arr.length - 1;
}

console.log(`Step 2 — slug groups: ${bySlug.size}, duplicate records removed: ${slugDupesRemoved}`);
console.log(`Total: ${products.length} -> ${result.length}`);

writeFileSync(PRODUCTS_PATH, JSON.stringify(result, null, 2) + '\n', 'utf-8');
