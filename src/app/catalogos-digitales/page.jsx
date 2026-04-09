import CatalogosClient from './CatalogosClient';

export const metadata = {
  title: 'Catálogos Digitales de Productos Promocionales | KS Promocionales Ecuador',
  description: 'Explora los catálogos digitales de KS Promocionales. Descubre artículos promocionales, regalos corporativos y merchandising personalizado para tu empresa en Ecuador.',
  alternates: {
    canonical: 'https://www.kronosolopromocionales.com/catalogos-digitales/',
  },
};

export default function CatalogosDigitalesPage() {
  return <CatalogosClient />;
}
