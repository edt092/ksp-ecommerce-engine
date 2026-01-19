import Link from 'next/link';

export const metadata = {
  title: 'Contacto | Productos Promocionales Ecuador - Quito y Guayaquil | KSPromocionales',
  description: 'Contacta a KSPromocionales para productos promocionales en Ecuador. Atendemos Quito, Guayaquil y todo el país. Cotiza tus artículos promocionales por WhatsApp.',
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/contacto',
  },
  openGraph: {
    title: 'Contacto | Productos Promocionales Ecuador - Quito y Guayaquil | KSPromocionales',
    description: 'Contacta a KSPromocionales para productos promocionales en Ecuador. Atendemos Quito, Guayaquil y todo el país.',
    url: 'https://www.kronosolopromocionales.com/contacto',
    siteName: 'KSPromocionales',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function ContactoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'KSPromocionales',
    description: 'Productos promocionales Ecuador: artículos promocionales y regalos corporativos en Quito, Guayaquil y todo el país.',
    url: 'https://www.kronosolopromocionales.com',
    email: 'claudiagonzalez@kronosolopromocionales.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC',
      addressLocality: 'Quito',
      addressRegion: 'Pichincha'
    },
    areaServed: [
      { '@type': 'City', name: 'Quito' },
      { '@type': 'City', name: 'Guayaquil' },
      { '@type': 'Country', name: 'Ecuador' }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]"></div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary font-medium">Contacto</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              Contacta con Nosotros
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-4">
              Tu proveedor de productos promocionales en Ecuador. Atendemos Quito, Guayaquil y envíos a todo el país.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">

            {/* Contact Info */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl text-secondary mb-6 md:mb-8">
                Información de Contacto
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary text-base md:text-lg">Ubicación</h3>
                    <p className="text-gray-600">Quito, Ecuador</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Envíos a Guayaquil y todo Ecuador
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary text-base md:text-lg">Email</h3>
                    <a
                      href="mailto:claudiagonzalez@kronosolopromocionales.com"
                      className="text-primary hover:underline break-all text-sm md:text-base"
                    >
                      claudiagonzalez@kronosolopromocionales.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary text-base md:text-lg">Horario de Atención</h3>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-gray-600">Sábados: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-5 md:p-6 bg-green-50 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <h3 className="font-semibold text-secondary">Cotiza por WhatsApp</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Respuesta rápida para cotizaciones de productos promocionales
                </p>
                <a
                  href="https://wa.me/593999999999?text=Hola,%20me%20interesa%20cotizar%20productos%20promocionales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            {/* Coverage Area */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl text-secondary mb-6 md:mb-8">
                Cobertura Nacional
              </h2>

              <p className="text-gray-600 mb-6 text-sm md:text-base">
                Somos tu proveedor de <strong>productos promocionales en Ecuador</strong>.
                Realizamos entregas en las principales ciudades del país:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 border border-gray-100">
                  <h3 className="font-semibold text-secondary mb-2 text-sm md:text-base">Quito</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Sede principal con entrega directa en toda la ciudad y valles.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-100">
                  <h3 className="font-semibold text-secondary mb-2 text-sm md:text-base">Guayaquil</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Envíos frecuentes a la Costa con tiempos de entrega competitivos.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-secondary mb-4 text-sm md:text-base">Otras ciudades atendidas:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Cuenca', 'Ambato', 'Manta', 'Machala', 'Santo Domingo', 'Loja', 'Ibarra', 'Riobamba'].map((city) => (
                    <span
                      key={city}
                      className="bg-primary/10 text-primary px-3 py-1.5 text-xs md:text-sm font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
                <p className="text-xs md:text-sm text-blue-800">
                  <strong>Productos promocionales Ecuador:</strong> artículos promocionales,
                  regalos corporativos, merchandising empresarial y más. Personalizamos con tu
                  logo en Quito, Guayaquil y todo el país.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-4">
              Productos Promocionales para Tu Empresa
            </h2>
            <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base px-4">
              En KSPromocionales ofrecemos artículos promocionales de calidad con personalización
              profesional. Desde mugs y textiles hasta tecnología y artículos de oficina.
              Cotiza sin compromiso y recibe asesoría personalizada para tu marca.
            </p>
            <a
              href="https://wa.me/593999999999?text=Hola,%20quiero%20cotizar%20productos%20promocionales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotizar Ahora
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
