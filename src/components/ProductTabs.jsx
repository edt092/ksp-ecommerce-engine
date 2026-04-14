'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductTabs({ latest = [], featured = [], bestsellers = [], categories, onQuickView }) {
  const [activeTab, setActiveTab] = useState('latest');

  const tabs = [
    { id: 'latest', label: 'Nuevos' },
    { id: 'bestseller', label: 'Más Vendidos' },
    { id: 'featured', label: 'Destacados' },
  ];

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestseller': return bestsellers;
      case 'featured':   return featured;
      case 'latest':
      default:           return latest;
    }
  };

  const getCategoryForProduct = (product) => {
    return categories.find(c => c.id === product.categoryId);
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="font-serif text-3xl md:text-4xl text-secondary">
            <span className="border-b-2 border-secondary pb-1">Nuestros Productos</span>
          </h2>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={getCategoryForProduct(product)}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href="/#categorias"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 font-semibold hover:bg-secondary-light transition-colors"
          >
            Ver Todos los Productos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
