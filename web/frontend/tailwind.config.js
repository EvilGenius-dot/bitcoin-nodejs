/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      "./index.html"
  ],
  theme: {
      extend: {
          animation: {
              'spin-slow': 'spin 5s linear infinite',
          }
      },
  },
  plugins: [],
}