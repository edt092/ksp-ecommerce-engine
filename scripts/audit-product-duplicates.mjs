#!/usr/bin/env node
// Fase 2 del plan SEO 2026-07-19: audita candidatos a producto duplicado.
//
// Agrupa productos por el número final del slug (heurística de SKU) y, para
// cada grupo con más de un slug, compara nombre/imagen/categoría/specs para
// clasificar el par. NO agrupa únicamente por número — cada par se evalúa con
// señales adicionales antes de proponer cualquier acción.
//
// Limitaciones explícitas de este entorno (documentadas, no ocultas):
//   - No hay GSC_DIR configurado aquí -> gsc_a/gsc_b quedan en 0 para todas
//     las filas. No representa "sin impresiones", representa "sin dato".
//   - reports/internal-link-graph.csv marca link_count_reliable=false para
//     productos (se enlazan vía ProductCard.tsx, un componente dinámico que
//     la regex estática no resuelve) -> no se puede confirmar de forma local
//     "cuál slug tiene enlaces reales", uno de los requisitos explícitos del
//     plan antes de cualquier redirect.
//   - El esquema de data/products.json no tiene campos estructurados de
//     material/técnica/dimensiones/stock -> material_difference y
//     spec_difference son heurísticas por texto (nombre + descripción), no
//     verificación estructurada. Cuando la heurística no encuentra señal se
//     deja en "unknown", no en "false".
//
// Por estas dos limitaciones, este script SOLO CLASIFICA. No genera ni
// aplica ningún redirect — eso requiere confirmar manualmente en GSC/analytics
// cuál slug de cada par tiene tráfico e IN, tal como exige el plan.
//
// Genera: reports/product-duplicate-candidates.csv

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');

process.on('uncaughtException', (err) => {
  console.error(`[audit-product-duplicates] ERROR DE CÓDIGO: ${err.message}`);
  process.exit(1);
});

mkdirSync(REPORTS, { recursive: true });

function csvField(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(header, rows) {
  return [header.join(','), ...rows.map((r) => header.map((h) => csvField(r[h])).join(','))].join('\n') + '\n';
}

// ─── Normalización de texto ──────────────────────────────────────────────────

function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function normalizeName(name) {
  return stripAccents(String(name || '').toLowerCase())
    .replace(/\bnuevo\b/g, '')
    .replace(/\boferta\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Coeficiente de Dice sobre bigramas de caracteres — dependency-free, estable
// para strings cortos como nombres de producto.
function bigrams(s) {
  const b = new Set();
  for (let i = 0; i < s.length - 1; i++) b.add(s.slice(i, i + 2));
  return b;
}
function diceSimilarity(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const ba = bigrams(na);
  const bb = bigrams(nb);
  let overlap = 0;
  for (const g of ba) if (bb.has(g)) overlap++;
  return (2 * overlap) / (ba.size + bb.size || 1);
}

// Extrae tokens numéricos con unidad (650ml, 7oz, 30cm...) para detectar
// variantes de tamaño/capacidad/volumen declaradas explícitamente en el nombre.
const SPEC_RE = /(\d+(?:[.,]\d+)?)\s?(ml|oz|cm|mm|gr|kg|lt?|litros?|pulgadas?|w|gb|mah)\b/gi;
function extractSpecs(text) {
  const specs = new Set();
  for (const m of String(text || '').toLowerCase().matchAll(SPEC_RE)) {
    specs.add(`${m[1].replace(',', '.')}${m[2]}`);
  }
  return specs;
}
function specDifference(nameA, nameB) {
  const sa = extractSpecs(nameA);
  const sb = extractSpecs(nameB);
  if (sa.size === 0 || sb.size === 0) return 'unknown';
  const same = sa.size === sb.size && [...sa].every((s) => sb.has(s));
  return same ? false : true;
}

const MATERIALS = [
  'algodon', 'poliester', 'metal', 'aluminio', 'plastico', 'pvc', 'cuero',
  'silicona', 'madera', 'vidrio', 'acero', 'bambu', 'yute', 'ceramica',
  'neopreno', 'nylon', 'rpet', 'corcho', 'papel', 'carton',
];
function extractMaterials(text) {
  const t = stripAccents(String(text || '').toLowerCase());
  return new Set(MATERIALS.filter((m) => t.includes(m)));
}
function materialDifference(a, b) {
  const ma = extractMaterials(`${a.name} ${a.description || ''}`);
  const mb = extractMaterials(`${b.name} ${b.description || ''}`);
  if (ma.size === 0 || mb.size === 0) return 'unknown';
  const same = ma.size === mb.size && [...ma].every((m) => mb.has(m));
  return same ? false : true;
}

// ─── Cargar datos ─────────────────────────────────────────────────────────

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const bySlug = new Map(products.map((p) => [p.slug, p]));

// ─── Agrupar por número final del slug ──────────────────────────────────────

const byTrailingNumber = new Map();
for (const p of products) {
  const m = (p.slug || '').match(/-(\d+)$/);
  if (!m) continue;
  const num = m[1];
  if (!byTrailingNumber.has(num)) byTrailingNumber.set(num, []);
  byTrailingNumber.get(num).push(p);
}
const groups = [...byTrailingNumber.entries()].filter(([, arr]) => arr.length > 1);

// ─── Clasificar cada par dentro de cada grupo ───────────────────────────────

const rows = [];
const counts = { EXACT_DUPLICATE: 0, LIKELY_DUPLICATE: 0, LEGITIMATE_VARIANT: 0, DIFFERENT_PRODUCT: 0, INSUFFICIENT_DATA: 0 };

for (const [num, members] of groups) {
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];

      const nameSim = diceSimilarity(a.name, b.name);
      const contentA = `${a.shortDescription || ''} ${a.story || ''}`.slice(0, 600);
      const contentB = `${b.shortDescription || ''} ${b.story || ''}`.slice(0, 600);
      const contentSim = diceSimilarity(contentA, contentB);
      const sameImages = (a.images?.[0] || '') !== '' && a.images?.[0] === b.images?.[0];
      const sameCategory = a.categoryId === b.categoryId;
      const specDiff = specDifference(a.name, b.name);
      const materialDiff = materialDifference(a, b);

      let classification;
      let confidence;

      if (specDiff === true) {
        // El nombre declara explícitamente una medida distinta (650ml vs 690ml,
        // por ejemplo) — se trata como variante aunque compartan imagen, pero
        // se marca requires_human_review porque compartir imagen con spec
        // distinta también podría ser un error de catálogo, no una variante real.
        classification = 'LEGITIMATE_VARIANT';
        confidence = 0.55;
      } else if (sameImages && nameSim >= 0.82 && materialDiff !== true && sameCategory) {
        classification = 'EXACT_DUPLICATE';
        // Techo conservador: sin datos de GSC ni de enlaces internos reales
        // localmente, no se puede alcanzar con certeza el umbral de 0.98 que
        // exige el plan para autorizar un redirect automático.
        confidence = Math.min(0.95, 0.6 + 0.4 * nameSim);
      } else if (sameImages && nameSim >= 0.55) {
        classification = 'LIKELY_DUPLICATE';
        confidence = Math.min(0.85, 0.4 + 0.4 * nameSim);
      } else if (materialDiff === true || (!sameImages && nameSim >= 0.4 && nameSim < 0.82)) {
        classification = 'LEGITIMATE_VARIANT';
        confidence = 0.5;
      } else if (!sameImages && nameSim < 0.35) {
        classification = 'DIFFERENT_PRODUCT';
        confidence = 0.7;
      } else {
        classification = 'INSUFFICIENT_DATA';
        confidence = 0.3;
      }

      counts[classification]++;

      const preferNonNuevo = (s) => !/-nuevo-|nuevo-\d+$/.test(s) && !/\bnuevo\b/i.test(bySlug.get(s)?.name || '');
      let suggestedCanonical = '';
      let suggestedRedirect = '';
      if (classification === 'EXACT_DUPLICATE' || classification === 'LIKELY_DUPLICATE') {
        const aIsNonNuevo = preferNonNuevo(a.slug);
        const bIsNonNuevo = preferNonNuevo(b.slug);
        if (aIsNonNuevo && !bIsNonNuevo) {
          suggestedCanonical = a.slug;
          suggestedRedirect = b.slug;
        } else if (bIsNonNuevo && !aIsNonNuevo) {
          suggestedCanonical = b.slug;
          suggestedRedirect = a.slug;
        } else {
          // Ambos o ninguno tiene "nuevo" — no hay señal de estabilidad local
          // suficiente (requiere GSC/enlaces reales, ver limitaciones arriba).
          suggestedCanonical = 'REQUIERE_REVISION_MANUAL';
          suggestedRedirect = 'REQUIERE_REVISION_MANUAL';
        }
      }

      rows.push({
        sku: num,
        slug_a: a.slug,
        slug_b: b.slug,
        name_similarity: nameSim.toFixed(3),
        content_similarity: contentSim.toFixed(3),
        same_images: sameImages,
        same_category: sameCategory,
        material_difference: materialDiff,
        spec_difference: specDiff,
        gsc_a: 0,
        gsc_b: 0,
        classification,
        suggested_canonical: suggestedCanonical,
        suggested_redirect: suggestedRedirect,
        confidence: confidence.toFixed(2),
        requires_human_review: classification !== 'DIFFERENT_PRODUCT',
      });
    }
  }
}

const header = [
  'sku', 'slug_a', 'slug_b', 'name_similarity', 'content_similarity', 'same_images',
  'same_category', 'material_difference', 'spec_difference', 'gsc_a', 'gsc_b',
  'classification', 'suggested_canonical', 'suggested_redirect', 'confidence',
  'requires_human_review',
];
writeFileSync(join(REPORTS, 'product-duplicate-candidates.csv'), toCsv(header, rows));

const autoEligible = rows.filter(
  (r) => r.classification === 'EXACT_DUPLICATE' && Number(r.confidence) >= 0.98
);

console.log(`[audit-product-duplicates] Grupos con número final compartido: ${groups.length}`);
console.log(`[audit-product-duplicates] Pares evaluados: ${rows.length}`);
console.log('[audit-product-duplicates] Clasificación:', counts);
console.log(
  `[audit-product-duplicates] Pares que cumplirían el umbral de auto-redirect (EXACT_DUPLICATE, confidence>=0.98): ${autoEligible.length}`
);
console.log(
  '[audit-product-duplicates] NO se implementó ningún redirect en esta pasada: ' +
  'este entorno no tiene GSC_DIR ni datos fiables de enlaces internos hacia productos ' +
  '(reports/internal-link-graph.csv marca link_count_reliable=false para /productos/), ' +
  'ambos requeridos explícitamente por el plan antes de redirigir. ' +
  'Reporte generado en reports/product-duplicate-candidates.csv para revisión humana.'
);
