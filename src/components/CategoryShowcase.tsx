'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryShowcase({ categories }) {
  const trackRef   = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScroll = useRef(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncButtons, { passive: true });
    syncButtons();
    return () => el.removeEventListener('scroll', syncButtons);
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-cat-card]');
    const step = (card?.offsetWidth ?? 260) + 20;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScroll.current  = el.scrollLeft;
    el.style.cursor     = 'grabbing';
    el.style.userSelect = 'none';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.pageX - trackRef.current.offsetLeft - dragStartX.current;
    trackRef.current.scrollLeft = dragScroll.current - dx * 1.2;
  };

  const stopDrag = () => {
    if (!trackRef.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor     = '';
    trackRef.current.style.userSelect = '';
  };

  return (
    <section className="py-16 md:py-24 bg-[#F8F9FC]">

      {/* ── Header ── */}
      <div className="reveal container mx-auto px-4 text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-[#EDF0FB] text-[#0F2178] text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A520] shrink-0" />
          Más de 3.500 productos promocionales
        </div>

        <h2
          className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[#0A0A23] leading-tight tracking-tight mb-3 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Encuentra el producto ideal<br className="hidden sm:block" /> para tu marca
        </h2>

        <p className="text-[#0F2178] font-semibold text-sm md:text-base mb-4">
          +10 años de experiencia en Merchandising y Material Publicitario en Ecuador
        </p>

        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Explora soluciones para eventos, campañas de marketing, regalos corporativos y fidelización.
        </p>

        <a
          href="/regalos-corporativos/"
          className="inline-block mt-6 px-7 py-3 bg-[#F5A520] text-white font-bold text-sm rounded-full hover:bg-[#e09618] transition-colors"
        >
          Ver Productos
        </a>
      </div>

      {/* ── Controls bar ── */}
      <div className="container mx-auto px-4 flex items-center justify-between mb-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
          {categories.length} categorías
        </p>
        <div className="flex gap-2">
          {[
            { dir: -1, label: 'Categoría anterior',  d: 'M15 19l-7-7 7-7' },
            { dir:  1, label: 'Siguiente categoría', d: 'M9 5l7 7-7 7'   },
          ].map(({ dir, label, d }) => (
            <button
              key={dir}
              onClick={() => scrollBy(dir)}
              disabled={dir === -1 ? !canPrev : !canNext}
              aria-label={label}
              className="w-10 h-10 rounded-full border-2 border-[#0F2178]/15 flex items-center justify-center text-[#0F2178] hover:bg-[#0F2178] hover:border-[#0F2178] hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── Carousel track ── */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-5 -mx-0 px-4 md:px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categorias/${cat.slug}/`}
            data-cat-card
            draggable={false}
            className="group relative flex-none snap-start overflow-hidden rounded-3xl select-none
                       transition-all duration-500 hover:-translate-y-2"
            style={{
              width: 'clamp(196px, 23vw, 264px)',
              aspectRatio: '3/4',
              boxShadow: '0 2px 16px rgba(15,33,120,0.07)',
            }}
            aria-label={`${cat.name} — ${cat.productCount} productos`}
            onDragStart={(e) => e.preventDefault()}
          >
            {/* Background image */}
            <Image
              src={`/images/categorias/${cat.id}.png`}
              alt={cat.name}
              fill
              sizes="(max-width:640px) 70vw, (max-width:1024px) 42vw, 264px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
              draggable={false}
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.04) 100%)',
              }}
            />

            {/* Orange border glow on hover */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 0 1.5px rgba(245,165,32,0.55), 0 20px 48px rgba(15,33,120,0.22)',
              }}
            />

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">

              {/* Expanding orange line */}
              <div className="mb-3.5 h-[2px] overflow-hidden rounded-full">
                <div
                  className="h-full w-6 group-hover:w-full transition-all duration-300 ease-out rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F5A520, #FFBA3D)' }}
                />
              </div>

              {/* Product count */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span
                  className="text-[2rem] font-black text-white tabular-nums leading-none"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {cat.productCount}
                </span>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">prod.</span>
              </div>

              {/* Category name */}
              <h3
                className="font-bold text-white text-[0.9rem] leading-snug mb-2 line-clamp-2"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {cat.name}
              </h3>

              {/* Short description */}
              <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 group-hover:text-white/72 transition-colors duration-300">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
