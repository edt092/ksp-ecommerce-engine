#!/usr/bin/env node
'use strict';
/**
 * One-off verification: HEAD-check every product image URL (per category)
 * to confirm none 404 after fix-broken-product-images.js. Reports per
 * category and lists any failures.
 *
 * Run: node scripts/verify-product-images.js
 */

const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const https = require('https');

const CAT_DIR = join(__dirname, '..', 'data', 'category-products');

function headCheck(url, redirects = 0) {
  return new Promise((resolve) => {
    try {
      const req = https.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
          res.resume();
          resolve(headCheck(new URL(res.headers.location, url).toString(), redirects + 1));
        } else {
          res.resume();
          resolve(res.statusCode);
        }
      });
      req.on('error', () => resolve(0));
      req.on('timeout', () => { req.destroy(); resolve(0); });
      req.end();
    } catch {
      resolve(0);
    }
  });
}

async function runPool(items, worker, concurrency = 24) {
  const results = new Array(items.length);
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, runner));
  return results;
}

async function main() {
  const files = readdirSync(CAT_DIR).filter((f) => f.endsWith('.json'));
  let grandTotal = 0;
  let grandFail = 0;
  const allFailures = [];

  for (const file of files) {
    const catId = file.replace('.json', '');
    const { products } = JSON.parse(readFileSync(join(CAT_DIR, file), 'utf-8'));
    const statuses = await runPool(products, (p) => headCheck(p.images[0]));

    let fail = 0;
    statuses.forEach((status, i) => {
      if (status !== 200) {
        fail++;
        allFailures.push({ category: catId, id: products[i].id, name: products[i].name, url: products[i].images[0], status });
      }
    });

    grandTotal += products.length;
    grandFail += fail;
    console.log(`${catId.padEnd(28)} ${String(products.length).padStart(5)} imgs  ${fail ? `❌ ${fail} failed` : '✅ all ok'}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${grandTotal} images checked, ${grandFail} failed`);
  if (allFailures.length) {
    console.log('\nFailures:');
    for (const f of allFailures) {
      console.log(`  [${f.category}] ${f.id} (status ${f.status}) -> ${f.url}`);
    }
  }
}

main();
