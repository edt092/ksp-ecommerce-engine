# Core Web Vitals — Auditoría de laboratorio

Generado el 2026-07-18 con Lighthouse 12.8.2 (`npx lighthouse`) contra Chrome headless local,
sirviendo `out/` (build de producción real, `pnpm build`) con un servidor estático mínimo
(`scripts/serve-static.mjs`, sin dependencias nuevas — Node `http` puro).

## ⚠️ Limitación importante de esta medición

Estos son **datos de laboratorio**, no de campo (ver `docs/core-web-vitals-field-checklist.md`
para cómo obtener datos de campo reales). Además, el servidor local usado **no tiene compresión
gzip/brotli, ni HTTP/2, ni CDN** — a diferencia de Netlify en producción. Esto probablemente
**empeora artificialmente los tiempos absolutos** (especialmente LCP y Speed Index) frente a lo
que un usuario real experimenta en `www.kronosolopromocionales.com`. Los números absolutos no
deben citarse como "el sitio tarda X segundos en producción". Lo que sí es válido y accionable
son los **hallazgos estructurales** (imágenes sin optimizar, CSS/JS no usado, el patrón de
animación que oculta el hero) — esos existen en el código independientemente del servidor usado.

TBT (Total Blocking Time) es un **diagnóstico de laboratorio**, no es lo mismo que INP
(Interaction to Next Paint) de campo — Lighthouse no mide INP real de usuarios.

## Resultados por plantilla

| URL | Dispositivo | Performance | LCP | CLS | TBT (lab) | FCP | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` (home) | Mobile | 51 | 7.7 s | 0.021 | 540 ms | 4.0 s | 4.6 s |
| `/` (home) | Desktop | 28 | 8.6 s | 0.006 | 820 ms | 4.1 s | 4.8 s |
| `/regalos-corporativos/` | Mobile | 56 | 21.8 s | 0.008 | 310 ms | 4.1 s | 5.0 s |
| `/regalos-corporativos/` | Desktop | 35 | 18.5 s | 0.006 | 480 ms | 4.0 s | 5.9 s |
| `/categorias/mugs-y-termos-personalizados/` | Mobile | 60 | 4.1 s | 0.008 | 660 ms | 4.1 s | 4.6 s |
| `/categorias/mugs-y-termos-personalizados/` | Desktop | 30 | 7.2 s | 0.008 | 760 ms | 4.1 s | 4.6 s |
| `/blog/regalos-corporativos-fin-ano-ecuador/` | Mobile | 58 | 4.3 s | 0.056 | 590 ms | 4.3 s | 4.9 s |
| `/blog/regalos-corporativos-fin-ano-ecuador/` | Desktop | 38 | 4.3 s | 0.001 | 500 ms | 4.3 s | 4.6 s |
| `/productos-promocionales-ecuador/cuenca/` | Mobile | 71 | 4.0 s | 0.008 | 270 ms | 4.0 s | 4.3 s |
| `/productos-promocionales-ecuador/cuenca/` | Desktop | 34 | 6.3 s | 0.006 | 540 ms | 3.9 s | 4.8 s |
| `/productos/organizador-multiusos-link-nuevo-13536/` (producto) | Mobile | 54 | 6.6 s | 0.012 | 500 ms | 3.9 s | 4.7 s |
| `/productos/organizador-multiusos-link-nuevo-13536/` (producto) | Desktop | 34 | 6.8 s | 0.006 | 530 ms | 4.0 s | 4.9 s |

Objetivos de referencia: LCP ≤ 2.5s, INP ≤ 200ms (no medible en lab), CLS ≤ 0.1.
**CLS ya cumple el objetivo en las 6 plantillas** (0.001–0.056, todas < 0.1). LCP y performance
score están lejos del objetivo en todas las plantillas, con o sin el sesgo del servidor local.

## Hallazgos principales (verificados en código, no solo en el reporte)

### 1. Imagen hero sin optimizar en `/regalos-corporativos/` — Prioridad ALTA

`src/app/regalos-corporativos/page.tsx` usa `/images/regalos-promocionales.png` (**1.84 MB**,
sin comprimir) como `background-image` CSS de la sección hero — no pasa por `next/image`, por lo
tanto no se convierte a WebP/AVIF ni se redimensiona. Lighthouse estima **1.7 MB de ahorro
posible** solo con formato moderno. Esta es la causa más probable del LCP de 18-22s en esta
plantilla (muy por encima incluso de las demás páginas del propio sitio).

**Cambio recomendado:** convertir la imagen a WebP/AVIF y servirla en una resolución acorde al
contenedor (o migrar a `next/image` con `priority`), o al menos comprimir el PNG actual sin
cambiar de formato. No se realizó el cambio en esta sesión — requiere una herramienta de
conversión de imágenes que no está disponible sin añadir una dependencia nueva.

### 2. El patrón de "reveal on scroll" oculta el hero fuera de la home — Prioridad ALTA

`src/app/layout.tsx` (script `design-system-observers`, `strategy="afterInteractive"`) aplica
`document.querySelectorAll('section, footer').forEach(...)` **globalmente en cada página**,
añadiendo la clase `.reveal` (definida en `globals.css`: `opacity: 0; transform:
translateY(28px)`) a **todas** las secciones y footers, excepto un único selector de exclusión:
`section.relative.min-h-screen` (el hero de la home).

Ese selector de exclusión **no cubre los heroes de las demás páginas**. Se verificó en
`src/app/regalos-corporativos/page.tsx`: su hero es `<section className="relative bg-primary
py-16 md:py-24 bg-cover bg-center">` — tiene `relative` pero no `min-h-screen`, así que **sí
recibe `.reveal`** y empieza en `opacity: 0`. El contenido (incluido el H1 y el fondo) solo se
vuelve visible cuando el `IntersectionObserver` del script dispara su callback tras la
hidratación — un retraso evitable para contenido que ya está en el viewport en la carga inicial.

**Nota:** el `transform`/`opacity` usados no afectan CLS (son propiedades de compositor, no
generan reflow) — por eso el CLS medido es bueno en las 6 plantillas. El problema es
específicamente de **LCP**, no de CLS.

**Cambio recomendado:** ampliar el selector de exclusión para cubrir el hero de cada plantilla
(por ejemplo, usar un marcador explícito como `.no-reveal` en cada hero, ya soportado por el
script — solo falta aplicarlo consistentemente en todas las plantillas, no solo excluir por
selector CSS del home). No se aplicó en esta sesión — es un cambio de diseño/UX (afecta la
animación visible) que el brief pide no tocar sin medir y justificar primero con el usuario.

### 3. CSS y JS no utilizados en el bundle compartido — Prioridad MEDIA

Lighthouse detecta ~65 KiB de CSS no usado y ~127 KiB de JS no usado en los chunks compartidos
(`_next/static/css/*.css`, `_next/static/chunks/2200cc46-*.js`) en `/regalos-corporativos/`. Es
esperable en un bundle compartido entre plantillas muy distintas (Tailwind genera CSS para
clases usadas en todo el sitio, no solo la página actual) — no es necesariamente accionable sin
un análisis de code-splitting más profundo, fuera de alcance de esta sesión.

### 4. Third-party: Google Tag Manager bloquea ~97ms de hilo principal

`third-party-summary` reporta ~100ms de bloqueo por GTM/gtag en `/regalos-corporativos/`. Ya
está cargado con `strategy="afterInteractive"` (no bloquea el render inicial) y con Consent Mode
v2 con valores por defecto denegados — configuración correcta. El impacto medido es menor
comparado con los hallazgos 1 y 2.

## Accesibilidad y rendimiento móvil/escritorio

- No se detectaron problemas de accesibilidad que Lighthouse marque como bloqueantes en el
  preset de performance usado (no se corrió el preset de accesibilidad completo en esta sesión).
- El rendimiento en desktop midió **peor** que en mobile en este entorno de prueba — contraintuitivo,
  y casi con certeza un artefacto del servidor local sin compresión combinado con el
  `throttling-method=devtools` usado en desktop. No se debe interpretar como "el sitio es más
  lento en escritorio que en móvil" sin datos de campo reales (ver checklist de campo).

## Qué NO se hizo en esta sesión

- No se modificó ninguna imagen ni el script de `layout.tsx` — ambos requieren decisión humana
  (impacto visual/UX) o una herramienta de conversión de imágenes no disponible sin nueva
  dependencia.
- No se corrió el preset completo de accesibilidad ni SEO de Lighthouse (solo `--preset=perf`).
- No se midió con throttling de red simulado realista (3G/4G) — estos resultados usan la
  configuración por defecto de Lighthouse para cada form factor.
