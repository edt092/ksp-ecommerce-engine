#!/usr/bin/env node
// plan_accion_seo_ksp_vs_articulospromocionales_ec.md — P1 "reclasificar novedades".
// PROPUESTA, no aplica cambios. Genera reports/novedades-reclassification-proposal.csv
// para revisión humana antes de tocar data/products.json.
//
// Todo producto en `novedades` tiene id con prefijo "novedades-" (275/275,
// verificado) — confirma que es un bucket de importación sin categorizar, no
// una categoría real con identidad propia. Cada producto individualmente
// encaja en una categoría YA EXISTENTE (mug -> mugs-y-termos-personalizados,
// bolígrafo -> boligrafos-publicitarios, etc.) — no hace falta taxonomía
// nueva para este lote.
//
// Método: reglas de palabra clave explícitas y ordenadas (primera que
// matchea gana), no un clasificador estadístico de caja negra — así cada
// fila del reporte es auditable ("por qué esta categoría" = "por esta
// palabra"). Lo que no matchea ninguna regla queda en REQUIRES_REVIEW en
// vez de forzarlo a la categoría más parecida.
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS = join(ROOT, 'reports');

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));
const categorySlugs = new Set(categories.map((c) => c.slug));

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, ''); // strip accents
}

// Orden: más específico primero para evitar que una regla ancha capture
// algo que otra más precisa debería resolver antes.
const RULES = [
  [/\bcalculadora\b/, 'calculadoras'],
  [/\bllavero/, 'llaveros-personalizados'],
  [/\bparaguas\b/, 'paraguas'],
  [/\bmugs?\b|\btermos?\b|\bcafetera\b/, 'mugs-y-termos-personalizados'],
  [/\bboligrafos?\b|\broller\b|\bportaminas\b/, 'boligrafos-publicitarios'],
  [/\bmorral\b|\bbackpack\b|\bbolsa\b|\bsporty bag\b|\bmaletin\b|\bcosmetiquera\b|\bportadocumentos\b/, 'mochilas-y-maletines-personalizados'],
  [/\bspeaker\b|\baudifono|\bcargador inalambrico\b|\bmulticargador\b|\bpuerto usb\b|\bmouse\b|\brastreador\b|\bproyector\b|\bpila recargable\b|\bpowerbank\b|\bsoporte para (movil|celular)\b|\bportacelular\b|\bfunda para mouse\b|\bclip magnetico\b|\bcordon.*portacelular\b|\bcable tipo c\b/, 'tecnologia-promocional'],
  [/\bherramient|\bmartillo\b/, 'herramientas'],
  [/\bcepillo de dientes\b|\bcepillo exfoliante\b|\bmanicure\b|\bmaquillaje\b|\bespejo\b|\bset de brochas\b|\btoalla\b|\brepelente\b|\bmasajeador\b/, 'cuidado-personal'],
  [/\bantiestres\b|\bpop it\b/, 'antiestres'],
  [/\borganizador de escritorio\b|\borganizador multiusos\b|\bportaboligrafos\b|\bcalendario\b|\blibreta\b|\bsticky set\b|\bmemo pad\b|\btabla clip\b|\btabla anotadora\b|\bresaltador|\bborrador\b/, 'articulos-de-oficina-personalizados'],
  [/\bset de cocina\b|\bportacomidas\b|\bcoge ollas\b|\bmolde para paletas\b|\bset de cubiertos\b|\bventilador\b/, 'hogar'],
  [/\bnevera\b|\bcooler\b/, 'hogar'],
  [/\bset ecologico\b/, 'ecologia'],
  [/\bpito\b/, 'deportes'],
  [/\bcandado\b|\bportarretrato\b|\bjoyero\b|\balcancia\b|\bcosturero\b|\bset de viaje\b|\bmini frascos travel\b|\bidentificador de maletas\b|\btravel lock\b|\bcobija\b|\bmanta de viaje\b|\bset de bano\b|\bset de botellas de viaje\b/, 'hogar'],
];

for (const [, slug] of RULES) {
  if (!categorySlugs.has(slug)) throw new Error(`Regla apunta a categoría inexistente: ${slug}`);
}

const novedades = categories.find((c) => c.slug === 'novedades');
const items = products.filter((p) => p.categoryId === novedades.id);

const rows = [];
const counts = new Map();
for (const p of items) {
  const name = normalize(p.name.replace(/\bnuevo\b/i, '').trim());
  let matched = null;
  let matchedRule = '';
  for (const [regex, slug] of RULES) {
    if (regex.test(name)) { matched = slug; matchedRule = regex.source; break; }
  }
  const suggested = matched || 'REQUIRES_REVIEW';
  counts.set(suggested, (counts.get(suggested) || 0) + 1);
  rows.push({
    slug: p.slug,
    name: p.name,
    id_prefix_novedades: p.id.startsWith('novedades-'),
    suggested_category: suggested,
    matched_rule: matchedRule,
  });
}

function csvField(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(header, data) {
  return [header.join(','), ...data.map((r) => header.map((h) => csvField(r[h])).join(','))].join('\n') + '\n';
}
writeFileSync(
  join(REPORTS, 'novedades-reclassification-proposal.csv'),
  toCsv(['slug', 'name', 'id_prefix_novedades', 'suggested_category', 'matched_rule'], rows),
  'utf-8'
);

console.log(`[audit-novedades-reclassification] ${items.length} productos en novedades`);
console.log('[audit-novedades-reclassification] Distribución de la propuesta:');
for (const [slug, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${slug}: ${n}`);
}
console.log('[audit-novedades-reclassification] PROPUESTA SOLAMENTE — no se modificó data/products.json.');
console.log('[audit-novedades-reclassification] Reporte: reports/novedades-reclassification-proposal.csv');
