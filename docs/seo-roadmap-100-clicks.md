# Roadmap 90 días — hacia ~100 clics/28 días

Meta de negocio: acercarse a 100 clics orgánicos por cada 28 días, ~2,000 impresiones y CTR
~5%. No se garantiza — este roadmap describe las condiciones para intentarlo, según baseline
y objetivos detallados en `docs/seo-measurement-plan.md`.

## Objetivos a 30 / 60 / 90 días

Detalle completo y checklist de seguimiento semanal en `docs/seo-measurement-plan.md`. Resumen:

| Hito | Clics/28d | Impresiones/28d | CTR | Condición técnica asociada |
| --- | --- | --- | --- | --- |
| Día 30 | 40–50 | 1,100–1,300 | ≥ 3.72% (baseline) | Fase 1 (P0 técnico) resuelta y con ≥21 días de datos post-deploy |
| Día 60 | 55–75 | 1,500–1,800 | Mejora sobre baseline | Fase 2 (quick wins) con ≥21 días de datos post-cambio |
| Día 90 | Intentar 100 | ~2,000 | ~5% | Fase 3 en progreso; Fase 4 iniciada |

## Estado, responsables y dependencias por fase

| Fase | Estado | Responsable sugerido | Dependencias |
| --- | --- | --- | --- |
| Fase 1 — P0 técnico | Completado en repo (código) / Pendiente verificación externa | Desarrollo | Confirmación manual de dominio primario en Netlify (fuera del repo); próximo deploy |
| Fase 2 — Quick wins | Completado en repo | Desarrollo + Contenido/Marketing | Fase 1 desplegada; ≥21 días de datos antes de evaluar impacto |
| Fase 3 — Landings comerciales | No iniciada (recomendación documentada) | Contenido/Marketing + Desarrollo | Datos de Fase 1/2 con más volumen para confirmar hipótesis de canibalización |
| Fase 4 — Autoridad | Playbook preparado, sin ejecutar (ver `docs/phase-4-authority-playbook.md`) | Dirección comercial / Marketing | Ninguna técnica — requiere decisión y ejecución humana (GBP, reseñas, casos reales, outreach) |

## Fase 1 — P0 técnico (completada en esta sesión)

Ver detalle y evidencia en `docs/seo-audit-gsc.md`:

- Sitemap consolidado en `src/app/sitemap.ts` (eliminado `next-sitemap`).
- Redirects de dominio (http/non-www → https+www) añadidos a `netlify.toml`.
- Blog duplicado corregido + validación de slugs únicos en `prebuild`.
- 5 productos 404 con impresiones indexadas corregidos con 301.
- 4 enlaces internos rotos corregidos (12 ocurrencias).
- Colombia: ya resuelto en commit previo, verificado sin cambios pendientes.

## Fase 2 — Quick wins de bajo riesgo (esta sesión)

Ejecutados sin inventar precios, reviews, casos ni estadísticas, sin tocar snippets con CTR
ya positivo (antiestrés, Cuenca, Ambato):

1. Home — enlaces contextuales añadidos a `/articulos-promocionales/`, `/productos-promocionales-ecuador/`, `/merchandising-corporativo/`.
2. `/blog/regalos-corporativos-fin-ano-ecuador/` — revisión de frescura y refuerzo de enlace a `/regalos-corporativos/`.
3. `/blog/mejores-productos-promocionales-2025/` — decisión documentada en `docs/keyword-url-map.md` (opción A, evergreen, URL conservada).
4. `/categorias/mugs-y-termos-personalizados/` — revisión de copy comercial.
5. Clúster bolígrafos — diferenciación de H1/editorial entre categoría y artículo.
6. `/categorias/antiestres/` y páginas locales (Manta) — solo enlazado interno adicional, sin tocar snippets positivos.
7. Los 7 productos del hallazgo #12 — 5 con redirect nuevo verificado, 2 restantes auditados sin cambios de datos.

## Fase 3 — Landings comerciales (recomendación, no implementada como código en esta sesión)

El propio brief separa esta fase de los "quick wins de bajo riesgo" de la Fase 2, y sus
entregables de código no la incluyen explícitamente. Recomendaciones para la siguiente
iteración:

- **Artículos promocionales, Regalos corporativos, Productos promocionales Ecuador,
  Merchandising corporativo**: cada URL necesita una intención de búsqueda claramente distinta
  (ver `docs/keyword-url-map.md`). Hoy compiten parcialmente entre sí por consultas genéricas
  ("artículos promocionales", "promocionales") sin que ninguna domine — antes de crear contenido
  nuevo, definir con precisión qué sub-intención cubre cada una (ej. Regalos corporativos =
  ocasión/destinatario; Productos promocionales Ecuador = catálogo + cobertura geográfica;
  Merchandising corporativo = programa de marca a largo plazo/employer branding).
- **Quito y Guayaquil**: ya existen como páginas (`data/geo-data.js`) pero no lideran en clics
  pese a ser los mercados más grandes. Hipótesis a validar (no confirmada, requiere más datos):
  compiten con la home y con `/productos-promocionales-ecuador/` genérica por las mismas
  consultas. Antes de invertir en contenido nuevo, revisar canibalización real con
  `reports/gsc-page-opportunities.csv` una vez haya más volumen post Fase 1.
- No crear ciudades nuevas en esta fase (instrucción explícita del brief) ni docenas de
  artículos similares.

## Fase 4 — Autoridad (recomendación externa, no código)

Acciones fuera del alcance de este repositorio, a coordinar con el negocio:

- Google Business Profile: completar/optimizar ficha, categorías, fotos propias, reseñas
  legítimas (no comprar ni fabricar reseñas).
- Casos reales de clientes (con autorización) y fotografías propias de producto/entrega,
  reemplazando gradualmente imágenes de stock/catálogo de proveedor donde sea posible.
- Perfil de autor/a verificable para contenido de blog (ya existe `author`/`authorLinkedIn`
  en varios posts — extender el patrón, no inventar biografías).
- Enlaces editoriales ecuatorianos legítimos: cámaras de comercio, asociaciones de
  proveedores promocionales, medios locales — sin comprar enlaces ni usar redes de PBN.
- Vídeos demostrativos de producto/proceso de personalización.

Ninguna de estas acciones debe ejecutarse como generación artificial de enlaces o contenido
masivo — el brief lo prohíbe explícitamente y es contraproducente a mediano plazo.

## Priorización sugerida para la próxima sesión de trabajo

1. Confirmar manualmente en Netlify que el dominio primario es `www` (bloqueante para medir
   el efecto real de la Fase 1 en GSC).
2. Verificar Core Web Vitals móvil/escritorio con datos reales de campo (CrUX/PageSpeed) —
   no evaluado en esta sesión por falta de acceso de red.
3. Iniciar Fase 3 con una sola landing (la de mayor impresiones sin clics — actualmente
   `/regalos-corporativos/`, 71 impresiones, 1 clic) antes de tocar el resto, para validar el
   enfoque de diferenciación de intención con un solo experimento medible.
