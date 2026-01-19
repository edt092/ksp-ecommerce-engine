import Link from 'next/link';

export const metadata = {
  title: 'Nosotros - KSPromocionales Ecuador',
  description: 'Conoce la historia de KSPromocionales, tu aliado en productos promocionales personalizados en Ecuador. Calidad, creatividad y resultados.',
};

export default function AboutPage() {
  return (
    <>
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
            <span className="text-secondary font-medium">Nosotros</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              Somos KSPromocionales
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto px-4">
              No vendemos productos, contamos historias que convierten tu marca
              en una experiencia memorable para tus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-6 md:mb-8">
              Nuestra Historia
            </h2>
            <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed">
              <p className="text-base md:text-lg">
                En un mercado saturado de catálogos genéricos y productos sin alma, nació KSPromocionales
                con una misión clara: transformar los artículos promocionales en herramientas poderosas
                de storytelling que conecten emocionalmente con las audiencias.
              </p>
              <p className="text-base md:text-lg">
                Creemos que cada producto personalizado es una oportunidad para contar la historia de tu
                marca. No importa si es una camiseta, un termo o una USB, cuando se diseña con propósito
                y se ejecuta con excelencia, se convierte en un embajador silencioso que habla por ti
                todos los días.
              </p>
              <p className="text-base md:text-lg">
                Operamos 100% por WhatsApp porque sabemos que la conversación directa y humana es clave
                para entender tu visión y traducirla en productos que realmente impactan. Sin formularios
                complicados, sin esperas eternas. Solo tú, nosotros y ideas brillantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-8 md:mb-12 text-center">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
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
                title: 'Resultados',
                description: 'Cada producto está pensado para generar conversiones y recordación de marca.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Agilidad',
                description: 'Respuestas en 48h. Producción eficiente. Entregas puntuales en todo Ecuador.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Compromiso',
                description: 'Tu éxito es nuestro éxito. Acompañamos cada proyecto de inicio a fin.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 md:p-8 hover:border-primary transition-colors"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white flex items-center justify-center mb-4 md:mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-secondary mb-2 md:mb-3">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-8 md:mb-12 text-center">
              ¿Por Qué Somos Diferentes?
            </h2>
            <div className="space-y-6 md:space-y-8">
              {[
                {
                  title: 'Enfoque en Storytelling',
                  description: 'No preguntamos "¿qué producto quieres?". Preguntamos "¿qué historia quieres contar?".',
                },
                {
                  title: 'Sin Precios Visibles',
                  description: 'Cada proyecto es único. Te damos cotizaciones personalizadas basadas en tus necesidades reales, no en tarifas genéricas.',
                },
                {
                  title: 'Conversión por WhatsApp',
                  description: 'Eliminamos fricciones. Un clic te conecta con nosotros para iniciar tu proyecto sin burocracia.',
                },
                {
                  title: 'Diseño Ilimitado',
                  description: 'Tu visión no tiene límites. Trabajamos contigo hasta que el diseño sea exactamente lo que soñaste.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary flex items-center justify-center font-bold text-white text-lg md:text-xl">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-secondary mb-2">{item.title}</h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-4">
            ¿Listo para Contar tu Historia?
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base px-4">
            Conversemos sobre tu marca y cómo podemos ayudarte a crear productos que conecten con tu audiencia.
          </p>
          <a
            href="https://wa.me/593999999999?text=Hola,%20quiero%20conocer%20más%20sobre%20sus%20productos%20promocionales"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Conversemos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
