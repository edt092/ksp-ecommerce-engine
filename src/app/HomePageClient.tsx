'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/ProductCard';
import CategoryShowcase from '@/components/CategoryShowcase';

const QuickViewModal = dynamic(() => import('@/components/QuickViewModal'), {
  ssr: false, loading: () => null,
});

const WA_NUMBER = '593999814838';

const HERO_SLIDES = [
  '/images/hero/slide-1.png',
  '/images/hero/slide-2.png',
  '/images/hero/slide-3.png',
  '/images/hero/slide-4.png',
  '/images/hero/slide-5.png',
];
const WA_TEXT   = encodeURIComponent('Hola, quiero cotizar productos promocionales para mi empresa');

/* ─── Static data ───────────────────────────────────────────── */
const stats = [
  { value: '+3,500', label: 'Productos' },
  { value: '+1,000', label: 'Clientes'  },
  { value: '+10',    label: 'Años'      },
  { value: '48h',    label: 'Respuesta' },
];

const solutions = [
  { img: '/images/soluciones/welcome_kits.png',       title: 'Welcome Kits',      desc: 'Kits de bienvenida personalizados para nuevos colaboradores y clientes corporativos.' },
  { img: '/images/soluciones/ferias_y_eventos.png',   title: 'Ferias y Eventos',  desc: 'Material POP, stands y artículos promocionales para eventos y exposiciones.' },
  { img: '/images/soluciones/recursos_humanos.png',   title: 'Recursos Humanos',  desc: 'Uniformes, artículos y kits para fortalecer la cultura organizacional.' },
  { img: '/images/soluciones/fidelizacion.png',       title: 'Fidelización',      desc: 'Regalos corporativos para clientes VIP y campañas de retención.' },
  { img: '/images/soluciones/lanzamientos.png',       title: 'Lanzamientos',      desc: 'Merchandising exclusivo para el lanzamiento de productos y marcas.' },
  { img: '/images/soluciones/regalos_ejecutivos.png', title: 'Regalos Ejecutivos',desc: 'Artículos premium para directivos, socios y clientes estratégicos.' },
];

const process = [
  { num: '01', title: 'Elige productos',      desc: 'Navega el catálogo y selecciona los artículos ideales para tu marca.' },
  { num: '02', title: 'Solicita cotización',  desc: 'Envíanos tu solicitud por WhatsApp. Respondemos en máximo 48 horas.' },
  { num: '03', title: 'Diseño de branding',   desc: 'Nuestro equipo adapta tu logo y diseño a cada artículo.' },
  { num: '04', title: 'Producción y calidad', desc: 'Fabricamos con materiales premium bajo estrictos controles de calidad.' },
  { num: '05', title: 'Entrega a tu puerta',  desc: 'Envíos a todo Ecuador con seguimiento en tiempo real hasta tu empresa.' },
];

const techniques = [
  { name: 'Serigrafía',   icon: '🖨️', desc: 'Ideal para telas, bolsas y superficies planas. Alta durabilidad.' },
  { name: 'Tampografía',  icon: '🎯', desc: 'Perfecta para objetos de formas irregulares y superficies pequeñas.' },
  { name: 'Sublimación',  icon: '🌈', desc: 'Colores vibrantes y fotográficos. Ideal para telas y cerámica.' },
  { name: 'Láser',        icon: '✨', desc: 'Grabado preciso y elegante en metales, cueros y maderas.' },
  { name: 'Bordado',      icon: '🧵', desc: 'Acabado premium para uniformes, gorras y artículos textiles.' },
  { name: 'UV',           icon: '💡', desc: 'Impresión de alto contraste con relieves táctiles y acabados especiales.' },
];

const industries = [
  { name: 'Retail',       img: '/images/sectores/retail.png'       },
  { name: 'Tecnología',   img: '/images/sectores/tecnologia.png'   },
  { name: 'Educación',    img: '/images/sectores/educacion.png'    },
  { name: 'Salud',        img: '/images/sectores/salud.png'        },
  { name: 'Construcción', img: '/images/sectores/construccion.png' },
  { name: 'Financiero',   img: '/images/sectores/financiero.png'   },
  { name: 'Alimentos',    img: '/images/sectores/alimentos.png'    },
  { name: 'Automotriz',   img: '/images/sectores/automotriz.png'   },
];

/* ─── Icons ─────────────────────────────────────────────────── */
const WAIcon = ({ size = 'md' }) => (
  <svg className={size === 'sm' ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ArrowRight = ({ cls = 'w-4 h-4' }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

/* ─── Section title ─────────────────────────────────────────── */
function SectionTitle({ label, title, subtitle, light = false, center = true }) {
  return (
    <div className={`reveal ${center ? 'text-center' : ''} mb-12 md:mb-16`}>
      {label && (
        <p className={`section-label mb-3 ${center ? 'justify-center' : ''} ${light ? '!text-orange-300' : ''}`}>
          {label}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight ${
        light ? 'text-white' : 'text-[#0A0A23]'
      } ${center ? 'max-w-2xl mx-auto' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${
          light ? 'text-white/65' : 'text-gray-500'
        } ${center ? 'max-w-xl mx-auto' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── Product grid ──────────────────────────────────────────── */
function ProductGrid({ products, categories, onQuickView }) {
  const getCategory = (id) => categories.find(c => c.id === id);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, 8).map((product, i) => (
        <div
          key={product.id}
          className="reveal animate-slide-up"
          style={{ '--stagger': `${i * 55}ms` }}
        >
          <ProductCard
            product={product}
            category={getCategory(product.categoryId)}
            onQuickView={onQuickView}
          />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function HomePageClient({ latestProducts, featuredProducts, bestsellerProducts, categories }) {
  const [activeTab,        setActiveTab]        = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeSlide,      setActiveSlide]      = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Re-init reveal observer on every mount (fixes client-side navigation: elements
  // re-rendered by React won't be watched by the one-time layout script observer)
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
      if (!el.classList.contains('visible')) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const getCategory = (id) => categories.find(c => c.id === id);

  const productSets = {
    latest:      latestProducts,
    featured:    featuredProducts,
    bestsellers: bestsellerProducts,
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — full-bleed slideshow + copy
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>

        {/* ── Background slides (crossfade) ── */}
        {HERO_SLIDES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: i === activeSlide ? 1 : 0,
              zIndex: i === activeSlide ? 1 : 0,
              transition: 'opacity 1.8s ease-in-out',
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={i === 0}
              aria-hidden="true"
            />
          </div>
        ))}

        {/* ── Diagonal overlay: heavy navy left → transparent right ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: [
              'linear-gradient(108deg,',
              '  rgba(9,21,87,0.97)   0%,',
              '  rgba(9,21,87,0.93)  35%,',
              '  rgba(15,33,120,0.55) 58%,',
              '  rgba(0,0,0,0.08)    100%)',
            ].join(' '),
          }}
        />

        {/* ── Top vignette ── */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
          style={{ zIndex: 3, background: 'linear-gradient(to bottom, rgba(9,21,87,0.4) 0%, transparent 100%)' }}
        />

        {/* ── Content ── */}
        <div
          className="relative flex items-center"
          style={{ zIndex: 4, minHeight: '92vh' }}
        >
          <div className="container mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-[600px]">

              {/* Eyebrow badge */}
              <div className="reveal inline-flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                <span className="text-white/80 text-sm font-medium">+3,500 referencias personalizables disponibles</span>
              </div>

              {/* H1 */}
              <h1
                className="reveal font-bold text-white leading-[1.07] mb-6"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 4.5rem)',
                  fontFamily: 'var(--font-syne)',
                  '--stagger': '80ms',
                }}
              >
                Artículos Promocionales<br className="hidden sm:block" />
                <span className="text-gradient-orange">que fortalecen</span><br className="hidden sm:block" />
                tu marca
              </h1>

              {/* Subtext */}
              <p
                className="reveal text-white/65 leading-relaxed mb-10"
                style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', '--stagger': '160ms' }}
              >
                Artículos corporativos personalizados para empresas en Ecuador.
                Calidad premium, cotización en 24 horas.
              </p>

              {/* CTAs */}
              <div className="reveal flex flex-wrap items-center gap-4 mb-10" style={{ '--stagger': '240ms' }}>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-primary"
                >
                  <WAIcon />
                  Solicitar Cotización
                </a>
                <Link href="/regalos-corporativos/" className="btn-hero-ghost">
                  Explorar Catálogo
                  <ArrowRight />
                </Link>
              </div>

              {/* Slide indicator dots */}
              <div className="reveal flex items-center gap-2" style={{ '--stagger': '320ms' }}>
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Imagen ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    style={{
                      width: i === activeSlide ? '2rem' : '0.625rem',
                      background: i === activeSlide ? '#F5A520' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST STRIP — below hero (inspired by header-example)
          ═══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: '+3,500 Productos',
                sub: 'Personalizables con tu logo',
                href: '/regalos-corporativos/',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: '+1,000 Clientes',
                sub: 'Empresas confían en KS',
                href: null,
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: '+10 Años',
                sub: 'Experiencia en Ecuador',
                href: null,
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Cotización 24h',
                sub: 'Respuesta garantizada',
                href: `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`,
              },
            ].map(({ icon, title, sub, href }) => {
              const content = (
                <div className="flex items-center gap-3 px-5 py-4 md:py-5 w-full group/strip">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF0FB] flex items-center justify-center text-[#0F2178] shrink-0 transition-colors duration-200 group-hover/strip:bg-[#0F2178] group-hover/strip:text-white">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#0A0A23] font-bold text-sm leading-snug truncate">{title}</p>
                    <p className="text-gray-400 text-xs leading-snug truncate">{sub}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="hover:bg-[#F8F9FC] transition-colors duration-200">
                  {content}
                </a>
              ) : (
                <div key={title}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════
          CATEGORY SHOWCASE — horizontal carousel
          ═══════════════════════════════════════════════ */}
      <CategoryShowcase categories={categories} />

      {/* ═══════════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">

          {/* Centered header — reference style */}
          <div className="reveal text-center mb-10 md:mb-12">
            <p className="section-label justify-center mb-3">Catálogo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A23] leading-tight tracking-tight mb-4">
              Productos más solicitados
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-base">
              Artículos que las empresas eligen una y otra vez para sus campañas.
            </p>
          </div>

          {/* Tabs — pill style like reference */}
          <div className="reveal flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 p-1.5 bg-[#F0F3FA] rounded-xl border border-gray-100">
              {[
                { key: 'featured',    label: 'Destacados'  },
                { key: 'bestsellers', label: 'Más Vendidos' },
                { key: 'latest',      label: 'Novedades'    },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-[#0F2178] text-white shadow-md'
                      : 'text-gray-500 hover:text-[#0F2178] hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <ProductGrid
            products={productSets[activeTab] || []}
            categories={categories}
            onQuickView={setQuickViewProduct}
          />

          <div className="text-center mt-10 reveal">
            <Link
              href="/regalos-corporativos/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0F2178] hover:bg-[#002494] px-7 py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Ver catálogo completo
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATEGORIES — image-forward grid
          ═══════════════════════════════════════════════ */}
      <section id="categorias" className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <SectionTitle
            label="Catálogo Completo"
            title="Explora Nuestras Categorías"
            subtitle="Más de 3,500 artículos promocionales organizados para que encuentres lo que buscas."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {categories.slice(0, 12).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}/`}
                className="reveal category-card-v2 group"
                style={{ '--stagger': `${(i % 4) * 55}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-white" style={{ aspectRatio: '4/3', borderRadius: '16px 16px 0 0' }}>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl opacity-20">📦</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0F2178]/0 group-hover:bg-[#0F2178]/10 transition-colors duration-300" />
                </div>
                {/* Label */}
                <div className="p-3.5 bg-white" style={{ borderRadius: '0 0 16px 16px', borderTop: '1px solid rgba(0,26,110,0.06)' }}>
                  <h3 className="font-bold text-[#0A0A23] text-sm leading-tight group-hover:text-[#0F2178] transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[#F5A520] text-xs font-semibold">{cat.productCount} productos</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link
              href="/regalos-corporativos/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2178] border-2 border-[#0F2178]/20 hover:border-[#0F2178] hover:bg-[#0F2178] hover:text-white px-7 py-3.5 rounded-lg transition-all duration-200"
            >
              Ver todas las categorías
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SOLUTIONS
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            label="Soluciones"
            title="Para cada necesidad empresarial"
            subtitle="Diseñamos experiencias de producto que conectan tu marca con las personas que importan."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {solutions.map((sol, i) => (
              <div
                key={sol.title}
                className="reveal card-surface p-6 md:p-7 group cursor-default transition-all duration-300
                           hover:border-[#0F2178] hover:shadow-[0_0_0_1.5px_#0F2178,0_12px_40px_rgba(15,33,120,0.18)]"
                style={{ '--stagger': `${(i % 3) * 80}ms` }}
              >
                {/* Image — centered, expands to 300 px on hover */}
                <div className="flex justify-center mb-6">
                  <div className="relative overflow-hidden rounded-2xl transition-all duration-500 ease-out w-24 h-24 group-hover:w-[300px] group-hover:h-[300px]">
                    <Image
                      src={sol.img}
                      alt={sol.title}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="font-bold text-[#0A0A23] text-base mb-2 group-hover:text-[#0F2178] transition-colors text-center">
                  {sol.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed text-center">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════ */}
      <section className="section-navy py-20 md:py-28 relative">
        <div className="absolute inset-0 dot-pattern pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4">
          <SectionTitle
            label="Proceso"
            title="¿Cómo trabajamos?"
            subtitle="Un proceso simple, transparente y orientado a resultados."
            light
          />
          <div className="relative">
            <div
              className="hidden lg:block absolute top-9 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)' }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {process.map((step, i) => (
                <div key={step.num} className="reveal relative text-center lg:text-left" style={{ '--stagger': `${i * 80}ms` }}>
                  <div className="relative inline-flex lg:block">
                    <div
                      className="inline-flex items-center justify-center w-[72px] h-[72px] font-black text-xl mb-5 relative z-10 mx-auto lg:mx-0"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, #F5A520, #D48A0A)'
                          : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '16px',
                        color: 'white',
                        boxShadow: i === 0 ? '0 8px 24px rgba(232,119,34,0.4)' : 'none',
                      }}
                    >
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TECHNIQUES
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            label="Personalización"
            title="Técnicas de marcación"
            subtitle="Cada técnica tiene sus ventajas. Te asesoramos para elegir la mejor según tu producto y presupuesto."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techniques.map((tech, i) => (
              <div
                key={tech.name}
                className="reveal group p-5 text-center border border-gray-100 hover:border-[#0F2178]/20 hover:bg-[#F8F9FC] rounded-xl transition-all duration-300 cursor-default"
                style={{ '--stagger': `${(i % 6) * 60}ms` }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center text-2xl mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ background: 'linear-gradient(135deg, #F0F3FA, #E6ECF9)', borderRadius: '12px' }}
                >
                  {tech.icon}
                </div>
                <h3 className="font-bold text-[#0A0A23] text-sm mb-1.5 group-hover:text-[#0F2178] transition-colors">{tech.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed hidden md:block">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          INDUSTRIES
          ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-[#F8F9FC] border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10 reveal">
            Sectores que confían en nosotros
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {industries.map((ind, i) => (
              <div
                key={ind.name}
                className="reveal group flex flex-col items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#0F2178]/30 hover:shadow-md cursor-default transition-all duration-300"
                style={{ '--stagger': `${i * 40}ms` }}
              >
                <div className="relative w-16 h-16 flex-none">
                  <Image
                    src={ind.img}
                    alt={ind.name}
                    fill
                    sizes="64px"
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0F2178] text-center transition-colors duration-200 leading-tight">
                  {ind.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATALOG FEATURE
          ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal order-2 lg:order-1">
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: '20px', boxShadow: '0 20px 64px rgba(0,26,110,0.12)' }}
              >
                <Image
                  src="/images/catalogos-ksp/catalogo-a.png"
                  alt="Catálogo Digital KS Promocionales"
                  width={700}
                  height={525}
                  className="w-full object-cover"
                />
              </div>
            </div>
            <div className="reveal order-1 lg:order-2" style={{ '--stagger': '120ms' }}>
              <p className="section-label mb-4">Catálogos</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A23] leading-tight tracking-tight mb-5">
                Explora nuestra<br />colección completa
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Nuestros catálogos digitales están siempre actualizados con los últimos artículos
                y tendencias en artículos corporativos. Descarga o consulta online.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/catalogos-digitales" className="btn-blue gap-2">
                  Ver Catálogos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me gustaría recibir información sobre sus catálogos')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <WAIcon size="sm" />
                  Solicitar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        category={quickViewProduct ? getCategory(quickViewProduct.categoryId) : null}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
