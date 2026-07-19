# Plan de medición SEO — KS Promocionales

## Baseline (export GSC hasta 2026-07-15, últimos 28 días disponibles)

- Clics: 26 / 28 días
- Impresiones: 853 / 28 días
- CTR histórico (16 meses): 3.72%
- Posición media general: ver `reports/gsc-summary.md`

## Objetivos operativos (metas, no garantías)

| Hito | Clics/28d | Impresiones/28d | CTR | Condición técnica |
| --- | --- | --- | --- | --- |
| Día 30 | 40–50 | 1,100–1,300 | ≥ baseline (3.72%) | Fragmentación técnica resuelta (sitemap único, redirects de dominio, 404s de producto corregidos) |
| Día 60 | 55–75 | 1,500–1,800 | Mejora sobre baseline | Páginas prioritarias (fin de año, mugs, home, clúster bolígrafos) optimizadas y con ≥21 días de antigüedad post-cambio |
| Día 90 | Intentar 100 | ~2,000 | ~5% | Autoridad temática/local en progreso (Fase 3–4 del roadmap) |

**Prohibición explícita: no atribuir resultados prematuramente.** No evaluar el impacto de un
cambio SEO con menos de 21–28 días de datos, salvo errores técnicos críticos (404s, sitemap
roto, redirects incorrectos), que sí deben verificarse de inmediato tras el deploy. Ninguna
mejora o caída en menos de 21 días debe atribuirse a un cambio específico — puede ser ruido
normal dado el bajo volumen actual (26 clics/28 días).

## Métricas

Definición de qué se mide y de dónde sale cada número, para que el seguimiento semanal sea
consistente entre quien lo registre:

| Métrica | Fuente | Notas |
| --- | --- | --- |
| Clics, impresiones, CTR, posición | GSC → Rendimiento → Resultados de búsqueda, ventana de 28 días | No mezclar con la ventana de 16 meses del export inicial |
| Posición por consulta prioritaria | GSC → filtro por consulta, comparar contra `docs/keyword-url-map.md` | Usar posición media, no la mejor posición del periodo |
| Core Web Vitals de campo | CrUX / Search Console / PageSpeed Insights | Ver `docs/core-web-vitals-field-checklist.md` — no disponible desde este repo |
| Leads/formularios/WhatsApp | GA4 (fuera del alcance de este repo) | Ver sección "Eventos de conversión" |

## Eventos de conversión

Estos eventos determinan si el tráfico orgánico genera negocio real, no solo tráfico. Ninguno
está confirmado como instrumentado en esta sesión (requiere acceso a GA4/GTM, fuera del repo):

- **Clic a WhatsApp** (`wa.me/593999814838`) — idealmente un evento GA4 por página de origen.
- **Envío de formulario de contacto** (`/contacto/`).
- **Descarga de catálogo digital** (`/catalogos-digitales/`).
- **Clic a llamada telefónica**, si aplica.

Acción recomendada: confirmar con quien administre GA4/GTM si estos eventos ya están
instrumentados; si no, es la primera tarea de instrumentación antes de poder medir conversión
real (no solo tráfico).

## Comparaciones cada 28 días

Comparar siempre contra dos referencias, no solo la semana anterior:

1. **Periodo anterior de 28 días** (tendencia de corto plazo).
2. **Baseline original** (26 clics / 853 impresiones / CTR 3.72%) — para ver progreso acumulado real.

Usar rangos de 28 días (no meses de calendario) porque así reporta Search Console de forma
nativa y evita distorsión por meses de distinta duración.

## Plantilla de registro de cambios por URL

Registrar cada cambio aplicado, para poder correlacionar con variaciones de GSC 21-28 días después:

| Fecha | URL | Cambio aplicado | Tipo (técnico/contenido/enlazado) | Clics antes (28d) | Impresiones antes (28d) | Revisar el (fecha + 21-28d) | Resultado observado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-18 | `/blog/regalos-corporativos-fin-ano-ecuador/` | Checklist de cotización + enlace a /regalos-corporativos/ + CTA WhatsApp | Contenido + enlazado | 0 | 258 | 2026-08-15 | Pendiente |
| 2026-07-18 | `/categorias/boligrafos-publicitarios/` | H1/seoTitle diferenciados del artículo | Contenido | 2 | 46 | 2026-08-15 | Pendiente |
| 2026-07-18 | Footer (todo el sitio) | Fix geoLinks Cuenca/Ambato + Manta añadida | Enlazado interno | — | — | 2026-08-15 | Pendiente |

Añadir una fila por cada cambio futuro, sin excepción — es la única forma de saber qué causó qué.

## Seguimiento semanal (checklist)

Cada semana, exportar de GSC (Rendimiento → Resultados de búsqueda, últimos 28 días) y registrar:

1. Clics y impresiones totales (comparar contra semana anterior y contra baseline).
2. CTR global.
3. Posición media.
4. Top 3 / top 10 / top 20 — cuántas consultas de `docs/keyword-url-map.md` están en cada rango.
5. URLs con clics (¿nuevas URLs entraron a la lista? ¿alguna prioritaria dejó de recibir clics?).
6. Clics a WhatsApp (evento de analítica, si está instrumentado — verificar en GA4/GTM, fuera del alcance de este repo).
7. Envíos de formulario de contacto.
8. Conversiones por dispositivo (escritorio vs. móvil — el tráfico B2B es mayoritariamente escritorio pero móvil tiene mejor CTR y posición, no optimizar solo para uno).
9. Cambios realizados esa semana, por URL, con fecha — para poder atribuir variaciones.

## Próxima exportación de GSC recomendada

**2026-08-15** (30 días después del cierre de este export, suficiente para ver el efecto de las
correcciones técnicas de Fase 1 y empezar a evaluar los quick wins de Fase 2, sin caer en
lecturas prematuras de <21 días).

## Métricas fuera de Search Console a instrumentar (acción externa)

- Leads orgánicos atribuidos (requiere CRM o formulario con UTM/origen).
- Clics a WhatsApp por página (requiere evento GA4 — verificar que `wa.me` esté instrumentado en GTM/GA4, no confirmado en esta sesión).
- Conversión de formulario de contacto por fuente de tráfico.

Estas quedan como tarea de configuración de analítica, no de código de este repositorio.
