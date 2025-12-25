import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7FB14B',
        leaf: '#4A7D36',
        seed: '#6C4B2F',
        accent: '#E16C50',
        cream: '#F0E8D8',
      },
    },
  },
  plugins: [],
};

export default config;
