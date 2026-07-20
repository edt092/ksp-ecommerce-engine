# SEO — pendientes de la sesión (arrancada 2026-07-19, plan-seo.md)

Continuación de `docs/seo-master-plan-2026-07-19.md` y `reports/audit-findings-validation.csv`.
Este documento es solo el punto de partida para la próxima sesión — no repite el análisis ya
hecho, solo el estado y lo que falta.

## Fase 6/7 — piloto de página de ciudad (Quito): implementado (commit `a2eed60`)

- `reports/schema-entity-audit.csv` generado (14 URLs muestra, 53 bloques JSON-LD). Confirma
  que las 5 páginas de ciudad emitían cada una su propio `LocalBusiness` sin `@id` compartido
  (5 "negocios" ante Google en vez de la entidad real única en `layout.tsx#localbusiness`).
  También encontró y arregló un caso igual en el `OnlineStore` de la home
  (`src/app/page.tsx`) — le faltaba `@id`, ahora comparte el de `#localbusiness`.
- Piloto solo en Quito (`src/lib/city-pilot.ts`, `CITY_PILOT_SLUGS`): schema pasa de
  `LocalBusiness` independiente a `Service` (`provider` → `#localbusiness`) +
  `BreadcrumbList` + `FAQPage`, más una sección de FAQ visible (misma fuente que el schema,
  verificado que coinciden literalmente). Guayaquil/Cuenca/Manta/Ambato **sin tocar** —
  verificado en `out/` que mantienen exactamente su schema y contenido anteriores.
- De paso: cifra desactualizada "1,200 productos" en `data/geo-data.js` (se había escapado
  del fix de Fase 4 de la sesión anterior porque vive en un string de datos, no en JSX) →
  corregida a "2.100". Enlaces a ciudades sin trailing slash corregidos en 2 archivos.
- Medida similitud Jaccard de contenido entre las 5 ciudades: 20.5%–47.5%, mayoría 22–30% —
  ya razonablemente diferenciado, no fue necesaria reescritura de contenido para el piloto.
- Validado: `validate-unique-slugs`, `seo:links`, `seo:redirects`, `seo:indexability`,
  `pnpm build`, `seo:test` en 0. Revisión visual en navegador confirmada.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### 🔴 Pendiente antes de extender a Guayaquil/Cuenca/Manta/Ambato (requiere aprobación explícita)

- El plan advierte que **Cuenca, Ambato y Manta ya mostraron rendimiento positivo en GSC
  histórico** — a diferencia de la extensión de Fase 9 (aprobada y aplicada en la misma
  sesión sin este riesgo), aquí se recomienda revisar esos datos de GSC reales antes de
  tocar esas 3 páginas, aunque el cambio de schema en sí es de bajo riesgo (no modifica
  contenido visible, solo unifica la entidad — el riesgo real estaría en tocar contenido).
  Guayaquil no tiene esa señal de alerta en el plan.
- `reports/schema-entity-audit.csv` deja las 4 filas de Guayaquil/Cuenca/Manta/Ambato
  marcadas `duplicate_entity=true`, acción `PENDIENTE`, listas para cuando se apruebe extender.
- La dirección `streetAddress: "Norte de Quito"` en el `LocalBusiness` global (`layout.tsx`)
  sigue sin verificar — el propio `plan-seo.md` la cita textualmente como ejemplo de qué NO
  usar (Fase 17). Fuera de alcance de Fase 6/7, pero vale la pena resolverlo en una sesión
  futura pidiendo al negocio una dirección real o el área de servicio apropiada.

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
- Ver `reports/product-duplicate-candidates.csv` y `reports/batch{1,2,3,4,5,6}-duplicate-redirects.csv`.

## Fase 9 — Paginación de categorías: PILOTO implementado (commit `192a345`)

- Confirmado en `out/`: `boligrafos-publicitarios` (171 productos tras Fase 2, antes 174) solo
  exponía 12 `<a href>` reales; el resto vivía en `CategoryProductsGrid` (scroll infinito
  client-side).
- Implementada Opción A del plan (paginación estática) **solo para esta categoría**:
  - `src/lib/category-pagination.ts` — whitelist `PAGINATED_CATEGORY_SLUGS` (hoy solo
    `boligrafos-publicitarios`) + `CATEGORY_PAGE_SIZE=24`.
  - `src/components/StaticProductsGrid.tsx` + `src/components/CategoryPagination.tsx` — grid
    servidor sin scroll infinito + nav Anterior/Siguiente con enlaces reales.
  - `src/app/categorias/[slug]/page.tsx` — rama condicional solo para slugs en la whitelist;
    las otras 36 categorías siguen exactamente igual (verificado: `precio-bomba` sigue con 12
    enlaces, sin nav de paginación).
  - `src/app/categorias/[slug]/pagina/[page]/page.tsx` — ruta nueva, páginas 2..8 generadas
    solo para el piloto.
  - `src/app/sitemap.ts` — incluye las 7 páginas adicionales del piloto.
- Verificado: 24 enlaces × 7 páginas + 3 en la última = 171 (exacto, sin duplicados),
  canonicals autorreferenciales por página, títulos distintos, JSON-LD parseable, revisión
  visual en navegador (desktop) con clic real en "Siguiente" confirmando la navegación.
  Todas las validaciones (`validate-unique-slugs`, `seo:links`, `seo:indexability`,
  `seo:redirects`, `pnpm build`, `seo:test`) en 0.
- **Commit local, no pusheado aún** al cierre de esta sesión — pendiente decisión del usuario.

### Extendida a las 26 categorías con más de 24 productos (commit `9e4882c`)

Aprobado por el usuario en la misma sesión. Se generó primero
`reports/category-product-link-coverage.csv` (las 37 categorías, enlaces reales vs. total)
para decidir el umbral: 26 categorías tienen >24 productos y hoy exponían solo 12 enlaces
reales; las 11 restantes ya exponen el 100% sin paginación. Solo se tocó
`PAGINATED_CATEGORY_SLUGS` en `src/lib/category-pagination.ts` — el resto de la
infraestructura ya era genérica. 66 páginas nuevas, 92 páginas totales entre las 26
categorías. Verificado programáticamente (cobertura exacta, sin duplicados, canonicals
correctos) para las 26, más revisión visual del caso límite (relojes, última página con 2
productos). Todas las validaciones en 0.

**Commits `192a345`, `e691af7`, `9e4882c` locales, no pusheados aún al cierre de esta
sesión** — pendiente decisión del usuario.

### 🔴 Pendiente de una sesión futura

- Medir engagement/CTR real de la paginación en producción tras el despliegue.
- No se hizo revisión visual en viewport móvil real en esta sesión (la herramienta de
  `resize_window` del navegador no reflejó el cambio de viewport en las capturas) — el
  componente reutiliza las mismas clases Tailwind responsive que el resto del sitio
  (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`), pero vale la pena una verificación visual
  explícita en móvil real.
- La categoría `novedades` (269 productos, la más grande) es probablemente un bucket
  temporal/de aterrizaje para productos aún sin categorización definitiva final (muchos IDs
  con prefijo `novedades-*` aparecieron durante la revisión de duplicados de Fase 2 de esta
  sesión) — vale la pena confirmar con el negocio si esa categoría debería existir como
  landing pública paginada a largo plazo o si sus productos deberían recategorizarse.
- `reports/category-product-link-coverage.csv` quedó con el conteo de enlaces reales
  pre-cálculo (asume 12 para todo lo no paginado, que es el comportamiento real de
  `CategoryProductsGrid`) — si se cambia el `PER_PAGE` del scroll infinito, regenerar.

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
