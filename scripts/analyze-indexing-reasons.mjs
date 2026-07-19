#!/usr/bin/env node
// Cruza los 6 motivos de no-indexacion de GSC (informe agregado + exports por URL,
// si el usuario ya los generó) contra el estado real del repo.
// Uso:
//   pnpm run seo:indexing "C:\Users\Dagon\Desktop\KSP-SEO\no_index"
// o vía variable de entorno GSC_INDEXING_DIR. Si el directorio no trae los exports
// por URL (noindex.csv, redirect.csv, 404.csv, crawled-not-indexed.csv,
// duplicate-no-canonical.csv, discovered-not-indexed.csv), el script sigue
// corriendo con lo disponible localmente y deja marcado qué falta exportar —
// nunca falla solo por eso.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');
mkdirSync(REPORTS, { recursive: true });

process.on('uncaughtException', (err) => {
  console.error(`[analyze-indexing-reasons] ERROR DE CÓDIGO: ${err.message}`);
  process.exit(1);
});

const dir = process.argv[2] || process.env.GSC_INDEXING_DIR;
if (!dir) {
  console.error('[analyze-indexing-reasons] Falta el directorio de exportaciones de GSC.');
  console.error('Uso: pnpm run seo:indexing "C:\\ruta\\a\\no_index"  (o define GSC_INDEXING_DIR)');
  process.exit(1);
}
if (!existsSync(dir)) {
  console.error(`[analyze-indexing-reasons] El directorio no existe: ${dir}`);
  process.exit(1);
}

function parseCsv(text) {
  const clean = text.replace(/^﻿/, '');
  const lines = clean.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) return [];
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    header.forEach((h, i) => { row[h.trim()] = (cells[i] ?? '').trim(); });
    return row;
  });
}
function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const perReasonFiles = {
  noindex: 'noindex.csv',
  redirect: 'redirect.csv',
  not_found: '404.csv',
  crawled_not_indexed: 'crawled-not-indexed.csv',
  duplicate_no_canonical: 'duplicate-no-canonical.csv',
  discovered_not_indexed: 'discovered-not-indexed.csv',
};

const available = {};
const missing = [];
for (const [key, filename] of Object.entries(perReasonFiles)) {
  const full = join(dir, filename);
  if (existsSync(full)) {
    available[key] = parseCsv(readFileSync(full, 'utf-8'));
  } else {
    missing.push(filename);
  }
}

console.log(`[analyze-indexing-reasons] Directorio: ${dir}`);
console.log(`[analyze-indexing-reasons] Exports por URL encontrados: ${Object.keys(available).join(', ') || '(ninguno)'}`);
if (missing.length) {
  console.log(`[analyze-indexing-reasons] Exports por URL faltantes (ver docs/gsc-indexing-export-checklist.md): ${missing.join(', ')}`);
}

// ─── Cargar inventario local ya generado por audit-indexability.mjs ─────────

function loadCsvReport(name) {
  const full = join(REPORTS, name);
  if (!existsSync(full)) return null;
  return parseCsv(readFileSync(full, 'utf-8'));
}

const localInventory = loadCsvReport('local-indexability-inventory.csv');
if (!localInventory) {
  console.error('[analyze-indexing-reasons] Falta reports/local-indexability-inventory.csv — ejecuta primero "pnpm run seo:indexability".');
  process.exit(1);
}
const inventoryByUrl = new Map(localInventory.map((r) => [r.url, r]));

function normalizeGscUrl(u) {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    let path = parsed.pathname;
    if (!path.endsWith('/') && !path.includes('.')) path += '/';
    return `https://www.kronosolopromocionales.com${path}`;
  } catch {
    return u;
  }
}

// ─── reports/indexing-redirect-audit.csv ────────────────────────────────────
// Si hay export real de "redirect.csv" lo usamos; si no, auditamos la salud
// general de las reglas de redirect ya presentes en el repo como base de análisis.

const redirectRows = [];
if (available.redirect && available.redirect.length) {
  for (const row of available.redirect) {
    const urlCol = Object.keys(row).find((k) => /url|page|dirección/i.test(k)) || Object.keys(row)[0];
    const url = normalizeGscUrl(row[urlCol]);
    const local = inventoryByUrl.get(url);
    redirectRows.push({
      url,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      local_redirect_target: local?.redirect_target || '',
      expected_status: local ? 300 : '',
      verdict: local && local.type === 'redirect' ? 'redirect_intencional_confirmado' : (local ? 'no_es_redirect_localmente_revisar' : 'no_encontrado_localmente_revisar'),
    });
  }
} else {
  // Fallback: auditar la salud de las reglas ya declaradas en public/_redirects/netlify.toml
  const redirectEntries = localInventory.filter((r) => r.type === 'redirect');
  for (const r of redirectEntries) {
    redirectRows.push({
      url: r.url,
      matched_locally: 'true',
      local_type: 'redirect',
      local_redirect_target: r.redirect_target,
      expected_status: 301,
      verdict: 'regla_existente_en_repo_pendiente_de_cotejar_con_export_gsc',
    });
  }
}
const redirectHeader = ['url', 'matched_locally', 'local_type', 'local_redirect_target', 'expected_status', 'verdict'];
writeFileSync(join(REPORTS, 'indexing-redirect-audit.csv'),
  [redirectHeader.join(','), ...redirectRows.map((r) => redirectHeader.map((h) => {
    const v = String(r[h] ?? '');
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(','))].join('\n') + '\n', 'utf-8');

// ─── reports/discovered-not-indexed-strategy.csv (P0-P4) ────────────────────
// Sin el export de las 104 URLs concretas, priorizamos con lo que sí es local y
// verificable: candidatos plausibles = productos/páginas indexables (recommended
// A) con pocos internal_links_in y/o fuera del sitemap, que son exactamente el
// perfil que Google clasifica como "descubierta, sin indexar" por bajo crawl budget.

// NOTA: para type=product/blog, internal_links_in NO es fiable (se enlazan vía
// componentes dinámicos que la regex estática de audit-indexability.mjs no resuelve
// — ver internal-link-graph.csv columna link_count_reliable). Para esos tipos, el
// tier se decide solo por in_sitemap + content_score; internal_links_in=0 no basta
// para escalar prioridad porque no distingue "sin enlaces" de "no detectado".
const UNRELIABLE_LINK_TYPES = new Set(['product', 'blog']);

const discoveredCandidates = localInventory
  .filter((r) => r.recommended_state === 'A_INDEXABLE')
  .map((r) => ({ ...r, internal_links_in: Number(r.internal_links_in) || 0, content_score: r.content_score === '' ? null : Number(r.content_score) }))
  .sort((a, b) => a.internal_links_in - b.internal_links_in);

function tierFor(r) {
  const linksReliable = !UNRELIABLE_LINK_TYPES.has(r.type);
  if (r.in_sitemap === 'false') return 'P0';
  if (!linksReliable) {
    if (r.content_score !== null && r.content_score < 45) return 'P2';
    return 'P4';
  }
  if (r.internal_links_in === 0 && (r.content_score === null || r.content_score >= 70)) return 'P1';
  if (r.internal_links_in === 0) return 'P2';
  if (r.internal_links_in <= 2) return 'P3';
  return 'P4';
}

const strategyRows = discoveredCandidates.map((r) => {
  const linksReliable = !UNRELIABLE_LINK_TYPES.has(r.type);
  let action;
  if (r.in_sitemap === 'false') {
    action = 'Verificar por qué no está en el sitemap generado; si aplica, exponerla';
  } else if (!linksReliable) {
    action = r.content_score !== null && r.content_score < 45
      ? 'Mejorar contenido (score bajo) antes de reforzar enlazado; el conteo de enlaces no es fiable para este tipo'
      : 'Confirmar manualmente que aparece en al menos una grilla/listado (relacionados, categoría, blog index) — el conteo estático no lo puede verificar';
  } else {
    action = r.internal_links_in === 0
      ? 'Añadir al menos 1 enlace interno contextual desde una página con autoridad (categoría, blog o home)'
      : 'Monitorear; probablemente sea cuestión de tiempo de rastreo';
  }
  return {
    url: r.url,
    type: r.type,
    in_sitemap: r.in_sitemap,
    internal_links_in: linksReliable ? r.internal_links_in : 'n/d (no fiable)',
    content_score: r.content_score ?? '',
    tier: tierFor(r),
    action,
  };
});
const strategyHeader = ['url', 'type', 'in_sitemap', 'internal_links_in', 'content_score', 'tier', 'action'];
writeFileSync(join(REPORTS, 'discovered-not-indexed-strategy.csv'),
  [strategyHeader.join(','), ...strategyRows.map((r) => strategyHeader.map((h) => String(r[h] ?? '')).join(','))].join('\n') + '\n', 'utf-8');

const tierCounts = {};
for (const r of strategyRows) tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;

console.log(`[analyze-indexing-reasons] indexing-redirect-audit.csv: ${redirectRows.length} filas (${available.redirect ? 'basado en export real de GSC' : 'basado en reglas locales, PENDIENTE de cotejar 1 a 1 con export de GSC'})`);
console.log(`[analyze-indexing-reasons] discovered-not-indexed-strategy.csv: ${strategyRows.length} candidatos locales, distribución de tiers: ${JSON.stringify(tierCounts)}`);
console.log('[analyze-indexing-reasons] NOTA: este es un análisis por proxy local. Para conclusiones definitivas sobre las 593 URL reales, exporta las tablas por URL de GSC (ver docs/gsc-indexing-export-checklist.md) y vuelve a correr este script apuntando al mismo directorio.');

process.exit(0);
