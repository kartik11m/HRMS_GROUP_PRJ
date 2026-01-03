/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-frost': {
          bg: '#020617',
          cards: '#0b1120',
          sidebar: '#2c50ab',
          text: '#ddeeff',
          primary: '#aaccff',
          hover: '#88aaff',
          borders: '#1f2937',
        }
      }
    },
  },
  plugins: [],
}
