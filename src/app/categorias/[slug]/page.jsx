import { notFound } from 'next/navigation';
import Image from 'next/image';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';

import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

// Generate static params for all categories
export async function generateStaticParams() {
  return categoriesData.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }) {
  const category = categoriesData.find(c => c.slug === params.slug);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      type: 'website',
    },
  };
}

export default function CategoryPage({ params }) {
  const category = categoriesData.find(c => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  // Get all products for this category
  const categoryProducts = productsData.filter(p => p.categoryId === category.id);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {category.image && (
          <div className="absolute inset-0">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/85 to-primary-dark/85"></div>
          </div>
        )}

        {/* Fallback gradient if no image */}
        {!category.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-down px-4">
            {category.name}
          </h1>
          <p className="text-sm md:text-base text-white/70 mb-4">
            {category.productCount} productos disponibles
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up px-4">
            {category.story}
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
            {category.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explora Nuestros Productos
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Cada producto cuenta una historia única de tu marca
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <CategoryProductsGrid
              products={categoryProducts}
              category={category}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base md:text-lg">
                Próximamente más productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
