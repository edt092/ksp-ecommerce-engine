'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CatalogosClient() {
  const [catalogos, setCatalogos] = useState([]);

  useEffect(() => {
    const catalogosData = [
      { id: 1, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0001.jpg' },
      { id: 2, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0002.jpg' },
      { id: 3, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0003.jpg' },
      { id: 4, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0004.jpg' },
      { id: 5, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0005.jpg' },
      { id: 6, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0006.jpg' },
      { id: 7, imagen: '/images/catalogos-ksp/Catalogo Temporada nav 2025_page-0007.jpg' },
      { id: 8, imagen: '/images/catalogos-ksp/catalogo-a.png' },
      { id: 9, imagen: '/images/catalogos-ksp/catalogo-b.png' },
      { id: 10, imagen: '/images/catalogos-ksp/catalogo-c.png' },
      { id: 11, imagen: '/images/catalogos-ksp/catalogo-d.png' },
      { id: 12, imagen: '/images/catalogos-ksp/catalogo-e.png' },
      { id: 13, imagen: '/images/catalogos-ksp/catalogo-f.png' },
      { id: 14, imagen: '/images/catalogos-ksp/catalogo-g.png' },
      { id: 15, imagen: '/images/catalogos-ksp/catalogo-h.png' },
      { id: 16, imagen: '/images/catalogos-ksp/catalogo-i.png' },
      { id: 17, imagen: '/images/catalogos-ksp/catalogo-j.png' },
      { id: 18, imagen: '/images/catalogos-ksp/catalogo-k.png' },
    ];
    setCatalogos(catalogosData);
  }, []);

  const handleSolicitarCatalogo = () => {
    window.location.href = 'mailto:claudiagonzalez@kronosolopromocionales.com?subject=Solicitud de Catálogo Digital&body=Hola, me gustaría recibir información sobre sus catálogos digitales.';
  };

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]"></div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary font-medium">Catálogos Digitales</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 md:p-5">
                <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              Catálogos Digitales
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto px-4 mb-8">
              Explora nuestra colección completa de productos promocionales. Descubre ideas para hacer brillar tu marca.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleSolicitarCatalogo}
              className="inline-flex items-center gap-3 bg-white text-primary px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Solicita tu Catálogo Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Catalogos Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            {catalogos.map((catalogo, index) => (
              <div
                key={catalogo.id}
                className="bg-white border border-gray-200 overflow-hidden hover:border-primary transition-all duration-300"
              >
                <div className="relative w-full aspect-[8.5/11] bg-gray-100">
                  <Image
                    src={catalogo.imagen}
                    alt={`Catálogo KS Promocionales - Página ${catalogo.id}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    priority={index < 3}
                  />
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
          <p className="text-gray-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base px-4">
            Contáctanos y te enviaremos información detallada de nuestros catálogos y productos promocionales.
          </p>
          <button
            onClick={handleSolicitarCatalogo}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Solicita tu Catálogo Ahora
          </button>
        </div>
      </section>
    </>
  );
}
