#!/usr/bin/env node
'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const ROOT = join(__dirname, '..');

const SOURCES = [
  { label: 'productos', path: join(ROOT, 'data', 'products.json') },
  { label: 'categorías', path: join(ROOT, 'data', 'categories.json') },
  { label: 'posts de blog', path: join(ROOT, 'data', 'blog', 'posts.json') },
];

let hasDuplicates = false;

for (const { label, path } of SOURCES) {
  const items = JSON.parse(readFileSync(path, 'utf-8'));
  const seen = new Map();

  for (const item of items) {
    if (!item.slug) continue;
    seen.set(item.slug, (seen.get(item.slug) || 0) + 1);
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1);

  if (duplicates.length > 0) {
    hasDuplicates = true;
    console.error(`\n[validate-unique-slugs] Slugs duplicados en ${label} (${path}):`);
    for (const [slug, count] of duplicates) {
      console.error(`  - "${slug}" aparece ${count} veces`);
    }
  }
}

if (hasDuplicates) {
  console.error('\n[validate-unique-slugs] Build abortado: hay slugs duplicados. Corrígelos antes de continuar.\n');
  process.exit(1);
}

console.log('[validate-unique-slugs] OK: slugs únicos en productos, categorías y blog.');
