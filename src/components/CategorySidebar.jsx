'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CategorySidebar({ categories }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayCategories = isExpanded ? categories : categories.slice(0, 10);

  return (
    <div className="bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-secondary text-white px-4 py-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="font-semibold text-sm uppercase tracking-wider">Categorías</span>
      </div>

      {/* Categories List */}
      <nav className="divide-y divide-gray-100">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categorias/${category.slug}/`}
            className="category-sidebar-item group"
          >
            <span className="group-hover:text-secondary transition-colors">
              {category.name}
            </span>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </nav>

      {/* Show All Button */}
      {categories.length > 10 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 text-sm font-medium text-secondary hover:bg-gray-50 flex items-center justify-center gap-2 border-t border-gray-100 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {isExpanded ? 'Ver menos' : 'Ver todas las categorías'}
        </button>
      )}
    </div>
  );
}
