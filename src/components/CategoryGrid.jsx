'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CategoryGrid({ categories }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="categorias" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Nuestras Categorías
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explora Nuestros Productos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Cada categoría cuenta una historia única. Encuentra la perfecta para tu marca.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Category name on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  {category.benefits.slice(0, 2).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold text-sm group-hover:text-primary-dark transition-colors">
                    Ver productos
                  </span>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                    <svg
                      className="w-4 h-4 text-primary group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
