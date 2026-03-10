/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0047AB',
          light: '#2962FF',
          dark: '#001A6E',
        },
        secondary: {
          DEFAULT: '#0A0A23',
          light: '#1A1A3E',
          dark: '#000010',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        navy: {
          DEFAULT: '#001A6E',
          light: '#002494',
          dark: '#000D3D',
        },
        cream: {
          DEFAULT: '#F0F4FF',
          dark: '#E1E8FF',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-syne-mono)', 'monospace'],
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 71, 171, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(41, 98, 255, 0.6)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(0, 71, 171, 0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 40px -8px rgba(0, 71, 171, 0.25)',
        'blue-glow': '0 0 40px rgba(41, 98, 255, 0.35)',
        'gold-glow': '0 0 30px rgba(245, 158, 11, 0.4)',
        'navy': '0 20px 60px -10px rgba(0, 26, 110, 0.4)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'dot-pattern': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'blue-mesh': 'radial-gradient(ellipse at 20% 50%, #0047AB 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #2962FF 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, #001A6E 0%, transparent 60%)',
        'navy-gradient': 'linear-gradient(135deg, #000D3D 0%, #001A6E 50%, #002494 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        'dot': '24px 24px',
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
