/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-c:': '#E29578',
        'base': '#F5F1ED',
        'primary-dark': '#252323',
        'primary-gray': '#70798C',
        'secondary-gray': '#D9D9D9',
      },
    },
  },
  plugins: [],
}
