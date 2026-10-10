#!/usr/bin/env node
// Fase 0 (docs/seo-improvement-2026-10-09) — triage de indexación sobre una
// cohorte de URLs verificables.
//
// Los CSV de GSC entregados solo traen CONTEOS por motivo (571/370/230/70/15/7),
// no las URLs. Este script NO intenta adivinar qué URLs son: comprueba en vivo
// una cohorte elegida (hubs con impresiones, ciudades, artículos con H1
// duplicado, pares de títulos duplicados, productos retenidos, categorías de
// varios tamaños y controles sanos) y la cruza con el sitemap en vivo y con el
// grafo de enlaces <a href> de un export local.
//
// Uso:
//   node scripts/seo-improvement/indexing-triage.mjs [ruta-grafo.csv] [etiqueta]
// Por defecto usa reports/seo-improvement-2026-10-09/link-graph.csv si existe,
// si no reports/competitive-seo-2026-10-09/local-link-graph.csv (export del
// 2026-08-03). Escribe reports/seo-improvement-2026-10-09/indexing-triage[-etiqueta].csv

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'https://www.kronosolopromocionales.com';
const OUT_DIR = join(process.cwd(), 'reports', 'seo-improvement-2026-10-09');
const freshGraph = join(OUT_DIR, 'link-graph.csv');
const oldGraph = join(process.cwd(), 'reports', 'competitive-seo-2026-10-09', 'local-link-graph.csv');
const GRAPH = process.argv[2] || (existsSync(freshGraph) ? freshGraph : oldGraph);
const LABEL = process.argv[3] ? `-${process.argv[3]}` : '';

const products = JSON.parse(readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf8'));
const bySlug = new Map(products.map(p => [p.slug, p]));

// ── Cohorte ─────────────────────────────────────────────────────────────
// [ruta, grupo, intención de indexación esperada, motivo de inclusión]
const cohort = [
  ['/', 'control', 'index', 'home: 395 impresiones globales'],
  ['/regalos-corporativos/', 'hub', 'index', 'hub: 206 impresiones globales; consulta "regalos corporativos para empresas"'],
  ['/productos-promocionales-ecuador/', 'hub', 'index', 'hub nacional: 223 impresiones globales, posición 51,39'],
  ['/articulos-promocionales/', 'hub', 'index', 'hub: variantes "artículos promocionales"'],
  ['/merchandising-corporativo/', 'hub', 'index', 'hub de intención solapada'],
  ['/material-publicitario/', 'hub', 'index', 'hub de intención solapada'],
  ['/productos-promocionales-ecuador/quito/', 'ciudad', 'index', 'consulta "regalos corporativos Quito" 24 impr.'],
  ['/productos-promocionales-ecuador/guayaquil/', 'ciudad', 'index', 'consulta Guayaquil 4/9'],
  ['/productos-promocionales-ecuador/cuenca/', 'ciudad', 'index', 'global 13/110, posición 6,82'],
  ['/productos-promocionales-ecuador/ambato/', 'ciudad', 'index', 'global 2/50'],
  ['/productos-promocionales-ecuador/manta/', 'ciudad', 'index', 'global 1/34'],
  ['/productos-promocionales-colombia/cali/', 'legacy', 'redirect', 'global 2/165; Colombia retirada'],
  ['/blog/articulos-promocionales-ecologicos-para-empresas-ecuador/', 'blog-h1', 'index', 'H1 duplicado'],
  ['/blog/boligrafos-promocionales-personalizados-guia-empresas-ecuador/', 'blog-h1', 'index', 'H1 duplicado'],
  ['/blog/cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador/', 'blog-h1', 'index', 'H1 duplicado; global 0/62 posición 8,21'],
  ['/blog/mejores-regalos-corporativos-para-empresas-ecuador-2026/', 'blog', 'index', 'global 5/308; corrupción Cuencadad'],
  ['/blog/10-mejores-productos-promocionales-ecuador-imprescindibles/', 'blog', 'index', 'global 6/206'],
  ['/productos/mug-metalico-star-350ml-8986/', 'dup-titulo', 'index', 'par Mug Star'],
  ['/productos/mug-metalico-star-350ml-13197/', 'dup-titulo', 'index', 'par Mug Star'],
  ['/productos/paraguas-27-9218/', 'dup-titulo', 'index', 'par Paraguas 27 (indexable)'],
  ['/productos/paraguas-27-5913-3858/', 'dup-titulo', 'noindex', 'par Paraguas 27 (retenido)'],
  ['/productos/paraguas-27-5913/', 'retenido', 'noindex', 'retenido; destino de redirect legacy paraguas-colombia-27-5913'],
  ['/categorias/boligrafos-publicitarios/', 'categoria-grande', 'index', '213 productos, paginada'],
  ['/categorias/boligrafos-publicitarios/pagina/2/', 'paginacion', 'index', 'página 2'],
  ['/categorias/boligrafos-publicitarios/pagina/9/', 'paginacion', 'index', 'última página'],
  ['/categorias/camisetas-y-confeccion-corporativa/', 'categoria-pequena', 'index', '3 productos; 127 impr. globales'],
  ['/categorias/gorras-personalizadas/', 'categoria-pequena', 'index', '9 productos; consulta gorras 41 impr.'],
  ['/categorias/termos-personalizados/', 'categoria-pequena', 'index', '8 productos; solape drinkware'],
  ['/categorias/mugs-y-termos-personalizados/', 'categoria-grande', 'index', '75 productos; solape drinkware'],
  ['/categorias/', 'padre-vacio', 'ver-decision', 'padre de /categorias/<slug>/ sin índice'],
  ['/audifonos-promocionales/', 'landing', 'index', '0 enlaces PDP según auditoría competitiva'],
  ['/productos/no-existe-control-404/', 'control-404', '404', 'ruta inexistente'],
];

// Retenidos: muestra de 10 de los 64 no optimizados (cada 6º, determinista).
const retained = products.filter(p => !p.is_ai_optimized);
retained.filter((_, i) => i % 6 === 0).slice(0, 10).forEach(p => {
  if (!cohort.some(c => c[0] === `/productos/${p.slug}/`)) cohort.push([`/productos/${p.slug}/`, 'retenido', 'noindex', `retenido (is_ai_optimized=false), ${p.categoryId}`]);
});
// Controles sanos: 5 productos optimizados (cada 400º).
products.filter(p => p.is_ai_optimized).filter((_, i) => i % 400 === 7).slice(0, 5).forEach(p => {
  cohort.push([`/productos/${p.slug}/`, 'control-producto', 'index', `control optimizado, ${p.categoryId}`]);
});

// ── Grafo de enlaces (solo <a href>, sin JSON-LD) ──────────────────────
function loadGraph(path) {
  const inbound = new Map();
  const adj = new Map();
  const lines = readFileSync(path, 'utf8').split(/\r?\n/).slice(1);
  for (const line of lines) {
    const m = line.match(/^"([^"]*)","([^"]*)"/);
    if (!m) continue;
    const [, s, t] = m;
    if (s === t) continue;
    if (!adj.has(s)) adj.set(s, new Set());
    if (adj.get(s).has(t)) continue;
    adj.get(s).add(t);
    if (!inbound.has(t)) inbound.set(t, new Set());
    inbound.get(t).add(s);
  }
  const depth = new Map([[`${BASE}/`, 0]]);
  const queue = [`${BASE}/`];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj.get(u) || []) if (!depth.has(v)) { depth.set(v, depth.get(u) + 1); queue.push(v); }
  }
  return { inbound, depth };
}
const graph = loadGraph(GRAPH);

// ── Sitemap en vivo ─────────────────────────────────────────────────────
const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const sitemap = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));

// ── Comprobación HTTP manual (sin seguir redirects automáticamente) ─────
async function check(path) {
  let url = BASE + path;
  const chain = [];
  let res;
  for (let hop = 0; hop < 6; hop++) {
    res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (KSP SEO triage)' } });
    chain.push(res.status);
    if (res.status >= 300 && res.status < 400) {
      url = new URL(res.headers.get('location'), url).href;
      continue;
    }
    break;
  }
  const html = res.status === 200 || res.status === 404 ? await res.text() : '';
  const robots = [...html.matchAll(/<meta name="(robots|googlebot)" content="([^"]*)"/g)].map(m => `${m[1]}=${m[2]}`);
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const title = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&');
  return { final: url, chain: chain.join('>'), hops: chain.length - 1, status: res.status, xrobots: res.headers.get('x-robots-tag') || '', robots: robots.join(' | '), canonical, h1, title };
}

const rows = [];
for (const [path, group, intent, why] of cohort) {
  const r = await check(path);
  const abs = BASE + path;
  const slug = path.startsWith('/productos/') ? path.split('/')[2] : null;
  const p = slug ? bySlug.get(slug) : null;
  const hasNoindex = /noindex/.test(r.robots) || /noindex/.test(r.xrobots);
  const selfCanonical = r.canonical === r.final;
  let decision;
  if (intent === 'index') decision = r.status === 200 && !hasNoindex && selfCanonical && r.hops === 0 ? 'ok' : 'REVISAR';
  else if (intent === 'noindex') decision = hasNoindex ? (selfCanonical ? 'ok' : 'corregir-canonical (hereda home)') : 'REVISAR';
  else if (intent === 'redirect') decision = r.hops === 1 && r.status === 200 ? 'ok (1 salto)' : `revisar (${r.hops} saltos)`;
  else if (intent === '404') decision = r.status === 404 ? (r.canonical ? 'corregir: 404 con canonical' : 'ok') : 'REVISAR';
  else decision = r.status === 404 ? 'decidir: índice o redirect' : 'ver';
  rows.push({
    url: abs, grupo: group, motivo_gsc: 'desconocido (sin export por URL)', fuente_fecha: 'cohorte manual 2026-10-09',
    intencion: intent, http_final: r.status, cadena: r.chain, saltos: r.hops, destino_final: r.final,
    meta_robots: r.robots, x_robots_tag: r.xrobots, canonical_declarada: r.canonical, canonical_elegida_google: 'desconocida (requiere Inspección de URL)',
    en_sitemap: sitemap.has(abs) ? 'si' : 'no', enlaces_entrantes_html: graph.inbound.get(abs)?.size ?? 0,
    profundidad_html: graph.depth.get(abs) ?? '', h1s: r.h1, title: r.title,
    is_ai_optimized: p ? String(!!p.is_ai_optimized) : '', quality_score: p ? (p.quality_score ?? 'ausente') : '',
    trafico_gsc: why, decision,
  });
  await new Promise(r => setTimeout(r, 300));
}

const cols = Object.keys(rows[0]);
const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, `indexing-triage${LABEL}.csv`);
writeFileSync(outPath, [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n');
console.log(`grafo: ${GRAPH}`);
console.log(`escrito: ${outPath} (${rows.length} filas)`);
for (const r of rows) console.log(`${r.decision.padEnd(34)} ${r.http_final} ${r.cadena.padEnd(8)} in=${String(r.enlaces_entrantes_html).padEnd(4)} d=${String(r.profundidad_html).padEnd(2)} sm=${r.en_sitemap} h1=${r.h1s} ${r.url.replace(BASE, '')}  [${r.meta_robots}] canon=${r.canonical_declarada.replace(BASE, '')}`);
