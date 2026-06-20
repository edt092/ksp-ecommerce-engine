/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── KS Design System tokens ───────────────────────────────
        ks: {
          navy:         '#0F2178',
          'navy-dark':  '#091557',
          'navy-mid':   '#1A3299',
          'navy-light': '#2B4BC4',
          'navy-wash':  '#EDF0FB',
          'navy-ghost': '#F5F7FF',
          orange:       '#F5A520',
          'orange-dark':'#D48A0A',
          'orange-light':'#FFBA3D',
          'orange-wash':'#FFF4DC',
        },
        // ── Primary palette ──────────────────────────────────────
        primary: {
          DEFAULT: '#0F2178',
          light: '#2B4BC4',
          dark: '#091557',
        },
        secondary: {
          DEFAULT: '#0A0A23',
          light: '#1A1A3E',
          dark: '#000010',
        },
        // ── Accent: orange ───────────────────────────────────────
        accent: {
          DEFAULT: '#F5A520',
          light: '#FFBA3D',
          dark: '#D48A0A',
        },
        // ── Utility tokens ────────────────────────────────────────
        'deep-navy':      '#091557',
        'midnight':       '#0D0D1A',
        'glass-border':   'rgba(255,255,255,0.08)',
        'glass-fill':     'rgba(255,255,255,0.04)',
        'whatsapp-green': '#25D366',
        navy: {
          DEFAULT: '#0F2178',
          light: '#2B4BC4',
          dark: '#091557',
        },
        cream: {
          DEFAULT: '#EDF0FB',
          dark: '#D4DCF5',
        },
        gold: {
          DEFAULT: '#F5A520',
          light: '#FFBA3D',
          dark: '#D48A0A',
        },
      },
      fontFamily: {
        sans:    ['var(--font-nunito-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        syne:    ['var(--font-syne)', 'system-ui', 'sans-serif'],
        nunito:  ['var(--font-nunito-sans)', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'slideUpFade':    'slideUpFade 0.22s ease-out both',
        'fade-in':        'fadeIn 0.6s ease-out forwards',
        'slide-up':       'slideUp 0.7s ease-out forwards',
        'slide-down':     'slideDown 0.5s ease-out forwards',
        'scale-in':       'scaleIn 0.4s ease-out forwards',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 6s ease-in-out infinite',
        'float-1':        'float1 9s ease-in-out infinite',
        'float-2':        'float2 11s ease-in-out infinite',
        'glow':           'glow 2s ease-in-out infinite alternate',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'marquee':        'marquee 30s linear infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'pulse-green':    'pulseGreen 2.2s cubic-bezier(0.4,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        // ── New float keyframes ──────────────────────────────────
        float1: {
          '0%':   { transform: 'translateY(0px) scale(1) rotate(0deg)' },
          '33%':  { transform: 'translateY(-28px) scale(1.08) rotate(2deg)' },
          '66%':  { transform: 'translateY(-12px) scale(0.96) rotate(-1deg)' },
          '100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
        },
        float2: {
          '0%':   { transform: 'translateY(0px) scale(1) rotate(0deg)' },
          '40%':  { transform: 'translateY(22px) scale(1.06) rotate(-2deg)' },
          '80%':  { transform: 'translateY(-10px) scale(0.97) rotate(1deg)' },
          '100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGreen: {
          '0%':   { boxShadow: '0 0 0 0 rgba(37,211,102,0.55), 0 4px 20px rgba(37,211,102,0.2)' },
          '60%':  { boxShadow: '0 0 0 18px rgba(37,211,102,0), 0 4px 20px rgba(37,211,102,0.2)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37,211,102,0), 0 4px 20px rgba(37,211,102,0.2)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(232,119,34,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(232,119,34,0.6)' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideUpFade: {
          '0%':   { opacity: '0', transform: 'translateY(10px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      boxShadow: {
        'soft':         '0 4px 24px -4px rgba(0,26,110,0.08)',
        'card':         '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover':   '0 8px 40px -8px rgba(0,26,110,0.25)',
        'orange-glow':  '0 0 28px rgba(232,119,34,0.55), 0 4px 20px rgba(232,119,34,0.35)',
        'orange-glow-sm':'0 0 12px rgba(232,119,34,0.3)',
        'green-glow':   '0 0 32px rgba(37,211,102,0.5), 0 8px 24px rgba(37,211,102,0.3)',
        'navy':         '0 20px 60px -10px rgba(0,26,110,0.4)',
        'gold-glow':    '0 0 30px rgba(232,119,34,0.4)',
        'blue-glow':    '0 0 40px rgba(41,98,255,0.35)',
      },
      backgroundImage: {
        'grid-pattern':  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'dot-pattern':   'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'navy-gradient': 'linear-gradient(135deg, #000D3D 0%, #001A6E 50%, #002494 100%)',
        'hero-gradient': 'linear-gradient(135deg, #000D3D 0%, #0D0D1A 45%, #000a3b 100%)',
        'card-shine':    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        'dot':  '24px 24px',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '108': '1.08',
        '110': '1.10',
        '115': '1.15',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
