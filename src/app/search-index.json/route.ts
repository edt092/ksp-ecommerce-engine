// Índice ligero del catálogo publicado para el buscador y la lista de
// cotización (docs/ux-improvement-2026-10-09, UX-06/UX-07). Se genera en el
// build como archivo estático /search-index.json (output: 'export') y solo se
// descarga en /buscar/ y /cotizacion/; nunca va en el bundle de otras páginas.
// Campos mínimos: slug, nombre visible, referencia, categoría e imagen.

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import { displayName } from '@/lib/product-display';
import { categoryIconSrc } from '@/lib/category-icons';

export const dynamic = 'force-static';

export function GET() {
  const categories = categoriesData.map((c) => ({ id: c.id, slug: c.slug, name: c.name, icon: categoryIconSrc(c) }));
  const products = productsData
    .filter((p) => p.is_ai_optimized)
    .map((p) => ({
      s: p.slug,
      n: displayName(p),
      r: (p.slug.match(/-(\d+)$/) || [])[1] || '',
      c: p.categoryId,
      i: p.images?.[0] || '',
    }));
  return Response.json({ v: 1, categories, products });
}
