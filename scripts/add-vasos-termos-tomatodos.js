#!/usr/bin/env node
'use strict';
/**
 * scripts/add-vasos-termos-tomatodos.js
 *
 * Crea las categorías "Vasos Personalizados", "Termos Personalizados" y
 * "Tomatodos y Botilitos Personalizados" (hoy diluidas dentro de
 * "Mugs y Termos" / "Precio Bomba" / "Hogar" / "Bar y Vino"), re-categoriza
 * los productos que correspondan en data/products.json y regenera su
 * contenido SEO con Claude Haiku 4.5 para reflejar la categoría nueva.
 *
 * No toca las tablas de Neon (productos/producto_categorias) ni modifica
 * sync-from-neon.js — es un script adicional y acotado, porque
 * sync-from-neon.js no re-categoriza productos ya marcados
 * is_ai_optimized=true (ver hallazgo de la exploración).
 *
 * Usage:
 *   node scripts/add-vasos-termos-tomatodos.js              # ejecuta
 *   node scripts/add-vasos-termos-tomatodos.js --dry-run     # solo detecta, no escribe ni llama a Claude
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const BATCH_DELAY_MS = 200;

const ROOT = path.join(__dirname, '..');
const PRODUCTS_JSON = path.join(ROOT, 'data', 'products.json');
const CATEGORIES_JSON = path.join(ROOT, 'data', 'categories.json');

const NEW_CATEGORIES = [
  {
    id: 'vasos-personalizados',
    name: 'Vasos Personalizados',
    slug: 'vasos-personalizados',
    description: 'Vasos personalizados con tu logo para empresas en Ecuador. Metálicos, plásticos, vidrio y ecológicos.',
    icon: 'CupSoda',
    story: 'Un vaso personalizado con tu logo acompaña cada bebida del día, manteniendo tu marca presente en la oficina, en casa o en cualquier evento.',
    seoTitle: 'Vasos Personalizados para Empresas | KS Promocionales',
    seoDescription: 'Vasos personalizados con logo para empresas en Ecuador. Metálicos, plásticos, vidrio y ecológicos. Desde 24 unidades. Cotiza ahora.',
    h1: 'Vasos Personalizados para Empresas',
    h2Editorial: 'Vasos Publicitarios con Logo para tu Marca',
    benefits: ['Personalización con tu logo', 'Alta calidad garantizada', 'Envíos en Ecuador', 'Precios competitivos'],
    image: 'https://catalogospromocionales.com/images/productos/13534.jpg',
    productCount: 0,
    editorial: 'Los vasos personalizados son uno de los artículos promocionales más versátiles: sirven para eventos, oficinas, restaurantes y campañas de marca. Un vaso con tu logo se usa una y otra vez, generando exposición de marca constante a bajo costo por impacto.\n\nKS Promocionales ofrece vasos en metal, plástico, vidrio y opciones ecológicas, con personalización por sublimación, serigrafía o grabado láser. Ideales para activaciones de marca, ferias y regalos corporativos en Ecuador.\n\nDesde 24 unidades, con muestras disponibles antes de producción masiva. Solicita tu cotización.',
  },
  {
    id: 'termos-personalizados',
    name: 'Termos Personalizados',
    slug: 'termos-personalizados',
    description: 'Termos personalizados con tu logo para empresas en Ecuador. Acero inoxidable y opciones ecológicas.',
    icon: 'Thermometer',
    story: 'Un termo personalizado mantiene bebidas frías o calientes por horas, mientras tu logo viaja con el usuario a todas partes: la oficina, el gimnasio, el camino.',
    seoTitle: 'Termos Personalizados para Empresas | KS Promocionales',
    seoDescription: 'Termos personalizados con logo para empresas en Ecuador. Acero inoxidable, doble pared, opciones ecológicas. Desde 24 unidades. Cotiza ahora.',
    h1: 'Termos Personalizados para Empresas',
    h2Editorial: 'Termos Corporativos con Logo de tu Marca',
    benefits: ['Personalización con tu logo', 'Alta calidad garantizada', 'Envíos en Ecuador', 'Precios competitivos'],
    image: 'https://catalogospromocionales.com/images/productos/13534.jpg',
    productCount: 0,
    editorial: 'Los termos personalizados combinan funcionalidad y presencia de marca: mantienen la temperatura de líquidos por horas y acompañan al usuario en su día a día, dentro y fuera de la oficina.\n\nKS Promocionales ofrece termos de acero inoxidable de doble pared, con tapa hermética y opciones ecológicas, personalizados por grabado láser o serigrafía. Un regalo corporativo de alto valor percibido para clientes y colaboradores en Ecuador.\n\nDesde 24 unidades, con muestras disponibles antes de producción masiva. Solicita tu cotización.',
  },
  {
    id: 'tomatodos-botilitos',
    name: 'Tomatodos y Botilitos Personalizados',
    slug: 'tomatodos-y-botilitos-personalizados',
    description: 'Tomatodos y botilitos personalizados con tu logo para empresas en Ecuador. Metálicos, plásticos y ecológicos.',
    icon: 'Droplet',
    story: 'Un botilito o tomatodo personalizado promueve hidratación saludable mientras exhibe tu marca en el gimnasio, la oficina o cualquier actividad al aire libre.',
    seoTitle: 'Tomatodos y Botilitos Personalizados | KS Promocionales',
    seoDescription: 'Tomatodos y botilitos personalizados con logo para empresas en Ecuador. Metálicos, plásticos y ecológicos. Desde 24 unidades. Cotiza ahora.',
    h1: 'Tomatodos y Botilitos Personalizados para Empresas',
    h2Editorial: 'Botellas Deportivas Corporativas con tu Logo',
    benefits: ['Personalización con tu logo', 'Alta calidad garantizada', 'Envíos en Ecuador', 'Precios competitivos'],
    image: 'https://catalogospromocionales.com/images/productos/13534.jpg',
    productCount: 0,
    editorial: 'Los tomatodos y botilitos personalizados son el regalo corporativo ideal para marcas que promueven hidratación y vida activa. Se usan en gimnasios, oficinas, actividades al aire libre y campañas de bienestar corporativo.\n\nKS Promocionales ofrece botilitos metálicos, plásticos y en opciones ecológicas, personalizados con tu logo por serigrafía o grabado. Un artículo de uso diario que mantiene tu marca visible por meses en Ecuador.\n\nDesde 24 unidades, con muestras disponibles antes de producción masiva. Solicita tu cotización.',
  },
];

const EXCLUDE_PATTERN = /portavasos|posavasos|term[oó]metro/i;
const BOTILITO_PATTERN = /botilito|tomatodo/i;
const TERMO_PATTERN = /\btermo\b/i;
const VASO_PATTERN = /\bvaso\b/i;

function classify(name) {
  if (EXCLUDE_PATTERN.test(name)) return null;
  if (BOTILITO_PATTERN.test(name)) return 'tomatodos-botilitos';
  if (TERMO_PATTERN.test(name)) return 'termos-personalizados';
  if (VASO_PATTERN.test(name)) return 'vasos-personalizados';
  return null;
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
    const body = JSON.stringify({ model: HAIKU_MODEL, max_tokens: 2048, messages });
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
  try { return JSON.parse(text); } catch (_) {}
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch (_) {} }
  return null;
}

async function enrichOne(apiKey, product, newCategoryName) {
  const desc = (product.description || product.shortDescription || '').replace(/"/g, "'").slice(0, 350);

  const userContent = `Eres experto SEO para KS Promocionales Ecuador. Este producto fue re-categorizado a "${newCategoryName}". Genera contenido SEO NUEVO y 100% original que refleje esa categoría (no reutilices frases genéricas que podrían aparecer igual en un sitio hermano del mismo catálogo de proveedor). Responde SOLO con JSON válido (sin markdown).

Producto: ${product.name.replace(/"/g, "'")}
Categoria nueva: ${newCategoryName}
Descripcion proveedor: ${desc}

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

function applyEnrichment(baseProduct, enriched, newCategoryId, newCategoryName) {
  return {
    ...baseProduct,
    categoryId: newCategoryId,
    categoria: newCategoryName,
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

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const env = readEnv();
  const apiKey = env['ANTHROPIC_API_KEY'];
  if (!dryRun && !apiKey) {
    console.error('❌ ANTHROPIC_API_KEY no encontrado en .env.');
    process.exit(1);
  }

  console.log('📖 Cargando products.json y categories.json...');
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_JSON, 'utf8'));
  console.log(`  → ${products.length} productos, ${categories.length} categorías`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(ROOT, 'data', `products_backup_before_new_categories_${ts}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`💾 Backup guardado en ${backupPath}`);

  const existingIds = new Set(categories.map(c => c.id));
  const catById = {};
  for (const c of NEW_CATEGORIES) catById[c.id] = c;

  const toRecat = [];
  for (const p of products) {
    const newCatId = classify(p.name || '');
    if (newCatId && p.categoryId !== newCatId) {
      toRecat.push(p);
    }
  }

  const counts = {};
  for (const p of toRecat) {
    const newCatId = classify(p.name);
    counts[newCatId] = (counts[newCatId] || 0) + 1;
  }
  console.log(`\n📊 Productos a re-categorizar: ${toRecat.length} ->`, counts);

  for (const c of NEW_CATEGORIES) {
    c.productCount = counts[c.id] || 0;
  }

  if (dryRun) {
    console.log('\n🔍 DRY RUN — nada se escribió ni se llamó a Claude.');
    console.log('Ejemplos:', toRecat.slice(0, 10).map(p => `${p.name} -> ${classify(p.name)}`));
    return;
  }

  const addedCategories = NEW_CATEGORIES.filter(c => !existingIds.has(c.id));
  categories.push(...addedCategories);
  fs.writeFileSync(CATEGORIES_JSON, JSON.stringify(categories, null, 2), 'utf8');
  console.log(`✅ Categorías nuevas agregadas: ${addedCategories.map(c => c.id).join(', ')}`);

  console.log(`\n🤖 Enriqueciendo ${toRecat.length} productos con Haiku 4.5...`);
  let done = 0;
  let aiCount = 0;
  let fallbackCount = 0;

  for (const p of toRecat) {
    const newCatId = classify(p.name);
    const newCat = catById[newCatId];
    try {
      const enriched = await enrichOne(apiKey, p, newCat.name);
      const updated = applyEnrichment(p, enriched, newCat.id, newCat.name);
      Object.assign(p, updated);
      aiCount++;
    } catch (e) {
      // Fallback: solo re-categoriza, conserva el resto del contenido existente
      p.categoryId = newCat.id;
      p.categoria = newCat.name;
      fallbackCount++;
      process.stdout.write(`\n  ⚠️  ${p.name.slice(0, 40)}: ${e.message.slice(0, 80)}`);
    }
    done++;
    process.stdout.write(`\r  Progreso: ${done}/${toRecat.length}`);
    await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
  }

  console.log('\n\n💾 Escribiendo data/products.json...');
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf8');

  console.log('\n' + '='.repeat(60));
  console.log(`Total re-categorizados: ${toRecat.length}`);
  console.log(`Contenido IA generado:  ${aiCount}`);
  console.log(`Fallback (solo recat):  ${fallbackCount}`);
  console.log('Ejemplos:');
  for (const p of toRecat.slice(0, 3)) {
    console.log(`  - [${p.categoria}] ${p.name}`);
    console.log(`    seoTitle: ${p.seoTitle}`);
    console.log(`    shortDescription: ${p.shortDescription}`);
  }
  console.log('\n🎯 Próximo paso: node scripts/split-products-by-category.js && pnpm run build');
}

main().catch(e => {
  console.error('\n❌ Error fatal:', e.message);
  process.exit(1);
});
