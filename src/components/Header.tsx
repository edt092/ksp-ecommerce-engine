'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const WA_NUMBER = '593999814838';
const WA_TEXT   = 'Hola%2C%20quiero%20cotizar%20productos%20promocionales%20para%20mi%20empresa';

const categoryGroups = [
  {
    label: 'Más Populares',
    items: [
      { name: 'Artículos de Escritura', slug: 'boligrafos-publicitarios', icon: '✏️' },
      { name: 'Tecnología', slug: 'tecnologia-promocional', icon: '💻' },
      { name: 'Mugs y Termos', slug: 'mugs-y-termos-personalizados', icon: '☕' },
      { name: 'Bolsos y Maletines', slug: 'maletines-personalizados', icon: '💼' },
    ],
  },
  {
    label: 'Corporativo',
    items: [
      { name: 'Oficina', slug: 'articulos-de-oficina-personalizados', icon: '🗂️' },
      { name: 'Novedades', slug: 'novedades', icon: '⭐' },
      { name: 'Regalos Ejecutivos', slug: 'novedades', icon: '🎁' },
      { name: 'Llaveros', slug: 'llaveros-personalizados', icon: '🔑' },
    ],
  },
  {
    label: 'Especiales',
    items: [
      { name: 'Ecológicos', slug: 'ecologia', icon: '🌿' },
      { name: 'Deportes', slug: 'deportes', icon: '⚽' },
      { name: 'Hogar', slug: 'hogar', icon: '🏠' },
      { name: 'Infantil', slug: 'infantil', icon: '🎨' },
    ],
  },
];

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogos', href: '/catalogos-digitales' },
  { name: 'Blog', href: '/blog' },
  { name: 'Nosotros', href: '/nosotros' },
];

const WAIcon = ({ size = 'sm' }) => (
  <svg
    className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);


export default function Header() {
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname  = usePathname();
  const rafId = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => setIsScrolled(window.scrollY > 20));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId.current); };
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 header-accent-line${isScrolled ? ' scrolled' : ''}`}
        style={{
          backgroundColor: isScrolled ? 'rgba(9,21,87,0.98)' : 'rgba(9,21,87,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: isScrolled
            ? '0 4px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(245,165,32,0.12)'
            : 'none',
        }}
      >
        {/* ── Announcement bar ── */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: isScrolled ? '0' : '40px', opacity: isScrolled ? 0 : 1 }}
        >
          <div className="announcement-bar border-b border-white/5 text-white text-xs">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                <span className="text-[#F5A520] font-bold shrink-0 announce-pulse select-none">✦</span>
                <div className="overflow-hidden flex-1">
                  <div className="flex gap-10 animate-marquee whitespace-nowrap text-white/60">
                    <span>🇪🇨 Envíos a todo Ecuador</span>
                    <span className="text-white/20">·</span>
                    <span>+3,500 productos personalizables</span>
                    <span className="text-white/20">·</span>
                    <span>Cotización en menos de 48 horas</span>
                    <span className="text-white/20">·</span>
                    <span>🎨 100% personalizable con tu logo</span>
                    <span className="text-white/20">·</span>
                    <span>🇪🇨 Envíos a todo Ecuador</span>
                    <span className="text-white/20">·</span>
                    <span>+3,500 productos personalizables</span>
                    <span className="text-white/20">·</span>
                    <span>Cotización en menos de 48 horas</span>
                    <span className="text-white/20">·</span>
                    <span>🎨 100% personalizable con tu logo</span>
                    <span className="text-white/20">·</span>
                  </div>
                </div>
              </div>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-[#25D366] hover:text-[#4EE68A] font-semibold transition-all duration-200 shrink-0"
              >
                <WAIcon size="sm" />
                +593 999 814 838
              </a>
            </div>
          </div>
        </div>

        {/* ── Main nav row ── */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link href="/" className="shrink-0 relative z-10 logo-hover">
              <Image
                src="/ksp-1.png"
                alt="KS Promocionales"
                width={160}
                height={52}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">

              {/* Regular nav links */}
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span className="relative pb-0.5">
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#F5A520] to-[#FFBA3D] transition-[width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-2.5">
              {/* Ghost CTA */}
              <Link
                href="/catalogos-digitales"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/75 hover:text-white header-ghost-btn rounded-lg transition-all duration-200"
              >
                Ver Catálogo
              </Link>

              {/* Primary CTA */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg btn-header-cta"
              >
                <WAIcon size="sm" />
                Solicitar Cotización
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileOpen(v => !v)}
                className="lg:hidden p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <div className="w-5 flex flex-col gap-[5px]">
                  <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isMobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${isMobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                  <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isMobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`mobile-drawer absolute top-0 right-0 h-full w-[320px] max-w-[92vw] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <Link href="/" onClick={() => setIsMobileOpen(false)}>
              <Image
                src="/ksp-1.png"
                alt="KS Promocionales"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-white/45 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
            <div className="space-y-0.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-[#F5A520] bg-[#F5A520]/8 border border-[#F5A520]/15'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5A520]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom CTAs */}
          <div className="p-4 border-t border-white/8 space-y-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold text-white bg-[#25D366] hover:bg-[#1EBD57] rounded-xl transition-all duration-200 pulse-whatsapp"
              onClick={() => setIsMobileOpen(false)}
            >
              <WAIcon size="sm" />
              Solicitar Cotización por WhatsApp
            </a>
            <Link
              href="/catalogos-digitales"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white/60 border border-white/12 hover:border-white/35 hover:text-white rounded-xl transition-all duration-200"
              onClick={() => setIsMobileOpen(false)}
            >
              Ver Catálogo Digital
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
