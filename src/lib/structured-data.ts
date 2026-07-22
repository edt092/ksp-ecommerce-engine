// offers.md — corrige la incidencia de Search Console "Debe especificarse
// offers, review o aggregateRating".
//
// Causa raíz: páginas de categoría/listado anidaban cada producto como
// '@type': 'Product' dentro de un ItemList, y 3 landings hacían lo mismo
// con categorías. Google exige que todo Product tenga name y al menos uno
// de offers/review/aggregateRating; ni las categorías son productos
// concretos ni hay oferta pública (el negocio cotiza solo por WhatsApp,
// sin precio publicado) ni reseñas reales (data/testimonials.json no
// existe todavía — ver src/lib/testimonials.ts).
//
// Esta utilidad centraliza dos construcciones para no repetir el mismo
// patrón incompleto en cada página:
// - un ItemList neutral (ListItem con name/url, sin Product anidado);
// - un Product válido solo cuando existe una fuente real de offers/review.

export interface NeutralListEntry {
  name: string;
  url: string;
}

export function buildNeutralItemList(params: {
  name: string;
  description?: string;
  url: string;
  entries: NeutralListEntry[];
  numberOfItems?: number;
}) {
  const { name, description, url, entries } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    url,
    numberOfItems: params.numberOfItems ?? entries.length,
    itemListElement: entries.map((entry, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: entry.name,
      url: entry.url,
    })),
  };
}

interface ProductOfferSource {
  price: number;
  priceCurrency: string;
  availability: string;
}

interface ProductReviewSource {
  author: string;
  reviewBody: string;
  ratingValue: number;
  bestRating?: number;
}

export interface ProductSchemaInput {
  name: string;
  description?: string;
  image?: string[];
  sku?: string;
  brandName?: string;
  url: string;
  /** Solo se incluye si existe una oferta real, vigente y visible en la página. */
  offer?: ProductOfferSource;
  /** Solo se incluyen si son reseñas reales, verificadas y visibles en la página. */
  reviews?: ProductReviewSource[];
}

/**
 * Devuelve el JSON-LD de Product solo si hay offers o reviews reales
 * (cumple la exigencia de Google); si no hay ninguna fuente válida,
 * devuelve null y la página no debe emitir Product en absoluto.
 */
export function buildProductJsonLd(input: ProductSchemaInput) {
  const hasOffer = !!input.offer;
  const hasReviews = !!input.reviews && input.reviews.length > 0;

  if (!hasOffer && !hasReviews) return null;

  const aggregateRating = hasReviews
    ? {
        '@type': 'AggregateRating',
        ratingValue: (
          input.reviews!.reduce((sum, r) => sum + r.ratingValue, 0) / input.reviews!.length
        ).toFixed(1),
        reviewCount: input.reviews!.length,
        bestRating: input.reviews![0].bestRating ?? 5,
      }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image?.length ? { image: input.image } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.brandName ? { brand: { '@type': 'Brand', name: input.brandName } } : {}),
    url: input.url,
    ...(hasOffer
      ? {
          offers: {
            '@type': 'Offer',
            price: input.offer!.price,
            priceCurrency: input.offer!.priceCurrency,
            availability: input.offer!.availability,
            url: input.url,
          },
        }
      : {}),
    ...(hasReviews
      ? {
          review: input.reviews!.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            reviewBody: r.reviewBody,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.ratingValue,
              bestRating: r.bestRating ?? 5,
            },
          })),
          ...(aggregateRating ? { aggregateRating } : {}),
        }
      : {}),
  };
}
