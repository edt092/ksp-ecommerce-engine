// Fase 8 (plan-seo.md) — infraestructura de testimonios reales.
//
// Auditoría: no existe evidencia interna ni pública que respalde la
// afirmación "+1.000 empresas confían en KS" que aparecía en el home
// (retirada de src/app/HomePageClient.tsx). El plan prohíbe sustituirla
// por otra cifra inventada y prohíbe testimonios ficticios.
//
// Por eso data/testimonials.json todavía NO existe: publicarlo vacío o
// con contenido inventado está explícitamente prohibido por el plan. La
// recolección real es una acción humana (ver
// docs/review-collection-workflow.md), no automatizable. Cuando el
// negocio autorice el primer testimonio real, crear ese archivo como un
// array de Testimonial[] con este mismo shape — TestimonialsSection lo
// mostrará automáticamente sin más cambios de código.

export interface Testimonial {
  clientName: string;
  company: string;
  role: string;
  quote: string;
  /** Entero de 1 a 5. */
  rating: number;
  /** ISO 8601, p. ej. "2026-08-01". */
  date: string;
  /** Debe ser true (consentimiento explícito) para poder publicarse. */
  permission: boolean;
  /** Slugs de data/products.json relacionados con el testimonio, si aplica. */
  relatedProducts?: string[];
  /** Ruta en /public al logo del cliente, solo si autorizó su uso. */
  logo?: string;
  /** Canal real de recolección: "whatsapp", "email", etc. */
  source: string;
}

export function getPublishableTestimonials(testimonials: Testimonial[]): Testimonial[] {
  return testimonials.filter((t) => t.permission === true);
}
