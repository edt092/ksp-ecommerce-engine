'use client';

import { useEffect, useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Esperar a que el DOM se renderice completamente
    const setupHeadings = () => {
      const blogContent = document.getElementById('blog-content');
      if (!blogContent) return;

      // Buscar todos los h2 y h3 dentro del contenido del blog
      const headingElements = blogContent.querySelectorAll('h2, h3');
      const headingData = [];

      headingElements.forEach((heading, index) => {
        const text = heading.textContent?.trim() || '';
        if (!text) return;

        const level = heading.tagName.toLowerCase();
        // Crear un ID único basado en el texto del encabezado
        const id = `heading-${index}-${text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}`;

        headingData.push({
          id,
          text,
          level,
        });

        // Asignar el ID al encabezado
        heading.id = id;
        // Agregar scroll-margin para compensar el header fijo
        heading.style.scrollMarginTop = '100px';
      });

      setHeadings(headingData);

      // Configurar observador de intersección para resaltar el encabezado activo
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-100px 0px -66% 0px',
          threshold: 0.5,
        }
      );

      // Observar todos los encabezados
      headingElements.forEach((heading) => {
        observer.observe(heading);
      });

      return observer;
    };

    // Ejecutar después de que el contenido se haya renderizado
    const timer = setTimeout(() => {
      const observer = setupHeadings();
      return () => {
        if (observer) observer.disconnect();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-150 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900 m-0">Tabla de Contenido</h2>
        </div>
        <button
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={isOpen ? 'Cerrar tabla de contenido' : 'Abrir tabla de contenido'}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <nav className="p-4">
          <ol className="space-y-1 list-none m-0 p-0">
            {headings.map((heading, index) => {
              // Contar solo los h2 para la numeración
              const h2Count = headings.slice(0, index).filter(h => h.level === 'h2').length + (heading.level === 'h2' ? 1 : 0);

              return (
                <li
                  key={heading.id}
                  className={`${heading.level === 'h3' ? 'ml-6' : ''}`}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-all duration-200 flex items-start gap-2 ${
                      activeId === heading.id
                        ? 'bg-primary text-white font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    } ${heading.level === 'h2' ? 'font-medium' : 'text-sm'}`}
                  >
                    <span className={`${activeId === heading.id ? 'opacity-90' : 'opacity-60'} flex-shrink-0 ${heading.level === 'h2' ? 'font-semibold' : ''}`}>
                      {heading.level === 'h2' ? `${h2Count}.` : '–'}
                    </span>
                    <span className="flex-1">{heading.text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}
