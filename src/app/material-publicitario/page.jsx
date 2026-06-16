import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Material Publicitario Personalizado para Empresas | KS Promocionales',
  description: 'Material publicitario personalizado con tu logo para empresas en Ecuador. Artículos para ferias, eventos y campañas corporativas. Cotiza sin compromiso por WhatsApp.',
  alternates: {
    canonical: `${BASE_URL}/material-publicitario/`,
    languages: {
      'es-EC': `${BASE_URL}/material-publicitario/`,
      'es-CO': `${BASE_URL}/material-publicitario/`,
      'x-default': `${BASE_URL}/material-publicitario/`,
    },
  },
  openGraph: {
    title: 'Material Publicitario Personalizado para Empresas | KS Promocionales',
    description: 'Material publicitario personalizado para ferias, eventos y campañas. Cotiza por WhatsApp.',
    type: 'website',
  },
};

const USES = [
  { title: 'Ferias y Exposiciones', desc: 'Material POP, artículos de atracción y regalos de stand para aumentar el flujo de visitantes y el recuerdo de marca.', items: ['Bolígrafos', 'Llaveros', 'Gorras', 'Bolsas'] },
  { title: 'Eventos Corporativos', desc: 'Welcome kits, kits de evento y artículos de cierre para que cada asistente se lleve tu marca a casa.', items: ['Mugs', 'Libretas', 'USB', 'Sets ejecutivos'] },
  { title: 'Campañas de Marca', desc: 'Material publicitario de alto impacto para activaciones, lanzamientos y campañas de reconocimiento de marca.', items: ['Tecnología', 'Mochilas', 'Textiles', 'Artículos premium'] },
  { title: 'Material POP', desc: 'Artículos de punto de venta y merchandising para retail, distribuidores y canales de venta al consumidor final.', items: ['Displays', 'Bolsas', 'Gorras', 'Llaveros'] },
];

const CATEGORIES = [
  { name: 'Bolígrafos Publicitarios', slug: 'boligrafos-publicitarios', desc: 'El artículo publicitario más distribuido. Desde 50 unidades con tu logo.' },
  { name: 'Gorras con Logo', slug: 'gorras-personalizadas', desc: 'Alta visibilidad en cada uso. Bordado computarizado.' },
  { name: 'Bolsas Promocionales', slug: 'mochilas-y-maletines-personalizados', desc: 'Bolsas y morrales con tu logo para distribución masiva.' },
  { name: 'Llaveros Personalizados', slug: 'llaveros-personalizados', desc: 'El artículo de mayor vida útil. Desde 50 unidades.' },
  { name: 'Mugs Publicitarios', slug: 'mugs-y-termos-personalizados', desc: 'Mugs y termos para ferias y eventos corporativos.' },
  { name: 'Tecnología Publicitaria', slug: 'tecnologia-promocional', desc: 'USB, cargadores y gadgets que impactan en ejecutivos.' },
];

const FAQS = [
  {
    question: '¿Qué es el material publicitario?',
    answer: 'El material publicitario son productos con la imagen de una marca, utilizados en ferias, eventos, campañas y puntos de venta para generar reconocimiento de marca y fidelizar clientes. Incluye artículos de escritura, gorras, bolsas, tecnología y más.',
  },
  {
    question: '¿Qué material publicitario es más efectivo para ferias?',
    answer: 'Para ferias empresariales los artículos más efectivos son bolígrafos (alta distribución), gorras (alta visibilidad), bolsas (se ven en el evento completo) y llaveros (alta vida útil). El combo bolígrafo + libreta + llavero es muy popular en ferias B2B.',
  },
  {
    question: '¿Cuál es el tiempo de producción del material publicitario?',
    answer: 'El tiempo estándar es de 10 a 15 días hábiles desde la aprobación del arte. Para ferias y eventos urgentes tenemos opciones express. Cotiza con anticipación para asegurar disponibilidad.',
  },
  {
    question: '¿Puedo pedir muestras antes de producir?',
    answer: 'Sí, para pedidos grandes podemos enviar muestras físicas previo a la producción. Para todos los pedidos hacemos aprobación de arte digital sin costo adicional.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Material Publicitario', item: `${BASE_URL}/material-publicitario/` },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Material Publicitario para Empresas — KS Promocionales',
  description: 'Categorías de material publicitario disponibles en Ecuador',
  url: `${BASE_URL}/material-publicitario/`,
  numberOfItems: CATEGORIES.length,
  itemListElement: CATEGORIES.map((cat, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: { '@type': 'Product', name: cat.name, url: `${BASE_URL}/categorias/${cat.slug}/` },
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
const WA_TEXT = encodeURIComponent('Hola, necesito cotizar material publicitario para mi empresa');

export default function MaterialPublicitarioPage() {
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
              <span className="text-white/80">Material Publicitario</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Material Publicitario<br />
              <span style={{ color: '#F5A520' }}>para Empresas</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Material publicitario personalizado con el logo de tu empresa para ferias, eventos y campañas en Ecuador.
              Alta calidad, entrega garantizada y cotización en 48 horas.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5 transition-all"
                style={{ background: '#F5A520' }}
              >
                Cotizar Material Publicitario
              </a>
              <Link
                href="/articulos-promocionales/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5 transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </section>

        {/* Uses */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-4 text-center">
              Material Publicitario por Uso
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
              Selecciona el tipo de material que mejor se adapta a tu campaña, evento o punto de venta.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USES.map((use) => (
                <div key={use.title} className="p-6 rounded-2xl border border-gray-100 bg-[#FAFBFF]">
                  <h3 className="font-bold text-[#0F2178] text-lg mb-2">{use.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{use.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {use.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{ background: 'rgba(0,26,110,0.07)', color: '#0F2178' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top categories */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">
              Artículos de Material Publicitario más solicitados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}/`}
                  className="group flex flex-col gap-2 p-5 rounded-xl bg-white border border-gray-100 hover:border-[#0F2178]/20 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-[#0A0A23] group-hover:text-[#0F2178] transition-colors">{cat.name}</h3>
                  <p className="text-gray-500 text-sm flex-1">{cat.desc}</p>
                  <span className="text-sm font-semibold" style={{ color: '#F5A520' }}>Ver categoría →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes sobre material publicitario
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
                { href: '/regalos-corporativos/', title: 'Regalos Corporativos', desc: 'Ideas para regalos empresariales personalizados.' },
                { href: '/merchandising-corporativo/', title: 'Merchandising Corporativo', desc: 'Productos para fortalecer la identidad de tu marca.' },
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
              ¿Necesitas material publicitario para tu próximo evento?
            </h2>
            <p className="text-white/70 mb-8">
              Cuéntanos la ocasión, la cantidad y el presupuesto. Te asesoramos gratis por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg transition-all"
              style={{ background: '#F5A520' }}
            >
              Cotizar Gratis por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
