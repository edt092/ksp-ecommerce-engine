'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WA_NUMBER = '593999814838';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogos', href: '/catalogos-digitales' },
  { name: 'Ecuador', href: '/productos-promocionales-ecuador' },
  { name: 'Colombia', href: '/productos-promocionales-colombia' },
  { name: 'Blog', href: '/blog' },
  { name: 'Nosotros', href: '/nosotros' },
];

const WAIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-navy bg-white/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}>

        {/* Announcement bar */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'
        } bg-secondary text-white text-xs`}>
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-hidden">
              {/* Scrolling marquee */}
              <div className="flex items-center gap-2 overflow-hidden w-full">
                <span className="text-accent font-bold shrink-0">✦</span>
                <div className="overflow-hidden flex-1">
                  <div className="flex gap-12 animate-marquee whitespace-nowrap">
                    <span>🇪🇨 Envíos a todo Ecuador</span>
                    <span>·</span>
                    <span>🇨🇴 Llegamos a Colombia</span>
                    <span>·</span>
                    <span>+1,200 productos personalizables</span>
                    <span>·</span>
                    <span>Cotización en 24 horas</span>
                    <span>·</span>
                    <span>🇪🇨 Envíos a todo Ecuador</span>
                    <span>·</span>
                    <span>🇨🇴 Llegamos a Colombia</span>
                    <span>·</span>
                    <span>+1,200 productos personalizables</span>
                    <span>·</span>
                    <span>Cotización en 24 horas</span>
                    <span>·</span>
                  </div>
                </div>
              </div>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-[#25D366] hover:text-[#4EE68A] font-semibold transition-colors shrink-0 ml-4"
            >
              <WAIcon />
              +593 999 814 838
            </a>
          </div>
        </div>

        {/* Main navbar */}
        <div className={`transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-100' : 'border-b border-white/10'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-18 md:h-20">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0 relative z-10">
                <Image
                  src="/ksp-1.jpg"
                  alt="KS Promocionales"
                  width={180}
                  height={60}
                  className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 ${
                    isScrolled ? '' : 'brightness-0 invert'
                  }`}
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 group ${
                      pathname === item.href
                        ? isScrolled ? 'text-primary' : 'text-white'
                        : isScrolled
                          ? 'text-secondary/70 hover:text-secondary'
                          : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-accent transition-transform duration-200 origin-left ${
                      pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                ))}
              </nav>

              {/* Right: CTA + Mobile toggle */}
              <div className="flex items-center gap-3">
                {/* WhatsApp CTA — Desktop */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20cotizar%20productos%20promocionales`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all duration-200 shadow-gold-glow/20 hover:shadow-gold-glow/50"
                >
                  <WAIcon />
                  Cotizar Gratis
                </a>

                {/* Hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden p-2.5 transition-colors ${
                    isScrolled ? 'text-secondary hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                  aria-label="Toggle menu"
                >
                  <div className="w-5 flex flex-col gap-1.5">
                    <span className={`block h-0.5 transition-all duration-300 ${isScrolled ? 'bg-secondary' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block h-0.5 transition-all duration-300 ${isScrolled ? 'bg-secondary' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 transition-all duration-300 ${isScrolled ? 'bg-secondary' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-secondary flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <span className="font-heading font-bold text-white text-lg tracking-wide">MENÚ</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-6 space-y-1">
            {navigation.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-200 animate-slide-up`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  pathname === item.href ? 'bg-accent' : 'bg-white/20'
                }`} />
                <span className={pathname === item.href ? 'text-accent' : 'text-white/80'}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20cotizar%20productos%20promocionales`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white py-4 font-bold text-sm uppercase tracking-wide transition-colors hover:bg-[#128C7E]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <WAIcon />
              Cotizar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="flex items-center justify-center w-full border border-white/20 text-white/70 py-3 font-semibold text-sm uppercase tracking-wide hover:text-white hover:border-white/40 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
