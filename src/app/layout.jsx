import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DigitalAdvisorChat from '@/components/DigitalAdvisorChat';

export const metadata = {
  metadataBase: new URL('https://kspromocionales.com'),
  title: 'Productos Promocionales Ecuador | Regalos KS',
  description: 'Artículos promocionales en Ecuador. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp! Envíos nacionales.',
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: 'https://kspromocionales.com',
    siteName: 'KS Promocionales',
    title: 'Productos Promocionales Ecuador - Calidad Premium',
    description: 'Artículos promocionales en Ecuador. Personalizamos con tu logo. ¡Cotiza por WhatsApp! Envíos a todo el país.',
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
    title: 'Productos Promocionales Ecuador | KS',
    description: 'Artículos promocionales personalizados. Cotiza por WhatsApp. Envíos en Ecuador.',
    images: ['/images/og-image.jpg'],
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
  verification: {
    google: 'verification_token', // Replace with real token
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-EC">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
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
        <DigitalAdvisorChat />
      </body>
    </html>
  );
}
