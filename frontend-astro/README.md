# Frontend – NutreTerra (Astro)

## Descripción

Frontend de la tienda online NutreTerra construido con Astro, TypeScript y TailwindCSS.

## Stack Tecnológico

- **Astro** – Framework principal
- **TypeScript** – Tipado estático
- **TailwindCSS** – Estilos utilitarios
- **React/Preact** – Islands para componentes interactivos

## Estructura de Carpetas

```
frontend-astro/
├── src/
│   ├── pages/              # Páginas y rutas
│   │   ├── index.astro     # Página principal
│   │   ├── producto/
│   │   │   └── [slug].astro
│   │   ├── categoria/
│   │   │   └── [slug].astro
│   │   ├── carrito.astro
│   │   ├── checkout/
│   │   │   ├── index.astro
│   │   │   ├── pago.astro
│   │   │   └── confirmacion.astro
│   │   ├── login.astro
│   │   ├── registro.astro
│   │   ├── perfil.astro
│   │   ├── pedidos/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── contacto.astro
│   │
│   ├── layouts/            # Plantillas base
│   │   ├── Layout.astro    # Layout principal
│   │   ├── ProductLayout.astro
│   │   └── CheckoutLayout.astro
│   │
│   ├── components/         # Componentes reutilizables (estáticos)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProductCard.astro
│   │   ├── CategoryCard.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── Hero.astro
│   │   └── SEO.astro
│   │
│   ├── islands/            # Componentes interactivos (React/Preact)
│   │   ├── CartIcon.tsx    # Icono carrito con contador
│   │   ├── AddToCart.tsx   # Botón añadir al carrito
│   │   ├── ProductFilters.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentForm.tsx
│   │
│   ├── services/           # Consumo de API
│   │   ├── api-client.ts   # Cliente HTTP base
│   │   ├── products.ts     # Endpoints de productos
│   │   ├── categories.ts   # Endpoints de categorías
│   │   ├── cart.ts         # Endpoints de carrito
│   │   ├── orders.ts       # Endpoints de pedidos
│   │   └── auth.ts         # Endpoints de autenticación
│   │
│   ├── styles/             # Estilos globales
│   │   ├── global.css      # Estilos base y Tailwind
│   │   └── fonts.css       # Fuentes personalizadas
│   │
│   └── env.d.ts            # Tipos de variables de entorno
│
├── public/                 # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── favicon.svg
│
├── astro.config.mjs        # Configuración de Astro
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
├── package.json
└── README.md               # Este archivo
```

## Responsabilidades

### Pages (`src/pages/`)

**Función:**
- Definir rutas de la aplicación
- Consumir API del backend
- Renderizar HTML (SSG o SSR)
- Optimizar SEO

**Tipos de renderizado:**

| Página | Tipo | Razón |
|--------|------|-------|
| `/` | SSG | Contenido estático, optimización SEO |
| `/categoria/[slug]` | SSG | Categorías fijas, regeneración incremental |
| `/producto/[slug]` | SSG | Productos, regeneración incremental |
| `/carrito` | SSR | Contenido dinámico por usuario |
| `/checkout/*` | SSR | Requiere autenticación |
| `/perfil` | SSR | Datos privados del usuario |
| `/pedidos/*` | SSR | Historial de pedidos |

**Ejemplo de página SSG:**
```astro
---
// src/pages/index.astro
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/Hero.astro';
import ProductCard from '@/components/ProductCard.astro';
import { getProducts } from '@/services/products';

const featuredProducts = await getProducts({ featured: true });
---

<Layout title="NutreTerra - Productos Naturales">
  <Hero />
  <section class="container mx-auto py-12">
    <h2 class="text-3xl font-bold mb-8">Productos Destacados</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {featuredProducts.map(product => (
        <ProductCard product={product} />
      ))}
    </div>
  </section>
</Layout>
```

### Layouts (`src/layouts/`)

**Función:**
- Definir estructura HTML base
- Incluir meta tags para SEO
- Cargar estilos globales
- Proveer componentes comunes (header, footer)

**Layout.astro (principal):**
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Tienda online de productos naturales' } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

### Components (`src/components/`)

**Función:**
- Componentes reutilizables **sin interactividad**
- Renderizados en build time (SSG) o server-side (SSR)
- Optimizados para SEO

**Ejemplos:**
- `Header.astro` – Navegación principal
- `Footer.astro` – Pie de página
- `ProductCard.astro` – Tarjeta de producto
- `Breadcrumbs.astro` – Migas de pan
- `SEO.astro` – Meta tags dinámicos

### Islands (`src/islands/`)

**Función:**
- Componentes **interactivos** con React/Preact
- Hidratados en cliente
- Usados solo donde se necesita JavaScript

**Estrategias de carga:**
```tsx
// Cargar inmediatamente
<AddToCart client:load product={product} />

// Cargar cuando sea visible
<ProductFilters client:visible />

// Cargar cuando idle
<Newsletter client:idle />
```

**Ejemplos:**
- `CartIcon.tsx` – Contador de carrito en tiempo real
- `AddToCart.tsx` – Botón con estado y llamadas API
- `ProductFilters.tsx` – Filtros dinámicos
- `CheckoutForm.tsx` – Formulario de checkout
- `PaymentForm.tsx` – Integración con Stripe

**Ejemplo de Island:**
```tsx
// src/islands/AddToCart.tsx
import { useState } from 'react';
import { addItemToCart } from '@/services/cart';

interface Props {
  productId: string;
  productName: string;
}

export default function AddToCart({ productId, productName }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addItemToCart(productId, quantity);
      alert(`${productName} añadido al carrito`);
    } catch (error) {
      alert('Error al añadir al carrito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-20 border rounded px-2 py-1"
      />
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Añadiendo...' : 'Añadir al carrito'}
      </button>
    </div>
  );
}
```

### Services (`src/services/`)

**Función:**
- Abstracción de llamadas a la API del backend
- Tipado de requests y responses
- Manejo de errores

**api-client.ts (base):**
```typescript
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

**products.ts:**
```typescript
import type { Product } from '@/types';
import { apiClient } from './api-client';

export async function getProducts(params?: {
  featured?: boolean;
  categoryId?: string;
  page?: number;
}) {
  const query = new URLSearchParams(params as any).toString();
  return apiClient<Product[]>(`/products?${query}`);
}

export async function getProductBySlug(slug: string) {
  return apiClient<Product>(`/products/${slug}`);
}
```

### Styles (`src/styles/`)

**global.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700;
  }
}
```

## Configuración

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'hybrid', // Permite SSG y SSR
  server: {
    port: 4321,
  },
});
```

### tailwind.config.js

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
    },
  },
  plugins: [],
};
```

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"],
      "@/services/*": ["src/services/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## Variables de Entorno

Crear archivo `.env`:

```bash
PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Nota:** Variables con prefijo `PUBLIC_` son accesibles en cliente.

## Instalación de Dependencias

```bash
npm install
```

**Dependencias principales:**
```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/react": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

## Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

## Optimizaciones SEO

### Meta Tags Dinámicos

Componente `SEO.astro`:
```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

const { title, description, image, type = 'website' } = Astro.props;
const url = Astro.url;
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={url} />
  {image && <meta property="og:image" content={image} />}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {image && <meta name="twitter:image" content={image} />}
</head>
```

### Structured Data (JSON-LD)

```astro
---
// En página de producto
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.imageUrl,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "EUR",
    "availability": product.stock > 0 ? "InStock" : "OutOfStock"
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(productSchema)} />
```

## Deployment

### Build para Producción

```bash
npm run build
```

Genera carpeta `dist/` con archivos estáticos optimizados.

### Plataformas Recomendadas

- **Vercel** – Zero config
- **Netlify** – Fácil configuración
- **Cloudflare Pages** – CDN global

## Próximos Pasos

1. Implementar sistema de búsqueda
2. Añadir filtros avanzados de productos
3. Optimizar imágenes con `@astrojs/image`
4. Implementar dark mode
5. Añadir internacionalización (i18n)

## Soporte

Para dudas sobre Astro, consultar [documentación oficial](https://docs.astro.build/).
