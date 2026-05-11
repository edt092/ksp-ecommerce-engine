'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import CountryWhatsAppModal, {
  WA_COUNTRIES,
  openCountryWhatsApp,
  trackWhatsAppClick,
} from './CountryWhatsAppModal';

const WA_ICON = (
  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const WA_ICON_SM = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ── Popup that emerges above the fixed floating button ─────────────────────
function FloatingPopup({ message, onClose, context }) {
  return (
    <div
      className="absolute bottom-[calc(100%+12px)] right-0 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl overflow-hidden
                 animate-[slideUpFade_0.22s_ease-out_both]"
      style={{ transformOrigin: 'bottom right' }}
    >
      {/* Header */}
      <div className="bg-[#25D366] px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-white font-semibold text-sm leading-tight">
            ¿Desde dónde nos escribes?
          </p>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/20"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-white/75 text-xs mt-0.5">Elige tu país para atenderte mejor</p>
      </div>

      {/* Country cards */}
      <div className="p-3 flex flex-col gap-2">
        {WA_COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => {
              trackWhatsAppClick(c.code, context);
              openCountryWhatsApp(c.phone, message);
              onClose();
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl border-2 border-gray-100
                       hover:border-[#25D366] hover:bg-green-50 active:scale-[0.97]
                       transition-all duration-150 group text-left"
          >
            <span className="text-3xl leading-none select-none">{c.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm group-hover:text-[#128C7E] transition-colors">
                {c.label}
              </p>
              <p className="text-gray-400 text-xs truncate">{c.hint}</p>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-[#25D366] transition-colors flex-shrink-0"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Arrow pointing toward the button */}
      <div
        className="absolute -bottom-[8px] right-6 w-4 h-4 bg-white rotate-45 shadow-md"
        style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.08)' }}
      />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function WhatsAppButton({
  message = '¡Hola! Me gustaría conocer más sobre sus productos promocionales.',
  // phoneNumber prop kept for backwards compat but ignored — country selector handles routing
  position = 'fixed',
  className = '',
  children,
  productName = null,
  categoryName = null,
  variant = 'default',
  hideOnBlog = true,
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('ks_cookie_consent');
    if (!stored) setCookieBannerVisible(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  const shouldHide = hideOnBlog && position === 'fixed' && pathname?.startsWith('/blog');
  if (shouldHide) return null;

  const context = productName || categoryName || 'general';

  // ── Fixed floating button ──────────────────────────────────────────────
  if (position === 'fixed') {
    return (
      <div
        ref={containerRef}
        className={`fixed right-4 sm:right-6 z-50 transition-all duration-300 ${
          cookieBannerVisible ? 'bottom-32 sm:bottom-24' : 'bottom-4 sm:bottom-6'
        }`}
      >
        {open && (
          <FloatingPopup
            message={message}
            onClose={() => setOpen(false)}
            context={context}
          />
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16
                      rounded-full shadow-2xl transition-all duration-300 transform
                      ${open
                        ? 'bg-[#128C7E] scale-95'
                        : 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-110'
                      }`}
          aria-label="Contactar por WhatsApp"
          aria-expanded={open}
        >
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-pulse" />
            </>
          )}

          {open ? (
            <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            WA_ICON
          )}
        </button>
      </div>
    );
  }

  // ── Inline button ──────────────────────────────────────────────────────
  const variantStyles = {
    default: 'bg-green-500 hover:bg-green-600 text-white',
    primary: 'bg-ecuador-yellow hover:bg-yellow-500 text-gray-900 font-bold',
    secondary: 'bg-ecuador-red hover:bg-red-600 text-white',
  };

  return (
    <>
      {open && (
        <CountryWhatsAppModal
          message={message}
          onClose={() => setOpen(false)}
          context={context}
        />
      )}
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                    transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl
                    ${variantStyles[variant]} ${className}`}
      >
        {WA_ICON_SM}
        {children || 'Cotizar por WhatsApp'}
      </button>
    </>
  );
}
