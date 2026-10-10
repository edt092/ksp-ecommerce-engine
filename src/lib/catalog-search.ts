// Búsqueda y orden del catálogo en el cliente (docs/ux-improvement-2026-10-09,
// UX-02/UX-07). Funciones puras sobre /search-index.json.
//
// Flujo: consulta validada -> filtrar (texto y categoría) -> ordenar sobre el
// conjunto completo -> paginar. Nunca se ordena solo la página visible.

export interface IndexProduct {
  s: string; // slug
  n: string; // nombre visible
  r: string; // referencia del proveedor ('' si no hay)
  c: string; // id de categoría
  i: string; // imagen
}

export type SortKey = 'relevancia' | 'nombre_asc' | 'nombre_desc';
export const SORT_KEYS: SortKey[] = ['relevancia', 'nombre_asc', 'nombre_desc'];

// Sinónimos de uso común en Ecuador. Cada grupo se trata como equivalente.
const SYNONYM_GROUPS = [
  ['boligrafo', 'esfero', 'lapicero', 'pluma', 'roller'],
  ['tomatodo', 'botilito', 'botella', 'cantimplora'],
  ['mug', 'taza', 'jarro', 'jarra'],
  ['termo', 'termico'],
  ['gorra', 'cachucha', 'visera'],
  ['memoria', 'usb', 'pendrive', 'flash'],
  ['mochila', 'morral', 'backpack'],
  ['parlante', 'speaker', 'altavoz', 'bocina'],
  ['audifono', 'audifonos', 'auricular', 'auriculares'],
  ['powerbank', 'cargador', 'bateria', 'pila'],
  ['libreta', 'cuaderno', 'agenda', 'notebook'],
  ['camiseta', 'polo', 'playera'],
  ['bolsa', 'tote', 'funda'],
];
const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) for (const w of group) SYNONYMS.set(w, group);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/power\s+bank/g, 'powerbank')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function variants(token: string): string[] {
  const singular = token.length > 4 && token.endsWith('es') ? token.slice(0, -2) : token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token;
  return [...new Set([token, singular, ...(SYNONYMS.get(token) || []), ...(SYNONYMS.get(singular) || [])])];
}

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

export function searchCatalog(products: IndexProduct[], query: string, categoryId: string | null, sort: SortKey): IndexProduct[] {
  const tokens = normalize(query).split(' ').filter(Boolean).slice(0, 8);
  const pool = categoryId ? products.filter((p) => p.c === categoryId) : products;

  let results: { p: IndexProduct; score: number; order: number }[];
  if (tokens.length === 0) {
    results = pool.map((p, order) => ({ p, score: 0, order }));
  } else {
    results = [];
    pool.forEach((p, order) => {
      const words = normalize(p.n).split(' ');
      let score = 0;
      for (const token of tokens) {
        if (p.r && token === p.r) { score += 10; continue; }
        const options = variants(token);
        const hit = words.some((w) => options.some((o) => w.startsWith(o)));
        if (!hit) return; // todas las palabras de la consulta deben coincidir
        score += options.some((o) => words[0].startsWith(o)) ? 3 : 1;
      }
      results.push({ p, score, order });
    });
  }

  if (sort === 'nombre_asc' || sort === 'nombre_desc') {
    const dir = sort === 'nombre_asc' ? 1 : -1;
    results.sort((a, b) => dir * collator.compare(a.p.n, b.p.n) || a.p.s.localeCompare(b.p.s));
  } else {
    // "Relevancia": coincidencia de la consulta y, a igualdad, el orden
    // editorial del catálogo. No es un ranking algorítmico ni de ventas.
    results.sort((a, b) => b.score - a.score || a.order - b.order);
  }
  return results.map((r) => r.p);
}
