'use client';

export const WA_COUNTRIES = [
  {
    code: 'ec',
    label: 'Ecuador',
    flag: '🇪🇨',
    phone: '593999814838',
    hint: 'Quito · Guayaquil · todo el país',
  },
  {
    code: 'co',
    label: 'Colombia',
    flag: '🇨🇴',
    phone: '573106629590',
    hint: 'Bogotá · Medellín · todo el país',
  },
];

export function openCountryWhatsApp(phone, message) {
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

export function trackWhatsAppClick(country, context) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: context || 'general',
      country,
    });
  }
}

export default function CountryWhatsAppModal({ message, onClose, context }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[9999] w-[min(340px,92vw)]
                   bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2
                   bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden
                   animate-[slideUpFade_0.25s_ease-out_both]"
      >
        <div className="bg-[#25D366] px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-base">¿Desde dónde nos escribes?</p>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/75 text-sm mt-0.5">Elige tu país para contactar al equipo correcto</p>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {WA_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                trackWhatsAppClick(c.code, context);
                openCountryWhatsApp(c.phone, message);
                onClose();
              }}
              className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl border-2 border-gray-100
                         hover:border-[#25D366] hover:bg-green-50 active:scale-[0.97]
                         transition-all duration-150 group text-left"
            >
              <span className="text-4xl leading-none select-none">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-base group-hover:text-[#128C7E] transition-colors">
                  {c.label}
                </p>
                <p className="text-gray-400 text-sm">{c.hint}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-[#25D366] transition-colors flex-shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <div className="pb-safe h-2 sm:hidden" />
      </div>
    </>
  );
}
