/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Paleta corporativa NutreTerra
        primary: '#7FB14B',  // Verde principal (nombre "NutreTerra", botones)
        leaf: '#4A7D36',     // Verde hoja (hover, iconos)
        seed: '#6C4B2F',     // Marrón semilla (tipografía secundaria, bordes)
        accent: '#E16C50',   // Naranja acento (CTAs, destacados)
        cream: '#F0E8D8',    // Crema (fondos, tarjetas)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
