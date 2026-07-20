import ProductCard from './ProductCard';

// Grid de servidor sin scroll infinito — cada producto pasado se renderiza
// como <a href> real en el HTML estático. Usado por categorías paginadas
// (ver src/lib/category-pagination.ts) donde cada página debe exponer sus
// propios enlaces rastreables en vez de depender de carga client-side.
export default function StaticProductsGrid({ products, category }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} category={category} />
      ))}
    </div>
  );
}
