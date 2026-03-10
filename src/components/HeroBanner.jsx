'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const WA_NUMBER = '593999814838';

const STATS = [
  { value: 1200, suffix: '+', label: 'Productos' },
  { value: 15, suffix: '+', label: 'Años de experiencia' },
  { value: 34, suffix: '', label: 'Categorías' },
  { value: 24, suffix: 'h', label: 'Respuesta garantizada' },
];

const PRODUCT_IMAGES = [
  'https://catalogospromocionales.com/images/productos/9781.jpg',
  'https://catalogospromocionales.com/images/productos/9531.jpg',
  'https://catalogospromocionales.com/images/productos/8689.jpg',
  'https://catalogospromocionales.com/images/productos/9694.jpg',
  'https://catalogospromocionales.com/images/productos/13536.jpg',
  'https://catalogospromocionales.com/images/productos/3422.jpg',
];

function AnimatedCounter({ target, suffix, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Deep navy gradient background ── */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(135deg, #000D3D 0%, #001A6E 45%, #002494 75%, #0033A0 100%)',
      }} />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Blue glow orbs ── */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #2962FF, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #0047AB, transparent)' }} />

      {/* ── Gold accent line top ── */}
      <div className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: 'linear-gradient(90deg, transparent, #F59E0B 30%, #FCD34D 50%, #F59E0B 70%, transparent)' }} />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* LEFT — Copy */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent font-mono text-xs font-bold uppercase tracking-[0.2em]">
                Ecuador &amp; Colombia
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-heading font-black text-white leading-[1.05] mb-6 animate-slide-up" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Artículos{' '}
              <span className="relative inline-block">
                <span className="text-gradient-gold">Promocionales</span>
              </span>
              <br />
              que hacen{' '}
              <span className="italic font-serif text-white/90">recordar</span>
              <br />
              <span className="text-white/60 text-[0.8em]">tu marca</span>
            </h1>

            {/* Subheading */}
            <p className="text-white/70 text-lg leading-relaxed max-w-lg mb-8 animate-slide-up animate-delay-100">
              Más de 1,200 productos corporativos personalizados con tu logo.
              Calidad premium, entrega rápida y cotización sin costo.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10 animate-slide-up animate-delay-200">
              <Link
                href="/#categorias"
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white px-7 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-gold-glow/30 hover:shadow-gold-glow/60 hover:-translate-y-0.5"
              >
                Ver Catálogo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20cotizar%20productos%20promocionales`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border-2 border-white/40 text-white hover:bg-white hover:text-primary px-7 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotiza Gratis
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 animate-slide-up animate-delay-300">
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Personalización incluida
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Respuesta en 24h
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Envíos nacionales
              </div>
            </div>
          </div>

          {/* RIGHT — Product mosaic */}
          <div className="hidden lg:block animate-slide-in-right animate-delay-200">
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              {PRODUCT_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 group ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                  }`}
                  style={{ animationDelay: `${200 + i * 80}ms` }}
                >
                  <Image
                    src={src}
                    alt={`Producto promocional ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 0px, 200px"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="text-center group">
                <div className="font-mono font-black text-white text-3xl md:text-4xl leading-none mb-1 group-hover:text-accent transition-colors duration-300">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom diagonal ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-10 bg-white"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
    </section>
  );
}
