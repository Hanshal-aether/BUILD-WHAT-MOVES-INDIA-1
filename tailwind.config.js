/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f1fe',
          100: '#e5e3fd',
          200: '#c6c1fb',
          300: '#a29af8',
          400: '#8477f4',
          500: '#6d5bf6',
          600: '#5641e8',
          700: '#4338ca',
          800: '#362da3',
          900: '#1e1b4b',
        },
        saffron: {
          400: '#fcd34d',
          500: '#fbbf24',
          600: '#f59e0b',
        },
        ink: '#0f0d2b',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Sora', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
            boxShadow: {
        glow: '0 10px 40px -8px rgba(109, 91, 246, 0.45)',
        'glow-saffron': '0 10px 30px -6px rgba(251, 191, 36, 0.45)',
        soft: '0 2px 10px rgba(15, 13, 43, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out both',
        slideIn: 'slideIn 0.35s ease-out both',
        pulseSoft: 'pulseSoft 1.4s ease-in-out infinite',
        popIn: 'popIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
