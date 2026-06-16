// Datos geográficos para páginas de SEO local — KS Promocionales
// Site Ecuador-only — no se vende en Colombia (ver public/_redirects para
// el 301 de las antiguas rutas /productos-promocionales-colombia/*).

export const ecuador = {
  slug: 'productos-promocionales-ecuador',
  nombre: 'Ecuador',
  codigo: 'EC',
  seoTitle: 'Productos Promocionales Ecuador | Regalos Corporativos KS',
  seoDescription: 'Productos promocionales y regalos corporativos en Ecuador. Artículos publicitarios personalizados con envíos a Quito, Guayaquil, Cuenca, Manta y Ambato.',
  h1: 'Productos Promocionales en Ecuador',
  intro: 'KS Promocionales es tu aliado estratégico en artículos publicitarios y regalos corporativos en Ecuador. Ofrecemos más de 1,200 productos personalizados con tu logo para impulsar tu marca en todo el país.',
  ciudades: [
    {
      slug: 'quito',
      nombre: 'Quito',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Quito | Artículos Publicitarios y Regalos Corporativos KS',
      seoDescription: 'Productos promocionales en Quito. Artículos publicitarios, merchandising corporativo y regalos empresariales con entrega en todo el Distrito Metropolitano.',
      h1: 'Productos Promocionales en Quito',
      intro: 'En Quito, capital del Ecuador, brindamos soluciones integrales en productos promocionales y regalos corporativos. Atendemos empresas en el norte, sur, centro histórico, valles de Cumbayá, Tumbaco, Los Chillos y toda la ciudad.',
      caracteristicas: [
        'Entrega en todo el Distrito Metropolitano de Quito',
        'Atención a empresas del sector público y privado',
        'Productos para ferias en Quorum y centros de convenciones',
        'Stock disponible para entregas inmediatas',
      ],
    },
    {
      slug: 'guayaquil',
      nombre: 'Guayaquil',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Guayaquil | Merchandising Empresarial Costa KS',
      seoDescription: 'Productos promocionales en Guayaquil. Artículos publicitarios y merchandising corporativo con envíos a Samborondón, Durán y toda la provincia del Guayas.',
      h1: 'Productos Promocionales en Guayaquil',
      intro: 'Guayaquil, el motor económico del Ecuador, cuenta con nuestra completa línea de artículos promocionales. Servimos a empresas en el centro, norte, sur, Samborondón, Durán y toda la provincia del Guayas.',
      caracteristicas: [
        'Envíos a toda la provincia del Guayas',
        'Productos resistentes al clima cálido costero',
        'Atención al sector comercial, portuario e industrial',
        'Merchandising para ferias y exposiciones empresariales',
      ],
    },
    {
      slug: 'cuenca',
      nombre: 'Cuenca',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Cuenca | Regalos Corporativos Azuay KS',
      seoDescription: 'Productos promocionales en Cuenca y Azuay. Artículos publicitarios personalizados y merchandising corporativo con envíos a toda la región austral.',
      h1: 'Productos Promocionales en Cuenca',
      intro: 'Cuenca, patrimonio cultural de la humanidad, merece productos promocionales de la más alta calidad. Atendemos empresas, instituciones y organizaciones en toda la ciudad y provincia del Azuay con servicio personalizado.',
      caracteristicas: [
        'Envíos a toda la región austral del Ecuador',
        'Productos eco-friendly y artículos de calidad premium',
        'Atención al sector turístico, educativo y artesanal',
        'Merchandising para ferias y eventos culturales locales',
      ],
    },
    {
      slug: 'manta',
      nombre: 'Manta',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Manta | Merchandising Manabí KS',
      seoDescription: 'Productos promocionales en Manta y Manabí. Artículos publicitarios para empresas pesqueras, turísticas e industriales con envíos a toda la provincia.',
      h1: 'Productos Promocionales en Manta',
      intro: 'Manta, puerto principal del Ecuador y capital de Manabí, cuenta con nuestra línea especializada de artículos promocionales. Servimos al sector pesquero, turístico, industrial y comercial de toda la provincia.',
      caracteristicas: [
        'Envíos a toda la provincia de Manabí',
        'Productos para el sector pesquero y marítimo',
        'Atención a industrias atuneras y empresas exportadoras',
        'Artículos resistentes al clima tropical costero',
      ],
    },
    {
      slug: 'ambato',
      nombre: 'Ambato',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Ambato | Merchandising Tungurahua KS',
      seoDescription: 'Productos promocionales en Ambato y Tungurahua. Artículos publicitarios personalizados y regalos corporativos con envíos a toda la sierra central del Ecuador.',
      h1: 'Productos Promocionales en Ambato',
      intro: 'Ambato, la ciudad de las flores y las frutas, es un centro comercial clave del Ecuador. Brindamos artículos promocionales y regalos corporativos a empresas de Tungurahua, Chimborazo y toda la sierra central.',
      caracteristicas: [
        'Envíos a toda la sierra central ecuatoriana',
        'Atención al sector agroindustrial, textil y comercial',
        'Productos para ferias y exposiciones de la región',
        'Servicio personalizado para pymes y grandes empresas',
      ],
    },
  ],
};

export const paises = [ecuador];

export function getPaisBySlug(slug) {
  return paises.find(p => p.slug === slug);
}

export function getCiudadBySlug(paisSlug, ciudadSlug) {
  const pais = getPaisBySlug(paisSlug);
  return pais?.ciudades.find(c => c.slug === ciudadSlug);
}

export function getAllCiudades() {
  return paises.flatMap(p => p.ciudades);
}
