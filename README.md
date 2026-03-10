# KS Promocionales - E-commerce Engine

Este proyecto es una plataforma de comercio electrónico de alto rendimiento diseñada específicamente para el sector de productos publicitarios. El enfoque principal del desarrollo fue eliminar la fricción entre la navegación y la venta final, integrando herramientas visuales que empoderan al usuario.

## Filosofía del Proyecto

Más allá de ser una tienda virtual, esta plataforma funciona como una herramienta de conversión. Se implementó una arquitectura **Headless** donde la lógica de negocio y los datos de aproximadamente **1000 productos** están desacoplados de la interfaz.

### Aspectos destacados del desarrollo:

* **Editor de Mockups en Tiempo Real**: Se integró un estudio visual con **React-Konva** que permite a los clientes proyectar su marca sobre los productos.
* **SEO de Alto Volumen**: Gracias a la generación estática (**SSG**) de Next.js, se logró que más de 1000 páginas se indexen con tiempos de respuesta óptimos.
* **Foco en Conversión (CRO)**: Cada punto de contacto está vinculado con WhatsApp Business para facilitar la gestión comercial.

## Stack Tecnológico

| Tecnología | Propósito Estratégico |
| :--- | :--- |
| **Next.js 14** | Uso de SSG para garantizar rendimiento en Core Web Vitals. |
| **React-Konva** | Creación de una experiencia interactiva para personalización de logotipos. |
| **Tailwind CSS** | Sistema de diseño atómico para garantizar consistencia visual. |

## Instalación

Para replicar el entorno de desarrollo, el cual está optimizado para sistemas **Linux (Parrot OS/Debian)**, sigue estos pasos:

```bash
# Instalar dependencias
npm install

# Iniciar el motor en desarrollo
npm run dev
