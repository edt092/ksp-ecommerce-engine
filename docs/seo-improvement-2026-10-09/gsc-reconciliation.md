# Reconciliación de Search Console — exports del 2026-10-09

Reproducible con:

```text
node scripts/seo-improvement/reconcile-gsc.mjs "<ruta>\ANALISI-09-10-2026"
```

Salida completa: `reports/seo-improvement-2026-10-09/gsc-reconciliation.json`.

## 1. Metadatos de los exports

| Export | Propiedad | Tipo | Rango | País | Dispositivo | Filtro de tabla | Fecha de export |
|---|---|---|---|---|---|---|---|
| `rendimiento-3-meses-ecuador` | No figura en los CSV (se asume la propiedad de `www.kronosolopromocionales.com`) | Web | "Últimos 3 meses" = 2026-07-07 → 2026-10-06 (92 filas diarias) | Ecuador | Todos | Ninguno declarado | No figura; la carpeta es del 2026-10-09 |
| `rendimiento-3-meses-todos-los-paises` | Ídem | Web | Ídem | Todos | Todos | Ninguno declarado | Ídem |
| `Paginas-no-index` | Ídem | — | 2026-07-11 → 2026-10-03 (85 filas; 12 primeras sin conteo) | — | — | "Todas las páginas conocidas" (no solo sitemap) | Ídem |

**Dato que falta:** el tipo de propiedad (dominio vs. prefijo de URL). Si fuese una propiedad de dominio, los datos
incluyen `http://`, apex y `www`; si fuese de prefijo, solo `https://www`. Esto puede explicar parte de las
diferencias entre dimensiones. Confirmarlo en GSC → Configuración.

## 2. Totales por dimensión

| Dimensión | Ecuador clics / impr. | Global clics / impr. | Reconcilia con el gráfico |
|---|---|---|---|
| Gráfico (propiedad) | 193 / 3.217 | 222 / 4.535 | — |
| Países | 193 / 3.217 | 222 / 4.535 (53 países) | Sí, exacto |
| Dispositivos | 193 / 3.217 | 222 / 4.535 | Sí, exacto |
| Tabla de páginas | 18 / 1.301 | 224 / 5.025 | **No** (Ecuador −175 clics; global +2 clics, +490 impr.) |
| Consultas visibles | 18 / 1.083 | 20 / 1.371 | **No** (anonimización esperable) |

Interpretación, sin imputar causas:

- Países y dispositivos usan agregación por propiedad igual que el gráfico, por eso cuadran.
- La tabla de páginas agrega por página: una impresión de una consulta con varias URLs del sitio cuenta para cada
  URL, y las impresiones pueden superar al gráfico (lo que ocurre en global: 5.025 > 4.535). Eso es documentado por
  Google, no un error del CSV.
- **La tabla de páginas de Ecuador (18 clics) es anómala:** con la misma agregación, global da 224 clics. Que el
  export filtrado por Ecuador solo atribuya 18 clics a páginas mientras el gráfico de Ecuador tiene 193 no se
  explica por agregación. Hipótesis a comprobar (no probadas): export de la tabla hecho con otro filtro o rango,
  tabla truncada, o mezcla de exports. **No se usan las filas de páginas de Ecuador para repartir tráfico.**
- Consultas: 18 de 193 clics visibles (9 %) en Ecuador. El resto son consultas anonimizadas o de cola larga; no se
  imputan.

**Acción humana:** re-exportar en GSC Rendimiento → filtro País = Ecuador → pestaña Páginas, mismo rango, y
comprobar si la suma de clics se acerca a 193.

## 3. Tendencia (Ecuador, gráfico)

| Periodo | Clics | Impr. | CTR | Pos. ponderada |
|---|---|---|---|---|
| Agosto completo | 68 | 1.076 | 6,32 % | 17,70 |
| Septiembre completo | 72 | 1.179 | 6,11 % | 16,05 |
| 12 ago – 8 sep (28 d) | 66 | 1.064 | 6,20 % | 18,65 |
| 9 sep – 6 oct (28 d) | 74 | 1.161 | 6,37 % | 14,97 |

Julio y octubre son parciales; no se comparan con meses completos. Móvil Ecuador: 59 / 1.051, CTR 5,61 %, pos. 7,74
(30,6 % de los clics). Ordenador: 134 / 2.159, CTR 6,21 %, pos. 20,10. La diferencia de posición depende de la
mezcla de consultas; no prueba nada sobre la plantilla móvil.

## 4. Indexación y cronología de septiembre

| Fecha | Indexadas | Sin indexar | Conocidas | Δ indexadas |
|---|---|---|---|---|
| 2026-07-23 | 1.863 | 534 | 2.397 | — |
| 2026-07-24 | 1.876 | 681 | 2.557 | +13 (y +147 sin indexar: universo +160) |
| 2026-09-17 | 1.808 | 752 | 2.560 | erosión gradual de −68 desde el 24 jul |
| 2026-09-18 | 1.700 | 860 | 2.560 | **−108** |
| 2026-09-21 | 1.293 | 1.263 | 2.556 | **−407** |
| 2026-10-03 | 1.293 | 1.263 | 2.556 | 0 |

Contraste con el repositorio y el despliegue:

- Último commit en `origin/main`: `864dfdf`, 2026-07-27. No hay commits entre el 27 de julio y el 9 de octubre
  salvo `0ef0292` (3 de agosto), que no está desplegado (verificado en vivo).
- El build de Netlify (`npm run build`) solo lee `data/` del repo; no consulta Neon ni fuentes externas.
- `.github/workflows/daily-scraper.yml` tiene el `schedule` comentado (desactivado).
- **Conclusión:** no hay ningún cambio de código ni de datos del sitio que coincida con el 18 o el 21 de septiembre
  en lo que el repositorio permite ver. Las caídas parecen originarse del lado de Google (reevaluación de calidad o
  recálculo del informe; el informe de indexación se actualiza por lotes y el escalón no fecha cada exclusión).
  **Esto no está probado:** falta el historial de deploys de Netlify (un deploy manual o un rebuild desde la UI no
  dejaría rastro en git) y faltan las URLs de cada motivo.
- El universo de URLs conocidas creció de 2.397 a 2.556–2.560: Google conoce ~360 URLs más que el sitemap (2.197).
  Encaja con URLs legacy (Colombia, slugs sin SKU, redirects) que siguen en su memoria.
- 370 "noindex" en GSC frente a 64 retenidos en el repo: los otros ~300 son URLs que **en algún momento** sirvieron
  noindex (p. ej. productos retenidos de catálogos anteriores, 2.185 → 2.100). No se puede saber cuáles sin el export.

## 5. Datos que faltan (bloquean el diagnóstico por URL)

1. Exportar desde GSC → Indexación → Páginas, para cada motivo, la lista de ejemplos (máx. 1.000 por motivo):
   "Rastreada: actualmente sin indexar" (571), "Excluida por noindex" (370), "Descubierta: actualmente sin indexar"
   (230), "Página con redirección" (70), "Duplicada sin canónica" (15), "404" (7).
2. Historial de deploys de Netlify entre el 1 y el 25 de septiembre.
3. Tipo de propiedad GSC (dominio o prefijo).
4. Re-export de la tabla Páginas de Ecuador (ver §2).

Con (1), `scripts/seo-improvement/indexing-triage.mjs` puede ampliarse para leer las listas y clasificar cada URL
(intencional vs. accidental) en vez de una cohorte manual.
