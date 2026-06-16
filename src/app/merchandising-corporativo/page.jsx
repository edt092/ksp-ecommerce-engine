import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Merchandising Corporativo Personalizado para Empresas | KS Promocionales',
  description: 'Merchandising corporativo personalizado para empresas en Ecuador. Artículos con tu logo para fortalecer la identidad de marca en eventos, ferias y campañas corporativas.',
  alternates: {
    canonical: `${BASE_URL}/merchandising-corporativo/`,
    languages: {
      'es-EC': `${BASE_URL}/merchandising-corporativo/`,
      'es-CO': `${BASE_URL}/merchandising-corporativo/`,
      'x-default': `${BASE_URL}/merchandising-corporativo/`,
    },
  },
  openGraph: {
    title: 'Merchandising Corporativo Personalizado para Empresas | KS Promocionales',
    description: 'Merchandising corporativo personalizado para fortalecer la identidad de marca. Ecuador.',
    type: 'website',
  },
};

const TYPES = [
  {
    title: 'Merchandising para Empleados',
    desc: 'Artículos para onboarding, aniversarios, reconocimientos y cultura corporativa. Fortalece el sentido de pertenencia con tu marca.',
    examples: 'Mugs, mochilas, camisetas, sets de oficina',
  },
  {
    title: 'Merchandising para Clientes',
    desc: 'Regalos de fidelización para clientes VIP, cierre de negocios y campañas de retención. Artículos premium que generan recordación.',
    examples: 'Tecnología, maletines, sets ejecutivos',
  },
  {
    title: 'Merchandising para Eventos',
    desc: 'Material de impacto para lanzamientos, convenciones, ferias y activaciones de marca. Alta visibilidad y tasa de retención.',
    examples: 'Gorras, bolsas, llaveros, termos',
  },
  {
    title: 'Merchandising Ecológico',
    desc: 'Artículos sostenibles alineados con políticas ESG. Demuestra el compromiso ambiental de tu empresa con materiales reciclados y bambú.',
    examples: 'Bolígrafos ecológicos, libretas, bolsas reutilizables',
  },
  {
    title: 'Merchandising Tecnológico',
    desc: 'Gadgets y artículos de tecnología para ejecutivos, equipos de ventas y clientes de alta tecnología. El merchandising más valorado.',
    examples: 'USB, audífonos, cargadores, parlantes',
  },
  {
    title: 'Merchandising por Temporada',
    desc: 'Kits personalizados para fin de año, Día de la Mujer, Día del Trabajo y otras fechas clave. Anticipa tu pedido con tiempo.',
    examples: 'Sets navideños, kits temáticos, packaging especial',
  },
];

const CATEGORIES = [
  { name: 'Artículos Promocionales', slug: 'boligrafos-publicitarios', desc: 'Catálogo completo de artículos para tu estrategia de marca.' },
  { name: 'Regalos Corporativos', href: '/regalos-corporativos/', desc: 'Ideas y categorías para regalar en tu empresa.' },
  { name: 'Tecnología Corporativa', slug: 'tecnologia-promocional', desc: 'Gadgets y tecnología con el logo de tu empresa.' },
  { name: 'Textiles Corporativos', slug: 'camisetas-y-confeccion-corporativa', desc: 'Uniformes y camisetas para tu equipo.' },
  { name: 'Mugs y Termos', slug: 'mugs-y-termos-personalizados', desc: 'Los artículos de oficina más usados.' },
  { name: 'Artículos Ecológicos', slug: 'ecologia', desc: 'Merchandising sostenible para empresas ESG.' },
];

const FAQS = [
  {
    question: '¿Qué es el merchandising corporativo?',
    answer: 'El merchandising corporativo son los artículos, productos y materiales personalizados con la imagen de una empresa, utilizados para fortalecer la identidad de marca, fidelizar clientes, motivar colaboradores y aumentar el reconocimiento de la empresa. Incluye mugs, gorras, tecnología, textiles y más.',
  },
  {
    question: '¿Cuál es la diferencia entre merchandising corporativo y artículos promocionales?',
    answer: 'Aunque se usan indistintamente, el merchandising corporativo se enfoca en fortalecer la identidad de marca internamente (empleados, socios) y en relaciones B2B de largo plazo. Los artículos promocionales tienen un enfoque más masivo y están orientados a campañas, ferias y distribución de gran volumen.',
  },
  {
    question: '¿Qué presupuesto necesito para una campaña de merchandising corporativo?',
    answer: 'El presupuesto varía según los artículos y cantidades. Podemos diseñar campañas desde $200 USD para artículos de gran volumen (bolígrafos, llaveros) hasta kits ejecutivos premium con presupuestos mayores. Cotiza sin compromiso por WhatsApp.',
  },
  {
    question: '¿Puedo combinar diferentes artículos en un kit de merchandising?',
    answer: 'Sí, creamos kits corporativos combinando múltiples artículos: por ejemplo, mochila + mug + bolígrafo + libreta para un welcome kit completo. También hacemos packaging personalizado para kits de regalo.',
  },
  {
    question: '¿A qué ciudades de Ecuador hacen envíos?',
    answer: 'Hacemos envíos a todo Ecuador: Quito, Guayaquil, Cuenca, Manta, Ambato y el resto del país. Contacta por WhatsApp para conocer los tiempos de envío a tu ciudad.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Merchandising Corporativo', item: `${BASE_URL}/merchandising-corporativo/` },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Merchandising Corporativo para Empresas — KS Promocionales',
  description: 'Tipos de merchandising corporativo disponibles en Ecuador',
  url: `${BASE_URL}/merchandising-corporativo/`,
  numberOfItems: TYPES.length,
  itemListElement: TYPES.map((t, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: { '@type': 'Service', name: t.title },
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
const WA_TEXT = encodeURIComponent('Hola, necesito asesoría en merchandising corporativo para mi empresa');

export default function MerchandisingCorporativoPage() {
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
              <span className="text-white/80">Merchandising Corporativo</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Merchandising Corporativo<br />
              <span style={{ color: '#F5A520' }}>Personalizado para tu Marca</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Artículos corporativos con el logo de tu empresa para fortalecer la identidad de marca, fidelizar clientes
              y motivar colaboradores en Ecuador.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5 transition-all"
                style={{ background: '#F5A520' }}
              >
                Asesoría Gratis por WhatsApp
              </a>
              <Link
                href="/articulos-promocionales/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5 transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Catálogo
              </Link>
            </div>
          </div>
        </section>

        {/* Types of merchandising */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-4 text-center">
              Tipos de Merchandising Corporativo
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
              Cada campaña de merchandising tiene un objetivo distinto. Elige la estrategia correcta según tu audiencia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TYPES.map((type) => (
                <div key={type.title} className="p-6 rounded-2xl border border-gray-100 bg-[#FAFBFF] flex flex-col gap-3">
                  <h3 className="font-bold text-[#0F2178] text-lg">{type.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{type.desc}</p>
                  <p className="text-xs font-medium text-[#F5A520]">{type.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">
              Categorías de Merchandising Corporativo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug || cat.href}
                  href={cat.href || `/categorias/${cat.slug}/`}
                  className="group block p-5 rounded-xl bg-white border border-gray-100 hover:border-[#0F2178]/20 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-[#0A0A23] group-hover:text-[#0F2178] transition-colors mb-1">{cat.name}</h3>
                  <p className="text-gray-500 text-sm">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes sobre merchandising corporativo
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="bg-[#FAFBFF] rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#0A0A23] mb-3">{faq.question}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hub links */}
        <section className="py-12 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { href: '/articulos-promocionales/', title: 'Artículos Promocionales', desc: 'Catálogo completo de más de 3,500 referencias.' },
                { href: '/material-publicitario/', title: 'Material Publicitario', desc: 'Artículos para ferias, eventos y campañas.' },
                { href: '/regalos-corporativos/', title: 'Regalos Corporativos', desc: 'Ideas de regalos para empresas y directivos.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-5 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all">
                  <h3 className="font-bold text-[#0F2178] mb-1">{link.title}</h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </Link>
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
              Diseñemos juntos tu estrategia de merchandising
            </h2>
            <p className="text-white/70 mb-8">
              Cuéntanos tu objetivo, tu audiencia y tu presupuesto. Te asesoramos gratis y sin compromiso por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg transition-all"
              style={{ background: '#F5A520' }}
            >
              Hablar con un Asesor
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
