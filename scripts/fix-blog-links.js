#!/usr/bin/env node
'use strict';
/**
 * scripts/fix-blog-links.js
 *
 * 1. Corrige TODOS los URLs rotos en los archivos de contenido del blog
 * 2. Añade secciones de productos recomendados a posts sin links internos
 *
 * Usage: node scripts/fix-blog-links.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Correct URL map (broken → correct) ──────────────────────────────────────
// Category path fixes
const URL_FIXES = [
  // Old /categoria/ (singular) → /categorias/
  ['/categoria/bolsos-mochilas',   '/categorias/mochilas-y-maletines-personalizados'],
  ['/categoria/ecologicos',        '/categorias/ecologia'],
  ['/categoria/escritura',         '/categorias/boligrafos-publicitarios'],
  ['/categoria/llaveros',          '/categorias/llaveros-personalizados'],
  ['/categoria/mugs-vasos-termos', '/categorias/mugs-y-termos-personalizados'],
  ['/categoria/mugs',              '/categorias/mugs-y-termos-personalizados'],
  ['/categoria/oficina',           '/categorias/articulos-de-oficina-personalizados'],
  ['/categoria/tecnologia',        '/categorias/tecnologia-promocional'],
  ['/categoria/textiles',          '/categorias/camisetas-y-confeccion-corporativa'],
  ['/categoria/variedades',        '/categorias/variedades'],
  ['/categoria/gorras',            '/categorias/gorras-personalizadas'],
  ['/categoria/maletines',         '/categorias/mochilas-y-maletines-personalizados'],

  // Old /categorias/ with wrong slugs
  ['/categorias/bolsos-mochilas',   '/categorias/mochilas-y-maletines-personalizados'],
  ['/categorias/maletines"',        '/categorias/mochilas-y-maletines-personalizados"'],
  ['/categorias/maletines\'',       '/categorias/mochilas-y-maletines-personalizados\''],
  ['/categorias/escritura"',        '/categorias/boligrafos-publicitarios"'],
  ['/categorias/escritura\'',       '/categorias/boligrafos-publicitarios\''],
  ['/categorias/mugs-vasos-termos', '/categorias/mugs-y-termos-personalizados'],
  ['/categorias/mugs"',             '/categorias/mugs-y-termos-personalizados"'],
  ['/categorias/mugs\'',            '/categorias/mugs-y-termos-personalizados\''],
  ['/categorias/tecnologia"',       '/categorias/tecnologia-promocional"'],
  ['/categorias/tecnologia\'',      '/categorias/tecnologia-promocional\''],
  ['/categorias/textiles',          '/categorias/camisetas-y-confeccion-corporativa'],
  ['/categorias/gorras"',           '/categorias/gorras-personalizadas"'],
  ['/categorias/gorras\'',          '/categorias/gorras-personalizadas\''],
  ['/categorias/llaveros"',         '/categorias/llaveros-personalizados"'],
  ['/categorias/llaveros\'',        '/categorias/llaveros-personalizados\''],
  ['/categorias/memorias-usb"',     '/categorias/memorias-usb-personalizadas"'],
  ['/categorias/memorias-usb\'',    '/categorias/memorias-usb-personalizadas\''],

  // /tienda/ paths
  ['/tienda/ecologia',    '/categorias/ecologia'],
  ['/tienda/llaveros',    '/categorias/llaveros-personalizados'],
  ['/tienda/productos',   '/'],
  ['/tienda"',            '/"'],
  ['/tienda\'',           '/\''],

  // Misc broken paths
  ['/catalogos-digitales', '/'],
  ['/categorias"',         '/"'],
  ['/categorias\'',        '/\''],

  // Broken product links (slugs without ID suffix)
  ['/productos/boligrafo-dormin-bamboo"',              '/productos/boligrafo-dormin-bamboo-10839"'],
  ['/productos/boligrafo-dormin-bamboo\'',             '/productos/boligrafo-dormin-bamboo-10839\''],
  ['/productos/boligrafo-metalico-shell-oferta"',      '/productos/boligrafo-metalico-shell-oferta-7326"'],
  ['/productos/boligrafo-metalico-shell-oferta\'',     '/productos/boligrafo-metalico-shell-oferta-7326\''],
  ['/productos/bolsa-en-algodon-botanik"',             '/productos/bolsa-en-algodon-botanik-10690"'],
  ['/productos/bolsa-en-algodon-botanik\'',            '/productos/bolsa-en-algodon-botanik-10690\''],
  ['/productos/bolsa-en-algodon-con-fuelle"',          '/productos/bolsa-en-algodon-botanik-10690"'],
  ['/productos/bolsa-en-algodon-con-fuelle\'',         '/productos/bolsa-en-algodon-botanik-10690\''],
  // No match → category fallbacks
  ['/productos/gorra-6-paneles-galva"',                '/categorias/gorras-personalizadas"'],
  ['/productos/gorra-6-paneles-galva\'',               '/categorias/gorras-personalizadas\''],
  ['/productos/memoria-usb-metalica-giratoria-8-gb"',  '/categorias/memorias-usb-personalizadas"'],
  ['/productos/memoria-usb-metalica-giratoria-8-gb\'', '/categorias/memorias-usb-personalizadas\''],
  ['/productos/mug-plastico-stash-500-ml-nuevo"',      '/productos/mug-plastico-stash-500-ml-nuevo-13534"'],
  ['/productos/mug-plastico-stash-500-ml-nuevo\'',     '/productos/mug-plastico-stash-500-ml-nuevo-13534\''],
  ['/productos/mug-sublimable-11-onzas"',              '/categorias/mugs-y-termos-personalizados"'],
  ['/productos/mug-sublimable-11-onzas\'',             '/categorias/mugs-y-termos-personalizados\''],
  ['/productos/parlante-bluetooth-con-led-vogue"',     '/categorias/tecnologia-promocional"'],
  ['/productos/parlante-bluetooth-con-led-vogue\'',    '/categorias/tecnologia-promocional\''],
  ['/productos/polo-cotton-nature-hombre"',            '/categorias/camisetas-y-confeccion-corporativa"'],
  ['/productos/polo-cotton-nature-hombre\'',           '/categorias/camisetas-y-confeccion-corporativa\''],
  ['/productos/sticky-set-truck-nuevo"',               '/productos/sticky-set-truck-nuevo-13280"'],
  ['/productos/sticky-set-truck-nuevo\'',              '/productos/sticky-set-truck-nuevo-13280\''],
  ['/productos/vaso-termico-treking-pro-450-ml"',      '/categorias/mugs-y-termos-personalizados"'],
  ['/productos/vaso-termico-treking-pro-450-ml\'',     '/categorias/mugs-y-termos-personalizados\''],

  // Malformed external link mixed with href
  ['www.example.com<a href=', 'www.kronosolopromocionales.com'],
];

// ── Product CTA sections per post slug (for additions.js without links) ─────
// Format: [{ label, href }] — 3-4 links per post, mix category + product
const POST_LINKS = {
  'articulos-promocionales-para-empresas-que-funcionan': [
    { label: 'Bolígrafos Personalizados para Empresas', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Bolígrafo Mop Like Stylus', href: '/productos/boligrafo-mop-like-stylus-10030' },
    { label: 'Mugs y Termos Personalizados', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Tecnología Promocional', href: '/categorias/tecnologia-promocional' },
  ],
  'cucharas-y-tenedores-que-protegen-descubre-el-set-de-cubiertos-antibacterianos-para-empresas-en-ecuador': [
    { label: 'Artículos Antimicrobianos Corporativos', href: '/categorias/antimicrobianos' },
    { label: 'Bolígrafo Flom 4-1 Antibacteriano', href: '/productos/boligrafo-flom-4-1-antibacteriano-9531' },
    { label: 'Bolígrafo Spray Max Antibacteriano', href: '/productos/boligrafo-spray-max-antibacteriano-9479' },
    { label: 'Artículos Médicos Promocionales', href: '/categorias/medicos' },
  ],
  'regalos-corporativos-elegantes': [
    { label: 'Morrales y Maletines Personalizados', href: '/categorias/mochilas-y-maletines-personalizados' },
    { label: 'Mugs y Termos Personalizados', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Termo Metalico Calypso Chili 500ml', href: '/productos/termo-metalico-calypso-chili-500ml-9781' },
    { label: 'Relojes Corporativos', href: '/categorias/relojes' },
  ],
  'productos-promocionales-por-mayor-mayoreo-guia-completa': [
    { label: 'Bolígrafos Por Mayor', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Gorras Personalizadas Por Mayor', href: '/categorias/gorras-personalizadas' },
    { label: 'Mugs y Termos Por Mayor', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Artículos de Oficina Por Mayor', href: '/categorias/articulos-de-oficina-personalizados' },
  ],
  'marketing-sostenible-productos-ecologicos-promocionales': [
    { label: 'Artículos Ecológicos y Sostenibles', href: '/categorias/ecologia' },
    { label: 'Espejo Cork ii', href: '/productos/espejo-cork-ii-10689' },
    { label: 'Bolsa en Cambrel Baxter', href: '/productos/bolsa-en-cambrel-baxter-5260' },
    { label: 'Línea Econature (materiales naturales)', href: '/categorias/econature' },
  ],
  'regalos-corporativos-fin-ano-ecuador': [
    { label: 'Mugs y Termos Personalizados', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Morrales y Maletines Corporativos', href: '/categorias/mochilas-y-maletines-personalizados' },
    { label: 'Tecnología Promocional', href: '/categorias/tecnologia-promocional' },
    { label: 'Speaker Bluetooth Bass Swisspeak', href: '/productos/speaker-bluetooth-bass-swisspeak-8933' },
  ],
  'personalizacion-productos-tecnicas-impresion': [
    { label: 'Bolígrafos con Tampografía y Grabado', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Gorras con Bordado Corporativo', href: '/categorias/gorras-personalizadas' },
    { label: 'Mugs Sublimables', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Confección y Textiles con Bordado', href: '/categorias/camisetas-y-confeccion-corporativa' },
  ],
  'llaveros-promocionales-cual-es-la-mejor-opcion-para-tu-presupuesto': [
    { label: 'Ver Catálogo de Llaveros Personalizados', href: '/categorias/llaveros-personalizados' },
    { label: 'Llavero Pito Maxi', href: '/productos/llavero-pito-maxi-7877' },
    { label: 'Mini Llavero Pito', href: '/productos/mini-llavero-pito-3156' },
    { label: 'Llavero Destapador Nash', href: '/productos/llavero-destapador-nash-7432' },
  ],
  'listos-para-carnaval-2026-impulsa-tu-marca-con-productos-promocionales': [
    { label: 'Gorras Personalizadas para Eventos', href: '/categorias/gorras-personalizadas' },
    { label: 'Bolígrafos Corporativos', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Artículos para Ferias y Eventos', href: '/merchandising-corporativo/' },
    { label: 'Ver todos los Artículos Promocionales', href: '/articulos-promocionales/' },
  ],
  'productos-promocionales-baratos-guia-completa': [
    { label: 'Productos Precio Bomba (Ofertas)', href: '/categorias/precio-bomba' },
    { label: 'Bolígrafos desde precio mínimo', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Llaveros Económicos', href: '/categorias/llaveros-personalizados' },
    { label: 'Mini Llavero Pito', href: '/productos/mini-llavero-pito-3156' },
  ],
  'productos-promocionales-ecologicos-impulsa-tu-marca-de-forma-sostenible': [
    { label: 'Artículos Ecológicos y Sostenibles', href: '/categorias/ecologia' },
    { label: 'Bolsa en Cambrel Baxter', href: '/productos/bolsa-en-cambrel-baxter-5260' },
    { label: 'Línea Econature — materiales naturales', href: '/categorias/econature' },
    { label: 'Bolígrafo Carter-eco (bambú)', href: '/productos/boligrafo-carter-eco-10533' },
  ],
  'abre-caminos-al-exito-destapador-con-iman-personalizado-el-iman-de-clientes-para-tu-marca-en-ecuador': [
    { label: 'Llaveros y Accesorios Personalizados', href: '/categorias/llaveros-personalizados' },
    { label: 'Llavero Destapador Nash', href: '/productos/llavero-destapador-nash-7432' },
    { label: 'Set de Vino y Bar Corporativo', href: '/categorias/bar-y-vino' },
    { label: 'Set de Vino Bottle', href: '/productos/set-de-vino-bottle-4049' },
  ],
  'colores-psicologia-merchandising-corporativo': [
    { label: 'Gorras Personalizadas (colores corporativos)', href: '/categorias/gorras-personalizadas' },
    { label: 'Mugs y Termos con Color de Marca', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Bolígrafos en Colores Corporativos', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Artículos de Oficina', href: '/categorias/articulos-de-oficina-personalizados' },
  ],
  'boligrafo-flom-4-1-antibacteriano-el-regalo-promocional-que-protege-tu-marca-en-ecuador': [
    { label: 'Ver todos los Bolígrafos Personalizados', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Bolígrafo Spray Max Antibacteriano', href: '/productos/boligrafo-spray-max-antibacteriano-9479' },
    { label: 'Artículos Antimicrobianos para Empresas', href: '/categorias/antimicrobianos' },
    { label: 'Artículos de Salud y Bienestar', href: '/categorias/medicos' },
  ],
  'herramientas-mustang-promocionales-impulsa-tu-marca-con-soluciones-practicas-ecuador': [
    { label: 'Ver Herramientas Promocionales', href: '/categorias/herramientas' },
    { label: 'Set de Herramientas Scout', href: '/productos/set-de-herramientas-scout-10287' },
    { label: 'Set de Herramientas Speed', href: '/productos/set-de-herramientas-speed-7999' },
    { label: 'Artículos de Oficina y Escritorio', href: '/categorias/articulos-de-oficina-personalizados' },
  ],
  'promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-ecuador': [
    { label: 'Catálogo de Artículos Antimicrobianos', href: '/categorias/antimicrobianos' },
    { label: 'Bolígrafo Flom 4-1 Antibacteriano', href: '/productos/boligrafo-flom-4-1-antibacteriano-9531' },
    { label: 'Bolígrafo Spray Max Antibacteriano', href: '/productos/boligrafo-spray-max-antibacteriano-9479' },
    { label: 'Artículos Médicos Promocionales', href: '/categorias/medicos' },
  ],
  'cuellos-multifuncionales-personalizados-la-estrategia-publicitaria-imbatible-para-tu-negocio-en-ecuador': [
    { label: 'Confección y Textiles Corporativos', href: '/categorias/camisetas-y-confeccion-corporativa' },
    { label: 'Gorras Personalizadas', href: '/categorias/gorras-personalizadas' },
    { label: 'Artículos Deportivos Corporativos', href: '/categorias/deportes' },
    { label: 'Ver Artículos Promocionales', href: '/articulos-promocionales/' },
  ],
  'diseno-logos-productos-promocionales': [
    { label: 'Bolígrafos con Logo Corporativo', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Mugs Sublimables con Diseño', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Gorras con Bordado de Logo', href: '/categorias/gorras-personalizadas' },
    { label: 'Merchandising Corporativo', href: '/merchandising-corporativo/' },
  ],
  'branding-textiles-personalizados-empresas': [
    { label: 'Confección y Camisetas Corporativas', href: '/categorias/camisetas-y-confeccion-corporativa' },
    { label: 'Gorras con Bordado', href: '/categorias/gorras-personalizadas' },
    { label: 'Gorra Mesh Urban Travel', href: '/productos/gorra-mesh-urban-travel-10602' },
    { label: 'Merchandising Corporativo', href: '/merchandising-corporativo/' },
  ],
  'productos-tecnologicos-promocionales-tendencias': [
    { label: 'Ver Tecnología Promocional', href: '/categorias/tecnologia-promocional' },
    { label: 'Speaker Bluetooth Bass Swisspeak', href: '/productos/speaker-bluetooth-bass-swisspeak-8933' },
    { label: 'Puerto USB Ruler Bamboo', href: '/productos/puerto-usb-ruler-bamboo-10814' },
    { label: 'Auriculares y Parlantes Bluetooth', href: '/audifonos-promocionales/' },
  ],
  'productos-promocionales-ecuador': [
    { label: 'Tecnología Promocional', href: '/categorias/tecnologia-promocional' },
    { label: 'Bolígrafos Personalizados', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Mugs y Termos Corporativos', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Ver todos los Artículos Promocionales', href: '/articulos-promocionales/' },
  ],
  'estrategias-marketing-merchandising-empresarial': [
    { label: 'Mugs y Termos de Marca', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Morrales y Maletines Corporativos', href: '/categorias/mochilas-y-maletines-personalizados' },
    { label: 'Bolígrafos Personalizados', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Merchandising Corporativo', href: '/merchandising-corporativo/' },
  ],
  'beneficios-productos-promocionales-ecuador-guia-completa': [
    { label: 'Bolígrafos Personalizados Ecuador', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Mugs y Termos Corporativos', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Tecnología Promocional', href: '/categorias/tecnologia-promocional' },
    { label: 'Ver todos los Artículos Promocionales', href: '/articulos-promocionales/' },
  ],
  'enamora-a-tus-clientes-regalos-corporativos-unicos-para-amor-y-amistad': [
    { label: 'Mugs y Termos Personalizados', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Llaveros Decorativos', href: '/categorias/llaveros-personalizados' },
    { label: 'Set de Pelotas Cork (antiestrés)', href: '/productos/set-de-pelotas-cork-10434' },
    { label: 'Regalos Corporativos Personalizados', href: '/regalos-corporativos/' },
  ],
  'buscas-productos-promocionales-en-quito-encuentra-el-ideal-aqui': [
    { label: 'Bolígrafos Personalizados en Quito', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Mugs y Termos Corporativos', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Tecnología Promocional Ecuador', href: '/categorias/tecnologia-promocional' },
    { label: 'Ver todos los Artículos Promocionales', href: '/articulos-promocionales/' },
  ],
  'merchandising-eventos-corporativos-ecuador': [
    { label: 'Gorras para Eventos Corporativos', href: '/categorias/gorras-personalizadas' },
    { label: 'Morrales y Maletines para Eventos', href: '/categorias/mochilas-y-maletines-personalizados' },
    { label: 'Mugs y Termos de Marca', href: '/categorias/mugs-y-termos-personalizados' },
    { label: 'Merchandising para Ferias y Eventos', href: '/merchandising-corporativo/' },
  ],
  'boligrafos-personalizados-la-mejor-inversion-publicitaria-en-ecuador': [
    { label: 'Ver todo el Catálogo de Bolígrafos', href: '/categorias/boligrafos-publicitarios' },
    { label: 'Bolígrafo Mop Like Stylus', href: '/productos/boligrafo-mop-like-stylus-10030' },
    { label: 'Bolígrafo Dormin Bamboo (bambú ecológico)', href: '/productos/boligrafo-dormin-bamboo-10839' },
    { label: 'Set de Herramientas de Escritura', href: '/categorias/articulos-de-oficina-personalizados' },
  ],
};

// ── HTML block generator ───────────────────────────────────────────────────
function buildCTA(links) {
  const items = links.map(l =>
    `    <li><a href="${l.href}">${l.label}</a></li>`
  ).join('\n');

  return `\n\n<h3>Productos recomendados</h3>\n<ul>\n${items}\n</ul>\n`;
}

// ── Apply URL fixes to a JS file string ────────────────────────────────────
function applyFixes(source) {
  let result = source;
  for (const [from, to] of URL_FIXES) {
    // Escape for literal string search (not regex)
    result = result.split(from).join(to);
  }
  return result;
}

// ── Process a content file ─────────────────────────────────────────────────
function processFile(filePath, targetSlugs) {
  const source = fs.readFileSync(filePath, 'utf8');
  let result = applyFixes(source);

  if (targetSlugs) {
    // For each slug without links, append CTA in its content string
    for (const slug of targetSlugs) {
      const links = POST_LINKS[slug];
      if (!links) continue;

      const cta = buildCTA(links);
      // Find the content string for this slug and append before closing quote
      // Pattern: the value ends with ...content\n` or ...content\n'
      // We look for the slug key and replace its closing quote
      const escapedSlug = slug.replace(/-/g, '\\-');
      // Match: 'slug': `...content` or "slug": "...content"
      // We use a simpler approach: find the last occurrence of the content string boundary
      // Since content uses template literals or regular strings, we look for the end marker

      // Strategy: find `  '${slug}':` or `  "${slug}":` and then find its string ending
      const keyPattern = new RegExp(`(['"]${slug}['"]\\s*:\\s*)(\`([\\s\\S]*?)\`|'([\\s\\S]*?(?<!\\\\))'|"([\\s\\S]*?(?<!\\\\))")`);
      // This is fragile with multiline. Better to use a specific end-of-value marker.

      // Simpler: find the closing of the template literal for this slug
      // All content in these files uses backtick template literals
      const slugKey = `'${slug}'`;
      const slugKey2 = `"${slug}"`;
      const startIdx = result.indexOf(slugKey) !== -1 ? result.indexOf(slugKey) : result.indexOf(slugKey2);
      if (startIdx === -1) continue;

      // Find the opening backtick after the colon
      const colonIdx = result.indexOf(':', startIdx);
      if (colonIdx === -1) continue;
      const btOpen = result.indexOf('`', colonIdx);
      if (btOpen === -1) continue;
      const btClose = result.indexOf('`', btOpen + 1);
      if (btClose === -1) continue;

      // Insert CTA before closing backtick
      const existing = result.slice(btOpen + 1, btClose);
      if (existing.includes('<a href')) continue; // already has links

      result = result.slice(0, btClose) + cta + result.slice(btClose);
    }
  }

  return result;
}

// ── Main ────────────────────────────────────────────────────────────────────
function main() {
  const contentDir = path.join(ROOT, 'data', 'blog', 'content');

  // 1. Fix index.js (URL fixes only — already has links)
  const indexPath = path.join(contentDir, 'index.js');
  const indexFixed = applyFixes(fs.readFileSync(indexPath, 'utf8'));
  fs.writeFileSync(indexPath, indexFixed, 'utf8');
  console.log('✅ data/blog/content/index.js — URLs corregidos');

  // 2. Fix additions.js + add CTAs to posts without links
  const additionsPath = path.join(contentDir, 'additions.js');
  const slugsToFix = Object.keys(POST_LINKS);
  const additionsFixed = processFile(additionsPath, slugsToFix);
  fs.writeFileSync(additionsPath, additionsFixed, 'utf8');
  console.log('✅ data/blog/content/additions.js — URLs corregidos + CTAs añadidos');

  // 3. Fix fase3.js (URL fixes only)
  const fase3Path = path.join(contentDir, 'fase3.js');
  if (fs.existsSync(fase3Path)) {
    const fase3Fixed = applyFixes(fs.readFileSync(fase3Path, 'utf8'));
    fs.writeFileSync(fase3Path, fase3Fixed, 'utf8');
    console.log('✅ data/blog/content/fase3.js — URLs corregidos');
  }

  // 4. Verify
  console.log('\n🔍 Verificando links restantes...');
  const allFixed = [indexFixed, additionsFixed];
  const broken = [];
  const brokenPatterns = [
    /href="\/categoria\//,
    /href="\/tienda/,
    /href="\/categorias\/bolsos-mochilas/,
    /href="\/categorias\/maletines"/,
    /href="\/categorias\/escritura"/,
    /href="\/categorias\/mugs"/,
    /href="\/categorias\/tecnologia"/,
    /href="\/catalogos-digitales/,
    /href="\/productos\/boligrafo-dormin-bamboo"/,
    /href="\/productos\/gorra-6-paneles-galva/,
  ];
  allFixed.forEach((content, i) => {
    const fname = i === 0 ? 'index.js' : 'additions.js';
    brokenPatterns.forEach(p => {
      if (p.test(content)) broken.push(`${fname}: ${p.source}`);
    });
  });

  if (broken.length === 0) {
    console.log('✅ No se encontraron patrones de URLs rotos');
  } else {
    broken.forEach(b => console.log('⚠️ ', b));
  }

  console.log('\n🎯 Próximo paso: pnpm run build');
}

main();
