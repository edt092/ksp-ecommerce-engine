// Nombre visible de un producto (docs/seo-improvement-2026-10-09, tarea P01).
//
// data/products.json conserva el nombre del proveedor tal cual llega del
// scraping, con sufijos promocionales ("Oferta", "Nuevo", "- Precio Bomba") y
// restos del enlace "ver más" ("[más]"). En un catálogo sin precios públicos
// "Oferta" es engañoso, y todos ellos se filtraban al H1, alt, ItemList y
// mensaje de WhatsApp.
//
// Solo se quitan esos tokens cuando están al FINAL del nombre (206 de 2.100
// productos, verificado 2026-10-09); nunca dentro de otras palabras. El campo
// `name` del proveedor, el slug, el id y el SKU no se modifican.

const TRAILING_SCRAPE_ARTIFACT = /\s*\[más\]\s*$/i;
const TRAILING_PROMO_TOKEN = /(?:\s*[-–]\s*|\s+)(?:oferta|nuevo|precio bomba)\s*$/i;

export function displayName(nameOrProduct: string | { name?: string } | null | undefined): string {
  const raw = typeof nameOrProduct === 'string' ? nameOrProduct : nameOrProduct?.name ?? '';
  let name = raw.replace(TRAILING_SCRAPE_ARTIFACT, '').trim();
  let previous: string;
  do {
    previous = name;
    name = name.replace(TRAILING_PROMO_TOKEN, '').trim();
  } while (name !== previous);
  return name || raw.trim();
}

// Solo los campos que usa ProductCard. ProductCard es un componente cliente:
// todo lo que recibe se serializa en el payload RSC del HTML. Pasar el
// producto completo (story, seoKeywords, features…) sumaba ~30 KB por ficha
// con 8 alternativas.
export function toCardProduct<T extends { id: string; slug: string; name: string; categoryId: string; images?: string[]; bestseller?: boolean; featured?: boolean }>(p: T) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    images: p.images?.slice(0, 1) ?? [],
    ...(p.bestseller && { bestseller: true }),
    ...(p.featured && { featured: true }),
  };
}

// Los textos SEO generados (seoTitle, seoDescription, shortDescription)
// repiten el token del nombre ("Organizador Multiusos Link Nuevo
// Personalizado | Ecuador"). Solo para productos cuyo nombre tiene un token
// promocional, se quita "Oferta"/"Nuevo" capitalizado cuando sigue a una
// palabra (posición de nombre propio) o "-oferta"/"-nuevo" con guion.
// "oferta" en minúscula es el sustantivo común ("cotiza tu oferta") y se
// conserva. Verificado 2026-10-09: corrige 104/104 seoTitle, 52
// seoDescription y 29 shortDescription; sin falsos positivos en la muestra.
const PROMO_TOKEN_INLINE = /(?<=[\p{L}\p{N}'")])\s*(?:(?:[-–]\s*)?(?:Oferta|OFERTA|Nuevo|NUEVO)|[-–]\s*(?:oferta|nuevo))(?![\p{L}])/gu;

export function cleanProductText(text: string | null | undefined, product: { name?: string }): string {
  if (!text) return text ?? '';
  const raw = (product?.name ?? '').trim();
  if (displayName(product) === raw) return text;
  return text
    .replace(PROMO_TOKEN_INLINE, '')
    .replace(/ {2,}/g, ' ')
    .replace(/ +([,.:])/g, '$1');
}
