'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroBanner from '@/components/HeroBanner';
import BenefitsBar from '@/components/BenefitsBar';
import CategorySidebar from '@/components/CategorySidebar';
import ProductTabs from '@/components/ProductTabs';
import QuickViewModal from '@/components/QuickViewModal';

import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const getCategory = (categoryId) => {
    return categoriesData.find(c => c.id === categoryId);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'KSPromocionales',
            image: 'https://www.kronosolopromocionales.com/images/og-image.jpg',
            description: 'Productos promocionales Ecuador: artículos promocionales y regalos corporativos.',
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
          })
        }}
      />

      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]"></div>

      {/* Main Content with Sidebar Layout */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <CategorySidebar categories={categoriesData} />
            </div>

            {/* Hero Banner */}
            <div className="flex-1">
              <HeroBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Excellent Rating Section */}
      <section className="py-8 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-serif font-bold text-secondary">EXCELENTE</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">Clientes satisfechos en todo Ecuador</span>
            </div>
            <a
              href="https://wa.me/593999814838"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-semibold text-sm hover:text-primary transition-colors"
            >
              Déjanos tu opinión →
            </a>
          </div>
        </div>
      </section>

      {/* Products with Tabs */}
      <ProductTabs
        products={productsData}
        categories={categoriesData}
        onQuickView={handleQuickView}
      />

      {/* Categories Grid Section */}
      <section id="categorias" className="py-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
              <span className="border-b-2 border-secondary pb-1">Explora por Categoría</span>
            </h2>
            <p className="text-gray-500">Encuentra el producto perfecto para tu marca</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesData.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group relative bg-white border border-gray-200 hover:border-primary overflow-hidden transition-all"
              >
                <div className="aspect-square relative">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4 text-center border-t border-gray-100">
                  <h3 className="font-semibold text-secondary text-sm uppercase tracking-wide group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {category.productCount} productos
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors"
            >
              Ver todas las categorías
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Digital Catalogs Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="aspect-[4/3] relative">
                <img
                  src="/images/catalogos-ksp/catalogo-a.png"
                  alt="Catálogo Digital"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Catálogos Digitales
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-secondary mt-2 mb-4">
                Explora Nuestra<br />Colección Completa
              </h2>
              <p className="text-gray-600 mb-6">
                Descubre nuestra colección completa de productos promocionales y encuentra
                la inspiración perfecta para tu marca. Catálogos actualizados con las últimas tendencias.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/catalogos-digitales"
                  className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 font-semibold hover:bg-secondary-light transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Ver Catálogos
                </Link>
                <a
                  href="https://wa.me/593999814838?text=Hola, me gustaría recibir información sobre sus catálogos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 font-semibold hover:bg-secondary hover:text-white transition-colors"
                >
                  Solicitar Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary via-secondary to-secondary-dark text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-light rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-primary/30">
              Nuestra Promesa
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
              ¿Por Qué <span className="text-primary">Elegirnos</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tu aliado estratégico en productos promocionales en Ecuador.
              Más de <span className="text-white font-semibold">500+ empresas</span> confían en nosotros.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: 'Diseño Personalizado',
                description: 'Tu visión, nuestra experiencia. Diseños únicos sin límites para potenciar tu marca.',
                highlight: '100% a medida',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Entrega Rápida',
                description: 'Cotizaciones en 48h máximo. Producción y envío eficiente a todo Ecuador.',
                highlight: '48h respuesta',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Calidad Premium',
                description: 'Materiales de primera calidad. Alta durabilidad y acabados profesionales garantizados.',
                highlight: 'Garantía total',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Asesoría Directa',
                description: 'Atención personalizada por WhatsApp. Estamos siempre disponibles para ti.',
                highlight: 'Respuesta inmediata',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Highlight Badge */}
                <span className="absolute -top-3 left-6 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                  {feature.highlight}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 md:mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm mb-1">¿Listo para impulsar tu marca?</p>
                <p className="text-white font-semibold text-lg">Cotiza sin compromiso</p>
              </div>
              <a
                href="https://wa.me/593999814838?text=Hola, quiero cotizar productos promocionales"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#25D366]/25"
              >
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotiza Ahora por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        category={quickViewProduct ? getCategory(quickViewProduct.categoryId) : null}
        isOpen={!!quickViewProduct}
        onClose={closeQuickView}
      />
    </>
  );
}
