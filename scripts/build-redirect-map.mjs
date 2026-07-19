#!/usr/bin/env node
// Genera reports/redirect-map.csv combinando public/_redirects y netlify.toml,
// con las impresiones de GSC (Páginas.csv) cuando la URL de origen sigue
// recibiendo tráfico indexado. Además detecta duplicados, cadenas, bucles,
// redirects a home sin justificación y targets inexistentes.
//
// IMPORTANTE sobre "verified": este script NO hace peticiones HTTP a producción
// (no hay acceso de red saliente en este entorno, y además está prohibido operar
// Netlify en esta tarea). "config_verified" significa que la regla existe y es
// sintácticamente válida en public/_redirects o netlify.toml. "production_verified"
// significa que se comprobó con una petición HTTP real contra el sitio desplegado.
// Este script solo puede producir config_verified=true; production_verified queda
// siempre en false con una nota de cómo verificarlo manualmente.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
// GSC_DIR es opcional aquí: solo se usa para enriquecer con impresiones reales.
// Sin ella, el mapa de redirects se genera igual, con gsc_impressions en 0.
// Uso: node scripts/build-redirect-map.mjs ["<ruta-a-la-carpeta-de-CSV>"]
const GSC_DIR = process.argv[2] || process.env.GSC_DIR || null;

process.on('uncaughtException', (err) => {
  console.error(`[build-redirect-map] ERROR DE CÓDIGO: ${err.message}`);
  process.exit(1);
});

function parseNum(str) {
  if (!str) return 0;
  const n = parseFloat(String(str).replace('%', ''));
  return Number.isFinite(n) ? n : 0;
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

// ─── Impresiones de GSC por path ────────────────────────────────────────────

const impressionsByPath = new Map();
const paginasPath = GSC_DIR ? join(GSC_DIR, 'Páginas.csv') : null;
if (!GSC_DIR) {
  console.warn('[build-redirect-map] Sin GSC_DIR: se omite el cruce con impresiones reales (gsc_impressions quedará en 0 para todas las filas).');
} else if (existsSync(paginasPath)) {
  let text = readFileSync(paginasPath, 'utf-8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  const urlIdx = headers.indexOf('Páginas principales');
  const impIdx = headers.indexOf('Impresiones');
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    try {
      const path = new URL(cols[urlIdx]).pathname.replace(/\/$/, '') || '/';
      impressionsByPath.set(path, (impressionsByPath.get(path) || 0) + parseNum(cols[impIdx]));
    } catch { /* url inválida, se omite */ }
  }
} else {
  console.warn(`[build-redirect-map] AVISO: no se encontró Páginas.csv en "${GSC_DIR}" — gsc_impressions será 0 para todas las filas.`);
}

// ─── public/_redirects ──────────────────────────────────────────────────────

const entries = []; // { source, target, status, reason, origin }
const NO_REASON = 'Redirect histórico sin razón específica documentada';
let currentReason = NO_REASON;

if (!existsSync(join(ROOT, 'public', '_redirects'))) {
  throw new Error('No existe public/_redirects — no se puede construir el mapa de redirects.');
}
const redirectsText = readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8');
for (const rawLine of redirectsText.split('\n')) {
  const line = rawLine.trim();
  if (!line) {
    // En este archivo una línea en blanco siempre marca el final de un bloque de
    // reglas — cada sección de comentario y sus reglas están juntas sin blancos
    // internos (verificado). Si tras el blanco no aparece un comentario nuevo
    // antes de la siguiente regla, esa regla NO pertenece a la sección anterior:
    // se reinicia a un valor neutral en vez de arrastrar una razón no relacionada.
    currentReason = NO_REASON;
    continue;
  }
  if (line.startsWith('#')) {
    currentReason = line.replace(/^#\s*/, '').replace(/^301 Redirects\s*-\s*/, '').replace(/[─]+/g, '').trim() || NO_REASON;
    continue;
  }
  const parts = line.split(/\s+/);
  if (parts.length < 3) continue;
  const [source, target, status] = parts;
  entries.push({ source, target, status, reason: currentReason, origin: '_redirects' });
}

// ─── netlify.toml [[redirects]] ─────────────────────────────────────────────

if (!existsSync(join(ROOT, 'netlify.toml'))) {
  throw new Error('No existe netlify.toml — no se puede construir el mapa de redirects.');
}
const netlifyText = readFileSync(join(ROOT, 'netlify.toml'), 'utf-8');
let lastComment = 'Redirect de configuración Netlify';
let pendingCommentLines = [];
const netlifyLines = netlifyText.split('\n');
for (let i = 0; i < netlifyLines.length; i++) {
  const line = netlifyLines[i].trim();
  if (line.startsWith('#')) {
    // Los comentarios de netlify.toml suelen ser multilínea (varias líneas "#"
    // consecutivas forman una sola explicación). Se acumulan todas, en vez de
    // quedarnos solo con la última línea vista, que era el bug original.
    const cleaned = line.replace(/^#+\s*/, '').replace(/[─]+/g, '').trim();
    if (cleaned) pendingCommentLines.push(cleaned);
    continue;
  }
  if (line !== '' && pendingCommentLines.length > 0) {
    // La primera línea no-comentario tras un bloque de comentarios "cierra" ese
    // bloque: se fija como razón vigente y se limpia el acumulador.
    lastComment = pendingCommentLines.join(' ');
    pendingCommentLines = [];
  }
  if (line === '[[redirects]]') {
    const block = { from: '', to: '', status: '' };
    for (let j = i + 1; j < netlifyLines.length && netlifyLines[j].trim() !== '' && !netlifyLines[j].trim().startsWith('[['); j++) {
      const m = netlifyLines[j].match(/^\s*(from|to|status)\s*=\s*"?([^"\n]+)"?/);
      if (m) block[m[1]] = m[2].trim();
    }
    if (block.from && block.to) {
      entries.push({ source: block.from, target: block.to, status: block.status || '301', reason: lastComment, origin: 'netlify.toml' });
    }
  }
}

// ─── Rutas válidas conocidas (para detectar targets inexistentes) ───────────

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const posts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));

const validPaths = new Set([
  '/', '/contacto/', '/nosotros/', '/blog/', '/catalogos-digitales/', '/politica-de-privacidad/',
  '/productos-promocionales-ecuador/', '/regalos-corporativos/', '/articulos-promocionales/',
  '/material-publicitario/', '/merchandising-corporativo/', '/parlantes-bluetooth/',
  '/audifonos-promocionales/', '/soportes-para-celular/',
]);
for (const p of products) validPaths.add(`/productos/${p.slug}/`);
for (const c of categories) validPaths.add(`/categorias/${c.slug}/`);
for (const post of posts) validPaths.add(`/blog/${post.slug}/`);
// Ciudades: reutiliza los slugs ya presentes como target de redirects de ciudad conocidos
// más las rutas de ciudad reales usadas en el sitio (ver data/geo-data.js).
for (const ciudad of ['quito', 'guayaquil', 'cuenca', 'manta', 'ambato']) {
  validPaths.add(`/productos-promocionales-ecuador/${ciudad}/`);
}

function normalizePath(raw) {
  if (!raw) return '';
  let p = raw.replace(/^https?:\/\/[^/]+/, ''); // quita dominio si es absoluto
  if (!p.startsWith('/')) return raw; // no es una ruta (ej. 404.html relativo, o placeholder)
  if (!p.endsWith('/') && !p.includes('.') && !p.includes(':splat') && !p.includes('*')) p += '/';
  return p;
}

function isDynamicPlaceholder(raw) {
  return raw.includes(':splat') || raw.includes('*');
}

// ─── Análisis: duplicados, cadenas, bucles, redirects a home, targets ───────

// Duplicados: se agrupa por el string EXACTO del source (con/sin trailing slash
// tal cual aparece en el archivo). Un mismo path con y sin trailing slash NO es
// un duplicado — es el patrón intencional usado en todo _redirects para cubrir
// ambas variantes. Solo se flaguea cuando el mismo string literal se repite.
const byExactSource = new Map();
for (const e of entries) {
  if (!byExactSource.has(e.source)) byExactSource.set(e.source, []);
  byExactSource.get(e.source).push(e);
}

const duplicateContradictions = [];
const duplicateRedundant = [];
for (const [source, list] of byExactSource) {
  if (list.length <= 1) continue;
  const targets = new Set(list.map((e) => e.target.replace(/\/$/, '')));
  if (targets.size > 1) duplicateContradictions.push({ source, entries: list });
  else duplicateRedundant.push({ source, count: list.length });
}

// Para detección de cadenas SÍ normalizamos trailing slash, porque el target de
// un redirect (ej. "/categorias/tecnologia/") debe poder emparejarse con el
// source de otro redirect (ej. "/categorias/tecnologia") sin importar la barra.
const bySourceNormalized = new Map();
for (const e of entries) {
  const key = e.source.replace(/\/$/, '');
  if (!bySourceNormalized.has(key)) bySourceNormalized.set(key, []);
  bySourceNormalized.get(key).push(e);
}
const sourceSet = new Set([...bySourceNormalized.keys()]);
const chains = [];
const loops = [];
const redirectsToHome = [];
const missingTargets = [];

for (const e of entries) {
  const normSource = e.source.replace(/\/$/, '') || '/';
  const normTarget = e.target.replace(/\/$/, '') || '/';

  if (!isDynamicPlaceholder(e.target) && normSource === normTarget) {
    loops.push(e);
  }
  if (!isDynamicPlaceholder(e.target) && sourceSet.has(normTarget) && normTarget !== normSource) {
    chains.push({ ...e, chainsTo: normTarget });
  }
  if (!isDynamicPlaceholder(e.target)) {
    const targetPath = normalizePath(e.target);
    if ((targetPath === '/' || e.target.replace(/\/$/, '') === '') && e.status !== '404') {
      redirectsToHome.push(e);
    }
  }
  if (e.status !== '404' && !isDynamicPlaceholder(e.target) && e.target.startsWith('/')) {
    const targetPath = normalizePath(e.target);
    if (!validPaths.has(targetPath)) {
      missingTargets.push({ ...e, targetPath });
    }
  }
}

// ─── Verificación de las 8 URLs críticas del brief seo-5.md ────────────────

const criticalUrls = [
  '/productos/portacomida-produccion-nacional/',
  '/productos/canguro-dior/',
  '/productos/bola-para-mascotas/',
  '/productos/copa-para-vino-7oz-produccion-nacional/',
  '/productos/aplausometro-redondo-produccion-nacional/',
  '/productos/resaltador-magico-en-cera/',
  '/productos/speaker-bluetooth-con-lampara-oferta/',
  '/productos-promocionales-colombia/cali/',
];

console.log('\n[build-redirect-map] Verificación de URLs críticas:');
for (const url of criticalUrls) {
  const bare = url.replace(/\/$/, '');
  const match = entries.find((e) => e.source.replace(/\/$/, '') === bare);
  if (match) {
    const targetOk = isDynamicPlaceholder(match.target) || validPaths.has(normalizePath(match.target));
    console.log(`  OK  ${url} -> ${match.target} (${match.origin}${targetOk ? '' : ', ¡TARGET NO ENCONTRADO EN RUTAS VÁLIDAS!'})`);
  } else {
    console.log(`  FALTA  ${url} — no se encontró ninguna regla de redirect para esta URL`);
  }
}

// ─── Salida CSV ──────────────────────────────────────────────────────────────

mkdirSync(join(ROOT, 'reports'), { recursive: true });

const header = 'source,target,status,reason,gsc_impressions,config_verified,production_verified,notes';
const csvLines = entries.map((e) => {
  const sourcePath = e.source.replace(/\/$/, '') || '/';
  const impressions = impressionsByPath.get(sourcePath) || 0;

  const notes = [];
  const normSource = e.source.replace(/\/$/, '') || '/';
  const normTarget = e.target.replace(/\/$/, '') || '/';
  if (duplicateContradictions.some((d) => d.source === e.source)) notes.push('DUPLICADO_CONTRADICTORIO');
  if (duplicateRedundant.some((d) => d.source === e.source)) notes.push('DUPLICADO_REDUNDANTE');
  if (!isDynamicPlaceholder(e.target) && normSource === normTarget) notes.push('BUCLE');
  if (chains.some((c) => c.source === e.source && c.target === e.target)) notes.push('CADENA');
  if (redirectsToHome.some((r) => r.source === e.source && r.target === e.target)) notes.push('REDIRECT_A_HOME');
  if (missingTargets.some((m) => m.source === e.source && m.target === e.target)) notes.push('TARGET_NO_ENCONTRADO');

  const reason = e.reason.replace(/"/g, "'");
  const notesStr = notes.join('; ');
  return `${e.source},${e.target},${e.status},"${reason}",${impressions},true,false,"${notesStr}"`;
});

writeFileSync(join(ROOT, 'reports', 'redirect-map.csv'), [header, ...csvLines].join('\n') + '\n', 'utf-8');

console.log(`\n[build-redirect-map] ${entries.length} redirects mapeados -> reports/redirect-map.csv`);
console.log(`[build-redirect-map] Fuentes: _redirects=${entries.filter(e=>e.origin==='_redirects').length}, netlify.toml=${entries.filter(e=>e.origin==='netlify.toml').length}`);
console.log(`[build-redirect-map] Duplicados contradictorios (mismo source, distinto target): ${duplicateContradictions.length}`);
if (duplicateContradictions.length > 0) {
  for (const d of duplicateContradictions) console.log(`    - ${d.source} -> [${d.entries.map(e => e.target).join(' | ')}]`);
}
console.log(`[build-redirect-map] Duplicados redundantes (mismo source, mismo target repetido): ${duplicateRedundant.length}`);
console.log(`[build-redirect-map] Cadenas (target que a su vez es source de otro redirect): ${chains.length}`);
if (chains.length > 0) {
  for (const c of chains) console.log(`    - ${c.source} -> ${c.target} -> ... (cadena)`);
}
console.log(`[build-redirect-map] Bucles (source === target): ${loops.length}`);
console.log(`[build-redirect-map] Redirects hacia home ("/"): ${redirectsToHome.length}`);
console.log(`[build-redirect-map] Targets internos no encontrados en rutas válidas conocidas: ${missingTargets.length}`);
if (missingTargets.length > 0) {
  for (const m of missingTargets.slice(0, 20)) console.log(`    - ${m.source} -> ${m.target} (esperado: ${m.targetPath})`);
  if (missingTargets.length > 20) console.log(`    ... y ${missingTargets.length - 20} más`);
}
console.log('\n[build-redirect-map] NOTA: "production_verified" queda en false para todas las filas —');
console.log('  este script no realiza peticiones HTTP contra el sitio en producción (sin acceso de red');
console.log('  en este entorno, y esta tarea prohíbe operar Netlify). Para verificar en producción,');
console.log('  ejecuta manualmente: curl -I https://www.kronosolopromocionales.com/<ruta> y confirma');
console.log('  status 301/302 + header Location esperado.');

process.exit(0);
