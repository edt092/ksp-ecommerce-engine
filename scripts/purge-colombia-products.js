#!/usr/bin/env node
'use strict';
/**
 * One-off cleanup: site is Ecuador-only, but generated marketing copy for
 * ~half the catalog was templated with "Ecuador y Colombia" / Colombian city
 * lists (legacy from when the scraper/enrichment pipeline targeted both
 * markets). This rewrites every text field in-place (operating on parsed
 * string VALUES, not raw JSON text, so embedded quotes can't corrupt the
 * file) and excludes the handful of literally Colombia-themed novelty
 * products (flag pens, "Paraguas Colombia 27", etc.) from public listings.
 *
 * Run: node scripts/purge-colombia-products.js
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const PRODUCTS_PATH = join(__dirname, '..', 'data', 'products.json');

const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));

const COLOMBIAN_CITIES = ['Bogotá', 'Bogota', 'Medellín', 'Medellin', 'Cali', 'Barranquilla', 'Cartagena'];

function cleanText(s) {
  if (typeof s !== 'string') return s;
  let out = s;

  // Compound country mentions
  out = out.replace(/Ecuador y Colombia/gi, 'Ecuador');
  out = out.replace(/Ecuador o Colombia/gi, 'Ecuador');
  out = out.replace(/Colombia y Ecuador/gi, 'Ecuador');
  out = out.replace(/Colombia o Ecuador/gi, 'Ecuador');
  out = out.replace(/Ecuador\/Colombia/gi, 'Ecuador');
  out = out.replace(/Ecuador-Colombia/gi, 'Ecuador');
  out = out.replace(/Ecuador Colombia/gi, 'Ecuador');
  out = out.replace(/tanto en Ecuador como en Colombia/gi, 'en Ecuador');
  out = out.replace(/ecuatorian[oa]s?\s+(y|o)\s+colombian[oa]s?/gi, (m) => m.split(/\s+(?:y|o)\s+/i)[0]);
  out = out.replace(/empresa ecuatoriana o colombiana/gi, 'empresa ecuatoriana');
  out = out.replace(/Ecuador y y Colombia/gi, 'Ecuador');
  out = out.replace(/eje Ecuador-Colombia/gi, 'Ecuador');
  out = out.replace(/paisajes cafeteros de Colombia/gi, 'paisajes andinos de Ecuador');
  out = out.replace(/o ciudades colombianas\b/gi, '');
  out = out.replace(/y ciudades colombianas\b/gi, '');
  out = out.replace(/\bciudades colombianas\b/gi, 'ciudades de la costa');
  out = out.replace(/playas del Caribe colombiano/gi, 'playas del Pacífico ecuatoriano');
  out = out.replace(/viajes frecuentes a Colombia,\s*/gi, 'viajes frecuentes a ');
  out = out.replace(/,\s*Colombia,/gi, ',');
  out = out.replace(/\bColombia,\s*Perú/gi, 'Perú');

  // SEO title suffix pattern: "... | <words> Colombia" at end of string
  out = out.replace(/^(.*\|.*) Colombia$/i, '$1 Ecuador');
  // Bare trailing "Colombia" after a pipe-keyword phrase
  out = out.replace(/Promocionales Colombia\b/gi, 'Promocionales Ecuador');
  out = out.replace(/Regalos? Corporativos? Colombia\b/gi, 'Regalos Corporativos Ecuador');
  out = out.replace(/Herramientas Promocionales Colombia\b/gi, 'Herramientas Promocionales Ecuador');
  out = out.replace(/Productos Promocionales Colombia\b/gi, 'Productos Promocionales Ecuador');
  out = out.replace(/Regalo(s)? (Promocional|Ecológico|Médicos?|Sostenibles?|Empresariales?) Colombia\b/gi, 'Regalo$1 $2 Ecuador');
  out = out.replace(/Marketing Masivo Colombia\b/gi, 'Marketing Masivo Ecuador');
  out = out.replace(/Regalos en Colombia\b/gi, 'Regalos en Ecuador');

  // Standalone "en/para/marca Colombia" sentence-level mentions
  out = out.replace(/para (empresas|clientes y colaboradores|clínicas y consultorios|familias|niños) en Colombia/gi, 'para $1 en Ecuador');
  out = out.replace(/\bmarca en Colombia\b/gi, 'marca en Ecuador');
  out = out.replace(/\ben Colombia\b/gi, 'en Ecuador');
  out = out.replace(/\bpara Colombia\b/gi, 'para Ecuador');
  out = out.replace(/exclusivo para Ecuador!/gi, 'exclusivo para Ecuador!');

  // City lists mixing Ecuador + Colombia cities, e.g. "Quito, Guayaquil, Cuenca, Bogotá o Medellín"
  for (const city of COLOMBIAN_CITIES) {
    out = out.replace(new RegExp(`,?\\s*${city}\\b`, 'g'), '');
  }
  out = out.replace(/,\s*(o|y)\s+/gi, ' $1 '); // fix dangling ", o "/" y " left after city removal
  out = out.replace(/\s+(o|y)\s+(?=[.,;])/gi, ''); // dangling connector before punctuation
  out = out.replace(/,\s*,/g, ',');
  out = out.replace(/,\s*\./g, '.');

  // Misc specific phrases seen in the data
  out = out.replace(/paisajes cafeteros de Ecuador/gi, 'paisajes andinos de Ecuador');
  out = out.replace(/temática colombiana/gi, 'temática ecuatoriana');
  out = out.replace(/en cada viaje de Ecuador a Colombia y más/gi, 'en cada viaje');
  out = out.replace(/ecuatorial(es)?\s+y\s+colombianos?/gi, 'ecuatoriales');
  out = out.replace(/normativas NTC colombianas/gi, 'normativas de seguridad vial');
  out = out.replace(/en Ecuador, Guayaquil o Colombia, Bogotá/gi, 'en Quito, Guayaquil y todo Ecuador');
  out = out.replace(/o las costas colombianas/gi, 'y la costa ecuatoriana');
  out = out.replace(/ecuatoriana-colombiana/gi, 'ecuatoriana');
  out = out.replace(/Quito, Guayaquil y Colombia/gi, 'Quito, Guayaquil y todo Ecuador');
  out = out.replace(/entrega rápida a Colombia/gi, 'entrega rápida a nivel nacional');
  out = out.replace(/para Empresas Colombia\b/gi, 'para Empresas Ecuador');

  // Final safety net — catch any remaining bare mention we didn't anticipate.
  out = out.replace(/\bColombia\b/g, 'Ecuador');
  out = out.replace(/\bcolombian[oa]s?\b/gi, 'ecuatoriano');
  out = out.replace(/Ecuador y Ecuador/gi, 'Ecuador');

  return out;
}

// Comma-separated keyword lists: drop Colombian-city/Colombia tokens outright
// rather than rewriting sentences (avoids nonsense like "merchandising Ecuador
// Ecuador" when "Ecuador" is already elsewhere in the list).
function cleanKeywords(s) {
  if (typeof s !== 'string') return s;
  let tokens = s.split(',').map((t) => t.trim());
  tokens = tokens.map((t) => {
    let tt = t;
    for (const city of COLOMBIAN_CITIES) {
      tt = tt.replace(new RegExp(`\\b${city}\\b`, 'gi'), '').trim();
    }
    tt = tt.replace(/\bColombia\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    return tt;
  }).filter(Boolean);
  const seen = new Set();
  tokens = tokens.filter((t) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return tokens.join(', ');
}

function cleanField(v, key) {
  if (Array.isArray(v)) return v.map((x) => cleanField(x, key));
  if (typeof v === 'string') {
    return (key === 'keywords' || key === 'seoKeywords') ? cleanKeywords(cleanText(v)) : cleanText(v);
  }
  return v;
}

let textFieldsCleaned = 0;
let excludedCount = 0;

for (const p of products) {
  // Exclude literally Colombia-themed novelty products (flag pens, etc.)
  // from public listings rather than mislabeling them as Ecuador products.
  if (/colombia/i.test(p.name)) {
    if (p.is_ai_optimized !== false) excludedCount++;
    p.is_ai_optimized = false;
    continue;
  }

  for (const key of ['name', 'shortDescription', 'story', 'seoTitle', 'seoDescription', 'description', 'keywords', 'seoKeywords', 'whatsappMessage', 'features', 'useCases']) {
    if (p[key] === undefined) continue;
    const before = JSON.stringify(p[key]);
    p[key] = cleanField(p[key], key);
    if (JSON.stringify(p[key]) !== before) textFieldsCleaned++;
  }
}

writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n', 'utf-8');

const raw = readFileSync(PRODUCTS_PATH, 'utf-8');
const remaining = (raw.match(/colombia/gi) || []).length;

console.log(`Text fields cleaned: ${textFieldsCleaned}`);
console.log(`Products excluded (Colombia-themed): ${excludedCount}`);
console.log(`Remaining "colombia" mentions in file: ${remaining}`);
