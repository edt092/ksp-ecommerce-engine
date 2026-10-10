// Datos públicos verificables y centralizados. No incluir aquí nada sensible
// (direcciones, teléfonos internos, claves). Cada valor debe poder verificarse
// contra el repositorio (p. ej. data/products.json) o contra información
// pública ya confirmada por el negocio.
//
// El catálogo cambia con frecuencia (pipeline de enriquecimiento diario), por
// eso el copy comercial usa una cifra redondeada por debajo del conteo real
// en vez de un número exacto que quedaría desactualizado.

export const brandName = 'KS Promocionales';
export const country = 'Ecuador';
export const serviceArea = 'Ecuador';

// Verificado contra data/products.json el 2026-10-09: 2.100 productos en el
// catálogo, 2.036 con is_ai_optimized=true (los únicos publicados e
// indexables). La etiqueta describe lo publicado, no el total interno:
// "más de 2.100" ya no era cierto. Recalcular tras cambios grandes de catálogo.
export const catalogCountLabel = '+2.000 productos';
export const catalogCountLabelLong = 'Más de 2.000 productos promocionales';
export const catalogCountLabelReferences = 'Más de 2.000 referencias disponibles en nuestro catálogo digital';

// SLA de respuesta ya publicado en el sitio (48 h). Es tiempo de RESPUESTA a
// una solicitud de cotización, no de producción ni de entrega. Pendiente de
// confirmación operativa: docs/seo-improvement-2026-10-09/business-data-needed.md.
export const responseTimeLabel = 'Respuesta en 48h';
export const responseTimeSentence = 'Respondemos tu solicitud de cotización en un máximo de 48 horas.';

// Mínimos y plazos: el sitio publicaba cifras contradictorias entre páginas
// (mugs desde 24 o desde 100 unidades; producción en 5–15, 10–15, 10–20 o
// 7–21 días hábiles) sin fuente operativa. Hasta que el negocio confirme
// valores por técnica/modelo, se publica la dependencia real en vez de un
// número. Se usa en el contenido visible y en el FAQPage de cada página.
export const minimumOrderAnswer =
  'El mínimo depende del modelo y de la técnica de personalización. Te lo confirmamos en la cotización, junto con las opciones disponibles para tu cantidad.';
export const leadTimeAnswer =
  'El plazo de producción depende de la técnica de personalización, de la cantidad y de la aprobación del arte digital. Te confirmamos la fecha en la cotización; el envío a tu ciudad se suma a ese plazo.';
export const quoteChecklist = [
  'Producto o referencia',
  'Cantidad aproximada',
  'Ciudad de entrega',
  'Fecha en la que lo necesitas',
  'Logo o arte, y técnica si ya la conoces',
];
