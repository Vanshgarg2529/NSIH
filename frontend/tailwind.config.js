/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102A43',
          dark: '#0B1F33',
          light: '#243B53',
          muted: '#334E68'
        },
        gold: {
          DEFAULT: '#F4C542',
          hover: '#E0B335',
          light: '#FFF8E7'
        },
        govbg: '#F8FAFC'
      }
    },
  },
  plugins: [],
}
