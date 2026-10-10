# Deploy, rollback y medición

Nada de esto se desplegó. El deploy y el push requieren autorización explícita.

## 1. Antes del deploy

- [ ] Re-medición móvil (ver `NEXT-SESSION.md`) en verde.
- [ ] Revisar el diff completo (`git diff`, ~48 archivos modificados + nuevos en `src/lib`, `src/components`, `public/images`, `scripts/seo-improvement`, `docs/`, `reports/`).
- [ ] Decidir si `0ef0292` (3 redirects legacy, sin desplegar desde el 3 de agosto) sale en el mismo deploy.
- [ ] `pnpm build` + `node scripts/run-seo-tests.mjs` + `pnpm run seo:links` en verde.
- [ ] Commits por lote (sugerido): (1) datos/plantillas, (2) móvil/cotización, (3) enlazado/landings, (4) imágenes, (5) docs y reportes.

## 2. Verificación en producción (después del deploy)

| Comprobación | Esperado |
|---|---|
| `curl -sI .../categorias/` | 301 → `/regalos-corporativos/` |
| `curl -sI .../blog/promocionales-antimicrobianos-la-defensa-invisible-que-impulsa-tu-marca-en-mexico` | Un solo 301 a la URL con barra |
| `curl -sI .../productos/no-existe/` | 404; HTML sin canonical |
| HTML de un retenido (p. ej. `/productos/maletin-urban-travel-7608/`) | `noindex, follow` + canonical propia |
| Home | Sin `OnlineStore`; sin preload de `9781.jpg`; 37 categorías con imagen (sin rotas) |
| `/categorias/gorras-personalizadas/` en un móvil real | H1 sin recortar |
| Producto en móvil | CTA visible tras el H1; banner compacto; Rechazar persiste |
| `/llms.txt` | Sin "1,200", "50-100", "5-15" |
| Rich Results Test en `/`, una categoría, un post | Una sola entidad `#localbusiness`; BreadcrumbList válido; sin Product |
| Imágenes WebP de categoría y hero vía `/.netlify/images` | Cargan; comparar bytes transferidos con DevTools |

Solo después: Inspección de URL en GSC para 5–7 URLs (retenido, categoría paginada, artículo con H1 corregido, Quito,
`/categorias/`). "Validar corrección" solo para motivos donde la causa era del sitio (noindex con canonical home, 404).

## 3. Rollback por lote

Si los cambios se commitean por lote, `git revert <commit>` del lote afectado. Notas:

- **Imágenes:** los PNG originales siguen en el repo; revertir las referencias (`category-icons.ts`, `HomePageClient.tsx`, `regalos-corporativos/page.tsx`, `posts.json`, `additions.js`) restaura el estado anterior.
- **Redirects:** quitar las 2 reglas de `/categorias` en `_redirects` devuelve el 404 anterior.
- **Datos:** `categories.json`, `geo-data.js`, `posts.json` y el contenido del blog solo tienen cambios de texto (sin altas ni bajas de registros).
- **Banner de cookies:** misma clave `ks_cookie_consent` y mismos valores; revertir no afecta consentimientos guardados.

## 4. Medición

| Qué | Cómo | Cuándo |
|---|---|---|
| Fecha y commit desplegado | Anotar aquí | Día del deploy |
| Cohorte intervenida | 3 artículos con H1, 64 retenidos, 102 páginas de categoría, 3 landings, Quito, home | — |
| Cohorte control | Productos sin cambios de enlazado relevantes (p. ej. los 5 de `indexing-triage-baseline.csv`) | — |
| Rendimiento | GSC Web, país Ecuador, ordenador y móvil por separado, 28 días antes vs 28 después | +28 días; revisión a 90 |
| Indexación | Indexación → Páginas, por motivo; Inspección de URL de la cohorte | Semanal |
| Clics de cotización | GA4 `whatsapp_click` por `page_type` y `placement` (nuevos parámetros) | Desde el deploy; un clic no es una cotización |
| Cotizaciones calificadas | Dato del negocio | Mensual |

No usar como objetivo: la nota 73/100 de la auditoría, ni bajar a cero los 370 noindex (muchos son intencionales).
No atribuir efectos antes de 21–28 días. Fin de año (nov–dic) es temporada alta de regalos: comparar con cautela.
