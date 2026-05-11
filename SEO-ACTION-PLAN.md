# SEO ACTION PLAN — KS Promocionales Ecuador
*Basado en metodología BIG School (Días 1 y 2), aplicada al proyecto kronosolopromocionales.com*
*Generado: Mayo 2026 | Mercado objetivo: Ecuador (es-EC)*

---

## 1. DIAGNÓSTICO BRUTAL: ¿Dónde estamos?

El sitio tiene buena base técnica (Next.js estático, hreflang, schema, 301s, noindex en productos delgados) pero **falla en lo más importante: la arquitectura SEO y el targeting de keywords de alto volumen**. El score actual (~78/100) está limitado por estructura, no por técnica.

### Problemas críticos identificados

| Problema | Impacto | Urgencia |
|---|---|---|
| Home no ataca "material publicitario" ni "regalos corporativos" directamente | Alto | P0 |
| URL `/categorias/escritura` — slug sin keyword principal ("bolígrafos publicitarios") | Alto | P1 |
| No existen páginas hub para "regalos corporativos" ni "material publicitario" | Muy alto | P1 |
| No hay subcategorías bajo categorías de alto volumen (escritura, mugs, tecnología) | Alto | P1 |
| Category page payload 469KB (RSC con dataset completo) | Alto | P0 |
| H1 de categorías en client component (no crawleable eficientemente) | Medio | P0 |
| Blog no enlaza hacia páginas transaccionales | Medio | P1 |
| Sin BreadcrumbList schema en categorías/productos | Medio | P1 |
| Sin FAQPage schema en categorías clave | Bajo | P2 |
| Categorías duplicadas (EcoNature + Ecología) canibalización | Medio | P1 |

---

## 2. KEYWORD RESEARCH — Ecuador (Metodología Google Ads Keyword Planner)

### Paso a paso para ejecutar el research real
1. Ir a Google Ads → Planificador de Palabras Clave → "Descubrir palabras clave"
2. Seeds: "material publicitario", "artículos promocionales", "regalos corporativos", "bolígrafos personalizados", "productos publicitarios"
3. Filtrar por **Ecuador** (NO Latinoamérica general)
4. Descargar CSV con segmentación mensual
5. Crear tabla Excel con sparkline por keyword (ver estacionalidad — Diciembre/Navidad suele ser pico)
6. Validar intención en incógnito: buscar cada keyword y ver si Google muestra tiendas/catálogos (transaccional) o artículos (informacional)

### Keywords estimadas por nivel de arquitectura (validar con Keyword Planner)

#### NIVEL HOME — Intención genérica/comercial amplia
```
material publicitario                 → HOME principal
artículos promocionales ecuador       → HOME
productos promocionales ecuador       → HOME
regalos corporativos ecuador          → HOME / hub page
artículos publicitarios               → HOME
material publicitario ecuador         → HOME
promocionales ecuador                 → HOME
objetos publicitarios                 → HOME
merchandising ecuador                 → HOME
```

#### NIVEL CATEGORÍA — Intención de tipo de producto
```
bolígrafos publicitarios              → /categorias/escritura/ (renombrar slug)
bolígrafos personalizados ecuador     → /categorias/escritura/
mugs personalizados                   → /categorias/mugs/
termos personalizados ecuador         → /categorias/mugs/
gorras personalizadas ecuador         → /categorias/gorras/
camisetas personalizadas ecuador      → /categorias/confeccion/
mochilas personalizadas               → /categorias/maletines/
llaveros personalizados               → /categorias/llaveros/
memorias usb personalizadas           → /categorias/memorias-usb/
tecnología promocional                → /categorias/tecnologia/
artículos de oficina personalizados   → /categorias/oficina/
paraguas personalizados               → /categorias/paraguas/
artículos ecológicos personalizados   → /categorias/ecologia/ (fusionar con econature)
artículos antiestrés                  → /categorias/antiestres/
artículos médicos personalizados      → /categorias/medicos/
```

#### NIVEL SUBCATEGORÍA — Intención específica (páginas a CREAR)
```
bolígrafos metálicos personalizados   → /categorias/escritura/boligrafos-metalicos/
bolígrafos ecológicos                 → /categorias/escritura/boligrafos-ecologicos/
termos de acero inoxidable            → /categorias/mugs/termos-acero/
tazas personalizadas cerámica         → /categorias/mugs/tazas-ceramica/
gorras bordadas ecuador               → /categorias/gorras/gorras-bordadas/
camisetas con logo empresa            → /categorias/confeccion/camisetas-logo/
mochilas ejecutivas personalizadas    → /categorias/maletines/mochilas-ejecutivas/
audífonos personalizados              → /categorias/tecnologia/audifonos-personalizados/
power banks personalizados            → /categorias/tecnologia/power-banks/
```

#### KEYWORDS INFORMACIONALES (Blog)
```
qué son los artículos promocionales           → post informacional
cómo elegir regalos corporativos              → post informacional
ideas de material publicitario para empresas  → post informacional
regalos corporativos navidad ecuador          → post estacional
artículos promocionales para ferias           → post informacional
cuánto cuesta imprimir logo en productos      → post FAQ
diferencia entre artículos y material publicitario → post informacional
```

---

## 3. ARQUITECTURA IDEAL — Antes vs Después

### ANTES (arquitectura actual — problemática)
```
HOME (/)
  └── /categorias/escritura/       ← slug sin keyword
  └── /categorias/mugs/            ← slug sin keyword  
  └── /categorias/gorras/
  └── /categorias/tecnologia/
  └── /categorias/oficina/
  └── /categorias/[30+ categorías más...]
  └── /blog/
  └── /contacto/
  └── /nosotros/
  └── /productos-promocionales-ecuador/
  └── /productos-promocionales-colombia/
```

**Problemas:** No hay hub pages, slugs sin keyword, sin subcategorías, blog desconectado.

---

### DESPUÉS (arquitectura target)
```
HOME (/)
  → Keyword H1: "Artículos Promocionales Personalizados en Ecuador"
  → Targets: material publicitario, artículos promocionales, regalos corporativos
  
  ├── /regalos-corporativos/                    [HUB — CREAR]
  │     → Agrupa por uso/evento (fin de año, ferias, eventos)
  │     → H1: "Regalos Corporativos Personalizados Ecuador"
  │
  ├── /material-publicitario/                   [HUB — CREAR o redirigir a home]
  │     → Si Google muestra intención de hub, crear página
  │     → Si la SERP = misma que home, no crear (canibalización)
  │
  ├── /categorias/boligrafos-publicitarios/     [RENOMBRAR desde /escritura/]
  │     → H1: "Bolígrafos Publicitarios Personalizados Ecuador"
  │     ├── /categorias/boligrafos-publicitarios/metalicos/    [CREAR]
  │     ├── /categorias/boligrafos-publicitarios/ecologicos/   [CREAR]
  │     └── /categorias/boligrafos-publicitarios/ejecutivos/   [CREAR]
  │
  ├── /categorias/mugs-y-termos-personalizados/ [RENOMBRAR desde /mugs/]
  │     → H1: "Mugs y Termos Personalizados con Logo Ecuador"
  │     ├── /categorias/mugs-y-termos-personalizados/termos-acero/
  │     └── /categorias/mugs-y-termos-personalizados/tazas-ceramica/
  │
  ├── /categorias/gorras-personalizadas/        [RENOMBRAR desde /gorras/]
  ├── /categorias/camisetas-corporativas/       [RENOMBRAR desde /confeccion/]
  ├── /categorias/tecnologia-promocional/       [RENOMBRAR desde /tecnologia/]
  ├── /categorias/articulos-de-oficina/         [RENOMBRAR desde /oficina/]
  ├── /categorias/mochilas-y-maletines/         [RENOMBRAR desde /maletines/]
  ├── /categorias/llaveros-personalizados/      [RENOMBRAR desde /llaveros/]
  ├── /categorias/memorias-usb-personalizadas/  [RENOMBRAR desde /memorias-usb/]
  ├── /categorias/articulos-ecologicos/         [FUSIONAR ecologia + econature]
  │
  ├── /blog/                                    [Informacional → enlaces a transaccional]
  │     → "Qué son los artículos promocionales" → enlaza a HOME
  │     → "Cómo elegir regalos corporativos"   → enlaza a /regalos-corporativos/
  │     → "Los mejores bolígrafos publicitarios" → enlaza a /categorias/boligrafos/
  │
  ├── /contacto/
  └── /nosotros/                                [Añadir LocalBusiness schema completo]
```

---

## 4. ACCIONES CONCRETAS POR PRIORIDAD

---

### P0 — QUICK WINS (Semana 1-2) — Sin cambios de arquitectura

#### A. Corregir H1 de la Home
**Archivo:** `src/app/HomePageClient.jsx` (o el componente HeroBanner)

El H1 principal debe ser la keyword con mayor volumen que ataca la home:
```
H1 actual: [revisar — probablemente en HeroBanner]
H1 target: "Artículos Promocionales Personalizados en Ecuador"
```
- El H1 debe ser texto HTML estático, NO dentro de un componente cliente
- Moverlo al RSC `src/app/page.jsx` si es posible

#### B. Actualizar Title y Meta de la Home
**Archivo:** `src/app/layout.jsx` línea 47

```js
// ACTUAL
title: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
description: 'Artículos promocionales y regalos corporativos en Ecuador...',

// TARGET (incluir "material publicitario")
title: 'Material Publicitario y Artículos Promocionales Ecuador | KS Promocionales',
description: 'Material publicitario personalizado con tu logo. Regalos corporativos, artículos promocionales y merchandising para empresas en Ecuador. Cotiza hoy por WhatsApp.',
```

#### C. Corregir payload 469KB en categorías — CRÍTICO
**Archivo:** `src/app/categorias/[slug]/page.jsx`

El `productsData` completo se carga en el RSC payload. Solución:
```js
// ACTUAL — carga TODO products.json (~thousands of products)
const allCategoryProducts = productsData.filter(p => p.categoryId === category.id);

// FIX — importar solo IDs de categoría, no el dataset completo
// Opción A: Separar products.json por categoría en build time
// Opción B: Leer solo los campos necesarios con un import dinámico
// Opción C: Pre-generar un categoryProducts.json por categoría en scripts/

// Implementación recomendada — script de build:
// scripts/build-category-products.js → genera /data/category-products/[id].json
// El page.jsx importa solo su archivo específico
```

#### D. Actualizar seoTitle y seoDescription de las 5 categorías principales
**Archivo:** `data/categories.json`

Las categorías más buscadas necesitan slugs y títulos con keywords reales:

```json
// ESCRITURA — ACTUAL
"slug": "escritura",
"seoTitle": "Artículos de Escritura Ecuador | KS",

// TARGET
"slug": "boligrafos-publicitarios",  // ← cambiar slug + añadir 301 redirect
"seoTitle": "Bolígrafos Publicitarios Personalizados Ecuador | KS Promocionales",
"seoDescription": "Bolígrafos publicitarios con tu logo. Metálicos, ecológicos, ejecutivos. Desde 50 unidades. Envío en Ecuador. ¡Cotiza por WhatsApp!",

// MUGS — ACTUAL
"slug": "mugs",
"seoTitle": "Mugs y Termos Promocionales Ecuador | KS",

// TARGET
"slug": "mugs-y-termos-personalizados",
"seoTitle": "Mugs y Termos Personalizados con Logo Ecuador | KS Promocionales",
"seoDescription": "Mugs y termos personalizados con logo. Cerámica, acero inoxidable, sublimación. Desde 24 unidades. Envíos Ecuador. ¡Cotiza!",

// TECNOLOGIA — ACTUAL
"slug": "tecnologia",
"seoTitle": "Tecnología Promocional Ecuador | KS",

// TARGET
"slug": "tecnologia-promocional",
"seoTitle": "Tecnología Promocional Personalizada Ecuador | KS Promocionales",
"seoDescription": "Audífonos, power banks, memorias USB y gadgets personalizados con logo. Regalos corporativos tecnológicos en Ecuador. ¡Cotiza!",
```

**IMPORTANTE:** Cada cambio de slug requiere un 301 redirect en `public/_redirects`:
```
/categorias/escritura/    /categorias/boligrafos-publicitarios/    301
/categorias/mugs/         /categorias/mugs-y-termos-personalizados/ 301
/categorias/tecnologia/   /categorias/tecnologia-promocional/       301
# etc.
```

---

### P1 — ARQUITECTURA (Semanas 3-8)

#### E. Crear página hub /regalos-corporativos/
**Archivo a crear:** `src/app/regalos-corporativos/page.jsx`

```
URL: /regalos-corporativos/
H1: "Regalos Corporativos Personalizados Ecuador"
H2: "Los regalos corporativos más vendidos"
H2: "Por presupuesto"
H2: "Para eventos y ferias"
H2: "Regalos ejecutivos premium"

Contenido:
- Grid de categorías destacadas para regalar (mugs, tecnología, escritura, maletines)
- Sección "¿Por qué elegir KS Promocionales para tus regalos?"
- CTA WhatsApp
- FAQ schema (3-4 preguntas sobre regalos corporativos)

Schema: ItemList con las categorías que agrupa
Title: "Regalos Corporativos Ecuador: Personalizados con Logo | KS Promocionales"
Meta: "Regalos corporativos personalizados con el logo de tu empresa. Mugs, tecnología, maletines y más. Entrega en Ecuador. ¡Cotiza sin compromiso!"
```

#### F. Crear página hub /material-publicitario/
**Acción previa:** Buscar "material publicitario" en incógnito. 
- Si SERP muestra tiendas (tiendas, catálogos, ecommerce) → crear página de categoría/hub
- Si SERP muestra home de tiendas → esta keyword va en la HOME, no crear página aparte

Si procede crear:
**Archivo:** `src/app/material-publicitario/page.jsx`
```
URL: /material-publicitario/
H1: "Material Publicitario Personalizado Ecuador"
Enlaza a: todas las categorías de producto
Schema: OnlineStore o ItemList
```

#### G. Añadir estructura de subcategorías
**Archivo a crear:** `src/app/categorias/[slug]/[subcategory]/page.jsx`

Para las categorías de mayor volumen (escritura, mugs, tecnología) crear páginas subcategoría:
```
/categorias/boligrafos-publicitarios/metalicos/
  → H1: "Bolígrafos Metálicos Personalizados Ecuador"
  → Filtrar products donde categoryId = "escritura" AND material = "metal" (o tag equivalente)

/categorias/mugs-y-termos-personalizados/termos-acero-inoxidable/
  → H1: "Termos de Acero Inoxidable Personalizados Ecuador"

/categorias/tecnologia-promocional/audifonos-personalizados/
  → H1: "Audífonos Personalizados con Logo Ecuador"
```

**Nota técnica:** Para implementar esto, los productos en `products.json` necesitan un campo `tags` o `subcategory` que permita filtrar. Añadir este campo en el script de scraping o manualmente para los productos más relevantes.

#### H. Fusionar categorías EcoNature + Ecología (canibalización)
Dos categorías atacan la misma intención de búsqueda. Elegir una URL y redirigir la otra:
```
/categorias/ecologia/           → MANTENER (slug más limpio)
/categorias/econature/          → REDIRIGIR 301 a /categorias/ecologia/
```
Fusionar los productos en una sola categoría. Actualizar `seoTitle` y `seoDescription` con keywords "productos ecológicos personalizados ecuador", "artículos ecológicos corporativos".

---

### P2 — ON-PAGE OPTIMIZATION (Paralelo a P1)

#### I. Estructura H1/H2/H3 en páginas de categoría
**Archivo:** `src/app/categorias/[slug]/page.jsx` y componentes de categoría

Regla del curso:
- **H1** = keyword principal de la intención (mayor volumen mensual del grupo)
- **H2** = keywords secundarias del mismo grupo ("bolígrafos con logo", "esferos publicitarios", "lapiceros personalizados")  
- **H3** = nombre del producto individual

Implementación actual: Verificar que el H1 de categoría esté en el RSC (no en componente cliente) para que Google lo lea en el primer render sin ejecutar JS.

Template para `generateMetadata` de categorías:
```js
// En categories.json, añadir campos:
"h1": "Bolígrafos Publicitarios Personalizados Ecuador",
"h2Keywords": ["bolígrafos con logo empresa", "esferos publicitarios", "lapiceros personalizados ecuador"],
```

#### J. BreadcrumbList schema en categorías y productos
**Archivo:** `src/app/categorias/[slug]/page.jsx`

Añadir JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.kronosolopromocionales.com/"},
    {"@type": "ListItem", "position": 2, "name": "Bolígrafos Publicitarios", "item": "https://www.kronosolopromocionales.com/categorias/boligrafos-publicitarios/"}
  ]
}
```

#### K. ItemList schema en páginas de categoría
**Obligatorio según el curso (Día 2, pág. 15):** Categorías deben tener schema `ItemList`.
```json
{
  "@type": "ItemList",
  "name": "Bolígrafos Publicitarios Ecuador",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "url": "...", "name": "Bolígrafo Metálico X"},
    // ... primeros 10 productos
  ]
}
```

#### L. FAQPage schema en categorías clave (complementario)
Añadir sección FAQ al final de cada página de categoría importante con 3-4 preguntas reales:
```
/categorias/boligrafos-publicitarios/ → FAQ:
  - "¿Cuántos bolígrafos es el mínimo de pedido?"
  - "¿Cuánto tarda en entregarse un pedido de bolígrafos personalizados?"
  - "¿Qué técnicas de impresión usan para los bolígrafos?"
  - "¿Puedo ver una muestra antes de hacer el pedido?"
```

#### M. OnlineStore schema en la Home
**Archivo:** `src/app/page.jsx` o `src/app/layout.jsx`

El curso lo marca como **OBLIGATORIO** para la home:
```json
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "KS Promocionales",
  "url": "https://www.kronosolopromocionales.com",
  "description": "Tienda online de artículos promocionales y regalos corporativos en Ecuador",
  "areaServed": {"@type": "Country", "name": "Ecuador"},
  "currenciesAccepted": "USD",
  "priceRange": "$"
}
```

---

### P3 — BLOG: Estrategia Informacional → Transaccional

#### N. Auditoría de posts actuales
Para cada post en `data/blog/posts.json`:
1. Verificar que cada post enlaza internamente a mínimo 1 página de categoría relevante
2. Los links deben usar anchor text con keyword (NO "haz clic aquí")
3. Ejemplo correcto: `"Descubre nuestros [bolígrafos publicitarios](/categorias/boligrafos-publicitarios/)"` 

#### O. Nuevos posts con keywords informacionales (Research: `inurl:blog como * material publicitario`)
Usar el operador de búsqueda del curso:
```
Google: inurl:blog como * material publicitario
Google: inurl:blog que * artículos promocionales  
Google: inurl:blog mejor * regalos corporativos ecuador
```
Luego validar volumen de esas keywords en Google Ads Keyword Planner.

Posts prioritarios a crear (validar volumen primero):
```
1. "¿Qué son los artículos promocionales y para qué sirven?"
   → Keyword informacional | Enlaza a: HOME
   → Customer journey: awareness

2. "Los 10 mejores regalos corporativos para empresas en Ecuador 2026"
   → Keyword transaccional/informacional | Enlaza a: /regalos-corporativos/
   → Customer journey: consideration

3. "Bolígrafos publicitarios: la guía completa para elegir el mejor"
   → Keyword informacional | Enlaza a: /categorias/boligrafos-publicitarios/
   → Customer journey: consideration

4. "Material publicitario para ferias y eventos en Ecuador"
   → Keyword informacional estacional | Enlaza a: múltiples categorías
   → Customer journey: awareness + consideration

5. "Regalos corporativos de Navidad en Ecuador: ideas y presupuestos"
   → Keyword estacional (publicar Octubre-Noviembre) | Enlaza a: /regalos-corporativos/
   → Customer journey: purchase intent
```

#### P. Enlazado interno desde blog a transaccional
**Regla:** Cada post debe tener **mínimo 2 enlaces internos** a páginas de categoría/producto con anchor text exacto de keyword.

Estructura de enlace ideal dentro del post:
```
"...Para eventos corporativos, los [bolígrafos publicitarios personalizados](/categorias/boligrafos-publicitarios/) 
son la opción más económica y efectiva. Si buscas algo más premium, revisa 
nuestra selección de [tecnología promocional](/categorias/tecnologia-promocional/)..."
```

---

### P4 — ENLAZADO INTERNO (Según Día 2 del curso)

#### Q. Sección "Categorías destacadas" en Home
**Archivo:** `src/app/HomePageClient.jsx`

El curso (Día 2, pág. 17) indica que desde la HOME deben existir **enlaces destacados** directos a las categorías más importantes. Actualmente existe `CategorySidebar` — asegurar que las 6-8 categorías más buscadas tengan enlace prominente en el body de la home (no solo sidebar):

```
Categorías destacadas (sección visual en home):
- Bolígrafos Publicitarios
- Mugs y Termos Personalizados
- Tecnología Promocional
- Regalos Corporativos
- Gorras Personalizadas
- Artículos de Oficina
```

#### R. Menú principal — reorganizar por volumen de búsqueda
El menú actual muestra categorías por nombre interno. Reorganizar mostrando primero las de mayor volumen de búsqueda:
```
Menú target:
[Bolígrafos] [Mugs y Termos] [Tecnología] [Gorras] [Artículos de Oficina] [Ver todos]
              ↑ Las más buscadas primero
```

#### S. "Productos relacionados" en páginas de producto
**Archivo:** `src/app/productos/[slug]/page.jsx`

El curso (Día 2, pág. 19) indica que en fichas de producto deben haber links a productos relacionados. Implementar sección "También te puede interesar" con 4-6 productos del mismo categoryId.

---

## 5. GOOGLE VS LLM — Visibilidad Dual

Según el curso (Día 2, pág. 26-28): **>75% de correlación** entre estar Top 10 en Google y ser citado por LLMs. Lo que ayuda a Google ayuda a los LLMs. No hay acciones separadas necesarias excepto:

| Señal | Google | LLM (ChatGPT/Perplexity) | Prioridad |
|---|---|---|---|
| Slug keyword-rich | ✅ | ✅ | P0 |
| Title optimizado | ✅ | ✅ | P0 |
| H1, H2, H3 correctos | ✅ | ✅ | P0 |
| Meta description | ✅ | ✅ | P0 |
| Datos Estructurados | ✅ | ❌ (ignoran) | P2 |
| Enlazado Interno | ✅ | ✅ | P1 |
| Blog con EEAT | ✅ | ✅ | P2 |
| Core Web Vitals / Renderizado | ✅ | ❌ (ignoran) | P1 (por Google) |

**Conclusión:** El mismo SEO sirve para ambos canales. Priorizar Google y los LLMs se benefician por efecto secundario.

---

## 6. CHECKLIST DE IMPLEMENTACIÓN

### Semana 1-2 (P0)
- [ ] Investigar H1 actual de la home (revisar `HeroBanner.jsx`)
- [ ] Actualizar H1 home → "Artículos Promocionales Personalizados en Ecuador"
- [ ] Actualizar Title/Meta de layout.jsx (incluir "material publicitario")
- [ ] Solucionar payload 469KB en category page (ver sección C)
- [ ] Cambiar 5 slugs de categorías principales + añadir 301s en `_redirects`
- [ ] Actualizar seoTitle/seoDescription en categories.json para las 5 categorías principales

### Semana 3-4 (P1 inicio)
- [ ] Crear `src/app/regalos-corporativos/page.jsx` con contenido completo
- [ ] Verificar en incógnito si "material publicitario" merece página propia o va en home
- [ ] Fusionar categorías ecologia + econature (301 redirect)
- [ ] Añadir BreadcrumbList JSON-LD en páginas de categoría
- [ ] Añadir ItemList JSON-LD en páginas de categoría
- [ ] Añadir OnlineStore JSON-LD en la home

### Semana 5-8 (P1 arquitectura)
- [ ] Diseñar sistema de subcategorías (`[slug]/[subcategory]/`)
- [ ] Añadir campo `subcategory` o `tags` en `products.json` para filtrar
- [ ] Crear primeras 3 subcategorías (bolígrafos metálicos, termos acero, audífonos)
- [ ] Reorganizar menú principal por volumen de búsqueda
- [ ] Añadir sección "Categorías Destacadas" en body de la home

### Mes 2-3 (P2 contenido)
- [ ] Auditar cada post del blog → asegurar 2+ links internos a transaccional
- [ ] Ejecutar research de keywords informacionales (operador `inurl:blog`)
- [ ] Validar keywords en Google Ads Keyword Planner (Ecuador)
- [ ] Publicar 5 posts informacionales según lista de la sección O
- [ ] Añadir FAQPage schema en las 5 categorías principales
- [ ] Implementar "Productos relacionados" en páginas de producto

### Ongoing (P3 autoridad)
- [ ] 1 post de blog mensual atacando keyword informacional con tráfico validado
- [ ] Monitorear GSC: "Rastreada: actualmente sin indexar" → solicitar revalidación post-deploy
- [ ] Revisar Core Web Vitals mensualmente (LCP, CLS, FID)
- [ ] Actualizar estimaciones de volumen de keywords cada trimestre

---

## 7. MÉTRICAS DE ÉXITO

| KPI | Línea base (Mayo 2026) | Target (3 meses) | Target (6 meses) |
|---|---|---|---|
| Posición "material publicitario" EC | Sin dato | Top 20 | Top 10 |
| Posición "artículos promocionales ecuador" | Sin dato | Top 10 | Top 5 |
| Posición "regalos corporativos ecuador" | Sin dato | Top 15 | Top 10 |
| Páginas indexadas en GSC | Sin dato | +5 nuevas páginas hub | +15 páginas |
| Tráfico orgánico mensual | Sin dato | +30% | +80% |
| Conversiones WhatsApp desde orgánico | Sin dato | +20% | +50% |

**Herramientas de seguimiento:**
- Google Search Console (gratis) — posiciones, clicks, impresiones
- Google Analytics 4 — tráfico, conversiones, sesiones
- Google Ads Keyword Planner — actualizar volúmenes cada trimestre

---

## 8. NOTAS DE IMPLEMENTACIÓN TÉCNICA (Next.js 14 Static Export)

### Limitaciones por `output: 'export'`
- No hay API routes en runtime — todo debe generarse en build time
- Los nuevos routes (`/regalos-corporativos/`, etc.) son solo nuevos archivos `page.jsx` en `src/app/`
- Los 301 redirects se manejan en `public/_redirects` (Netlify)
- Los cambios de slug requieren: (1) cambiar `categories.json`, (2) añadir redirect, (3) rebuild

### Script sugerido para solucionar payload 469KB
```bash
# scripts/split-products-by-category.js
# Genera: data/category-products/[categoryId].json
# Cada archivo tiene solo los campos necesarios para la card:
# { id, slug, name, price, images[0], featured, bestseller }
```

### Renderizado JS (alerta del curso Día 2, pág. 25)
El H1 de categoría está actualmente en un componente cliente (`CategoryProductsGrid`). 
Mover el H1 al RSC `page.jsx` asegura que Googlebot lo lea sin ejecutar JS:
```jsx
// src/app/categorias/[slug]/page.jsx
export default function CategoryPage({ params }) {
  const category = categoriesData.find(c => c.slug === params.slug);
  return (
    <>
      <h1>{category.h1 || category.name}</h1>  {/* ← En RSC, visible sin JS */}
      <CategoryProductsGrid products={categoryProducts} />
    </>
  );
}
```

---

*Plan de acción generado aplicando la metodología del curso "SEO para IA y Google 2026" (BIG School, Días 1-2) al proyecto KS Promocionales. Las estimaciones de volumen de keywords son orientativas — validar con Google Ads Keyword Planner filtrado por Ecuador antes de priorizar acciones.*
