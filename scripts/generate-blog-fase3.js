#!/usr/bin/env node
'use strict';
// scripts/generate-blog-fase3.js
// Genera entradas de blog Fase 3 con la API de Claude.
// Uso: node scripts/generate-blog-fase3.js
//      node scripts/generate-blog-fase3.js --only mejores-regalos-corporativos

const fs   = require('fs');
const path = require('path');
const https = require('https');

/* ── .env ────────────────────────────────────────────────────────── */
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  });
}
loadEnv();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('❌  ANTHROPIC_API_KEY no encontrada en .env'); process.exit(1); }

/* ── Paths ───────────────────────────────────────────────────────── */
const ROOT         = path.join(__dirname, '..');
const POSTS_FILE   = path.join(ROOT, 'data', 'blog', 'posts.json');
const FASE3_FILE   = path.join(ROOT, 'data', 'blog', 'content', 'fase3.js');
const SITE        = 'https://www.kronosolopromocionales.com';
const WA          = `https://wa.me/593999814838?text=${encodeURIComponent('Hola, quiero cotizar artículos promocionales para mi empresa')}`;
const MODEL       = 'claude-sonnet-4-6';

/* ── Helpers ────────────────────────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function callClaude(userPrompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 6000,
      messages: [{ role: 'user', content: userPrompt }],
      system: `Eres un redactor SEO especializado en B2B y artículos promocionales para Ecuador.
Escribes en español neutro latinoamericano, tono profesional pero directo.
NUNCA uses frases genéricas como "En el mundo empresarial actual..." o "En la era digital...".
NUNCA menciones Colombia — el negocio atiende solo Ecuador.
Cada artículo debe ser concreto, específico y útil para gerentes de compras y marketing en Ecuador.
Devuelve SOLO el HTML del cuerpo del artículo. Sin explicaciones, sin markdown, sin \`\`\`html.`
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.content[0].text);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Post definitions ───────────────────────────────────────────── */
const POSTS = [
  {
    id: 'mejores-regalos-corporativos-ecuador-2026',
    slug: 'mejores-regalos-corporativos-para-empresas-ecuador-2026',
    title: 'Los Mejores Regalos Corporativos para Empresas en Ecuador 2026',
    category: 'regalos-corporativos',
    categoryName: 'Regalos Corporativos',
    excerpt: 'Guía actualizada 2026: los regalos corporativos más efectivos para empresas en Ecuador, con precios reales, técnicas de personalización y criterios de selección según el perfil del receptor.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80',
    tags: ['regalos corporativos Ecuador', 'regalos corporativos para empresas', 'artículos promocionales personalizados', 'regalos empresariales 2026'],
    seo: {
      metaTitle: 'Los Mejores Regalos Corporativos para Empresas en Ecuador 2026 | KS Promocionales',
      metaDescription: 'Guía 2026 de los mejores regalos corporativos para empresas en Ecuador: bolígrafos, mugs, tecnología, gorras y más. Con precios, técnicas de personalización y criterios B2B.',
      keywords: 'regalos corporativos Ecuador, mejores regalos corporativos para empresas, artículos promocionales Ecuador, regalos empresariales 2026',
    },
    prompt: `Escribe un artículo de blog de MÍNIMO 1800 palabras sobre los mejores regalos corporativos para empresas en Ecuador en 2026.

PÚBLICO: Gerentes de marketing, directores comerciales y jefes de compras de empresas medianas y grandes en Ecuador (Quito, Guayaquil, Cuenca, Ambato, Loja).

KEYWORD PRINCIPAL: "regalos corporativos para empresas Ecuador"

ESTRUCTURA REQUERIDA:
1. Intro (2 párrafos impactantes, dato estadístico real o verosímil del mercado ecuatoriano)
2. H2: "Qué hace efectivo un regalo corporativo en Ecuador" (psicología del regalo B2B, cultura empresarial ecuatoriana)
3. H2: "Los 8 mejores regalos corporativos para empresas en Ecuador" — para cada uno incluye:
   - H3 con nombre del artículo
   - Caja de specs con: precio estimado por unidad (USD), técnica de personalización recomendada, mínimo de pedido, mejor para qué sector/ocasión
   - 2-3 párrafos explicativos
   Los 8 artículos son: bolígrafos promocionales, mugs y termos, gorras personalizadas, memorias USB, morrales corporativos, tecnología (audífonos/parlantes), llaveros, artículos de oficina
4. H2: "Cómo elegir el regalo correcto según el receptor" — tabla con 4 perfiles: ejecutivo senior, equipo de campo/ventas, cliente masivo (ferias), colaborador nuevo (onboarding)
5. H2: "Errores comunes al comprar regalos corporativos en Ecuador" (lista de 5 errores con explicación)
6. H2: "Preguntas frecuentes sobre regalos corporativos en Ecuador" — 4 preguntas específicas con respuestas completas
7. CTA final llamativo para cotizar por WhatsApp

LINKS INTERNOS (inclúyelos naturalmente):
- <a href="${SITE}/categorias/boligrafos-publicitarios/">bolígrafos promocionales</a>
- <a href="${SITE}/categorias/mugs-y-termos-personalizados/">mugs y termos personalizados</a>
- <a href="${SITE}/categorias/tecnologia-promocional/">tecnología promocional</a>
- <a href="${SITE}/categorias/gorras-personalizadas/">gorras personalizadas</a>
- <a href="${SITE}/categorias/memorias-usb-personalizadas/">memorias USB personalizadas</a>
- <a href="${SITE}/regalos-corporativos/">ver catálogo de regalos corporativos</a>
- <a href="${WA}">cotiza por WhatsApp</a>

FORMATO HTML: Usa h2, h3, p, ul, ol, table, div. Para las cajas de specs usa este patrón:
<div style="background:#f8faff;border:1px solid #e0e7ff;border-radius:12px;padding:20px;margin:16px 0;">
Para tablas, usa encabezados con style="background:#001A6E;color:white;".
Primer párrafo del artículo debe tener class="lead".

SIN Colombia, SIN frases genéricas, SIN intro tipo "En el competitivo mundo...".`,
  },

  {
    id: 'merchandising-ferias-empresariales-ecuador',
    slug: 'merchandising-para-ferias-empresariales-ecuador',
    title: 'Merchandising para Ferias Empresariales en Ecuador: Qué Llevar y Cómo Destacar',
    category: 'merchandising',
    categoryName: 'Merchandising',
    excerpt: 'Guía práctica de merchandising para ferias empresariales en Ecuador: qué artículos llevar, cómo calcular cantidades, errores de stand y estrategias para maximizar el retorno de tu inversión en ferias.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80',
    tags: ['merchandising para ferias', 'artículos para ferias empresariales', 'merchandising corporativo Ecuador', 'artículos promocionales ferias'],
    seo: {
      metaTitle: 'Merchandising para Ferias Empresariales en Ecuador: Guía Completa | KS Promocionales',
      metaDescription: 'Qué artículos llevar a ferias empresariales en Ecuador, cómo calcular cantidades y estrategias de stand. Guía completa de merchandising para ferias B2B.',
      keywords: 'merchandising para ferias empresariales Ecuador, artículos promocionales para ferias, merchandising corporativo ferias, kit feria empresarial Ecuador',
    },
    prompt: `Escribe un artículo de blog de MÍNIMO 1800 palabras sobre merchandising para ferias empresariales en Ecuador.

PÚBLICO: Gerentes de marketing y coordinadores de eventos de empresas ecuatorianas que participan en ferias como Expoconstrucción, Expo Mundo Empresarial, ferias sectoriales, etc.

KEYWORD PRINCIPAL: "merchandising para ferias empresariales Ecuador"

ESTRUCTURA REQUERIDA:
1. Intro: el error más caro de las ferias (2 párrafos concretos)
2. H2: "Por qué el merchandising determina el éxito de tu feria" (datos, psicología del visitante, diferenciación de stand)
3. H2: "Los artículos más efectivos para ferias empresariales en Ecuador" — para cada artículo:
   - H3 con nombre
   - Por qué funciona específicamente en ferias
   - Técnica de personalización ideal para feria (rápida impresión visual)
   - Cuándo darlo (a todos vs solo a prospectos calificados)
   Los artículos: bolígrafos, llaveros, bolsas/morrales, gorras, libretas, tarjeteros, mugs, USB
4. H2: "Cómo calcular cuántos artículos llevar a una feria" (fórmula: días x visitantes esperados x % prospectos calificados)
5. H2: "Kit de feria empresarial: las 3 capas de merchandising" (tier 1 = para todos, tier 2 = para prospectos, tier 3 = para clientes VIP de stand)
6. H2: "Errores que destruyen el retorno de inversión en ferias" (lista de 6 errores con alternativas)
7. H2: "Preguntas frecuentes sobre merchandising para ferias" — 4 FAQs
8. CTA final de cotización con énfasis en anticipación (pedir con tiempo antes de la feria)

LINKS INTERNOS (inclúyelos naturalmente):
- <a href="${SITE}/categorias/boligrafos-publicitarios/">bolígrafos publicitarios</a>
- <a href="${SITE}/categorias/llaveros-personalizados/">llaveros personalizados</a>
- <a href="${SITE}/categorias/mochilas-y-maletines-personalizados/">bolsas y morrales</a>
- <a href="${SITE}/categorias/gorras-personalizadas/">gorras personalizadas</a>
- <a href="${SITE}/material-publicitario/">material publicitario para empresas</a>
- <a href="${SITE}/merchandising-corporativo/">merchandising corporativo</a>
- <a href="${WA}">cotizar artículos para tu feria</a>

FORMATO HTML con h2, h3, p, ul, ol, table, div con inline styles navy/naranja.
SIN Colombia, SIN frases genéricas de apertura.`,
  },

  {
    id: 'boligrafos-promocionales-para-empresas',
    slug: 'boligrafos-promocionales-personalizados-guia-empresas-ecuador',
    title: 'Bolígrafos Promocionales Personalizados: Guía Completa para Empresas en Ecuador',
    category: 'guias-productos',
    categoryName: 'Guías de Productos',
    excerpt: 'Todo lo que necesitas saber sobre bolígrafos promocionales para empresas en Ecuador: tipos, materiales, técnicas de impresión, precios y cómo elegir el bolígrafo correcto para cada campaña.',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80',
    tags: ['bolígrafos promocionales', 'bolígrafos personalizados para empresas', 'bolígrafos publicitarios Ecuador', 'artículos de escritura personalizados'],
    seo: {
      metaTitle: 'Bolígrafos Promocionales Personalizados para Empresas en Ecuador | Guía 2026',
      metaDescription: 'Guía completa de bolígrafos promocionales para empresas en Ecuador: tipos (metálicos, ecológicos, ejecutivos), técnicas de impresión, precios y cantidades mínimas. Cotiza sin compromiso.',
      keywords: 'bolígrafos promocionales Ecuador, bolígrafos personalizados para empresas, bolígrafos publicitarios Ecuador, cómo elegir bolígrafos promocionales',
    },
    prompt: `Escribe un artículo de blog de MÍNIMO 1800 palabras sobre bolígrafos promocionales personalizados para empresas en Ecuador.

PÚBLICO: Coordinadores de marketing, asistentes de compras y gerentes de eventos de empresas en Ecuador que están evaluando bolígrafos como artículo promocional.

KEYWORD PRINCIPAL: "bolígrafos promocionales personalizados para empresas Ecuador"

ESTRUCTURA REQUERIDA:
1. Intro: por qué los bolígrafos siguen siendo el artículo #1 del merchandising a pesar de las predicciones de su muerte (datos de retención, costo por impresión)
2. H2: "Tipos de bolígrafos promocionales para empresas" — tabla comparativa completa:
   - Bolígrafo económico plástico, bolígrafo semimetálico, bolígrafo metálico, bolígrafo ejecutivo, bolígrafo ecológico
   - Para cada uno: precio rango, mejor ocasión de uso, técnica de impresión, mínimo de pedido
3. H2: "Técnicas de personalización para bolígrafos: cuál elegir" (serigrafía vs tampografía vs grabado láser — ventajas y cuándo usar cada una)
4. H2: "Cómo elegir el bolígrafo correcto según el objetivo de tu campaña"
   - Para ferias y eventos masivos
   - Para clientes VIP y ejecutivos
   - Para kits de bienvenida (onboarding)
   - Para capacitaciones y talleres
   - Para distribución de marca en el retail
5. H2: "Cuántos bolígrafos necesito y cómo calcular mi presupuesto" (fórmula de cálculo, tabla de precios por rango de cantidad)
6. H2: "Errores a evitar al comprar bolígrafos promocionales" (5 errores con alternativas)
7. H2: "Preguntas frecuentes sobre bolígrafos promocionales en Ecuador" — 5 FAQs
8. CTA de cotización

LINKS INTERNOS:
- <a href="${SITE}/categorias/boligrafos-publicitarios/">bolígrafos publicitarios en KS Promocionales</a>
- <a href="${SITE}/articulos-promocionales/">artículos promocionales para empresas</a>
- <a href="${SITE}/material-publicitario/">material publicitario</a>
- <a href="${WA}">cotiza bolígrafos personalizados</a>

FORMATO HTML completo con tablas inline styles navy/naranja, cajas de resumen, listas.
SIN Colombia. Tono técnico-comercial, muy concreto y útil.`,
  },

  {
    id: 'articulos-promocionales-ecologicos-ecuador-2026',
    slug: 'articulos-promocionales-ecologicos-para-empresas-ecuador',
    title: 'Artículos Promocionales Ecológicos para Empresas en Ecuador: Guía ESG 2026',
    category: 'sostenibilidad',
    categoryName: 'Sostenibilidad',
    excerpt: 'Guía de artículos promocionales ecológicos y sostenibles para empresas en Ecuador. Opciones en bambú, materiales reciclados y biodegradables para alinear tu merchandising con tus políticas ESG.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80',
    tags: ['artículos promocionales ecológicos', 'merchandising sostenible Ecuador', 'regalos corporativos ecológicos', 'artículos publicitarios ecológicos ESG'],
    seo: {
      metaTitle: 'Artículos Promocionales Ecológicos para Empresas en Ecuador | ESG 2026 | KS Promocionales',
      metaDescription: 'Guía de artículos promocionales ecológicos para empresas en Ecuador. Opciones en bambú, reciclados y biodegradables para campañas ESG. Cotiza sin compromiso.',
      keywords: 'artículos promocionales ecológicos Ecuador, merchandising sostenible empresas, regalos corporativos ecológicos Ecuador, artículos publicitarios biodegradables',
    },
    prompt: `Escribe un artículo de blog de MÍNIMO 1800 palabras sobre artículos promocionales ecológicos y sostenibles para empresas en Ecuador.

PÚBLICO: Directores de RSE (Responsabilidad Social Empresarial), gerentes de marketing y coordinadores de compras de empresas con políticas ESG en Ecuador.

KEYWORD PRINCIPAL: "artículos promocionales ecológicos para empresas Ecuador"

ESTRUCTURA REQUERIDA:
1. Intro: el costo reputacional de regalar plástico en 2026 (datos de percepción de marca, tendencias ESG en Ecuador)
2. H2: "Por qué las empresas ecuatorianas están migrando a merchandising ecológico" (normas, presión de stakeholders, diferenciación competitiva)
3. H2: "Los mejores artículos promocionales ecológicos para empresas en Ecuador" — para cada artículo:
   - H3 con nombre y material
   - Certificaciones o estándares aplicables
   - Técnica de personalización recomendada
   - Precio estimado por unidad
   - Mejor uso corporativo
   Los artículos: bolígrafos de bambú/papel reciclado, libretas de papel reciclado, bolsas de yute/tela, termos reutilizables, kits de cubiertos reutilizables, semillas/plantas personalizadas, sets bambú
4. H2: "Cómo comunicar el compromiso ecológico a través de tus artículos promocionales" (mensajes en el packaging, certificaciones, narrativa ESG)
5. H2: "Merchandising ecológico por ocasión y sector" — tabla con: sector, ocasión, artículo eco recomendado, mensaje de marca sugerido
6. H2: "Mitos sobre los artículos ecológicos que frenan a las empresas" (precio, calidad, disponibilidad — desmontados con datos)
7. H2: "Preguntas frecuentes sobre artículos promocionales ecológicos" — 4 FAQs
8. CTA final ecológico/diferenciador

LINKS INTERNOS:
- <a href="${SITE}/categorias/ecologia/">artículos ecológicos y sostenibles</a>
- <a href="${SITE}/categorias/mochilas-y-maletines-personalizados/">bolsas promocionales</a>
- <a href="${SITE}/regalos-corporativos/">regalos corporativos</a>
- <a href="${SITE}/merchandising-corporativo/">merchandising corporativo</a>
- <a href="${WA}">cotiza tu línea eco</a>

SIN Colombia. Tono comprometido y específico. Cita contexto ecuatoriano (Ministerio de Ambiente, campañas nacionales, empresas referentes en Ecuador).`,
  },

  {
    id: 'cuanto-cuestan-articulos-promocionales-ecuador',
    slug: 'cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador',
    title: 'Cuánto Cuestan los Artículos Promocionales Personalizados en Ecuador 2026',
    category: 'guias-productos',
    categoryName: 'Guías de Productos',
    excerpt: 'Guía de precios actualizada 2026 de artículos promocionales personalizados en Ecuador: tablas de precios por categoría, factores que afectan el costo, cómo calcular tu presupuesto y cómo optimizar el ROI.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80',
    tags: ['precio artículos promocionales Ecuador', 'cuánto cuestan artículos promocionales', 'presupuesto merchandising Ecuador', 'artículos promocionales baratos Ecuador'],
    seo: {
      metaTitle: 'Cuánto Cuestan los Artículos Promocionales Personalizados en Ecuador 2026 | KS',
      metaDescription: 'Guía de precios de artículos promocionales personalizados en Ecuador 2026. Tablas por categoría, factores de costo, presupuesto mínimo y cómo calcular el ROI de tu campaña.',
      keywords: 'precio artículos promocionales Ecuador, cuánto cuestan artículos promocionales, presupuesto merchandising Ecuador, artículos promocionales Ecuador precio',
    },
    prompt: `Escribe un artículo de blog de MÍNIMO 1800 palabras sobre cuánto cuestan los artículos promocionales personalizados en Ecuador en 2026.

PÚBLICO: Gerentes de compras, coordinadores de marketing y dueños de empresa en Ecuador que están presupuestando una campaña de artículos promocionales por primera vez o comparando precios.

KEYWORD PRINCIPAL: "cuánto cuestan los artículos promocionales personalizados en Ecuador"

ESTRUCTURA REQUERIDA:
1. Intro: la pregunta que todos hacen primero — y por qué la respuesta honesta es "depende" (pero te lo explicamos todo)
2. H2: "Tabla de precios de artículos promocionales en Ecuador 2026" — tabla grande con:
   - Columnas: Artículo, Rango de precio (USD/unidad), Cantidad mínima, Técnica incluida, Tiempo de entrega
   - Filas: bolígrafo plástico, bolígrafo metálico, mug cerámico, termo acero, USB 8GB, gorra, llavero metal, morral/mochila básica, libreta, camiseta básica, audífono in-ear, parlante bluetooth
3. H2: "Factores que afectan el precio de los artículos promocionales" (8 factores con explicación: cantidad, material, técnica, colores, plazo, personalización especial, packaging, origen)
4. H2: "Cómo calcular el presupuesto total de tu campaña" (fórmula: unidades x precio unitario + arte + envío + markup de tiempo; template de presupuesto)
5. H2: "Presupuestos típicos de empresas en Ecuador por tamaño" — tabla con: empresa pequeña / mediana / grande, presupuesto trimestral típico, artículos recomendados, distribución de budget
6. H2: "Cómo optimizar el ROI de tu inversión en artículos promocionales" (5 estrategias concretas)
7. H2: "Preguntas frecuentes sobre precios de artículos promocionales" — 5 FAQs (incluye IVA, formas de pago, descuentos por volumen)
8. CTA de cotización gratuita

LINKS INTERNOS:
- <a href="${SITE}/articulos-promocionales/">catálogo de artículos promocionales</a>
- <a href="${SITE}/categorias/boligrafos-publicitarios/">bolígrafos promocionales</a>
- <a href="${SITE}/categorias/mugs-y-termos-personalizados/">mugs y termos</a>
- <a href="${SITE}/categorias/tecnologia-promocional/">tecnología promocional</a>
- <a href="${SITE}/regalos-corporativos/">regalos corporativos</a>
- <a href="${WA}">solicitar cotización gratuita</a>

NOTA IMPORTANTE: Los precios deben ser estimados razonables en USD para Ecuador 2026 (considera aranceles de importación, IVA 15%, márgenes). Sé honesto y útil, no inflado.
SIN Colombia. Muy concreto y práctico.`,
  },
];

/* ── Main ────────────────────────────────────────────────────────── */
async function main() {
  const onlySlug = process.argv[2] === '--only' ? process.argv[3] : null;

  // Load existing posts to avoid duplicates
  const existingPosts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const existingSlugs = new Set(existingPosts.map(p => p.slug));

  // Load existing fase3 content (if any)
  let fase3Content = {};
  if (fs.existsSync(FASE3_FILE)) {
    const raw = fs.readFileSync(FASE3_FILE, 'utf-8');
    const match = raw.match(/export const blogFase3 = (\{[\s\S]*\});/);
    if (match) {
      try { fase3Content = JSON.parse(match[1].replace(/`([\s\S]*?)`/g, (_, c) => JSON.stringify(c))); } catch (_) {}
    }
  }

  // --only forces regeneration even if slug already exists
  const toGenerate = POSTS.filter(p =>
    onlySlug ? p.slug === onlySlug : !existingSlugs.has(p.slug)
  );

  if (toGenerate.length === 0) {
    console.log('✅  Todos los posts ya existen. Nada que generar.');
    return;
  }

  console.log(`\n🚀  Generando ${toGenerate.length} post(s) con Claude API (${MODEL})...\n`);

  const newPosts = [];
  const newContent = {};

  for (const post of toGenerate) {
    console.log(`📝  Generando: "${post.title}"`);
    try {
      const html = await callClaude(post.prompt);

      // Estimate word count
      const words = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
      console.log(`   ✓ ${words} palabras generadas`);

      newContent[post.slug] = html;

      const { prompt: _p, ...meta } = post;
      newPosts.push({
        ...meta,
        author: 'Claudia González',
        authorImage: '/images/team/claudia-gonzalez.jpg',
        authorLinkedIn: 'https://www.linkedin.com/in/claudia-gonzalez-344a3b132/',
        authorRole: 'Especialista en Artículos Promocionales',
        date: today(),
        dateModified: today(),
        readTime: `${Math.ceil(words / 200)} min`,
      });

      // Throttle between API calls
      if (toGenerate.indexOf(post) < toGenerate.length - 1) {
        console.log('   ⏳ Esperando 3s antes del siguiente...');
        await sleep(3000);
      }
    } catch (err) {
      console.error(`   ❌ Error generando "${post.slug}":`, err.message);
    }
  }

  if (Object.keys(newContent).length === 0) {
    console.error('\n❌  No se generó ningún post. Revisa los errores anteriores.');
    process.exit(1);
  }

  // Write fase3.js
  const merged = { ...fase3Content, ...newContent };
  const entries = Object.entries(merged)
    .map(([slug, html]) => `  ${JSON.stringify(slug)}: \`${html.replace(/`/g, '\\`')}\``)
    .join(',\n\n');
  fs.writeFileSync(FASE3_FILE,
    `// AUTO-GENERADO por scripts/generate-blog-fase3.js — NO editar manualmente\nexport const blogFase3 = {\n${entries}\n};\n`,
    'utf-8'
  );
  console.log(`\n✅  Contenido escrito en: data/blog/content/fase3.js`);

  // Append to posts.json
  const updatedPosts = [...existingPosts, ...newPosts];
  fs.writeFileSync(POSTS_FILE, JSON.stringify(updatedPosts, null, 2), 'utf-8');
  console.log(`✅  ${newPosts.length} post(s) agregados a data/blog/posts.json`);

  console.log(`\n🎉  Listo. Slugs generados:`);
  newPosts.forEach(p => console.log(`   /blog/${p.slug}/`));
  console.log('\n⚠️   Recuerda hacer pnpm build y netlify deploy.\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
