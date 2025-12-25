# Public Assets – NutreTerra

Esta carpeta contiene todos los archivos estáticos que se servirán directamente.

## Estructura

```
public/
├── logo.svg                 # Logo principal de NutreTerra
├── favicon.svg              # Favicon del sitio
│
├── images/                  # Imágenes del sitio
│   ├── products/            # Imágenes de productos
│   ├── categories/          # Imágenes de categorías
│   └── blog/                # Imágenes de artículos de blog
│
└── icons/                   # Iconos personalizados
```

## Logo

### logo.svg
- **Uso:** Header, footer, páginas de marca
- **Formato:** SVG (escalable)
- **Colores:** Paleta corporativa (#7FB14B, #4A7D36, #6C4B2F)
- **Descripción:** Aguacate con hoja y semilla

**NOTA:** Este es un placeholder. Reemplazar con el logo oficial de diseño.

### favicon.svg
- **Uso:** Icono del navegador (pestaña)
- **Tamaño:** 32x32px
- **Formato:** SVG

**Generar también formatos adicionales:**
```bash
# Generar favicon.ico desde favicon.svg
# Generar apple-touch-icon.png (180x180)
# Generar manifest icons (192x192, 512x512)
```

## Imágenes de Productos

### Ubicación
`images/products/`

### Nomenclatura
```
{sku}-{variante}.{formato}

Ejemplos:
AV001-main.webp          # Imagen principal
AV001-detail-1.webp      # Detalle 1
AV001-detail-2.webp      # Detalle 2
```

### Especificaciones
- **Formato:** WebP (con fallback JPG)
- **Aspect Ratio:** 1:1 (cuadrada)
- **Tamaños:**
  - Thumbnail: 300x300px
  - Card: 600x600px
  - Detalle: 1200x1200px
- **Optimización:** Compresión 80-85%
- **Fondo:** Blanco o transparente

### Ejemplo de uso en código
```astro
<img
  src={`/images/products/${product.sku}-main.webp`}
  alt={product.name}
  width="600"
  height="600"
  loading="lazy"
>
```

## Imágenes de Categorías

### Ubicación
`images/categories/`

### Nomenclatura
```
{slug}.{formato}

Ejemplos:
cereales.webp
legumbres.webp
frutos-secos.webp
```

### Especificaciones
- **Formato:** WebP (con fallback JPG)
- **Aspect Ratio:** 16:9
- **Tamaños:**
  - Card: 800x450px
  - Hero: 1920x1080px
- **Optimización:** Compresión 80-85%

## Imágenes de Blog

### Ubicación
`images/blog/`

### Nomenclatura
```
{article-slug}.{formato}

Ejemplo:
beneficios-avena-integral.webp
```

### Especificaciones
- **Formato:** WebP (con fallback JPG)
- **Aspect Ratio:** 16:9
- **Tamaño:** 1200x675px
- **Optimización:** Compresión 80-85%

## Iconos Personalizados

### Ubicación
`icons/`

### Uso
Iconos SVG personalizados que no están en librerías externas.

**Preferir usar:** Heroicons, Lucide, Feather Icons via CDN o paquete npm.

Solo añadir iconos custom aquí si son específicos de la marca.

## Optimización de Imágenes

### Herramientas Recomendadas

**Para WebP:**
```bash
# Instalar cwebp (Google)
cwebp -q 85 input.jpg -o output.webp
```

**Para batch processing:**
```bash
# Sharp (Node.js)
npm install sharp

# Script de ejemplo
const sharp = require('sharp');

sharp('input.jpg')
  .resize(600, 600)
  .webp({ quality: 85 })
  .toFile('output.webp');
```

**Online:**
- Squoosh.app (Google)
- TinyPNG
- ImageOptim

### Astro Image Optimization

Astro incluye optimización automática de imágenes:

```astro
---
import { Image } from 'astro:assets';
import productImage from '../assets/product.jpg';
---

<Image
  src={productImage}
  alt="Producto"
  width={600}
  height={600}
  format="webp"
/>
```

## CDN (Producción)

En producción, considerar usar un CDN para servir assets:

- **Cloudflare Images**
- **Cloudinary**
- **imgix**

Beneficios:
- Transformación on-the-fly
- Compresión automática
- Lazy loading
- Responsive images

## Checklist de Assets

### Antes de lanzar:
- [ ] Reemplazar logo.svg con diseño final
- [ ] Generar todos los formatos de favicon
- [ ] Añadir imágenes de productos (mínimo 5-10)
- [ ] Añadir imágenes de categorías
- [ ] Optimizar todas las imágenes (WebP)
- [ ] Configurar CDN (opcional pero recomendado)
- [ ] Añadir manifest.json para PWA
- [ ] Generar sitemap.xml

## Manifest.json (PWA)

Crear `public/manifest.json`:

```json
{
  "name": "NutreTerra",
  "short_name": "NutreTerra",
  "description": "Tienda online de productos naturales",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F0E8D8",
  "theme_color": "#7FB14B",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Robots.txt

Crear `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://nutreterra.com/sitemap.xml
```

---

**IMPORTANTE:** Nunca subir a Git imágenes muy pesadas (>500KB). Usar Git LFS si es necesario.
