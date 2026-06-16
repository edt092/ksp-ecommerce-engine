#!/usr/bin/env node
'use strict';
/**
 * scripts/sync-from-neon.js
 *
 * Sync all products from Neon DB → data/products.json
 * Uses Claude Haiku 4.5 for SEO enrichment of new/unenriched products.
 *
 * Usage:
 *   node scripts/sync-from-neon.js              # full sync
 *   node scripts/sync-from-neon.js --dry-run    # preview without writing
 *   node scripts/sync-from-neon.js --limit=50   # process only first N neon products
 *   node scripts/sync-from-neon.js --skip-ai    # no Claude API, use template descriptions
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ──────────────────────────────────────────────────────────────────
const CONNECTION = 'postgresql://neondb_owner:REDACTED@ep-cool-thunder-at39o4zb-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const BATCH_SIZE = 5; // products per Claude API call

const ROOT = path.join(__dirname, '..');
const PRODUCTS_JSON = path.join(ROOT, 'data', 'products.json');

// DB category → web categoryId mapping
const CAT_MAP = {
  'articulos-escritura': 'escritura',
  'tecnologia':          'tecnologia',
  'mugs':                'mugs',
  'maletines':           'maletines',
  'oficina':             'oficina',
  'llaveros':            'llaveros',
  'gorras':              'gorras',
  'memorias-usb':        'memorias-usb',
  'ecologia':            'ecologia',
  'hogar':               'hogar',
  'produccion-nacional': 'produccion-nacional',
  'deportes':            'deportes',
  'medicos':             'medicos',
  'infantil':            'infantil',
  'herramientas':        'herramientas',
  'econature':           'econature',
  'bar-y-vino':          'bar-y-vino',
  'bicicleta':           'bicicleta',
  'iluminacion':         'iluminacion',
  'paraguas':            'paraguas',
  'master-line':         'master-line',
  'juegos':              'juegos',
  'automovil':           'automovil',
  'antiestres':          'antiestres',
  'confeccion':          'confeccion',
  'relojes':             'relojes',
  'reflectivos':         'reflectivos',
  'golf':                'golf',
  'calculadoras':        'calculadoras',
  'antimicrobianos':     'antimicrobianos',
  'cuidado-personal':    'cuidado-personal',
  'variedades':          'variedades',
  'precio-bomba':        'precio-bomba',
  // Exclude noindex junk categories
  'copa-america-2020':   null,
  'productos-2023':      null,
};

// Per-category use cases for template fallback
const CAT_USE_CASES = {
  'escritura':   ['Kits de bienvenida para nuevos colaboradores con logo corporativo.', 'Regalos en ferias y exposiciones en Quito y Guayaquil.', 'Souvenirs para eventos y conferencias corporativas en Ecuador.'],
  'tecnologia':  ['Regalo tecnológico para ejecutivos y clientes VIP.', 'Obsequio en lanzamientos de productos y eventos corporativos.', 'Incentivo de productividad para equipos de trabajo en Ecuador.'],
  'mugs':        ['Regalo de bienvenida para empleados en oficinas ecuatorianas.', 'Presente corporativo para clientes en Navidad o aniversarios.', 'Merchandise de marca para ferias y eventos en Ecuador.'],
  'maletines':   ['Kit ejecutivo personalizado para socios y clientes premium.', 'Regalo institucional para directivos y personal gerencial.', 'Obsequio en eventos de formación y capacitación empresarial.'],
  'oficina':     ['Dotación personalizada para escritorios y áreas de trabajo.', 'Regalo corporativo funcional para empleados y clientes.', 'Artículo promocional en ferias y showrooms empresariales.'],
  'gorras':      ['Uniformes y dotación con logo para equipos de trabajo.', 'Merchandising en eventos deportivos y empresariales.', 'Regalo para colaboradores en aniversarios corporativos.'],
  'ecologia':    ['Regalo corporativo sostenible para empresas con valores medioambientales.', 'Articulo ecológico para campañas de RSE en Ecuador.', 'Merchandising verde para eventos y ferias en Quito y Guayaquil.'],
  'hogar':       ['Regalos corporativos prácticos para empleados y clientes.', 'Obsequio de fin de año con logo para hogares ecuatorianos.', 'Presente de bienvenida para nuevos colaboradores.'],
  'llaveros':    ['Souvenir económico para ferias y eventos masivos.', 'Detalle promocional incluido en kits corporativos.', 'Accesorio de marca para clientes y distribuidores.'],
  'default':     ['Regalo corporativo personalizado para empresas en Ecuador.', 'Artículo promocional en ferias y eventos empresariales.', 'Obsequio institucional con logo de su marca.'],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function extractIdFromSlug(slug) {
  const m = slug && slug.match(/-(\d+)$/);
  return m ? m[1] : null;
}

function readEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const obj = {};
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) obj[m[1].trim()] = m[2].trim();
  });
  return obj;
}

function callClaude(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: HAIKU_MODEL,
      max_tokens: 2048,
      messages,
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error('Parse error: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function safeParseJson(text) {
  // Try direct parse
  try { return JSON.parse(text); } catch (_) {}
  // Try extracting JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch (_) {} }
  // Try extracting first array
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch (_) {} }
  return null;
}

async function enrichOne(apiKey, item) {
  const { titulo, descripcion, webCategoryId, colors } = item;
  const desc = (descripcion || '').replace(/"/g, "'").slice(0, 350);
  const cols = colors.slice(0, 5).join(', ');

  const userContent = `Eres experto SEO para KS Promocionales Ecuador. Responde SOLO con JSON válido (sin markdown).

Producto: ${titulo.replace(/"/g, "'")}
Categoria: ${webCategoryId}
Descripcion proveedor: ${desc}
Colores: ${cols}

Devuelve este JSON exacto (sin caracteres especiales en los strings):
{"shortDescription":"...100-120 chars beneficio Ecuador...","story":"...250-350 chars marketing Ecuador personalización logo...","features":["caracteristica 1","caracteristica 2","caracteristica 3"],"seoTitle":"...50-58 chars + Ecuador...","seoDescription":"...140-150 chars...","keywords":"palabra1, palabra2, palabra3, palabra4, palabra5, Ecuador","useCases":["caso uso 1 Ecuador","caso uso 2 Ecuador","caso uso 3 Ecuador"]}`;

  const text = await callClaude(apiKey, [
    { role: 'user', content: userContent },
    { role: 'assistant', content: '{' },
  ]);

  const parsed = safeParseJson('{' + text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Could not parse: ' + text.slice(0, 200));
  return parsed;
}

async function enrichBatch(apiKey, batch) {
  const results = [];
  for (const item of batch) {
    try {
      const enriched = await enrichOne(apiKey, item);
      results.push(enriched);
    } catch (e) {
      results.push(null); // null = use template
      process.stdout.write(`\n  ⚠️  ${item.titulo.slice(0, 30)}: ${e.message.slice(0, 60)}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
}

function buildTemplateProduct(item) {
  const { producto_id, titulo, descripcion, webCategoryId, colors } = item;
  const catId = webCategoryId || 'variedades';
  const cleanDesc = descripcion ? descripcion.replace(/\s+/g, ' ').trim() : '';
  const slug = slugify(titulo) + '-' + producto_id;

  const shortDesc = cleanDesc.length > 50
    ? cleanDesc.slice(0, 120).replace(/\s\S*$/, '') + '...'
    : `${titulo} personalizado con logo de tu empresa para regalos corporativos en Ecuador.`;

  const colorInfo = colors.length > 0 ? ` Disponible en: ${colors.slice(0, 5).join(', ')}.` : '';

  return {
    id: `${catId}-${slug}`,
    name: titulo,
    slug,
    categoryId: catId,
    shortDescription: shortDesc,
    story: (cleanDesc || `${titulo} es un artículo promocional personalizable con el logo de tu empresa.`) + colorInfo + ' Ideal para regalos corporativos en Ecuador. Cotiza con KS Promocionales.',
    features: cleanDesc.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 150).slice(0, 4),
    images: item.imagen_src ? [item.imagen_src] : [],
    whatsappMessage: `Hola! Me interesa el ${titulo}. ¿Podrían enviarme más información sobre personalización y cantidades mínimas?`,
    seoTitle: `${titulo.slice(0, 45)} | Artículos Promocionales Ecuador`,
    seoDescription: `${titulo} personalizado para empresas en Ecuador. ${shortDesc.slice(0, 90)}`,
    keywords: `${titulo}, ${catId}, artículos promocionales Ecuador, regalos corporativos, KS Promocionales`,
    useCases: CAT_USE_CASES[catId] || CAT_USE_CASES['default'],
    featured: false,
    bestseller: false,
    is_ai_optimized: true,
    quality_score: cleanDesc.length > 100 ? 60 : 40,
    last_ai_update: new Date().toISOString(),
  };
}

function applyEnrichment(baseProduct, enriched) {
  return {
    ...baseProduct,
    shortDescription: enriched.shortDescription || baseProduct.shortDescription,
    story: enriched.story || baseProduct.story,
    features: enriched.features || baseProduct.features,
    seoTitle: enriched.seoTitle || baseProduct.seoTitle,
    seoDescription: enriched.seoDescription || baseProduct.seoDescription,
    keywords: enriched.keywords || baseProduct.keywords,
    useCases: enriched.useCases || baseProduct.useCases,
    is_ai_optimized: true,
    quality_score: 80,
    last_ai_update: new Date().toISOString(),
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipAi = args.includes('--skip-ai');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  const env = readEnv();
  const apiKey = env['ANTHROPIC_API_KEY'];
  if (!skipAi && !apiKey) {
    console.error('❌ ANTHROPIC_API_KEY no encontrado en .env. Usa --skip-ai para modo sin Claude.');
    process.exit(1);
  }

  // ── 1. Connect & extract from Neon ──
  console.log('🔌 Conectando a Neon DB...');
  const client = new Client({ connectionString: CONNECTION });
  await client.connect();
  console.log('✅ Conectado\n');

  console.log('📥 Extrayendo productos...');
  const { rows: neonProducts } = await client.query(
    'SELECT producto_id, titulo, imagen_src, descripcion FROM productos ORDER BY producto_id'
  );
  console.log(`  → ${neonProducts.length} productos`);

  console.log('📂 Extrayendo categorías...');
  const { rows: catRows } = await client.query(
    'SELECT producto_id, categoria FROM producto_categorias ORDER BY producto_id'
  );
  const catByProduct = {};
  for (const r of catRows) {
    if (!catByProduct[r.producto_id]) catByProduct[r.producto_id] = [];
    catByProduct[r.producto_id].push(r.categoria);
  }

  console.log('🎨 Extrayendo colores...');
  const { rows: existRows } = await client.query(
    `SELECT producto_id, color FROM existencias WHERE color IS NOT NULL AND color != 'SIN COLOR'`
  );
  const colorsByProduct = {};
  for (const r of existRows) {
    if (!colorsByProduct[r.producto_id]) colorsByProduct[r.producto_id] = new Set();
    if (r.color && r.color.length < 60) colorsByProduct[r.producto_id].add(r.color);
  }

  await client.end();
  console.log('✅ Datos Neon extraídos\n');

  // ── 2. Load existing products.json ──
  console.log('📖 Cargando products.json...');
  const existingProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  console.log(`  → ${existingProducts.length} productos actuales`);

  // Index by Neon product_id (from slug suffix)
  const existingByNeonId = new Map();
  for (const p of existingProducts) {
    const nid = extractIdFromSlug(p.slug);
    if (nid) existingByNeonId.set(nid, p);
  }

  // ── 3. Determine what needs enrichment ──
  const toProcess = limit ? neonProducts.slice(0, limit) : neonProducts;

  const needsEnrichment = []; // items to call Claude for
  const alreadyGood = [];    // skip — already is_ai_optimized
  const skipped = [];        // noindex categories

  for (const np of toProcess) {
    const { producto_id } = np;
    const dbCats = catByProduct[producto_id] || [];

    // Find best web category
    let webCatId = null;
    for (const dc of dbCats) {
      const mapped = CAT_MAP[dc];
      if (mapped !== undefined && mapped !== null) { webCatId = mapped; break; }
    }
    // Skip if ALL categories are excluded
    if (!webCatId) {
      const allExcluded = dbCats.every(c => CAT_MAP[c] === null);
      if (allExcluded && dbCats.length > 0) { skipped.push(np); continue; }
      webCatId = 'variedades';
    }

    const colors = colorsByProduct[producto_id] ? [...colorsByProduct[producto_id]] : [];
    const existing = existingByNeonId.get(producto_id);

    const forceEnrich = args.includes('--force-enrich');
    if (existing && existing.is_ai_optimized && !forceEnrich) {
      // Keep existing content but ensure category is correct
      alreadyGood.push({ ...existing, _webCatId: webCatId });
    } else if (existing && existing.is_ai_optimized && forceEnrich && (existing.quality_score || 100) < 70) {
      // Re-enrich template-quality products
      needsEnrichment.push({ ...np, webCategoryId: webCatId, colors });
    } else if (existing && existing.is_ai_optimized) {
      alreadyGood.push({ ...existing, _webCatId: webCatId });
    } else {
      needsEnrichment.push({ ...np, webCategoryId: webCatId, colors });
    }
  }

  console.log(`\n📊 Plan:`);
  console.log(`  Ya enriquecidos (mantener): ${alreadyGood.length}`);
  console.log(`  Necesitan enriquecimiento: ${needsEnrichment.length}`);
  console.log(`  Omitidos (categorías excluidas): ${skipped.length}`);
  console.log(`  Llamadas a Haiku 4.5: ~${Math.ceil(needsEnrichment.length / BATCH_SIZE)}`);

  if (dryRun) {
    console.log('\n🔍 DRY RUN — nada se escribió.');
    return;
  }

  // ── 4. Enrich with Haiku 4.5 ──
  const enrichedMap = new Map(); // producto_id → product object

  if (!skipAi && needsEnrichment.length > 0) {
    console.log(`\n🤖 Enriqueciendo ${needsEnrichment.length} productos con Haiku 4.5...`);
    const batches = [];
    for (let i = 0; i < needsEnrichment.length; i += BATCH_SIZE) {
      batches.push(needsEnrichment.slice(i, i + BATCH_SIZE));
    }

    let done = 0;
    for (const batch of batches) {
      try {
        const results = await enrichBatch(apiKey, batch);
        for (let i = 0; i < batch.length; i++) {
          const item = batch[i];
          const base = buildTemplateProduct(item);
          const enrichedData = results[i];
          enrichedMap.set(item.producto_id, enrichedData ? applyEnrichment(base, enrichedData) : base);
        }
        done += batch.length;
        process.stdout.write(`\r  Progreso: ${done}/${needsEnrichment.length} (${Math.round(done/needsEnrichment.length*100)}%)`);
      } catch (e) {
        console.error(`\n  ⚠️  Error en batch, usando template: ${e.message}`);
        for (const item of batch) {
          enrichedMap.set(item.producto_id, buildTemplateProduct(item));
        }
        done += batch.length;
      }
    }
    console.log('\n  ✅ Enriquecimiento completado');
  } else {
    // No Claude — use templates
    for (const item of needsEnrichment) {
      enrichedMap.set(item.producto_id, buildTemplateProduct(item));
    }
    if (skipAi) console.log('  ⚡ Modo --skip-ai: usando templates sin Claude');
  }

  // ── 5. Build final product list ──
  console.log('\n🔧 Construyendo lista final...');

  // Start from existing products, apply updates for matched ones
  const neonIdSet = new Set(toProcess.map(p => p.producto_id));
  const finalProducts = [];
  const seenIds = new Set();

  // 5a. Walk existing products — update if we have new data, keep otherwise
  for (const p of existingProducts) {
    const nid = extractIdFromSlug(p.slug);
    if (nid && enrichedMap.has(nid)) {
      finalProducts.push(enrichedMap.get(nid));
      seenIds.add(nid);
    } else {
      finalProducts.push(p);
      if (nid) seenIds.add(nid);
    }
  }

  // 5b. Add new products from Neon not yet in web
  let newCount = 0;
  for (const [nid, prod] of enrichedMap) {
    if (!seenIds.has(nid)) {
      finalProducts.push(prod);
      seenIds.add(nid);
      newCount++;
    }
  }

  // 5c. Also add alreadyGood products that aren't already in the list
  for (const p of alreadyGood) {
    const nid = extractIdFromSlug(p.slug);
    if (nid && !seenIds.has(nid)) {
      finalProducts.push(p);
      seenIds.add(nid);
    }
  }

  const enrichedCount = needsEnrichment.length;
  console.log(`\n📊 Resultado:`);
  console.log(`  Productos totales: ${finalProducts.length}`);
  console.log(`  Nuevos productos añadidos: ${newCount}`);
  console.log(`  Productos enriquecidos: ${enrichedCount}`);
  console.log(`  Omitidos: ${skipped.length}`);

  // ── 6. Write ──
  console.log('\n💾 Escribiendo data/products.json...');
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(finalProducts, null, 2), 'utf8');
  console.log(`✅ products.json actualizado con ${finalProducts.length} productos`);
  console.log('\n🎯 Próximo paso: pnpm run prebuild && pnpm run build');
}

main().catch(e => {
  console.error('\n❌ Error fatal:', e.message);
  process.exit(1);
});
