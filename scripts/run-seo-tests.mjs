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

check('reports/redirect-map.csv: razones no heredadas de una sección no relacionada', () => {
  // Regresión general (no hardcodea URLs específicas): si un redirect NO menciona
  // "colombia" ni en su source ni en su target, su "reason" tampoco debería
  // mencionar "colombia" — evita que el generador arrastre el comentario de una
  // sección anterior no relacionada (bug detectado en la sesión de revisión).
  const csvPath = join(ROOT, 'reports', 'redirect-map.csv');
  assert(existsSync(csvPath), 'reports/redirect-map.csv no existe — ejecuta scripts/build-redirect-map.mjs primero');
  const lines = readFileSync(csvPath, 'utf-8').split('\n').filter(Boolean);
  const header = lines[0].split(',');
  const reasonIdx = header.indexOf('reason');
  const mismatches = [];
  for (const line of lines.slice(1)) {
    // Parser CSV simple compatible con comillas dobles (igual que en build-redirect-map.mjs).
    const cols = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const source = (cols[0] || '').toLowerCase();
    const target = (cols[1] || '').toLowerCase();
    const reason = (cols[reasonIdx] || '').toLowerCase();
    const pathMentionsColombia = source.includes('colombia') || target.includes('colombia');
    const reasonMentionsColombia = reason.includes('colombia');
    if (reasonMentionsColombia && !pathMentionsColombia) {
      mismatches.push(`${cols[0]} -> reason: "${cols[reasonIdx]}"`);
    }
  }
  assert(mismatches.length === 0, `${mismatches.length} fila(s) con razón de "colombia" sin relación con el path, ej: ${mismatches[0]}`);
  return `${lines.length - 1} filas verificadas`;
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

console.log('\n[4] Structured data — Product/ItemList (offers.md)');

// offers.md — corrige "Debe especificarse offers, review o aggregateRating".
// Estas pruebas recorren TODO out/ (no solo la muestra de [3]) porque el bug
// original afectaba 23 URLs distintas de forma dispersa.

function collectTypedNodes(node, targetType, results = []) {
  if (node == null || typeof node !== 'object') return results;
  if (Array.isArray(node)) {
    for (const item of node) collectTypedNodes(item, targetType, results);
    return results;
  }
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
  if (types.includes(targetType)) results.push(node);
  for (const key of Object.keys(node)) {
    if (key === '@type') continue;
    collectTypedNodes(node[key], targetType, results);
  }
  return results;
}

function forEachJsonLdBlock(files, fn) {
  for (const file of files) {
    const html = readFileSync(file, 'utf-8');
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    for (const [, json] of blocks) {
      let parsed;
      try {
        parsed = JSON.parse(json);
      } catch {
        continue; // ya cubierto por "JSON-LD parseable" en [3]
      }
      fn(file, parsed);
    }
  }
}

const allHtmlFiles = walkHtml(OUT);

check('ningún Product sin name, ni sin offers/review/aggregateRating', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const p of collectTypedNodes(parsed, 'Product')) {
      if (!p.name) { offenders.push(`${file}: Product sin name`); continue; }
      if (!p.offers && !p.review && !p.aggregateRating) {
        offenders.push(`${file}: Product "${p.name}" sin offers/review/aggregateRating`);
      }
    }
  });
  assert(offenders.length === 0, `${offenders.length} Product(s) incompleto(s), ej: ${offenders[0]}`);
  return `${allHtmlFiles.length} páginas verificadas`;
});

check('ninguna categoría (ni producto) representada como Product dentro de un ItemList', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const il of collectTypedNodes(parsed, 'ItemList')) {
      for (const li of il.itemListElement || []) {
        if (li.item && (li.item['@type'] === 'Product' || li.item['@type'] === 'ProductGroup')) {
          offenders.push(`${file}: ItemList "${il.name}" anida ${li.item['@type']} en un ListItem`);
        }
      }
    }
  });
  assert(offenders.length === 0, `${offenders.length} ocurrencia(s), ej: ${offenders[0]}`);
});

check('ItemList.numberOfItems coincide con la cantidad de itemListElement', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const il of collectTypedNodes(parsed, 'ItemList')) {
      const count = (il.itemListElement || []).length;
      if (il.numberOfItems !== count) {
        offenders.push(`${file}: ItemList "${il.name}" numberOfItems=${il.numberOfItems} vs ${count} elemento(s)`);
      }
    }
  });
  assert(offenders.length === 0, `${offenders.length} desajuste(s), ej: ${offenders[0]}`);
});

check('ListItem.position consecutivas y URLs absolutas en ItemList/Product', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const il of collectTypedNodes(parsed, 'ItemList')) {
      for (const li of il.itemListElement || []) {
        const url = li.url || li.item?.url;
        if (url && !url.startsWith(SITE + '/')) {
          offenders.push(`${file}: ListItem con URL no absoluta/canónica: ${url}`);
        }
      }
    }
    for (const p of collectTypedNodes(parsed, 'Product')) {
      if (p.url && !p.url.startsWith(SITE + '/')) {
        offenders.push(`${file}: Product con URL no absoluta/canónica: ${p.url}`);
      }
    }
  });
  assert(offenders.length === 0, `${offenders.length} URL(s) no absolutas, ej: ${offenders[0]}`);
});

check('Offer con price real (>0) y priceCurrency cuando existe', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const p of collectTypedNodes(parsed, 'Product')) {
      if (!p.offers) continue;
      for (const o of Array.isArray(p.offers) ? p.offers : [p.offers]) {
        if (typeof o.price !== 'number' || o.price <= 0) offenders.push(`${file}: Offer de "${p.name}" sin price real`);
        if (!o.priceCurrency) offenders.push(`${file}: Offer de "${p.name}" sin priceCurrency`);
      }
    }
  });
  assert(offenders.length === 0, `${offenders.length} Offer(s) inválida(s), ej: ${offenders[0]}`);
});

check('AggregateRating con reviewCount >= 1 y ratingValue dentro de escala', () => {
  const offenders = [];
  forEachJsonLdBlock(allHtmlFiles, (file, parsed) => {
    for (const r of collectTypedNodes(parsed, 'AggregateRating')) {
      const best = r.bestRating ?? 5;
      if (!(r.reviewCount >= 1)) offenders.push(`${file}: AggregateRating con reviewCount=${r.reviewCount}`);
      if (!(r.ratingValue >= 1 && r.ratingValue <= best)) offenders.push(`${file}: AggregateRating ratingValue=${r.ratingValue} fuera de 1..${best}`);
    }
  });
  assert(offenders.length === 0, `${offenders.length} AggregateRating(s) inválido(s), ej: ${offenders[0]}`);
});

console.log('\n[4b] Páginas representativas de la corrección de offers.md');

const structuredDataSamples = [
  join('categorias', 'antiestres', 'index.html'),
  join('categorias', 'boligrafos-publicitarios', 'pagina', '2', 'index.html'),
  join('regalos-corporativos', 'index.html'),
  join('articulos-promocionales', 'index.html'),
  join('material-publicitario', 'index.html'),
  join('productos', 'boligrafo-medic-7022', 'index.html'),
  join('productos', 'set-de-vino-en-bambu-ii-9719', 'index.html'),
];

for (const rel of structuredDataSamples) {
  const full = join(OUT, rel);
  if (!existsSync(full)) {
    console.log(`  SKIP  ${rel} (no encontrado en out/)`);
    continue;
  }
  const html = readFileSync(full, 'utf-8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([, j]) => JSON.parse(j));

  check(`sin Product incompleto — ${rel}`, () => {
    const products = blocks.flatMap((b) => collectTypedNodes(b, 'Product'));
    const incomplete = products.filter((p) => !p.offers && !p.review && !p.aggregateRating);
    assert(incomplete.length === 0, `${incomplete.length} Product(s) incompleto(s) en esta página`);
    return `${products.length} Product(s) en la página (0 incompletos)`;
  });

  check(`BreadcrumbList presente — ${rel}`, () => {
    const crumbs = blocks.flatMap((b) => collectTypedNodes(b, 'BreadcrumbList'));
    assert(crumbs.length > 0, 'no se encontró BreadcrumbList');
  });
}

console.log('\n[5] Mejora SEO 2026-10-09 (docs/seo-improvement-2026-10-09)');

// Reglas que afectan a miles de páginas a la vez; recorren TODO out/.
const relOf = (file) => file.slice(OUT.length + 1).replace(/\\/g, '/');
const urlOf = (file) => {
  const rel = relOf(file);
  if (rel === 'index.html') return `${SITE}/`;
  if (rel === '404.html' || rel === '404/index.html') return null;
  return `${SITE}/${rel.replace(/index\.html$/, '')}`;
};
const htmlCache = new Map();
const readHtml = (file) => {
  if (!htmlCache.has(file)) htmlCache.set(file, readFileSync(file, 'utf-8'));
  return htmlCache.get(file);
};
const canonicalOf = (html) => (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || null;
const robotsOf = (html) => [...html.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((m) => m[1]);

check('sin palabras corrompidas "Cali" → "Cuenca" (Cuencadad, Cuencaficación…)', () => {
  const offenders = allHtmlFiles.filter((f) => /Cuenca(?:dad|ficaci|ente|dez)/.test(readHtml(f)));
  assert(offenders.length === 0, `${offenders.length} página(s), ej: ${offenders[0] && relOf(offenders[0])}`);
  return `${allHtmlFiles.length} páginas`;
});

check('cada artículo del blog tiene exactamente un <h1>', () => {
  const articles = allHtmlFiles.filter((f) => /^blog\/[^/]+\/index\.html$/.test(relOf(f)));
  const offenders = articles.filter((f) => (readHtml(f).match(/<h1[\s>]/g) || []).length !== 1);
  assert(offenders.length === 0, `${offenders.length} artículo(s) con 0 o >1 H1, ej: ${offenders[0] && relOf(offenders[0])}`);
  return `${articles.length} artículos`;
});

check('páginas noindex: canonical propia (nunca el home) y sin nofollow en productos', () => {
  const offenders = [];
  for (const f of allHtmlFiles) {
    const url = urlOf(f);
    if (!url) continue;
    const html = readHtml(f);
    const robots = robotsOf(html);
    if (!robots.some((r) => /noindex/.test(r))) continue;
    const canonical = canonicalOf(html);
    if (canonical && canonical !== url) offenders.push(`${relOf(f)}: canonical ${canonical}`);
    if (relOf(f).startsWith('productos/') && robots.some((r) => /nofollow/.test(r))) offenders.push(`${relOf(f)}: nofollow`);
  }
  assert(offenders.length === 0, `${offenders.length} problema(s), ej: ${offenders[0]}`);
});

check('ninguna página indexable salvo el home declara canonical al home', () => {
  const offenders = allHtmlFiles.filter((f) => {
    const url = urlOf(f);
    if (!url || url === `${SITE}/`) return false;
    const html = readHtml(f);
    if (robotsOf(html).some((r) => /noindex/.test(r))) return false;
    return canonicalOf(html) === `${SITE}/`;
  });
  assert(offenders.length === 0, `${offenders.length} página(s), ej: ${offenders[0] && relOf(offenders[0])}`);
});

check('404: sin canonical y robots coherentes (todas las directivas noindex)', () => {
  const file = existsSync(join(OUT, '404.html')) ? join(OUT, '404.html') : join(OUT, '404', 'index.html');
  const html = readHtml(file);
  assert(!canonicalOf(html), `la 404 declara canonical ${canonicalOf(html)}`);
  const robots = robotsOf(html);
  assert(robots.length > 0 && robots.every((r) => /noindex/.test(r)), `robots incoherentes: ${robots.join(' | ')}`);
  return robots.join(' | ');
});

check('sitemap sin URLs noindex', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const offenders = [];
  for (const loc of locs) {
    const path = loc.replace(SITE, '').replace(/^\//, '');
    const file = join(OUT, path, 'index.html');
    if (!existsSync(file)) continue;
    if (robotsOf(readHtml(file)).some((r) => /noindex/.test(r))) offenders.push(loc);
  }
  assert(offenders.length === 0, `${offenders.length} URL(s) noindex en el sitemap, ej: ${offenders[0]}`);
  return `${locs.length} URLs`;
});

check('ItemList de categorías = productos enlazados en la página, posiciones continuas entre páginas', () => {
  const offenders = [];
  const categoryFiles = allHtmlFiles.filter((f) => /^categorias\/[^/]+\/(pagina\/\d+\/)?index\.html$/.test(relOf(f)));
  for (const f of categoryFiles) {
    const html = readHtml(f);
    const page = Number((relOf(f).match(/pagina\/(\d+)\//) || [])[1] || 1);
    const linked = new Set([...html.matchAll(/href="(\/productos\/[^"]+\/)"/g)].map((m) => `${SITE}${m[1]}`));
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      let parsed;
      try { parsed = JSON.parse(json); } catch { continue; }
      for (const il of collectTypedNodes(parsed, 'ItemList')) {
        const items = il.itemListElement || [];
        const productItems = items.filter((li) => (li.url || '').includes('/productos/'));
        if (productItems.length === 0) continue;
        const first = productItems[0].position;
        const expectedFirst = (page - 1) * 24 + 1;
        if (first !== expectedFirst) offenders.push(`${relOf(f)}: primera posición ${first}, esperada ${expectedFirst}`);
        productItems.forEach((li, i) => {
          if (li.position !== first + i) offenders.push(`${relOf(f)}: posición no continua en ${li.url}`);
          if (!linked.has(li.url)) offenders.push(`${relOf(f)}: ${li.url} en ItemList pero sin <a href> en la página`);
        });
        const productLinksInGrid = [...linked].length;
        if (productItems.length !== productLinksInGrid) offenders.push(`${relOf(f)}: ${productItems.length} en ItemList vs ${productLinksInGrid} enlazados`);
      }
    }
  }
  assert(offenders.length === 0, `${offenders.length} desajuste(s), ej: ${offenders[0]}`);
  return `${categoryFiles.length} páginas de categoría`;
});

check('mismo @id nunca declarado con @type o name distintos en una página', () => {
  // Un nodo parcial (mismo @type, sin name) que solo añade propiedades —p. ej.
  // areaServed en /productos-promocionales-ecuador/— es compatible; un
  // @type distinto o un name distinto no lo es.
  const offenders = [];
  for (const f of allHtmlFiles) {
    const seen = new Map();
    const visit = (node) => {
      if (node == null || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (node['@id'] && node['@type']) {
        const type = [].concat(node['@type']).sort().join('+');
        const prev = seen.get(node['@id']);
        if (prev && (prev.type !== type || (prev.name && node.name && prev.name !== node.name))) {
          offenders.push(`${relOf(f)}: ${node['@id']} (${prev.type}|${prev.name || ''} vs ${type}|${node.name || ''})`);
        } else if (!prev || (!prev.name && node.name)) {
          seen.set(node['@id'], { type, name: node.name || prev?.name });
        }
      }
      for (const k of Object.keys(node)) if (k !== '@type') visit(node[k]);
    };
    for (const [, json] of readHtml(f).matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { visit(JSON.parse(json)); } catch { /* cubierto en [3] */ }
    }
  }
  assert(offenders.length === 0, `${offenders.length} conflicto(s), ej: ${offenders[0]}`);
});

check('H1 de producto sin tokens promocionales ("Oferta", "Nuevo", "[más]")', () => {
  const offenders = allHtmlFiles
    .filter((f) => /^productos\/[^/]+\/index\.html$/.test(relOf(f)))
    .filter((f) => {
      const h1 = (readHtml(f).match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
      return /(?:\s|-)(?:Oferta|Nuevo|oferta|nuevo)\s*$|\[más\]/.test(h1.replace(/<[^>]+>/g, '').trim());
    });
  assert(offenders.length === 0, `${offenders.length} ficha(s), ej: ${offenders[0] && relOf(offenders[0])}`);
});

check('sin preload de /images/hero/9781.jpg (retirado, no se usa)', () => {
  const offenders = allHtmlFiles.filter((f) => readHtml(f).includes('/images/hero/9781.jpg'));
  assert(offenders.length === 0, `${offenders.length} página(s), ej: ${offenders[0] && relOf(offenders[0])}`);
});

console.log(`\n${failures === 0 ? 'TODAS LAS PRUEBAS PASARON' : `${failures} PRUEBA(S) FALLARON`}\n`);
process.exit(failures === 0 ? 0 : 1);
