import QuoteClient from './QuoteClient';

// Lista de cotización (docs/ux-improvement-2026-10-09, UX-06 MVP sin backend).
// noindex y fuera del sitemap: es una herramienta personal, no una página de
// destino.
export const metadata = {
  title: 'Mi cotización | KS Promocionales',
  description: 'Prepara una sola solicitud de cotización con varios productos y envíala por WhatsApp o correo.',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  alternates: { canonical: 'https://www.kronosolopromocionales.com/cotizacion/' },
};

export default function CotizacionPage() {
  return (
    <section className="bg-white pt-8 md:pt-12 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-black text-[#0A0A23] text-3xl md:text-4xl mb-2" style={{ letterSpacing: '-0.03em' }}>
          Mi cotización
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Reúne aquí los productos que te interesan, indica cantidades y envíanos la lista completa en un solo mensaje.
        </p>
        <QuoteClient />
      </div>
    </section>
  );
}
