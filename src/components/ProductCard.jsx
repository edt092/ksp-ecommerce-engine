'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const WA_NUMBER = '593999814838';

const WAIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ProductCard({ product, category, onQuickView }) {
  const [imgError, setImgError] = useState(false);

  const waText = encodeURIComponent(
    `Hola, me interesa cotizar: ${product.name}. ¿Podrían enviarme información sobre personalización y cantidades mínimas?`
  );

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">

      {/* ── Badge ── */}
      {(product.bestseller || product.featured) && (
        <div className="absolute top-3 left-3 z-20">
          {product.bestseller ? (
            <span className="badge-popular">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </span>
          ) : (
            <span className="badge-new">Destacado</span>
          )}
        </div>
      )}

      {/* ── Quick view button ── */}
      {onQuickView && (
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
          title="Vista rápida"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}

      {/* ── Image ── */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square bg-cream overflow-hidden"
      >
        {product.images && product.images.length > 0 && !imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-108"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-dark">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* "Ver detalles" on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs font-bold uppercase tracking-wider py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Ver detalles →
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        {category && (
          <Link
            href={`/categorias/${category.slug}`}
            className="text-[10px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors mb-1.5"
          >
            {category.name}
          </Link>
        )}

        {/* Name */}
        <Link href={`/productos/${product.slug}`} className="flex-1">
          <h3 className="font-heading font-semibold text-secondary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-wide">
            {product.name}
          </h3>
        </Link>

        {/* WhatsApp CTA — always visible, bottom of card */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase tracking-wide transition-colors duration-200"
        >
          <WAIcon />
          Cotizar
        </a>
      </div>
    </div>
  );
}
