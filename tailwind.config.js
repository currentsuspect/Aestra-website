/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          900: '#4c1d95',
        }
      },
    }
  },
  plugins: [],
}
