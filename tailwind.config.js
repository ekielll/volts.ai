/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'premium': ['Sora', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}