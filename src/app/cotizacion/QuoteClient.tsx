'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { removeQuoteItem, setQuoteQuantity, clearQuoteList, useQuoteItems, trackQuoteEvent } from '@/lib/quote-list';
import { buildWhatsAppUrl, SITE_URL, trackWhatsAppClick } from '@/lib/whatsapp';
import { minimumOrderAnswer, responseTimeSentence } from '@/lib/business-facts';

const QUOTE_EMAIL = 'claudiagonzalez@kronosolopromocionales.com';

interface IndexProduct { s: string; n: string; r: string; c: string; i: string }

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function QuoteClient() {
  const items = useQuoteItems();
  const [hydrated, setHydrated] = useState(false);
  const [catalog, setCatalog] = useState<Map<string, IndexProduct> | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const errorSummary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
    fetch('/search-index.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setCatalog(new Map(data.products.map((p: IndexProduct) => [p.s, p]))))
      .catch(() => setCatalogError(true));
  }, []);

  // Borrador de cantidades editable sin perder lo escrito si aún no es válido.
  useEffect(() => {
    setQtyDraft((prev) => {
      const next: Record<string, string> = {};
      for (const it of items) next[it.slug] = prev[it.slug] ?? (it.quantity ? String(it.quantity) : '');
      return next;
    });
  }, [items]);

  const lines = useMemo(() => items.map((it) => ({ ...it, product: catalog?.get(it.slug) || null })), [items, catalog]);

  function onQty(slug: string, value: string) {
    setQtyDraft((d) => ({ ...d, [slug]: value }));
    const n = Number(value);
    if (value === '') setQuoteQuantity(slug, null);
    else if (Number.isInteger(n) && n > 0 && n <= 1000000) setQuoteQuantity(slug, n);
    setErrors((e) => { const { [`qty-${slug}`]: _, ...rest } = e; return rest; });
  }

  function validate() {
    const next: Record<string, string> = {};
    for (const it of items) {
      const raw = (qtyDraft[it.slug] || '').trim();
      if (raw === '') continue; // "por definir" es válido: el asesor ayuda a decidir
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1) next[`qty-${it.slug}`] = 'Escribe una cantidad entera desde 1, o déjala vacía si aún no la sabes.';
    }
    if (date && date < todayLocal()) next.date = 'La fecha debe ser hoy o posterior.';
    setErrors(next);
    if (Object.keys(next).length) {
      for (const field of Object.keys(next)) trackQuoteEvent('quote_validation_error', { field: field.startsWith('qty-') ? 'quantity' : field });
      setStatus('');
      requestAnimationFrame(() => errorSummary.current?.focus());
      return false;
    }
    return true;
  }

  function buildMessage() {
    const rows = lines.map((l, i) => {
      const name = l.product?.n || l.slug;
      const ref = l.product?.r ? ` (ref. ${l.product.r})` : '';
      const qty = (qtyDraft[l.slug] || '').trim() || 'por definir';
      return `${i + 1}. ${name}${ref} — Cantidad: ${qty}\n   ${SITE_URL}/productos/${l.slug}/`;
    });
    return [
      'Hola, quiero cotizar estos productos:',
      ...rows,
      '',
      `Ciudad de entrega: ${city.trim() || 'por definir'}`,
      `Fecha requerida: ${date ? formatDate(date) : 'por definir'}`,
      `Técnica / logo / notas: ${notes.trim() || 'necesito asesoría'}`,
    ].join('\n');
  }

  function openWhatsApp() {
    if (!validate()) return;
    trackWhatsAppClick({ label: 'quote_list', pageType: 'cotizacion', placement: 'quote_list' });
    trackQuoteEvent('quote_whatsapp_opened', { items: items.length });
    window.open(buildWhatsAppUrl(buildMessage()), '_blank', 'noopener,noreferrer');
    setStatus('Abrimos WhatsApp con tu lista. Tu solicitud nos llega cuando envías el mensaje desde WhatsApp. Tu selección se conserva aquí por 7 días.');
  }

  function openEmail() {
    if (!validate()) return;
    trackQuoteEvent('quote_email_opened', { items: items.length });
    window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(buildMessage())}`;
    setStatus(`Abrimos tu programa de correo. Si no se abrió, escríbenos a ${QUOTE_EMAIL} o usa «Copiar lista».`);
  }

  async function copyList() {
    if (!validate()) return;
    try {
      await navigator.clipboard.writeText(buildMessage());
      setStatus('Lista copiada. Pégala en WhatsApp o en un correo.');
    } catch {
      setStatus('No pudimos copiar automáticamente. Selecciona el texto de la lista y cópialo manualmente.');
    }
  }

  if (!hydrated) return <p className="text-gray-500">Cargando tu lista…</p>;

  if (items.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-gray-200 bg-[#F8F9FC] text-center">
        <p className="font-semibold text-[#0A0A23] text-lg mb-2">Aún no has añadido productos.</p>
        <p className="text-gray-600 mb-6">Explora el catálogo y usa «Añadir a mi cotización» en cada producto para preparar una sola solicitud.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/buscar/" className="inline-flex items-center min-h-[44px] px-5 rounded-lg bg-[#0F2178] text-white font-semibold">Buscar productos</Link>
          <Link href="/regalos-corporativos/" className="inline-flex items-center min-h-[44px] px-5 rounded-lg border border-gray-300 text-[#0F2178] font-semibold">Ver categorías</Link>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
      <div className="space-y-6">
        {errorList.length > 0 && (
          <div ref={errorSummary} tabIndex={-1} role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50">
            <p className="font-semibold text-[#0A0A23] mb-2">Revisa {errorList.length === 1 ? 'este dato' : 'estos datos'} antes de continuar:</p>
            <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">
              {errorList.map(([field, msg]) => (
                <li key={field}><a href={`#${field}`} className="underline">{msg}</a></li>
              ))}
            </ul>
          </div>
        )}

        <section aria-labelledby="quote-products-title">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 id="quote-products-title" className="font-bold text-[#0A0A23] text-xl">
              Productos ({items.length})
            </h2>
            <button type="button" onClick={() => { clearQuoteList(); setStatus('Lista vaciada.'); }} className="min-h-[44px] px-3 text-sm text-gray-600 underline hover:text-[#0F2178]">
              Vaciar lista
            </button>
          </div>
          {catalogError && <p className="text-sm text-gray-600 mb-3">No pudimos cargar los nombres de los productos; tu lista se conserva igualmente.</p>}
          <ul className="space-y-3">
            {lines.map((l) => {
              const err = errors[`qty-${l.slug}`];
              const retired = catalog && !l.product;
              return (
                <li key={l.slug} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                  <div className="relative w-20 h-20 shrink-0 rounded-lg bg-[#F3F5FA] overflow-hidden">
                    {l.product?.i && <Image src={l.product.i} alt="" fill sizes="80px" className="object-contain p-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {retired ? (
                      <p className="text-sm text-gray-600">Este producto ya no está disponible en el catálogo web.</p>
                    ) : (
                      <Link href={`/productos/${l.slug}/`} className="font-semibold text-[#0A0A23] hover:text-[#0F2178] break-words">
                        {l.product?.n || l.slug}
                      </Link>
                    )}
                    {l.product?.r && <p className="text-xs text-gray-500 mt-0.5">Ref. {l.product.r}</p>}
                    <div className="mt-3 flex flex-wrap items-end gap-3">
                      <div>
                        <label htmlFor={`qty-${l.slug}`} className="block text-xs font-semibold text-gray-700 mb-1">Cantidad de unidades</label>
                        <input
                          id={`qty-${l.slug}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          value={qtyDraft[l.slug] ?? ''}
                          onChange={(e) => onQty(l.slug, e.target.value)}
                          placeholder="Por definir"
                          aria-invalid={err ? true : undefined}
                          aria-describedby={`qty-help-${l.slug}${err ? ` qty-err-${l.slug}` : ''}`}
                          className={`w-32 min-h-[44px] px-3 border rounded-lg ${err ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#0F2178]`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => { removeQuoteItem(l.slug); setStatus(`Quitamos ${l.product?.n || 'el producto'} de tu lista.`); }}
                        className="min-h-[44px] px-3 text-sm text-gray-600 underline hover:text-red-700"
                        aria-label={`Quitar ${l.product?.n || l.slug} de la cotización`}
                      >
                        Quitar
                      </button>
                    </div>
                    <p id={`qty-help-${l.slug}`} className="text-xs text-gray-500 mt-1">El mínimo se confirma según la referencia.</p>
                    {err && <p id={`qty-err-${l.slug}`} className="text-xs text-red-700 mt-1">{err}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/buscar/" className="inline-flex items-center min-h-[44px] mt-3 text-sm font-semibold text-[#0F2178]">+ Añadir más productos</Link>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 p-5 rounded-2xl border border-gray-100 bg-[#F8F9FC] space-y-4" aria-labelledby="quote-project-title">
        <h2 id="quote-project-title" className="font-bold text-[#0A0A23] text-lg">Datos del pedido</h2>
        <p className="text-xs text-gray-500">Opcionales. No guardamos estos datos en tu navegador; solo se incluyen en el mensaje que tú envías.</p>
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">Ciudad de entrega</label>
          <input id="city" type="text" value={city} maxLength={60} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" className="w-full min-h-[44px] px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0F2178]" />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">Fecha en la que lo necesitas</label>
          <input
            id="date"
            type="date"
            min={todayLocal()}
            value={date}
            onChange={(e) => { setDate(e.target.value); setErrors((er) => { const { date: _, ...rest } = er; return rest; }); }}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? 'date-err date-help' : 'date-help'}
            className={`w-full min-h-[44px] px-3 border rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#0F2178]`}
          />
          <p id="date-help" className="text-xs text-gray-500 mt-1">Confirmamos la viabilidad del plazo en la cotización.</p>
          {errors.date && <p id="date-err" className="text-xs text-red-700 mt-1">{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">Técnica, logo o comentarios</label>
          <textarea id="notes" rows={3} value={notes} maxLength={400} onChange={(e) => setNotes(e.target.value)} placeholder="Si no sabes qué técnica conviene, te asesoramos." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0F2178]" />
        </div>
        <p className="text-xs text-gray-600">{minimumOrderAnswer}</p>

        <div className="space-y-2 pt-1">
          <button type="button" onClick={openWhatsApp} className="w-full min-h-[48px] px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">
            Abrir WhatsApp con mi lista
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={openEmail} className="min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm font-semibold text-[#0F2178] bg-white">Enviar por correo</button>
            <button type="button" onClick={copyList} className="min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm font-semibold text-[#0F2178] bg-white">Copiar lista</button>
          </div>
          <p className="text-xs text-gray-500">{responseTimeSentence}</p>
        </div>
        <p role="status" aria-live="polite" className="text-sm text-[#0A0A23] min-h-[1.25rem]">{status}</p>
      </aside>
    </div>
  );
}
