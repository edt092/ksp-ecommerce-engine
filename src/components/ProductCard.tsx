'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const WA_NUMBER = '593999814838';

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function ProductCard({ product, category, onQuickView = null }) {
  const [imgError, setImgError] = useState(false);

  const waText = encodeURIComponent(
    `Hola, me interesa cotizar: ${product.name}. ¿Podrían enviarme información sobre personalización y cantidades mínimas?`
  );

  return (
    <article className="group relative bg-white flex flex-col overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#0F2178]/15 hover:shadow-[0_8px_32px_rgba(15,33,120,0.1)] hover:-translate-y-1">

      {/* ── Image area ── */}
      <div className="relative overflow-hidden bg-[#F3F5FA]" style={{ aspectRatio: '1/1', borderRadius: '12px 12px 0 0' }}>

        {/* Badge */}
        {(product.bestseller || product.featured) && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#EDF0FB] text-[#0F2178]">
              {product.bestseller ? 'Popular' : 'Destacado'}
            </span>
          </div>
        )}

        {/* Quick view */}
        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0F2178] hover:text-white hover:border-[#0F2178] transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 rounded-lg shadow-sm"
            title="Vista rápida"
          >
            <EyeIcon />
          </button>
        )}

        {/* Product image */}
        <Link href={`/productos/${product.slug}/`} className="block h-full" tabIndex={-1}>
          {product.images && product.images.length > 0 && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-10">📦</span>
            </div>
          )}
        </Link>

        {/* Orange accent line — bottom of image, slides in on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ background: 'linear-gradient(90deg, #F5A520, #FFBA3D)' }}
        />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-3.5 pt-3">

        {/* Category label */}
        {category && (
          <Link
            href={`/categorias/${category.slug}/`}
            className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#0F2178]/38 hover:text-[#F5A520] transition-colors duration-200 mb-1.5 block"
          >
            {category.name}
          </Link>
        )}

        {/* Product name */}
        <Link href={`/productos/${product.slug}/`} className="flex-1 mb-3.5 group/link">
          <h3 className="font-bold text-[#111827] text-[0.8rem] leading-snug line-clamp-2 group-hover/link:text-[#0F2178] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* CTA — outline navy → fills orange on hover */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn flex items-center justify-center gap-1.5 w-full py-2.5 text-[11px] font-semibold tracking-wide border border-[#0F2178]/22 text-[#0F2178] rounded-lg transition-all duration-200 hover:bg-[#F5A520] hover:border-[#F5A520] hover:text-white mt-auto"
        >
          Solicitar Precio
          <svg
            className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-0.5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
