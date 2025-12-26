import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static', // Generación estática con soporte para SSR en páginas con prerender: false
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 4321,
    host: true,
  },
});
