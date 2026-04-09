import HomePageClient from './HomePageClient';

export const dynamic = 'force-static';

export const metadata = {
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
    languages: {
      'es-EC': 'https://www.kronosolopromocionales.com/',
      'es-CO': 'https://www.kronosolopromocionales.com/',
      'x-default': 'https://www.kronosolopromocionales.com/',
    },
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
