# Datos de negocio necesarios

Preguntas mínimas. Cada una indica qué se publica hoy, qué falta y qué se desbloquea. Nada de esto se inventó: donde
falta el dato, el sitio dice ahora "se confirma en la cotización".

## 1. Operación (prioridad alta)

| # | Pregunta | Hoy en el sitio | Impacto |
|---|---|---|---|
| B1 | ¿Cuál es la cantidad mínima por técnica o tipo de producto? (p. ej. bordado en gorras, serigrafía en bolígrafos, sublimación en mugs) | "El mínimo depende del modelo y de la técnica… te lo confirmamos en la cotización" (`business-facts.ts` → `minimumOrderAnswer`). Antes: 12/24/25/50/100 uds contradictorias. | Restaurar cifras reales por categoría en FAQ, metadescripciones (`categories.json`) y `llms.txt`. Mejora la conversión del comprador "200 unidades rápido". |
| B2 | ¿Plazo típico de producción por técnica, desde la aprobación del arte? ¿Hay servicio urgente? | Dependencia + "te confirmamos la fecha en la cotización" (`leadTimeAnswer`). Antes: 5–15 / 10–15 / 10–20 / 7–21 días y "opciones express". | Igual que B1. |
| B3 | ¿El SLA de 48 h es tiempo de respuesta a la cotización? ¿Hábiles? | "Respuesta en 48h" (`responseTimeLabel`). Se eliminaron "24 h", "garantizada" e "inmediata". | Confirmar o corregir una sola constante. |
| B4 | Tiempos de envío desde Quito ("1-2 días hábiles a Guayaquil, Cuenca y Manta…", `/productos-promocionales-ecuador/`) | Publicado sin cambios. | Confirmar o retirar. |
| B5 | ¿La cotización incluye la personalización? ¿Se envía muestra física en pedidos grandes? | FAQ de `/regalos-corporativos/` lo afirma. | Confirmar. |
| B6 | ¿Hay retiro en Quito? ¿Dirección real o atención solo con cita? | Se quitó "retiro en Quito" de `llms.txt`. El schema global sigue con `streetAddress: "Norte de Quito"`. | Decidir modelo (dirección real vs área de servicio). |

## 2. Proveedor (prioridad media)

| # | Pregunta | SKUs / refs | Impacto |
|---|---|---|---|
| P1 | Ficha técnica (material, medidas, capacidad, área de impresión, técnicas compatibles) de los 30 SKUs del piloto | `reports/seo-improvement-2026-10-09/product-pilot-candidates.csv` | Piloto de ficha verificable (G1): sustituir copy genérico por especificaciones reales. |
| P2 | ¿Refs 8986 y 13197 (Mug Star 350 ml) son la misma pieza? | 8986, 13197 | Consolidar con 301 o diferenciar. |
| P3 | Técnica de la ref 3742 (Mercury 850 ml): ¿láser o full color? | 3742 | Desbloquear el par Mercury. |
| P4 | ¿El soporte Strike (ref 10282) es plegable? | 10282 | Desbloquear el par Strike. |
| P5 | Ficha de speakers Barack/Rocco/Clock Eco/Lights Eco, Summit Stylus, set Apache | 8135, 8637, 10835, 9798, 5747, 10288 | Enriquecer las 6 fichas más delgadas. |
| P6 | ¿Autoriza Cataprom servir sus fotos desde el dominio de KS (copia local)? | 2.011 productos | Mirror local de imágenes (F04). |
| P7 | Fotos reales para los 11 productos con placeholder | `_placeholder-ksp.jpg` | Quitar placeholders. |

## 3. Decisiones (requieren respuesta del usuario)

1. **Consolidar `paraguas-27-5913-3858` → `paraguas-27-5913`** (imagen errónea de bolígrafos, misma imagen original 5913). Sí / no.
2. **Subcategorías piloto**: ¿construir mochilas (53), cargadores/power banks (38) y libretas (33)? Sí / no / cuáles.
3. **Header fijo**: ¿el header debe quedarse fijo al hacer scroll (diseño original) o en el flujo (comportamiento actual en producción)?
4. **Portadas de catálogo `relojes-catalogo-*`**: ¿noindex o redirigir a `/catalogos-digitales/`?

## 4. Acceso (para cerrar el diagnóstico de indexación)

- Export de GSC → Indexación → Páginas con la lista de URLs de cada motivo (571 / 370 / 230 / 70 / 15 / 7).
- Historial de deploys de Netlify del 1 al 25 de septiembre de 2026.
- Tipo de propiedad GSC (dominio o prefijo) y re-export de la tabla Páginas filtrada por Ecuador.

## 5. Autoridad (trabajo humano, fuera de automatización)

Testimonios con permiso (`docs/review-collection-workflow.md`), página de empresa en LinkedIn, perfiles oficiales para
`sameAs`. GBP sigue fuera de alcance por decisión anterior.
