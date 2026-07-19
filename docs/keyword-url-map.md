# Mapa consulta → URL → intención

Basado en `reports/gsc-query-opportunities.csv` y `reports/gsc-page-opportunities.csv`
(export GSC 2025-03-16 a 2026-07-15). No se ha realizado investigación de volumen de
búsqueda externa — solo impresiones/posición reales de Search Console.

## Mapa maestro (clúster → URL → funnel → riesgo)

| Keyword o clúster | URL primaria | Intención | Etapa del funnel | URL de apoyo | Riesgo de canibalización | Enlaces internos | Acción recomendada |
| --- | --- | --- | --- | --- | --- | --- | --- |
| artículos promocionales / promocionales | `/articulos-promocionales/` | Transaccional/comercial | Consideración | Home, categorías destacadas | Medio — compite con home y con "productos promocionales Ecuador" por intención genérica | Enlazado desde home (añadido esta sesión) y footer | Diferenciar copy frente a home antes de invertir en más contenido (Fase 3) |
| promocionales Ecuador / productos promocionales Ecuador | `/productos-promocionales-ecuador/` | Transaccional/comercial + geo | Consideración | Páginas de ciudad (Quito, Guayaquil, Cuenca, Manta, Ambato) | Medio — compite con ciudades individuales por consultas genéricas | Home (añadido esta sesión), footer, páginas de ciudad | Mantener como hub nacional; no crear más páginas de ciudad (instrucción explícita del brief) |
| regalos corporativos (+ Ecuador, Quito) | `/regalos-corporativos/` | Transaccional/comercial | Decisión | `/productos-promocionales-ecuador/quito/` | Bajo — intención clara y única | Home (múltiples enlaces preexistentes), footer | Candidata a primer experimento de Fase 3 (mayor impresiones sin clics del sitio: 71 impresiones, 1 clic) |
| bolígrafos promocionales | `/categorias/boligrafos-publicitarios/` (transaccional) + `/blog/boligrafos-promocionales-personalizados-guia-empresas-ecuador/` (informacional) | Dual: transaccional (categoría) / informacional (artículo) | Categoría=Decisión, Artículo=Descubrimiento | — | Alto antes de esta sesión (H1/título casi idénticos) — mitigado: se diferenció el H1/seoTitle de la categoría | Artículo enlaza prominentemente a la categoría (verificado, ya existente) | Monitorear posición de ambas URLs 21-28 días tras el cambio de H1 |
| mugs y termos / termos con logo | `/categorias/mugs-y-termos-personalizados/` | Transaccional/comercial | Decisión | — | Bajo | Reforzado con enlace desde artículo de fidelización VIP (esta sesión) | Evaluar impacto del editorial ampliado (capacidades reales) en 21-28 días |
| artículos antiestrés | `/categorias/antiestres/` | Transaccional/comercial | Decisión | `/blog/solucion-antiestres-bolas-neon-promocionales-para-empresas-en-ecuador/` | Bajo | Ya enlazado desde artículo dedicado (2 veces) | No tocar snippet (CTR 8.33% ya positivo) — solo autoridad interna |

## Keywords comerciales de medio plazo (hallazgo #13)

| Consulta | Impresiones | Posición | URL objetivo actual | Intención |
| --- | ---: | ---: | --- | --- |
| artículos promocionales | 94 | 48.84 | `/articulos-promocionales/` | Transaccional/comercial |
| promocionales | 74 | 55.61 | `/articulos-promocionales/` o home | Navegacional ambigua |
| artículos de promoción y merchandising | 65 | 67.75 | `/articulos-promocionales/` | Transaccional/comercial |
| artículos promocionales (sin tilde) | 42 | 51.88 | `/articulos-promocionales/` | Transaccional/comercial |
| promocionales Ecuador | 33 | 29.27 | `/productos-promocionales-ecuador/` | Transaccional/comercial + geo |
| regalos corporativos | 23 | 50.22 | `/regalos-corporativos/` | Transaccional/comercial |
| regalos corporativos Ecuador | 20 | 32.25 | `/regalos-corporativos/` | Transaccional/comercial + geo |
| regalos corporativos Quito | 15 | 44.93 | `/productos-promocionales-ecuador/quito/` + `/regalos-corporativos/` | Transaccional/comercial + local |
| promocionales Quito | 9 | 35 | `/productos-promocionales-ecuador/quito/` | Transaccional/comercial + local |

Todas estas consultas están en posición >29 (fuera de página 3), consistente con el hallazgo
del brief: **no son quick wins de CTR**, requieren autoridad temática y enlazado interno
sostenido (ver `docs/seo-roadmap-100-clicks.md`, Fase 3).

## Clúster bolígrafos (hallazgo #9)

| URL | Rol de intención | Clics | Impresiones | Posición |
| --- | --- | ---: | ---: | ---: |
| `/categorias/boligrafos-publicitarios/` | Transaccional — cotización, catálogo | 2 | 46 | 36.43 |
| `/blog/boligrafos-promocionales-personalizados-guia-empresas-ecuador/` | Informacional — guía de compra | 1 | 25 | 6.6 |

Consulta `boligrafos promocionales` (posición 7.33, CTR 33% con muestra pequeña) probablemente
alimenta al artículo (mejor posicionado que la categoría). El artículo debe seguir enlazando
prominentemente a la categoría para transferir esa autoridad hacia la página transaccional —
confirmado y reforzado en esta sesión.

## Decisión: `/blog/mejores-productos-promocionales-2025/`

**Datos:** 118 impresiones, 0 clics, posición 5.37 — la mejor posición de todo el sitio para
una página sin clics. `date`/`dateModified` en `posts.json`: 2025-01-15 (sin actualizar desde entonces).

**Opción elegida: A — actualizar a evergreen conservando la URL**, no la C (renombrar título
a "2025-2026") ni la B (nueva URL con 301).

**Razón:** la posición 5.37 con 118 impresiones indica que Google ya confía fuertemente en esta
URL para su tema — cambiar el slug (opción B) arriesgaría esa señal sin garantía de recuperarla,
algo que el brief prohíbe explícitamente salvo plan de migración justificado. La opción C (forzar
"2025-2026" en el título) es parche temporal que habría que repetir cada año. La opción A resuelve
el problema de raíz: reencuadrar el contenido como guía evergreen ("los mejores productos
promocionales cada año", con la lista y criterios de selección explicados de forma atemporal en
vez de atada a un año concreto), manteniendo la URL y actualizando `dateModified` para reflejar
la revisión real. Pendiente de ejecución de contenido (ver tarea de "quick win" en el informe final
— requiere reescritura del cuerpo del artículo, que se aborda por separado de este mapa).

**No se cambió el slug.**

## Fin de año — `/blog/regalos-corporativos-fin-ano-ecuador/`

258 impresiones, 0 clics, posición 9 — la mayor oportunidad de CTR inmediato del sitio (top 10
con impresiones altas y cero clics). Ver mejoras de contenido aplicadas en el informe final.
