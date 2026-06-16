import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Soportes para Celular Personalizados para Empresas | KS Promocionales',
  description: 'Soportes para celular personalizados con tu logo para empresas en Ecuador. Accesorios de escritorio prácticos y de alta visibilidad de marca. Cotiza sin compromiso.',
  alternates: {
    canonical: `${BASE_URL}/soportes-para-celular/`,
    languages: {
      'es-EC': `${BASE_URL}/soportes-para-celular/`,
      'es-CO': `${BASE_URL}/soportes-para-celular/`,
      'x-default': `${BASE_URL}/soportes-para-celular/`,
    },
  },
  openGraph: {
    title: 'Soportes para Celular Personalizados para Empresas | KS Promocionales',
    description: 'Soportes para celular personalizados con logo — alta presencia de marca en escritorio. Ecuador.',
    type: 'website',
  },
};

const TYPES = [
  { name: 'Soporte de escritorio', desc: 'Plástico o metal. Mantiene el celular visible en el escritorio. Alta presencia de marca durante toda la jornada laboral.' },
  { name: 'Soporte para auto', desc: 'Para el tablero o la rejilla de ventilación. Tu marca viaja con el cliente en cada desplazamiento.' },
  { name: 'Soporte con cargador inalámbrico', desc: 'Versión premium con carga inalámbrica integrada. Doble funcionalidad y alto valor percibido.' },
  { name: 'Pop socket / anillo', desc: 'Accesorio adherible al teléfono. Económico, funcional y de gran distribución masiva.' },
];

const FAQS = [
  {
    question: '¿Cómo se personaliza un soporte para celular con mi logo?',
    answer: 'Los soportes se personalizan con serigrafía, impresión UV o grabado láser según el material. Se puede personalizar en uno o varios lados con logo, nombre de empresa y colores corporativos.',
  },
  {
    question: '¿Cuál es el mínimo de pedido?',
    answer: 'El mínimo varía por modelo. Los pop sockets y anillos tienen mínimos de 50 unidades. Los soportes de escritorio desde 25 unidades. Consúltanos por WhatsApp para confirmar disponibilidad.',
  },
  {
    question: '¿Para qué sectores son mejores los soportes para celular como regalo?',
    answer: 'Son muy efectivos en sectores donde el celular es herramienta de trabajo: ventas, banca, telecomunicaciones, inmobiliario, seguros. También son populares en ferias de tecnología y campañas de volumen masivo por su bajo costo unitario.',
  },
  {
    question: '¿Se pueden combinar con otros artículos en un kit?',
    answer: 'Sí. Son un excelente complemento en kits de oficina junto con bolígrafos, libretas y mugs. También combinan bien en kits tech con USB o audífonos para un regalo más completo.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Tecnología Promocional', item: `${BASE_URL}/categorias/tecnologia-promocional/` },
    { '@type': 'ListItem', position: 3, name: 'Soportes para Celular', item: `${BASE_URL}/soportes-para-celular/` },
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
const WA_TEXT = encodeURIComponent('Hola, quiero cotizar soportes para celular personalizados con el logo de mi empresa');

export default function SoportesCelularPage() {
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
              <span className="text-white/80">Soportes para Celular</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Soportes para Celular<br />
              <span style={{ color: '#F5A520' }}>Personalizados con tu Logo</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Soportes y accesorios para celular personalizados con el logo de tu empresa.
              Alta visibilidad en escritorios, autos y manos — Ecuador.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-7 py-3.5"
                style={{ background: '#F5A520' }}
              >
                Cotizar Soportes
              </a>
              <Link
                href="/categorias/tecnologia-promocional/"
                className="inline-flex items-center gap-2 font-semibold rounded-xl px-7 py-3.5"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Ver Tecnología
              </Link>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A23] mb-12 text-center">
              Tipos de soportes para celular personalizados
            </h2>
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

        {/* Why */}
        <section className="py-16 bg-[#F7F8FF]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-8 text-center">
              ¿Por qué son efectivos los soportes para celular como artículo promocional?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Alta frecuencia de uso', desc: 'El celular se usa decenas de veces al día. Un soporte con tu logo genera cientos de impresiones semanales.' },
                { title: 'Bajo costo, alto impacto', desc: 'Son de los artículos con mejor relación costo-visibilidad. Permiten distribuir en volúmenes grandes.' },
                { title: 'Relevancia universal', desc: 'Todos tienen celular. Es un accesorio 100% relevante para cualquier perfil de cliente o colaborador.' },
              ].map((b) => (
                <div key={b.title} className="text-center p-5 rounded-xl bg-white border border-gray-100">
                  <h3 className="font-bold text-[#0F2178] mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-[#0A0A23] mb-10 text-center">
              Preguntas frecuentes
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
                { href: '/parlantes-bluetooth/', title: 'Parlantes Bluetooth', desc: 'Parlantes personalizados para regalos premium.' },
                { href: '/audifonos-promocionales/', title: 'Audífonos Promocionales', desc: 'Audífonos bluetooth con tu logo corporativo.' },
                { href: '/categorias/tecnologia-promocional/', title: 'Tecnología Completa', desc: 'Todo el catálogo tecnológico personalizable.' },
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
              Cotiza soportes para celular personalizados
            </h2>
            <p className="text-white/70 mb-8">
              Indícanos la cantidad y el tipo. Respondemos en 48 horas con opciones y precios.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-white rounded-xl px-8 py-4 text-lg"
              style={{ background: '#F5A520' }}
            >
              Solicitar Cotización
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
