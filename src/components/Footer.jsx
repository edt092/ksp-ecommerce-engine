'use client';

import Link from 'next/link';
import Image from 'next/image';

const WA_NUMBER = '593999814838';
const WA_TEXT   = encodeURIComponent('Hola, quiero cotizar productos promocionales para mi empresa');

const quickLinks = [
  { name: 'Inicio',                       href: '/' },
  { name: 'Artículos Promocionales',      href: '/articulos-promocionales/' },
  { name: 'Regalos Corporativos',         href: '/regalos-corporativos/' },
  { name: 'Material Publicitario',         href: '/material-publicitario/' },
  { name: 'Merchandising Corporativo',    href: '/merchandising-corporativo/' },
  { name: 'Catálogos Digitales',          href: '/catalogos-digitales' },
  { name: 'Blog',                         href: '/blog' },
  { name: 'Nosotros',                     href: '/nosotros' },
  { name: 'Contacto',                     href: '/contacto' },
  { name: 'Política de Privacidad',       href: '/politica-de-privacidad' },
];

const categories = [
  { name: 'Artículos de Escritura',  href: '/categorias/boligrafos-publicitarios/' },
  { name: 'Tecnología Promocional',  href: '/categorias/tecnologia-promocional/' },
  { name: 'Mugs y Termos',           href: '/categorias/mugs-y-termos-personalizados/' },
  { name: 'Artículos de Oficina',    href: '/categorias/articulos-de-oficina-personalizados/' },
  { name: 'Ecología',                href: '/categorias/ecologia/' },
  { name: 'Llaveros',                href: '/categorias/llaveros-personalizados/' },
  { name: 'Deportes',                href: '/categorias/deportes/' },
  { name: 'Novedades',               href: '/categorias/novedades/' },
];

const geoLinks = [
  { name: 'Ecuador',     href: '/productos-promocionales-ecuador' },
  { name: 'Quito',       href: '/productos-promocionales-ecuador/quito' },
  { name: 'Guayaquil',   href: '/productos-promocionales-ecuador/guayaquil' },
  { name: 'Cuenca',      href: '/productos-promocionales-ecuador' },
  { name: 'Ambato',      href: '/productos-promocionales-ecuador' },
  { name: 'Machala',     href: '/productos-promocionales-ecuador' },
];

const WAIcon = ({ size = 'sm' }) => (
  <svg className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* ── Pre-footer CTA ── */}
      <div
        className="relative overflow-hidden py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #091557 0%, #0D0D1A 60%, #091557 100%)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Orange accent top */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #F5A520 25%, #FFBA3D 50%, #F5A520 75%, transparent)' }}
        />
        {/* Orange radial glow */}
        <div
          className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,165,32,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
            ¿Tienes un proyecto?
          </p>
          <h2
            className="font-black text-white leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            Impulsa tu marca con{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #ffffff, #FFB87A, #F5A520)' }}
            >
              productos que se recuerdan
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto mb-8">
            Cotiza gratis por WhatsApp. Respuesta en máximo 24 horas.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBD57] text-white px-8 py-4 font-bold text-sm tracking-wide transition-all duration-200 hover:-translate-y-1 pulse-whatsapp"
            style={{ borderRadius: '12px', boxShadow: '0 8px 28px rgba(37,211,102,0.4)' }}
          >
            <WAIcon size="sm" />
            Cotizar por WhatsApp
          </a>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div style={{ background: '#0D0D1A' }} className="text-white">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand — 2 cols */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-5">
                <Image
                  src="/ksp-1.png"
                  alt="KS Promocionales"
                  width={140}
                  height={46}
                  className="h-11 w-auto object-contain"
                />
              </Link>
              <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-xs">
                Artículos publicitarios y regalos corporativos de alta calidad
                para empresas en Ecuador. Tu marca en cada detalle.
              </p>

              {/* Geo tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['🇪🇨 Ecuador', '+3,500 Productos', '⚡ 48h Respuesta'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wider text-white/30 border border-white/10 px-2.5 py-1"
                    style={{ borderRadius: '6px' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Socials */}
              <div className="flex gap-2">
                {[
                  {
                    label: 'Facebook',
                    href: 'https://facebook.com/kspromocionales',
                    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                  },
                  {
                    label: 'Instagram',
                    href: 'https://instagram.com/kspromocionales',
                    path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
                  },
                ].map(({ label, href, path }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-white/12 hover:border-[#F5A520] hover:bg-[#F5A520] text-white/35 hover:text-white flex items-center justify-center transition-all duration-200"
                    style={{ borderRadius: '8px' }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
                  </a>
                ))}
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 border border-white/12 hover:border-[#25D366] hover:bg-[#25D366] text-white/35 hover:text-white flex items-center justify-center transition-all duration-200"
                  style={{ borderRadius: '8px' }}
                >
                  <WAIcon size="sm" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-5">Navegación</h4>
              <ul className="space-y-2.5">
                {quickLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-150 group"
                    >
                      <span className="w-3 h-px bg-white/15 group-hover:bg-[#F5A520] group-hover:w-5 transition-all duration-200" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-5">Categorías</h4>
              <ul className="space-y-2.5">
                {categories.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-150 group"
                    >
                      <span className="w-3 h-px bg-white/15 group-hover:bg-[#F5A520] group-hover:w-5 transition-all duration-200" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Geo + Contact */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-5">Ciudades</h4>
              <ul className="space-y-2.5 mb-8">
                {geoLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-150 group"
                    >
                      <span className="w-3 h-px bg-white/15 group-hover:bg-[#F5A520] group-hover:w-5 transition-all duration-200" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-4">Contacto</h4>
              <a
                href="mailto:claudiagonzalez@kronosolopromocionales.com"
                className="text-xs text-white/45 hover:text-white transition-colors block mb-3 break-all"
              >
                claudiagonzalez@kronosolopromocionales.com
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:text-[#4EE68A] transition-colors"
              >
                <WAIcon size="sm" />
                +593 999 814 838
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-white/25 text-xs">
              © {year} KS Promocionales · RUC 1719403345001 · Quito, Ecuador
            </p>
            <p className="text-white/25 text-xs">
              Desarrollado por{' '}
              <a
                href="https://edwinbayonaitmanager.online/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
              >
                Bayona Digital Systems
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
