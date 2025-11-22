'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BookOpen, Download } from 'lucide-react';

export default function CatalogosDigitalesPage() {
  const [catalogos, setCatalogos] = useState([]);

  useEffect(() => {
    // Array de catálogos con sus imágenes
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Catálogos Digitales
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explora nuestra colección completa de productos promocionales. Descubre ideas para hacer brillar tu marca.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleSolicitarCatalogo}
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Solicita tu Catálogo Ahora
          </button>
        </div>

        {/* Catalogos Grid */}
        <div className="max-w-5xl mx-auto space-y-8">
          {catalogos.map((catalogo, index) => (
            <div
              key={catalogo.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
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

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ¿Te interesa algún producto?
            </h2>
            <p className="text-gray-600 mb-6 text-base md:text-lg">
              Contáctanos y te enviaremos información detallada de nuestros catálogos y productos
            </p>
            <button
              onClick={handleSolicitarCatalogo}
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Solicita tu Catálogo Ahora
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
