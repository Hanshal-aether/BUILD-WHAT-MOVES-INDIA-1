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
        // National Heritage Palette — Navy Sovereignty + Saffron Orange.
        // Reuses the existing brand/saffron token names so every component
        // that already references them (bg-brand-900, text-saffron-500,
        // etc.) reskins automatically with zero code changes elsewhere.
        brand: {
          50: '#EEF2F8',
          100: '#D6E0EF',
          200: '#AEC2DF',
          300: '#7E9DC9',
          400: '#4C74A8',
          500: '#2C5589',
          600: '#1E3F6E',
          700: '#16305A',
          800: '#102448',
          900: '#0F2C59',
        },
        saffron: {
          400: '#FFB066',
          500: '#FF6B00',
          600: '#E65F00',
        },
        ink: '#0A1730',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Sora', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 10px 40px -8px rgba(15, 44, 89, 0.45)',
        'glow-saffron': '0 10px 30px -6px rgba(255, 107, 0, 0.45)',
        soft: '0 2px 10px rgba(10, 23, 48, 0.06)',
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
