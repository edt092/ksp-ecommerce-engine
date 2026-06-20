'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductImageGallery({ product, category }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="animate-slide-up">
      <div className="lg:sticky lg:top-24">
        {/* Badges */}
        <div className="flex gap-2 mb-4">
          {product.bestseller && (
            <span className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full">
              MÁS VENDIDO
            </span>
          )}
          {product.featured && (
            <span className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-full">
              DESTACADO
            </span>
          )}
        </div>

        {/* Main Image */}
        {product.images && product.images.length > 0 ? (
          <>
            <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden mb-4 relative bg-gray-100 group">
              <Image
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - imagen ${selectedImageIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />

              {/* Navegación con flechas si hay más de 1 imagen */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicador de imagen actual */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-3">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden relative transition-all ${
                      selectedImageIndex === i
                        ? 'ring-4 ring-primary shadow-xl scale-105'
                        : 'ring-2 ring-gray-200 hover:ring-primary/50 hover:scale-105'
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - miniatura ${i + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                    {selectedImageIndex === i && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Fallback - Placeholder with gradient */}
            <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary/80 to-primary-light/60">
              <div className="w-full h-full flex items-center justify-center text-white text-9xl opacity-40">
                {category?.icon || '📦'}
              </div>
            </div>

            {/* Thumbnail Gallery - Placeholder */}
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-br from-primary/60 to-primary-light/40"
                ></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
