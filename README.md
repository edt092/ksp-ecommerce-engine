# KS Promocionales — Tienda Digital

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)

Catálogo digital B2B/B2C de artículos promocionales personalizados para Ecuador y Colombia. Genera ~4,000+ páginas HTML en build time a partir de JSON plano, sin base de datos ni servidor de aplicación. Incluye un pipeline de enriquecimiento con IA de cuatro agentes que transforma contenido de plantilla en copy SEO genuino.

**URL en produccion**: https://www.kronosolopromocionales.com

---

## Indice

1. [Vision general](#1-vision-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Pipeline de datos](#3-pipeline-de-datos)
   - 3.1 [Scraper diario](#31-scraper-diario-daily-scraperpy)
   - 3.2 [Pipeline de enriquecimiento IA](#32-pipeline-de-enriquecimiento-ia)
   - 3.3 [Evaluador de calidad](#33-evaluador-de-calidad-content_evaluatorpy)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Arquitectura Next.js](#5-arquitectura-nextjs)
   - 5.1 [Rutas y generacion estatica](#51-rutas-y-generacion-estatica)
   - 5.2 [Flujo de datos en build time](#52-flujo-de-datos-en-build-time)
   - 5.3 [Componentes clave](#53-componentes-clave)
6. [Modelo de datos](#6-modelo-de-datos)
7. [SEO: implementacion completa](#7-seo-implementacion-completa)
8. [Estilos y sistema de diseno](#8-estilos-y-sistema-de-diseno)
9. [Integraciones externas](#9-integraciones-externas)
10. [CI/CD y despliegue](#10-cicd-y-despliegue)
11. [Variables de entorno](#11-variables-de-entorno)
12. [Instalacion y desarrollo](#12-instalacion-y-desarrollo)
13. [Referencia de scripts](#13-referencia-de-scripts)
14. [Problemas conocidos y deuda tecnica](#14-problemas-conocidos-y-deuda-tecnica)

---

## 1. Vision general

KS Promocionales es una empresa ecuatoriana de regalos y artículos corporativos personalizados. Su catálogo cubre más de 3,900 productos en 34 categorías, disponibles para empresas en Ecuador (Quito, Guayaquil, Cuenca, Ibarra, Ambato) y Colombia (Bogotá, Medellín, Cali, Barranquilla, Cartagena). El canal de conversión principal no es un carrito de compras, sino WhatsApp Business: cada producto genera un mensaje prellenado con nombre y categoría para cotización directa.

**Restricciones de diseño que determinan toda la arquitectura:**

- El proveedor mayorista (`catalogospromocionales.com`) no tiene API pública — los productos se obtienen por scraping HTML.
- Netlify free tier requiere output estático (`output: 'export'`). No hay server-side rendering ni Edge Functions.
- El volumen de ~4,000 páginas descarta cualquier CMS headless con plan gratuito.
- Las imágenes de producto se sirven desde el CDN del proveedor (sin descarga local), lo que evita almacenamiento propio pero introduce dependencia de disponibilidad externa.

---

## 2. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FUENTES DE DATOS                                │
├─────────────────────────────────────────────────────────────────────────┤
│  catalogospromocionales.com          data/blog/content/*.md             │
│  (HTML scraping, ~60 secciones)      (markdown artículos blog)          │
└──────────────┬──────────────────────────────────────────────────────────┘
               │ HTTP GET (requests + BeautifulSoup)  [GitHub Actions cron]
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PIPELINE PYTHON                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  scripts/daily-scraper.py                                               │
│  → Extrae: nombre, imagen, categoría                                    │
│  → Genera: slug, template copy, whatsappMessage                         │
│  → Merge incremental en data/products.json (dedup por imagen URL)       │
│                          │                                              │
│  scripts/enrich_products.py  (manual / bajo demanda)                   │
│  → Filtra productos con thin content (ContentEvaluator score < 60)      │
│  → Orquesta pipeline de 4 agentes LLM (Gemini / Claude / GPT)          │
│  → Guarda progreso incremental cada 10 productos                        │
│                          │                                              │
│  scripts/content_evaluator.py                                           │
│  → Score 0–100: penaliza plantillas, textos cortos, keywords repetidos  │
│  → Flag is_ai_optimized: true en productos que superan score >= 60      │
└──────────────┬──────────────────────────────────────────────────────────┘
               │ JSON plano (data/products.json · categories.json)
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       BUILD TIME (npm run build)                        │
├─────────────────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router                                                  │
│  generateStaticParams() → ~4,000+ rutas estáticas                      │
│  generateMetadata()     → <title>, <meta>, hreflang, OpenGraph por ruta │
│  JSON-LD schemas        → Product, BreadcrumbList, Article, LocalBiz    │
│                          │                                              │
│  postbuild: next-sitemap → /out/sitemap.xml                             │
│             (solo incluye is_ai_optimized: true en productos)           │
└──────────────┬──────────────────────────────────────────────────────────┘
               │ /out/ (HTML + CSS + JS estáticos)
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          NETLIFY CDN                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  Publish dir: out/          Build: npm run build                        │
│  Netlify Image CDN: WebP/AVIF automático via /.netlify/images           │
│  Headers de seguridad: HSTS · CSP · X-Frame-Options · nosniff          │
│  Redirects 301: URLs legacy con "mexico" → "ecuador-y-colombia"         │
│  SSL/HTTPS: forzado con HSTS preload (max-age=31536000)                 │
└─────────────────────────────────────────────────────────────────────────┘
               │
               ▼
        kronosolopromocionales.com
        (sin servidor Node, sin base de datos)
```

---

## 3. Pipeline de datos

### 3.1 Scraper diario (`daily-scraper.py`)

El scraper es la primera etapa de toda la cadena. Su función exclusiva es mantener `data/products.json` actualizado con los productos disponibles en el proveedor.

**Flujo interno:**

```
1. get_all_categories()
   └─ GET /seccion/subcategorias.html → descubre categorías autodescubiertas
   └─ DIRECT_CATEGORY_URLS → 60+ categorías hardcodeadas no listadas

2. Por cada categoría:
   scrape_category(url, category_id)
   └─ Paginación automática (?pagina=2, ?pagina=3, …)
   └─ Extrae <img alt=""> o <h3> para nombre
   └─ Extrae src de imagen para URL y deduplicación

3. build_product(name, image_url, category_id)
   └─ Genera slug: slugify(name) + hash corto si hay colisión
   └─ Genera template copy (reemplazado luego por IA)
   └─ Genera whatsappMessage prellenado

4. merge_products(new_products, existing)
   └─ Clave de deduplicación: URL de imagen
   └─ Si ya existe: preserva campos enriquecidos (story, is_ai_optimized, etc.)
   └─ Si es nuevo: append con is_ai_optimized: false, quality_score: 0

5. Actualiza productCount en categories.json
```

**Configuración de ejecución:**

```bash
pip install requests beautifulsoup4 lxml
python scripts/daily-scraper.py
```

Se ejecuta automáticamente via GitHub Actions (`.github/workflows/daily-scraper.yml`) todos los días a las 06:00 UTC (02:00 hora Ecuador). El commit generado incluye `[skip ci]` para no disparar un build de Netlify innecesario.

**Nota sobre imágenes:** las URLs de imagen en `products.json` apuntan directamente a `catalogospromocionales.com`. Las imágenes no se copian ni se alojan en este repositorio. Si el proveedor cambia sus URLs o cae, las imágenes dejan de mostrarse sin ningún aviso en el build.

---

### 3.2 Pipeline de enriquecimiento IA

El scraper genera contenido de plantilla genérico. El pipeline de IA transforma ese contenido en copy específico, con storytelling real y metadatos SEO únicos por producto.

**Arquitectura de 4 agentes (orquestados por `enrich_products.py`):**

```
                    ┌─────────────────────┐
                    │   Investigador       │
                    │  ~150-200 palabras   │
                    │  Contexto de uso     │
                    │  corporativo real    │
                    └──────────┬──────────┘
                               │ research context
                               ▼
                    ┌─────────────────────┐
          feedback  │    Copywriter        │  ◄──────────────────┐
          (si falla)│  story + short desc  │                     │
                    │  features + useCases │                     │
                    └──────────┬──────────┘                     │
                               │ copy dict                       │
                               ▼                                 │
                    ┌─────────────────────┐                     │
                    │  Especialista SEO   │                     │
                    │  seoTitle (≤60ch)   │                     │
                    │  seoDescription     │                     │
                    │  keywords           │                     │
                    └──────────┬──────────┘                     │
                               │ seo dict                        │
                               ▼                                 │
                    ┌─────────────────────┐                     │
                    │  Evaluador (Crítico) │  score < 60  ───────┘
                    │  ContentEvaluator   │  (máx 2 reintentos)
                    │  score 0-100        │
                    └──────────┬──────────┘
                               │ score >= 60
                               ▼
                    product.is_ai_optimized = true
                    product.quality_score   = N
                    product.last_ai_update  = ISO timestamp
```

Cada agente es una llamada independiente a la API de LLM. El contexto de marca (`BRAND_CONTEXT`) se inyecta en cada llamada. El Copywriter recibe feedback del Evaluador si el primer intento falla, y reintenta hasta 2 veces.

**Modelos soportados actualmente:**

| Flag | Modelo por defecto | Uso recomendado |
|---|---|---|
| `--model flash` | `gemini-1.5-flash` | Toda la cola (barato) |
| `--model pro` | `gemini-1.5-pro` | 200 productos prioritarios |

La clase `ProductPipeline` en `agent_pipeline.py` es agnóstica al proveedor. Migrar a otro LLM (Claude, GPT-4o) requiere únicamente reemplazar el método `_call_api()` y el cliente.

**Flags disponibles:**

```bash
PYTHONIOENCODING=utf-8 python scripts/enrich_products.py

  --limit N       Procesar solo los primeros N productos thin
  --priority      Priorizar categorías de alta conversión (mugs, tecnología, etc.)
  --model pro     Usar Gemini Pro en vez de Flash
  --resume        Saltar productos con is_ai_optimized: true
  --dry-run       Mostrar cuántos procesaría sin hacer llamadas a la API
  --verbose       Imprimir trazas detalladas de cada agente

# Combinación recomendada para primera pasada:
PYTHONIOENCODING=utf-8 python scripts/enrich_products.py --priority --limit 200 --resume
```

**Estimación de costo (Gemini):**

| Modelo | Productos | Costo estimado |
|---|---|---|
| Flash (3,244 thin) | Todos | ~$1.65 USD |
| Pro (200 prioritarios) | Top categories | ~$0.80 USD |

---

### 3.3 Evaluador de calidad (`content_evaluator.py`)

El `ContentEvaluator` actúa tanto como gate dentro del pipeline IA (Agente 4) como herramienta standalone de auditoría.

**Sistema de puntuación (100 puntos de partida):**

| Penalización | Condición | Puntos |
|---|---|---|
| Template fingerprint | Detecta frases conocidas de plantilla | -30 |
| Keywords repetidos | Regex de relleno detectado | -20 |
| Story corto | `story` < 350 caracteres netos | -15 |
| SEO description corto | `seoDescription` < 100 caracteres | -10 |
| SEO title sin cambiar | Igual al template por defecto | -5 |

**Umbral de aprobación:** score >= 60 → `is_ai_optimized: true`

**Frases de plantilla detectadas (muestra):**
- `"que tus clientes conservarán"`
- `"Personalización incluida sin costo adicional"`
- `"lo último en tendencias"`
- `"posiciona a tu marca como innovadora"`
- `"el elemento sorpresa que todo marketero busca"`
- Cualquier variante de `"Destaca tu marca con [nombre]"`

**Uso standalone:**

```bash
python scripts/content_evaluator.py
python scripts/content_evaluator.py --show-failures 20
python scripts/content_evaluator.py --show-passing 10
```

---

## 4. Estructura del proyecto

```
kspromocionales-tienda/
├── data/
│   ├── products.json              # Fuente de verdad: 3,947 productos (10 MB)
│   ├── categories.json            # 34 categorías con contenido editorial
│   ├── geo-data.js                # Metadatos SEO por ciudad (EC + CO)
│   └── blog/
│       ├── posts.json             # Metadatos de 33+ artículos del blog
│       └── content/               # Markdown, un .md por artículo
│
├── scripts/
│   ├── daily-scraper.py           # Web scraper + merge incremental (Stage 1)
│   ├── agent_pipeline.py          # Pipeline 4-agentes LLM (Stage 2, core)
│   ├── enrich_products.py         # Orquestador CLI del enriquecimiento
│   ├── content_evaluator.py       # Scoring de calidad (Stage 2 + auditoría)
│   ├── mark-quality-products.py   # Marca is_ai_optimized en batch
│   ├── fix_all_categories.py      # Correcciones masivas de categoryId
│   ├── generate-products.js       # [Legacy] generación de productos v1
│   ├── optimize-seo.js            # [Legacy] optimización SEO v1
│   ├── capture_screenshot.py      # Captura de pantallas para auditoría
│   └── mobile_audit.py            # Auditoría de renderizado mobile
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.jsx             # Root layout: fonts, GTM, LocalBusiness schema
│   │   ├── page.jsx               # Homepage (server component)
│   │   ├── globals.css            # Base Tailwind + variables CSS
│   │   ├── sitemap.js             # Sitemap dinámico (build time)
│   │   ├── HomePageClient.jsx     # Homepage orchestrator (client component)
│   │   ├── not-found.jsx          # Página 404 personalizada
│   │   ├── blog/
│   │   │   ├── page.jsx           # Listado del blog
│   │   │   └── [slug]/page.jsx    # Artículo individual
│   │   ├── categorias/[slug]/
│   │   │   └── page.jsx           # Página de categoría
│   │   ├── productos/[slug]/
│   │   │   └── page.jsx           # Página de producto
│   │   ├── productos-promocionales-ecuador/
│   │   │   ├── page.jsx           # Landing Ecuador
│   │   │   └── [ciudad]/page.jsx  # Página por ciudad (Quito, Guayaquil…)
│   │   ├── productos-promocionales-colombia/
│   │   │   ├── page.jsx           # Landing Colombia
│   │   │   └── [ciudad]/page.jsx  # Página por ciudad (Bogotá, Medellín…)
│   │   ├── catalogos-digitales/page.jsx
│   │   ├── contacto/page.jsx
│   │   ├── nosotros/page.jsx
│   │   └── politica-de-privacidad/page.jsx
│   │
│   ├── components/                # 19 componentes React
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HomePageClient.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductTabs.jsx
│   │   ├── ProductImageGallery.jsx
│   │   ├── ProductActions.jsx
│   │   ├── CategorySidebar.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── CategoryProductsGrid.jsx
│   │   ├── QuickViewModal.jsx     # dynamic import, SSR=false
│   │   ├── RealProductsGallery.jsx
│   │   ├── WhatsAppButton.jsx
│   │   ├── CookieConsent.jsx
│   │   ├── BenefitsBar.jsx
│   │   ├── BlogProductCarousel.jsx
│   │   ├── PromoCarousel.jsx
│   │   ├── StorytellingHero.jsx
│   │   └── TableOfContents.jsx
│   │
│   └── data/                      # Alias @/data (jsconfig.json)
│       └── blog/content.js        # Re-exporta todos los markdown del blog
│
├── public/
│   ├── images/
│   │   ├── hero/                  # Banners (9781.jpg con priority preload)
│   │   ├── products-categoria/    # Imágenes de cabecera por categoría
│   │   ├── galeria-real/          # Fotos reales de productos (E-E-A-T)
│   │   ├── catalogos-ksp/         # Capturas de catálogos digitales
│   │   ├── blog/                  # Imágenes destacadas de artículos
│   │   └── team/                  # Fotos del equipo
│   ├── og-image.jpg               # Open Graph image global
│   └── favicon.ico / favicon.svg / apple-touch-icon.png
│
├── .github/
│   └── workflows/
│       └── daily-scraper.yml      # Cron 06:00 UTC, push automático
│
├── next.config.js                 # output: export, image loader, webpack Konva
├── next-sitemap.config.js         # Config del sitemap postbuild
├── netlify.toml                   # Build, headers CSP/HSTS, redirects 301
├── netlify-image-loader.js        # Image CDN loader (dev vs prod)
├── tailwind.config.js             # Design tokens del sistema
├── jsconfig.json                  # Aliases @/components, @/data, @/app
├── postcss.config.js
├── .eslintrc.json
└── .env.example                   # Variables de entorno requeridas
```

---

## 5. Arquitectura Next.js

### 5.1 Rutas y generacion estatica

El sitio usa **App Router** (Next.js 14) con `output: 'export'`. No hay rutas dinámicas en runtime: todas se pre-renderizan en build time usando `generateStaticParams()`.

| Ruta | Fuente de params | Páginas generadas |
|---|---|---|
| `/` | — | 1 |
| `/productos/[slug]/` | `data/products.json` → todos los slugs | ~3,947 |
| `/categorias/[slug]/` | `data/categories.json` → 34 slugs | 34 |
| `/blog/[slug]/` | `data/blog/posts.json` → slugs | 33+ |
| `/productos-promocionales-ecuador/[ciudad]/` | `data/geo-data.js` → 5 ciudades | 5 |
| `/productos-promocionales-colombia/[ciudad]/` | `data/geo-data.js` → 5 ciudades | 5 |
| `/blog/`, `/contacto/`, `/nosotros/`, etc. | Estáticas | ~8 |

Si un slug no existe en la fuente de datos, la página llama `notFound()` y el build falla explícitamente (no silencia el error).

**Nota sobre el sitemap:** El sitemap filtrado (`sitemap.js`) solo incluye productos con `is_ai_optimized: true`. Esto significa que los ~3,200 productos con contenido thin están pre-renderizados en `out/` pero no están en el sitemap, reduciendo el crawl budget desperdiciado por Google.

---

### 5.2 Flujo de datos en build time

```
npm run build
      │
      ├── Next.js lee data/products.json (una vez, en memoria)
      │         data/categories.json
      │         data/blog/posts.json
      │         data/geo-data.js
      │
      ├── Por cada ruta dinámica:
      │   generateStaticParams() → lista de { slug }
      │   generateMetadata(params) → <head> completo con og:, twitter:, canonical
      │   Page Component(params) → HTML + JSON-LD inline
      │
      ├── Componentes server → renderizados a HTML (sin JS en cliente)
      │   Componentes client (HomePageClient, QuickViewModal) → hydration JS bundle
      │
      └── postbuild: next-sitemap
                └── Lee out/ y genera out/sitemap.xml + out/robots.txt
```

El archivo `data/products.json` se importa directamente en los page components con `import productsData from '@/data/products.json'`. En build time esto funciona como una importación de módulo normal. En runtime de cliente este mismo import queda bundleado en el JS del cliente si el componente es `'use client'` — ese es el problema de los 1.9 MB de bundle en `HomePageClient.jsx` (ver sección 14).

---

### 5.3 Componentes clave

#### Layout raíz (`src/app/layout.jsx`)

Punto de entrada de todo el árbol de componentes. Responsable de:
- Cargar fuentes Google (Syne, DM Sans, DM Serif, Syne Mono) con `display: 'swap'`
- Inyectar snippet de Google Analytics 4 (ID `G-2SCDPRFSNF`)
- Renderizar JSON-LD `LocalBusiness` + `WebSite` en `<head>`
- Definir los `alternates` globales de hreflang (es-EC, es-CO, x-default)
- Envolver la aplicación en `<Header>` y `<Footer>`
- Montar `<CookieConsent>` y `<WhatsAppButton>` flotantes

#### `HomePageClient.jsx` (client component)

Orquestador de la homepage. Al ser `'use client'` importa el array completo de productos, lo que genera el bundle pesado. Renderiza en secuencia: HeroBanner → BenefitsBar → RealProductsGallery → ProductTabs → CategoryGrid.

#### `ProductCard.jsx`

Tarjeta reutilizable usada en grids, tabs y carruseles. Muestra: imagen con hover zoom, badges (Bestseller / Destacado), botón Quick View, categoría como link, nombre, CTA WhatsApp con mensaje prellenado. Acepta props `product`, `priority` (LCP hint), `showCategory`.

#### `QuickViewModal.jsx`

Importado con `dynamic(() => import(...), { ssr: false })` para no incluirse en el bundle del servidor. Se monta solo cuando el usuario hace clic en un producto. Muestra galería de imágenes, descripción, features, casos de uso y CTA WhatsApp, todo sin navegar.

#### `WhatsAppButton.jsx`

Botón flotante verde con pulso animado. Lógica:
- URL: `https://wa.me/593999814838?text={encodedMessage}`
- Mensaje dinámico: acepta `product` y `category` como props (vacíos = mensaje genérico)
- Dispara evento GTM `whatsapp_click` con `product_name`, `category_name`, `message_preview`
- Respeta `CookieConsent` (si GA está bloqueado, el evento no se envía)
- Se puede ocultar en páginas de blog con `hideOnBlog={true}`

#### `RealProductsGallery.jsx`

Galería de fotos reales de productos servidas desde `public/images/galeria-real/`. Sirve como señal E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) ante Google: demuestra que los productos existen y se comercializan realmente.

---

## 6. Modelo de datos

### `data/products.json`

Array de ~3,947 objetos. Campos de un producto completo:

```jsonc
{
  "id": "mug-ceramica-blanco-ksp",
  "slug": "mug-ceramica-blanco",            // URL: /productos/mug-ceramica-blanco/
  "name": "Mug Cerámica Blanco",
  "categoryId": "mugs",                     // Referencia a categories.json
  "shortDescription": "Mug de cerámica…",   // 120-160 chars para tarjetas
  "story": "En el universo del marketing…", // 400+ chars para página de detalle
  "features": [                             // 4+ ítems específicos del producto
    "Capacidad 350ml",
    "Apto microondas y lavavajillas",
    "Área de impresión 8x8cm",
    "Disponible en 6 colores"
  ],
  "useCases": [                             // 3+ casos corporativos reales
    "Kit de bienvenida para nuevos empleados",
    "Regalos en ferias y exposiciones",
    "Merchandising para franquicias"
  ],
  "images": [                               // URLs externas en catalogospromocionales.com
    "https://www.catalogospromocionales.com/images/productos/12345.jpg"
  ],
  "whatsappMessage": "Hola, me interesa cotizar: Mug Cerámica Blanco…",
  "seoTitle": "Mug Cerámica Personalizado | Ecuador y Colombia",  // ≤60 chars
  "seoDescription": "Mug cerámica blanco con tu logo…",           // 130-155 chars
  "keywords": "mug personalizado, mugs corporativos, Quito",
  "featured": false,
  "bestseller": true,
  // Campos de calidad (añadidos por el pipeline IA):
  "is_ai_optimized": true,
  "quality_score": 82,
  "last_ai_update": "2026-04-09T14:23:11Z"
}
```

### `data/categories.json`

Array de 34 categorías. Cada una tiene: `id`, `name`, `slug`, `description`, `story` (200+ words), `seoTitle`, `seoDescription`, `benefits` (array), `icon` (nombre de icono de `lucide-react`), `image` (URL), `productCount` (actualizado por el scraper).

### `data/geo-data.js`

Exporta objetos `ecuadorCities` y `colombiaCities`. Cada ciudad tiene: `slug`, `name`, `seoTitle`, `seoDescription`, `h1`, `intro`, `características` (array). Datos completamente hardcodeados y escritos manualmente para máxima relevancia geográfica.

### `data/blog/posts.json`

Array de metadatos de artículos: `slug`, `title`, `excerpt`, `date`, `dateModified`, `author`, `authorTitle`, `category`, `tags`, `featuredImage`, `seoTitle`, `seoDescription`. El contenido completo del artículo vive en `data/blog/content/YYYY-MM-DD-slug.md`.

---

## 7. SEO: implementacion completa

### Metadata por tipo de ruta

| Ruta | title | description | canonical | hreflang | og:image |
|---|---|---|---|---|---|
| `/` | Global (`layout.jsx`) | Global | Raíz | es-EC, es-CO, x-default | og-image.jpg |
| `/productos/[slug]/` | `product.seoTitle` | `product.seoDescription` | `/productos/{slug}/` | es-EC, es-CO | `product.images[0]` |
| `/categorias/[slug]/` | `category.seoTitle` | `category.seoDescription` | `/categorias/{slug}/` | es-EC, es-CO | — |
| `/blog/[slug]/` | `post.seoTitle` | `post.seoDescription` | `/blog/{slug}/` | es-EC, es-CO | `post.featuredImage` |
| Geo landings | Por ciudad/país | Por ciudad/país | Respectivo | es-EC o es-CO | og-image.jpg |

### Schemas JSON-LD implementados

| Schema | Ruta | Campos clave |
|---|---|---|
| `LocalBusiness` | Todas (root layout) | name, telephone, address (Quito EC), areaServed (Ecuador, Colombia), openingHours, sameAs (social) |
| `WebSite` | Todas (root layout) | name, inLanguage: es-EC, url, publisher |
| `Product` | `/productos/[slug]/` | name, description, image, url, offers (availability, priceSpecification) |
| `BreadcrumbList` | `/categorias/[slug]/`, `/productos/[slug]/` | Home → Categoría → Producto |
| `ItemList` | `/categorias/[slug]/` | Lista numerada de productos de la categoría |
| `Article` | `/blog/[slug]/` | headline, author, datePublished, dateModified, image, articleBody |

### Sitemap

Generado en build time por `src/app/sitemap.js` y reemplazado en postbuild por `next-sitemap`. El generador de Next.js filtra explícitamente:

```js
// Solo productos con contenido enriquecido entran al sitemap
products
  .filter(p => p.is_ai_optimized === true)
  .map(p => ({ url: `.../productos/${p.slug}/`, lastModified: p.last_ai_update }))
```

Prioridades configuradas: Home (1.0), productos/categorías/geo-landings (0.9), blog (0.8), páginas secundarias (0.6).

El sitemap tiene un guard que avisa si se superan 45,000 URLs (límite soft antes del hard limit de Google de 50,000).

### hreflang

Implementado en `generateMetadata()` de cada ruta dinámica y en el root layout:

```js
alternates: {
  canonical: `https://www.kronosolopromocionales.com/productos/${slug}/`,
  languages: {
    'es-EC': `https://www.kronosolopromocionales.com/productos/${slug}/`,
    'es-CO': `https://www.kronosolopromocionales.com/productos/${slug}/`,
    'x-default': `https://www.kronosolopromocionales.com/productos/${slug}/`,
  }
}
```

El sitio sirve el mismo contenido en español a ambos mercados. Los hreflang es-EC y es-CO apuntan a la misma URL porque el sitio no tiene versiones regionales del contenido; las etiquetas indican preferencia de región, no idioma alternativo.

---

## 8. Estilos y sistema de diseno

**Framework:** Tailwind CSS 3.4 con design tokens personalizados en `tailwind.config.js`.

### Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#0047AB` | Botones, links, hover states |
| `primary-light` | `#2962FF` | Variante clara de CTA |
| `primary-dark` | `#001A6E` | Textos sobre fondo claro |
| `secondary` | `#0A0A23` | Texto principal, body |
| `accent` / `gold` | `#F59E0B` | Badges, highlights, CTAs |
| `navy` | `#001A6E` | Fondos oscuros premium |
| `cream` | `#F0F4FF` | Fondos de tarjetas, secciones |

### Tipografía (Google Fonts)

| Variable CSS | Fuente | Pesos | Uso |
|---|---|---|---|
| `--font-syne` | Syne | 400–800 | Headlines, display, navbar |
| `--font-dm-sans` | DM Sans | 300–600 | Body, descripciones |
| `--font-dm-serif` | DM Serif Display | 400 | Énfasis editorial |
| `--font-syne-mono` | Syne Mono | 400 | Código, datos técnicos |

Todas cargadas con `display: 'swap'` para evitar FOIT.

### Animaciones y efectos

- `marquee` — ticker de anuncio en el header
- `float` — efecto hover en hero
- `glow`, `blue-glow`, `gold-glow` — sombras animadas en CTAs
- `pulse` — botón WhatsApp flotante
- `fadeIn`, `slideUp`, `slideDown`, `scaleIn`, `slideInRight` — transiciones de UI

### Image CDN (Netlify)

En producción, el loader `netlify-image-loader.js` redirige todas las imágenes Next.js (`<Image>`) a `/.netlify/images?url={original}&w={width}&q={quality}`. Netlify transforma automáticamente a WebP o AVIF según el `Accept` header del browser, sin cambios en el código de los componentes.

En desarrollo, el loader devuelve la URL original sin transformación.

---

## 9. Integraciones externas

### Google Analytics 4

- **ID:** `G-2SCDPRFSNF` (hardcodeado en `layout.jsx`)
- **Consent Mode v2:** Por defecto `analytics_storage: 'denied'` hasta que el usuario acepta la cookie. `CookieConsent.jsx` gestiona el estado con `localStorage` y llama `gtag('consent', 'update', ...)` al aceptar.
- **Evento personalizado:** `whatsapp_click` con propiedades `product_name`, `category_name`, `message_preview` (50 chars).

### WhatsApp Business

- **Número:** `+593 999 814 838` (Ecuador)
- **Esquema de URL:** `https://wa.me/593999814838?text={encodedMessage}`
- **Mensajes:** Cada producto tiene `whatsappMessage` generado por el scraper con el nombre y categoría del producto. El mensaje genérico es "¡Hola! Me gustaría conocer más sobre sus productos promocionales."
- **Tracking:** Evento GTM `whatsapp_click` en cada clic.

### Fuentes externas de imágenes

| Dominio | Uso | Configurado en |
|---|---|---|
| `www.catalogospromocionales.com` | Imágenes de productos | `next.config.js` remotePatterns |
| `res.cloudinary.com` | Imágenes del proveedor (CDN Cloudinary) | `next.config.js` remotePatterns |
| `images.unsplash.com` | Imágenes de blog y hero | `next.config.js` remotePatterns |

No hay pasarela de pagos. El modelo de negocio es cotización directa por WhatsApp, no e-commerce transaccional.

---

## 10. CI/CD y despliegue

### GitHub Actions: scraper diario

**Archivo:** `.github/workflows/daily-scraper.yml`

```
Trigger: schedule (cron: '0 6 * * *') + workflow_dispatch

Steps:
  1. actions/checkout@v4
  2. actions/setup-python@v4 (Python 3.11)
  3. pip install requests beautifulsoup4 lxml
  4. python scripts/daily-scraper.py
  5. git config + git add data/ + git diff --quiet || git commit + git push
     → Commit message: "chore(data): daily scraper update [skip ci]"
     → [skip ci] evita que Netlify haga rebuild por cada actualización de datos
```

### Netlify

**Archivo de configuración:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
```

**Headers de seguridad aplicados globalmente:**

| Header | Valor | Propósito |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forzar HTTPS 1 año |
| `X-Frame-Options` | `SAMEORIGIN` | Prevenir clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevenir MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control de referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Desactivar APIs sensibles |
| `Content-Security-Policy` | Ver netlify.toml | Scripts/imágenes permitidas |

**Redirects 301 configurados:**
- URLs legacy con `mexico` en el slug → equivalente con `ecuador-y-colombia` (limpieza de señales geográficas erróneas, preserva link equity)
- Fallback `/*` → `/404.html` para manejo de rutas no encontradas en client-side

### Flujo completo de deploy

```
1. git push origin main
        │
        ├── [si hay cambios en data/] → GitHub Actions ya hizo push automático
        │
        └── Netlify detecta el push
                │
                ├── npm run build
                │   └── next build → out/
                │
                ├── npm run postbuild (automático por convención npm)
                │   └── next-sitemap → out/sitemap.xml + out/robots.txt
                │
                └── Deploy out/ al CDN de Netlify
                    └── kronosolopromocionales.com live
```

---

## 11. Variables de entorno

Archivo de referencia: `.env.example`

| Variable | Requerida por | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | `enrich_products.py` | API key de Google AI Studio para el pipeline de enriquecimiento |
| `ANTHROPIC_API_KEY` | `agent_pipeline.py` (si se migra a Claude) | API key de Anthropic |
| `NEXT_PUBLIC_GA_ID` | `layout.jsx` | Google Analytics 4 Measurement ID (actualmente hardcodeado) |

En producción (Netlify), las variables se configuran en el panel de Build > Environment variables. El proyecto Next.js no requiere variables en tiempo de build para generar las páginas, ya que todos los datos vienen de los archivos JSON locales.

---

## 12. Instalacion y desarrollo

**Requisitos:** Node.js 18+, npm, Python 3.8+ (solo para scripts de datos)

```bash
# 1. Clonar e instalar dependencias JS
npm install

# 2. (Opcional) Instalar dependencias Python para scripts
pip install requests beautifulsoup4 lxml python-dotenv

# 3. Configurar variables de entorno (para enriquecimiento IA)
cp .env.example .env
# Editar .env con las API keys correspondientes

# 4. Servidor de desarrollo
npm run dev
# → http://localhost:3000

# 5. Build de producción
npm run build
# → genera /out con todos los HTML estáticos

# 6. (Opcional) Deploy manual
netlify deploy --prod --dir=out
```

### Actualizar el catálogo de productos

```bash
# Scrapear productos nuevos del proveedor
python scripts/daily-scraper.py

# Ver cuántos productos necesitan enriquecimiento
PYTHONIOENCODING=utf-8 python scripts/enrich_products.py --dry-run

# Enriquecer primero las categorías prioritarias (200 productos)
PYTHONIOENCODING=utf-8 python scripts/enrich_products.py --priority --limit 200 --resume

# Rebuild para actualizar el sitio
npm run build
```

---

## 13. Referencia de scripts

| Script | Lenguaje | Propósito |
|---|---|---|
| `scripts/daily-scraper.py` | Python | Web scraping + merge incremental en products.json |
| `scripts/enrich_products.py` | Python | CLI para ejecutar el pipeline de enriquecimiento IA |
| `scripts/agent_pipeline.py` | Python | Pipeline 4-agentes LLM (Investigador, Copywriter, SEO, Evaluador) |
| `scripts/content_evaluator.py` | Python | Scoring de calidad de contenido (0–100) + gate de is_ai_optimized |
| `scripts/mark-quality-products.py` | Python | Marcar productos como is_ai_optimized en batch |
| `scripts/fix_all_categories.py` | Python | Correcciones masivas de categoryId en products.json |
| `scripts/generate-products.js` | JS | [Legacy v1] generación de productos, reemplazado por el scraper Python |
| `scripts/optimize-seo.js` | JS | [Legacy v1] optimización SEO batch, reemplazado por agent_pipeline |
| `scripts/capture_screenshot.py` | Python | Capturas de pantalla del sitio para auditorías visuales |
| `scripts/mobile_audit.py` | Python | Auditoría de renderizado mobile (Playwright) |

**Comandos npm:**

```bash
npm run dev       # Next.js dev server en :3000
npm run build     # Build estático → out/ (incluye postbuild: next-sitemap)
npm run lint      # ESLint sobre src/
npm run start     # Next.js production server (no aplica con output: export)
```

---

## 14. Problemas conocidos y deuda tecnica

### CRITICO: Build desactualizado

El directorio `out/` en producción puede quedar desincronizado si se modifica `data/products.json` (via scraper o enriquecimiento IA) sin ejecutar un nuevo `npm run build`. Los cambios en JSON **no se reflejan automáticamente en el sitio** hasta el próximo deploy.

### CRITICO: Bundle de productos en cliente

`HomePageClient.jsx` importa `data/products.json` (10 MB, 3,947 productos) como módulo JavaScript. Este import queda bundleado en el JS del cliente, generando un bundle de ~1.9 MB y un INP estimado de 200–400ms. La solución es pasar solo los datos necesarios desde el server component padre como props.

### ALTO: Contenido thin en mayoría de productos

Aproximadamente el 82% de los productos (productos sin `is_ai_optimized: true`) tienen contenido de plantilla idéntico. Google clasifica estas páginas como thin content. El sitemap ya los excluye, pero están pre-renderizados en `out/` y son rastreables por Googlebot directamente.

### ALTO: Overflow horizontal en desktop

El componente `Header.jsx` (ticker marquee) genera un overflow de +291px a 1280px de viewport. Causa scroll horizontal no intencionado en desktop.

### ALTO: Hero sin imagen en mobile

Las imágenes de producto en el hero están en la columna `lg:block`, invisible en mobile. El hero mobile muestra solo texto, sin elemento visual.

### MEDIO: Formatos duplicados de slug en sitemap

Existen ~1,100 productos con dos formatos de slug históricos (uno limpio y uno con sufijo de hash). Ambos generan páginas HTML, lo que puede ser interpretado como contenido duplicado.

### MEDIO: Dos generadores de sitemap en conflicto

`src/app/sitemap.js` (Next.js nativo) y `next-sitemap.config.js` (postbuild) coexisten. El postbuild siempre sobreescribe. El primero se descarta silenciosamente. Mantener ambos genera confusión; se recomienda eliminar `src/app/sitemap.js`.

### MEDIO: Colisión z-index WhatsApp + Cookie banner

El botón flotante de WhatsApp y el banner de cookie consent comparten capas z-index similares. En algunos viewpoints mobile se superponen.

---

## Licencia

Proyecto privado — KS Promocionales. Todos los derechos reservados.
