import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | KS Promocionales Ecuador',
  description: 'Conoce cómo KS Promocionales recopila, usa y protege tus datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/politica-de-privacidad/',
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '12 de marzo de 2026';
const COMPANY = 'KS Promocionales';
const EMAIL = 'claudiagonzalez@kronosolopromocionales.com';
const WHATSAPP = '+593 999 814 838';

export default function PoliticaDePrivacidad() {
  return (
    <main className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Política de Privacidad</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-400">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              <strong>{COMPANY}</strong> (en adelante, «nosotros» o «la empresa»), con domicilio en
              Quito, Pichincha, Ecuador, y correo electrónico de contacto{' '}
              <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>,
              es responsable del tratamiento de los datos personales que usted nos proporciona a
              través de este sitio web y de nuestros canales de comunicación.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Marco legal</h2>
            <p>
              Esta política se rige por la{' '}
              <strong>Ley Orgánica de Protección de Datos Personales del Ecuador</strong> (LOPDP,
              publicada en el Registro Oficial Suplemento n.° 459 del 26 de mayo de 2021) y su
              reglamento de aplicación. Nos comprometemos a tratar sus datos de forma lícita, leal
              y transparente.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Datos que recopilamos</h2>
            <p>Podemos recopilar los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Datos de contacto:</strong> nombre, número de teléfono/WhatsApp, dirección de correo electrónico y empresa.</li>
              <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y duración de la visita (mediante Google Analytics).</li>
              <li><strong>Datos de comunicación:</strong> mensajes que nos envíe por WhatsApp, correo electrónico o cualquier otro medio.</li>
            </ul>
            <p className="mt-3">
              No recopilamos datos sensibles (salud, origen étnico, creencias religiosas, etc.).
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Finalidad del tratamiento</h2>
            <p>Utilizamos sus datos para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Responder a sus consultas y elaborar cotizaciones.</li>
              <li>Gestionar pedidos y coordinar entregas.</li>
              <li>Enviar información sobre productos, promociones o novedades (únicamente si usted lo ha solicitado o autorizado).</li>
              <li>Mejorar la experiencia de navegación en este sitio web mediante estadísticas agregadas y anónimas.</li>
              <li>Cumplir con obligaciones legales y contables.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Base legal del tratamiento</h2>
            <p>El tratamiento de sus datos se basa en:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Consentimiento:</strong> cuando usted nos contacta voluntariamente por WhatsApp, correo u otro medio.</li>
              <li><strong>Ejecución de un contrato:</strong> cuando es necesario para procesar su pedido o cotización.</li>
              <li><strong>Interés legítimo:</strong> para el análisis estadístico del uso del sitio web (datos anonimizados).</li>
              <li><strong>Obligación legal:</strong> para cumplir con normativa fiscal y contable ecuatoriana.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Conservación de datos</h2>
            <p>
              Conservamos sus datos durante el tiempo necesario para cumplir con las finalidades
              descritas y, como mínimo, durante los plazos legales obligatorios (p. ej., 7 años
              para documentos fiscales). Pasado ese plazo, los datos se eliminan de forma segura.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Transferencia de datos a terceros</h2>
            <p>
              No vendemos, alquilamos ni compartimos sus datos personales con terceros con fines
              comerciales. Solo compartimos datos cuando es estrictamente necesario con:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Google LLC</strong> — para análisis web a través de Google Analytics (datos anonimizados).</li>
              <li><strong>Meta Platforms / WhatsApp Inc.</strong> — para la gestión de comunicaciones vía WhatsApp Business.</li>
              <li><strong>Proveedores de servicios de logística</strong> — únicamente los datos necesarios para la entrega de pedidos.</li>
            </ul>
            <p className="mt-3">
              Todos estos proveedores se encuentran sujetos a sus propias políticas de privacidad y
              cumplen con estándares internacionales de protección de datos.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies y tecnologías de seguimiento</h2>
            <p>
              Este sitio utiliza Google Analytics para medir el tráfico web de forma agregada.
              Google Analytics emplea cookies de seguimiento. Puede desactivar este seguimiento
              instalando el{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                complemento de inhabilitación para navegadores de Google Analytics
              </a>
              .
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Sus derechos</h2>
            <p>
              Conforme a la LOPDP, usted tiene los siguientes derechos sobre sus datos personales:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre usted.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminación:</strong> solicitar la supresión de sus datos cuando ya no sean necesarios.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento en determinadas circunstancias.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible.</li>
              <li><strong>Revocación del consentimiento:</strong> en cualquier momento, sin efecto retroactivo.</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, contáctenos en{' '}
              <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a> o
              al {WHATSAPP}. Responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Seguridad de los datos</h2>
            <p>
              Adoptamos medidas técnicas y organizativas razonables para proteger sus datos contra
              acceso no autorizado, pérdida, alteración o divulgación. El sitio utiliza cifrado
              HTTPS en todas sus páginas.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. La versión vigente siempre estará
              disponible en esta página con la fecha de última actualización. Le recomendamos
              revisarla periódicamente.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contacto</h2>
            <p>Si tiene dudas sobre esta política o sobre el tratamiento de sus datos:</p>
            <ul className="list-none pl-0 mt-2 space-y-1">
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href="https://wa.me/593999814838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {WHATSAPP}
                </a>
              </li>
              <li><strong>Ubicación:</strong> Quito, Pichincha, Ecuador</li>
            </ul>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
