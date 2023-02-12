/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'base': '#F5F1ED',
        'primary-dark': '#252323',
        'primary-gray': '#70798C',
        'secondary-gray': '#D9D9D9',
        'base-orange': '#E29578',
        'primary-orange-ignore:': '#E29578',
      },
      fontSize: {
        'size-base': '1rem',
      },
    },
  },
  plugins: [],
}
