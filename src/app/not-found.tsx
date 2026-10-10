import Link from 'next/link';

// Next 14 ya inyecta <meta name="robots" content="noindex"> en la 404; esta
// directiva debe ser coherente con ella (antes: "noindex, nofollow" junto a
// la automática). alternates/openGraph/twitter vacíos o propios para no
// heredar del layout la canonical, el hreflang y la URL del home.
export const metadata = {
  title: 'Página no encontrada | KS Promocionales',
  description: 'La página que buscas no existe o fue movida.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {},
  openGraph: { title: 'Página no encontrada | KS Promocionales', siteName: 'KS Promocionales' },
  twitter: { card: 'summary', title: 'Página no encontrada | KS Promocionales' },
};

export default function NotFound() {
  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]"></div>

      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La página que buscas no existe o fue movida. Explora nuestro catálogo de productos promocionales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
