import StorytellingHero from '@/components/StorytellingHero';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import PromoCarousel from '@/components/PromoCarousel';
import { Palette, Zap, Sparkles, MessageCircle, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

export const metadata = {
  title: 'Productos Promocionales Ecuador | Regalos Corporativos Quito y Guayaquil | KS',
  description: 'Productos promocionales Ecuador: artículos promocionales y regalos corporativos en Quito, Guayaquil y todo el país. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp!',
  verification: {
    google: 'TU_CODIGO_DE_VERIFICACION_AQUI',
  },
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
  },
  openGraph: {
    title: 'Productos Promocionales Ecuador | Regalos Corporativos Quito y Guayaquil | KS',
    description: 'Productos promocionales Ecuador: artículos promocionales y regalos corporativos en Quito, Guayaquil y todo el país. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp!',
    url: 'https://www.kronosolopromocionales.com/',
    siteName: 'KS Promocionales',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function HomePage() {
  // Get featured and bestseller products
  const featuredProducts = productsData.filter(p => p.featured || p.bestseller).slice(0, 6);

  // Get category info for products
  const getCategory = (categoryId) => {
    return categoriesData.find(c => c.id === categoryId);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'KS Promocionales',
    image: 'https://www.kronosolopromocionales.com/images/og-image.jpg',
    description: 'Productos promocionales Ecuador: artículos promocionales y regalos corporativos en Quito, Guayaquil y todo el país.',
    url: 'https://www.kronosolopromocionales.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC',
      addressLocality: 'Quito'
    },
    areaServed: [
      { '@type': 'City', name: 'Quito' },
      { '@type': 'City', name: 'Guayaquil' },
      { '@type': 'Country', name: 'Ecuador' }
    ],
    priceRange: '$$'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <StorytellingHero />

      {/* Promo Carousel Section */}
      <PromoCarousel />

      {/* Categories Section */}
      <CategoryGrid categories={categoriesData} />

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
            <div>
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Lo Más Destacado
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Productos Populares
              </h2>
              <p className="text-gray-600 max-w-xl text-base md:text-lg">
                Nuestros productos más populares que han ayudado a marcas a contar sus historias
              </p>
            </div>
            <Link
              href="/#categorias"
              className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors mt-4 md:mt-0"
            >
              Ver todos los productos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={getCategory(product.categoryId)}
              />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Ver todos los productos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Catálogos Digitales Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-soft border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Image Preview */}
                <div className="flex-shrink-0 order-2 lg:order-1">
                  <div className="relative">
                    <div className="w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                      <img
                        src="/images/catalogos-ksp/catalogo-a.png"
                        alt="Catálogo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
                  <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                    Catálogos Digitales
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Explora Nuestra Colección Completa
                  </h2>
                  <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                    Descubre nuestra colección completa de productos promocionales y encuentra la inspiración perfecta para tu marca. Catálogos actualizados con las últimas tendencias.
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/catalogos-digitales"
                      className="btn-primary"
                    >
                      <BookOpen className="w-5 h-5" />
                      Ver Catálogos
                    </Link>
                    <a
                      href="mailto:claudiagonzalez@kronosolopromocionales.com?subject=Solicitud de Catálogo Digital&body=Hola, me gustaría recibir información sobre sus catálogos digitales."
                      className="btn-outline"
                    >
                      Solicitar Información
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary-dark text-white overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-white/70 font-semibold text-sm uppercase tracking-wider mb-3">
              Nuestra Propuesta de Valor
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              ¿Por Qué Elegir KS Promocionales?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg">
              Somos tu aliado en productos promocionales en Ecuador. Atendemos Quito, Guayaquil y todo el país.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Diseño Personalizado',
                description: 'Tu visión, nuestra experiencia. Diseños sin límites para tu marca.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Entrega Rápida',
                description: 'Cotizaciones en 48h. Producción eficiente en todo Ecuador.',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Calidad Premium',
                description: 'Materiales de primera. Técnicas de personalización de alta durabilidad.',
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'Asesoría Directa',
                description: 'Atención personalizada por WhatsApp. Resolvemos todas tus dudas.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://wa.me/593999999999?text=Hola, quiero cotizar productos promocionales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotiza Ahora por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
