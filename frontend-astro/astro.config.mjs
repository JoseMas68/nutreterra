import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // Tailwind ya está configurado en tailwind.config.js
      applyBaseStyles: false, // Usamos nuestro global.css
    }),
  ],
  output: 'static', // Generación estática (por defecto)
  server: {
    port: 4321,
    host: true,
  },
});
