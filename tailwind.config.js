/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        button: {
          'margin-bottom': '1rem',
        },
      });
    }),
  ],
};
