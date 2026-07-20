import Link from 'next/link';

// Navegación de paginación estática para categorías (Fase 9, plan-seo.md).
// Página 1 vive en /categorias/[slug]/, páginas siguientes en
// /categorias/[slug]/pagina/[n]/. Cada enlace es un <a href> real generado
// en el servidor — no depende de JS para ser rastreable.
export default function CategoryPagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pageUrl = (page: number) => (page <= 1 ? `${basePath}/` : `${basePath}/pagina/${page}/`);

  // Ventana corta de números de página alrededor de la actual, más
  // primera/última si quedan fuera de la ventana — evita listas larguísimas
  // en categorías con muchas páginas sin perder navegación directa.
  const windowStart = Math.max(1, currentPage - 2);
  const windowEnd = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];
  for (let p = windowStart; p <= windowEnd; p++) pages.push(p);

  return (
    <nav aria-label="Paginación de productos" className="flex items-center justify-center gap-1.5 pt-6">
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="px-3.5 py-2 text-sm font-semibold text-[#0F2178] border border-gray-200 rounded-lg hover:border-[#0F2178]/30 hover:bg-[#F8F9FC] transition-colors"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="px-3.5 py-2 text-sm font-semibold text-gray-300 border border-gray-100 rounded-lg cursor-not-allowed">
          ← Anterior
        </span>
      )}

      {windowStart > 1 && (
        <>
          <Link href={pageUrl(1)} className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-gray-500 rounded-lg hover:bg-[#F8F9FC] transition-colors">1</Link>
          {windowStart > 2 && <span className="px-1 text-gray-300">…</span>}
        </>
      )}

      {pages.map((p) => (
        p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className="w-9 h-9 flex items-center justify-center text-sm font-bold text-white bg-[#0F2178] rounded-lg"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-gray-500 rounded-lg hover:bg-[#F8F9FC] transition-colors"
          >
            {p}
          </Link>
        )
      ))}

      {windowEnd < totalPages && (
        <>
          {windowEnd < totalPages - 1 && <span className="px-1 text-gray-300">…</span>}
          <Link href={pageUrl(totalPages)} className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-gray-500 rounded-lg hover:bg-[#F8F9FC] transition-colors">{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="px-3.5 py-2 text-sm font-semibold text-[#0F2178] border border-gray-200 rounded-lg hover:border-[#0F2178]/30 hover:bg-[#F8F9FC] transition-colors"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="px-3.5 py-2 text-sm font-semibold text-gray-300 border border-gray-100 rounded-lg cursor-not-allowed">
          Siguiente →
        </span>
      )}
    </nav>
  );
}
