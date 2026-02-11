/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        keep: {
          bg: '#202124',
          card: '#2d2e30', // Slightly lighter than bg, similar to Keep's card
          border: '#5f6368',
          text: '#e8eaed',
          textSecondary: '#9aa0a6',
          hover: '#303134',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
