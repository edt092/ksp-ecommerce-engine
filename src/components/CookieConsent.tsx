'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'ks_cookie_consent';
const HEIGHT_VAR = '--cookie-banner-h';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setCurrent(stored);
    if (stored === 'granted') {
      grantConsent();
    } else if (!stored) {
      setVisible(true);
    }
    // UX-11: el pie de página puede reabrir la decisión.
    const reopen = () => { setCurrent(localStorage.getItem(CONSENT_KEY)); setVisible(true); };
    window.addEventListener('ks-open-cookie-preferences', reopen);
    return () => window.removeEventListener('ks-open-cookie-preferences', reopen);
  }, []);

  // Publica la altura real del banner (cambia con el ancho y el texto) para
  // que el botón flotante de WhatsApp se coloque encima sin una cifra fija
  // (docs/seo-improvement-2026-10-09, U02). Se limpia al cerrar.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible || !bannerRef.current) {
      root.style.removeProperty(HEIGHT_VAR);
      return undefined;
    }
    const node = bannerRef.current;
    const update = () => root.style.setProperty(HEIGHT_VAR, `${Math.ceil(node.getBoundingClientRect().height)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_VAR);
    };
  }, [visible]);

  function grantConsent() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    grantConsent();
    setCurrent('granted');
    setVisible(false);
  }

  // Rechazar también revoca un consentimiento previo en la sesión actual
  // (Consent Mode); no hace falta recargar la página.
  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    setCurrent('denied');
    setVisible(false);
  }

  if (!visible) return null;

  // Compacto en móvil: antes ocupaba 187 px a 375 px de ancho (23 % de la
  // pantalla) y tapaba el CTA de producto. Mismo contenido legal, botones con
  // área táctil de 44 px y foco visible.
  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 pt-3 md:px-8 md:py-4"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
        <p className="text-xs sm:text-sm leading-snug text-gray-700 flex-1">
          Usamos cookies de Google Analytics para medir el tráfico. Según la LOPDP (Art. 9) necesitamos tu
          consentimiento antes de activarlas.{' '}
          {current && (
            <span className="font-semibold">Ahora: {current === 'granted' ? 'aceptadas' : 'rechazadas'}. </span>
          )}
          <Link href="/politica-de-privacidad/" className="underline text-[#0F2178] whitespace-nowrap">
            Política de privacidad
          </Link>
        </p>
        <div className="flex gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 sm:flex-none min-h-[44px] px-4 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2178]"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-none min-h-[44px] px-4 text-sm bg-primary text-white hover:bg-primary-dark transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2178]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
