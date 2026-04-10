import './globals.css';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Syne, DM_Sans, DM_Serif_Display, Syne_Mono } from 'next/font/google';
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

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
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

const syneMono = Syne_Mono({
  subsets: ['latin'],
  variable: '--font-syne-mono',
  weight: ['400'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.kronosolopromocionales.com'),
  title: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
  description: 'Artículos promocionales y regalos corporativos en Ecuador. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp! Envíos nacionales.',
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: 'https://www.kronosolopromocionales.com/',
    siteName: 'KS Promocionales',
    title: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
    description: 'Artículos promocionales y regalos corporativos en Ecuador. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp! Envíos nacionales.',
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
  url: BASE_URL,
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
    addressLocality: 'Quito',
    addressRegion: 'Pichincha',
    postalCode: '170101',
    addressCountry: 'EC',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -0.1807,
    longitude: -78.4678,
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
  url: BASE_URL,
  name: 'KS Promocionales',
  description: 'Productos promocionales personalizados en Ecuador y Colombia',
  inLanguage: 'es-EC',
  publisher: {
    '@id': `${BASE_URL}/#localbusiness`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-EC" className={`${syne.variable} ${dmSans.variable} ${dmSerif.variable} ${syneMono.variable}`}>
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
        <link rel="dns-prefetch" href="https://catalogospromocionales.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
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
