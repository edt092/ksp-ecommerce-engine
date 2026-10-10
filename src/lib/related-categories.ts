// "Otras categorías" en la página de categoría (docs/seo-improvement-2026-10-09,
// G3). Antes: las 6 primeras categorías con imagen en el orden de
// categories.json, iguales para casi todas las páginas. Ahora: familias por
// tipo de producto y uso de compra, revisables a mano. Ids de
// data/categories.json (no slugs).
//
// Una categoría puede estar en varias familias. Se toman primero las
// hermanas de sus familias (en el orden escrito aquí) y se completa hasta 6
// con el resto de categorías en un orden estable que rota por categoría, para
// no concentrar siempre los mismos enlaces.

const FAMILIES: string[][] = [
  ['mugs', 'termos-personalizados', 'vasos-personalizados', 'tomatodos-botilitos', 'bar-y-vino'],
  ['escritura', 'oficina', 'master-line', 'calculadoras', 'medicos'],
  ['tecnologia', 'memorias-usb', 'iluminacion', 'automovil', 'relojes'],
  ['confeccion', 'gorras', 'deportes', 'reflectivos', 'golf'],
  ['maletines', 'ecologia', 'paraguas', 'cuidado-personal', 'deportes'],
  ['ecologia', 'econature', 'produccion-nacional', 'antimicrobianos'],
  ['deportes', 'bicicleta', 'golf', 'reflectivos', 'tomatodos-botilitos'],
  ['herramientas', 'automovil', 'iluminacion', 'bicicleta'],
  ['hogar', 'bar-y-vino', 'cuidado-personal', 'relojes', 'paraguas'],
  ['infantil', 'juegos', 'antiestres', 'llaveros'],
  ['medicos', 'antimicrobianos', 'cuidado-personal'],
  ['precio-bomba', 'variedades', 'novedades', 'llaveros', 'antiestres'],
];

function stableHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function selectRelatedCategories<T extends { id: string }>(category: T, all: T[], limit = 6): T[] {
  const byId = new Map(all.map((c) => [c.id, c]));
  const picked: string[] = [];
  for (const family of FAMILIES) {
    if (!family.includes(category.id)) continue;
    for (const id of family) {
      if (id !== category.id && byId.has(id) && !picked.includes(id)) picked.push(id);
    }
  }
  const rest = all
    .filter((c) => c.id !== category.id && !picked.includes(c.id))
    .sort((a, b) => stableHash(`${category.id}|${a.id}`) - stableHash(`${category.id}|${b.id}`));
  return [...picked.map((id) => byId.get(id)!), ...rest].slice(0, limit);
}
