'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0001.jpg',
    title: 'Catálogo Navidad 2025',
    subtitle: 'Regalos corporativos para fin de año',
    description: 'Sorprende a tus colaboradores y clientes con productos de calidad personalizados con tu marca',
    ctaStore: { text: 'Ver Productos', href: '/categorias' },
    ctaWhatsapp: { text: 'Cotizar Ahora', message: 'Hola, me interesa el catálogo de Navidad 2025' }
  },
  {
    id: 2,
    image: '/images/products-categoria/mugs-vasos-termos/termo-bamboo-500ml/termo-bamboo-500ml.jpg',
    title: 'Mugs y Termos',
    subtitle: 'Personaliza tu marca',
    description: 'Amplia variedad de mugs, termos y vasos personalizables para tu empresa',
    ctaStore: { text: 'Ver Colección', href: '/categoria/mugs-vasos-termos' },
    ctaWhatsapp: { text: 'Solicitar Cotización', message: 'Hola, me interesan los mugs y termos personalizados' }
  },
  {
    id: 3,
    image: '/images/products-categoria/tecnologia/reloj-inteligente-korbin-plus/reloj-inteligente-korbin-plus.jpg',
    title: 'Tecnología Promocional',
    subtitle: 'Innovación para tu marca',
    description: 'Audífonos, parlantes, cargadores y más productos tech personalizados',
    ctaStore: { text: 'Explorar Tech', href: '/categoria/tecnologia-accesorios' },
    ctaWhatsapp: { text: 'Pedir Info', message: 'Hola, me interesa la tecnología promocional' }
  },
  {
    id: 4,
    image: '/images/products-categoria/articulos-escritura/boligrafo-bambu/boligrafo-bambu.jpg',
    title: 'Artículos de Escritorio',
    subtitle: 'Impacta en cada oficina',
    description: 'Bolígrafos, libretas, organizadores y más para el día a día corporativo',
    ctaStore: { text: 'Ver Artículos', href: '/categoria/escritura-oficina' },
    ctaWhatsapp: { text: 'Cotizar', message: 'Hola, necesito artículos de escritorio personalizados' }
  },
  {
    id: 5,
    image: '/images/products-categoria/oficina/libreta-igor-jumbo/libreta-igor-jumbo.jpg',
    title: 'Artículos de Oficina',
    subtitle: 'Tu marca en cada escritorio',
    description: 'Libretas, calculadoras, sets de escritorio y más para el día a día corporativo',
    ctaStore: { text: 'Ver Artículos', href: '/categoria/oficina' },
    ctaWhatsapp: { text: 'Solicitar Precio', message: 'Hola, me interesan artículos de oficina corporativos' }
  }
];

export default function PromoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleWhatsAppClick = (message) => {
    const phoneNumber = '593999814838';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Ofertas Especiales
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Promociones Destacadas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Descubre nuestras ofertas exclusivas en productos promocionales personalizados
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Slide Container */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-soft">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-1/2 relative">
                      <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white">
                      <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                        {slide.subtitle}
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {slide.title}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={slide.ctaStore.href}
                          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          {slide.ctaStore.text}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleWhatsAppClick(slide.ctaWhatsapp.message)}
                          className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          {slide.ctaWhatsapp.text}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="absolute left-3 md:-left-5 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-2.5 md:p-3 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 z-10 border border-gray-100"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="absolute right-3 md:-right-5 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-2.5 md:p-3 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 z-10 border border-gray-100"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-gray-200 hover:bg-gray-300 w-2'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
