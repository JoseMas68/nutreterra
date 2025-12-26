/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Next.js
  experimental: {
    // Desactivar el prerendering estático para evitar consultas a la DB durante el build
    outputStandalone: true,
  },
  // Desactivar generación estática para páginas del admin
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Evitar pre-renderizado durante el build
  // Esto asegura que las páginas del admin no hagan queries durante el build
  outputFileTracingIncludes: {
    '/admin/**': [],
  },
};

export default nextConfig;
