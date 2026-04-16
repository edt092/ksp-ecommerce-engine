# KS Promocionales — Tienda Digital

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify)

Sitio estático de productos promocionales personalizados para Ecuador y Colombia. Genera ~2,400 páginas en build time desde JSON, sin base de datos ni servidor.

**URL**: https://www.kronosolopromocionales.com

---

## Cómo se obtienen los productos

Los productos vienen de **catalogospromocionales.com**, un proveedor mayorista de artículos promocionales. El sitio no tiene API pública, así que se usa un scraper Python que extrae nombre e imagen de cada producto listado en las páginas de categoría.

### Pipeline completo

```
catalogospromocionales.com
        │
        │  HTTP GET (requests + BeautifulSoup)
        ▼
scripts/daily-scraper.py
        │
        │  Extrae: nombre, URL imagen, categoría
        │  Genera: slug, shortDescription, story, seoTitle, seoDescription,
        │          features, useCases, whatsappMessage (todo desde plantillas)
        │  Deduplica por URL de imagen
        │  Hace merge con products.json existente (no sobreescribe)
        ▼
data/products.json          (3,947 productos actualmente)
data/categories.json        (34 categorías — productCount actualizado)
        │
        │  npm run build
        ▼
Next.js SSG (generateStaticParams)
        │
        │  Una página HTML por producto/categoría/blog/ciudad
        ▼
out/                        (~2,400 archivos .html estáticos)
        │
        │  git push → Netlify CI
        ▼
https://www.kronosolopromocionales.com
```

### Qué extrae el scraper

El scraper (`scripts/daily-scraper.py`) navega las páginas de categoría de catalogospromocionales.com y por cada producto toma:

| Dato scrapeado | Fuente |
|---|---|
| Nombre | `<img alt="">` del producto, o `<h3>` si el alt está vacío |
| URL de imagen | `src` de la imagen del producto (queda en el dominio de origen: `catalogospromocionales.com`) |
| Categoría | Mapeada desde el nombre de la sección al ID interno (`CATEGORY_MAP` en el scraper) |

**Nota importante:** las imágenes no se descargan ni se alojan localmente. El HTML generado apunta directamente a `https://www.catalogospromocionales.com/images/productos/XXXXX.jpg`. Esto significa que si ese servidor cae o cambia las URLs, las imágenes dejan de mostrarse.

### Qué genera el scraper (plantillas fijas)

Con esos tres datos, la función `build_product()` construye el resto del objeto. Todo el contenido textual es de plantilla, no específico del producto:

```python
'shortDescription': f'{clean_name} personalizado con tu logo corporativo. '
                    f'Ideal para regalos empresariales y campañas promocionales.',

'story': f'Destaca tu marca con {clean_name}, un artículo promocional de calidad '
         f'que tus clientes conservarán. Personalización incluida sin costo adicional.',

'features': [
    'Personalización con tu logo o mensaje',
    'Calidad premium garantizada',
    'Entrega en Ecuador y Colombia',
    'Cotización sin compromiso',
],

'seoTitle':       f'{clean_name} Personalizado | KS Promocionales Ecuador',
'seoDescription': f'{clean_name} personalizado con tu logo en Ecuador. '
                  f'Calidad premium, entrega rápida y cotización gratuita.',
```

Esto afecta directamente a la indexación en Google: ~1,936 productos (~49% del total) terminan con `shortDescription` menor de 50 caracteres o con texto de plantilla idéntico entre sí, lo que Google clasifica como thin content y reduce la prioridad de indexación del dominio entero. Ver sección **Problema SEO conocido** al final.

### Deduplicación y merge

El scraper no sobreescribe `products.json` — hace merge por URL de imagen. Si una imagen ya existe, el producto se omite (o se reasigna de categoría si se ejecuta con `force_category=True` para las URLs directas). Esto permite ejecutar el scraper diariamente sin duplicar productos.

Las categorías en `DIRECT_CATEGORY_URLS` dentro del scraper son las que no aparecen en la página de autodescubrimiento (`/seccion/subcategorias.html`) y se scrapean siempre de forma explícita.

### Ejecutar el scraper

```bash
# Requiere Python 3.8+ con dependencias instaladas
pip install requests beautifulsoup4 lxml

# Scraping diario (merge incremental)
python scripts/daily-scraper.py
```

El scraper también se ejecuta automáticamente vía GitHub Actions (workflow de CI definido en `.github/workflows/`), con el commit message `chore(data): daily scraper update [skip ci]` para no disparar un build en Netlify por cada actualización de datos.

---

## Cómo se genera el contenido de cada página

El sitio es 100% estático (`output: 'export'` en `next.config.js`). Next.js construye todas las páginas en build time leyendo los JSON de `data/`.

### Página de producto (`/productos/[slug]/`)

**Archivo**: `src/app/productos/[slug]/page.jsx`

Cada una de las ~3,947 páginas de producto se genera así:

1. `generateStaticParams()` lee `data/products.json` y retorna todos los slugs.
2. `generateMetadata()` construye el `<title>`, `<meta description>`, OpenGraph y hreflang (es-EC, es-CO, x-default) desde los campos `seoTitle`, `seoDescription` e `images` del producto.
3. El componente renderiza:
   - Breadcrumb: Inicio → Categoría → Producto
   - Galería de imágenes (`ProductImageGallery`) — la imagen viene de `catalogospromocionales.com`
   - Nombre, `shortDescription`, tabs con `story`, `features`, `useCases`
   - Botón de WhatsApp con el mensaje prellenado del campo `whatsappMessage`
   - Grid de productos relacionados (misma categoría, 3 máximo)
   - JSON-LD `Product` + `BreadcrumbList` (schema.org)

Los campos `story`, `features` y `useCases` son los que diferencian unas páginas de otras. Cuando están vacíos o son plantilla, la página no aporta valor único para Google.

### Página de categoría (`/categorias/[slug]/`)

**Archivo**: `src/app/categorias/[slug]/page.jsx`

Generada desde `data/categories.json`. Cada categoría tiene campos editoriales (`description`, `story`, `benefits`, `seoTitle`, `seoDescription`) escritos manualmente. Muestra el grid de todos los productos de esa categoría filtrados por `categoryId`.

### Páginas geográficas (`/productos-promocionales-ecuador/[ciudad]/`)

**Archivo**: `src/app/productos-promocionales-ecuador/[ciudad]/page.jsx` (y equivalente Colombia)

Las ciudades y su contenido específico (intro, características, datos geográficos) están hardcodeados en `data/geo-data.js`. Hay 5 ciudades Ecuador + 5 Colombia = 10 páginas de ciudad.

### Blog (`/blog/[slug]/`)

**Archivo**: `src/app/blog/[slug]/page.jsx`

El blog tiene dos fuentes de datos separadas:
- `data/blog/posts.json` — metadatos de cada artículo (slug, título, autor, fecha, tags, campos SEO)
- `data/blog/content/` — contenido en markdown, un archivo `.md` por artículo (nombre: `YYYY-MM-DD-slug.md`)
- `src/data/blog/content.js` — importa y exporta todos los markdowns como `blogContent`

El componente hace match entre el slug del post y su contenido markdown, renderiza el HTML con un parser y muestra tabla de contenidos lateral (`TableOfContents`).

### Sitemap

**Archivo**: `src/app/sitemap.js`

Generado en build time por Next.js. Incluye todas las URLs: estáticas, productos, categorías, blog y ciudades. El script `next-sitemap` (postbuild) sobreescribe este archivo con la configuración de `next-sitemap.config.js`.

> **Conflicto activo**: existen dos generadores de sitemap en paralelo (`app/sitemap.js` y `next-sitemap.config.js`). El postbuild de next-sitemap siempre gana. Si en algún momento difieren, el sitemap del build de Next.js se descarta silenciosamente.

---

## Estructura del proyecto

```
kspromocionales-tienda/
├── data/
│   ├── products.json          # 3,947 productos scrapeados (fuente de verdad)
│   ├── categories.json        # 34 categorías con contenido editorial
│   ├── geo-data.js            # Ciudades Ecuador y Colombia con contenido SEO local
│   └── blog/
│       ├── posts.json         # Metadatos de los 33 artículos del blog
│       └── content/           # Contenido markdown, un .md por artículo
├── scripts/
│   └── daily-scraper.py       # Scraper principal (merge incremental)
├── promo-scraper/             # Scripts de scraping legacy (pipeline v1)
│   ├── scraper_avanzado.py
│   ├── generador_seo_avanzado.py
│   ├── convertir_a_nextjs_optimizado.py
│   └── ejecutar_pipeline_completo.py
├── public/
│   └── images/                # Imágenes propias (logo, OG image, categorías)
├── src/
│   ├── app/
│   │   ├── layout.jsx         # Layout raíz con schema LocalBusiness y GTM
│   │   ├── page.jsx           # Home
│   │   ├── sitemap.js         # Sitemap (sobreescrito por next-sitemap en postbuild)
│   │   ├── productos/[slug]/page.jsx
│   │   ├── categorias/[slug]/page.jsx
│   │   ├── blog/[slug]/page.jsx
│   │   ├── productos-promocionales-ecuador/[ciudad]/page.jsx
│   │   ├── productos-promocionales-colombia/[ciudad]/page.jsx
│   │   ├── contacto/page.jsx
│   │   ├── nosotros/page.jsx
│   │   └── catalogos-digitales/page.jsx
│   └── components/            # Componentes React reutilizables
├── next.config.js             # output: 'export', trailingSlash: true
├── next-sitemap.config.js     # Configuración de sitemap (postbuild)
├── netlify.toml               # Build command, headers de seguridad, redirects 301
└── package.json
```

---

## Instalación y desarrollo

```bash
npm install
npm run dev        # localhost:3000
```

## Build y deploy

```bash
# 1. (Opcional) Actualizar productos desde catalogospromocionales.com
python scripts/daily-scraper.py

# 2. Build estático — genera out/
npm run build
# El postbuild ejecuta next-sitemap automáticamente

# 3. Deploy manual
netlify deploy --prod

# O push a main para deploy automático vía Netlify CI
git push
```

El directorio `out/` contiene el sitio completo listo para servir. No requiere servidor Node.

---

## Stack

| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 14.2 | SSG con App Router |
| React | 18.3 | UI |
| Tailwind CSS | 3.4 | Estilos |
| Netlify | — | Hosting, CDN, SSL |
| next-sitemap | 4.2 | Generación de sitemap.xml y robots.txt |
| requests + BeautifulSoup | — | Scraper de productos |

---

## Problema SEO conocido: thin content

El modelo de generar contenido desde plantillas a escala produce páginas que Google clasifica como thin content. El impacto directo: el dominio tiene solo ~19 páginas indexadas de ~2,400 posibles.

La causa: `build_product()` en el scraper genera `shortDescription`, `story`, `features` y `seoDescription` con el mismo texto para todos los productos, cambiando únicamente el nombre. Google detecta este patrón y desindexan páginas o reduce el crawl budget del dominio entero.

**Productos afectados actualmente:**
- ~1,936 productos con `shortDescription` < 50 caracteres
- ~2,899 productos sin campo `story` original (o con `story` de plantilla)

La solución pasa por enriquecer el campo `story` de al menos los 200–300 productos más relevantes con contenido genuino antes de incluirlos en el sitemap.

---

## Licencia

Proyecto privado — KS Promocionales.
