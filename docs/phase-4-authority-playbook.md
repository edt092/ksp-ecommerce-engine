# Playbook de Fase 4 — Autoridad

Preparado en la sesión seo-5 (2026-07-18). **Nada de lo aquí descrito fue publicado, enviado ni
contactado** — son activos y procedimientos internos listos para que el equipo de KS
Promocionales los ejecute cuando decida. No se operó Netlify, no se envió ningún mensaje, no se
contactó a terceros.

Ver también: `docs/templates/seo-case-study-template.md` (línea C) y
`docs/editorial-link-outreach-plan.md` (línea D).

## A. Google Business Profile

### Checklist de perfil

- [ ] Nombre real del negocio: **KS Promocionales** (sin keywords añadidas — Google penaliza
      nombres de negocio con keywords artificiales, ej. "KS Promocionales | Artículos
      Promocionales Ecuador" está mal; solo el nombre real).
- [ ] Categoría principal real (ej. "Empresa de artículos promocionales" o la más cercana
      disponible en GBP — confirmar con el catálogo de categorías de Google, no inventar una).
- [ ] Categorías secundarias solo si reflejan servicios reales ofrecidos (ej. imprenta
      publicitaria, si aplica).
- [ ] Teléfono de contacto verificado y coincidente con el mostrado en `/contacto/`.
- [ ] Horarios reales de atención.
- [ ] Área de servicio: Ecuador (o las ciudades/provincias reales que se atienden — coherente con
      `data/geo-data.js`: Quito, Guayaquil, Cuenca, Manta, Ambato).
- [ ] Sitio web con `www`: `https://www.kronosolopromocionales.com/`.
- [ ] Logo actualizado (mismo archivo que `public/images/logo.png` o versión de mayor resolución).
- [ ] Foto de portada representativa (no genérica de stock).
- [ ] Fotografías propias de producto, oficina o equipo (no capturas de catálogo de proveedor).
- [ ] Productos representativos cargados (puede reflejar categorías de `data/categories.json`).
- [ ] Servicios listados (personalización, cotización por volumen, entrega en Ecuador, etc.).
- [ ] Sección de Preguntas y Respuestas poblada proactivamente con preguntas reales de clientes.
- [ ] Publicaciones (Posts) periódicas — frecuencia sugerida: quincenal.
- [ ] Seguimiento mensual de insights (vistas, clics, llamadas, solicitudes de dirección).
- [ ] UTM en el enlace del sitio web del perfil, para poder distinguir tráfico de GBP en GA4.

### URL propuesta para el campo "sitio web" del perfil

```
https://www.kronosolopromocionales.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile
```

## B. Reseñas

### Procedimiento (interno, sin enviar nada en esta sesión)

1. Confirmar entrega del pedido (logística confirma recepción).
2. Verificar satisfacción del cliente (llamada o mensaje corto de seguimiento).
3. Pedir una opinión honesta — no condicionada a que sea positiva.
4. Enviar el enlace directo de reseña de Google (se genera desde el propio perfil de GBP).
5. Registrar la solicitud (fecha, cliente, canal) en una hoja de seguimiento interna.
6. Responder toda reseña, positiva o negativa, dentro de 48-72 horas.
7. **Nunca** condicionar descuentos o beneficios a dejar una reseña.
8. **Nunca** pedir específicamente "5 estrellas" — pedir una opinión honesta.
9. **Nunca** fabricar, comprar o incentivar reseñas falsas — riesgo de penalización y de dañar
   la confianza real de clientes.

### Plantillas breves (para adaptar y enviar manualmente cuando el equipo decida — no enviadas)

**WhatsApp (solicitud):**
> Hola [nombre], esperamos que tu pedido de [producto] haya llegado en perfectas condiciones.
> Si tienes 2 minutos, nos ayudaría mucho que compartas tu experiencia en Google: [enlace].
> ¡Gracias por confiar en KS Promocionales!

**Email (solicitud):**
> Asunto: ¿Cómo fue tu experiencia con KS Promocionales?
>
> Hola [nombre], gracias por tu pedido reciente. Tu opinión nos ayuda a mejorar y a que más
> empresas nos conozcan. Si tienes un momento, te agradeceríamos una reseña honesta en Google:
> [enlace]. Cualquier comentario, bueno o de mejora, es bienvenido.

**Seguimiento respetuoso (si no responde a la primera solicitud):**
> Hola [nombre], sabemos que el tiempo apremia — si en algún momento quieres compartir tu
> experiencia con nosotros en Google, aquí está el enlace: [enlace]. ¡Sin ninguna presión!

**Respuesta a reseña positiva:**
> ¡Gracias, [nombre]! Nos alegra mucho saber que [detalle específico mencionado en la reseña, si
> lo hay]. Esperamos poder ayudarte de nuevo pronto.

**Respuesta a reseña negativa:**
> Hola [nombre], lamentamos que tu experiencia no haya sido la esperada. Nos gustaría entender
> mejor qué pasó y resolverlo — ¿podrías escribirnos a [contacto] o por WhatsApp? Queremos
> mejorar y compensar cualquier inconveniente.

## C. Casos reales

Ver plantilla completa en `docs/templates/seo-case-study-template.md`. Objetivo sugerido: **un
caso real cada 3–4 semanas**, con autorización explícita del cliente antes de publicar cualquier
dato. No se inventó ningún cliente ni resultado — la plantilla queda vacía, lista para llenarse
con datos reales.

## D. Enlaces editoriales

Ver plan completo en `docs/editorial-link-outreach-plan.md`. Ningún contacto fue realizado en
esta sesión.

## E. Calendario inicial de vídeo

| # | Tema | Intención | URL de destino sugerida |
| --- | --- | --- | --- |
| 1 | Diferencias entre serigrafía, láser y tampografía | Informacional — ayuda a decidir técnica de personalización | `/blog/` (nuevo artículo) + enlace a categorías relevantes |
| 2 | Cómo preparar un logo para producción | Informacional — reduce fricción en el brief de pedido | `/contacto/` + checklist de cotización existente |
| 3 | Comparación de mugs y termos | Transaccional-informacional | `/categorias/mugs-y-termos-personalizados/` |
| 4 | Armado de un kit de bienvenida (welcome kit) | Transaccional-informacional | `/regalos-corporativos/` |

Para cada vídeo, antes de grabar y publicar:

### 1. Diferencias entre serigrafía, láser y tampografía
- **Guion:** explicar cada técnica sobre un producto real ya en catálogo (ej. bolígrafo
  metálico para láser, textil para serigrafía, producto curvo para tampografía) — usar
  contenido ya redactado en `data/blog/content/index.js` (sección de técnicas de
  personalización) como base del guion, sin inventar datos nuevos.
- **Tomas necesarias:** primer plano de cada técnica aplicándose (si es posible filmar en el
  taller/proveedor real), producto terminado de cada técnica.
- **Producto:** un ejemplo real por técnica (confirmar disponibilidad con inventario real).
- **Evidencia:** el vídeo mismo es la evidencia — no requiere estadística externa.
- **CTA:** "Cotiza tu personalización por WhatsApp".
- **Fragmento reutilizable:** clip de 15-30s por técnica para redes.
- **Resumen textual para la web:** publicar como complemento del artículo de técnicas existente.
- **Datos estructurados (VideoObject):** solo añadir al publicar el vídeo real, con su URL/thumbnail reales — no antes.

### 2. Cómo preparar un logo para producción
- **Guion:** requisitos reales de archivo (vectorial vs. raster, colores, tamaño mínimo) — usar
  las especificaciones técnicas ya documentadas en el contenido de blog existente.
- **Tomas necesarias:** pantalla grabada mostrando ejemplos de logo bien/mal preparado.
- **Producto:** no aplica (contenido de proceso, no de producto).
- **Evidencia:** ejemplos reales de archivos (con autorización si son de clientes).
- **CTA:** enlace a `/contacto/` para enviar el logo y recibir asesoría.
- **Fragmento reutilizable:** el error más común, en 15s.
- **Resumen textual:** checklist descargable o en la propia página de contacto.
- **Datos estructurados:** igual que el vídeo 1, solo tras publicar.

### 3. Comparación de mugs y termos
- **Guion:** materiales, capacidades y usos reales (mismo contenido factual ya usado en
  `data/categories.json`, entry `mugs-y-termos-personalizados`, para no inventar datos nuevos).
- **Tomas necesarias:** productos físicos reales de la categoría, uno de cada material.
- **Producto:** mugs de cerámica y termos de acero disponibles en catálogo.
- **Evidencia:** el producto físico en cámara.
- **CTA:** "Cotiza tu mug o termo personalizado".
- **Fragmento reutilizable:** comparación rápida de 20s.
- **Resumen textual:** complementa el editorial ya ampliado de la categoría (ver sesión seo-4).
- **Datos estructurados:** tras publicar.

### 4. Armado de un kit de bienvenida
- **Guion:** proceso de selección y armado de un welcome kit real (usar casos reales de la
  sección C cuando existan, con autorización).
- **Tomas necesarias:** unboxing del kit armado.
- **Producto:** combinación real de productos del catálogo (no inventar productos).
- **Evidencia:** el kit físico armado.
- **CTA:** "Diseña el welcome kit de tu empresa".
- **Fragmento reutilizable:** el momento del unboxing.
- **Resumen textual:** para `/regalos-corporativos/` o un artículo de blog nuevo.
- **Datos estructurados:** tras publicar.
