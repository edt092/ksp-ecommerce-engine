'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function CategoryProductsGrid({ products, category }) {
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const PRODUCTS_PER_PAGE = 12;

  // Cargar productos iniciales
  useEffect(() => {
    setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
  }, [products]);

  // Lazy loading al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      // Verificar si el usuario llegó al final de la página
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loading, products]);

  const loadMoreProducts = () => {
    if (displayedProducts.length >= products.length) return;

    setLoading(true);

    // Simular delay para mejor UX
    setTimeout(() => {
      const nextPage = page + 1;
      const start = page * PRODUCTS_PER_PAGE;
      const end = nextPage * PRODUCTS_PER_PAGE;
      const newProducts = products.slice(start, end);

      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-8">
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayedProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-slide-up"
            style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 50}ms` }}
          >
            <ProductCard
              product={product}
              category={category}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Cargando más productos...</span>
          </div>
        </div>
      )}

      {/* Sentinel: más productos están siendo cargados */}
      {!loading && displayedProducts.length < products.length && (
        <div className="h-4" />
      )}
    </div>
  );
}
