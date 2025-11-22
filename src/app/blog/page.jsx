import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag } from 'lucide-react';
import postsData from '@/data/blog/posts.json';

export const metadata = {
  title: 'Blog de Productos Promocionales y Marketing | KS Promocionales Ecuador',
  description: 'Artículos sobre productos promocionales, merchandising, diseño y estrategias de marketing. Consejos expertos para potenciar tu marca en Ecuador.',
  keywords: 'blog productos promocionales, marketing merchandising, diseño branding, regalos corporativos Ecuador',
  openGraph: {
    title: 'Blog KS Promocionales - Marketing y Merchandising Ecuador',
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Blog KS Promocionales
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Descubre estrategias, tendencias y consejos expertos sobre productos promocionales,
              merchandising y branding que transformarán tu negocio.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/blog"
                className="px-4 py-2 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Todos
              </Link>
              {categories.map(category => (
                <Link
                  key={category}
                  href={`/blog?category=${category.toLowerCase()}`}
                  className="px-4 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsData.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in flex flex-col h-full border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured Image */}
                <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Category Badge */}
                  <span className={`absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(post.categoryName)}`}>
                    {post.categoryName}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.date).toLocaleDateString('es-EC', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-5 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all group/link"
                  >
                    <span>Leer artículo completo</span>
                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Author */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        width={44}
                        height={44}
                        className="rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{post.author}</p>
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
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Potenciar tu Marca?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Convierte lo que aprendiste en acción. Cotiza tus productos promocionales
            personalizados y lleva tu marca al siguiente nivel.
          </p>
          <Link
            href="/#categorias"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300"
          >
            Ver Catálogo de Productos
          </Link>
        </div>
      </section>
    </div>
  );
}
