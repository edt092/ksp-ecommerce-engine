// Identidad de autores para JSON-LD (docs/seo-improvement-2026-10-09, T03/G02).
//
// /nosotros/ declara la Person "#claudia-gonzalez" con su nombre completo y
// cargo. Los posts del blog emitían el mismo @id con otro nombre ("Claudia
// González") y tres cargos distintos según el post: el mismo nodo con datos
// contradictorios. Aquí vive la única versión; el nombre corto visible en el
// byline queda como alternateName.

const BASE_URL = 'https://www.kronosolopromocionales.com';

export function authorId(displayName: string): string {
  const slug = displayName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${BASE_URL}/nosotros/#${slug}`;
}

export const CLAUDIA_GONZALEZ = {
  '@type': 'Person',
  '@id': `${BASE_URL}/nosotros/#claudia-gonzalez`,
  name: 'Claudia Inés González Ortiz',
  alternateName: 'Claudia González',
  jobTitle: 'Fundadora y Especialista en Productos Promocionales',
  url: `${BASE_URL}/nosotros/`,
  image: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/team/claudia-gonzalez.jpg`,
    width: 320,
    height: 320,
  },
  sameAs: ['https://www.linkedin.com/in/claudia-gonzalez-344a3b132/'],
};

const KNOWN_AUTHORS = new Map([[CLAUDIA_GONZALEZ['@id'], CLAUDIA_GONZALEZ]]);

// Devuelve la Person canónica si el autor del post está identificado en
// /nosotros/; si no, una Person mínima con el nombre visible del post.
export function authorJsonLd(post: { author: string; authorRole?: string; authorImage?: string; authorLinkedIn?: string }) {
  const id = authorId(post.author);
  const known = KNOWN_AUTHORS.get(id);
  if (known) return known;
  return {
    '@type': 'Person',
    '@id': id,
    name: post.author,
    ...(post.authorRole && { jobTitle: post.authorRole }),
    url: `${BASE_URL}/nosotros/`,
    ...(post.authorImage && { image: { '@type': 'ImageObject', url: `${BASE_URL}${post.authorImage}` } }),
    ...(post.authorLinkedIn && { sameAs: [post.authorLinkedIn] }),
  };
}
