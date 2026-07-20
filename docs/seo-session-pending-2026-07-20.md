# SEO — pendientes de la sesión (arrancada 2026-07-19, plan-seo.md)

Continuación de `docs/seo-master-plan-2026-07-19.md` y `reports/audit-findings-validation.csv`.
Este documento es solo el punto de partida para la próxima sesión — no repite el análisis ya
hecho, solo el estado y lo que falta.

## Commits de esta sesión (local, no pusheados hasta el cierre de sesión)

1. `6b01a37` — Fase 0: validación de auditoría vs. repo real
2. `3f536ec` — Fase 4: cifras de catálogo unificadas (+2.100)
3. `a814d2a` — Enlace externo del footer eliminado (autorizado)
4. `30c258e` — Fase 2: script de auditoría de duplicados + reporte (95 grupos)
5. `8bbb0e4` — Fase 2 Batch 1: 10 duplicados exactos consolidados
6. `fd6e6aa` — Fase 2 Batch 2: 6 duplicados exactos consolidados (con fusión de contenido)
7. `bf80bee` — Fix crítico: imágenes rotas por redirect de dominio (catalogospromocionales.com → cataprom.com)

## 🔴 Verificar primero en la próxima sesión

- **Confirmar en producción que las imágenes cargan** tras el deploy del commit `bf80bee`.
  El fix se validó localmente (build, tests, HTML generado) pero el comportamiento real del
  Image CDN de Netlify contra `cataprom.com` no se pudo probar sin acceso a producción.
- `cataprom.com` sirve las imágenes con `Cache-Control: private` (heredado del servidor IIS
  del proveedor, no controlable desde este repo) — no bloquea la visualización pero limita el
  cacheo compartido/CDN. Si el rendimiento de imágenes sigue siendo un problema, evaluar migrar
  las imágenes a un dominio propio o a Cloudinary (ya está en el allowlist).

## Fase 2 — Duplicados de producto (en progreso)

- ✅ 10 pares Batch 1 (genéricos vs. reales, patrón `-nuevo-`)
- ✅ 6 pares Batch 2 (contenido fusionado)
- ⛔ **3742** (`botilito-pvc-mercury-850ml`) — BLOCKED: técnica de personalización en conflicto
  (láser vs. full color). Requiere decisión humana: ¿son variantes de producción reales o error
  de catálogo?
- ⛔ **10282** (`soporte-para-moviles-strike`) — BLOCKED_REQUIRES_VISUAL_VERIFICATION: la
  afirmación "plegable" en el canónico no está confirmada contra la imagen ni ficha técnica.
- ⏳ **59 LIKELY_DUPLICATE** sin revisar — probablemente requieren el mismo nivel de escrutinio
  que Batch 2 (contenido dual-enriquecido), no el atajo de Batch 1.
- ⏳ **8 LEGITIMATE_VARIANT** sin revisar — clasificados como variantes por spec/material
  diferente; confirmar que ninguno es en realidad un duplicado mal etiquetado.
- ⏳ **10 INSUFFICIENT_DATA** sin revisar — incluye casos raros como imagen compartida entre
  productos con nombres completamente distintos (posible bug de datos del proveedor, no
  necesariamente duplicado).
- Ver `reports/product-duplicate-candidates.csv`, `reports/batch1-duplicate-redirects.csv`,
  `reports/batch2-duplicate-redirects.csv`.

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
