# Checklist de datos de campo — Core Web Vitals

Este documento explica cómo registrar datos de campo **reales** (de usuarios reales visitando el
sitio en producción), que son la fuente que Google usa para ranking — no los datos de laboratorio
de `reports/core-web-vitals-lab.md`. Ningún dato de campo se generó en esta sesión: este entorno
no tiene acceso de red saliente para consultar estas APIs.

## Diferencia entre campo y laboratorio

| | Datos de campo | Datos de laboratorio |
| --- | --- | --- |
| Fuente | Usuarios reales (CrUX, GSC) | Lighthouse, PageSpeed Insights (lab) |
| Ventana | Percentil 75, 28 días móviles | Una sola carga simulada |
| INP | Sí (medible) | No — Lighthouse reporta TBT como proxy, no es INP |
| Usar para ranking | Sí, es lo que Google usa | No directamente |
| Usar para debugging | Limitado (agregado) | Sí, desglose por recurso |

## 1. Google Search Console — Core Web Vitals

1. Entra a Search Console → sección "Core Web Vitals" (o "Experiencia").
2. Revisa el estado agregado de URLs móviles y de escritorio: Buenas / Necesitan mejora / Malas.
3. Google agrupa URLs por plantilla similar — si `/productos/x/` sale mala, probablemente todas
   las fichas de producto comparten el mismo problema.
4. Exporta la lista de URLs afectadas por métrica (LCP, INP, CLS) para priorizar.
5. Frecuencia recomendada: revisar junto con cada exportación de GSC (próxima: 2026-08-15).

## 2. PageSpeed Insights (datos de campo + laboratorio en una sola consulta)

1. Ir a https://pagespeed.web.dev/
2. Probar cada una de las 6 URL representativas usadas en `reports/core-web-vitals-lab.md`:
   - `https://www.kronosolopromocionales.com/`
   - `https://www.kronosolopromocionales.com/regalos-corporativos/`
   - `https://www.kronosolopromocionales.com/categorias/mugs-y-termos-personalizados/`
   - `https://www.kronosolopromocionales.com/blog/regalos-corporativos-fin-ano-ecuador/`
   - `https://www.kronosolopromocionales.com/productos-promocionales-ecuador/cuenca/`
   - Una ficha de producto indexable (ej. `https://www.kronosolopromocionales.com/productos/organizador-multiusos-link-nuevo-13536/`)
3. Si la URL tiene suficiente tráfico, PageSpeed Insights mostrará una sección "Datos de campo"
   separada de "Datos de laboratorio" — comparar contra los resultados de
   `reports/core-web-vitals-lab.md` para ver si el sesgo del servidor local fue significativo.
4. Si no hay suficiente tráfico para datos de campo por URL, PSI puede mostrar datos agregados a
   nivel de origen (todo el dominio) — sigue siendo información real, más general.

## 3. Chrome UX Report (CrUX) — API directa

Para automatizar el registro histórico sin abrir la web cada vez:

1. Obtener una API key de CrUX: https://developer.chrome.com/docs/crux/api
2. Consultar el endpoint `https://chromeuxreport.googleapis.com/v1/records:queryRecord` con
   `{"url": "https://www.kronosolopromocionales.com/", "formFactor": "PHONE"}` (y `"DESKTOP"`).
3. La respuesta trae histogramas de LCP/INP/CLS en percentil 75 sobre una ventana móvil de 28 días.
4. Repetir para cada una de las 6 URLs representativas y para el origen completo (sin path).

## 4. Registro recomendado

Añadir una fila a `docs/seo-measurement-plan.md` (plantilla de registro de cambios por URL) cada
vez que se consulten estos datos, con fecha y valores de LCP/INP/CLS de campo, para poder
comparar contra el baseline de laboratorio de esta sesión y contra futuros cambios de código
(ej. optimización de `regalos-promocionales.png`, ver `reports/core-web-vitals-lab.md` hallazgo 1).

## Objetivos (recordatorio)

- LCP ≤ 2.5 s (percentil 75)
- INP ≤ 200 ms (percentil 75)
- CLS ≤ 0.1 (percentil 75)

No se debe declarar que el sitio "cumple" o "no cumple" estos objetivos basándose solo en los
datos de laboratorio de esta sesión — se necesitan los datos de campo de las fuentes anteriores.
