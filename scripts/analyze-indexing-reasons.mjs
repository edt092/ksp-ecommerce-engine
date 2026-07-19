#!/usr/bin/env node
// Cruza los 6 motivos de no-indexacion de GSC (informe agregado + exports por URL,
// si el usuario ya los generó) contra el estado real del repo.
// Uso:
//   pnpm run seo:indexing "C:\Users\Dagon\Desktop\KSP-SEO\no_index"
// o vía variable de entorno GSC_INDEXING_DIR. Si el directorio no trae los exports
// por URL (noindex.csv, redirect.csv, 404.csv, crawled-not-indexed.csv,
// duplicate-no-canonical.csv, discovered-not-indexed.csv), el script sigue
// corriendo con lo disponible localmente (proxy) y deja marcado qué falta exportar —
// nunca falla solo por eso. Cuando SÍ hay export real, cada motivo se reconcilia
// URL por URL contra el estado del repo en vez de usar el proxy.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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
function toCsv(header, rows) {
  const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [header.join(','), ...rows.map((r) => header.map((h) => esc(r[h])).join(','))].join('\n') + '\n';
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

// ─── Cargar reportes locales ya generados por audit-indexability.mjs ────────

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

const noindexAudit = loadCsvReport('noindex-audit.csv') || [];
const noindexByUrl = new Map(noindexAudit.map((r) => [r.url, r]));

const productQuality = loadCsvReport('indexable-product-quality.csv') || [];
const productQualityByUrl = new Map(productQuality.map((r) => [r.url, r]));

const canonicalAudit = loadCsvReport('canonical-audit.csv') || [];
const canonicalByUrl = new Map(canonicalAudit.map((r) => [r.url, r]));

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
function extractUrls(rows) {
  if (!rows || !rows.length) return [];
  return rows.map((row) => {
    const urlCol = Object.keys(row).find((k) => /^url$/i.test(k)) || Object.keys(row).find((k) => /url|page|dirección/i.test(k)) || Object.keys(row)[0];
    return { raw: row[urlCol], url: normalizeGscUrl(row[urlCol]), lastCrawled: row['Último rastreo'] || row['Last crawled'] || '' };
  });
}

// ─── 1. reports/indexing-redirect-audit.csv — "Página con redirección" ──────

const redirectRows = [];
if (available.redirect && available.redirect.length) {
  for (const row of available.redirect) {
    const urlCol = Object.keys(row).find((k) => /^url$/i.test(k)) || Object.keys(row)[0];
    const raw = row[urlCol];
    const lastCrawled = row['Último rastreo'] || row['Last crawled'] || '';
    let rawHost = '';
    try { rawHost = new URL(raw).host; } catch { /* ignore */ }
    const isDomainVariant = rawHost && rawHost !== 'www.kronosolopromocionales.com';
    const url = normalizeGscUrl(raw);
    if (isDomainVariant) {
      redirectRows.push({
        url: raw,
        last_crawled: lastCrawled,
        matched_locally: 'true',
        local_type: 'domain_canonicalization',
        local_redirect_target: 'https://www.kronosolopromocionales.com/:splat (netlify.toml force=true)',
        verdict: 'redirect_de_dominio_confirmado_http_o_no_www_a_https_www',
      });
      continue;
    }
    const local = inventoryByUrl.get(url);
    redirectRows.push({
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      local_redirect_target: local?.redirect_target || '',
      verdict: local && local.type === 'redirect'
        ? 'redirect_intencional_confirmado'
        : (local ? `no_es_redirect_localmente_es_${local.type}_revisar` : 'no_encontrado_localmente_revisar'),
    });
  }
} else {
  const redirectEntries = localInventory.filter((r) => r.type === 'redirect');
  for (const r of redirectEntries) {
    redirectRows.push({
      url: r.url,
      last_crawled: '',
      matched_locally: 'true',
      local_type: 'redirect',
      local_redirect_target: r.redirect_target,
      verdict: 'regla_existente_en_repo_pendiente_de_cotejar_con_export_gsc',
    });
  }
}
const redirectHeader = ['url', 'last_crawled', 'matched_locally', 'local_type', 'local_redirect_target', 'verdict'];
writeFileSync(join(REPORTS, 'indexing-redirect-audit.csv'), toCsv(redirectHeader, redirectRows), 'utf-8');
const redirectVerdictCounts = {};
for (const r of redirectRows) redirectVerdictCounts[r.verdict] = (redirectVerdictCounts[r.verdict] || 0) + 1;

// ─── 2. reports/404-reconciliation.csv — "No se ha encontrado (404)" ────────

const notFoundRows = [];
if (available.not_found && available.not_found.length) {
  for (const { url, lastCrawled } of extractUrls(available.not_found)) {
    const local = inventoryByUrl.get(url);
    let verdict;
    if (local && local.type === 'redirect') verdict = 'ya_resuelto_con_redirect_301';
    else if (local && local.exists_in_build === 'true') verdict = 'existe_localmente_confirmar_por_que_gsc_vio_404';
    else if (!local) verdict = 'no_existe_localmente_404_real_pendiente_de_decidir_redirect_o_dejar_asi';
    else verdict = 'revisar_manualmente';
    notFoundRows.push({
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      redirect_target: local?.redirect_target || '',
      verdict,
    });
  }
  const notFoundHeader = ['url', 'last_crawled', 'matched_locally', 'local_type', 'redirect_target', 'verdict'];
  writeFileSync(join(REPORTS, 'gsc-404-reconciliation.csv'), toCsv(notFoundHeader, notFoundRows), 'utf-8');
}

// ─── 3. reports/gsc-noindex-reconciliation.csv — "Excluida por noindex" ─────

const noindexRows = [];
if (available.noindex && available.noindex.length) {
  for (const { url, lastCrawled } of extractUrls(available.noindex)) {
    const local = inventoryByUrl.get(url);
    const localNoindex = noindexByUrl.get(url);
    let verdict;
    if (localNoindex) verdict = 'confirmado_noindex_intencional_local';
    else if (local && local.type === 'redirect') verdict = 'correcto_es_un_redirect_301_gsc_solo_lo_agrupo_bajo_noindex';
    else if (local && local.robots_index === 'true') verdict = 'CONTRADICCION_local_indexable_hoy_pero_gsc_vio_noindex_probable_crawl_desactualizado';
    else if (!local) verdict = 'no_existe_en_inventario_local_probable_historica_o_parametro';
    else verdict = 'revisar_manualmente';
    noindexRows.push({
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      local_robots_index: local?.robots_index || '',
      verdict,
    });
  }
  const noindexHeader = ['url', 'last_crawled', 'matched_locally', 'local_type', 'local_robots_index', 'verdict'];
  writeFileSync(join(REPORTS, 'gsc-noindex-reconciliation.csv'), toCsv(noindexHeader, noindexRows), 'utf-8');
}

// ─── 4. reports/gsc-crawled-not-indexed-analysis.csv ────────────────────────

const crawledRows = [];
if (available.crawled_not_indexed && available.crawled_not_indexed.length) {
  for (const { url, lastCrawled } of extractUrls(available.crawled_not_indexed)) {
    const local = inventoryByUrl.get(url);
    const quality = productQualityByUrl.get(url);
    const canonical = canonicalByUrl.get(url);
    let verdict;
    if (canonical && canonical.duplicate_group) verdict = `posible_duplicado_${canonical.duplicate_group}`;
    else if (quality && Number(quality.content_score) < 45) verdict = 'contenido_debil_score_bajo';
    else if (!local) verdict = 'no_encontrado_localmente';
    else verdict = 'sin_señal_local_clara_probable_decision_de_calidad_de_google';
    crawledRows.push({
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      content_score: quality?.content_score ?? '',
      duplicate_group: canonical?.duplicate_group || '',
      verdict,
    });
  }
  const crawledHeader = ['url', 'last_crawled', 'matched_locally', 'local_type', 'content_score', 'duplicate_group', 'verdict'];
  writeFileSync(join(REPORTS, 'gsc-crawled-not-indexed-analysis.csv'), toCsv(crawledHeader, crawledRows), 'utf-8');
}

// ─── 5. reports/gsc-duplicate-canonical-finding.csv ─────────────────────────

const duplicateRows = [];
if (available.duplicate_no_canonical && available.duplicate_no_canonical.length) {
  for (const { url, lastCrawled } of extractUrls(available.duplicate_no_canonical)) {
    const local = inventoryByUrl.get(url);
    const canonical = canonicalByUrl.get(url);
    duplicateRows.push({
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      local_type: local?.type || '',
      local_canonical: local?.canonical || '',
      belongs_to_known_duplicate_group: canonical?.duplicate_group || 'ninguno',
      verdict: canonical?.duplicate_group
        ? `coincide_con_grupo_detectado_${canonical.duplicate_group}`
        : 'no_coincide_con_ninguno_de_los_6_grupos_detectados_localmente_investigar_manualmente',
    });
  }
  const duplicateHeader = ['url', 'last_crawled', 'matched_locally', 'local_type', 'local_canonical', 'belongs_to_known_duplicate_group', 'verdict'];
  writeFileSync(join(REPORTS, 'gsc-duplicate-canonical-finding.csv'), toCsv(duplicateHeader, duplicateRows), 'utf-8');
}

// ─── 6. reports/discovered-not-indexed-strategy.csv ─────────────────────────
// NOTA: para type=product/blog, internal_links_in NO es fiable (se enlazan vía
// componentes dinámicos que la regex estática de audit-indexability.mjs no resuelve
// — ver internal-link-graph.csv columna link_count_reliable).
const UNRELIABLE_LINK_TYPES = new Set(['product', 'blog']);

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

let strategyRows;
let strategySource;
if (available.discovered_not_indexed && available.discovered_not_indexed.length) {
  strategySource = 'export real de GSC (104 URLs)';
  strategyRows = extractUrls(available.discovered_not_indexed).map(({ url, lastCrawled }) => {
    const local = inventoryByUrl.get(url);
    const quality = productQualityByUrl.get(url);
    const type = local?.type || 'desconocido';
    const linksReliable = !UNRELIABLE_LINK_TYPES.has(type);
    const internalLinks = local ? Number(local.internal_links_in) || 0 : 0;
    const contentScore = quality?.content_score !== undefined && quality?.content_score !== '' ? Number(quality.content_score) : null;
    const r = { type, in_sitemap: local?.in_sitemap ?? 'false', internal_links_in: internalLinks, content_score: contentScore };
    const tier = local ? tierFor(r) : 'P0';
    let action;
    if (!local) {
      action = 'No existe en el inventario local actual — verificar si es una ruta histórica ya eliminada o un parámetro/variante no canónica';
    } else if (local.in_sitemap === 'false') {
      action = 'Verificar por qué no está en el sitemap generado; si aplica, exponerla';
    } else if (!linksReliable) {
      action = contentScore !== null && contentScore < 45
        ? 'Mejorar contenido (score bajo) antes de reforzar enlazado; el conteo de enlaces no es fiable para este tipo'
        : 'Confirmar manualmente que aparece en al menos una grilla/listado (relacionados, categoría, blog index)';
    } else {
      action = internalLinks === 0
        ? 'Añadir al menos 1 enlace interno contextual desde una página con autoridad'
        : 'Monitorear; probablemente sea cuestión de tiempo de rastreo';
    }
    return {
      url,
      last_crawled: lastCrawled,
      matched_locally: local ? 'true' : 'false',
      type,
      in_sitemap: local?.in_sitemap ?? '',
      internal_links_in: linksReliable ? internalLinks : 'n/d (no fiable)',
      content_score: contentScore ?? '',
      tier,
      action,
    };
  });
} else {
  strategySource = 'proxy local (sin export real — TODAS las páginas indexables locales, no las 104 reales)';
  const discoveredCandidates = localInventory
    .filter((r) => r.recommended_state === 'A_INDEXABLE')
    .map((r) => ({ ...r, internal_links_in: Number(r.internal_links_in) || 0, content_score: r.content_score === '' ? null : Number(r.content_score) }))
    .sort((a, b) => a.internal_links_in - b.internal_links_in);
  strategyRows = discoveredCandidates.map((r) => {
    const linksReliable = !UNRELIABLE_LINK_TYPES.has(r.type);
    let action;
    if (r.in_sitemap === 'false') {
      action = 'Verificar por qué no está en el sitemap generado; si aplica, exponerla';
    } else if (!linksReliable) {
      action = r.content_score !== null && r.content_score < 45
        ? 'Mejorar contenido (score bajo) antes de reforzar enlazado; el conteo de enlaces no es fiable para este tipo'
        : 'Confirmar manualmente que aparece en al menos una grilla/listado (relacionados, categoría, blog index)';
    } else {
      action = r.internal_links_in === 0
        ? 'Añadir al menos 1 enlace interno contextual desde una página con autoridad'
        : 'Monitorear; probablemente sea cuestión de tiempo de rastreo';
    }
    return {
      url: r.url,
      last_crawled: '',
      matched_locally: 'true',
      type: r.type,
      in_sitemap: r.in_sitemap,
      internal_links_in: linksReliable ? r.internal_links_in : 'n/d (no fiable)',
      content_score: r.content_score ?? '',
      tier: tierFor(r),
      action,
    };
  });
}
const strategyHeader = ['url', 'last_crawled', 'matched_locally', 'type', 'in_sitemap', 'internal_links_in', 'content_score', 'tier', 'action'];
writeFileSync(join(REPORTS, 'discovered-not-indexed-strategy.csv'), toCsv(strategyHeader, strategyRows), 'utf-8');

const tierCounts = {};
for (const r of strategyRows) tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;

// ─── Resumen en consola ──────────────────────────────────────────────────────

console.log(`[analyze-indexing-reasons] indexing-redirect-audit.csv: ${redirectRows.length} filas — veredictos: ${JSON.stringify(redirectVerdictCounts)}`);
if (available.not_found) console.log(`[analyze-indexing-reasons] gsc-404-reconciliation.csv: ${notFoundRows.length} filas generadas con export real`);
if (available.noindex) console.log(`[analyze-indexing-reasons] gsc-noindex-reconciliation.csv: ${noindexRows.length} filas generadas con export real`);
if (available.crawled_not_indexed) console.log(`[analyze-indexing-reasons] gsc-crawled-not-indexed-analysis.csv: ${crawledRows.length} filas generadas con export real`);
if (available.duplicate_no_canonical) console.log(`[analyze-indexing-reasons] gsc-duplicate-canonical-finding.csv: ${duplicateRows.length} filas generadas con export real`);
console.log(`[analyze-indexing-reasons] discovered-not-indexed-strategy.csv: ${strategyRows.length} filas (fuente: ${strategySource}), distribución de tiers: ${JSON.stringify(tierCounts)}`);
if (missing.length) {
  console.log(`[analyze-indexing-reasons] NOTA: aún faltan estos exports para completar el análisis: ${missing.join(', ')}`);
} else {
  console.log('[analyze-indexing-reasons] Los 6 motivos ya tienen export real por URL — análisis completo, no queda ningún motivo en modo proxy.');
}

process.exit(0);
