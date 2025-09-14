/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        orange: {
          500: '#ff9800',
          600: '#f57c00',
          700: '#ef6c00',
        }
      },
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}