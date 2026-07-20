# SEO — pendientes de la sesión (arrancada 2026-07-19, plan-seo.md)

Continuación de `docs/seo-master-plan-2026-07-19.md` y `reports/audit-findings-validation.csv`.
Este documento es solo el punto de partida para la próxima sesión — no repite el análisis ya
hecho, solo el estado y lo que falta.

## Sesión 2026-07-20 — resumen

- Confirmado en producción (vía curl) que el fix de imágenes del commit `bf80bee` funciona:
  `https://www.kronosolopromocionales.com/.netlify/images?url=...cataprom.com/...` devuelve
  200 y sirve WebP correctamente. Sin acción pendiente sobre esto.
- Fase 2 completada para los 59 pares `LIKELY_DUPLICATE`: revisados campo por campo y
  consolidados en 3 sub-lotes de ≤20 (tope explícito de `plan-seo.md`, confirmado con el
  usuario antes de implementar porque técnicamente son `LIKELY_DUPLICATE`, no
  `EXACT_DUPLICATE`, y la regla de redirect automático del plan solo cubre esta última).
  Commits: `76f098b` (Batch 3, 20 pares), `aa0e4b0` (Batch 4, 20 pares), `05f0ec8` (Batch 5,
  19 pares). Ver detalle en `reports/batch3/4/5-duplicate-redirects.csv`.
  - 1 fusión de dato aditivo real (SKU 5693, estructura en fibra de vidrio).
  - 3 pares (`6530`, `7557`, `9587`) venían de un lote de baja calidad `accesorios-auto` con
    reclamos de disponibilidad no verificados ("entrega inmediata", "producto en camino") y
    un caso con referencia a "motociclista mexicano" en un sitio exclusivo de Ecuador — se
    redirigieron descartando todo el contenido de esa fuente, sin fusionar nada (decisión
    aprobada por el usuario).
  - De paso se corrigió una cadena de redirect preexistente
    (`medidor-de-presion-para-neumaticos-nuevo` apuntaba a un slug que este batch consolidó)
    y un enlace interno roto/mal apuntado en `data/blog/content/index.js` (dos anchors
    distintos apuntaban a la misma URL de producto equivocada).
  - Productos: 2169 → 2110 tras los 3 batches. Todas las validaciones (`validate-unique-slugs`,
    `seo:redirects`, `seo:links`, `seo:indexability`, `pnpm build`, `seo:test`) en 0 tras cada
    batch.
- Batch 3/4/5 (`76f098b`, `aa0e4b0`, `05f0ec8`) se pushearon a `origin/main` durante esta sesión.
- Batch 6 (`35ef8c4`) consolida los 18 pares restantes (`LEGITIMATE_VARIANT` +
  `INSUFFICIENT_DATA`) — 10 redirects implementados, 7 variantes reales confirmadas y dejadas
  intactas, 1 caso nuevo bloqueado (SKU 9707). **Esto cierra por completo la Fase 2**: de los
  95 grupos candidatos originales, 75 quedaron consolidados en 6 batches, 8 confirmados como
  variantes legítimas (no se tocan), y 3 siguen BLOCKED pendientes de revisión humana/visual
  (3742, 10282, 9707 — ver `reports/batch2-duplicate-redirects.csv` y
  `reports/batch6-duplicate-redirects.csv` para el detalle de cada bloqueo).

## Fase 2 — Duplicados de producto: CERRADA

- ✅ 16 pares `EXACT_DUPLICATE` (Batch 1 + 2, sesión anterior)
- ✅ 59 pares `LIKELY_DUPLICATE` (Batch 3 + 4 + 5, esta sesión)
- ✅ 10 pares adicionales consolidados desde `LEGITIMATE_VARIANT`/`INSUFFICIENT_DATA` (Batch 6,
  esta sesión) — casos que el script de auditoría automática subestimó (similitud de nombre
  baja por branding distinto, o contaminación del lote `accesorios-auto`)
- ✅ 7 `LEGITIMATE_VARIANT` confirmados como variantes reales (capacidad ml distinta en
  botilitos; dos catálogos de relojes distintos) — revisados y dejados intactos, correctamente
  clasificados desde el inicio
- ⛔ **3742** (`botilito-pvc-mercury-850ml`) — BLOCKED: técnica de personalización en conflicto
  (láser vs. full color). Requiere decisión humana: ¿son variantes de producción reales o error
  de catálogo?
- ⛔ **10282** (`soporte-para-moviles-strike`) — BLOCKED_REQUIRES_VISUAL_VERIFICATION: la
  afirmación "plegable" en el canónico no está confirmada contra la imagen ni ficha técnica.
- ⛔ **9707** (`mug-metalico-warmer-450ml` vs `termo-viajero-calientito-tu-companero-ideal`) —
  BLOCKED_REQUIRES_VISUAL_VERIFICATION: misma imagen pero descripciones materialmente distintas
  (mug metálico abierto vs. termo de doble pared con retención de calor 8h).
- Catálogo tras Fase 2 completa: 2185 → 2100 productos (85 consolidados).
- Siguiente fase sugerida por el plan: Fase 3 (integridad producto↔ruta, ya resuelta como falso
  positivo en sesión 1) → Fase 6/7 (piloto de página de ciudad) o Fase 9 (piloto de categoría
  rastreable `boligrafos-publicitarios`, 174 productos con solo 12 enlaces `<a>` reales) son
  probablemente los siguientes de mayor impacto SEO pendientes.
- Ver `reports/product-duplicate-candidates.csv` y `reports/batch{1,2,3,4,5,6}-duplicate-redirects.csv`.

## Hallazgos confirmados de la Fase 0 — sin implementar todavía

| Hallazgo | Fase del plan | Estado |
|---|---|---|
| Páginas de ciudad con `LocalBusiness` sin evidencia de sucursal física | Fase 6/7 | Sin empezar — requiere piloto en 1 ciudad + aprobación antes de extender a las 5 |
| Categoría `boligrafos-publicitarios`: 174 productos, solo 12 enlaces `<a>` reales | Fase 9 | Sin empezar — requiere diseño de paginación + piloto |
| Íconos de categoría pesados (hasta 2.61MB) | Fase 15 | Sin empezar — **distinto** del bug de dominio roto ya arreglado; esto es optimización/compresión, no disponibilidad |
| `lastmod` del sitemap | Fase 5 | Parcialmente mitigado en código (`p.updatedAt \|\| p.createdAt \|\| BUILD_DATE`); falta auditar qué % de productos tiene fecha real |
| Product schema sin `offers`/`review`/`aggregateRating` | Fase 7 | Sin empezar — requiere decisión de negocio (mostrar precio "desde $X", recolectar reseñas reales) |
| Dirección pública vs. "solo con cita" | Fase 17 | Sin empezar — requiere confirmación del negocio sobre dirección real |

## Fases del plan no iniciadas

Fase 8 (reseñas/testimonios reales), Fase 10 (contenido delgado — cohorte piloto de 20
productos), Fase 11 (metadata a escala), Fase 12 (interlinking blog↔categorías), Fase 14
(mobile/UX — bugs específicos: H1 pegado "Promocionalesque", CTA bajo banner de cookies), Fase
16 (FAQ cerca del CTA), Fase 19 (CSP — backlog de seguridad separado, no mezclar con SEO), Fase
20 (IndexNow, backlog), Fase 21 (backlinks/YouTube, backlog).

**Ya resueltos como falso positivo / no requieren acción:**
Fase 3 (producto 10589 — el contenido siempre fue correcto), Fase 18 (Machala — el footer ya
enlaza a la landing nacional, no a un 404), Fase 13 (enlace externo del footer — ya eliminado).

## Siguiente paso sugerido

Continuar con los 59 LIKELY_DUPLICATE aplicando el mismo protocolo de Batch 2 (confirmar mismo
producto físico campo por campo antes de fusionar/redirigir, bloquear ante cualquier conflicto
material). Dado el volumen, probablemente convenga dividirlo en sub-lotes de ≤20 como ya se
viene haciendo.
