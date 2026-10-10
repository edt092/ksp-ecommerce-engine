# Decisiones — mejora SEO 2026-10-09

Cada decisión indica si se **aplicó** en esta sesión o queda **condicionada** a un dato o aprobación.

## Aplicadas

| ID | Decisión | Motivo / evidencia |
|---|---|---|
| D-01 | `/categorias/` → 301 a `/regalos-corporativos/` (reglas exactas, sin splat) en vez de crear un índice nuevo | `/regalos-corporativos/` ya lista todas las categorías y es el destino de "Categorías" en todas las migas. Un índice nuevo duplicaría la intención. |
| D-02 | Productos retenidos (`is_ai_optimized=false`): `noindex, follow` + canonical propia, fuera del sitemap | Antes heredaban canonical y hreflang del home y `nofollow`. Son fichas reales y distintas; no se canonicalizan a otra URL ni al home. |
| D-03 | Eliminada la rama de `productos/[slug]` que canonicalizaba `<slug>-<n>` a `<slug>` por igualdad de nombre | 0 casos activos; un nombre igual no prueba equivalencia. Los duplicados se resuelven con el protocolo de consolidación (301 de un salto). |
| D-04 | Entidad global única `#localbusiness` (tipo `LocalBusiness`, del layout); se eliminó el bloque `OnlineStore` del home | Mismo `@id` con `url` y `priceRange` distintos. Se conserva `LocalBusiness` y no `OnlineStore`: el negocio cotiza por WhatsApp, no vende online. No se añadió `priceRange` nuevo. |
| D-05 | Autor del blog = Person canónica de `/nosotros/` (`src/lib/authors.ts`), nombre corto como `alternateName`; `publisher` por referencia `@id` | Mismo `@id` con otro nombre y 3 cargos distintos. |
| D-06 | Mínimos y plazos publicados como dependencia ("se confirma en la cotización"), desde `business-facts.ts` | El sitio publicaba cifras contradictorias sin fuente (mugs 24 vs 100 uds; 5–15, 10–15, 10–20, 7–21 días). Ver `business-data-needed.md` para restaurar cifras cuando el negocio las confirme. |
| D-07 | Padding superior reducido en producto y hero de categoría, sin cambiar el header | `.header-accent-line { position: relative; }` (globals.css, desde junio 2026) anula la clase `fixed` del header: está en el flujo y el padding pensado para un header fijo dejaba ~90 px vacíos. Volver a un header fijo es un cambio de diseño de todo el sitio → condicionado (ver C-05). |
| D-08 | `displayName`: se quitan "Oferta", "Nuevo", "- Precio Bomba" y "[más]" al final del nombre visible; slugs, ids y `name` del proveedor intactos | 206 nombres afectados. En textos SEO solo se quita el token capitalizado en posición de nombre (104/104 seoTitle). "oferta" en minúscula se conserva. |
| D-09 | Alternativas en ficha: 8, misma categoría, ordenadas por similitud de tipo con desempate por hash estable | Antes, las 4 primeras de la categoría (2 fichas con 222 enlaces; 1.853 fichas con 1 solo enlace). |
| D-10 | "Otras categorías" por familias semánticas explícitas (`src/lib/related-categories.ts`) | Antes, las 6 primeras del archivo para todas. Las familias son una propuesta editorial revisable. |
| D-11 | Mapa categoría→blog ampliado de 16 a 22 categorías con 1 post real que ya las enlaza | Misma fuente verificada (`reports/content-cluster-map.csv`). Bebidas siguen sin guía: clúster por escribir. |
| D-12 | Landings de audífonos/parlantes/soportes: 12 fichas reales por nombre que empieza con el tipo | Criterio estricto para no incluir accesorios que solo mencionan la palabra. |
| D-13 | Íconos de categoría a WebP de 800 px; PNG originales conservados para rollback | 73,8 MB → 2,7 MB en origen. 800 px cubre 264 px a 3x. |
| D-14 | Blog: cifras sin fuente ($80M, 70 %, 80 %, 3–7 %, >80 % retención) reescritas en cualitativo, sin inventar sustituto | El resto (109 frases con cifras) queda en `reports/.../blog-claims-audit.csv` para revisión editorial. |
| D-15 | Títulos de blog: quitado "[2025]" y "2025" sueltos; "2025-2026" se conserva; slugs y `dateModified` intactos | Retoque menor, no edición significativa. |
| D-16 | Quito: H1 y title con "Regalos Corporativos"; "Stock disponible para entregas inmediatas" → "Disponibilidad de stock confirmada en cada cotización" | 24 impresiones de "regalos corporativos quito" (pos. 44,71). Cuenca/Ambato/Manta no se tocaron (señal GSC histórica). |
| D-17 | Banner de cookies compacto con enlace a la política; mismo consentimiento (Aceptar/Rechazar, default denied) | 187 px → 129 px a 375 px. Rechazo verificado: se guarda `denied` y no reaparece. |

## Condicionadas (no aplicadas)

| ID | Propuesta | Falta |
|---|---|---|
| C-01 | Consolidar `paraguas-27-5913-3858` → `paraguas-27-5913` (301) | Aprobación del usuario (protocolo LIKELY). Evidencia en `reports/.../duplicates-and-pending-products.csv`. |
| C-02 | Consolidar o diferenciar Mug Star 8986/13197 | Confirmación del proveedor. |
| C-03 | Subcategorías: candidatas con inventario actual por nombre: mochilas (53), cargadores/power banks (38), libretas (33), bolígrafos ecológicos (18) y metálicos (17). "Termos de acero inoxidable" no es viable por nombre (1 coincidencia): requiere atributos de material. | Autorización de alcance (rutas nuevas, metadatos, breadcrumbs, sitemap). Ver `reports/.../subcategory-candidates.csv`. |
| C-04 | `/regalos-corporativos/kits-de-bienvenida/` con SKUs existentes (libreta, bolígrafo, drinkware, empaque) | Decisión de ruta (subruta vs sección) y selección revisada; sin precio conjunto. |
| C-05 | Restaurar el header fijo (quitar `position: relative` de `.header-accent-line`) y re-ajustar paddings de todas las plantillas | Decisión de diseño; requiere revisión visual de todas las plantillas. |
| C-06 | Cuenca/Ambato/Manta: pasar de `LocalBusiness` propio a `Service` con `provider` = `#localbusiness` | Datos GSC por página de esas ciudades (el export no las atribuye a Ecuador). |
| C-07 | Mirror local de imágenes de Cataprom | Permiso/licencia del proveedor. |
| C-08 | Dirección real o modelo de área de servicio (quitar "Norte de Quito") | Decisión del negocio (pendiente desde Fase 17). |
| C-09 | Precios/Offer/reseñas reales | Fuente operativa de precios y testimonios con permiso. |
| C-10 | Retirar los PNG originales de íconos y hero (~85 MB del deploy) | Confirmar en producción que las WebP/JPEG se ven bien. |

## Dueños de intención

Ver `reports/seo-improvement-2026-10-09/intent-map.csv`. Roles propuestos (hipótesis hasta tener GSC consulta→página):
`/articulos-promocionales/` catálogo amplio · `/regalos-corporativos/` selección de regalos · `/merchandising-corporativo/`
programa de marca · `/material-publicitario/` campañas y ferias · `/productos-promocionales-ecuador/` cobertura nacional.
No se fusionó ningún hub.
