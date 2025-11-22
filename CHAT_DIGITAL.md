# 💬 Chat de Asesor Digital - Documentación

## Descripción

Componente de chat flotante tipo Cliengo/Messenger que actúa como asesor comercial digital automático para la tienda.

## ✨ Características

### Funcionalidades Principales
- ✅ Chat flotante en esquina inferior derecha
- ✅ Apertura automática después de 3 segundos
- ✅ Mensaje inicial de bienvenida
- ✅ Sonido de notificación en cada mensaje del asesor
- ✅ Mensaje de follow-up automático después de 60 segundos sin interacción
- ✅ Respuestas automáticas inteligentes basadas en keywords
- ✅ Animaciones suaves con Framer Motion
- ✅ Badge de notificación cuando hay mensajes nuevos
- ✅ Indicador de "en línea"
- ✅ Scroll automático al último mensaje
- ✅ Diseño responsive

### Diseño
- Burbujas de chat estilo moderno
- Avatar del asesor
- Gradientes con colores de marca (primary)
- Animaciones de entrada/salida
- Efecto de pulso en el botón flotante
- Timestamps en cada mensaje

### Inteligencia Conversacional
El chat responde automáticamente a keywords:
- **Precio/Costo**: Ofrece cotización por WhatsApp
- **Catálogo/Productos**: Presenta el catálogo completo
- **Email/@**: Confirma recepción y promete envío
- **Hola/Buenos días**: Saludo amigable
- **Gracias**: Despedida con CTA a WhatsApp
- **Envío/Entrega**: Información de entregas en Ecuador
- **Otro**: Respuesta genérica ofreciendo ayuda

## 📦 Instalación y Uso

### 1. Instalar Dependencia (Ya instalada)
```bash
npm install framer-motion
```

### 2. Agregar al Layout Principal

Edita `src/app/layout.jsx`:

```jsx
import DigitalAdvisorChat from '@/components/DigitalAdvisorChat';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}

        {/* Chat flotante */}
        <DigitalAdvisorChat />
      </body>
    </html>
  );
}
```

### 3. Crear Imagen del Asesor

Coloca una imagen en: `/public/images/hanna.png`

**Especificaciones recomendadas:**
- Tamaño: 400x400px (cuadrado)
- Formato: PNG con fondo transparente o JPG
- Peso: < 100KB optimizado
- Una foto profesional y amigable de Hanna

**Alternativa sin imagen:**
Si no tienes imagen, el componente mostrará automáticamente un avatar con la inicial "H" en un gradiente rosa-púrpura.

## 🎨 Personalización

### Cambiar Información del Asesor

Edita en `DigitalAdvisorChat.jsx` (líneas 18-23):

```javascript
const advisor = {
  name: 'Hanna',                    // Nombre del asesor
  role: 'Asesora Comercial',       // Cargo
  avatar: '/images/hanna.png',     // Ruta de la imagen
  initialMessage: '¡Hola! 😊 Soy Hanna, ¿en qué puedo ayudarte hoy?',
  followUpMessage: '¿Deseas conocer nuestro catálogo más reciente de productos personalizados? 🚀 Puedo enviártelo por correo, solo dime tu email y te lo envío enseguida.',
};
```

### Cambiar Tiempos de Apertura

**Apertura automática** (línea 85):
```javascript
setTimeout(() => {
  setIsOpen(true);
  addAdvisorMessage(advisor.initialMessage);
}, 3000); // 3 segundos (cambiar a gusto)
```

**Mensaje de follow-up** (línea 96):
```javascript
timeoutRef.current = setTimeout(() => {
  addAdvisorMessage(advisor.followUpMessage);
}, 60000); // 60 segundos (cambiar a gusto)
```

### Personalizar Respuestas Automáticas

Edita la función `handleAutoResponse` (líneas 52-74):

```javascript
const handleAutoResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  let response = '';

  // Agrega tus propias keywords y respuestas
  if (message.includes('tu_keyword')) {
    response = 'Tu respuesta personalizada aquí';
  }
  // ... más condiciones

  addAdvisorMessage(response);
};
```

### Cambiar Posición del Chat

Por defecto está en **esquina inferior derecha**. Para cambiar:

**Esquina inferior izquierda:**
```jsx
// Línea 117 y 136
className="fixed bottom-6 left-6 z-50"  // Cambiar right-6 por left-6
```

**Arriba a la derecha:**
```jsx
// Línea 117
className="fixed top-6 right-6 z-50"
// Línea 136
className="fixed top-24 right-6 z-40 w-full max-w-md"
```

### Cambiar Colores

El chat usa las clases de Tailwind con los colores de marca definidos (`primary`, `primary-dark`).

Para cambiar, edita los gradientes en el componente:
```jsx
// Buscar: from-primary to-primary-dark
// Reemplazar por tus colores, ejemplo:
from-blue-600 to-purple-600
```

## 🔊 Sonido de Notificación

El componente usa un archivo de audio embebido en base64 (línea 119-127).

**Para usar un archivo MP3 personalizado:**

1. Coloca tu archivo en `/public/sounds/notification.mp3`
2. Reemplaza el audio element:

```jsx
<audio ref={audioRef} preload="auto">
  <source src="/sounds/notification.mp3" type="audio/mpeg" />
</audio>
```

**Recomendaciones de audio:**
- Duración: 0.5 - 2 segundos
- Formato: MP3 o WAV
- Peso: < 50KB
- Volumen: Moderado, no estridente

## 🎯 Keywords y Respuestas

Actualmente el chat detecta:

| Keyword | Respuesta |
|---------|-----------|
| precio, costo, cuanto | Ofrece cotización por WhatsApp |
| catalogo, productos | Presenta catálogo completo |
| @ (email) | Confirma recepción del email |
| hola, buenos, buenas | Saludo de bienvenida |
| gracias, thank | Despedida con CTA |
| envio, entrega, delivery | Info sobre entregas en Ecuador |
| Otros | Ofrece ayuda general |

## 📱 Responsive

El chat es completamente responsive:
- **Desktop**: Ventana de 400px de ancho
- **Tablet**: Ventana ajustada al contenedor
- **Mobile**: Ocupa 90% del ancho de pantalla

## 🎭 Animaciones

Todas las animaciones usan Framer Motion:
- Entrada del botón flotante: Spring animation
- Apertura/cierre del chat: Scale + slide
- Mensajes nuevos: Fade + slide up
- Badge de notificación: Scale in/out
- Pulso del botón: CSS animation continuo

## 🔧 Funciones Principales

### `addAdvisorMessage(text)`
Agrega un mensaje del asesor y reproduce sonido.

### `addUserMessage(text)`
Agrega un mensaje del usuario y cancela el timeout del follow-up.

### `handleAutoResponse(userMessage)`
Analiza el mensaje del usuario y genera respuesta automática.

### `playNotificationSound()`
Reproduce el sonido de notificación.

## 📊 Estado del Componente

```javascript
isOpen          // Boolean - Chat abierto/cerrado
messages        // Array - Historial de mensajes
inputValue      // String - Texto del input
hasInteracted   // Boolean - Usuario ha enviado mensaje
showBadge       // Boolean - Mostrar badge de notificación
```

## 🚀 Mejoras Futuras (Opcionales)

### Integración con Backend
Para guardar conversaciones en base de datos:
```javascript
const addUserMessage = async (text) => {
  // ... código existente

  // Enviar a API
  await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: text, userId: 'xxx' }),
  });
};
```

### Integración con WhatsApp Business API
```javascript
const sendToWhatsApp = async (message) => {
  const phoneNumber = '593999999999';
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};
```

### Guardar en LocalStorage
```javascript
useEffect(() => {
  // Guardar mensajes
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}, [messages]);

// Cargar al inicio
useEffect(() => {
  const saved = localStorage.getItem('chatMessages');
  if (saved) setMessages(JSON.parse(saved));
}, []);
```

### Typing Indicator
```javascript
const [isTyping, setIsTyping] = useState(false);

// Mostrar "Escribiendo..." antes de respuesta automática
const handleAutoResponse = (userMessage) => {
  setIsTyping(true);
  setTimeout(() => {
    setIsTyping(false);
    // ... respuesta
  }, 1500);
};
```

## ⚠️ Consideraciones

### Rendimiento
- El componente es ligero (< 10KB)
- Las animaciones usan GPU acceleration
- El audio es base64 (no requiere carga adicional)

### Accesibilidad
- Botones con aria-label
- Keyboard navigation funcional
- Colores con contraste suficiente

### SEO
- El chat no afecta el SEO (renderizado en cliente)
- No bloquea contenido importante
- Z-index alto para estar siempre visible

### Privacidad
- Los mensajes solo se guardan en estado local (React)
- No se envía información a servidores externos
- Se pierde al recargar la página (a menos que implementes localStorage)

## 🐛 Troubleshooting

### El chat no se abre automáticamente
- Verifica que el componente esté importado en layout.jsx
- Revisa la consola por errores de JavaScript

### No suena el audio
- Los navegadores bloquean audio sin interacción del usuario
- El sonido solo funciona después del primer clic en la página
- Solución: Está configurado para fallar silenciosamente

### La imagen del asesor no carga
- Verifica que `/public/images/asesor.png` exista
- Si no existe, se mostrará un avatar con inicial
- Revisa la ruta en el objeto `advisor`

### Las animaciones se ven entrecortadas
- Verifica que framer-motion esté instalado
- Revisa que no haya conflictos de CSS
- Reduce la cantidad de mensajes en pantalla

### El mensaje de follow-up no se envía
- Se cancela si el usuario interactúa antes de 60 segundos
- Verifica que `hasInteracted` no esté en `true`
- Revisa los timeouts en la consola

## 📝 Ejemplo de Uso Completo

```jsx
// src/app/layout.jsx
import DigitalAdvisorChat from '@/components/DigitalAdvisorChat';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />

        {/* Chat flotante - Se muestra en todas las páginas */}
        <DigitalAdvisorChat />
      </body>
    </html>
  );
}
```

## ✅ Checklist de Implementación

- [ ] Instalar framer-motion
- [ ] Crear imagen del asesor en `/public/images/asesor.png`
- [ ] Importar componente en layout.jsx
- [ ] Personalizar información del asesor (nombre, cargo)
- [ ] Ajustar mensajes (inicial y follow-up)
- [ ] Personalizar keywords y respuestas automáticas
- [ ] Probar en móvil y desktop
- [ ] Verificar que el audio funcione (después de interacción)
- [ ] Ajustar tiempos de apertura si es necesario

---

## 🎉 Resultado Final

Un chat flotante completamente funcional que:
- ✅ Se abre automáticamente y da la bienvenida
- ✅ Responde inteligentemente a preguntas comunes
- ✅ Mantiene conversaciones fluidas
- ✅ Usa copywriting persuasivo
- ✅ Tiene diseño moderno y profesional
- ✅ Funciona en todos los dispositivos

**El chat está listo para usar y empezar a convertir visitantes en clientes.** 🚀

---

## 🎨 Especificaciones CSS y Responsive Design

Esta sección documenta todas las propiedades CSS del chat para facilitar su recreación en otros diseños.

### 📐 Breakpoints (Tailwind CSS)

El componente usa breakpoints de Tailwind CSS:
- **Mobile**: `< 768px` (sin prefijo)
- **Tablet/Desktop**: `≥ 768px` (prefijo `md:`)
- **Referencia**: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px`

### 🔘 Botón Flotante

#### Posicionamiento
```css
/* Mobile */
position: fixed;
bottom: 12px;          /* bottom-3 */
right: 12px;           /* right-3 */
z-index: 60;           /* z-[60] */

/* Desktop (md:) */
bottom: 32px;          /* md:bottom-8 */
right: 32px;           /* md:right-8 */
```

#### Tamaño del Botón
```css
/* Mobile */
padding: 12px;         /* p-3 */
border-radius: 9999px; /* rounded-full */
width: auto;           /* ajustado al padding + icon */
height: auto;

/* Desktop (md:) */
padding: 20px;         /* md:p-5 */
```

#### Icono dentro del botón
```css
/* Mobile */
width: 24px;           /* w-6 */
height: 24px;          /* h-6 */

/* Desktop (md:) */
width: 32px;           /* md:w-8 */
height: 32px;          /* md:h-8 */
```

#### Badge de Notificación
```css
/* Mobile */
width: 20px;           /* w-5 */
height: 20px;          /* h-5 */
top: -4px;             /* -top-1 */
right: -4px;           /* -right-1 */
font-size: 12px;       /* text-xs */

/* Desktop (md:) */
width: 24px;           /* md:w-6 */
height: 24px;          /* md:h-6 */
```

#### Efectos Visuales
```css
/* Gradiente */
background: linear-gradient(to right, var(--primary), var(--primary-dark));

/* Sombras */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */

/* Hover */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* hover:shadow-3xl */
transform: scale(1.1); /* hover:scale-110 */

/* Active */
transform: scale(0.95); /* active:scale-95 */

/* Animación de pulso */
animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
opacity: 0.75;
```

### 💬 Ventana de Chat

#### Posicionamiento
```css
/* Mobile */
position: fixed;
bottom: 64px;          /* bottom-16 (4rem = 64px) */
right: 12px;           /* right-3 */
z-index: 55;           /* z-[55] */
width: 90vw;           /* w-[90vw] */

/* Tablet (sm:) */
width: 85vw;           /* sm:w-[85vw] */

/* Desktop (md:) */
bottom: 128px;         /* md:bottom-32 (8rem = 128px) */
right: 32px;           /* md:right-8 */
width: 100%;           /* md:w-full */
max-width: 448px;      /* max-w-md (28rem = 448px) */
```

#### Dimensiones
```css
/* Altura máxima adaptativa */
max-height: calc(100vh - 80px);
height: auto;

/* Contenedor principal */
border-radius: 16px;   /* rounded-2xl */
overflow: hidden;
border: 1px solid #e5e7eb; /* border-gray-200 */
```

### 👤 Header del Chat

#### Estructura
```css
/* Mobile */
padding: 12px;         /* p-3 */
gap: 8px;              /* gap-2 */

/* Desktop (md:) */
padding: 16px;         /* md:p-4 */
gap: 12px;             /* md:gap-3 */

/* Gradiente de fondo */
background: linear-gradient(to right, var(--primary), var(--primary-dark));
```

#### Avatar Principal
```css
/* Mobile */
width: 40px;           /* w-10 */
height: 40px;          /* h-10 */
border-radius: 9999px; /* rounded-full */
border: 2px solid white;

/* Desktop (md:) */
width: 48px;           /* md:w-12 */
height: 48px;          /* md:h-12 */
```

#### Indicador "En Línea"
```css
/* Posición absoluta en el avatar */
position: absolute;
bottom: 0;
right: 0;
width: 14px;           /* w-3.5 */
height: 14px;          /* h-3.5 */
background-color: #4ade80; /* bg-green-400 */
border: 2px solid white;
border-radius: 9999px;

/* Punto pulsante en el texto */
width: 8px;            /* w-2 */
height: 8px;           /* h-2 */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

#### Texto del Header
```css
/* Nombre */
/* Mobile */
font-weight: 700;      /* font-bold */
font-size: 16px;       /* text-base */

/* Desktop (md:) */
font-size: 18px;       /* md:text-lg */

/* Rol/Estado */
/* Mobile */
font-size: 12px;       /* text-xs */

/* Desktop (md:) */
font-size: 14px;       /* md:text-sm */
opacity: 0.9;          /* text-white/90 */
```

### 💭 Área de Mensajes

#### Contenedor
```css
/* Dimensiones */
min-height: 200px;
max-height: 60vh;
overflow-y: auto;

/* Mobile */
padding: 12px;         /* p-3 */
gap: 12px;             /* space-y-3 */

/* Desktop (md:) */
padding: 16px;         /* md:p-4 */
gap: 16px;             /* md:space-y-4 */

/* Fondo */
background-color: #f9fafb; /* bg-gray-50 */
```

#### Avatar en Mensajes
```css
/* Mobile */
width: 24px;           /* w-6 */
height: 24px;          /* h-6 */
border-radius: 9999px;
border: 2px solid #e5e7eb; /* border-gray-200 */

/* Desktop (md:) */
width: 32px;           /* md:w-8 */
height: 32px;          /* md:h-8 */
```

#### Burbujas de Mensaje

**Dimensiones:**
```css
/* Mobile */
max-width: 85%;        /* max-w-[85%] */
padding: 8px 12px;     /* px-3 py-2 */

/* Desktop (md:) */
max-width: 75%;        /* md:max-w-[75%] */
padding: 12px 16px;    /* md:px-4 md:py-3 */

/* Border radius */
border-radius: 16px;   /* rounded-2xl */
```

**Mensaje del Usuario:**
```css
/* Gradiente */
background: linear-gradient(to right, var(--primary), var(--primary-dark));
color: white;

/* Quitar esquina superior derecha */
border-top-right-radius: 0; /* rounded-tr-none */

/* Sombra */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
```

**Mensaje del Asesor:**
```css
background-color: white;
color: #1f2937;        /* text-gray-800 */
border: 1px solid #e5e7eb; /* border-gray-200 */

/* Quitar esquina superior izquierda */
border-top-left-radius: 0; /* rounded-tl-none */

/* Sombra */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
```

#### Texto del Mensaje
```css
/* Mobile */
font-size: 12px;       /* text-xs */
line-height: 1.625;    /* leading-relaxed */

/* Desktop (md:) */
font-size: 14px;       /* md:text-sm */

/* Timestamp */
/* Mobile */
font-size: 10px;       /* text-[10px] */
margin-top: 4px;       /* mt-1 */

/* Desktop (md:) */
font-size: 12px;       /* md:text-xs */
```

### 🟢 Botón de WhatsApp

```css
/* Contenedor */
/* Mobile */
max-width: 85%;        /* max-w-[85%] */

/* Desktop (md:) */
max-width: 75%;        /* md:max-w-[75%] */

/* Botón */
background-color: #22c55e; /* bg-green-500 */
color: white;
border-radius: 16px;   /* rounded-2xl */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */

/* Mobile */
padding: 12px 16px;    /* px-4 py-3 */

/* Desktop (md:) */
padding: 16px 24px;    /* md:px-6 md:py-4 */

/* Hover */
background-color: #16a34a; /* hover:bg-green-600 */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); /* hover:shadow-xl */
transform: scale(1.05); /* hover:scale-105 */

/* Icono */
/* Mobile */
width: 20px;           /* w-5 */
height: 20px;          /* h-5 */

/* Desktop (md:) */
width: 24px;           /* md:w-6 */
height: 24px;          /* md:h-6 */

/* Texto */
font-weight: 700;      /* font-bold */
font-size: 14px;       /* text-sm */

/* Subtexto */
font-size: 12px;       /* text-xs */
color: rgba(255, 255, 255, 0.9); /* text-white/90 */

/* Gap entre elementos */
/* Mobile */
gap: 8px;              /* gap-2 */

/* Desktop (md:) */
gap: 12px;             /* md:gap-3 */
```

### ⌨️ Input de Mensaje

#### Contenedor del Form
```css
/* Mobile */
padding: 8px;          /* p-2 */
gap: 6px;              /* gap-1.5 */

/* Desktop (md:) */
padding: 16px;         /* md:p-4 */
gap: 8px;              /* md:gap-2 */

/* Borde superior */
border-top: 1px solid #e5e7eb; /* border-gray-200 */
background-color: white;
```

#### Campo de Texto
```css
/* Mobile */
padding: 8px 12px;     /* px-3 py-2 */
font-size: 12px;       /* text-xs */

/* Desktop (md:) */
padding: 12px 16px;    /* md:px-4 md:py-3 */
font-size: 14px;       /* md:text-sm */

/* Estilo */
background-color: #f3f4f6; /* bg-gray-100 */
border: 1px solid #e5e7eb; /* border-gray-200 */
border-radius: 9999px; /* rounded-full */
color: #111827;        /* text-gray-900 */

/* Focus */
outline: none;
box-shadow: 0 0 0 2px var(--primary); /* focus:ring-2 focus:ring-primary */
background-color: white; /* focus:bg-white */
```

#### Botón Enviar
```css
/* Mobile */
padding: 8px;          /* p-2 */

/* Desktop (md:) */
padding: 12px;         /* md:p-3 */

/* Estilo */
background: linear-gradient(to right, var(--primary), var(--primary-dark));
color: white;
border-radius: 9999px;

/* Hover */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* hover:shadow-lg */
transform: scale(1.05); /* hover:scale-105 */

/* Disabled */
opacity: 0.5;          /* disabled:opacity-50 */
cursor: not-allowed;   /* disabled:cursor-not-allowed */

/* Icono */
/* Mobile */
width: 16px;           /* w-4 */
height: 16px;          /* h-4 */

/* Desktop (md:) */
width: 20px;           /* md:w-5 */
height: 20px;          /* md:h-5 */
```

#### Mensaje de Información
```css
/* Solo visible en desktop */
display: none;         /* hidden */

/* Desktop (md:) */
display: block;        /* md:block */
font-size: 12px;       /* text-xs */
color: #6b7280;        /* text-gray-500 */
text-align: center;
margin-top: 12px;      /* mt-3 */
```

### 🎬 Animaciones (Framer Motion)

#### Botón Flotante - Inicial
```javascript
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{
  delay: 0.5,
  type: 'spring',
  stiffness: 260,
  damping: 20
}}
```

#### Ventana de Chat
```javascript
initial={{ opacity: 0, y: 100, scale: 0.8 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 100, scale: 0.8 }}
transition={{
  type: 'spring',
  stiffness: 260,
  damping: 20
}}
```

#### Iconos del Botón (Abrir/Cerrar)
```javascript
/* Cerrar (X) */
initial={{ rotate: -90, opacity: 0 }}
animate={{ rotate: 0, opacity: 1 }}
exit={{ rotate: 90, opacity: 0 }}
transition={{ duration: 0.2 }}

/* Chat (Burbuja) */
initial={{ rotate: 90, opacity: 0 }}
animate={{ rotate: 0, opacity: 1 }}
exit={{ rotate: -90, opacity: 0 }}
transition={{ duration: 0.2 }}
```

#### Badge de Notificación
```javascript
initial={{ scale: 0 }}
animate={{ scale: 1 }}
exit={{ scale: 0 }}
```

#### Mensajes
```javascript
initial={{ opacity: 0, y: 10, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{
  duration: 0.3,
  delay: index * 0.1  // Delay escalonado
}}
```

#### Animación de Pulso CSS (Botón)
```css
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Aplicado con */
animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
```

#### Animación Pulse CSS (Indicador en línea)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Aplicado con */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### 🎨 Colores y Variables

```css
/* Variables personalizadas (definidas en tailwind.config.js) */
--primary: /* Tu color primario */
--primary-dark: /* Tu color primario oscuro */
--secondary: /* Tu color secundario */

/* Colores fijos del componente */
--white: #ffffff
--green-400: #4ade80      /* Indicador en línea */
--green-500: #22c55e      /* Botón WhatsApp */
--green-600: #16a34a      /* Hover WhatsApp */
--red-500: #ef4444        /* Badge notificación */
--gray-50: #f9fafb        /* Fondo mensajes */
--gray-100: #f3f4f6       /* Input background */
--gray-200: #e5e7eb       /* Bordes */
--gray-500: #6b7280       /* Texto secundario */
--gray-800: #1f2937       /* Texto mensajes asesor */
--gray-900: #111827       /* Texto input */

/* Opacidades */
--white-90: rgba(255, 255, 255, 0.9)
--white-75: rgba(255, 255, 255, 0.75)
--white-70: rgba(255, 255, 255, 0.7)
--white-20: rgba(255, 255, 255, 0.2)
```

### 📊 Z-Index Hierarchy

```css
z-[60]: Botón flotante (siempre visible)
z-[55]: Ventana de chat (debajo del botón)
z-50: Elementos generales de página
```

### 🔍 Sombras (Tailwind)

```css
/* shadow-sm */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* shadow-lg */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* shadow-xl */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* shadow-2xl */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### 📱 Tabla Resumen de Tamaños

| Elemento | Mobile | Desktop (md:) |
|----------|--------|---------------|
| **Botón Flotante** |
| Posición (bottom) | 12px | 32px |
| Posición (right) | 12px | 32px |
| Padding | 12px | 20px |
| Icono | 24×24px | 32×32px |
| Badge | 20×20px | 24×24px |
| **Ventana Chat** |
| Width | 90vw | 100% (max 448px) |
| Bottom | 64px | 128px |
| Right | 12px | 32px |
| **Header** |
| Padding | 12px | 16px |
| Gap | 8px | 12px |
| Avatar | 40×40px | 48×48px |
| Font nombre | 16px | 18px |
| Font rol | 12px | 14px |
| **Mensajes** |
| Padding contenedor | 12px | 16px |
| Gap entre mensajes | 12px | 16px |
| Avatar mensaje | 24×24px | 32×32px |
| Max-width burbuja | 85% | 75% |
| Padding burbuja | 8px 12px | 12px 16px |
| Font mensaje | 12px | 14px |
| Font timestamp | 10px | 12px |
| **Input** |
| Padding contenedor | 8px | 16px |
| Gap form | 6px | 8px |
| Padding input | 8px 12px | 12px 16px |
| Font input | 12px | 14px |
| Padding botón | 8px | 12px |
| Icono enviar | 16×16px | 20×20px |

### 🎯 Media Queries Equivalentes

Si no usas Tailwind, aquí están las media queries equivalentes:

```css
/* Mobile First (por defecto, sin media query) */
/* Estilos base para mobile */

/* Tablet y superior */
@media (min-width: 768px) {
  /* Estilos con prefijo md: */
}

/* Desktop grande */
@media (min-width: 1024px) {
  /* Estilos con prefijo lg: */
}

/* Desktop extra grande */
@media (min-width: 1280px) {
  /* Estilos con prefijo xl: */
}
```

### 💡 Tips para Recrear el Diseño

1. **Mobile First**: Empieza con estilos mobile y agrega breakpoints para desktop
2. **Espaciado Consistente**: Usa múltiplos de 4px (8px, 12px, 16px, 20px, 24px, 32px)
3. **Transiciones**: Duración estándar de 200-300ms para interacciones
4. **Sombras**: Más sutiles en mobile, más pronunciadas en desktop
5. **Font Sizes**: 2px más grande en desktop para mejor legibilidad
6. **Max-width**: Limita el ancho en pantallas grandes (448px funciona bien)
7. **Z-index**: Mantén el botón siempre por encima del chat
8. **Border Radius**: 16px para burbujas, 9999px para elementos circulares
9. **Gradientes**: Usa colores de marca para coherencia visual
10. **Accesibilidad**: Mantén contraste mínimo de 4.5:1 para textos

---
