import Image from 'next/image';
import Link from 'next/link';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

// docs/ux-improvement-2026-10-09, UX-10. Antes: botón «Solicita tu Catálogo
// Ahora» con icono de descarga que ejecutaba un mailto (no descargaba nada) y
// las láminas se montaban con useEffect, fuera del HTML estático. Ahora el CTA
// describe lo que hace (abrir el correo), hay correo visible y WhatsApp como
// alternativa, y las láminas están en el HTML con un alt que dice qué son.
// No hay PDF descargable publicado: no se ofrece «Descargar» hasta que exista.

const QUOTE_EMAIL = 'claudiagonzalez@kronosolopromocionales.com';
const MAILTO = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent('Solicitud de catálogo digital')}&body=${encodeURIComponent('Hola, me gustaría recibir el catálogo digital vigente de KS Promocionales.')}`;

const CATALOGOS = [
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
    id: n,
    imagen: `/images/catalogos-ksp/Catalogo Temporada nav 2025_page-000${n}.jpg`,
    alt: `Catálogo de temporada navideña 2025 de KS Promocionales — página ${n} de 7`,
  })),
  ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map((letter, i) => ({
    id: 8 + i,
    imagen: `/images/catalogos-ksp/catalogo-${letter}.png`,
    alt: `Catálogo general de KS Promocionales — lámina ${i + 1} de 11`,
  })),
];

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

function ContactOptions({ variant }) {
  const dark = variant === 'dark';
  return (
    <div className="flex flex-col items-center gap-3">
      <a
        href={MAILTO}
        className={`inline-flex items-center gap-3 min-h-[48px] px-6 md:px-8 py-3 font-semibold rounded-lg transition-colors ${dark ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-primary hover:bg-gray-100'}`}
      >
        <MailIcon />
        Pedir catálogo por correo
      </a>
      <p className={`text-sm ${dark ? 'text-gray-300' : 'text-white/80'}`}>
        Se abrirá tu programa de correo. Si no se abre, escríbenos a{' '}
        <span className="font-semibold select-all">{QUOTE_EMAIL}</span> o{' '}
        <a
          href={buildWhatsAppUrl('Hola, me gustaría recibir el catálogo digital vigente de KS Promocionales.')}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
        >
          pídelo por WhatsApp
        </a>.
      </p>
    </div>
  );
}

export default function CatalogosClient() {
  return (
    <>
      {/* Breadcrumb (sin espaciador: el header ocupa espacio en el flujo,
          ver docs/seo-improvement-2026-10-09/decisions.md D-07) */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary font-medium" aria-current="page">Catálogos Digitales</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              Catálogos Digitales
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto px-4 mb-8">
              Hojea nuestros catálogos aquí mismo. Si prefieres recibir el catálogo vigente, pídelo por correo o WhatsApp.
            </p>
            <ContactOptions variant="light" />
          </div>
        </div>
      </section>

      {/* Catalogos Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <h2 className="font-bold text-[#0A0A23] text-xl">Catálogo de temporada navideña 2025 (7 páginas)</h2>
            {CATALOGOS.map((catalogo, index) => (
              <div key={catalogo.id}>
                {catalogo.id === 8 && <h2 className="font-bold text-[#0A0A23] text-xl mb-6 md:mb-8 pt-4">Catálogo general (11 láminas)</h2>}
                <div className="bg-white border border-gray-200 overflow-hidden hover:border-primary transition-all duration-300">
                  <div className="relative w-full aspect-[8.5/11] bg-gray-100">
                    <Image
                      src={catalogo.imagen}
                      alt={catalogo.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                      priority={index < 1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-4">
            ¿Te interesa algún producto?
          </h2>
          <p className="text-gray-300 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base px-4">
            Te enviamos el catálogo vigente y te ayudamos a elegir. También puedes{' '}
            <Link href="/buscar/" className="underline font-semibold">buscar en el catálogo web</Link>.
          </p>
          <ContactOptions variant="dark" />
        </div>
      </section>
    </>
  );
}
