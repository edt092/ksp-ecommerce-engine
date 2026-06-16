'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

export default function CategoryProductsGrid({ products, category }) {
  const PER_PAGE = 12;
  const [displayed, setDisplayed] = useState(products.slice(0, PER_PAGE));
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    setDisplayed(prevDisplayed => {
      if (prevDisplayed.length >= products.length) return prevDisplayed;
      setLoading(true);
      setTimeout(() => {
        setPage(prevPage => {
          const next  = prevPage + 1;
          const start = prevPage * PER_PAGE;
          setDisplayed(prev => [...prev, ...products.slice(start, next * PER_PAGE)]);
          setLoading(false);
          return next;
        });
      }, 250);
      return prevDisplayed;
    });
  }, [products]);

  // Trigger loadMore well before the sentinel (placed right after the grid)
  // actually enters the viewport — independent of how much content (help
  // box, related categories, footer…) sits further down the page.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadMore();
      },
      { rootMargin: '0px 0px 800px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadMore, displayed.length]);

  return (
    <div className="space-y-8">
      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {displayed.map((product, index) => (
          <div
            key={product.id}
            className="animate-slide-up"
            style={{ animationDelay: `${(index % PER_PAGE) * 40}ms` }}
          >
            <ProductCard product={product} category={category} />
          </div>
        ))}
      </div>

      {/* Load-more sentinel — sits right after the grid; rootMargin makes the
          observer fire ~800px early, well before the user reaches anything
          below the grid (help box, related categories, footer). */}
      {displayed.length < products.length && <div ref={sentinelRef} aria-hidden="true" />}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div
              className="w-5 h-5 border-2 border-[#0F2178] border-t-transparent rounded-full"
              style={{ animation: 'spin 0.7s linear infinite' }}
            />
            Cargando más productos…
          </div>
        </div>
      )}

      {/* Progress bar */}
      {displayed.length < products.length && !loading && (
        <div className="text-center pb-4">
          <div className="inline-flex items-center gap-3 text-xs text-gray-400">
            <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F2178] rounded-full transition-all duration-500"
                style={{ width: `${(displayed.length / products.length) * 100}%` }}
              />
            </div>
            <span>{displayed.length} de {products.length} productos</span>
          </div>
        </div>
      )}
    </div>
  );
}
