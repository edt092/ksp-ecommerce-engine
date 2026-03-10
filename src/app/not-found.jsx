import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada | KS Promocionales',
  robots: {
    index: false,
    follow: false,
  },
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
