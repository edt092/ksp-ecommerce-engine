#!/usr/bin/env node
// Suite de pruebas SEO post-build. Se ejecuta contra out/ (requiere `npm run build` previo).
// No es un test runner nuevo — Node puro con asserts simples, cada prueba imprime OK/FAIL.
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'out');
const SITE = 'https://www.kronosolopromocionales.com';

process.on('uncaughtException', (err) => {
  console.error(`\n[run-seo-tests] ERROR DE CÓDIGO no controlado: ${err.message}`);
  console.error('[run-seo-tests] Esto no cuenta como PASS — corrige el error y vuelve a ejecutar.');
  process.exit(1);
});

let failures = 0;
function check(name, fn) {
  try {
    const detail = fn();
    console.log(`  OK  ${name}${detail ? ' — ' + detail : ''}`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${name}: ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

if (!existsSync(OUT)) {
  console.error('No existe out/. Ejecuta "npm run build" antes de correr esta suite.');
  process.exit(1);
}

console.log('\n[1] Slugs únicos (products/categories/blog)');
const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const posts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));

check('slugs únicos de productos', () => {
  const seen = new Set();
  for (const p of products) {
    if (seen.has(p.slug)) throw new Error(`slug duplicado "${p.slug}" en products.json`);
    seen.add(p.slug);
  }
  return `${products.length} productos`;
});

check('slugs únicos de categorías', () => {
  const seen = new Set();
  for (const c of categories) {
    if (seen.has(c.slug)) throw new Error(`slug duplicado "${c.slug}" en categories.json`);
    seen.add(c.slug);
  }
  return `${categories.length} categorías`;
});

check('slugs únicos de blog', () => {
  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`slug duplicado "${p.slug}" en blog/posts.json`);
    seen.add(p.slug);
  }
  return `${posts.length} posts`;
});

console.log('\n[2] Sitemap (out/sitemap.xml)');
const sitemapPath = join(OUT, 'sitemap.xml');
const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf-8') : '';

check('sitemap existe y no está vacío', () => {
  assert(sitemap.length > 0, 'out/sitemap.xml no existe o está vacío');
});

check('sin URLs duplicadas', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const seen = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) throw new Error(`URL duplicada en sitemap: ${loc}`);
    seen.add(loc);
  }
  return `${locs.length} URLs`;
});

check('todas las URLs son https://www (host canónico)', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const bad = locs.filter((l) => !l.startsWith(SITE + '/'));
  assert(bad.length === 0, `${bad.length} URLs con host no canónico, ej: ${bad[0]}`);
});

check('todas las URLs tienen trailing slash', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const bad = locs.filter((l) => !l.endsWith('/'));
  assert(bad.length === 0, `${bad.length} URLs sin trailing slash, ej: ${bad[0]}`);
});

check('sin referencias a Colombia', () => {
  assert(!/colombia/i.test(sitemap), 'el sitemap contiene "colombia"');
});

check('lastmod son fechas válidas y no futuras', () => {
  const dates = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  const now = new Date();
  for (const d of dates) {
    const parsed = new Date(d);
    assert(!Number.isNaN(parsed.getTime()), `lastmod inválido: ${d}`);
    assert(parsed.getTime() <= now.getTime() + 24 * 3600 * 1000, `lastmod futuro: ${d}`);
  }
  return `${dates.length} fechas verificadas`;
});

check('sitemap no incluye rutas con redirect conocido', () => {
  const redirectsText = readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8');
  const sources = new Set(
    redirectsText.split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split(/\s+/)[0].replace(/\/$/, ''))
  );
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const path = loc.replace(SITE, '').replace(/\/$/, '') || '/';
    assert(!sources.has(path), `sitemap incluye una URL con redirect registrado: ${loc}`);
  }
});

check('solo un generador de sitemap (sin next-sitemap)', () => {
  assert(!existsSync(join(ROOT, 'next-sitemap.config.js')), 'next-sitemap.config.js todavía existe');
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  assert(!pkg.scripts?.postbuild?.includes('next-sitemap'), 'package.json todavía tiene un postbuild con next-sitemap');
  assert(!pkg.devDependencies?.['next-sitemap'] && !pkg.dependencies?.['next-sitemap'], 'next-sitemap sigue como dependencia');
  return 'src/app/sitemap.ts es la única fuente';
});

check('productos no optimizados fuera del sitemap (equivalente a "sin noindex")', () => {
  // Este proyecto no usa <meta name="robots" content="noindex">: la exclusión de
  // indexación se implementa NO incluyendo el producto en el sitemap (ver
  // src/app/sitemap.ts, filtro is_ai_optimized === true). Por eso esta prueba
  // cubre a la vez "sitemap sin noindex" y "productos no optimizados fuera del sitemap".
  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const productLocs = locs.filter((l) => l.includes('/productos/'));
  const bad = [];
  for (const loc of productLocs) {
    const slug = loc.replace(SITE, '').replace(/^\/productos\//, '').replace(/\/$/, '');
    const product = productBySlug.get(slug);
    if (!product || product.is_ai_optimized !== true) bad.push(loc);
  }
  assert(bad.length === 0, `${bad.length} URLs de producto en el sitemap sin is_ai_optimized=true, ej: ${bad[0]}`);
  return `${productLocs.length} productos en sitemap, todos is_ai_optimized=true`;
});

console.log('\n[2b] Redirects (public/_redirects + netlify.toml)');

function parseAllRedirects() {
  const entries = [];
  const redirectsText = readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8');
  for (const line of redirectsText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 3) entries.push({ source: parts[0], target: parts[1], status: parts[2] });
  }
  const netlifyText = readFileSync(join(ROOT, 'netlify.toml'), 'utf-8');
  const lines = netlifyText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '[[redirects]]') {
      const block = {};
      for (let j = i + 1; j < lines.length && lines[j].trim() !== '' && !lines[j].trim().startsWith('[['); j++) {
        const m = lines[j].match(/^\s*(from|to|status)\s*=\s*"?([^"\n]+)"?/);
        if (m) block[m[1]] = m[2].trim();
      }
      if (block.from && block.to) entries.push({ source: block.from, target: block.to, status: block.status || '301' });
    }
  }
  return entries;
}

const redirectEntries = parseAllRedirects();

check('redirects sin bucles (source === target)', () => {
  const loops = redirectEntries.filter((e) => {
    if (e.target.includes(':splat') || e.target.includes('*')) return false;
    return e.source.replace(/\/$/, '') === e.target.replace(/\/$/, '');
  });
  assert(loops.length === 0, `${loops.length} redirect(s) en bucle, ej: ${loops[0]?.source}`);
  return `${redirectEntries.length} reglas verificadas`;
});

check('redirects sin cadenas conocidas (target que es source de otro redirect)', () => {
  const sourceSet = new Set(redirectEntries.map((e) => e.source.replace(/\/$/, '')));
  const chains = redirectEntries.filter((e) => {
    if (e.target.includes(':splat') || e.target.includes('*')) return false;
    const t = e.target.replace(/\/$/, '');
    const s = e.source.replace(/\/$/, '');
    return sourceSet.has(t) && t !== s;
  });
  assert(chains.length === 0, `${chains.length} cadena(s) detectada(s), ej: ${chains[0]?.source} -> ${chains[0]?.target}`);
});

check('rutas legacy críticas conservadas mediante redirect', () => {
  const critical = [
    '/productos/portacomida-produccion-nacional',
    '/productos/canguro-dior',
    '/productos/bola-para-mascotas',
    '/productos/copa-para-vino-7oz-produccion-nacional',
    '/productos-promocionales-colombia/cali',
  ];
  const sources = new Set(redirectEntries.map((e) => e.source.replace(/\/$/, '')));
  const missing = critical.filter((c) => !sources.has(c));
  assert(missing.length === 0, `faltan redirects para: ${missing.join(', ')}`);
  return `${critical.length} rutas legacy verificadas`;
});

console.log('\n[2c] Enlaces internos y assets locales');

check('sin enlaces internos rotos conocidos (reports/broken-internal-links.csv)', () => {
  const reportPath = join(ROOT, 'reports', 'broken-internal-links.csv');
  assert(existsSync(reportPath), 'reports/broken-internal-links.csv no existe — ejecuta scripts/find-broken-internal-links.mjs primero');
  const lines = readFileSync(reportPath, 'utf-8').split('\n').filter(Boolean);
  const dataRows = lines.slice(1);
  assert(dataRows.length === 0, `${dataRows.length} enlace(s) roto(s) registrados en el reporte`);
  return 'reports/broken-internal-links.csv sin filas de datos';
});

check('imágenes locales referenciadas existen en out/', () => {
  const imagePattern = /['"](\/images\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|svg|gif|jfif))['"]/g;
  function walkSrc(dir, exts, out = []) {
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (entry === 'node_modules' || entry === '.next' || entry === 'out') continue;
        walkSrc(full, exts, out);
      } else if (exts.some((e) => entry.endsWith(e))) out.push(full);
    }
    return out;
  }
  const files = [
    ...walkSrc(join(ROOT, 'src'), ['.tsx', '.ts', '.jsx', '.js']),
    ...walkSrc(join(ROOT, 'data'), ['.js', '.json']),
  ];
  const missing = [];
  const checked = new Set();
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    let m;
    imagePattern.lastIndex = 0;
    while ((m = imagePattern.exec(content)) !== null) {
      if (checked.has(m[1])) continue;
      checked.add(m[1]);
      if (!existsSync(join(OUT, m[1]))) missing.push(m[1]);
    }
  }
  assert(missing.length === 0, `${missing.length} imagen(es) local(es) referenciadas sin existir en out/, ej: ${missing[0]}`);
  return `${checked.size} imágenes locales verificadas contra out/`;
});

console.log('\n[3] Canonicals y JSON-LD en HTML generado (muestra)');

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const sampleTargets = [
  'index.html',
  join('productos', 'organizador-multiusos-link-nuevo-13536', 'index.html'),
  join('categorias', 'antiestres', 'index.html'),
  join('blog', 'regalos-corporativos-fin-ano-ecuador', 'index.html'),
];

for (const rel of sampleTargets) {
  const full = join(OUT, rel);
  if (!existsSync(full)) {
    console.log(`  SKIP  ${rel} (no encontrado en out/, puede haber cambiado de slug)`);
    continue;
  }
  const html = readFileSync(full, 'utf-8');

  check(`canonical correcto — ${rel}`, () => {
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert(m, 'no se encontró <link rel="canonical">');
    const href = m[1];
    assert(href.startsWith(SITE + '/'), `canonical no usa https://www: ${href}`);
    assert(href.endsWith('/'), `canonical sin trailing slash: ${href}`);
    return href;
  });

  check(`JSON-LD parseable — ${rel}`, () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert(blocks.length > 0, 'no se encontró JSON-LD en la página');
    for (const [, json] of blocks) JSON.parse(json);
    return `${blocks.length} bloque(s)`;
  });

  check(`sin "colombia" en HTML — ${rel}`, () => {
    assert(!/colombia/i.test(html), 'la página menciona "colombia"');
  });
}

console.log(`\n${failures === 0 ? 'TODAS LAS PRUEBAS PASARON' : `${failures} PRUEBA(S) FALLARON`}\n`);
process.exit(failures === 0 ? 0 : 1);
