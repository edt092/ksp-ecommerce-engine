'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { displayName } from '@/lib/product-display';
import { buildProductQuoteMessage, buildWhatsAppUrl, productReference, trackWhatsAppClick } from '@/lib/whatsapp';
import { responseTimeLabel } from '@/lib/business-facts';
import { addQuoteItem, hasQuoteItem, MAX_ITEMS, trackQuoteEvent, useQuoteItems } from '@/lib/quote-list';

export default function ProductActions({ product }) {
  const message = buildProductQuoteMessage(product);
  const items = useQuoteItems();
  const [inList, setInList] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => { setInList(hasQuoteItem(product.slug)); }, [items, product.slug]);

  // UX-06: lista multiproducto. Confirmación no intrusiva (role=status) con
  // acceso a la lista; sin modal obligatorio.
  function onAdd() {
    const result = addQuoteItem(product.slug);
    if (result === 'added') {
      trackQuoteEvent('quote_item_added', { product_ref: productReference(product) || product.slug, category: product.categoryId, origin: 'pdp' });
      setStatus('Añadido a tu cotización.');
    } else if (result === 'exists') {
      setStatus('Este producto ya está en tu cotización.');
    } else {
      setStatus(`Tu cotización ya tiene ${MAX_ITEMS} productos. Envíala o quita alguno para añadir más.`);
    }
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick({ label: displayName(product), pageType: 'product', placement: 'pdp_primary', productRef: productReference(product), category: product.categoryId })}
        className="group w-full min-h-[48px] bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        aria-label="Cotizar por WhatsApp"
        aria-describedby={`wa-hint-${product.slug}`}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="hidden sm:inline">Cotizar directamente por WhatsApp</span>
        <span className="sm:hidden">Cotizar por WhatsApp</span>
      </a>
      <p id={`wa-hint-${product.slug}`} className="text-xs text-gray-500 text-center -mt-1">
        Se abrirá WhatsApp con el nombre, la referencia y el enlace de este producto.
      </p>

      {inList ? (
        <Link
          href="/cotizacion/"
          className="w-full min-h-[44px] flex items-center justify-center gap-2 px-6 rounded-xl border-2 border-[#0F2178] text-[#0F2178] font-semibold hover:bg-[#F0F3FA] transition-colors"
        >
          ✓ En tu cotización · Ver mi cotización
        </Link>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="w-full min-h-[44px] px-6 rounded-xl border-2 border-[#0F2178]/25 text-[#0F2178] font-semibold hover:border-[#0F2178] hover:bg-[#F0F3FA] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2178]"
        >
          Añadir a mi cotización
        </button>
      )}
      <p role="status" aria-live="polite" className="text-sm text-center text-[#0A0A23] min-h-[1.25rem] -mt-1">
        {status}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{responseTimeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Sin compromiso</span>
        </div>
        <a
          href="tel:+593999814838"
          className="inline-flex items-center min-h-[44px] px-2 font-semibold text-[#0F2178] hover:text-[#F5A520] transition-colors"
        >
          o llama al +593 99 981 4838
        </a>
      </div>
    </div>
  );
}
