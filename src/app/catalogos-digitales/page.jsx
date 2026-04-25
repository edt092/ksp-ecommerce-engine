import CatalogosClient from './CatalogosClient';

export const metadata = {
  title: 'Catálogos de Productos Promocionales | KS Promocionales',
  description: 'Explora los catálogos digitales de KS Promocionales. Descubre artículos promocionales, regalos corporativos y merchandising personalizado para tu empresa en Ecuador.',
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/catalogos-digitales/',
  },
};

export default function CatalogosDigitalesPage() {
  return <CatalogosClient />;
}
