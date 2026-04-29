'use client';

import Image from 'next/image';

// ─── Featured deliveries — real client brands ────────────────────────────────
const FEATURED = [
  {
    src: '/images/galeria-real/real-01.jpg',
    alt: 'Giroscopios Fluimucil personalizados con logo — entrega corporativa en Ecuador',
    brand: 'Fluimucil',
    type: 'Artículo corporativo',
  },
  {
    src: '/images/galeria-real/real-07.jpg',
    alt: 'Kit wellness NeumoFlux personalizado — maletín, toalla y spray con logo de empresa',
    brand: 'NeumoFlux',
    type: 'Kit wellness',
  },
  {
    src: '/images/galeria-real/real-14.jpg',
    alt: 'Balón de fútbol Bagovit Solar personalizado con logo — artículo deportivo promocional',
    brand: 'Bagovit Solar',
    type: 'Artículo deportivo',
  },
  {
    src: '/images/galeria-real/real-05.jpg',
    alt: 'Kits corporativos navideños personalizados — cajas regalo para empresas en Ecuador',
    brand: 'KS Corporativo',
    type: 'Kits de regalo',
  },
  {
    src: '/images/galeria-real/real-12.jpg',
    alt: 'Banda fitness y bolso deportivo FontActiv personalizados con logo de empresa',
    brand: 'FontActiv',
    type: 'Artículos fitness',
  },
];

const STATS = [
  { value: '500+', label: 'Empresas atendidas' },
  { value: '15+',  label: 'Años en el mercado' },
  { value: 'EC·CO', label: 'Ecuador y Colombia' },
  { value: '100%', label: 'Logo incluido siempre' },
];

// ─── Pool: 26 existing + 20 new real delivery images ────────────────────────
const POOL = [
  ...Array.from({ length: 26 }, (_, i) => ({
    src: `/images/galeria-real/producto-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Artículo promocional personalizado con logo para empresa — KS Promocionales #${i + 1}`,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    src: `/images/galeria-real/real-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Entrega real de producto corporativo personalizado — KS Promocionales Ecuador y Colombia`,
  })),
];

const S1 = POOL.filter((_, i) => i % 3 === 0);
const S2 = POOL.filter((_, i) => i % 3 === 1);
const S3 = POOL.filter((_, i) => i % 3 === 2);

// ─── FeaturedCard ────────────────────────────────────────────────────────────
function FeaturedCard({ img, sizesAttr, className = '', priority = false }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg group/feat ${className}`}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizesAttr}
        className="object-cover transition-transform duration-700 ease-out group-hover/feat:scale-[1.07]"
        {...(priority ? { priority: true } : { loading: 'lazy' })}
      />
      {/* Permanent bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2540]/90 via-[#1a3a5c]/15 to-transparent" />
      {/* Gold top-left corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c8a951]/60 rounded-tl-2xl opacity-0 group-hover/feat:opacity-100 transition-opacity duration-400" />
      {/* Brand info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-1 group-hover/feat:translate-y-0 transition-transform duration-300">
        <p className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-[#c8a951] mb-0.5 leading-none">
          {img.type}
        </p>
        <p className="text-white font-semibold text-sm md:text-[0.95rem] leading-snug">
          {img.brand}
        </p>
      </div>
    </div>
  );
}

// ─── MarqueeStrip — desktop animated ─────────────────────────────────────────
function MarqueeStrip({ items, reverse = false, speed = 44 }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden strip-root">
      <div
        className={`flex gap-2.5 ${reverse ? 'strip-r' : 'strip-l'}`}
        style={{ '--sp': `${speed}s` }}
      >
        {doubled.map((img, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 relative overflow-hidden rounded-xl shadow-sm group/card"
            style={{ width: '10.5rem', height: '13.5rem' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="168px"
              className="object-cover transition-transform duration-700 group-hover/card:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c]/65 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300 opacity-0 group-hover/card:opacity-100">
              <span className="text-[0.55rem] font-bold tracking-[0.15em] uppercase text-[#c8a951]">KS Promocionales</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MobileSwipeStrip — touch-scroll, no animation ───────────────────────────
function MobileSwipeStrip({ items }) {
  return (
    <div className="mobile-swipe-strip overflow-x-auto overflow-y-hidden">
      <div className="flex gap-2 pl-4 pr-6" style={{ width: 'max-content' }}>
        {items.map((img, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 relative overflow-hidden rounded-xl shadow-sm"
            style={{ width: '9rem', height: '11.5rem' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="144px"
              className="object-cover"
              loading="lazy"
            />
            {/* Always-on subtle gradient so it looks polished */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c]/30 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function RealProductsGallery() {
  return (
    <section
      className="bg-[#f7f5f0] overflow-hidden"
      aria-label="Galería de productos reales entregados a clientes"
    >
      {/* ── Header ── */}
      <div className="container mx-auto px-4 pt-14 md:pt-20 pb-10 text-center">
        <span className="inline-block text-xs font-bold tracking-[0.22em] uppercase text-[#c8a951] mb-3">
          Trabajo Real · Productos Entregados
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1a3a5c] mb-4 leading-tight">
          Experiencia que <em className="not-italic text-[#c8a951]">se ve</em>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
          Cada imagen es un producto real, personalizado y entregado a una empresa en Ecuador o Colombia.
          Esto es lo que hacemos todos los días.
        </p>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Sin fotos de stock',
            'Marcas reales como clientes',
            'Logo incluido en cada artículo',
            'Ecuador y Colombia',
          ].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0dbd0] rounded-full text-[0.72rem] font-medium text-gray-600 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a951] flex-shrink-0" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-[#1a3a5c] py-7 md:py-8">
        <dl className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="text-center md:border-r md:border-white/15 last:border-0 md:px-6"
            >
              <dt className="font-serif text-3xl md:text-4xl font-bold text-[#c8a951] leading-none mb-1.5 tabular-nums">
                {value}
              </dt>
              <dd className="text-white/65 text-xs md:text-sm tracking-wide leading-snug">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Editorial bento grid — Desktop ── */}
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="hidden md:grid gap-3 bento-grid">
          <FeaturedCard
            img={FEATURED[0]}
            className="bento-tall"
            sizesAttr="(max-width: 1280px) 42vw, 520px"
            priority
          />
          {FEATURED.slice(1).map((img, i) => (
            <FeaturedCard
              key={i}
              img={img}
              className="bento-sm"
              sizesAttr="(max-width: 1280px) 27vw, 340px"
            />
          ))}
        </div>

        {/* Mobile grid: 2-col with first image full-width */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          <FeaturedCard
            img={FEATURED[0]}
            className="col-span-2 h-56"
            sizesAttr="95vw"
            priority
          />
          {FEATURED.slice(1).map((img, i) => (
            <FeaturedCard key={i} img={img} className="h-44" sizesAttr="47vw" />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#e0dbd0]" />
          <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-[#c8a951] whitespace-nowrap">
            Más entregas reales
          </span>
          <div className="flex-1 h-px bg-[#e0dbd0]" />
        </div>
      </div>

      {/* ── Desktop: 3 animated marquee strips ── */}
      <div className="hidden md:flex flex-col gap-2.5 pb-1">
        <MarqueeStrip items={S1} reverse={false} speed={48} />
        <MarqueeStrip items={S2} reverse={true}  speed={60} />
        <MarqueeStrip items={S3} reverse={false} speed={40} />
      </div>

      {/* ── Mobile: 3 swipeable touch strips ── */}
      <div className="md:hidden flex flex-col gap-3 pb-1">
        <MobileSwipeStrip items={S1} />
        <MobileSwipeStrip items={S2} />
        <MobileSwipeStrip items={S3} />
        <p className="text-center text-[0.68rem] text-gray-400 tracking-wide mt-0.5 pb-1">
          Desliza para ver más →
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="container mx-auto px-4 pt-10 pb-14 md:pb-20 text-center">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#c8a951] mb-5">
          ¿Listo para tener productos así?
        </p>
        <a
          href="https://wa.me/593999814838?text=Hola, vi sus productos y quiero cotizar artículos promocionales con mi logo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#1a3a5c] hover:bg-[#0f2540] active:scale-[0.98] text-white px-8 py-4 font-semibold tracking-wide transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-xl hover:-translate-y-px"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Quiero productos así para mi empresa
        </a>
        <p className="mt-3 text-xs text-gray-400">Respondemos en minutos · Cotización sin compromiso</p>
      </div>

      {/* ── Animations + grid CSS ── */}
      <style jsx>{`
        @keyframes go-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes go-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .strip-l {
          animation: go-left var(--sp, 44s) linear infinite;
        }
        .strip-r {
          animation: go-right var(--sp, 52s) linear infinite;
        }
        .strip-root:hover .strip-l,
        .strip-root:hover .strip-r {
          animation-play-state: paused;
        }

        /* Desktop bento grid: tall left column + 2×2 right grid */
        .bento-grid {
          grid-template-columns: 3fr 2fr 2fr;
          grid-template-rows: 290px 290px;
        }
        .bento-tall {
          grid-row: 1 / span 2;
        }
        .bento-sm {
          /* fills the 4 remaining cells automatically */
        }

        /* Mobile swipe strips — hide scrollbar cross-browser */
        .mobile-swipe-strip {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-swipe-strip::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
