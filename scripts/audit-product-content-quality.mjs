#!/usr/bin/env node
// Fase 10 del plan SEO 2026-07-19: productos delgados y contenido repetitivo.
//
// Calcula, para cada producto indexable: palabras, fórmulas de description
// repetidas (mismo criterio que scripts/audit-metadata-quality.mjs),
// presencia de imagen real, cantidad de features/useCases, menciones de
// material/técnica de marcación, lenguaje promocional genérico, lugares
// repetidos mecánicamente, y cruza con datos reales de GSC
// (reports/gsc-product-opportunities.csv) cuando existen.
//
// Clasifica A (indexable y diferencial) / B (mejorar) / C (consolidar) /
// D (mantener noindex) / E (revisar manualmente).
//
// Genera: reports/product-content-quality.csv
//
// Este script SOLO AUDITA Y CLASIFICA. No reescribe ningún producto — la
// selección de la cohorte piloto y la mejora de contenido son un paso
// manual posterior, revisado uno por uno.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');
mkdirSync(REPORTS, { recursive: true });

function csvField(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(header, rows) {
  return [header.join(','), ...rows.map((r) => header.map((h) => csvField(r[h])).join(','))].join('\n') + '\n';
}
function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
function wordCount(text) {
  return normalize(text).split(/\s+/).filter(Boolean).length;
}

// Frases/patrones de lenguaje promocional genérico (repetidos sin dato
// diferencial — ver hallazgos de Fase 11 sobre fórmulas de description).
const GENERIC_PHRASES = [
  'ideal para', 'perfecto para', 'de alta calidad', 'excelente opcion',
  'cotiza ahora', 'cotiza ya', 'no esperes mas', 'aprovecha esta oferta',
];
const PLACE_NAMES = ['quito', 'guayaquil', 'cuenca', 'ambato', 'manta', 'ecuador'];
const MATERIAL_KEYWORDS = ['metal', 'plastico', 'bambu', 'algodon', 'acero', 'vidrio', 'silicona', 'cuero', 'pvc', 'ceramica', 'madera', 'poliester'];
const TECHNIQUE_KEYWORDS = ['serigrafia', 'grabado laser', 'tampografia', 'bordado', 'sublimacion', 'full color', 'estampado'];

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const categoryById = new Map(categories.map((c) => [c.id, c]));

// --- GSC real (si existe el export) -----------------------------------
const gscBySlug = new Map();
const gscPath = join(REPORTS, 'gsc-product-opportunities.csv');
if (existsSync(gscPath)) {
  const lines = readFileSync(gscPath, 'utf-8').split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  for (const line of lines.slice(1)) {
    const cols = line.split(',');
    const row = {};
    header.forEach((h, i) => (row[h] = cols[i]));
    if (row.slug) gscBySlug.set(row.slug, row);
  }
}

const indexable = products.filter((p) => p.is_ai_optimized === true);

// Firma de fórmula de description (mismo criterio que Fase 11) para
// detectar candidatos a "C — consolidar" por plantilla sin diferencial.
const descFormulaCounts = new Map();
for (const p of indexable) {
  const desc = p.seoDescription || p.shortDescription || '';
  let sig = normalize(desc);
  const name = normalize(p.name);
  if (name) sig = sig.split(name).join('{NOMBRE}');
  descFormulaCounts.set(sig, (descFormulaCounts.get(sig) || 0) + 1);
}

const rows = [];
for (const p of indexable) {
  const category = categoryById.get(p.categoryId);
  const story = p.story || '';
  const description = p.description || p.seoDescription || '';
  const shortDescription = p.shortDescription || '';
  const fullText = [story, description, shortDescription, (p.features || []).join(' '), (p.useCases || []).join(' ')].join(' ');
  const words = wordCount(fullText);

  const normText = normalize(fullText);
  const genericHits = GENERIC_PHRASES.filter((g) => normText.includes(g)).length;
  const placeHits = PLACE_NAMES.filter((pl) => normText.includes(pl)).length;
  const materialMentions = MATERIAL_KEYWORDS.filter((m) => normText.includes(m)).length;
  const techniqueMentions = TECHNIQUE_KEYWORDS.filter((t) => normText.includes(t)).length;

  const hasRealImage = Array.isArray(p.images) && p.images.length > 0 && !!p.images[0];
  const featuresCount = Array.isArray(p.features) ? p.features.length : 0;
  const useCasesCount = Array.isArray(p.useCases) ? p.useCases.length : 0;

  const descSig = (() => {
    let sig = normalize(p.seoDescription || p.shortDescription || '');
    const name = normalize(p.name);
    if (name) sig = sig.split(name).join('{NOMBRE}');
    return sig;
  })();
  const formulaCount = descFormulaCounts.get(descSig) || 1;

  const gsc = gscBySlug.get(p.slug);
  const gscImpressions = gsc ? Number(gsc.impressions) || 0 : 0;
  const gscPosition = gsc && gsc.position ? Number(gsc.position) : null;
  const gscClicks = gsc ? Number(gsc.clicks) || 0 : 0;

  // --- Clasificación ----------------------------------------------------
  let classification;
  let reason;
  if (words < 60 || !hasRealImage) {
    classification = 'E';
    reason = !hasRealImage ? 'sin imagen real' : 'menos de 60 palabras — revisar manualmente';
  } else if (formulaCount >= 5 && materialMentions === 0 && techniqueMentions === 0) {
    classification = 'C';
    reason = `fórmula de description repetida ${formulaCount}x sin mención de material/técnica`;
  } else if (words >= 60 && words < 120 && (materialMentions === 0 || techniqueMentions === 0)) {
    classification = 'B';
    reason = 'contenido corto y sin material o técnica de marcación mencionados';
  } else if (genericHits >= 3 && materialMentions === 0) {
    classification = 'B';
    reason = 'lenguaje promocional genérico predominante, sin dato diferencial';
  } else {
    classification = 'A';
    reason = 'contenido diferencial — longitud, material y/o técnica presentes';
  }

  rows.push({
    slug: p.slug,
    name: p.name,
    category: category?.name || p.categoryId || '',
    word_count: words,
    features_count: featuresCount,
    use_cases_count: useCasesCount,
    has_real_image: hasRealImage,
    material_mentions: materialMentions,
    technique_mentions: techniqueMentions,
    generic_phrase_hits: genericHits,
    place_name_hits: placeHits,
    description_formula_repeat_count: formulaCount,
    quality_score: p.quality_score ?? '',
    last_ai_update: p.last_ai_update ? p.last_ai_update.slice(0, 10) : '',
    gsc_impressions: gscImpressions,
    gsc_clicks: gscClicks,
    gsc_position: gscPosition ?? '',
    classification,
    classification_reason: reason,
  });
}

const header = [
  'slug', 'name', 'category', 'word_count', 'features_count', 'use_cases_count',
  'has_real_image', 'material_mentions', 'technique_mentions', 'generic_phrase_hits',
  'place_name_hits', 'description_formula_repeat_count', 'quality_score',
  'last_ai_update', 'gsc_impressions', 'gsc_clicks', 'gsc_position',
  'classification', 'classification_reason',
];
writeFileSync(join(REPORTS, 'product-content-quality.csv'), toCsv(header, rows));

// --- Resumen -----------------------------------------------------------
const byClass = {};
rows.forEach((r) => (byClass[r.classification] = (byClass[r.classification] || 0) + 1));
console.log(`[audit-product-content-quality] Productos indexables auditados: ${rows.length}`);
console.log('[audit-product-content-quality] Distribución por clasificación:', byClass);

const pilotCandidates = rows
  .filter((r) => r.gsc_impressions > 0 && r.gsc_position !== '' && Number(r.gsc_position) <= 20 && (r.classification === 'B' || r.classification === 'C' || r.classification === 'E'))
  .sort((a, b) => b.gsc_impressions - a.gsc_impressions);
console.log(`\n[audit-product-content-quality] Candidatos a cohorte piloto (impresiones>0, top20, clasificación B/C/E): ${pilotCandidates.length}`);
pilotCandidates.slice(0, 20).forEach((r) =>
  console.log(`  ${r.gsc_impressions} impresiones | pos ${r.gsc_position} | ${r.classification} | ${r.slug}`)
);

console.log('\n[audit-product-content-quality] Reporte generado: reports/product-content-quality.csv');
