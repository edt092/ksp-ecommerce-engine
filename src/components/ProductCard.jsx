'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product, category, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      {(product.bestseller || product.featured) && (
        <div className="absolute top-3 left-3 z-20">
          {product.bestseller && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
              Popular
            </span>
          )}
          {product.featured && !product.bestseller && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
              Destacado
            </span>
          )}
        </div>
      )}

      {/* Quick Actions - appear on hover */}
      <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}>
        {/* Quick View */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
            title="Vista rápida"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}

        {/* WhatsApp */}
        <a
          href={`https://wa.me/593999814838?text=Hola, me interesa el producto: ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
          title="Cotizar por WhatsApp"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* Image container */}
      <Link href={`/productos/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 text-center">
        {/* Product name */}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="font-medium text-secondary text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-wide">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {category && (
          <Link
            href={`/categorias/${category.slug}`}
            className="text-xs text-gray-400 hover:text-secondary transition-colors"
          >
            {category.name}
          </Link>
        )}

        {/* Add to cart style button */}
        <Link
          href={`/productos/${product.slug}`}
          className={`mt-4 block w-full text-center py-2.5 bg-primary text-white font-semibold text-sm transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } hover:bg-primary-dark`}
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}
