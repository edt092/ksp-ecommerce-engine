// Alternativas en la ficha de producto (docs/seo-improvement-2026-10-09, N02).
//
// Antes: los 4 primeros productos optimizados de la misma categoría, siempre
// los mismos. La auditoría competitiva midió dos bolígrafos con 224 páginas
// enlazándolos cada uno mientras la mayoría de fichas tenía 1 enlace entrante.
//
// Ahora: misma categoría, solo indexables, sin el propio producto ni otros
// con el mismo nombre visible (posibles duplicados). Se ordena por similitud
// de tipo de producto (palabras del nombre visible, con más peso a la
// primera, que suele ser el tipo: "Bolígrafo", "Mug", "Morral"…) y se
// desempata con un hash estable del par de slugs. Es determinista entre
// builds y reparte los enlaces por toda la categoría. No usa "más vendido"
// ni ningún dato que el catálogo no tenga.

import { displayName } from './product-display';

const STOPWORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'en', 'con', 'para', 'y', 'e', 'o', 'a', 'al', 'por', 'sin',
  'set', 'kit', 'x', 'ml', 'oz', 'gr', 'cm', 'mm', 'ii', 'iii', 'produccion', 'nacional', 'personalizado',
  'personalizada', 'eco', 'mini',
]);

function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

// FNV-1a de 32 bits: estable entre builds y plataformas.
function stableHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

interface RelatableProduct {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  is_ai_optimized?: boolean;
}

export function selectRelatedProducts<T extends RelatableProduct>(product: T, catalog: T[], limit = 8): T[] {
  const ownName = displayName(product).toLowerCase();
  const ownTokens = tokens(displayName(product));
  const ownType = ownTokens[0];

  return catalog
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.is_ai_optimized)
    .filter((p) => displayName(p).toLowerCase() !== ownName)
    .map((p) => {
      const candidate = tokens(displayName(p));
      const shared = candidate.filter((t) => ownTokens.includes(t)).length;
      const typeMatch = ownType && candidate[0] === ownType ? 2 : 0;
      return { p, score: shared + typeMatch, tie: stableHash(`${product.slug}|${p.slug}`) };
    })
    .sort((a, b) => b.score - a.score || a.tie - b.tie)
    .slice(0, limit)
    .map(({ p }) => p);
}
