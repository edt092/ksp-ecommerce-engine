import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import postsData from '@/data/blog/posts.json';
import { blogContent } from '@/data/blog/content';
import TableOfContents from '@/components/TableOfContents';

export async function generateStaticParams() {
  return postsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = postsData.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | KS Promocionales',
    };
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = postsData.find(p => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h2>
          <Link href="/blog" className="text-primary hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const content = blogContent[post.slug] || '';
  const relatedPosts = postsData
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

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
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(post.categoryName)}`}>
                {post.categoryName}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(post.date).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{post.readTime} de lectura</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>

            {/* Table of Contents */}
            <div className="mb-8">
              <TableOfContents content={content} />
            </div>

            {/* Article Content */}
            <div
              id="blog-content"
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:my-6 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Etiquetas:</span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">¿Te resultó útil este artículo?</h3>
                  <p className="text-gray-600">Compártelo con tu equipo</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para Implementar estas Estrategias?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Convierte lo que aprendiste en acción. Cotiza tus productos promocionales
              personalizados y potencia tu estrategia de marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#categorias"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
              >
                Ver Catálogo de Productos
              </Link>
              <Link
                href="/nosotros"
                className="inline-block bg-white/10 backdrop-blur text-white border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-colors"
              >
                Conocer Más Sobre KS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Artículos Relacionados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(relatedPost.categoryName)}`}>
                        {relatedPost.categoryName}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
