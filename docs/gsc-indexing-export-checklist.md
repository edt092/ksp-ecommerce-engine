# Checklist de exportación GSC — auditoría de indexación 2026-07-19

Los CSV que ya me compartiste en `C:\Users\Dagon\Desktop\KSP-SEO\no_index\` (`Problemas críticos.csv`,
`Problemas no críticos.csv`, `Metadatos.csv`, `Gráfico.csv`) son **el informe agregado** — dan
totales por motivo, no la lista de URLs concretas. Con eso solo pude construir el resumen de
`reports/gsc-indexing-summary-2026-07-19.csv` y un análisis por proxy usando el estado real del
repo. Para llegar a conclusiones definitivas por URL (y no solo estimaciones), Search Console
necesita que exportes, por cada motivo, la tabla de páginas afectadas.

## Cómo exportar cada tabla

En Search Console → **Indexación → Páginas** → sección "¿Por qué no se indexaron las páginas?" →
click en cada motivo → botón **Exportar** (arriba a la derecha) → **Descargar CSV** (o Google Sheets).
Guarda cada archivo en `C:\Users\Dagon\Desktop\KSP-SEO\no_index\` con estos nombres exactos para que
`scripts/analyze-indexing-reasons.mjs` los detecte automáticamente:

| Motivo en GSC | Nombre de archivo esperado | Páginas (informe agregado) |
| --- | --- | ---: |
| Excluida por una etiqueta "noindex" | `noindex.csv` | 373 |
| Página con redirección | `redirect.csv` | 23 |
| No se ha encontrado (404) | `404.csv` | 7 |
| Rastreada: actualmente sin indexar | `crawled-not-indexed.csv` | 85 |
| Duplicada: el usuario no ha indicado ninguna versión canónica | `duplicate-no-canonical.csv` | 1 |
| Descubierta: actualmente sin indexar | `discovered-not-indexed.csv` | 104 |

## Adicional de alta prioridad: la URL duplicada

Es la única fila marcada como **"No iniciada"** (no "Error") y la de menor volumen (1 URL), así
que es el caso más barato de cerrar con certeza total. Además de incluirla en
`duplicate-no-canonical.csv`, si puedes, abre esa URL específica en **Inspección de URLs** dentro
de GSC y comparte una captura o el texto de:
- La URL exacta que Google considera "duplicada".
- La URL que Google eligió como canónica (aparece en la sección "Indexación" → "URL canónica declarada por el usuario" / "URL canónica seleccionada por Google").

Con eso puedo confirmar si coincide con alguno de los 6 grupos de productos con nombre duplicado
que ya detecté localmente en `reports/canonical-audit.csv` (columna `duplicate_group`, valores
`dup-1` a `dup-6`) o si es un caso distinto que no tengo forma de ver desde el código.

## Opcional pero útil: muestras representativas

Si exportar las 6 tablas completas no es práctico ahora mismo, con 10 URLs de muestra de
"Rastreada: actualmente sin indexar" y 10 de "Descubierta: actualmente sin indexar" (las de mayor
volumen después del noindex) ya puedo cruzarlas contra `reports/indexable-product-quality.csv` y
`reports/local-indexability-inventory.csv` para validar si el patrón que encontré por proxy local
(páginas con pocos o cero enlaces internos, o con `content_score` bajo) se sostiene con datos
reales.

## Qué voy a hacer con cada archivo cuando lo tenga

Vuelve a correr, apuntando al mismo directorio:

```
pnpm run seo:indexing "C:\Users\Dagon\Desktop\KSP-SEO\no_index"
```

El script detecta automáticamente qué archivos existen y cuáles faltan (lo imprime en consola),
nunca falla solo por archivos faltantes, y regenera `reports/indexing-redirect-audit.csv` y
`reports/discovered-not-indexed-strategy.csv` con datos reales en vez de la estimación local
actual.

## Qué NO voy a hacer con estos datos

Por instrucción explícita de `noindex.md`: no voy a solicitar indexación masiva de las 593 URLs,
no voy a crear páginas nuevas para rellenar huecos, no voy a cambiar slugs, ni consolidar o
eliminar productos, ni crear cientos de redirects sin verificar antes que cada uno tiene un
destino real y equivalente.
