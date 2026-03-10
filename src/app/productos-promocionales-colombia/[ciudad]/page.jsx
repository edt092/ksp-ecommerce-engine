import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { colombia, getCiudadBySlug } from '@/data/geo-data';

export function generateStaticParams() {
  return colombia.ciudades.map((ciudad) => ({
    ciudad: ciudad.slug,
  }));
}

export async function generateMetadata({ params }) {
  const ciudad = getCiudadBySlug('productos-promocionales-colombia', params.ciudad);

  if (!ciudad) {
    return { title: 'Ciudad no encontrada' };
  }

  return {
    title: ciudad.seoTitle,
    description: ciudad.seoDescription,
    keywords: [
      `productos promocionales ${ciudad.nombre.toLowerCase()}`,
      `regalos corporativos ${ciudad.nombre.toLowerCase()}`,
      `artículos publicitarios ${ciudad.nombre.toLowerCase()}`,
      `merchandising ${ciudad.nombre.toLowerCase()}`,
      'productos promocionales colombia',
    ],
    openGraph: {
      title: ciudad.seoTitle,
      description: ciudad.seoDescription,
      type: 'website',
      locale: 'es_CO',
      url: `https://www.kronosolopromocionales.com/productos-promocionales-colombia/${ciudad.slug}`,
      siteName: 'KS Promocionales',
    },
    alternates: {
      canonical: `https://www.kronosolopromocionales.com/productos-promocionales-colombia/${ciudad.slug}`,
    },
  };
}

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

export default function CiudadColombiaPage({ params }) {
  const ciudad = getCiudadBySlug('productos-promocionales-colombia', params.ciudad);

  if (!ciudad) {
    notFound();
  }

  const otrasCiudades = colombia.ciudades.filter(c => c.slug !== params.ciudad);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `KS Promocionales ${ciudad.nombre}`,
    description: ciudad.seoDescription,
    url: `https://www.kronosolopromocionales.com/productos-promocionales-colombia/${ciudad.slug}`,
    areaServed: {
      '@type': 'City',
      name: ciudad.nombre,
      containedInPlace: { '@type': 'Country', name: 'Colombia' },
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'KS Promocionales',
      url: 'https://www.kronosolopromocionales.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 pt-28 pb-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/productos-promocionales-colombia" className="hover:text-primary transition-colors">Colombia</Link>
            <span>/</span>
            <span className="text-primary font-medium">{ciudad.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <Link
            href="/productos-promocionales-colombia"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a Colombia
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <MapPin size={24} />
            </div>
            <span className="text-lg text-white/90">Colombia</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-3xl">
            {ciudad.h1}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">
            {ciudad.intro}
          </p>
          <a
            href={`https://wa.me/593999814838?text=Hola%2C%20me%20interesa%20cotizar%20productos%20promocionales%20en%20${encodeURIComponent(ciudad.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
          >
            Cotizar Ahora en {ciudad.nombre}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Características */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ciudad.caracteristicas.map((caracteristica, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">{caracteristica}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Promocionales Disponibles en {ciudad.nombre}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestra selección de artículos publicitarios con personalización de tu logo y envío directo a {ciudad.nombre}.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className="group bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary text-gray-900 hover:text-primary px-6 py-5 rounded-xl text-center font-medium transition-all"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-colors"
            >
              Ver Catálogo Completo
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Otras ciudades */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Otras Ciudades en Colombia
            </h2>
            <p className="text-gray-600">
              También brindamos servicio de productos promocionales en otras ciudades colombianas.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otrasCiudades.map((otraCiudad) => (
              <Link
                key={otraCiudad.slug}
                href={`/productos-promocionales-colombia/${otraCiudad.slug}`}
                className="bg-white border border-gray-200 hover:border-primary rounded-xl p-4 text-center transition-all hover:shadow-lg group"
              >
                <MapPin className="mx-auto text-primary mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">{otraCiudad.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Necesitas productos promocionales en {ciudad.nombre}?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Contáctanos ahora y recibe atención personalizada para tu empresa en {ciudad.nombre}.
          </p>
          <a
            href={`https://wa.me/593999814838?text=Hola%2C%20me%20interesa%20cotizar%20productos%20promocionales%20en%20${encodeURIComponent(ciudad.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
          >
            Contactar por WhatsApp
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </>
  );
}
