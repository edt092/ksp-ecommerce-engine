#!/usr/bin/env node
// Fase 5 del plan SEO 2026-07-19: audita la estrategia de lastmod del sitemap.
//
// Mide, para cada tipo de ruta, si el lastmod usado en src/app/sitemap.ts
// proviene de un dato real por-item o de un fallback compartido (antes:
// BUILD_DATE hardcodeado aplicado a miles de URL sin dato real detrás).
//
// Genera: reports/sitemap-lastmod-audit.csv
//
// Este script SOLO AUDITA — no modifica sitemap.ts.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
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
function gitLastModified(relPath) {
  try {
    return execSync(`git log -1 --format=%ad --date=short -- "${relPath}"`, { cwd: ROOT, encoding: 'utf-8' }).trim() || null;
  } catch {
    return null;
  }
}

const products = JSON.parse(readFileSync(join(ROOT, 'data', 'products.json'), 'utf-8'));
const blogPosts = JSON.parse(readFileSync(join(ROOT, 'data', 'blog', 'posts.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(ROOT, 'data', 'categories.json'), 'utf-8'));

const rows = [];

// --- Productos -------------------------------------------------------------
const indexableProducts = products.filter((p) => p.is_ai_optimized === true);
for (const p of indexableProducts) {
  const hasRealDate = !!p.last_ai_update;
  rows.push({
    url: `/productos/${p.slug}/`,
    type: 'producto',
    real_date_field: hasRealDate ? 'last_ai_update' : 'ninguno',
    real_date_value: hasRealDate ? p.last_ai_update.slice(0, 10) : '',
    current_sitemap_source: hasRealDate ? 'campo real (last_ai_update, sin usar hoy en sitemap.ts)' : 'BUILD_DATE (fallback compartido)',
    is_real: hasRealDate,
    recommended_action: hasRealDate ? 'usar last_ai_update en sitemap.ts' : 'omitir lastmod (sin dato real)',
  });
}

// --- Blog --------------------------------------------------------------
for (const p of blogPosts) {
  const dateVal = p.dateModified || p.date || null;
  rows.push({
    url: `/blog/${p.slug}/`,
    type: 'blog',
    real_date_field: p.dateModified ? 'dateModified' : (p.date ? 'date' : 'ninguno'),
    real_date_value: dateVal ? dateVal.slice(0, 10) : '',
    current_sitemap_source: dateVal ? 'campo real (ya en uso)' : 'BUILD_DATE (fallback compartido)',
    is_real: !!dateVal,
    recommended_action: dateVal ? 'sin cambio — ya usa dato real' : 'omitir lastmod (sin dato real)',
  });
}

// --- Categorías --------------------------------------------------------
const categoriesFileDate = gitLastModified('data/categories.json');
for (const c of categories) {
  rows.push({
    url: `/categorias/${c.slug}/`,
    type: 'categoria',
    real_date_field: 'ninguno (categories.json no tiene campo de fecha)',
    real_date_value: '',
    current_sitemap_source: 'BUILD_DATE (fallback compartido, todas las categorías comparten la misma fecha)',
    is_real: false,
    recommended_action: `omitir lastmod (fecha de archivo git ${categoriesFileDate} es real pero idéntica para las 37 categorías — no representa fecha real de contenido individual)`,
  });
}

// --- Páginas estáticas ---------------------------------------------------
const staticPages = [
  { url: '/', file: 'src/app/page.tsx' },
  { url: '/contacto/', file: 'src/app/contacto/page.tsx' },
  { url: '/nosotros/', file: 'src/app/nosotros/page.tsx' },
  { url: '/blog/', file: 'src/app/blog/page.tsx' },
  { url: '/catalogos-digitales/', file: 'src/app/catalogos-digitales/page.tsx' },
  { url: '/politica-de-privacidad/', file: 'src/app/politica-de-privacidad/page.tsx' },
  { url: '/productos-promocionales-ecuador/', file: 'src/app/productos-promocionales-ecuador/page.tsx' },
  { url: '/regalos-corporativos/', file: 'src/app/regalos-corporativos/page.tsx' },
  { url: '/articulos-promocionales/', file: 'src/app/articulos-promocionales/page.tsx' },
  { url: '/material-publicitario/', file: 'src/app/material-publicitario/page.tsx' },
  { url: '/merchandising-corporativo/', file: 'src/app/merchandising-corporativo/page.tsx' },
  { url: '/parlantes-bluetooth/', file: 'src/app/parlantes-bluetooth/page.tsx' },
  { url: '/audifonos-promocionales/', file: 'src/app/audifonos-promocionales/page.tsx' },
  { url: '/soportes-para-celular/', file: 'src/app/soportes-para-celular/page.tsx' },
];
for (const sp of staticPages) {
  const gitDate = gitLastModified(sp.file);
  rows.push({
    url: sp.url,
    type: 'estatica',
    real_date_field: 'git log del archivo de la página',
    real_date_value: gitDate || '',
    current_sitemap_source: 'BUILD_DATE o fecha hardcodeada puntual (según la página)',
    is_real: !!gitDate,
    recommended_action: gitDate ? `usar fecha real de git (${gitDate}) en vez de BUILD_DATE` : 'omitir lastmod',
  });
}

// --- Ciudades ------------------------------------------------------------
const geoDataFileDate = gitLastModified('data/geo-data.js');
const ciudadSlugs = ['quito', 'guayaquil', 'cuenca', 'manta', 'ambato'];
for (const slug of ciudadSlugs) {
  rows.push({
    url: `/productos-promocionales-ecuador/${slug}/`,
    type: 'ciudad',
    real_date_field: 'ninguno (geo-data.js no tiene campo de fecha por ciudad)',
    real_date_value: '',
    current_sitemap_source: 'BUILD_DATE (fallback compartido, las 5 ciudades comparten la misma fecha)',
    is_real: false,
    recommended_action: `omitir lastmod (fecha de archivo git ${geoDataFileDate} es real pero idéntica para las 5 ciudades)`,
  });
}

writeFileSync(
  join(REPORTS, 'sitemap-lastmod-audit.csv'),
  toCsv(['url', 'type', 'real_date_field', 'real_date_value', 'current_sitemap_source', 'is_real', 'recommended_action'], rows)
);

// --- Resumen ---------------------------------------------------------------
const byType = {};
for (const r of rows) {
  byType[r.type] = byType[r.type] || { total: 0, real: 0 };
  byType[r.type].total++;
  if (r.is_real) byType[r.type].real++;
}
console.log('[audit-sitemap-lastmod] Resumen por tipo de ruta:');
for (const [type, { total, real }] of Object.entries(byType)) {
  console.log(`  ${type}: ${real}/${total} con fecha real (${((real / total) * 100).toFixed(1)}%)`);
}
console.log(`\n[audit-sitemap-lastmod] Total URLs auditadas: ${rows.length}`);
console.log(`[audit-sitemap-lastmod] Con fecha real disponible: ${rows.filter((r) => r.is_real).length}`);
console.log(`[audit-sitemap-lastmod] Sin fecha real (recomendado omitir lastmod): ${rows.filter((r) => !r.is_real).length}`);
console.log('\n[audit-sitemap-lastmod] Reporte generado: reports/sitemap-lastmod-audit.csv');
