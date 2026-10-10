'use client';

// Lista de cotización multiproducto (docs/ux-improvement-2026-10-09, UX-06, MVP).
//
// El sitio es un export estático sin backend: no hay dónde persistir una
// solicitud ni emitir una referencia de "solicitud recibida". Este MVP solo
// conserva en el navegador QUÉ productos y CUÁNTAS unidades quiere el
// comprador, y arma un único mensaje de WhatsApp (o correo) con la lista. La
// solicitud se considera recibida cuando el comprador envía ese mensaje; la
// interfaz nunca afirma lo contrario.
//
// Privacidad: solo se guardan slug y cantidad, con versión y caducidad de 7
// días. Nunca nombre, teléfono, correo, empresa, logo ni notas libres.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ks_quote_list';
const VERSION = 1;
const TTL_MS = 7 * 24 * 3600 * 1000;
const CHANGE_EVENT = 'ks-quote-change';
export const MAX_ITEMS = 30;

export interface QuoteItem {
  slug: string;
  quantity: number | null;
}

interface StoredList {
  v: number;
  expiresAt: number;
  items: QuoteItem[];
}

function read(): QuoteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredList = JSON.parse(raw);
    if (parsed.v !== VERSION || !Array.isArray(parsed.items) || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed.items
      .filter((i) => typeof i.slug === 'string' && /^[a-z0-9-]+$/.test(i.slug))
      .map((i) => ({ slug: i.slug, quantity: Number.isInteger(i.quantity) && i.quantity > 0 ? i.quantity : null }))
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function write(items: QuoteItem[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, expiresAt: Date.now() + TTL_MS, items }));
  } catch {
    /* almacenamiento no disponible: la lista vive solo en esta pestaña */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getQuoteItems(): QuoteItem[] {
  return read();
}

export function hasQuoteItem(slug: string): boolean {
  return read().some((i) => i.slug === slug);
}

export function addQuoteItem(slug: string): 'added' | 'exists' | 'full' {
  const items = read();
  if (items.some((i) => i.slug === slug)) return 'exists';
  if (items.length >= MAX_ITEMS) return 'full';
  write([...items, { slug, quantity: null }]);
  return 'added';
}

export function setQuoteQuantity(slug: string, quantity: number | null) {
  write(read().map((i) => (i.slug === slug ? { ...i, quantity } : i)));
}

export function removeQuoteItem(slug: string) {
  write(read().filter((i) => i.slug !== slug));
}

export function clearQuoteList() {
  write([]);
}

export function useQuoteItems(): QuoteItem[] {
  const [items, setItems] = useState<QuoteItem[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return items;
}

export function useQuoteCount(): number {
  return useQuoteItems().length;
}

// Evento de analítica sin datos personales (consentimiento: Consent Mode).
export function trackQuoteEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) (window as any).gtag('event', name, params);
}
