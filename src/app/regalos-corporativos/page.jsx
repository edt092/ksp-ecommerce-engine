import Link from 'next/link';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Regalos Corporativos Personalizados Ecuador | KS Promocionales',
  description: 'Regalos corporativos personalizados con el logo de tu empresa en Ecuador. Mugs, tecnología, bolígrafos, maletines y más. Cotiza sin compromiso por WhatsApp.',
  alternates: {
    canonical: `${BASE_URL}/regalos-corporativos/`,
    languages: {
      'es-EC': `${BASE_URL}/regalos-corporativos/`,
      'es-CO': `${BASE_URL}/regalos-corporativos/`,
      'x-default': `${BASE_URL}/regalos-corporativos/`,
    },
  },
  openGraph: {
    title: 'Regalos Corporativos Personalizados Ecuador | KS Promocionales',
    description: 'Regalos corporativos personalizados con el logo de tu empresa en Ecuador. Cotiza sin compromiso.',
    type: 'website',
  },
};

const GIFT_CATEGORIES = [
  {
    name: 'Mugs y Termos Personalizados',
    slug: 'mugs-y-termos-personalizados',
    description: 'El regalo de escritorio más usado. Cerámica, acero inoxidable y sublimación con tu logo.',
    emoji: '☕',
    ideal: 'Ferias, onboarding, fin de año',
  },
  {
    name: 'Tecnología Promocional',
    slug: 'tecnologia-promocional',
    description: 'Audífonos, power banks y gadgets personalizados. Los más valorados por ejecutivos.',
    emoji: '💻',
    ideal: 'Reconocimientos, clientes VIP',
  },
  {
    name: 'Bolígrafos Publicitarios',
    slug: 'boligrafos-publicitarios',
    description: 'Desde 50 unidades. Metálicos, ecológicos y ejecutivos con tu logo impreso.',
    emoji: '✏️',
    ideal: 'Eventos, ferias, capacitaciones',
  },
  {
    name: 'Artículos de Oficina',
    slug: 'articulos-de-oficina-personalizados',
    description: 'Organizadores, agendas y sets de escritorio que mantienen tu marca visible cada día.',
    emoji: '🗂️',
    ideal: 'Kits de bienvenida, convenciones',
  },
  {
    name: 'Mochilas y Maletines',
    slug: 'mochilas-y-maletines-personalizados',
    description: 'Portafolio ejecutivo y mochilas corporativas con tu logo bordado o grabado.',
    emoji: '💼',
    ideal: 'Directivos, clientes VIP, equipos de ventas',
  },
  {
    name: 'Gorras Personalizadas',
    slug: 'gorras-personalizadas',
    description: 'Alta visibilidad. Bordado computarizado desde 12 unidades.',
    emoji: '🧢',
    ideal: 'Eventos masivos, campañas de campo',
  },
  {
    name: 'Llaveros Personalizados',
    slug: 'llaveros-personalizados',
    description: 'El artículo con mayor vida útil. Metal, cuero y PVC desde 50 unidades.',
    emoji: '🔑',
    ideal: 'Gran volumen, ferias, distribución masiva',
  },
  {
    name: 'Artículos Ecológicos',
    slug: 'ecologia',
    description: 'Bambú, papel reciclado y bioplásticos. Demuestra el compromiso ambiental de tu empresa.',
    emoji: '🌿',
    ideal: 'Empresas con política de sostenibilidad',
  },
];

const FAQS = [
  {
    question: '¿Cuál es el mínimo de pedido para regalos corporativos?',
    answer: 'Depende del producto. En bolígrafos el mínimo es 50 unidades, en gorras 12 unidades, en mugs 24 unidades. Contáctanos por WhatsApp para conocer el mínimo exacto de cada artículo.',
  },
  {
    question: '¿Cuánto tiempo tarda en llegar un pedido de regalos corporativos?',
    answer: 'El tiempo de entrega estándar es de 10 a 15 días hábiles desde la aprobación del arte. Tenemos opciones express para pedidos urgentes. Hacemos envíos a todo Ecuador.',
  },
  {
    question: '¿Puedo ver una muestra antes de hacer el pedido?',
    answer: 'Sí, trabajamos con aprobación de arte digital antes de producir. Para pedidos grandes también podemos enviar una muestra física. Consulta con nuestro equipo.',
  },
  {
    question: '¿Incluyen la personalización en el precio?',
    answer: 'Sí, nuestros precios incluyen la personalización con tu logo. El precio final depende del artículo, la técnica de impresión y la cantidad. Cotiza gratis por WhatsApp.',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Regalos Corporativos', item: `${BASE_URL}/regalos-corporativos/` },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Regalos Corporativos Personalizados Ecuador — KS Promocionales',
  description: 'Categorías de regalos corporativos personalizados disponibles en Ecuador',
  url: `${BASE_URL}/regalos-corporativos/`,
  numberOfItems: GIFT_CATEGORIES.length,
  itemListElement: GIFT_CATEGORIES.map((cat, idx) => ({
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

export default function RegalosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]" />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">Inicio</Link>
            <span className="text-gray-400">›</span>
            <span className="text-secondary font-medium">Regalos Corporativos</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Regalos Corporativos Personalizados Ecuador
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Más de 1,200 artículos promocionales personalizados con el logo de tu empresa.
            Cotiza sin compromiso y recibe asesoría gratuita.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/593999814838?text=Hola%2C%20quiero%20cotizar%20regalos%20corporativos%20personalizados"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              Cotizar Regalos
            </a>
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-secondary text-center mb-4">
            Los Regalos Corporativos Más Solicitados
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Selecciona la categoría que mejor se adapte a tu presupuesto, evento y público objetivo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GIFT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}/`}
                className="group block border border-gray-200 p-6 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <span className="text-4xl mb-4 block">{cat.emoji}</span>
                <h3 className="font-semibold text-secondary text-lg mb-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Ideal para: {cat.ideal}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué KS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl text-secondary text-center mb-12">
            ¿Por Qué Elegir KS Promocionales para tus Regalos Corporativos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Más de 1,200 Productos',
                desc: 'El catálogo más completo de artículos promocionales y regalos corporativos en Ecuador.',
              },
              {
                title: 'Personalización Incluida',
                desc: 'Tu logo, colores corporativos y mensaje en cada artículo. Sin costo adicional por el arte.',
              },
              {
                title: 'Envíos a Todo Ecuador',
                desc: 'Entregamos en Quito, Guayaquil, Cuenca y todo el país. Tiempo estándar: 10-15 días hábiles.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="font-semibold text-secondary text-lg mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-3xl text-secondary text-center mb-10">
            Preguntas Frecuentes sobre Regalos Corporativos
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-secondary mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">
            ¿Listo para personalizar tus regalos corporativos?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Nuestro equipo te asesora para elegir el producto ideal según tu presupuesto y objetivo de campaña.
          </p>
          <a
            href="https://wa.me/593999814838?text=Hola%2C%20quiero%20cotizar%20regalos%20corporativos%20personalizados%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-bold hover:bg-primary-dark transition-colors"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
