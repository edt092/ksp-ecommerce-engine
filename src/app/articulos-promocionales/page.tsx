import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Artículos Promocionales Personalizados para Empresas | KS Promocionales',
  description: 'Catálogo de artículos promocionales personalizados para empresas en Ecuador. Bolígrafos, mugs, gorras, tecnología, maletines y más con tu logo. Cotiza sin compromiso.',
  alternates: {
    canonical: `${BASE_URL}/articulos-promocionales/`,
    languages: {
      'es-EC': `${BASE_URL}/articulos-promocionales/`,
      'es-CO': `${BASE_URL}/articulos-promocionales/`,
      'x-default': `${BASE_URL}/articulos-promocionales/`,
    },
  },
  openGraph: {
    title: 'Artículos Promocionales Personalizados para Empresas | KS Promocionales',
    description: 'Catálogo de artículos promocionales personalizados para empresas. Bolígrafos, mugs, gorras, tecnología y más con tu logo.',
    type: 'website',
  },
};

const CATEGORIES = [
  {
    name: 'Bolígrafos Promocionales',
    slug: 'boligrafos-publicitarios',
    description: 'Bolígrafos, lapiceros y esferos con tu logo. Metálicos, ecológicos y ejecutivos desde 50 unidades.',
    keyword: 'bolígrafos promocionales',
  },
  {
    name: 'Mugs y Termos Personalizados',
    slug: 'mugs-y-termos-personalizados',
    description: 'Mugs de cerámica y termos de acero inoxidable personalizados. El regalo de oficina más usado.',
    keyword: 'mugs y termos',
  },
  {
    name: 'Gorras Personalizadas',
    slug: 'gorras-personalizadas',
    description: 'Gorras con bordado computarizado de tu logo. Alta visibilidad de marca en cada uso.',
    keyword: 'gorras personalizadas',
  },
  {
    name: 'Memorias USB Personalizadas',
    slug: 'memorias-usb-personalizadas',
    description: 'USB de 8GB, 16GB y 32GB en formatos tarjeta, llave y clip con tu marca grabada.',
    keyword: 'memorias USB',
  },
  {
    name: 'Mochilas y Morrales',
    slug: 'mochilas-y-maletines-personalizados',
    description: 'Morrales corporativos, mochilas ejecutivas y maletines personalizados con tu logo.',
    keyword: 'morrales y bolsas',
  },
  {
    name: 'Tecnología Promocional',
    slug: 'tecnologia-promocional',
    description: 'Audífonos, parlantes bluetooth, cargadores y gadgets personalizados para ejecutivos.',
    keyword: 'tecnología promocional',
  },
  {
    name: 'Artículos de Oficina',
    slug: 'articulos-de-oficina-personalizados',
    description: 'Organizadores, agendas, sets de escritorio y artículos corporativos para el entorno laboral.',
    keyword: 'artículos de oficina',
  },
  {
    name: 'Llaveros Personalizados',
    slug: 'llaveros-personalizados',
    description: 'Llaveros de metal, cuero y PVC con tu logo. Alta vida útil y distribución masiva.',
    keyword: 'llaveros personalizados',
  },
  {
    name: 'Camisetas y Confección',
    slug: 'camisetas-y-confeccion-corporativa',
    description: 'Uniformes y camisetas corporativas con tu logo bordado o estampado.',
    keyword: 'confección corporativa',
  },
  {
    name: 'Artículos Ecológicos',
    slug: 'ecologia',
    description: 'Bolígrafos, libretas y bolsas ecológicas. Merchandising sostenible para empresas ESG.',
    keyword: 'artículos ecológicos',
  },
  {
    name: 'Paraguas Personalizados',
    slug: 'paraguas',
    description: 'Paraguas y sombrillas con tu logo. Alta visibilidad en días de lluvia.',
    keyword: 'paraguas personalizados',
  },
  {
    name: 'Antiestrés Personalizados',
    slug: 'antiestres',
    description: 'Artículos antiestrés personalizados para ferias, eventos y campañas masivas.',
    keyword: 'antiestrés',
  },
];

const FAQS = [
  {
    question: '¿Qué son los artículos promocionales?',
    answer: 'Los artículos promocionales son productos personalizados con el logo o mensaje de una empresa, utilizados para aumentar el reconocimiento de marca, fidelizar clientes y motivar a los colaboradores. Incluyen bolígrafos, mugs, gorras, mochilas, memorias USB, tecnología y más.',
  },
  {
    question: '¿Cuál es el mínimo de pedido para artículos promocionales?',
    answer: 'El mínimo varía según el producto: bolígrafos desde 50 unidades, mugs desde 24 unidades, gorras desde 12 unidades, memorias USB desde 25 unidades. Contáctanos por WhatsApp para confirmar el mínimo exacto de cada referencia.',
  },
  {
    question: '¿Cuánto tiempo tarda la producción de artículos promocionales?',
    answer: 'El tiempo estándar de producción es de 10 a 15 días hábiles desde la aprobación del arte. Para pedidos urgentes contamos con opciones express. Hacemos envíos a todo Ecuador.',
  },
  {
    question: '¿Qué técnicas de personalización utilizan?',
    answer: 'Trabajamos con serigrafía, tampografía, sublimación, grabado láser, bordado computarizado e impresión UV. La técnica recomendada depende del material, la cantidad y el tipo de diseño.',
  },
  {
    question: '¿A qué ciudades de Ecuador hacen envíos?',
    answer: 'Realizamos envíos a todo Ecuador: Quito, Guayaquil, Cuenca, Manta, Ambato y otras ciudades. Cotiza por WhatsApp para conocer tiempos y costos de envío a tu ciudad.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Artículos Promocionales', item: `${BASE_URL}/articulos-promocionales/` },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Artículos Promocionales Personalizados para Empresas — KS Promocionales',
  description: 'Catálogo de artículos promocionales disponibles en Ecuador',
  url: `${BASE_URL}/articulos-promocionales/`,
  numberOfItems: CATEGORIES.length,
  itemListElement: CATEGORIES.map((cat, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Product',
      name: cat.name,
      url: `${BASE_URL}/categorias/${cat.slug}/`,
    },
  })),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const WA_NUMBER = '593999814838';
const WA_TEXT = encodeURIComponent('Hola, quiero cotizar artículos promocionales para mi empresa');

export default function ArticulosPromocionalesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main>
        {/* Hero */}
        <section
          style={{ background: 'linear-gradient(135deg, #000D3D 0%, #001259 50%, #0F2178 100%)', paddingTop: '7rem', paddingBottom: '4rem' }}
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <nav className="flex items-center gap-2 text-white/50 text-sm mb-8">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-white/80">Artículos Promocionales</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Artículos Promocionales<br />
              <span style={{ color: '#F5A520' }}>Personalizados para Empresas</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Catálogo B2B de artículos promocionales con tu logo en Ecuador.
              Bolígrafos, mugs, gorras, tecnología y más. Personalización profesional, entrega garantizada.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5 transition-all"
                style={{ background: '#F5A520' }}
              >
                Cotizar por WhatsApp
              </a>
              <Link
                href="/regalos-corporativos/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5 transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Regalos Corporativos
              </Link>
            </div>
          </div>
        </section>

        {/* Categories grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-4 text-center">
              Categorías de Artículos Promocionales
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
              Más de 3,500 referencias personalizables con el logo de tu empresa. Encuentra la categoría ideal para tu campaña o evento.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}/`}
                  className="group flex flex-col gap-3 p-6 rounded-2xl border border-gray-100 hover:border-[#0F2178]/20 hover:shadow-lg transition-all duration-300"
                  style={{ background: '#FAFBFF' }}
                >
                  <h3 className="font-bold text-[#0A0A23] text-lg group-hover:text-[#0F2178] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{cat.description}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: '#F5A520' }}
                  >
                    Ver {cat.keyword}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-12 text-center">
              ¿Por qué elegir KS Promocionales?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: '+3,500 referencias', desc: 'El catálogo más completo de artículos promocionales en Ecuador.' },
                { title: 'Personalización profesional', desc: 'Serigrafía, grabado láser, bordado y más. Tu logo en cada artículo con alta calidad.' },
                { title: 'Cotización en 48 horas', desc: 'Respuesta rápida por WhatsApp. Sin formularios complicados ni esperas largas.' },
              ].map((b) => (
                <div key={b.title} className="text-center">
                  <h3 className="font-bold text-[#0F2178] text-lg mb-3">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hub links */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">Soluciones relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { href: '/regalos-corporativos/', title: 'Regalos Corporativos', desc: 'Ideas y categorías para regalos empresariales personalizados.' },
                { href: '/material-publicitario/', title: 'Material Publicitario', desc: 'Artículos para ferias, eventos y activaciones de marca.' },
                { href: '/merchandising-corporativo/', title: 'Merchandising Corporativo', desc: 'Productos para fortalecer la identidad de tu marca.' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-6 rounded-2xl border border-gray-100 hover:border-[#0F2178]/20 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-[#0F2178] mb-2">{link.title}</h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes sobre artículos promocionales
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#0A0A23] mb-3">{faq.question}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-16"
          style={{ background: 'linear-gradient(135deg, #000D3D 0%, #0F2178 100%)' }}
        >
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Listo para cotizar tus artículos promocionales?
            </h2>
            <p className="text-white/70 mb-8">
              Cuéntanos qué necesitas por WhatsApp y te respondemos en máximo 48 horas con opciones y precios.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg transition-all"
              style={{ background: '#F5A520' }}
            >
              Solicitar Cotización Gratis
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
