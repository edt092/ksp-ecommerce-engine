import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.kronosolopromocionales.com';

export const metadata = {
  title: 'Regalos Corporativos Personalizados para Empresas | KS Promocionales',
  description: 'Regalos corporativos personalizados para empresas en Ecuador. Mugs, tecnología, bolígrafos, maletines y más con tu logo. Catálogo B2B con opciones para clientes, empleados y eventos.',
  alternates: {
    canonical: `${BASE_URL}/regalos-corporativos/`,
    languages: {
      'es-EC': `${BASE_URL}/regalos-corporativos/`,
      'es-CO': `${BASE_URL}/regalos-corporativos/`,
      'x-default': `${BASE_URL}/regalos-corporativos/`,
    },
  },
  openGraph: {
    title: 'Regalos Corporativos Personalizados para Empresas | KS Promocionales',
    description: 'Regalos corporativos personalizados para empresas. Catálogo B2B para clientes, empleados y eventos en Ecuador.',
    type: 'website',
  },
};

const ALL_CATEGORIES = [
  {
    id: 'precio-bomba',
    name: 'Precio Bomba',
    slug: 'precio-bomba',
    description: 'Ofertas especiales con los mejores precios en artículos promocionales.',
    ideal: 'Campañas masivas, presupuesto ajustado',
  },
  {
    id: 'antiestres',
    name: 'Antiestrés',
    slug: 'antiestres',
    description: 'Pelotas, figuras y accesorios relajantes personalizados.',
    ideal: 'Bienestar corporativo, call centers',
  },
  {
    id: 'antimicrobianos',
    name: 'Antimicrobianos',
    slug: 'antimicrobianos',
    description: 'Bolígrafos antibacteriales, geles, mascarillas y accesorios de higiene.',
    ideal: 'Salud, farmacéutico, educativo',
  },
  {
    id: 'escritura',
    name: 'Bolígrafos Publicitarios',
    slug: 'boligrafos-publicitarios',
    description: 'Desde 50 unidades. Metálicos, ecológicos y ejecutivos con tu logo impreso.',
    ideal: 'Eventos, ferias, capacitaciones',
  },
  {
    id: 'reflectivos',
    name: 'Reflectivos',
    slug: 'reflectivos',
    description: 'Chalecos, pulseras, llaveros y accesorios con cintas retroreflectantes.',
    ideal: 'Construcción, minero, vial',
  },
  {
    id: 'automovil',
    name: 'Automóvil',
    slug: 'automovil',
    description: 'Organizadores de maletero, cargadores portátiles y accesorios para el auto.',
    ideal: 'Clientes con vehículo propio',
  },
  {
    id: 'bar-y-vino',
    name: 'Bar y Vino',
    slug: 'bar-y-vino',
    description: 'Descorchadores, sets de vino, hieleras y copas grabadas.',
    ideal: 'Clientes VIP, ejecutivos',
  },
  {
    id: 'bicicleta',
    name: 'Bicicleta',
    slug: 'bicicleta',
    description: 'Luces LED, candados, bolsos de cuadro y porta-bidones.',
    ideal: 'Estilo de vida activo y sostenible',
  },
  {
    id: 'calculadoras',
    name: 'Calculadoras',
    slug: 'calculadoras',
    description: 'Calculadoras de bolsillo, escritorio y científicas.',
    ideal: 'Financiero, contable, educativo',
  },
  {
    id: 'confeccion',
    name: 'Confección',
    slug: 'camisetas-y-confeccion-corporativa',
    description: 'Camisetas, polos, chaquetas y uniformes con bordado o estampado.',
    ideal: 'Uniformes, equipos, eventos',
  },
  {
    id: 'deportes',
    name: 'Deportes',
    slug: 'deportes',
    description: 'Botellas de agua, toallas, mochilas, balones y accesorios fitness.',
    ideal: 'Patrocinios, bienestar corporativo',
  },
  {
    id: 'econature',
    name: 'EcoNature',
    slug: 'econature',
    description: 'Línea premium sostenible: bambú, corcho, algodón orgánico y bioplásticos.',
    ideal: 'Sostenibilidad premium',
  },
  {
    id: 'ecologia',
    name: 'Ecología',
    slug: 'ecologia',
    description: 'Bolsas reutilizables, termos sin plástico y artículos biodegradables.',
    ideal: 'Campañas ESG y RSE',
  },
  {
    id: 'golf',
    name: 'Golf',
    slug: 'golf',
    description: 'Bolas, tees, guantes, toallas y accesorios de cancha.',
    ideal: 'Torneos ejecutivos, clientes VIP',
  },
  {
    id: 'gorras',
    name: 'Gorras Personalizadas',
    slug: 'gorras-personalizadas',
    description: 'Alta visibilidad. Bordado computarizado desde 12 unidades.',
    ideal: 'Eventos masivos, campañas de campo',
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    slug: 'herramientas',
    description: 'Sets de destornilladores, llaves multiusos y cajas de herramientas.',
    ideal: 'Construcción, industria',
  },
  {
    id: 'hogar',
    name: 'Hogar',
    slug: 'hogar',
    description: 'Sets de cocina, organizadores, marcos de foto y velas aromáticas.',
    ideal: 'Regalos de fin de año',
  },
  {
    id: 'iluminacion',
    name: 'Iluminación',
    slug: 'iluminacion',
    description: 'Linternas recargables, lámparas LED y llaveros luminosos.',
    ideal: 'Eventos nocturnos',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    slug: 'infantil',
    description: 'Mochilas, loncheras, kits de colores y juegos didácticos.',
    ideal: 'Campañas familiares',
  },
  {
    id: 'juegos',
    name: 'Juegos',
    slug: 'juegos',
    description: 'Juegos de mesa, naipes, cubos y kits de entretenimiento.',
    ideal: 'Team buildings, activaciones',
  },
  {
    id: 'llaveros',
    name: 'Llaveros Personalizados',
    slug: 'llaveros-personalizados',
    description: 'El artículo con mayor vida útil. Metal, cuero y PVC desde 50 unidades.',
    ideal: 'Gran volumen, distribución masiva',
  },
  {
    id: 'maletines',
    name: 'Mochilas y Maletines',
    slug: 'mochilas-y-maletines-personalizados',
    description: 'Portafolio ejecutivo y mochilas corporativas con tu logo bordado o grabado.',
    ideal: 'Directivos, clientes VIP',
  },
  {
    id: 'master-line',
    name: 'Master Line',
    slug: 'master-line',
    description: 'Línea premium: artículos de escritorio de alta gama y accesorios ejecutivos.',
    ideal: 'Regalos ejecutivos premium',
  },
  {
    id: 'medicos',
    name: 'Médicos',
    slug: 'medicos',
    description: 'Lapiceros clínicos, libretas de prescripción y kits médicos.',
    ideal: 'Visita médica, laboratorios',
  },
  {
    id: 'memorias-usb',
    name: 'Memorias USB',
    slug: 'memorias-usb-personalizadas',
    description: '8GB, 16GB y 32GB en formatos tarjeta, llave, clip y figuras.',
    ideal: 'Capacitaciones, contenido digital',
  },
  {
    id: 'mugs',
    name: 'Mugs y Termos Personalizados',
    slug: 'mugs-y-termos-personalizados',
    description: 'El regalo de escritorio más usado. Cerámica, acero inoxidable y sublimación.',
    ideal: 'Ferias, onboarding, fin de año',
  },
  {
    id: 'novedades',
    name: 'Novedades',
    slug: 'novedades',
    description: 'Gadgets, accesorios lifestyle y artículos sorprendentes.',
    ideal: 'Últimas tendencias',
  },
  {
    id: 'oficina',
    name: 'Artículos de Oficina',
    slug: 'articulos-de-oficina-personalizados',
    description: 'Organizadores, agendas y sets de escritorio para el escritorio diario.',
    ideal: 'Kits de bienvenida, convenciones',
  },
  {
    id: 'paraguas',
    name: 'Paraguas',
    slug: 'paraguas',
    description: 'Golf, compactos y tipo capota con armadura reforzada.',
    ideal: 'Visibilidad en días de lluvia',
  },
  {
    id: 'cuidado-personal',
    name: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Neceseres, kits de viaje, sets de manicura y amenities.',
    ideal: 'Hoteles, clínicas, wellness',
  },
  {
    id: 'produccion-nacional',
    name: 'Producción Nacional',
    slug: 'produccion-nacional',
    description: 'Cuero repujado, cerámica artesanal, textiles locales y madera.',
    ideal: 'Hecho en Ecuador',
  },
  {
    id: 'relojes',
    name: 'Relojes',
    slug: 'relojes',
    description: 'Relojes de pared, escritorio y despertadores personalizados.',
    ideal: 'Impacto de marca diario',
  },
  {
    id: 'tecnologia',
    name: 'Tecnología Promocional',
    slug: 'tecnologia-promocional',
    description: 'Audífonos, power banks y gadgets personalizados.',
    ideal: 'Reconocimientos, clientes VIP',
  },
  {
    id: 'variedades',
    name: 'Variedades',
    slug: 'variedades',
    description: 'Artículos mixtos de múltiples categorías para kits combinados.',
    ideal: 'Kits combinados, públicos diversos',
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
  numberOfItems: ALL_CATEGORIES.length,
  itemListElement: ALL_CATEGORIES.map((cat, idx) => ({
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

      {/* Hero */}
      <section
        className="relative bg-primary py-16 md:py-24 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(15, 33, 120, 0.85), rgba(15, 33, 120, 0.85)), url('/images/regalos-promocionales.png')" }}
      >
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
            Explora las 34 Categorías de Regalos Corporativos
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Selecciona la categoría que mejor se adapte a tu presupuesto, evento y público objetivo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 md:gap-y-14 max-w-7xl mx-auto">
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}/`}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-sm mb-5 transition-all duration-300 ease-out group-hover:ring-accent/40 group-hover:shadow-xl group-hover:-translate-y-1.5">
                  <Image
                    src={`/images/categorias/${cat.id}.png`}
                    alt={cat.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-secondary text-base md:text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3 max-w-[210px]">
                  {cat.description}
                </p>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                  {cat.ideal}
                </span>
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
