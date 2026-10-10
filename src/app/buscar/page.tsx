import SearchClient from './SearchClient';

// Buscador del catálogo (docs/ux-improvement-2026-10-09, UX-02/UX-07).
// noindex,follow y fuera del sitemap: las combinaciones de búsqueda/orden no
// son páginas de destino; las categorías siguen siendo las URLs indexables.
export const metadata = {
  title: 'Buscar productos promocionales | KS Promocionales',
  description: 'Busca en el catálogo de KS Promocionales por producto, material o referencia y ordena por nombre.',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  alternates: { canonical: 'https://www.kronosolopromocionales.com/buscar/' },
};

export default function BuscarPage() {
  return (
    <section className="bg-white pt-8 md:pt-12 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-black text-[#0A0A23] text-3xl md:text-4xl mb-2" style={{ letterSpacing: '-0.03em' }}>
          Buscar productos
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Busca por tipo de producto, material o número de referencia. Puedes filtrar por categoría y ordenar por nombre.
        </p>
        <SearchClient />
      </div>
    </section>
  );
}
