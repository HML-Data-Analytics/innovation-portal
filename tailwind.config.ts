import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        heineken: {
          green: '#00843D',
          dark: '#00612E',
          light: '#3AA66D',
          red: '#E4002B',
          gold: '#FFD100',
          cream: '#F5F5F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
