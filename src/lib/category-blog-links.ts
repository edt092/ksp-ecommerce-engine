// plan_accion_seo_ksp_vs_articulospromocionales_ec.md — P1 "hubs editoriales".
//
// El plan pide enlace bidireccional categoría <-> blog. La dirección
// blog -> categoría ya existía (Fase 12, plan-seo.md); esta dirección
// (categoría -> blog) faltaba por completo (verificado por grep en esa
// sesión, ver docs/content-cluster-priority-map.md). En vez de adivinar
// qué posts encajan con qué categoría por tags/keywords, esta tabla
// reutiliza una relación ya real y verificada: qué posts YA enlazan a
// cada categoría (reports/content-cluster-map.csv, columna
// linked_category_slugs, generado por scripts/audit-content-clusters.mjs).
// Solo se incluyen categorías con 2+ posts enlazando (mínimo del plan);
// las que solo tenían 1 post real se omiten en vez de forzarlas.
// Generado el 2026-07-26 — si se publican posts nuevos, re-ejecutar contra
// un content-cluster-map.csv actualizado en vez de editar a mano.
export interface CategoryBlogLink {
  slug: string;
  title: string;
}

export const CATEGORY_BLOG_LINKS: Record<string, CategoryBlogLink[]> = {
  'antimicrobianos': [
    { slug: 'promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-ecuador', title: "Promocionales Antimicrobianos: La Defensa Invisible que Impulsa tu Marca en Ecuador" },
    { slug: 'boligrafo-flom-4-1-antibacteriano-el-regalo-promocional-que-protege-tu-marca-en-ecuador', title: "Bolígrafo Flom 4-1 Antibacteriano: El Regalo Promocional que Protege tu Marca en Ecuador" },
    { slug: 'cucharas-y-tenedores-que-protegen-descubre-el-set-de-cubiertos-antibacterianos-para-empresas-en-ecuador', title: "¿Cucharas y Tenedores que Protegen? Descubre el Set de Cubiertos Antibacterianos para E..." },
  ],
  'articulos-de-oficina-personalizados': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'guia-definitiva-merchandising-empresas-ecuador', title: "Guía Definitiva: Cómo Elegir Merchandising para Empresas en Ecuador [2026]" },
  ],
  'boligrafos-publicitarios': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador', title: "Cuánto Cuestan los Artículos Promocionales Personalizados en Ecuador 2026" },
  ],
  'camisetas-y-confeccion-corporativa': [
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'cuellos-multifuncionales-personalizados-la-estrategia-publicitaria-imbatible-para-tu-negocio-en-ecuador', title: "Cuellos Multifuncionales Personalizados: La Estrategia Publicitaria Imbatible para tu N..." },
    { slug: 'branding-textiles-personalizados-empresas', title: "Branding con Textiles Personalizados: Crea Uniformes que Venden" },
  ],
  'ecologia': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'productos-promocionales-ecologicos-impulsa-tu-marca-de-forma-sostenible', title: "¿Productos Promocionales Ecológicos? ¡Impulsa tu Marca de Forma Sostenible!" },
    { slug: 'guia-definitiva-merchandising-empresas-ecuador', title: "Guía Definitiva: Cómo Elegir Merchandising para Empresas en Ecuador [2026]" },
  ],
  'econature': [
    { slug: 'productos-promocionales-ecologicos-impulsa-tu-marca-de-forma-sostenible', title: "¿Productos Promocionales Ecológicos? ¡Impulsa tu Marca de Forma Sostenible!" },
    { slug: 'marketing-sostenible-productos-ecologicos-promocionales', title: "Marketing Sostenible: Productos Ecológicos que tu Audiencia Valorará" },
  ],
  'gorras-personalizadas': [
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'cuellos-multifuncionales-personalizados-la-estrategia-publicitaria-imbatible-para-tu-negocio-en-ecuador', title: "Cuellos Multifuncionales Personalizados: La Estrategia Publicitaria Imbatible para tu N..." },
    { slug: 'mejores-regalos-corporativos-para-empresas-ecuador-2026', title: "Los Mejores Regalos Corporativos para Empresas en Ecuador 2026" },
    { slug: 'merchandising-para-ferias-empresariales-ecuador', title: "Merchandising para Ferias Empresariales en Ecuador: Qué Llevar y Cómo Destacar" },
  ],
  'hogar': [
    { slug: 'abre-caminos-al-exito-destapador-con-iman-personalizado-el-iman-de-clientes-para-tu-marca-en-ecuador', title: "¡Abre Caminos al Éxito! Destapador con Imán Personalizado: El Imán de Clientes para tu ..." },
    { slug: 'cucharas-y-tenedores-que-protegen-descubre-el-set-de-cubiertos-antibacterianos-para-empresas-en-ecuador', title: "¿Cucharas y Tenedores que Protegen? Descubre el Set de Cubiertos Antibacterianos para E..." },
  ],
  'llaveros-personalizados': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'llaveros-promocionales-cual-es-la-mejor-opcion-para-tu-presupuesto', title: "Llaveros Promocionales: ¿Cuál es la Mejor Opción para tu Presupuesto?" },
    { slug: 'abre-caminos-al-exito-destapador-con-iman-personalizado-el-iman-de-clientes-para-tu-marca-en-ecuador', title: "¡Abre Caminos al Éxito! Destapador con Imán Personalizado: El Imán de Clientes para tu ..." },
  ],
  'medicos': [
    { slug: 'promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-ecuador', title: "Promocionales Antimicrobianos: La Defensa Invisible que Impulsa tu Marca en Ecuador" },
    { slug: 'boligrafo-flom-4-1-antibacteriano-el-regalo-promocional-que-protege-tu-marca-en-ecuador', title: "Bolígrafo Flom 4-1 Antibacteriano: El Regalo Promocional que Protege tu Marca en Ecuador" },
    { slug: 'cucharas-y-tenedores-que-protegen-descubre-el-set-de-cubiertos-antibacterianos-para-empresas-en-ecuador', title: "¿Cucharas y Tenedores que Protegen? Descubre el Set de Cubiertos Antibacterianos para E..." },
  ],
  'memorias-usb-personalizadas': [
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'mejores-regalos-corporativos-para-empresas-ecuador-2026', title: "Los Mejores Regalos Corporativos para Empresas en Ecuador 2026" },
    { slug: 'productos-tecnologicos-promocionales-tendencias', title: "Productos Tecnológicos Promocionales: Tendencias que Dominan el Mercado" },
    { slug: 'top-10-regalos-corporativos-tecnologicos-2026', title: "Top 10 Regalos Corporativos Tecnológicos para 2026 (con precios)" },
  ],
  'mochilas-y-maletines-personalizados': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'regalos-corporativos-fin-ano-ecuador', title: "Regalos Corporativos de Fin de Año: Las Mejores Ideas para Ecuador" },
    { slug: 'merchandising-para-ferias-empresariales-ecuador', title: "Merchandising para Ferias Empresariales en Ecuador: Qué Llevar y Cómo Destacar" },
  ],
  'mugs-y-termos-personalizados': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador', title: "Cuánto Cuestan los Artículos Promocionales Personalizados en Ecuador 2026" },
  ],
  'novedades': [
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'guia-definitiva-merchandising-empresas-ecuador', title: "Guía Definitiva: Cómo Elegir Merchandising para Empresas en Ecuador [2026]" },
    { slug: 'regalos-corporativos-fin-ano-ecuador', title: "Regalos Corporativos de Fin de Año: Las Mejores Ideas para Ecuador" },
    { slug: 'herramientas-mustang-promocionales-impulsa-tu-marca-con-soluciones-practicas-ecuador', title: "Herramientas Mustang Promocionales: Impulsa tu Marca con Soluciones Prácticas (Ecuador)" },
  ],
  'tecnologia-promocional': [
    { slug: 'productos-promocionales-baratos-guia-completa', title: "Guía Completa: Productos Promocionales Baratos [2025]" },
    { slug: 'productos-promocionales-por-mayor-mayoreo-guia-completa', title: "Guía Completa: Productos Promocionales Por Mayor (Y Por Mayoreo) [2025]" },
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador', title: "Cuánto Cuestan los Artículos Promocionales Personalizados en Ecuador 2026" },
  ],
  'variedades': [
    { slug: 'productos-promocionales-navidenos-guia-completa', title: "Guía Completa: Productos Promocionales Navideños [2025]" },
    { slug: 'listos-para-carnaval-2026-impulsa-tu-marca-con-productos-promocionales', title: "¿Listos para Carnaval 2026? ¡Impulsa tu Marca con Productos Promocionales!" },
    { slug: 'merchandising-eventos-corporativos-ecuador', title: "Merchandising para Eventos Corporativos: Qué Funciona en Ecuador" },
  ],
};
