import './globals.css';
import Script from 'next/script';
import { Inter, Poppins, Space_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

// Google Fonts optimizadas
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.kronosolopromocionales.com'),
  title: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
  description: 'Artículos promocionales y regalos corporativos en Ecuador. Personalizamos mugs, tecnología y más con tu logo. ¡Cotiza por WhatsApp! Envíos nacionales.',
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: 'https://www.kronosolopromocionales.com',
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
    <html lang="es-EC" className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
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
      </body>
    </html>
  );
}
