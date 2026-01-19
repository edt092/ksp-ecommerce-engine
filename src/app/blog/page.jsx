import Link from 'next/link';
import Image from 'next/image';
import postsData from '@/data/blog/posts.json';

export const metadata = {
  title: 'Blog de Productos Promocionales y Marketing | KSPromocionales Ecuador',
  description: 'Artículos sobre productos promocionales, merchandising, diseño y estrategias de marketing. Consejos expertos para potenciar tu marca en Ecuador.',
  keywords: 'blog productos promocionales, marketing merchandising, diseño branding, regalos corporativos Ecuador',
  openGraph: {
    title: 'Blog KSPromocionales - Marketing y Merchandising Ecuador',
    description: 'Consejos expertos sobre productos promocionales, diseño y estrategias de marketing para empresas.',
    type: 'website',
  },
};

export default function BlogPage() {
  const categories = [...new Set(postsData.map(post => post.categoryName))];

  const getCategoryColor = (category) => {
    const colors = {
      'Productos': 'bg-blue-100 text-blue-700',
      'Marketing': 'bg-green-100 text-green-700',
      'Merchandising': 'bg-purple-100 text-purple-700',
      'Diseño': 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[96px]"></div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              Blog KSPromocionales
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Descubre estrategias, tendencias y consejos expertos sobre productos promocionales, merchandising y branding que transformarán tu negocio.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center px-4">
              <Link
                href="/blog"
                className="px-4 md:px-6 py-2 md:py-2.5 bg-white text-primary font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors"
              >
                Todos
              </Link>
              {categories.map(category => (
                <Link
                  key={category}
                  href={`/blog?category=${category.toLowerCase()}`}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-white/20 text-white font-medium text-sm md:text-base hover:bg-white/30 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {postsData.map((post, index) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 hover:border-primary overflow-hidden transition-all duration-300 group flex flex-col h-full"
              >
                {/* Featured Image */}
                <Link href={`/blog/${post.slug}`} className="block relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold ${getCategoryColor(post.categoryName)}`}>
                    {post.categoryName}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-5 md:p-6 flex-grow flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(post.date).toLocaleDateString('es-EC', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-lg md:text-xl font-semibold text-secondary mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary font-semibold text-sm hover:gap-3 transition-all"
                  >
                    <span>Leer artículo</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Author */}
                <div className="px-5 md:px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-secondary">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-4">
            ¿Listo para Potenciar tu Marca?
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base px-4">
            Convierte lo que aprendiste en acción. Cotiza tus productos promocionales
            personalizados y lleva tu marca al siguiente nivel.
          </p>
          <Link
            href="/#categorias"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            Ver Catálogo de Productos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
