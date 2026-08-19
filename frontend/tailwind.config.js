/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'grid-dark': '#0b0f1a',
        'grid-panel': '#111827',
        'grid-blue': '#38bdf8',
        'grid-green': '#22c55e',
        'grid-orange': '#f97316',
        'grid-red': '#ef4444'
      },
      boxShadow: {
        glow: '0 0 20px rgba(56, 189, 248, 0.35)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
