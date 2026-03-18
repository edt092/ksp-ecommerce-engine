import HomePageClient from './HomePageClient';

export const dynamic = 'force-static';

export const metadata = {
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
