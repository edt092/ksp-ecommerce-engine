import productsData from '@/data/products.json';
import blogData from '@/data/blog/posts.json';
import categoriesData from '@/data/categories.json';

export default function sitemap() {
  const BASE_URL = 'https://www.kronosolopromocionales.com';
  
  const staticRoutes = [
    '/', '/nosotros/', '/contacto/', '/blog/', 
    '/catalogos-digitales/', '/politica-de-privacidad/',
    '/productos-promocionales-ecuador/', '/productos-promocionales-colombia/',
  ].map(route => ({ url: `${BASE_URL}${route}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }));

  const productRoutes = productsData.map(p => ({
    url: `${BASE_URL}/productos/${p.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const blogRoutes = blogData.map(p => ({
    url: `${BASE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.dateModified || p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryRoutes = categoriesData.map(c => ({
    url: `${BASE_URL}/categorias/${c.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...categoryRoutes];
}
