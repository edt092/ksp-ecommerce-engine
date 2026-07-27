// plan_accion_seo_ksp_vs_articulospromocionales_ec.md — P0 "resolver páginas huérfanas".
//
// audifonos-promocionales, parlantes-bluetooth y soportes-para-celular son
// landings independientes (fuera de /categorias/) que solo se enlazan entre
// sí — ningún hub de categoría ni el home apuntaba a ellas, así que un
// crawler solo las alcanzaba si entraba primero por una de las tres o por
// el único post de blog que menciona audifonos-promocionales. Se exponen
// aquí desde su categoría padre real (tecnologia-promocional) para que
// reciban un enlace contextual desde la red principal del sitio.
export interface CategoryLandingLink {
  href: string;
  title: string;
  desc: string;
}

export const CATEGORY_LANDING_LINKS: Record<string, CategoryLandingLink[]> = {
  'tecnologia-promocional': [
    { href: '/parlantes-bluetooth/', title: 'Parlantes Bluetooth', desc: 'Parlantes personalizados para regalos corporativos de alto impacto.' },
    { href: '/audifonos-promocionales/', title: 'Audífonos Promocionales', desc: 'Audífonos bluetooth personalizados para eventos y campañas.' },
    { href: '/soportes-para-celular/', title: 'Soportes para Celular', desc: 'Soportes y accesorios de escritorio personalizados con tu logo.' },
  ],
};
