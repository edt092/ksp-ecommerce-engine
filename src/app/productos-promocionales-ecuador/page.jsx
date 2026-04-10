import Link from 'next/link';
import { MapPin, ArrowRight, Package, Truck, Award } from 'lucide-react';
import { ecuador } from '@/data/geo-data';

export const metadata = {
  title: ecuador.seoTitle,
  description: ecuador.seoDescription,
  keywords: [
    'productos promocionales ecuador',
    'regalos corporativos ecuador',
    'artículos publicitarios ecuador',
    'merchandising empresarial ecuador',
    'productos promocionales quito',
    'productos promocionales guayaquil',
    'productos promocionales cuenca',
    'productos promocionales manta',
    'productos promocionales ambato',
  ],
  openGraph: {
    title: ecuador.seoTitle,
    description: ecuador.seoDescription,
    type: 'website',
    locale: 'es_EC',
    url: 'https://www.kronosolopromocionales.com/productos-promocionales-ecuador',
    siteName: 'KS Promocionales',
  },
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/productos-promocionales-ecuador/',
    languages: {
      'es-EC': 'https://www.kronosolopromocionales.com/productos-promocionales-ecuador/',
      'es-CO': 'https://www.kronosolopromocionales.com/productos-promocionales-colombia/',
      'x-default': 'https://www.kronosolopromocionales.com/',
    },
  },
};

const CATEGORIAS = [
  { nombre: 'Tecnología', slug: 'tecnologia' },
  { nombre: 'Mugs y Termos', slug: 'mugs' },
  { nombre: 'Oficina', slug: 'oficina' },
  { nombre: 'Escritura', slug: 'escritura' },
  { nombre: 'Deportes', slug: 'deportes' },
  { nombre: 'Ecología', slug: 'ecologia' },
  { nombre: 'Llaveros', slug: 'llaveros' },
  { nombre: 'Novedades', slug: 'novedades' },
];

export default function EcuadorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.kronosolopromocionales.com/#localbusiness',
    areaServed: [
      { '@type': 'Country', name: 'Ecuador' },
      ...ecuador.ciudades.map(c => ({ '@type': 'City', name: c.nombre })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white pt-32 pb-20 lg:pb-28">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <MapPin size={18} />
            <span className="text-sm font-medium">Cobertura Nacional en Ecuador</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {ecuador.h1}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {ecuador.intro}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Ver Catálogo Completo
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#ciudades"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Explorar por Ciudad
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-gray-400">Productos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <div className="text-gray-400">Ciudades Principales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">48h</div>
              <div className="text-gray-400">Respuesta Rápida</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-400">Personalizables</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ciudades */}
      <section id="ciudades" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Promocionales por Ciudad
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra artículos promocionales en las principales ciudades del Ecuador con atención personalizada y entrega directa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecuador.ciudades.map((ciudad) => (
              <Link
                key={ciudad.slug}
                href={`/productos-promocionales-ecuador/${ciudad.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {ciudad.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {ciudad.intro.substring(0, 110)}…
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                      <span>Ver productos</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir KS Promocionales en Ecuador?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Amplio Catálogo</h3>
              <p className="text-gray-600">
                Más de 1,200 productos promocionales en tecnología, mugs, oficina, ecología, textiles y mucho más.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Envíos a Todo Ecuador</h3>
              <p className="text-gray-600">
                Cobertura nacional con entrega en Quito, Guayaquil, Cuenca, Manta, Ambato y cualquier ciudad del país.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Trabajamos con los mejores proveedores para garantizar artículos de alta calidad con personalización profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorías Populares en Ecuador
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}/`}
                className="bg-gray-100 hover:bg-primary/10 text-gray-900 hover:text-primary px-6 py-4 rounded-xl text-center font-medium transition-colors"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para impulsar tu marca en Ecuador?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Contáctanos hoy y recibe una cotización personalizada para tus productos promocionales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-colors"
            >
              Explorar Productos
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://wa.me/593999814838?text=Hola%2C%20me%20interesa%20cotizar%20productos%20promocionales%20para%20Ecuador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
