'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ks_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted') {
      grantConsent();
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  function grantConsent() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    grantConsent();
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          Usamos cookies de Google Analytics para medir el tráfico y mejorar tu experiencia.
          Conforme al Art. 9 de la Ley Orgánica de Protección de Datos Personales (LOPDP),
          necesitamos tu consentimiento antes de activarlas.{' '}
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-primary text-white hover:bg-primary-dark transition-colors rounded"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
