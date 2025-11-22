'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Determinar si estamos en una página que necesita header transparente inicial
  const isHomePage = pathname === '/';
  const shouldStartTransparent = isHomePage;

  useEffect(() => {
    // Inicializar isScrolled basado en la posición actual
    setIsScrolled(window.scrollY > 50);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detectar dirección de scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Categorías', href: '/#categorias' },
    { name: 'Catálogos Digitales', href: '/catalogos-digitales' },
    { name: 'Blog', href: '/blog' },
    { name: 'Nosotros', href: '/nosotros' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !shouldStartTransparent
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-4'
          : 'bg-transparent py-6'
      } ${
        scrollDirection === 'down' && isScrolled && lastScrollY > 200
          ? '-translate-y-full'
          : 'translate-y-0'
      }`}
      style={{
        opacity: scrollDirection === 'up' || !isScrolled ? 1 : 0.95,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className={`text-3xl md:text-4xl font-bold transition-colors ${
              (isScrolled || !shouldStartTransparent) ? 'text-primary' : 'text-white'
            }`}>
              KS
            </div>
            <div className={`ml-3 transition-colors ${
              (isScrolled || !shouldStartTransparent) ? 'text-gray-600' : 'text-white/90'
            }`}>
              <div className="text-xs md:text-sm">Tu marca, nuestra historia</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors hover:scale-105 transform duration-200 ${
                  (isScrolled || !shouldStartTransparent)
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              (isScrolled || !shouldStartTransparent)
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-xl animate-slide-down">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
