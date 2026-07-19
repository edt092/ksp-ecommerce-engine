#!/usr/bin/env node
// Escanea el código fuente y el contenido del blog en busca de enlaces internos
// hardcodeados (rutas estáticas, categorías, productos, blog, ciudades) y de
// imágenes locales referenciadas, y valida que todo exista. No intenta resolver
// enlaces externos (otros dominios) como si fueran archivos locales.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const ROOT = join(import.meta.dirname, '..');
const SITE_HOSTS = new Set(['www.kronosolopromocionales.com', 'kronosolopromocionales.com']);

process.on('uncaughtException', (err) => {
  console.error(`[find-broken-internal-links] ERROR DE CÓDIGO: ${err.message}`);
  process.exit(1);
});

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'out') continue;
      walk(full, exts, out);
    } else if (exts.includes(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

function readJsonRequired(path, label) {
  if (!existsSync(path)) throw new Error(`Falta el archivo requerido "${label}" en ${path}`);
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (err) {
    throw new Error(`"${label}" no es JSON válido: ${err.message}`);
  }
}

const products = readJsonRequired(join(ROOT, 'data', 'products.json'), 'data/products.json');
const categories = readJsonRequired(join(ROOT, 'data', 'categories.json'), 'data/categories.json');
const posts = readJsonRequired(join(ROOT, 'data', 'blog', 'posts.json'), 'data/blog/posts.json');

const productSlugs = new Set(products.map((p) => p.slug));
const categorySlugs = new Set(categories.map((c) => c.slug));
const blogSlugs = new Set(posts.map((p) => p.slug));
const citySlugs = new Set(['quito', 'guayaquil', 'cuenca', 'manta', 'ambato']);
const staticPaths = new Set([
  '/', 'contacto', 'nosotros', 'blog', 'catalogos-digitales', 'politica-de-privacidad',
  'productos-promocionales-ecuador', 'regalos-corporativos', 'articulos-promocionales',
  'material-publicitario', 'merchandising-corporativo', 'parlantes-bluetooth',
  'audifonos-promocionales', 'soportes-para-celular',
]);

if (!existsSync(join(ROOT, 'public', '_redirects'))) {
  throw new Error('No existe public/_redirects.');
}
const redirectSources = new Set();
const redirectsRaw = readFileSync(join(ROOT, 'public', '_redirects'), 'utf-8');
for (const line of redirectsRaw.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) redirectSources.add(parts[0].replace(/\/$/, ''));
}

const codeFiles = [
  ...walk(join(ROOT, 'src'), ['.tsx', '.ts', '.jsx', '.js']),
  ...walk(join(ROOT, 'data', 'blog', 'content'), ['.js']),
  ...walk(join(ROOT, 'data'), ['.js']).filter((f) => !f.includes(join('blog', 'content'))),
];

// ─── 1. Enlaces internos (href) ──────────────────────────────────────────────

// Captura el valor completo dentro de href="...", href='...' o href={`...`},
// sin asumir de antemano si es interno o externo — esa decisión se toma después
// de extraer el string completo, para no truncar ni confundir hosts externos.
const hrefPattern = /href=\{?[`"']([^`"'{}]+)[`"']\}?/g;
let linksChecked = 0;
const rows = [];

function classifyAndValidate(rawHref) {
  let href = rawHref.trim();
  if (!href) return null;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return null; // no es ruta interna del sitio
  if (href.startsWith('https://wa.me') || href.includes('wa.me/')) return null; // WhatsApp, externo
  if (/^\$\{|\.[a-zA-Z]+\}/.test(href)) {
    // Contiene interpolación de template literal sin resolver (ej. `/productos/${slug}/`).
    // No se puede validar estáticamente el slug — se omite sin marcar como roto.
    return null;
  }

  let path = href;
  if (/^https?:\/\//.test(href)) {
    let host;
    try { host = new URL(href).host; } catch { return null; }
    if (!SITE_HOSTS.has(host)) return null; // enlace externo — no se resuelve como archivo
    path = new URL(href).pathname;
  }
  if (!path.startsWith('/')) return null; // ruta relativa no absoluta (raro) — se omite

  // Separar anchors y query strings antes de validar el slug.
  path = path.split('#')[0].split('?')[0];
  const trimmedPath = path.replace(/^\/|\/$/g, '');
  if (trimmedPath === '') return { type: 'estatica', slug: '/', valid: true };

  // Assets estáticos (favicon.ico, .png, .svg, manifest.json, etc.) no son rutas
  // de página — se validan como archivo existente en public/, no como slug.
  if (/\.[a-z0-9]{2,5}$/i.test(trimmedPath)) {
    const exists = existsSync(join(ROOT, 'public', trimmedPath));
    return { type: 'asset_estatico', slug: trimmedPath, valid: exists, path: `/${trimmedPath}` };
  }

  const segments = trimmedPath.split('/');

  if (segments[0] === 'productos' && segments.length >= 2) {
    const slug = segments[1];
    return { type: 'productos', slug, valid: productSlugs.has(slug), path: `/productos/${slug}/` };
  }
  if (segments[0] === 'categorias' && segments.length >= 2) {
    const slug = segments[1];
    return { type: 'categorias', slug, valid: categorySlugs.has(slug), path: `/categorias/${slug}/` };
  }
  if (segments[0] === 'blog' && segments.length >= 2) {
    const slug = segments[1];
    return { type: 'blog', slug, valid: blogSlugs.has(slug), path: `/blog/${slug}/` };
  }
  if (segments[0] === 'productos-promocionales-ecuador' && segments.length >= 2) {
    const slug = segments[1];
    return { type: 'ciudad', slug, valid: citySlugs.has(slug), path: `/productos-promocionales-ecuador/${slug}/` };
  }
  if (segments.length === 1) {
    return { type: 'estatica', slug: segments[0], valid: staticPaths.has(segments[0]), path: `/${segments[0]}/` };
  }
  return null; // ruta no reconocida (ej. rutas de API, anclas internas de componentes) — no se evalúa
}

for (const file of codeFiles) {
  const content = readFileSync(file, 'utf-8');
  const relFile = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  let match;
  hrefPattern.lastIndex = 0;
  while ((match = hrefPattern.exec(content)) !== null) {
    const result = classifyAndValidate(match[1]);
    if (!result) continue;
    linksChecked++;
    if (!result.valid) {
      rows.push({ file: relFile, link: result.path || match[1], type: result.type, issue: 'slug_no_existe' });
    } else if (result.path && redirectSources.has(result.path.replace(/\/$/, ''))) {
      rows.push({ file: relFile, link: result.path, type: result.type, issue: 'apunta_a_url_redirigida' });
    }
  }
}

// ─── 2. Imágenes locales referenciadas ──────────────────────────────────────

const imagePattern = /['"](\/images\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|svg|gif|jfif))['"]/g;
const imageFiles = [
  ...walk(join(ROOT, 'src'), ['.tsx', '.ts', '.jsx', '.js']),
  ...walk(join(ROOT, 'data'), ['.js', '.json']),
];
const checkedImages = new Set();
let imagesChecked = 0;

for (const file of imageFiles) {
  const content = readFileSync(file, 'utf-8');
  const relFile = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  let match;
  imagePattern.lastIndex = 0;
  while ((match = imagePattern.exec(content)) !== null) {
    const imgPath = match[1];
    const dedupeKey = `${relFile}::${imgPath}`;
    if (checkedImages.has(dedupeKey)) continue;
    checkedImages.add(dedupeKey);
    imagesChecked++;
    const fullPath = join(ROOT, 'public', imgPath);
    if (!existsSync(fullPath)) {
      rows.push({ file: relFile, link: imgPath, type: 'imagen', issue: 'imagen_local_no_existe' });
    }
  }
}

// ─── Salida ──────────────────────────────────────────────────────────────────

mkdirSync(join(ROOT, 'reports'), { recursive: true });
const header = 'file,link,type,issue';
const csvLines = rows.map((r) => `${r.file},${r.link},${r.type},${r.issue}`);
writeFileSync(join(ROOT, 'reports', 'broken-internal-links.csv'), [header, ...csvLines].join('\n') + '\n', 'utf-8');

const totalChecked = linksChecked + imagesChecked;
console.log(`[find-broken-internal-links] Archivos de código escaneados: ${codeFiles.length}`);
console.log(`[find-broken-internal-links] Archivos revisados por imágenes: ${imageFiles.length}`);
if (rows.length > 0) {
  console.log('[find-broken-internal-links] Problemas encontrados:');
  for (const r of rows) console.log(`  - ${r.file}: ${r.link} (${r.type}, ${r.issue})`);
}
console.log('');
console.log(`Files scanned: ${new Set([...codeFiles, ...imageFiles]).size}`);
console.log(`Internal links checked: ${totalChecked} (${linksChecked} enlaces + ${imagesChecked} imágenes locales)`);
console.log(`Broken links: ${rows.length}`);
console.log(`Exit code: ${rows.length > 0 ? 1 : 0}`);

process.exit(rows.length > 0 ? 1 : 0);
