# Flujo de recolección de reseñas y testimonios (Fase 8)

Este documento define cómo el negocio debe recolectar, autorizar y publicar
testimonios reales de clientes de KS Promocionales. **Es un proceso humano,
no automatizado** — ningún script de este repositorio debe generar, editar
o aprobar testimonios por su cuenta.

Contexto: la afirmación "+1.000 empresas confían en KS" que aparecía en el
home fue auditada (2026-07-21) y no tiene evidencia interna ni pública que
la respalde, así que se retiró de `src/app/HomePageClient.tsx` sin
sustituirla por otra cifra. La infraestructura para mostrar testimonios
reales ya existe (`src/lib/testimonials.ts`, `src/components/
TestimonialsSection.tsx`) pero permanece inactiva porque `data/
testimonials.json` todavía no existe — no hay ningún testimonio real
recolectado. Este documento es el procedimiento para llenar ese vacío con
datos reales, no con contenido inventado.

## 1. Solicitud por WhatsApp

- El único canal de solicitud es WhatsApp, el mismo que usa el negocio para
  cotizar (no email marketing, no formularios de terceros).
- Se solicita después de completar una entrega, nunca antes ni durante la
  negociación de precio.
- Mensaje sugerido (editar con naturalidad, no copiar/pegar igual siempre):
  > "¡Gracias por confiar en KS Promocionales! Si te gustó el resultado,
  > ¿nos compartirías una breve reseña sobre tu experiencia? Nos ayuda
  > mucho y nos gustaría poder mostrarla en nuestra web con tu nombre (o
  > el de tu empresa) si nos das el visto bueno."
- No se solicita reseña a clientes con una queja o incidencia sin resolver.

## 2. Consentimiento

- El testimonio solo puede publicarse si el cliente dio consentimiento
  explícito y por escrito (el propio chat de WhatsApp sirve como registro)
  para:
  1. Usar el texto de su reseña (puede pedirse permiso para editar
     longitud/redacción, nunca el sentido).
  2. Usar su nombre y/o el de su empresa.
  3. Usar su cargo.
- Sin los tres, el campo `permission` en `data/testimonials.json` debe
  quedar en `false` y el testimonio no se muestra (`TestimonialsSection`
  ya filtra por esto automáticamente).
- Guardar la evidencia del consentimiento (captura del chat) en un lugar
  interno del negocio, no en este repositorio.

## 3. Uso de nombre y logo

- Nombre de la persona y de la empresa: solo con autorización explícita
  (punto 2).
- Logo de la empresa cliente: requiere autorización **adicional y
  específica** — el consentimiento para publicar el texto de la reseña no
  incluye automáticamente el uso del logo.
- Si el cliente prefiere anonimato parcial (p. ej. solo iniciales o solo
  el sector), respetar esa preferencia tal cual la pidió.

## 4. Moderación

- Antes de publicar, alguien del negocio (no un script) revisa que la
  reseña:
  - Sea coherente con un pedido real y verificable internamente.
  - No contenga datos sensibles de terceros (precios de otros clientes,
    información confidencial).
  - No haya sido editada de forma que cambie el sentido de lo que el
    cliente escribió.
- No se corrige ni se "mejora" el contenido de la reseña más allá de
  ortografía básica, y solo si el cliente lo autorizó.

## 5. Publicación

- Publicar agregando la entrada a `data/testimonials.json` siguiendo el
  shape de `Testimonial` en `src/lib/testimonials.ts` (`clientName`,
  `company`, `role`, `quote`, `rating`, `date`, `permission`,
  `relatedProducts`, `logo`, `source`).
- `rating` debe ser el valor real que dio el cliente, no inventado ni
  redondeado hacia arriba.
- `source` debe indicar el canal real (`"whatsapp"`, u otro si cambia en
  el futuro).
- No publicar en lote ni con fecha retroactiva distinta a cuando se
  recolectó realmente.

## 6. Retiro

- El cliente puede pedir en cualquier momento que su testimonio se retire
  o modifique — la solicitud se atiende quitando o editando la entrada en
  `data/testimonials.json` sin necesidad de justificar el pedido.
- Si una empresa cliente deja de operar con KS Promocionales y lo pide,
  también se retira aunque el consentimiento original siguiera vigente.

## 7. Respuesta a críticas

- Las reseñas negativas no se ocultan ni se excluyen selectivamente para
  mostrar solo lo positivo de forma engañosa.
- Se responde a la crítica por el mismo canal (WhatsApp u otro real, no
  en la web) buscando resolver el problema primero.
- Si el negocio decide publicar reseñas negativas también, se aplican las
  mismas reglas de consentimiento y verificación que a las positivas.

## 8. Prohibiciones explícitas

- **No incentivos condicionados**: no se ofrece descuento, regalo ni
  ninguna contraprestación a cambio de una reseña positiva o de una
  puntuación específica. Se puede agradecer después, nunca condicionar
  antes.
- **No comprar reseñas**: prohibido adquirir testimonios, reseñas o
  reputación de terceros, plataformas o servicios de "reseñas verificadas"
  falsas.
- **No testimonios ficticios**: ningún testimonio se crea, redacta desde
  cero o genera con IA en nombre de un cliente real o inventado.
