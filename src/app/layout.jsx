import './globals.css';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Plus_Jakarta_Sans, Inter, DM_Serif_Display } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
  loading: () => null,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-dm-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const viewport = {
  viewportFit: 'cover',
  themeColor: '#001A6E',
};

export const metadata = {
  metadataBase: new URL('https://www.kronosolopromocionales.com'),
  title: 'Material Publicitario y Artículos Promocionales Ecuador | KS Promocionales',
  description: 'Material publicitario y artículos promocionales personalizados con tu logo en Ecuador. Regalos corporativos, mugs, bolígrafos, tecnología y más. Cotiza hoy por WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: 'https://www.kronosolopromocionales.com/',
    siteName: 'KS Promocionales',
    title: 'Material Publicitario y Artículos Promocionales Ecuador | KS Promocionales',
    description: 'Material publicitario y artículos promocionales personalizados con tu logo en Ecuador. Regalos corporativos, mugs, bolígrafos, tecnología y más. Cotiza hoy por WhatsApp.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KS Promocionales Ecuador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
    description: 'Artículos promocionales y regalos corporativos en Ecuador. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp! Envíos nacionales.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
    languages: {
      'es-EC': 'https://www.kronosolopromocionales.com/',
      'es-CO': 'https://www.kronosolopromocionales.com/',
      'x-default': 'https://www.kronosolopromocionales.com/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Verificación GSC activa vía Google Analytics (G-2SCDPRFSNF)
};

const BASE_URL = 'https://www.kronosolopromocionales.com';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'KS Promocionales',
  alternateName: 'KSPromocionales',
  description: 'Productos promocionales y regalos corporativos personalizados en Ecuador y Colombia. Tecnología, mugs, oficina, textiles y más con tu logo.',
  url: `${BASE_URL}/`,
  telephone: '+593999814838',
  email: 'claudiagonzalez@kronosolopromocionales.com',
  image: `${BASE_URL}/images/og-image.jpg`,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/logo.png`,
    width: 400,
    height: 100,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Norte de Quito',
    addressLocality: 'Quito',
    addressRegion: 'Pichincha',
    postalCode: '170101',
    addressCountry: 'EC',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -0.10134504963244806,
    longitude: -78.46321896070626,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '13:00',
    },
  ],
  priceRange: '$$',
  areaServed: [
    { '@type': 'Country', name: 'Ecuador' },
    { '@type': 'Country', name: 'Colombia' },
  ],
  sameAs: [
    'https://www.facebook.com/kspromocionales',
    'https://www.instagram.com/kspromocionales',
    'https://www.linkedin.com/in/claudia-gonzalez-344a3b132/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+593999814838',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: 'KS Promocionales',
  description: 'Productos promocionales personalizados en Ecuador y Colombia',
  inLanguage: 'es-EC',
  publisher: {
    '@id': `${BASE_URL}/#localbusiness`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-EC" className={`${jakarta.variable} ${inter.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link
          rel="preload"
          as="image"
          href="/images/hero/9781.jpg"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased overflow-x-hidden">
        {/* Google Consent Mode v2 — defaults denied until user accepts */}
        <Script id="google-consent-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', { analytics_storage: 'denied' });
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2SCDPRFSNF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2SCDPRFSNF');
          `}
        </Script>

        {/* Design System v2 — JS observers (upgrades 7, 8, 11) */}
        <Script id="design-system-observers" strategy="afterInteractive">{`
          (function() {
            // Upgrade 11 — Section reveal on scroll
            var hero = document.querySelector('section.relative.min-h-screen');
            document.querySelectorAll('section, footer').forEach(function(el, i) {
              if (el === hero || el.classList.contains('no-reveal')) return;
              el.classList.add('reveal');
              el.style.transitionDelay = Math.min(i * 0.04, 0.2) + 's';
            });
            var revealObs = new IntersectionObserver(function(entries) {
              entries.forEach(function(e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
              });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

            // Upgrade 8 — Section underline animation
            var lineObs = new IntersectionObserver(function(entries) {
              entries.forEach(function(e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); lineObs.unobserve(e.target); }
              });
            }, { threshold: 0.8 });
            document.querySelectorAll('.section-underline').forEach(function(el) { lineObs.observe(el); });

            // Upgrade 7 — Glass card mouse tracking
            document.querySelectorAll('.glass-card').forEach(function(card) {
              card.addEventListener('mousemove', function(e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
              });
            });

            // Header scroll opacity
            var header = document.querySelector('header');
            if (header) {
              window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                  header.style.backgroundColor = 'rgba(0,13,61,0.97)';
                } else {
                  header.style.backgroundColor = 'rgba(0,13,61,0.85)';
                }
              }, { passive: true });
            }
          })();
        `}</Script>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
