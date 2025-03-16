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
        'light-gray': '#E8E8E8',
        'base-orange': '#E29578',
        'base-orange-darker': '#C87353',
        'primary-orange-ignore:': '#E29578',
        'primary-red': '#E76161',
        'pale-green': '#B2D8CE',
        'off-white': '#FDFDFD',
      },
      fontSize: {
        'size-base': '1rem',
      },
    },
  },
  plugins: [],
}
