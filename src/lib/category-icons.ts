// Ícono de categoría (docs/seo-improvement-2026-10-09, F02).
//
// public/images/categorias/<id>.webp: 800 px de ancho, WebP q80, generados el
// 2026-10-09 desde los PNG originales de 1086×1448 (1,8–2,6 MB cada uno; 73,8
// MB → 2,7 MB en total, ver reports/seo-improvement-2026-10-09/
// category-images-before-after.json). Las 3 categorías de bebida añadidas en
// mayo 2026 nunca tuvieron ícono propio: el home pedía un .png inexistente.
// Para ellas se usa la imagen de la categoría en data/categories.json.

const LOCAL_ICON_IDS = new Set([
  'antiestres', 'antimicrobianos', 'automovil', 'bar-y-vino', 'bicicleta', 'calculadoras', 'confeccion',
  'cuidado-personal', 'deportes', 'ecologia', 'econature', 'escritura', 'golf', 'gorras', 'herramientas',
  'hogar', 'iluminacion', 'infantil', 'juegos', 'llaveros', 'maletines', 'master-line', 'medicos',
  'memorias-usb', 'mugs', 'novedades', 'oficina', 'paraguas', 'precio-bomba', 'produccion-nacional',
  'reflectivos', 'relojes', 'tecnologia', 'variedades',
]);

export function categoryIconSrc(category: { id: string; image?: string }): string {
  if (LOCAL_ICON_IDS.has(category.id)) return `/images/categorias/${category.id}.webp`;
  return category.image || '/images/og-image.jpg';
}
