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

// Verificado contra data/products.json: 2185 productos totales, 2101 con
// is_ai_optimized=true (indexables/publicables). Recalcular tras cambios
// grandes de catálogo.
export const catalogCountLabel = '+2.100 productos';
export const catalogCountLabelLong = 'Más de 2.100 productos promocionales';
export const catalogCountLabelReferences = 'Más de 2.100 referencias disponibles en nuestro catálogo digital';

export const responseTimeLabel = 'Respuesta en 48h';
