// Site is Ecuador-only — single WhatsApp number, no country picker needed.
export const WA_NUMBER = '593999814838';

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function trackWhatsAppClick(context) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: context || 'general',
    });
  }
}
