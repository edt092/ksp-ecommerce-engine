import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Nosotros | KS Promocionales Ecuador — Claudia González',
  description: 'Conoce a Claudia González y el equipo detrás de KS Promocionales. Desde Quito servimos a empresas de Ecuador y Colombia con artículos promocionales personalizados y regalos corporativos de calidad.',
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/nosotros/',
  },
};

const INDUSTRIES = [
  { icon: '🏦', name: 'Banca y Finanzas', desc: 'Regalos corporativos para clientes VIP, kits de onboarding y merchandising institucional.' },
  { icon: '🏥', name: 'Salud y Farmacéutica', desc: 'Artículos promocionales para congresos médicos, ferias de salud y eventos corporativos.' },
  { icon: '🎓', name: 'Educación', desc: 'Kits de bienvenida para estudiantes, uniformes y materiales de papelería institucional.' },
  { icon: '🏨', name: 'Hotelería y Turismo', desc: 'Amenities personalizados, artículos de huésped y souvenirs de destino con tu marca.' },
  { icon: '🏗️', name: 'Construcción e Inmobiliaria', desc: 'Regalos de inauguración, kits de herramientas y materiales de comunicación corporativa.' },
  { icon: '💻', name: 'Tecnología y Startups', desc: 'Swag corporativo para eventos tech, lanzamientos de producto y equipos remotos.' },
  { icon: '🛍️', name: 'Retail y Consumo Masivo', desc: 'Displays, bolsas personalizadas y artículos POP para puntos de venta y campañas.' },
  { icon: '🤝', name: 'ONGs y Sector Público', desc: 'Materiales de campaña, kits de voluntariado y artículos para eventos comunitarios.' },
];

const VALORES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Creatividad',
    description: 'Diseños únicos que capturan la esencia de tu marca sin límites ni restricciones.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Calidad',
    description: 'Solo trabajamos con proveedores verificados. Cada producto pasa por control de calidad antes de entregarse.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Agilidad',
    description: 'Cotización en 48h. Sin formularios. Sin esperas. Una conversación de WhatsApp es suficiente para comenzar.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Compromiso',
    description: 'Tu proyecto es nuestro proyecto. Acompañamos cada pedido desde el primer mensaje hasta la entrega final.',
  },
];

const BASE_URL = 'https://www.kronosolopromocionales.com';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/nosotros/#claudia-gonzalez`,
  name: 'Claudia Inés González Ortiz',
  givenName: 'Claudia',
  familyName: 'González Ortiz',
  jobTitle: 'Fundadora y Especialista en Productos Promocionales',
  description: 'Especialista en productos promocionales con años de experiencia sirviendo a empresas de Ecuador y Colombia desde Quito.',
  image: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/team/claudia-gonzalez.jpg`,
    width: 320,
    height: 320,
  },
  worksFor: { '@id': `${BASE_URL}/#localbusiness` },
  sameAs: ['https://www.linkedin.com/in/claudia-gonzalez-344a3b132/'],
  knowsAbout: ['Productos Promocionales', 'Regalos Corporativos', 'Merchandising Empresarial', 'Marketing Corporativo'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Quito',
    addressRegion: 'Pichincha',
    addressCountry: 'EC',
  },
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/nosotros/#webpage`,
  url: `${BASE_URL}/nosotros/`,
  name: 'Nosotros | KS Promocionales Ecuador — Claudia González',
  inLanguage: 'es-EC',
  about: { '@id': `${BASE_URL}/nosotros/#claudia-gonzalez` },
  isPartOf: { '@id': `${BASE_URL}/#website` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Nosotros', item: `${BASE_URL}/nosotros/` },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">Inicio</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary font-medium">Nosotros</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              La empresa detrás de tu marca
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto">
              Somos KS Promocionales, una empresa ecuatoriana especializada en artículos
              promocionales personalizados para empresas de Ecuador y Colombia.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Photo */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                    <Image
                      src="/images/team/claudia-gonzalez.jpg"
                      alt="Claudia González — Fundadora de KS Promocionales"
                      width={320}
                      height={320}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
                    Fundadora & Especialista
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Quién está detrás</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Claudia Inés González Ortiz
                </h2>
                <p className="text-gray-500 text-sm mb-5 font-medium">
                  Especialista en Productos Promocionales · Quito, Ecuador
                </p>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  <p>
                    Claudia lleva años conectando a empresas de Ecuador y Colombia con artículos
                    promocionales que realmente funcionan: los que el cliente guarda, usa y recuerda.
                    Su enfoque siempre fue simple — entender el negocio del cliente antes de proponer
                    un producto.
                  </p>
                  <p>
                    Antes de fundar KS Promocionales, notó un patrón en el mercado: demasiados
                    catálogos genéricos, poca asesoría real y clientes que recibían productos que
                    no reflejaban su marca. Decidió cambiar eso.
                  </p>
                  <p>
                    Hoy opera 100% vía WhatsApp porque cree que la conversación directa produce
                    mejores resultados que cualquier formulario. Cada cotización es personalizada;
                    ninguna es una plantilla.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/claudia-gonzalez-344a3b132/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#084e96] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://wa.me/593999814838"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#128C7E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar directo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-8">
              Cómo nació KS Promocionales
            </h2>
            <div className="space-y-5 text-gray-700 leading-relaxed text-base md:text-lg">
              <p>
                KS Promocionales nació en Quito de una observación sencilla: las empresas ecuatorianas
                gastaban presupuesto en artículos promocionales que sus clientes tiraban a la primera semana.
                Productos sin diseño pensado, sin historia detrás, sin propósito más allá de llevar un logo.
              </p>
              <p>
                Claudia González fundó la empresa con una premisa diferente: <strong>el producto
                promocional más barato no es el que tiene el precio más bajo, sino el que el
                cliente decide conservar</strong>. Un mug que el cliente usa cada mañana vale más
                que diez bolígrafos olvidados en un cajón.
              </p>
              <p>
                Desde el primer día, el modelo fue directo: atención personalizada por WhatsApp,
                cotizaciones en 48 horas y sin mínimos de pedido rígidos que excluyan a las empresas
                medianas. Ese modelo de asesoría directa resultó ser exactamente lo que el mercado
                necesitaba.
              </p>
              <p>
                Hoy, KS Promocionales trabaja con empresas de todos los tamaños en Ecuador y Colombia —
                desde startups tecnológicas que necesitan swag para su primer evento hasta corporaciones
                que buscan kits de regalo para cientos de clientes. El catálogo supera los 1,200 productos,
                pero la promesa sigue siendo la misma: entender tu marca antes de recomendar un artículo.
              </p>
            </div>

            {/* Data points */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: '1,200+', label: 'Productos disponibles' },
                { stat: '2', label: 'Países · Ecuador y Colombia' },
                { stat: '48h', label: 'Respuesta de cotización' },
                { stat: '100%', label: 'Atención personalizada' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-white rounded-xl border border-gray-100">
                  <div className="text-3xl font-bold text-primary mb-1">{item.stat}</div>
                  <div className="text-xs text-gray-500 leading-snug">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-4">
                Sectores que servimos
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Empresas de todos los sectores confían en KS Promocionales para sus campañas
                corporativas, eventos y regalos institucionales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INDUSTRIES.map((industry) => (
                <div
                  key={industry.name}
                  className="bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 rounded-xl p-5 transition-all duration-200 group"
                >
                  <div className="text-3xl mb-3">{industry.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{industry.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{industry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-8 md:mb-12 text-center">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {VALORES.map((value) => (
              <div
                key={value.title}
                className="bg-white border border-gray-200 p-6 md:p-8 hover:border-primary transition-colors"
              >
                <div className="w-14 h-14 bg-primary text-white flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal / Trust */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Datos legales</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><span className="font-medium text-gray-800">Razón social:</span> Claudia Inés González Ortiz</li>
                <li><span className="font-medium text-gray-800">RUC:</span> 1719403345001</li>
                <li><span className="font-medium text-gray-800">Actividad:</span> Comercialización de artículos promocionales</li>
                <li><span className="font-medium text-gray-800">Ubicación:</span> Quito, Pichincha, Ecuador</li>
              </ul>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Contacto directo</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">WhatsApp:</span>{' '}
                  <a href="https://wa.me/593999814838" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    +593 999 814 838
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-800">Email:</span>{' '}
                  <a href="mailto:claudiagonzalez@kronosolopromocionales.com" className="text-primary hover:underline">
                    claudiagonzalez@kronosolopromocionales.com
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-800">LinkedIn:</span>{' '}
                  <a
                    href="https://www.linkedin.com/in/claudia-gonzalez-344a3b132/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Claudia González
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Cobertura</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>🇪🇨 Ecuador — Envíos nacionales</li>
                <li>🇨🇴 Colombia — Envíos a principales ciudades</li>
                <li>📦 +1,200 productos personalizables</li>
                <li>⏱ Cotización garantizada en 48h</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-4">
            ¿Hablamos sobre tu próximo proyecto?
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
            Una conversación de WhatsApp es todo lo que necesitamos para empezar.
            Sin formularios, sin esperas. Solo ideas y resultados.
          </p>
          <a
            href="https://wa.me/593999814838?text=Hola%20Claudia%2C%20quiero%20cotizar%20productos%20promocionales%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribir a Claudia por WhatsApp
          </a>
        </div>
      </section>

      {/* Location */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-3">
                  Nuestra ubicación
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
                  Nuestra base de operaciones se encuentra en Quito, Ecuador, desde donde gestionamos
                  la logística y distribución de productos promocionales a nivel nacional.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=-0.10134504963244806,-78.46321896070626&z=16&output=embed&hl=es"
                width="100%"
                height="420"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Base de operaciones KS Promocionales — Quito, Ecuador"
              />
            </div>

            {/* Address pill */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Quito, Pichincha, Ecuador
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +593 999 814 838
              </span>
              <a
                href="https://wa.me/593999814838"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] px-4 py-2 rounded-full hover:bg-[#25D366]/20 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
