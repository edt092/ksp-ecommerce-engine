# Resumen GSC — KS Promocionales

Generado por `scripts/analyze-gsc.mjs` a partir de una exportación local de Google Search
Console con corte 2026-07-15 (periodo 2025-03-16 a 2026-07-15).
No sustituye a la interfaz de Search Console — los totales pueden diferir por
agregación y anonimización de consultas (Google no expone el 100% de las
consultas por privacidad y truncamiento).

## Totales — dos vistas, NO intercambiables

Search Console no permite sumar directamente el desglose por página con la serie
temporal del gráfico: son dos reportes distintos que Google agrega de forma
diferente. Los clics sí reconcilian; las impresiones no. No trates una cifra
como si fuera la otra.

| Fuente | Clics | Impresiones |
| --- | ---: | ---: |
| Páginas.csv (desglose por URL, 451 filas) | 95 | 3224 |
| Gráfico.csv (serie diaria, 347 filas) | 95 | 2555 |

Los clics coinciden exactamente entre ambos reportes (95). Las impresiones difieren (3224 vs. 2555) porque Páginas.csv y Gráfico.csv provienen de vistas de Search Console con agregación distinta — no es un error del script ni de este análisis.

- Filas de páginas: 451
- Filas de consultas: 100

## Periodo exacto

- Desde: **2025-03-16**
- Hasta: **2026-07-15**
- Fuente: rango de fechas presente en Gráfico.csv (serie diaria).

## Últimos 28 días disponibles (2026-06-18 a 2026-07-15)

- Clics: **26**
- Impresiones: **853**

Estas cifras son las últimas 28 filas diarias de Gráfico.csv, no un filtro de
"últimos 28 días desde hoy" — reflejan el final del periodo exportado.

## Tendencia mensual (Gráfico.csv)

| Mes | Clics | Impresiones |
| --- | ---: | ---: |
| 2025-03 | 0 | 4 |
| 2025-04 | 5 | 20 |
| 2025-05 | 1 | 13 |
| 2025-06 | 0 | 6 |
| 2025-11 | 3 | 4 |
| 2025-12 | 6 | 41 |
| 2026-01 | 6 | 187 |
| 2026-02 | 3 | 144 |
| 2026-03 | 3 | 192 |
| 2026-04 | 9 | 196 |
| 2026-05 | 16 | 582 |
| 2026-06 | 26 | 599 |
| 2026-07 | 17 | 567 |

## Dispositivos

| Dispositivo | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| Ordenador | 70 | 2063 | 3.39% | 19.31 |
| Móviles | 25 | 474 | 5.27% | 14.15 |
| Tablet | 0 | 18 | 0% | 3.56 |

## Países (top 6)

| País | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| Ecuador | 76 | 1194 | 6.37% | 22.85 |
| Colombia | 6 | 136 | 4.41% | 12.82 |
| Estados Unidos | 3 | 728 | 0.41% | 5.15 |
| Brasil | 2 | 24 | 8.33% | 10.08 |
| Alemania | 2 | 6 | 33.33% | 5.17 |
| Guatemala | 1 | 15 | 6.67% | 6.4 |

## Páginas con más clics (top 15)

| URL | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| https://www.kronosolopromocionales.com/ | 35 | 952 | 3.68% | 19.11 |
| https://kronosolopromocionales.com/ | 7 | 32 | 21.88% | 9.44 |
| https://www.kronosolopromocionales.com/productos-promocionales-ecuador/cuenca/ | 4 | 25 | 16% | 8.4 |
| https://www.kronosolopromocionales.com/categorias/boligrafos-publicitarios/ | 2 | 46 | 4.35% | 36.43 |
| https://www.kronosolopromocionales.com/categorias/antiestres/ | 2 | 24 | 8.33% | 14.46 |
| https://www.kronosolopromocionales.com/productos-promocionales-ecuador/ambato/ | 2 | 17 | 11.76% | 5 |
| http://kronosolopromocionales.com/ | 2 | 15 | 13.33% | 4.13 |
| https://www.kronosolopromocionales.com/productos/juego-ruleta-nuevo-13331/ | 2 | 11 | 18.18% | 8.64 |
| https://www.kronosolopromocionales.com/categorias/memorias-usb-personalizadas/ | 2 | 7 | 28.57% | 9.86 |
| https://www.kronosolopromocionales.com/productos/calendario-perpetuo-wood-9983/ | 2 | 5 | 40% | 10.4 |
| https://www.kronosolopromocionales.com/regalos-corporativos/ | 1 | 71 | 1.41% | 30.45 |
| https://www.kronosolopromocionales.com/categorias/mugs-y-termos-personalizados/ | 1 | 56 | 1.79% | 10.66 |
| https://www.kronosolopromocionales.com/productos/set-destornillador-pistol/ | 1 | 28 | 3.57% | 5.39 |
| https://www.kronosolopromocionales.com/blog/boligrafos-promocionales-personalizados-guia-empresas-ecuador/ | 1 | 25 | 4% | 6.6 |
| https://www.kronosolopromocionales.com/blog/cuanto-cuestan-los-articulos-promocionales-personalizados-ecuador/ | 1 | 24 | 4.17% | 6.21 |

## Consultas con más clics/impresiones (top 15)

| Consulta | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| regalos corporativos ecuador | 1 | 20 | 5% | 32.25 |
| regalos corporativos quito | 1 | 15 | 6.67% | 44.93 |
| boligrafos promocionales | 1 | 3 | 33.33% | 7.33 |
| artículos promocionales | 0 | 94 | 0% | 48.84 |
| promocionales | 0 | 74 | 0% | 55.61 |
| articulos de promocion y merchandising | 0 | 65 | 0% | 67.75 |
| articulos promocionales | 0 | 42 | 0% | 51.88 |
| promocionales ecuador | 0 | 33 | 0% | 29.27 |
| regalos corporativos | 0 | 23 | 0% | 50.22 |
| boligrafos | 0 | 16 | 0% | 63.88 |
| promocionales para empresas | 0 | 15 | 0% | 60.27 |
| productos publicitarios en cali | 0 | 14 | 0% | 21 |
| promocionales quito | 0 | 9 | 0% | 35 |
| llaveros | 0 | 9 | 0% | 68.44 |
| llaveros personalizados | 0 | 8 | 0% | 49.75 |

## Fragmentación de dominio detectada

- `https://kronosolopromocionales.com/`: 7 clics, 32 impresiones
- `http://kronosolopromocionales.com/`: 2 clics, 15 impresiones
- `https://kronosolopromocionales.com/product-tag/boligrafobambu/`: 0 clics, 2 impresiones
- `https://kronosolopromocionales.com/product-tag/speakerbluetooth/`: 0 clics, 2 impresiones

## URLs legacy con impresiones residuales (ya redirigidas)

- `/productos/set-destornillador-pistol` → `/categorias/herramientas/` (28 impresiones, posición 5.39)
- `/productos/portacomida-produccion-nacional` → `/productos/portacomida-produccion-nacional-4857/` (36 impresiones, posición 5.42)
- `/productos/canguro-dior` → `/productos/canguro-dior-9823/` (31 impresiones, posición 8.55)
- `/productos/bola-para-mascotas` → `/productos/bola-para-mascotas-10979/` (28 impresiones, posición 4.32)
- `/productos/copa-para-vino-7oz-produccion-nacional` → `/productos/copa-para-vino-7oz-produccion-nacional-2007/` (24 impresiones, posición 7.08)
- `/productos-promocionales-colombia/cali` → `/productos-promocionales-ecuador/` (20 impresiones, posición 19.6)
- `/productos/aplausometro-redondo-produccion-nacional` → `/productos/aplausometro-redondo-produccion-nacional-5685/` (19 impresiones, posición 5.53)
- `/productos/resaltador-magico-en-cera` → `/productos/resaltador-magico-en-cera-4672/` (17 impresiones, posición 6.12)
- `/productos/speaker-bluetooth-con-lampara-oferta` → `/productos/speaker-bluetooth-con-lampara-oferta-9579/` (16 impresiones, posición 6.25)
- `/productos/speaker-bluetooth-barack` → `/productos/speaker-bluetooth-barack-8135/` (14 impresiones, posición 5.64)
- `/productos/linterna-cob-power` → `/productos/linterna-cob-power-9544/` (13 impresiones, posición 7.31)
- `/productos/llavero-ml-356` → `/productos/llavero-ml-356-8039/` (12 impresiones, posición 5.42)
- `/productos/rastreador-airtag-boomtag-nuevo` → `/productos/rastreador-airtag-boomtag-nuevo-13210/` (12 impresiones, posición 6.83)
- `/productos/floyd-stylus` → `/productos/floyd-stylus-5837/` (7 impresiones, posición 3)
- `/productos/audifonos-boom-precio-bomba` → `/productos/audifonos-boom-precio-bomba-5657/` (7 impresiones, posición 9.29)
- `/productos/llavero-destapador-campello` → `/productos/llavero-destapador-campello-4808/` (6 impresiones, posición 24.83)
- `/productos/organizador-multiusos-con-esterilizador-uvc-led-oferta` → `/productos/organizador-multiusos-con-esterilizador-uvc-led-oferta-9494/` (5 impresiones, posición 8)
- `/productos/mouse-pad-vaniat` → `/productos/mouse-pad-vaniat-9862/` (3 impresiones, posición 6)
- `/productos/medidor-de-presion-para-neumaticos-nuevo` → `/productos/medidor-de-presion-para-neumaticos-nuevo-13297/` (2 impresiones, posición 8.5)
- `/productos/vuvuzela-colombia-produccion-nacional-5682` → `/productos/vuvuzela-produccion-nacional-5682/` (2 impresiones, posición 10)
- `/productos/boligrafo-flaggy-colombia-13287` → `/productos/boligrafo-flaggy-13287/` (1 impresiones, posición 6)
- `/productos/bolsa-en-cambrel-arcadia-para-sublimacion-nuevo-13591-2023` → `/productos/bolsa-en-cambrel-arcadia-para-sublimacion-nuevo-13591/` (1 impresiones, posición 10)
- `/productos/sticky-set-leader-eco` → `/productos/sticky-set-leader-eco-3382/` (1 impresiones, posición 10)

Ver detalle completo en `reports/gsc-page-opportunities.csv`, `reports/gsc-query-opportunities.csv`,
`reports/gsc-product-opportunities.csv`, `reports/gsc-domain-variants.csv` y `reports/gsc-legacy-urls.csv`.
