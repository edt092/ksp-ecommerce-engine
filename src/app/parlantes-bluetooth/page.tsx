import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Parlantes Bluetooth Personalizados para Empresas | KS Promocionales',
  description: 'Parlantes bluetooth personalizados con tu logo para empresas en Ecuador. Regalos corporativos tecnológicos de alto impacto para ejecutivos, clientes VIP y eventos.',
  alternates: {
    canonical: `${BASE_URL}/parlantes-bluetooth/`,
    languages: {
      'es-EC': `${BASE_URL}/parlantes-bluetooth/`,
      'es-CO': `${BASE_URL}/parlantes-bluetooth/`,
      'x-default': `${BASE_URL}/parlantes-bluetooth/`,
    },
  },
  openGraph: {
    title: 'Parlantes Bluetooth Personalizados para Empresas | KS Promocionales',
    description: 'Parlantes bluetooth personalizados con logo para regalos corporativos de alto impacto. Ecuador.',
    type: 'website',
  },
};

const FAQS = [
  {
    question: '¿Se pueden personalizar los parlantes bluetooth con el logo de mi empresa?',
    answer: 'Sí. Los parlantes bluetooth se personalizan con grabado láser, impresión UV o serigrafía según el modelo. La personalización incluye logo, nombre de empresa y colores corporativos.',
  },
  {
    question: '¿Cuál es el mínimo de pedido para parlantes bluetooth personalizados?',
    answer: 'El mínimo varía según el modelo, generalmente desde 10 a 25 unidades. Para pedidos de muestra o test unitario, contáctanos por WhatsApp y evaluamos opciones.',
  },
  {
    question: '¿Para qué ocasiones son ideales los parlantes bluetooth como regalo corporativo?',
    answer: 'Son perfectos para reconocimientos a ejecutivos y clientes VIP, premios de convenciones de ventas, kits de bienvenida para directivos, regalos de cierre de proyectos importantes y campañas de fidelización de clientes premium.',
  },
  {
    question: '¿Cuánto tiempo tarda la producción de parlantes personalizados?',
    answer: 'El tiempo de producción es de 10 a 20 días hábiles desde la aprobación del arte, dependiendo de la cantidad y el modelo. Contacta con tiempo suficiente antes de tu evento.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Tecnología Promocional', item: `${BASE_URL}/categorias/tecnologia-promocional/` },
    { '@type': 'ListItem', position: 3, name: 'Parlantes Bluetooth', item: `${BASE_URL}/parlantes-bluetooth/` },
  ],
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
const WA_TEXT = encodeURIComponent('Hola, quiero cotizar parlantes bluetooth personalizados con el logo de mi empresa');

export default function ParlantesBluetooth() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #000D3D 0%, #001259 50%, #0F2178 100%)', paddingTop: '7rem', paddingBottom: '4rem' }}>
          <div className="container mx-auto px-4 max-w-5xl">
            <nav className="flex items-center gap-2 text-white/50 text-sm mb-8">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/categorias/tecnologia-promocional/" className="hover:text-white transition-colors">Tecnología</Link>
              <span>/</span>
              <span className="text-white/80">Parlantes Bluetooth</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Parlantes Bluetooth<br />
              <span style={{ color: '#F5A520' }}>Personalizados para Empresas</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Parlantes bluetooth con el logo de tu empresa — uno de los regalos corporativos tecnológicos
              más valorados. Ideal para ejecutivos, clientes VIP y reconocimientos de alto impacto en Ecuador.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5"
                style={{ background: '#F5A520' }}
              >
                Cotizar Parlantes
              </a>
              <Link
                href="/categorias/tecnologia-promocional/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Tecnología Promocional
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-12 text-center">
              ¿Por qué elegir parlantes bluetooth como regalo corporativo?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Alto valor percibido', desc: 'Un parlante bluetooth es uno de los regalos que el receptor más valora y usa en su vida diaria — en casa, oficina o viajes.' },
                { title: 'Exposición de marca constante', desc: 'Cada vez que el parlante suena, tu logo está presente. Tus clientes y su círculo ven tu marca en cada uso.' },
                { title: 'Diferenciación premium', desc: 'Un parlante personalizado posiciona a tu empresa en la categoría premium y comunica que valoras a quien lo recibe.' },
              ].map((b) => (
                <div key={b.title} className="text-center p-6 rounded-2xl bg-[#FAFBFF] border border-gray-100">
                  <h3 className="font-bold text-[#0F2178] text-lg mb-3">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">
              Cuándo regalar parlantes bluetooth personalizados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Reconocimientos a los mejores vendedores del año',
                'Regalos de cierre de proyectos para clientes VIP',
                'Kits ejecutivos para directivos y gerentes',
                'Premios en convenciones de ventas y congresos',
                'Regalos de fin de año para clientes estratégicos',
                'Welcome kits para nuevos clientes corporativos de alto valor',
              ].map((use) => (
                <div key={use} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <span className="mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'rgba(232,119,34,0.12)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#F5A520' }} />
                  </span>
                  <p className="text-gray-600 text-sm">{use}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related tech */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">Tecnología promocional relacionada</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: '/audifonos-promocionales/', title: 'Audífonos Promocionales', desc: 'Audífonos bluetooth personalizados para eventos y campañas.' },
                { href: '/soportes-para-celular/', title: 'Soportes para Celular', desc: 'Soportes y accesorios de escritorio con tu logo.' },
                { href: '/categorias/tecnologia-promocional/', title: 'Tecnología Completa', desc: 'Todo el catálogo de tecnología promocional.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <h3 className="font-bold text-[#0F2178] mb-1">{link.title}</h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes — Parlantes bluetooth personalizados
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#0A0A23] mb-3">{faq.question}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #000D3D 0%, #0F2178 100%)' }}>
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Cotiza parlantes bluetooth personalizados
            </h2>
            <p className="text-white/70 mb-8">
              Cuéntanos la cantidad, el presupuesto y la ocasión. Respondemos en máximo 48 horas con opciones y precios.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg"
              style={{ background: '#F5A520' }}
            >
              Solicitar Cotización por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
