import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Audífonos Bluetooth Promocionales para Empresas | KS Promocionales',
  description: 'Audífonos bluetooth promocionales y personalizados con tu logo para empresas en Ecuador. Regalos corporativos tecnológicos para ejecutivos, ferias y eventos corporativos.',
  alternates: {
    canonical: `${BASE_URL}/audifonos-promocionales/`,
    languages: {
      'es-EC': `${BASE_URL}/audifonos-promocionales/`,
      'es-CO': `${BASE_URL}/audifonos-promocionales/`,
      'x-default': `${BASE_URL}/audifonos-promocionales/`,
    },
  },
  openGraph: {
    title: 'Audífonos Bluetooth Promocionales para Empresas | KS Promocionales',
    description: 'Audífonos bluetooth personalizados para regalos corporativos. Ecuador.',
    type: 'website',
  },
};

const TYPES = [
  { name: 'Audífonos over-ear', desc: 'Máxima comodidad y calidad de sonido. Ideal para ejecutivos y trabajo remoto. Alto valor percibido.' },
  { name: 'Audífonos in-ear (earbuds)', desc: 'Compactos y deportivos. Populares en campañas masivas y eventos con audiencia joven.' },
  { name: 'Diademas estéreo', desc: 'Diseño clásico con buen audio. Perfectos para kits de oficina y reconocimientos.' },
  { name: 'Audífonos con micrófono', desc: 'Ideales para trabajo remoto e híbrido. El regalo más funcional en el contexto actual.' },
];

const FAQS = [
  {
    question: '¿Se pueden personalizar audífonos bluetooth con el logo de mi empresa?',
    answer: 'Sí. Los audífonos se personalizan con grabado láser, impresión UV o serigrafía en la carcasa. También se puede personalizar la caja y el empaque para mayor impacto de presentación.',
  },
  {
    question: '¿Cuál es el mínimo de pedido para audífonos personalizados?',
    answer: 'El mínimo varía por modelo: desde 10 unidades para modelos estándar y 25+ para modelos personalizados en colores corporativos. Consulta disponibilidad por WhatsApp.',
  },
  {
    question: '¿Qué tipo de audífonos son mejores para regalar en una empresa?',
    answer: 'Depende del presupuesto y el perfil del receptor. Para ejecutivos, los over-ear son los más valorados. Para equipos grandes y ferias, los in-ear son más económicos y populares. Para trabajo remoto e híbrido, los modelos con micrófono integrado son los más funcionales.',
  },
  {
    question: '¿Cuánto tiempo tarda la producción?',
    answer: 'Entre 10 y 20 días hábiles desde la aprobación del arte. Para pedidos de temporada alta (noviembre-diciembre) se recomienda anticipar con 30 días.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Tecnología Promocional', item: `${BASE_URL}/categorias/tecnologia-promocional/` },
    { '@type': 'ListItem', position: 3, name: 'Audífonos Promocionales', item: `${BASE_URL}/audifonos-promocionales/` },
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
const WA_TEXT = encodeURIComponent('Hola, quiero cotizar audífonos bluetooth personalizados con el logo de mi empresa');

export default function AudiofonosPromocionalesPage() {
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
              <span className="text-white/80">Audífonos Promocionales</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Audífonos Bluetooth Promocionales<br />
              <span style={{ color: '#F5A520' }}>para Empresas</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Audífonos bluetooth personalizados con el logo de tu empresa. Regalos corporativos tecnológicos
              de alto impacto para ejecutivos, ferias y campañas en Ecuador.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5"
                style={{ background: '#F5A520' }}
              >
                Cotizar Audífonos
              </a>
              <Link
                href="/categorias/tecnologia-promocional/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Tecnología Completa
              </Link>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-4 text-center">
              Tipos de audífonos promocionales
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
              Elige el tipo de audífonos que mejor se adapta al perfil de tus clientes o colaboradores.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TYPES.map((type) => (
                <div key={type.name} className="p-6 rounded-2xl bg-[#FAFBFF] border border-gray-100">
                  <h3 className="font-bold text-[#0F2178] text-lg mb-2">{type.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">
              Cuándo elegir audífonos como regalo corporativo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Premios en convenciones y congresos de ventas',
                'Reconocimientos por logros de alto rendimiento',
                'Regalos para clientes VIP y directivos',
                'Ferias tecnológicas y exposiciones B2B',
                'Kits de bienvenida para equipos de trabajo remoto',
                'Lanzamientos de productos de tecnología o telecomunicaciones',
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

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes — Audífonos bluetooth para empresas
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

        {/* Related */}
        <section className="py-12 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: '/parlantes-bluetooth/', title: 'Parlantes Bluetooth', desc: 'Parlantes personalizados para regalos de alto impacto.' },
                { href: '/soportes-para-celular/', title: 'Soportes para Celular', desc: 'Soportes y accesorios de escritorio con tu logo.' },
                { href: '/categorias/memorias-usb-personalizadas/', title: 'Memorias USB', desc: 'USB personalizadas para ferias y congresos.' },
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
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #000D3D 0%, #0F2178 100%)' }}>
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Listo para cotizar audífonos personalizados?
            </h2>
            <p className="text-white/70 mb-8">
              Dinos la cantidad, el modelo que te interesa y el uso. Respondemos en 48 horas.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg"
              style={{ background: '#F5A520' }}
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
