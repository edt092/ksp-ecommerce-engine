import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';

import productsData from '../../../../data/products.json';
import categoriesData from '../../../../data/categories.json';

// Generar rutas estáticas para todas las páginas de productos
export function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }));
}

// Generar metadata SEO para cada producto
export async function generateMetadata({ params }) {
  const product = productsData.find(p => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no está disponible'
    };
  }

  const category = categoriesData.find(c => c.id === product.categoryId);

  return {
    title: product.seoTitle || `${product.name} Personalizado | KS Promocionales`,
    description: product.seoDescription || product.shortDescription,
    keywords: product.keywords || `${product.name}, regalo corporativo, articulo promocional, ${category?.name || ''}`,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: product.images && product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name
        }
      ] : [],
      type: 'website',
      locale: 'es_EC',
      siteName: 'KS Promocionales Ecuador'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: product.images && product.images.length > 0 ? [product.images[0]] : []
    },
    alternates: {
      canonical: `https://kronossolopromocionales.com/productos/${params.slug}/`
    }
  };
}

export default function ProductPage({ params }) {
  const product = productsData.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const category = categoriesData.find(c => c.id === product.categoryId);

  // Get related products from same category
  const relatedProducts = productsData
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      {/* Hero / Product Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/categorias/${category?.slug}`} className="hover:text-primary transition-colors">
                  {category?.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Image Gallery */}
            <ProductImageGallery product={product} category={category} />

            {/* Right: Product Info */}
            <div className="animate-slide-down">
              {/* Category Link */}
              <Link
                href={`/categorias/${category?.slug}`}
                className="inline-block text-sm font-semibold text-primary hover:underline mb-3"
              >
                {category?.name}
              </Link>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                {product.name}
              </h1>

              {/* Short Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">
                {product.shortDescription}
              </p>

              {/* Story */}
              <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">La Historia</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{product.story}</p>
              </div>

              {/* Features */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Características</h2>
                <ul className="space-y-2 md:space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 group">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm md:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Casos de Uso</h2>
                <div className="flex flex-wrap gap-2">
                  {product.useCases.map((useCase, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors cursor-default"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Actions */}
              <div className="border-t pt-6 md:pt-8 mb-6 md:mb-8">
                <ProductActions product={product} />
              </div>

              {/* Trust Signals */}
              <div className="border-t pt-6 md:pt-8">
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2 transform group-hover:scale-110 transition-transform">✨</div>
                    <div className="text-xs md:text-sm font-semibold text-gray-900">Calidad Premium</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2 transform group-hover:scale-110 transition-transform">⚡</div>
                    <div className="text-xs md:text-sm font-semibold text-gray-900">Entrega Rápida</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2 transform group-hover:scale-110 transition-transform">🎨</div>
                    <div className="text-xs md:text-sm font-semibold text-gray-900">100% Personalizable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              También te Puede Interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  category={category}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
