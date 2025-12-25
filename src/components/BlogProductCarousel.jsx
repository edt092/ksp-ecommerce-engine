'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Gift, Sparkles } from 'lucide-react';

// Configuraciones de carruseles temáticos para diferentes artículos
const carouselConfigs = {
  navidenos: {
    title: 'Productos Navideños Destacados',
    subtitle: 'Regalos corporativos para esta temporada',
    slides: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1511268559489-34b624fbfcf5?w=800&q=80',
        category: 'Mugs y Termos',
        title: 'Tazas Navideñas Personalizadas',
        description: 'Tazas y termos perfectos para regalar en Navidad. Personaliza con tu logo y sorprende a tus clientes.',
        href: '/categoria/mugs-vasos-termos',
        whatsappMessage: 'Hola, me interesan las tazas navideñas personalizadas para mi empresa'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80',
        category: 'Hogar y Cocina',
        title: 'Sets de Regalo para el Hogar',
        description: 'Kits y sets perfectos para obsequiar a colaboradores y clientes especiales esta Navidad.',
        href: '/categoria/hogar',
        whatsappMessage: 'Hola, busco sets de regalo navideños para mi empresa'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80',
        category: 'Variedades',
        title: 'Calendarios y Agendas 2025',
        description: 'Calendarios de adviento, agendas y planificadores personalizados para iniciar el nuevo año.',
        href: '/categoria/variedades',
        whatsappMessage: 'Hola, me interesan calendarios y agendas personalizadas para 2025'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&q=80',
        category: 'Productos Ecológicos',
        title: 'Regalos Sostenibles',
        description: 'Productos ecológicos y biodegradables que demuestran tu compromiso con el medio ambiente.',
        href: '/categoria/ecologicos',
        whatsappMessage: 'Hola, busco productos ecológicos para regalos navideños corporativos'
      }
    ]
  },
  corporativos: {
    title: 'Regalos Corporativos Premium',
    subtitle: 'Impresiona a tus clientes VIP',
    slides: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
        category: 'Tecnología',
        title: 'Gadgets Tecnológicos',
        description: 'Power banks, audífonos y accesorios tech que posicionan tu marca como innovadora.',
        href: '/categoria/tecnologia',
        whatsappMessage: 'Hola, me interesan productos tecnológicos promocionales'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        category: 'Bolsos y Mochilas',
        title: 'Mochilas Ejecutivas',
        description: 'Mochilas y bolsos de alta calidad para profesionales exigentes.',
        href: '/categoria/bolsos-mochilas',
        whatsappMessage: 'Hola, busco mochilas ejecutivas personalizadas'
      }
    ]
  }
};

export default function BlogProductCarousel({ theme = 'navidenos', variant = 'full' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const config = carouselConfigs[theme] || carouselConfigs.navidenos;
  const { slides, title, subtitle } = config;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleWhatsAppClick = (message) => {
    const phoneNumber = '593999814838';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Variante compacta para insertar en medio del contenido
  if (variant === 'compact') {
    return (
      <div className="my-10 p-6 bg-gradient-to-br from-red-50 to-green-50 rounded-2xl border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Productos Recomendados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.slice(0, 2).map((slide) => (
            <Link
              key={slide.id}
              href={slide.href}
              className="group flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-primary">{slide.category}</span>
                <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">{slide.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{slide.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos los productos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Variante completa con carrusel animado
  return (
    <div className="my-12 -mx-4 md:mx-0">
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-green-700 rounded-none md:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header con decoración navideña */}
        <div className="relative px-6 py-6 md:py-8 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-100"></div>
            <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-200"></div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-yellow-200 text-sm font-medium uppercase tracking-wider">Especial Navidad</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm md:text-base">{subtitle}</p>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative bg-white">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Imagen */}
                    <div className="md:w-1/2 relative">
                      <div className="aspect-[4/3] md:aspect-square relative overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent"></div>
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                          {slide.category}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {slide.title}
                      </h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={slide.href}
                          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Ver Productos
                        </Link>
                        <button
                          onClick={() => handleWhatsAppClick(slide.whatsappMessage)}
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Cotizar Ahora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <button
            onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 py-4 bg-gray-50">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-700 to-green-700 text-center">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-white font-semibold hover:text-yellow-200 transition-colors"
          >
            <Gift className="w-4 h-4" />
            Explorar todo el catálogo navideño
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta individual para CTAs inline
export function ProductCTACard({
  image,
  category,
  title,
  description,
  href,
  whatsappMessage,
  theme = 'default'
}) {
  const handleWhatsAppClick = () => {
    const phoneNumber = '593999814838';
    const encodedMessage = encodeURIComponent(whatsappMessage || `Hola, me interesa: ${title}`);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const themeClasses = {
    default: 'bg-white border-gray-200',
    christmas: 'bg-gradient-to-br from-red-50 to-green-50 border-red-200',
    premium: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
  };

  return (
    <div className={`my-8 p-6 rounded-2xl border-2 shadow-lg ${themeClasses[theme]}`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="aspect-square rounded-xl overflow-hidden shadow-md">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="md:w-2/3 flex flex-col justify-center">
          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{category}</span>
          <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Ver Productos
            </Link>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Cotizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid de productos para secciones específicas
export function ProductCTAGrid({ products, title, columns = 3 }) {
  const handleWhatsAppClick = (message) => {
    const phoneNumber = '593999814838';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  return (
    <div className="my-10">
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {products.map((product, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {product.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex gap-2">
                <Link
                  href={product.href}
                  className="flex-1 text-center bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Ver
                </Link>
                <button
                  onClick={() => handleWhatsAppClick(product.whatsappMessage || `Hola, me interesa: ${product.title}`)}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-lg transition-colors"
                  aria-label="Cotizar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
