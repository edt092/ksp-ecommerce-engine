# KS Promocionales - Tienda Digital

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify)

Tienda digital de productos promocionales personalizados con editor visual de logos interactivo y cotizacion directa por WhatsApp.

---

## Stack Tecnologico

### Frontend
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Next.js | 14.2 | Framework React con App Router y SSG |
| React | 18.3 | Libreria UI base |
| React-Konva | 18.2 | Editor visual interactivo (canvas) |
| Konva | 9.3 | Motor grafico 2D |
| use-image | 1.1 | Carga de imagenes para Konva |
| Framer Motion | 12.23 | Animaciones avanzadas |
| Tailwind CSS | 3.4 | Framework CSS utility-first |
| Lucide React | 0.553 | Iconos SVG |

### Build y Herramientas
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| PostCSS | 8.4 | Procesador CSS |
| Autoprefixer | 10.4 | Prefijos CSS automaticos |
| ESLint | 8.57 | Linter JavaScript |
| next-sitemap | 4.2 | Generador de sitemap |

### Infraestructura
- **Hosting**: Netlify
- **CDN**: Netlify Edge
- **SSL**: Automatico via Netlify

---

## Arquitectura

### Patron Arquitectonico
- **Static Site Generation (SSG)** - Sitio completamente estatico
- **Next.js App Router** - Estructura modular por rutas
- **Component-based UI** - Componentes React reutilizables
- **Data-driven content** - Contenido desde archivos JSON

### Flujo de Datos
```
data/
  products.json     -->  src/app/productos/[slug]/page.jsx
  categories.json   -->  src/app/categorias/[slug]/page.jsx
                              |
                              v
                    src/components/
                              |
                              v
                    next build --> out/ --> Netlify
```

### Paginas Generadas
- **Home** - Pagina principal
- **Categorias** (~35 paginas dinamicas)
- **Productos** (~1000+ paginas dinamicas)
- **Blog** (~11+ articulos dinamicos)
- **Paginas estaticas**: nosotros, contacto, catalogos-digitales

---

## Estructura del Proyecto

```
kspromocionales-tienda/
├── data/                          # Datos estaticos
│   ├── blog/content/              # Articulos del blog (markdown)
│   ├── categories.json            # Categorias de productos
│   └── products.json              # Catalogo de productos (~1000+)
├── public/                        # Archivos estaticos
│   ├── images/                    # Imagenes de productos y categorias
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                       # App Router (Next.js 14)
│   │   ├── blog/
│   │   │   ├── page.jsx           # Lista de articulos
│   │   │   └── [slug]/page.jsx    # Articulo individual
│   │   ├── catalogos-digitales/page.jsx
│   │   ├── categorias/[slug]/page.jsx
│   │   ├── contacto/page.jsx
│   │   ├── nosotros/page.jsx
│   │   ├── productos/[slug]/page.jsx
│   │   ├── layout.jsx             # Layout principal
│   │   ├── page.jsx               # Home
│   │   └── globals.css
│   └── components/                # 21 componentes reutilizables
│       ├── BenefitsBar.jsx        # Barra de beneficios
│       ├── BlogProductCarousel.jsx
│       ├── CategoryGrid.jsx
│       ├── CategoryProductsGrid.jsx
│       ├── CategorySidebar.jsx    # Sidebar de categorias
│       ├── DigitalAdvisorChat.jsx # Chat interactivo
│       ├── Footer.jsx
│       ├── Header.jsx
│       ├── HeroBanner.jsx         # Banner hero principal
│       ├── LogoEditor.jsx         # Editor visual con Konva
│       ├── LogoEditorModal.jsx
│       ├── ProductActions.jsx
│       ├── ProductCard.jsx
│       ├── ProductImageGallery.jsx
│       ├── ProductTabs.jsx        # Tabs de informacion del producto
│       ├── PromoCarousel.jsx
│       ├── QuickViewModal.jsx     # Modal de vista rapida
│       ├── SEOHead.jsx
│       ├── StorytellingHero.jsx
│       ├── TableOfContents.jsx
│       └── WhatsAppButton.jsx
├── scripts/                       # Scripts de utilidad
├── .env.example                   # Variables de entorno ejemplo
├── jsconfig.json                  # Aliases de importacion
├── next.config.js                 # Configuracion Next.js
├── next-sitemap.config.js         # Configuracion sitemap
├── tailwind.config.js             # Configuracion Tailwind
└── package.json
```

---

## Funcionalidades Principales

### Editor Visual de Logos (React-Konva)
- Carga de logos en PNG, JPG y SVG
- Drag & Drop para posicionamiento
- Redimensionamiento con controles
- Rotacion manual y con botones (15 grados)
- Previsualizacion en tiempo real
- Exportacion de mockup en alta calidad (PNG 2x)

### Catalogo de Productos
- ~1000+ productos con SEO optimizado
- 35 categorias organizadas
- Galeria de imagenes con thumbnails
- Storytelling y casos de uso

### Blog Integrado
- Articulos en formato markdown
- Contenido SEO optimizado
- Carrusel de productos relacionados

### Integracion WhatsApp
- Botones CTA contextuales
- Mensajes prellenados por producto
- Tracking con Google Analytics

---

## Instalacion

### Requisitos
- Node.js 18.0+
- npm, yarn, pnpm o bun

### Pasos

```bash
# 1. Navegar al proyecto
cd kspromocionales-tienda

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local

# 4. Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Configuracion

### Variables de Entorno
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX          # Google Analytics 4
NEXT_PUBLIC_WHATSAPP_NUMBER=593999999999 # WhatsApp Business
NEXT_PUBLIC_SITE_URL=https://kspromocionales.com
```

### Personalizacion de Colores
Editar `tailwind.config.js`:
```js
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... }
}
```

### Agregar/Editar Productos
Editar `data/products.json` y `data/categories.json`

---

## Scripts

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Build de produccion
npm run start    # Previsualizar build
npm run lint     # Ejecutar ESLint
```

---

## Despliegue

### Netlify (Recomendado)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Desplegar
netlify deploy --prod
```

O conectar repositorio GitHub a Netlify para despliegue automatico.

### Build Local
```bash
npm run build
# Sitio estatico generado en out/
```

---

## SEO

- **Sitemap**: Generado automaticamente en `/sitemap.xml`
- **Robots.txt**: Configurado en `/robots.txt`
- **JSON-LD**: Schema de LocalBusiness, Product, BreadcrumbList
- **OpenGraph**: Metadatos para redes sociales
- **Imagenes**: Optimizacion automatica (WebP/AVIF)

---

## Documentacion Adicional

- `DEPLOYMENT.md` - Guia detallada de despliegue

---

## Licencia

Proyecto privado y propietario de KS Promocionales.
