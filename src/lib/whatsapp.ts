import { displayName } from './product-display';

// Site is Ecuador-only — single WhatsApp number, no country picker needed.
export const WA_NUMBER = '593999814838';
export const SITE_URL = 'https://www.kronosolopromocionales.com';

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Referencia del proveedor: sufijo numérico del slug, que coincide con el id
// de imagen de Cataprom en los 2.008 productos que lo tienen (verificado
// 2026-10-09). Los 92 slugs sin sufijo no tienen referencia publicable.
export function productReference(product) {
  const match = product?.slug?.match(/-(\d+)$/);
  return match ? match[1] : null;
}

// Mensaje de cotización por producto (docs/seo-improvement-2026-10-09, P03).
// Usa el nombre visible, la referencia y el enlace, y deja los datos que el
// asesor necesita para cotizar como campos a completar. Sustituye al campo
// whatsappMessage de products.json, que repetía el nombre crudo del
// proveedor ("… Oferta", "… Nuevo[más]").
export function buildProductQuoteMessage(product) {
  const ref = productReference(product);
  return [
    `Hola, quiero cotizar: ${displayName(product)}${ref ? ` (ref. ${ref})` : ''}`,
    `${SITE_URL}/productos/${product.slug}/`,
    'Cantidad: ',
    'Ciudad de entrega: ',
    'Fecha requerida: ',
    'Logo/arte o técnica (si la conoces): ',
  ].join('\n');
}

// Evento GA4 existente `whatsapp_click`. Acepta el contexto antiguo (string)
// o un objeto con datos estables y no personales: tipo de página, ubicación
// del botón, referencia de producto y categoría. Solo se envía si gtag existe;
// el consentimiento lo sigue gobernando Consent Mode (src/app/layout.tsx).
export function trackWhatsAppClick(context) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const details = typeof context === 'string' || context == null ? { label: context } : context;
  window.gtag('event', 'whatsapp_click', {
    event_category: 'engagement',
    event_label: details.label || 'general',
    ...(details.pageType && { page_type: details.pageType }),
    ...(details.placement && { placement: details.placement }),
    ...(details.productRef && { product_ref: details.productRef }),
    ...(details.category && { product_category: details.category }),
  });
}
