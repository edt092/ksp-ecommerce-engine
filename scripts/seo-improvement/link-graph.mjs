#!/usr/bin/env node
// Grafo de enlaces <a href> del export (out/), sin JSON-LD ni JS
// (docs/seo-improvement-2026-10-09, N02/N03).
//
// Escribe reports/seo-improvement-2026-10-09/link-graph.csv (source,target) y
// link-graph-summary.json, y compara con el grafo de la auditoría competitiva
// (reports/competitive-seo-2026-10-09/local-link-graph.csv, export del
// 2026-08-03) si existe: profundidad desde el home y enlaces entrantes de
// productos indexables.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'out');
const SITE = 'https://www.kronosolopromocionales.com';
const REPORT_DIR = join(ROOT, 'reports', 'seo-improvement-2026-10-09');
const OLD_GRAPH = join(ROOT, 'reports', 'competitive-seo-2026-10-09', 'local-link-graph.csv');

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf8'));
const indexableProducts = new Set(products.filter((p) => p.is_ai_optimized).map((p) => `${SITE}/productos/${p.slug}/`));

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const edges = new Map();
for (const file of walk(OUT)) {
  const rel = file.slice(OUT.length + 1).replace(/\\/g, '/');
  if (rel.startsWith('404')) continue;
  const source = rel === 'index.html' ? `${SITE}/` : `${SITE}/${rel.replace(/index\.html$/, '')}`;
  const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const targets = new Set();
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"#?]+)/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.endsWith('/') ? href : `${href}/`;
    const target = `${SITE}${path}`;
    if (target !== source) targets.add(target);
  }
  edges.set(source, targets);
}

function analyze(adj) {
  const inbound = new Map();
  for (const [s, ts] of adj) for (const t of ts) inbound.set(t, (inbound.get(t) || 0) + 1);
  const depth = new Map([[`${SITE}/`, 0]]);
  const queue = [`${SITE}/`];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj.get(u) || []) if (!depth.has(v)) { depth.set(v, depth.get(u) + 1); queue.push(v); }
  }
  const depthHist = {};
  const inboundValues = [];
  let unreachable = 0;
  for (const url of indexableProducts) {
    const d = depth.get(url);
    if (d === undefined) unreachable++;
    else depthHist[d] = (depthHist[d] || 0) + 1;
    inboundValues.push(inbound.get(url) || 0);
  }
  inboundValues.sort((a, b) => a - b);
  const pct = (p) => inboundValues[Math.min(inboundValues.length - 1, Math.floor(p * inboundValues.length))];
  return {
    productos_indexables: indexableProducts.size,
    profundidad: depthHist,
    a_4_o_mas_clics: Object.entries(depthHist).filter(([d]) => Number(d) >= 4).reduce((a, [, n]) => a + n, 0),
    inalcanzables_desde_home: unreachable,
    sin_enlaces_entrantes: inboundValues.filter((v) => v === 0).length,
    enlaces_entrantes: { min: inboundValues[0], p25: pct(0.25), mediana: pct(0.5), p75: pct(0.75), p95: pct(0.95), max: inboundValues[inboundValues.length - 1] },
    con_1_enlace: inboundValues.filter((v) => v === 1).length,
  };
}

function loadOld(path) {
  const adj = new Map();
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/).slice(1)) {
    const m = line.match(/^"([^"]*)","([^"]*)"/);
    if (!m || m[1] === m[2]) continue;
    if (!adj.has(m[1])) adj.set(m[1], new Set());
    adj.get(m[1]).add(m[2]);
  }
  return adj;
}

mkdirSync(REPORT_DIR, { recursive: true });
const rows = ['source,target'];
for (const [s, ts] of edges) for (const t of ts) rows.push(`"${s}","${t}"`);
writeFileSync(join(REPORT_DIR, 'link-graph.csv'), rows.join('\n') + '\n');

const summary = { despues: analyze(edges) };
if (existsSync(OLD_GRAPH)) summary.antes_export_2026_08_03 = analyze(loadOld(OLD_GRAPH));
writeFileSync(join(REPORT_DIR, 'link-graph-summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
