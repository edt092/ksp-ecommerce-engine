#!/usr/bin/env node
// Lote 3 / H2 (docs/seo-improvement-2026-10-09) — candidatos, NO cambios.
//
// 1. product-pilot-candidates.csv: 30 SKUs para el piloto de ficha verificable
//    (G1), priorizados por impresiones de la tabla Páginas del export GSC
//    global (la de Ecuador no es fiable, ver gsc-reconciliation.md) y
//    repartidos por tipo: textil, bebida, tecnología y resto.
// 2. subcategory-candidates.csv: inventario ACTUAL por patrón de nombre para
//    las subcategorías propuestas (H2). Un patrón de nombre propone, no
//    certifica material: el conteo de "metálicos"/"acero" debe validarse con
//    ficha antes de publicar una ruta.
//
// Uso: node scripts/seo-improvement/catalog-candidates.mjs "<carpeta ANALISI-09-10-2026>"

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SRC = process.argv[2];
const OUT = join(process.cwd(), 'reports', 'seo-improvement-2026-10-09');
const products = JSON.parse(readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf8'));
const published = products.filter((p) => p.is_ai_optimized);

function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); f = ''; if (row.length > 1) rows.push(row); row = []; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.slice(1);
}

const gsc = new Map();
if (SRC) {
  for (const [url, clicks, impressions, , position] of parseCsv(readFileSync(join(SRC, 'rendimiento-3-meses-todos-los-paises', 'Páginas.csv'), 'utf8'))) {
    const m = url.match(/\/productos\/([^/]+)\/?$/);
    if (m) gsc.set(m[1], { clicks: Number(clicks), impressions: Number(impressions), position: Number(position) });
  }
}

const GROUPS = [
  ['textil', /\b(camiseta|polo|gorra|chaleco|chaqueta|buzo|sudadera|cuello|uniforme)/i],
  ['bebida', /\b(mug|taza|termo|vaso|tomatodo|botilito|botella|jarro)/i],
  ['tecnologia', /\b(power ?bank|cargador|aud[ií]fono|speaker|parlante|memoria usb|usb|mouse|teclado|hub|cable)/i],
];
const groupOf = (p) => (GROUPS.find(([, re]) => re.test(p.name)) || ['otros'])[0];

const ranked = published
  .map((p) => ({ p, g: gsc.get(p.slug) || { clicks: 0, impressions: 0, position: '' } }))
  .sort((a, b) => b.g.impressions - a.g.impressions || b.g.clicks - a.g.clicks || a.p.slug.localeCompare(b.p.slug));
const quota = { textil: 8, bebida: 8, tecnologia: 8, otros: 6 };
const pilot = [];
for (const r of ranked) {
  const g = groupOf(r.p);
  if (quota[g] > 0) { quota[g]--; pilot.push({ ...r, group: g }); }
  if (pilot.length >= 30) break;
}

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'product-pilot-candidates.csv'), [
  'slug,referencia,grupo,categoria,clics_gsc_global,impresiones_gsc_global,posicion_gsc_global,quality_score,features_actuales,estado_ficha_proveedor,atributos_verificados',
  ...pilot.map(({ p, g, group }) => [
    p.slug, (p.slug.match(/-(\d+)$/) || [])[1] || '', group, p.categoryId, g.clicks, g.impressions, g.position,
    p.quality_score ?? 'ausente', (p.features || []).length, 'pendiente: pedir ficha técnica al proveedor', 'ninguno',
  ].map(esc).join(',')),
].join('\n') + '\n');

const SUBS = [
  ['/categorias/boligrafos-publicitarios/metalicos/', 'escritura', /\b(metal|metálic|metalic|aluminio|acero)/i],
  ['/categorias/boligrafos-publicitarios/ecologicos/', 'escritura', /\b(bamb[uú]|eco|corcho|cart[oó]n|papel|reciclad|trigo|rpet)/i],
  ['/categorias/termos-personalizados/acero-inoxidable/', null, /\b(termo)\b.*\b(acero|metal|inox)|\b(acero|inox)\b.*\btermo/i],
  ['/categorias/mochilas-y-maletines-personalizados/mochilas/', 'maletines', /\b(mochila|morral|backpack)/i],
  ['/categorias/articulos-de-oficina-personalizados/libretas/', 'oficina', /\b(libreta|cuaderno|agenda|notebook)/i],
  ['(tecnología) cargadores y power banks', 'tecnologia', /\b(power ?bank|cargador|pila recargable)/i],
];
writeFileSync(join(OUT, 'subcategory-candidates.csv'), [
  'ruta_propuesta,categoria_padre,productos_publicados_por_nombre,ejemplos,advertencia',
  ...SUBS.map(([route, cat, re]) => {
    const hits = published.filter((p) => (!cat || p.categoryId === cat) && re.test(p.name));
    return [route, cat || '(todas)', hits.length, hits.slice(0, 5).map((p) => p.slug).join(' | '),
      'Conteo por nombre: propone candidatos, no certifica material ni técnica. Validar con ficha antes de publicar.'].map(esc).join(',');
  }),
].join('\n') + '\n');

console.log(`piloto: ${pilot.length} SKUs (${pilot.filter((r) => r.g.impressions > 0).length} con impresiones GSC)`);
for (const [route, cat, re] of SUBS) console.log(`${route}: ${published.filter((p) => (!cat || p.categoryId === cat) && re.test(p.name)).length}`);
