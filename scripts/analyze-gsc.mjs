#!/usr/bin/env node
// Lee los CSV exportados de Google Search Console y produce los reportes de
// reports/gsc-*. No copia ni modifica los CSV originales — los lee in-place.
//
// Uso: node scripts/analyze-gsc.mjs <ruta-carpeta-csv>
// La ruta es obligatoria por argumento, o vía la variable de entorno GSC_DIR —
// este script no asume la carpeta de ningún perfil de usuario en particular.

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const GSC_DIR = process.argv[2] || process.env.GSC_DIR;
const REPORTS_DIR = join(ROOT, 'reports');
const SITE = 'https://www.kronosolopromocionales.com';

if (!GSC_DIR) {
  console.error('[analyze-gsc] Falta la ruta a la carpeta con los CSV de Google Search Console.');
  console.error('[analyze-gsc] Uso:      node scripts/analyze-gsc.mjs "<ruta-a-la-carpeta-de-CSV>"');
  console.error('[analyze-gsc] Alterna:  GSC_DIR="<ruta>" node scripts/analyze-gsc.mjs');
  console.error('[analyze-gsc] En Windows, si la ruta tiene espacios, enciérrala entre comillas.');
  process.exit(1);
}

// Validación temprana y explícita del directorio de entrada — si GSC_DIR no
// existe en absoluto, es un fallo de configuración/entorno (ruta incorrecta),
// no un fallo de código. Distinguirlo evita diagnósticos equivocados.
if (!existsSync(GSC_DIR)) {
  console.error(`[analyze-gsc] ERROR DE CONFIGURACIÓN: la carpeta de CSV de GSC no existe: "${GSC_DIR}"`);
  console.error('[analyze-gsc] Verifica la ruta pasada por argumento o por la variable GSC_DIR.');
  console.error('[analyze-gsc] Si el error es EPERM/ENOENT al resolver una ruta de perfil de usuario,');
  console.error('[analyze-gsc] prueba ejecutando el comando desde una terminal normal (no elevada) y confirma');
  console.error('[analyze-gsc] que el directorio de trabajo actual es la raíz del repositorio.');
  process.exit(1);
}
if (!statSync(GSC_DIR).isDirectory()) {
  console.error(`[analyze-gsc] ERROR DE CONFIGURACIÓN: la ruta indicada no es una carpeta: "${GSC_DIR}"`);
  process.exit(1);
}

mkdirSync(REPORTS_DIR, { recursive: true });

// Manejo global de excepciones: cualquier fallo no controlado (JSON inválido,
// permisos, CSV corrupto) termina con mensaje claro y código de salida 1, en
// vez de un stack trace crudo o (peor) un exit code 0 silencioso.
process.on('uncaughtException', (err) => {
  console.error(`[analyze-gsc] ERROR DE CÓDIGO: ${err.message}`);
  if (err.code) console.error(`[analyze-gsc] Código de error del sistema: ${err.code}`);
  process.exit(1);
});

function readJson(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Falta el archivo de datos requerido "${label}" en ${path}`);
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (err) {
    throw new Error(`"${label}" no es JSON válido (${path}): ${err.message}`);
  }
}

// ─── CSV parsing ────────────────────────────────────────────────────────────

const filesRead = []; // { filename, rows } — para el resumen final

function readCsv(filename) {
  const path = join(GSC_DIR, filename);
  if (!existsSync(path)) {
    console.warn(`[analyze-gsc] Falta ${filename} en "${GSC_DIR}", se omite (0 filas).`);
    filesRead.push({ filename, rows: 0, found: false });
    return [];
  }
  let text;
  try {
    text = readFileSync(path, 'utf-8');
  } catch (err) {
    throw new Error(`No se pudo leer ${filename} (${err.code || err.message}). Verifica permisos de lectura.`);
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) {
    filesRead.push({ filename, rows: 0, found: true });
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });
    rows.push(row);
  }
  filesRead.push({ filename, rows: rows.length, found: true });
  return rows;
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseNum(str) {
  if (str === undefined || str === null || str === '') return 0;
  const cleaned = String(str).replace(/%/g, '').replace(/\./g, (m, offset, s) => {
    // Solo tratar '.' como separador de miles si hay más dígitos después (raro en estos CSV);
    // los CSV de GSC usan punto decimal estándar, así que no se transforma.
    return m;
  }).trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function pct(str) {
  return parseNum(str); // ya viene como número con %, parseNum descarta el símbolo
}

// ─── Cargar datos ───────────────────────────────────────────────────────────

const paginas = readCsv('Páginas.csv');
const consultas = readCsv('Consultas.csv');
const dispositivos = readCsv('Dispositivos.csv');
const paises = readCsv('Países.csv');
const grafico = readCsv('Gráfico.csv');
// 'Aparición en búsquedas.csv' y 'Filtros.csv' se leen pero no producen filas de datos
// (el primero está vacío en este export, el segundo es solo metadata del filtro aplicado).
readCsv('Aparición en búsquedas.csv');
readCsv('Filtros.csv');

const products = readJson(join(ROOT, 'data', 'products.json'), 'data/products.json');
const categories = readJson(join(ROOT, 'data', 'categories.json'), 'data/categories.json');
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

const redirectsRaw = existsSync(join(ROOT, 'public', '_redirects'))
  ? readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8')
  : '';
const redirects = []; // { from, to }
for (const line of redirectsRaw.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) redirects.push({ from: parts[0], to: parts[1] });
}
const redirectByFrom = new Map(redirects.map((r) => [r.from.replace(/\/$/, ''), r.to]));

// ─── Helpers de URL ─────────────────────────────────────────────────────────

function toPath(url) {
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url;
  }
}

function isCanonicalHost(url) {
  return url.startsWith(`${SITE}/`) || url === SITE;
}

// ─── 1. reports/gsc-domain-variants.csv ────────────────────────────────────

const domainRows = paginas
  .map((r) => ({
    url: r['Páginas principales'],
    clicks: parseNum(r['Clics']),
    impressions: parseNum(r['Impresiones']),
    ctr: r['CTR'],
    position: parseNum(r['Posición']),
  }))
  .filter((r) => !isCanonicalHost(r.url));

{
  const header = 'url,path,clicks,impressions,ctr,position,canonical_target';
  const lines = domainRows.map((r) => {
    const path = toPath(r.url);
    const target = `${SITE}${path === '/' ? '/' : path.replace(/\/$/, '') + '/'}`;
    return `${r.url},${path},${r.clicks},${r.impressions},${r.ctr},${r.position},${target}`;
  });
  writeFileSync(join(REPORTS_DIR, 'gsc-domain-variants.csv'), [header, ...lines].join('\n') + '\n', 'utf-8');
}

// ─── 2. reports/gsc-legacy-urls.csv ─────────────────────────────────────────
// Cruza páginas y consultas de GSC contra los "from" registrados en public/_redirects.

const legacyRows = [];
for (const r of paginas) {
  const path = toPath(r['Páginas principales']).replace(/\/$/, '');
  if (redirectByFrom.has(path)) {
    legacyRows.push({
      source: path,
      target: redirectByFrom.get(path),
      impressions: parseNum(r['Impresiones']),
      clicks: parseNum(r['Clics']),
      position: parseNum(r['Posición']),
      verified: 'true',
    });
  }
}

{
  const header = 'source,target,gsc_impressions,gsc_clicks,gsc_position,verified';
  const lines = legacyRows.map((r) => `${r.source},${r.target},${r.impressions},${r.clicks},${r.position},${r.verified}`);
  writeFileSync(join(REPORTS_DIR, 'gsc-legacy-urls.csv'), [header, ...lines].join('\n') + '\n', 'utf-8');
}

// ─── 3. reports/gsc-page-opportunities.csv ──────────────────────────────────

function classifyPage(r) {
  if (redirectByFrom.has(toPath(r.url).replace(/\/$/, '')) || !isCanonicalHost(r.url)) {
    return { bucket: 'E', reason: 'URL no canónica, antigua o redirigida' };
  }
  const pos = r.position;
  if (pos <= 10) {
    const ctrNum = pct(r.ctr);
    if (r.impressions >= 10 && ctrNum < 5) {
      return { bucket: 'A', reason: 'Posición top10 con CTR bajo — oportunidad de CTR inmediata' };
    }
    return { bucket: 'A', reason: 'Posición top10' };
  }
  if (pos <= 20) return { bucket: 'B', reason: 'Subida de ranking (11-20)' };
  if (pos <= 50) return { bucket: 'C', reason: 'Construcción de autoridad (21-50)' };
  return { bucket: 'D', reason: 'Baja prioridad (posición >50)' };
}

{
  const rows = paginas.map((r) => ({
    url: r['Páginas principales'],
    clicks: parseNum(r['Clics']),
    impressions: parseNum(r['Impresiones']),
    ctr: r['CTR'],
    position: parseNum(r['Posición']),
  }));

  const header = 'url,clicks,impressions,ctr,position,bucket,reason';
  const lines = rows.map((r) => {
    const { bucket, reason } = classifyPage(r);
    return `${r.url},${r.clicks},${r.impressions},${r.ctr},${r.position},${bucket},"${reason}"`;
  });
  writeFileSync(join(REPORTS_DIR, 'gsc-page-opportunities.csv'), [header, ...lines].join('\n') + '\n', 'utf-8');
}

// ─── 4. reports/gsc-query-opportunities.csv ─────────────────────────────────

function classifyQuery(r) {
  const pos = r.position;
  const ctrNum = pct(r.ctr);
  if (pos <= 10) {
    return r.impressions >= 10 && ctrNum < 5
      ? { bucket: 'A', reason: 'Top10 con CTR bajo' }
      : { bucket: 'A', reason: 'Top10' };
  }
  if (pos <= 20) return { bucket: 'B', reason: 'Subida de ranking (11-20)' };
  if (pos <= 50) return { bucket: 'C', reason: 'Construcción de autoridad (21-50)' };
  return { bucket: 'D', reason: 'Baja prioridad (posición >50)' };
}

{
  const rows = consultas.map((r) => ({
    query: r['Consultas principales'],
    clicks: parseNum(r['Clics']),
    impressions: parseNum(r['Impresiones']),
    ctr: r['CTR'],
    position: parseNum(r['Posición']),
  }));

  const header = 'query,clicks,impressions,ctr,position,bucket,reason';
  const lines = rows.map((r) => {
    const { bucket, reason } = classifyQuery(r);
    return `"${r.query}",${r.clicks},${r.impressions},${r.ctr},${r.position},${bucket},"${reason}"`;
  });
  writeFileSync(join(REPORTS_DIR, 'gsc-query-opportunities.csv'), [header, ...lines].join('\n') + '\n', 'utf-8');
}

// ─── 5. reports/gsc-product-opportunities.csv ───────────────────────────────

{
  const productRows = paginas
    .map((r) => ({
      url: r['Páginas principales'],
      clicks: parseNum(r['Clics']),
      impressions: parseNum(r['Impresiones']),
      ctr: r['CTR'],
      position: parseNum(r['Posición']),
    }))
    .filter((r) => isCanonicalHost(r.url) && toPath(r.url).startsWith('/productos/'));

  const header = 'url,clicks,impressions,ctr,position,slug,product_exists,is_ai_optimized,redirect_target,notes';
  const lines = productRows.map((r) => {
    const path = toPath(r.url).replace(/\/$/, '');
    const slug = path.replace('/productos/', '');
    const product = productBySlug.get(slug);
    const exists = product ? 'true' : 'false';
    const optimized = product ? String(product.is_ai_optimized === true) : 'n/a';
    const redirectTarget = redirectByFrom.get(path) || '';
    let notes = '';
    if (!product && redirectTarget) notes = 'Slug antiguo, ya redirigido a ' + redirectTarget;
    else if (!product && !redirectTarget) notes = 'ALERTA: URL indexada sin producto ni redirect — revisar manualmente';
    else if (product && product.is_ai_optimized !== true) notes = 'Producto existe pero no está optimizado (excluido del sitemap)';
    return `${r.url},${r.clicks},${r.impressions},${r.ctr},${r.position},${slug},${exists},${optimized},${redirectTarget},"${notes}"`;
  });
  writeFileSync(join(REPORTS_DIR, 'gsc-product-opportunities.csv'), [header, ...lines].join('\n') + '\n', 'utf-8');
}

// ─── 6. reports/gsc-summary.md ──────────────────────────────────────────────

{
  // Dos totales de impresiones distintos y ambos legítimos — NO son el mismo número:
  // - totalImpressionsPaginas: suma de Impresiones en Páginas.csv (desglose por URL).
  // - totalImpressionsGrafico: suma de Impresiones en Gráfico.csv (serie diaria).
  // Los clics sí reconcilian entre ambos exports; las impresiones no, por cómo
  // Search Console agrega/trunca cada tipo de reporte. No se declara un total
  // "global" único para evitar presentar una cifra como si fuera la otra.
  const totalClicksPaginas = paginas.reduce((s, r) => s + parseNum(r['Clics']), 0);
  const totalImpressionsPaginas = paginas.reduce((s, r) => s + parseNum(r['Impresiones']), 0);
  const totalClicksGrafico = grafico.reduce((s, r) => s + parseNum(r['Clics']), 0);
  const totalImpressionsGrafico = grafico.reduce((s, r) => s + parseNum(r['Impresiones']), 0);
  const totalClicks = totalClicksPaginas; // alias usado más abajo por compatibilidad
  const totalImpressions = totalImpressionsPaginas;

  // Tendencia mensual desde Gráfico.csv (diario -> agregado por mes)
  const byMonth = new Map();
  for (const r of grafico) {
    const fecha = r['Fecha'];
    if (!fecha) continue;
    const month = fecha.slice(0, 7); // YYYY-MM
    const entry = byMonth.get(month) || { clicks: 0, impressions: 0 };
    entry.clicks += parseNum(r['Clics']);
    entry.impressions += parseNum(r['Impresiones']);
    byMonth.set(month, entry);
  }
  const months = [...byMonth.keys()].sort();

  // Periodo exacto y últimos 28 días disponibles, calculados de Gráfico.csv (serie diaria).
  const graficoDates = grafico.map((r) => r['Fecha']).filter(Boolean).sort();
  const periodStart = graficoDates[0] || 'sin datos';
  const periodEnd = graficoDates[graficoDates.length - 1] || 'sin datos';
  const last28 = grafico
    .filter((r) => r['Fecha'])
    .sort((a, b) => a['Fecha'].localeCompare(b['Fecha']))
    .slice(-28);
  const last28Clicks = last28.reduce((s, r) => s + parseNum(r['Clics']), 0);
  const last28Impressions = last28.reduce((s, r) => s + parseNum(r['Impresiones']), 0);
  const last28Start = last28[0]?.['Fecha'] || 'sin datos';
  const last28End = last28[last28.length - 1]?.['Fecha'] || 'sin datos';

  const deviceLines = dispositivos.map((r) =>
    `| ${r['Dispositivo']} | ${r['Clics']} | ${r['Impresiones']} | ${r['CTR']} | ${r['Posición']} |`
  );

  const topCountries = paises.slice(0, 6).map((r) =>
    `| ${r['País']} | ${r['Clics']} | ${r['Impresiones']} | ${r['CTR']} | ${r['Posición']} |`
  );

  const topPages = paginas.slice(0, 15).map((r) =>
    `| ${r['Páginas principales']} | ${r['Clics']} | ${r['Impresiones']} | ${r['CTR']} | ${r['Posición']} |`
  );

  const topQueries = consultas.slice(0, 15).map((r) =>
    `| ${r['Consultas principales']} | ${r['Clics']} | ${r['Impresiones']} | ${r['CTR']} | ${r['Posición']} |`
  );

  const md = `# Resumen GSC — KS Promocionales

Generado por \`scripts/analyze-gsc.mjs\` a partir de una exportación local de Google Search
Console con corte ${periodEnd} (periodo ${periodStart} a ${periodEnd}).
No sustituye a la interfaz de Search Console — los totales pueden diferir por
agregación y anonimización de consultas (Google no expone el 100% de las
consultas por privacidad y truncamiento).

## Totales — dos vistas, NO intercambiables

Search Console no permite sumar directamente el desglose por página con la serie
temporal del gráfico: son dos reportes distintos que Google agrega de forma
diferente. Los clics sí reconcilian; las impresiones no. No trates una cifra
como si fuera la otra.

| Fuente | Clics | Impresiones |
| --- | ---: | ---: |
| Páginas.csv (desglose por URL, ${paginas.length} filas) | ${totalClicksPaginas} | ${totalImpressionsPaginas} |
| Gráfico.csv (serie diaria, ${grafico.length} filas) | ${totalClicksGrafico} | ${totalImpressionsGrafico} |

${totalClicksPaginas === totalClicksGrafico
  ? `Los clics coinciden exactamente entre ambos reportes (${totalClicksPaginas}). Las impresiones difieren (${totalImpressionsPaginas} vs. ${totalImpressionsGrafico}) porque Páginas.csv y Gráfico.csv provienen de vistas de Search Console con agregación distinta — no es un error del script ni de este análisis.`
  : `Nota: en este export los clics tampoco coinciden entre reportes (${totalClicksPaginas} vs. ${totalClicksGrafico}) — revisar manualmente antes de citar cualquiera de los dos totales como definitivo.`}

- Filas de páginas: ${paginas.length}
- Filas de consultas: ${consultas.length}

## Periodo exacto

- Desde: **${periodStart}**
- Hasta: **${periodEnd}**
- Fuente: rango de fechas presente en Gráfico.csv (serie diaria).

## Últimos 28 días disponibles (${last28Start} a ${last28End})

- Clics: **${last28Clicks}**
- Impresiones: **${last28Impressions}**

Estas cifras son las últimas 28 filas diarias de Gráfico.csv, no un filtro de
"últimos 28 días desde hoy" — reflejan el final del periodo exportado.

## Tendencia mensual (Gráfico.csv)

| Mes | Clics | Impresiones |
| --- | ---: | ---: |
${months.map((m) => {
  const e = byMonth.get(m);
  return `| ${m} | ${e.clicks} | ${e.impressions} |`;
}).join('\n')}

## Dispositivos

| Dispositivo | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
${deviceLines.join('\n')}

## Países (top 6)

| País | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
${topCountries.join('\n')}

## Páginas con más clics (top 15)

| URL | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
${topPages.join('\n')}

## Consultas con más clics/impresiones (top 15)

| Consulta | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
${topQueries.join('\n')}

## Fragmentación de dominio detectada

${domainRows.map((r) => `- \`${r.url}\`: ${r.clicks} clics, ${r.impressions} impresiones`).join('\n') || '- Ninguna variante no-canónica encontrada en este export.'}

## URLs legacy con impresiones residuales (ya redirigidas)

${legacyRows.length > 0
  ? legacyRows.map((r) => `- \`${r.source}\` → \`${r.target}\` (${r.impressions} impresiones, posición ${r.position})`).join('\n')
  : '- Ninguna URL legacy con redirect confirmado detectada en este export.'}

Ver detalle completo en \`reports/gsc-page-opportunities.csv\`, \`reports/gsc-query-opportunities.csv\`,
\`reports/gsc-product-opportunities.csv\`, \`reports/gsc-domain-variants.csv\` y \`reports/gsc-legacy-urls.csv\`.
`;

  writeFileSync(join(REPORTS_DIR, 'gsc-summary.md'), md, 'utf-8');
}

console.log(`[analyze-gsc] CSV leídos desde "${GSC_DIR}":`);
for (const f of filesRead) {
  console.log(`  - ${f.filename}: ${f.found ? `${f.rows} filas` : 'NO ENCONTRADO (0 filas)'}`);
}
console.log('[analyze-gsc] Reportes generados en reports/:');
console.log('  - gsc-summary.md');
console.log('  - gsc-page-opportunities.csv');
console.log('  - gsc-query-opportunities.csv');
console.log('  - gsc-product-opportunities.csv');
console.log('  - gsc-domain-variants.csv');
console.log('  - gsc-legacy-urls.csv');
process.exit(0);
