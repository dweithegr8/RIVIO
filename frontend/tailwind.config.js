/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-primary': '#FF7F16',      // Vibrant Orange - buttons/actions
        'brand-dark': '#08062A',          // Deep Navy - sidebars/headers

        // Brand Faded/Alpha variants
        'brand-primary-alpha': 'rgba(255, 127, 22, 0.1)',
        'brand-dark-alpha': 'rgba(8, 6, 42, 0.1)',

        // Neutral Scale (Cool Greys) - Complete palette
        neutral: {
          25: '#FAFBFD',
          50: '#F6F7F9',
          100: '#E7E9ED',
          300: '#B1BBC8',
          400: '#8695AA',
          500: '#64748B',
          800: '#3A4252',
          950: '#23272E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(8, 6, 42, 0.1), 0 2px 4px -1px rgba(8, 6, 42, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(8, 6, 42, 0.1), 0 4px 6px -2px rgba(8, 6, 42, 0.05)',
        'button': '0 1px 2px 0 rgba(8, 6, 42, 0.05)',
        'button-hover': '0 4px 6px -1px rgba(255, 127, 22, 0.25)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'highlight-fade': {
          '0%': { backgroundColor: 'rgb(220 252 231)' },
          '70%': { backgroundColor: 'rgb(220 252 231)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.4s ease-out',
        'highlight-fade': 'highlight-fade 5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
