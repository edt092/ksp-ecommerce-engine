# Plan maestro SEO — validación de auditoría 2026-07-19

Fuente: `auditoria-seo-completa.md` (12 especialistas, health score 60/100), contrastada contra el
estado real del repositorio en este commit (`8a9e6a6`). Matriz completa en
`reports/audit-findings-validation.csv`.

**Estado real confirmado por conteo directo de `data/products.json`:**
2.185 productos totales · 2.101 indexables (`is_ai_optimized=true`) · 84 noindex intencional.
Coincide exactamente con las cifras que ya traía `plan-seo.md` — el catálogo no cambió desde que
se escribió el plan.

---

## CONFIRMED

- **CRIT-4** — Cifras de catálogo contradictorias (+3.500 en 8 archivos, +1.200 en 3 archivos,
  real 2.101/2.185). Bajo riesgo, pre-autorizado, se corrige en esta sesión (Fase 4).
- **CRIT-5** — Las 5 páginas de ciudad generan `LocalBusiness` independientes sin evidencia de
  sucursales físicas. Alto riesgo — requiere Fase 6/7 completas y no se reescribe sin piloto +
  aprobación.
- **CRIT-7** — Product schema sin `offers`/`review`/`aggregateRating`. Confirmado y esperado dado
  el modelo de cotización por WhatsApp; no se inventa ninguno de los tres.
- **HIGH-1** — Categoría `boligrafos-publicitarios`: 174 productos, solo 12 enlaces `<a>` reales
  en el HTML estático (verificado directamente en `out/`). Requiere Fase 9 con piloto.
- **HIGH-2** — Enlace externo en footer sitewide (`edwinbayonaitmanager.online`) sin `nofollow`
  (sí tiene `noopener noreferrer`). Clasificación preliminar `UNVERIFIED_CREDIT` —
  REQUIRES_BUSINESS_DECISION.

## PARTIALLY_CONFIRMED

- **CRIT-1** — Duplicados por SKU: el audit dice "~75 pares"; el conteo real por número final de
  slug da **95 grupos / 190 URLs**, coincidiendo exactamente con la estimación preliminar de
  `plan-seo.md`. Pero no todos son duplicados reales — ya se confirmaron variantes legítimas
  (distinto volumen: `titan-650-ml` vs `titan-690-ml`; distinta línea: `novelties-2026` vs
  `mundial-2026`). Requiere Fase 2 completa antes de redirigir nada.
- **CRIT-3** — Brecha de sitemap: el "+3.500" del home no tiene respaldo en el repo (2.101
  indexables reales); la porción de brecha de "1.400 productos reales no importados" es
  REQUIRES_EXTERNAL_DATA — no hay export del proveedor disponible para confirmarla o
  descartarla.
- **CRIT-6** — Imágenes pesadas: confirmado el problema (íconos de categoría hasta 2.61MB, no
  3.4MB exactos como dice el audit, pero igual de crítico para CWV móvil).
- **MED-2** — `lastmod` del sitemap: el código YA tiene mitigación parcial
  (`p.updatedAt || p.createdAt || BUILD_DATE`), contrario a lo que sugiere el audit de que nada se
  ha hecho. Falta medir qué % de productos tiene fecha real vs cuántos caen al fallback.

## STALE / FALSE_POSITIVE

- **CRIT-2** — El audit afirma que `/productos/audifonos-bluetooth-earshots-boompods-oferta-10589/`
  sirve contenido de "Mouse Inalámbrico Lumo". **Verificado como falso**: tanto `products.json`
  como el HTML ya construido en `out/` muestran title, canonical, H1 y JSON-LD `sku` correctos
  para el producto real. Es un falso positivo — probablemente el crawler de la auditoría vio un
  build anterior a los commits de pipeline (`242e8a9`, `92ebac0`). **No se toca esta URL.**
- **MED-1** — El audit (via `plan-seo.md`) afirma que Machala enlaza a 404. **Verificado como
  falso**: `Footer.tsx` ya enlaza "Machala" a `/productos-promocionales-ecuador` (landing
  nacional), no a una URL inexistente. Ya está resuelto.

## REQUIRES_EXTERNAL_DATA

- Existencia real de ~1.400 productos no importados (fracción de CRIT-3). Necesita export del
  CMS/proveedor — fuera del alcance de esta sesión, no se asume ni en un sentido ni en otro.
- Google API key (PSI/CrUX/GSC/GA4) para datos de campo de CWV e impresiones/clics reales — ya
  señalado como brecha en el propio `auditoria-seo-completa.md`.

## REQUIRES_BUSINESS_DECISION

- HIGH-2: autorización del crédito de desarrollador en el footer.
- CRIT-5 / Fase 6: si existe una sola ubicación física real en Quito o ninguna, para decidir si
  `LocalBusiness` se convierte en `Organization` + `Service` por ciudad.
- CRIT-7: si se decide mostrar "desde $X" para habilitar `offers` en productos destacados, o
  iniciar recolección de reseñas reales.
- Dirección pública real para schema local (Fase 17) — actualmente `streetAddress: "Norte de
  Quito"`, que no es una dirección real.

## Hallazgos pendientes de auditar (requieren su fase dedicada, no cubiertos en esta pasada)

Duplicados exactos vs variantes (Fase 2 completa), integridad de metadata a escala (Fase 11),
canibalización de blog (Fase 12), MOQ/plazos en acordeones (Fase 16), reseñas de 12+ posts para
interlinking (Fase 12), NAP completo (Fase 17), CSP (Fase 19 — backlog de seguridad, no se mezcla
con SEO).

---

## Regla de implementación de esta sesión

Solo se implementan en esta pasada los ítems marcados `implementation_authorized=true` en
`reports/audit-findings-validation.csv`: la corrección de cifras de catálogo contradictorias
(CRIT-4/CRIT-3 parcial). Todo lo demás queda documentado, con script o reporte cuando aplica, para
ejecución en fases posteriores con aprobación explícita.
