/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
      'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
      black: '#000000',
      white: '#ffffff',
    },
  },
  plugins: [],
}
