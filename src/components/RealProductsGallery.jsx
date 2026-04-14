'use client';

import Image from 'next/image';

const IMAGES = Array.from({ length: 26 }, (_, i) => ({
  src: `/images/galeria-real/producto-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Producto promocional personalizado KS Promocionales #${i + 1} — artículo corporativo con logo para empresas en Ecuador`,
}));

// Split into two strips for opposite-direction scrolling
const STRIP_A = IMAGES.slice(0, 13);
const STRIP_B = IMAGES.slice(13, 26);

function MarqueeStrip({ images, direction = 'left', speed = 35 }) {
  // Duplicate for seamless loop
  const doubled = [...images, ...images];
  const animClass = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div className="marquee-track overflow-hidden w-full">
      <div
        className={`marquee-inner flex gap-3 ${animClass}`}
        style={{ '--marquee-speed': `${speed}s` }}
      >
        {doubled.map((img, idx) => (
          <div
            key={idx}
            className="marquee-item flex-shrink-0 w-52 h-52 md:w-64 md:h-64 relative overflow-hidden rounded-lg shadow-md group"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 208px, 256px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle brand tint on hover */}
            <div className="absolute inset-0 bg-[#1a3a5c]/0 group-hover:bg-[#1a3a5c]/20 transition-colors duration-500" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: scroll-left var(--marquee-speed, 35s) linear infinite;
        }
        .marquee-right {
          animation: scroll-right var(--marquee-speed, 40s) linear infinite;
        }
        .marquee-track:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default function RealProductsGallery() {
  return (
    <section
      className="py-14 md:py-20 bg-[#f7f5f0] overflow-hidden"
      aria-label="Galería de productos reales entregados a clientes"
    >
      {/* Header */}
      <div className="container mx-auto px-4 mb-10 text-center">
        <span
          className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#c8a951] mb-3"
          aria-hidden="true"
        >
          Trabajo Real · Productos Entregados
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1a3a5c] mb-4 leading-tight">
          Experiencia que <em className="not-italic text-[#c8a951]">se ve</em>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          Cada imagen es un producto real, personalizado y entregado a una empresa en Ecuador o Colombia.
          Esto es lo que hacemos todos los días.
        </p>

        {/* Trust signals row */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8a951] inline-block"></span>
            Fotos de productos reales — sin stock
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8a951] inline-block"></span>
            Clientes en Ecuador y Colombia
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8a951] inline-block"></span>
            Impresión con logo incluida
          </div>
        </div>
      </div>

      {/* Marquee strips */}
      <div className="flex flex-col gap-3">
        <MarqueeStrip images={STRIP_A} direction="left"  speed={38} />
        <MarqueeStrip images={STRIP_B} direction="right" speed={45} />
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 mt-10 text-center">
        <a
          href="https://wa.me/593999814838?text=Hola, vi sus productos y quiero cotizar artículos promocionales con mi logo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#1a3a5c] hover:bg-[#0f2540] text-white px-8 py-4 font-semibold tracking-wide transition-colors duration-300 text-sm md:text-base"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Quiero productos así para mi empresa
        </a>
      </div>
    </section>
  );
}
