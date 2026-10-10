// Selección de productos para landings temáticas (N01).
//
// Criterio deliberadamente estricto: el NOMBRE visible empieza por el tipo de
// producto ("Audífonos…", "Speaker…", "Soporte para móviles…"). Así no entran
// accesorios que solo mencionan la palabra ("Accesorio en silicona para gafas
// y audífonos"). Solo productos publicados, sin nombres visibles repetidos
// (pares pendientes de revisión de duplicados), en el orden estable del
// catálogo.

import productsData from '@/data/products.json';
import { displayName } from './product-display';

export function selectLandingProducts(namePattern: RegExp, limit = 12) {
  const seen = new Set<string>();
  const result = [];
  for (const product of productsData) {
    if (!product.is_ai_optimized) continue;
    const name = displayName(product);
    if (!namePattern.test(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(product);
    if (result.length >= limit) break;
  }
  return result;
}

export const HEADPHONES_PATTERN = /^aud[ií]fonos?\b/i;
export const SPEAKERS_PATTERN = /^(speaker|parlante)s?\b/i;
export const PHONE_STANDS_PATTERN = /^soporte\b.*\b(m[oó]vil|m[oó]viles|celular|tablet|tablets|magn[eé]tico)\b/i;
