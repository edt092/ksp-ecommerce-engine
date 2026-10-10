'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { IndexProduct, SORT_KEYS, SortKey, searchCatalog } from '@/lib/catalog-search';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const PAGE_SIZE = 24;

interface IndexCategory { id: string; slug: string; name: string }

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get('orden') as SortKey;
  return {
    q: (params.get('q') || '').slice(0, 80),
    categoria: params.get('categoria') || '',
    orden: SORT_KEYS.includes(sort) ? sort : 'relevancia',
  };
}

function track(name: string, params: Record<string, string | number>) {
  if ((window as any).gtag) (window as any).gtag('event', name, params);
}

export default function SearchClient() {
  const [index, setIndex] = useState<{ products: IndexProduct[]; categories: IndexCategory[] } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [q, setQ] = useState('');
  const [input, setInput] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState<SortKey>('relevancia');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  const load = useCallback(() => {
    setStatus('loading');
    fetch('/search-index.json')
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((data) => { setIndex(data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  // Estado inicial desde la URL y sincronización con Atrás/Adelante.
  useEffect(() => {
    const apply = () => {
      const s = readUrl();
      setQ(s.q); setInput(s.q); setCategoria(s.categoria); setOrden(s.orden); setVisible(PAGE_SIZE);
    };
    apply();
    load();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, [load]);

  const pushUrl = useCallback((next: { q: string; categoria: string; orden: SortKey }, replace = false) => {
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.categoria) params.set('categoria', next.categoria);
    if (next.orden !== 'relevancia') params.set('orden', next.orden);
    const url = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }, []);

  const category = index?.categories.find((c) => c.slug === categoria) || null;
  const results = useMemo(
    () => (index ? searchCatalog(index.products, q, category?.id || null, orden) : []),
    [index, q, category, orden],
  );
  const categoriesById = useMemo(() => new Map((index?.categories || []).map((c) => [c.id, c])), [index]);

  // Evento sin el texto buscado (puede contener datos personales).
  useEffect(() => {
    if (status !== 'ready' || (!q && !categoria)) return;
    track('search_performed', { result_count: results.length, has_query: q ? 1 : 0, has_category: categoria ? 1 : 0 });
  }, [status, q, categoria, results.length]);

  function onInput(value: string) {
    setInput(value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const nextQ = value.trim().slice(0, 80);
      setQ(nextQ); setVisible(PAGE_SIZE);
      pushUrl({ q: nextQ, categoria, orden }, true);
    }, 300);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearTimeout(debounce.current);
    const nextQ = input.trim().slice(0, 80);
    setQ(nextQ); setVisible(PAGE_SIZE);
    pushUrl({ q: nextQ, categoria, orden });
    resultsHeading.current?.focus();
  }

  function onCategory(value: string) {
    setCategoria(value); setVisible(PAGE_SIZE);
    pushUrl({ q, categoria: value, orden });
  }

  function onSort(value: SortKey) {
    setOrden(value); setVisible(PAGE_SIZE);
    pushUrl({ q, categoria, orden: value });
    track('sort_changed', { sort: value, category: categoria || 'todas' });
  }

  function clearAll() {
    setQ(''); setInput(''); setCategoria(''); setOrden('relevancia'); setVisible(PAGE_SIZE);
    pushUrl({ q: '', categoria: '', orden: 'relevancia' });
  }

  const shown = results.slice(0, visible);

  return (
    <div className="space-y-8">
      <form role="search" onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] items-end">
        <div className="min-w-0">
          <label htmlFor="buscar-q" className="block text-sm font-semibold text-[#0A0A23] mb-1.5">
            Producto, material o referencia
          </label>
          <div className="flex gap-2">
            <input
              id="buscar-q"
              type="search"
              value={input}
              onChange={(e) => onInput(e.target.value)}
              placeholder="Ej.: esfero metálico, termo, 13537"
              autoComplete="off"
              enterKeyHint="search"
              maxLength={80}
              className="flex-1 min-w-0 min-h-[44px] px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-[#0F2178] focus:ring-2 focus:ring-[#0F2178]/20"
            />
            <button type="submit" className="min-h-[44px] px-5 rounded-lg bg-[#0F2178] text-white font-semibold hover:bg-[#091557] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2178]">
              Buscar
            </button>
          </div>
        </div>
        <div className="min-w-0">
          <label htmlFor="buscar-categoria" className="block text-sm font-semibold text-[#0A0A23] mb-1.5">Categoría</label>
          <select
            id="buscar-categoria"
            value={categoria}
            onChange={(e) => onCategory(e.target.value)}
            className="w-full min-w-0 md:w-56 min-h-[44px] px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#0F2178]"
          >
            <option value="">Todas las categorías</option>
            {(index?.categories || []).map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="buscar-orden" className="block text-sm font-semibold text-[#0A0A23] mb-1.5">Ordenar</label>
          <select
            id="buscar-orden"
            value={orden}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="w-full min-w-0 md:w-48 min-h-[44px] px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#0F2178]"
          >
            <option value="relevancia">Orden del catálogo</option>
            <option value="nombre_asc">Nombre A–Z</option>
            <option value="nombre_desc">Nombre Z–A</option>
          </select>
        </div>
      </form>

      <div>
        <h2 ref={resultsHeading} tabIndex={-1} className="sr-only">Resultados</h2>
        <p role="status" aria-live="polite" className="text-sm text-gray-600 min-h-[1.25rem]">
          {status === 'loading' && 'Cargando el catálogo…'}
          {status === 'ready' && `${results.length} producto${results.length === 1 ? '' : 's'}${category ? ` en ${category.name}` : ''}${q ? ` para «${q}»` : ''}`}
        </p>
      </div>

      {status === 'error' && (
        <div className="p-6 rounded-xl border border-red-200 bg-red-50">
          <p className="font-semibold text-[#0A0A23] mb-2">No pudimos cargar el catálogo.</p>
          <p className="text-sm text-gray-600 mb-4">Revisa tu conexión y vuelve a intentarlo, o navega por categorías.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={load} className="min-h-[44px] px-4 rounded-lg bg-[#0F2178] text-white font-semibold">Reintentar</button>
            <Link href="/regalos-corporativos/" className="inline-flex items-center min-h-[44px] px-4 rounded-lg border border-gray-300 font-semibold text-[#0F2178]">Ver categorías</Link>
          </div>
        </div>
      )}

      {status === 'ready' && results.length === 0 && (
        <div className="p-6 rounded-xl border border-gray-200 bg-[#F8F9FC]">
          <p className="font-semibold text-[#0A0A23] mb-2">No encontramos productos para esta búsqueda.</p>
          <p className="text-sm text-gray-600 mb-4">Prueba otra palabra, quita el filtro de categoría o cuéntanos qué necesitas.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={clearAll} className="min-h-[44px] px-4 rounded-lg bg-[#0F2178] text-white font-semibold">Quitar filtros</button>
            <a
              href={buildWhatsAppUrl(`Hola, busco un producto promocional y no lo encontré en el catálogo web. Necesito: ${q || '(describir)'}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] px-4 rounded-lg border border-gray-300 font-semibold text-[#0F2178]"
            >
              Pedir asesoría por WhatsApp
            </a>
          </div>
        </div>
      )}

      {status === 'ready' && shown.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {shown.map((p) => {
              const cat = categoriesById.get(p.c);
              return (
                <ProductCard
                  key={p.s}
                  product={{ id: p.s, slug: p.s, name: p.n, categoryId: p.c, images: p.i ? [p.i] : [] }}
                  category={cat ? { slug: cat.slug, name: cat.name } : null}
                />
              );
            })}
          </div>
          {visible < results.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="min-h-[44px] px-6 rounded-lg border border-[#0F2178]/30 text-[#0F2178] font-semibold hover:bg-[#F0F3FA]"
              >
                Mostrar {Math.min(PAGE_SIZE, results.length - visible)} más (de {results.length - visible} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
