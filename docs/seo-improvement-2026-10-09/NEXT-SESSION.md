# Próxima sesión — punto exacto de continuación

Estado al cierre del 2026-10-09: Lotes 1–3 implementados en local, **sin commit ni deploy**. Build y 60 pruebas SEO en
verde. Leer primero `implementation-log.md` y `decisions.md`.

## 1. Re-medición móvil — HECHA (sesión UX, 2026-10-09)

CTA de producto en y=596 a 375 px (antes 769), dentro del primer viewport y sobre el banner; home a 320 px sin ensanchar; 0 elementos fuera del viewport. Ver `docs/ux-improvement-2026-10-09/README.md`. Lo que sigue es el procedimiento original, útil para repetir:

### Procedimiento

El servidor estático se detuvo por falta de memoria antes de medir los últimos ajustes (padding de producto y categoría,
galería 4:3, pestañas del home).

```text
pnpm build
node scripts/serve-static.mjs 5099          # en otra terminal; puerto libre, no matar procesos ajenos
python scripts/seo-improvement/mobile-check.py http://localhost:5099 reports/seo-improvement-2026-10-09/screenshots
```

Aceptación:
- `overflowCount = 0` en todas las filas.
- Home a 320: `innerWidth = 320` (antes 333).
- Producto a 375/390, estado `aceptado`: `cta_ok = True`. Con banner, el CTA debería quedar por encima de él; si no, valorar un banner aún más compacto, no un sticky.
- Gorras a 375, estado banner: CTA visible.

## 2. Después

1. Respuestas del usuario a `business-data-needed.md` §3 (consolidar paraguas, subcategorías, header fijo, portadas).
2. Si hay autorización: commits por lote (ver `deploy-and-measurement.md` §1) y deploy; luego el checklist §2.
3. Con el export GSC por motivo: ampliar `scripts/seo-improvement/indexing-triage.mjs` para leer las listas y clasificar todas las URLs.
4. Piloto de fichas (30 SKUs) cuando lleguen las fichas del proveedor: modelo de atributos con `attributeEvidence` (fuente y fecha por campo).
5. Revisión editorial de `reports/seo-improvement-2026-10-09/blog-claims-audit.csv` (109 frases con cifras).

## Comandos de verificación

```text
pnpm exec tsc --noEmit
pnpm build
node scripts/run-seo-tests.mjs
pnpm run seo:links
pnpm run seo:redirects
pnpm run seo:indexability
node scripts/seo-improvement/link-graph.mjs
node scripts/seo-improvement/reconcile-gsc.mjs "<ruta ANALISI-09-10-2026>"
node scripts/seo-improvement/indexing-triage.mjs "" <etiqueta>
```

## No hacer

Sincronización Neon, purgas, limpieza Colombia, dedupe masivo, regeneración de blog con API, reclasificación automática
de novedades, push o deploy sin autorización, crear perfiles o reseñas.
