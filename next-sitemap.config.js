/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://kspromocionales.com',
  generateRobotsTxt: true,
  outDir: './out',
  // Configuración para sitios estáticos con output: 'export'
  generateIndexSitemap: false,
  // Excluir rutas que no deben estar en el sitemap
  exclude: ['/api/*', '/_next/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    additionalSitemaps: [],
  },
  // Transformar URLs para añadir trailing slash (acorde a tu configuración)
  transform: async (config, path) => {
    // Normalizar path con trailing slash
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    // Configurar prioridades según el tipo de página
    let priority = 0.7;
    let changefreq = 'weekly';

    if (normalizedPath === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (normalizedPath.startsWith('/categorias/')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (normalizedPath.startsWith('/productos/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (normalizedPath.startsWith('/nosotros/')) {
      priority = 0.7;
      changefreq = 'monthly';
    } else if (normalizedPath.startsWith('/blog/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: normalizedPath,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  autoLastmod: true,
}
