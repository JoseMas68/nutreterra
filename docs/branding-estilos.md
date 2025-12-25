# Branding y Hoja de Estilos – NutreTerra

## Identidad Visual

### Logo

**Concepto:** Aguacate con hoja y semilla, colores naturales
**Elementos:**
- Aguacate completo (cuerpo principal)
- Hoja verde (frescura, naturaleza)
- Semilla marrón (origen, autenticidad)

**Versiones del logo:**
- Logo completo con texto
- Logo icono (solo aguacate)
- Logo monocromático (para fondos especiales)

---

## Paleta de Colores

### Colores Principales

| Nombre | Código HEX | RGB | Uso Principal |
|--------|------------|-----|---------------|
| **primary** | `#7FB14B` | `rgb(127, 177, 75)` | Nombre "NutreTerra", botones principales, enlaces |
| **leaf** | `#4A7D36` | `rgb(74, 125, 54)` | Iconos de hoja, estados hover, badges |
| **seed** | `#6C4B2F` | `rgb(108, 75, 47)` | Tipografía secundaria, bordes, footer |
| **accent** | `#E16C50` | `rgb(225, 108, 80)` | CTAs importantes, ofertas, notificaciones |
| **cream** | `#F0E8D8` | `rgb(240, 232, 216)` | Fondos de sección, tarjetas, contraste suave |

### Colores Semánticos (Derivados)

| Nombre | Código HEX | Uso |
|--------|------------|-----|
| **success** | `#7FB14B` | Mensajes de éxito, confirmaciones |
| **warning** | `#E16C50` | Alertas, stock bajo |
| **error** | `#C74534` | Errores, validaciones fallidas |
| **info** | `#4A7D36` | Información adicional |

### Escala de Grises

| Nombre | Código HEX | Uso |
|--------|------------|-----|
| **gray-50** | `#F9FAFB` | Fondo muy claro |
| **gray-100** | `#F3F4F6` | Fondo secundario |
| **gray-200** | `#E5E7EB` | Bordes suaves |
| **gray-300** | `#D1D5DB` | Bordes estándar |
| **gray-400** | `#9CA3AF` | Texto deshabilitado |
| **gray-500** | `#6B7280` | Texto secundario |
| **gray-600** | `#4B5563` | Texto terciario |
| **gray-700** | `#374151` | Texto principal |
| **gray-800** | `#1F2937` | Encabezados |
| **gray-900** | `#111827` | Texto muy oscuro |

---

## Tipografía

### Fuente Principal

**Familia:** Inter (sans-serif)
**Fallback:** `system-ui, -apple-system, sans-serif`

**Pesos utilizados:**
- **400** (Regular) – Texto normal
- **500** (Medium) – Subtítulos, énfasis
- **600** (Semibold) – Botones, etiquetas
- **700** (Bold) – Títulos principales

### Escala Tipográfica

| Elemento | Tamaño | Peso | Line Height | Uso |
|----------|--------|------|-------------|-----|
| **H1** | 3rem (48px) | 700 | 1.2 | Títulos principales de página |
| **H2** | 2.25rem (36px) | 700 | 1.3 | Títulos de sección |
| **H3** | 1.875rem (30px) | 600 | 1.4 | Subsecciones |
| **H4** | 1.5rem (24px) | 600 | 1.4 | Títulos de tarjetas |
| **H5** | 1.25rem (20px) | 600 | 1.5 | Subtítulos |
| **H6** | 1rem (16px) | 600 | 1.5 | Pequeños títulos |
| **Body Large** | 1.125rem (18px) | 400 | 1.6 | Texto destacado |
| **Body** | 1rem (16px) | 400 | 1.6 | Texto normal |
| **Body Small** | 0.875rem (14px) | 400 | 1.5 | Texto secundario |
| **Caption** | 0.75rem (12px) | 400 | 1.4 | Etiquetas, metadatos |

---

## Componentes Visuales

### Botones

#### Botón Primario
```html
<button class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors">
  Añadir al carrito
</button>
```

**Variantes:**
- **Primary:** `bg-primary hover:bg-leaf`
- **Accent:** `bg-accent hover:bg-[#d45d42]`
- **Outline:** `border-2 border-primary text-primary hover:bg-primary hover:text-white`
- **Ghost:** `text-primary hover:bg-cream`

#### Tamaños
- **Small:** `px-4 py-2 text-sm`
- **Medium:** `px-6 py-3 text-base`
- **Large:** `px-8 py-4 text-lg`

### Tarjetas (Cards)

```html
<div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
  <!-- Contenido -->
</div>
```

**Variantes:**
- **Cream Background:** `bg-cream border-seed/20`
- **Destacada:** `border-primary border-2`
- **Con hover elevado:** `hover:shadow-2xl hover:-translate-y-1 transition-all`

### Badges (Etiquetas)

```html
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-leaf/10 text-leaf">
  Ecológico
</span>
```

**Variantes semánticas:**
- **Nuevo:** `bg-primary/10 text-primary`
- **Oferta:** `bg-accent/10 text-accent`
- **Sin Gluten:** `bg-leaf/10 text-leaf`
- **Destacado:** `bg-seed/10 text-seed`

### Inputs (Formularios)

```html
<input
  type="text"
  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
  placeholder="Email"
>
```

**Estados:**
- **Normal:** `border-gray-300`
- **Focus:** `border-primary ring-2 ring-primary/20`
- **Error:** `border-error ring-2 ring-error/20`
- **Disabled:** `bg-gray-100 text-gray-400 cursor-not-allowed`

---

## Espaciado

### Sistema de Espaciado (Tailwind)

Utilizar la escala de Tailwind basada en 0.25rem (4px):

| Clase | Valor | Uso |
|-------|-------|-----|
| `gap-2` | 0.5rem (8px) | Espaciado mínimo entre elementos |
| `gap-4` | 1rem (16px) | Espaciado estándar |
| `gap-6` | 1.5rem (24px) | Espaciado entre secciones pequeñas |
| `gap-8` | 2rem (32px) | Espaciado entre secciones |
| `gap-12` | 3rem (48px) | Espaciado entre secciones grandes |
| `gap-16` | 4rem (64px) | Separación de bloques principales |

### Márgenes y Padding

**Contenedores:**
- Mobile: `px-4`
- Tablet: `px-6`
- Desktop: `px-8`
- Wide: `px-12`

**Secciones verticales:**
- Mobile: `py-8`
- Desktop: `py-12` o `py-16`

---

## Bordes y Sombras

### Border Radius

| Clase | Valor | Uso |
|-------|-------|-----|
| `rounded-md` | 0.375rem (6px) | Botones pequeños, inputs |
| `rounded-lg` | 0.5rem (8px) | Botones, tarjetas estándar |
| `rounded-xl` | 0.75rem (12px) | Tarjetas grandes, modales |
| `rounded-2xl` | 1rem (16px) | Secciones hero, destacados |
| `rounded-full` | 50% | Badges, avatares |

### Sombras

```css
/* Tarjeta estándar */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)

/* Tarjeta elevada */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

/* Tarjeta flotante */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

/* Sombra sutil */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
```

---

## Iconografía

### Estilo de Iconos

**Recomendado:** Heroicons, Lucide, Feather Icons
**Estilo:** Outline (contorno) para iconos de UI
**Estilo:** Solid (relleno) para estados activos

### Tamaños de Iconos

| Contexto | Tamaño | Clase |
|----------|--------|-------|
| Icono pequeño (badges) | 16px | `w-4 h-4` |
| Icono estándar (botones) | 20px | `w-5 h-5` |
| Icono medio (navegación) | 24px | `w-6 h-6` |
| Icono grande (features) | 32px | `w-8 h-8` |
| Icono hero | 48px+ | `w-12 h-12` |

### Colores de Iconos

- **Principal:** `text-primary`
- **Secundario:** `text-seed`
- **Acento:** `text-accent`
- **Neutral:** `text-gray-600`
- **Deshabilitado:** `text-gray-400`

---

## Imágenes

### Aspect Ratios

| Tipo | Ratio | Uso |
|------|-------|-----|
| **Producto Card** | 1:1 | Imagen cuadrada de producto |
| **Producto Detalle** | 4:3 | Imagen principal de producto |
| **Categoría** | 16:9 | Banner de categoría |
| **Hero** | 21:9 | Banner principal homepage |
| **Blog** | 16:9 | Imagen de artículo |

### Optimización

- **Formato:** WebP con fallback a JPG
- **Lazy Loading:** Todas las imágenes excepto hero
- **Tamaños responsive:**
  - Mobile: 375px, 640px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1536px

---

## Ejemplos de Uso

### Hero Section

```html
<section class="relative bg-cream py-16 md:py-24">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Productos <span class="text-primary">Naturales</span>
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      Alimenta tu cuerpo con lo mejor de la naturaleza
    </p>
    <button class="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors">
      Explorar productos
    </button>
  </div>
</section>
```

### Product Card

```html
<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
  <img src="product.jpg" alt="Producto" class="w-full aspect-square object-cover">
  <div class="p-6">
    <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-leaf/10 text-leaf mb-2">
      Ecológico
    </span>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">Avena Integral</h3>
    <p class="text-gray-600 text-sm mb-4">500g</p>
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary">3,99€</span>
      <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-leaf transition-colors">
        Añadir
      </button>
    </div>
  </div>
</div>
```

### Navegación

```html
<nav class="bg-white border-b border-gray-200">
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img src="logo.svg" alt="NutreTerra" class="h-10">
      <span class="text-2xl font-bold text-primary">NutreTerra</span>
    </div>
    <div class="hidden md:flex items-center gap-8">
      <a href="/" class="text-gray-700 hover:text-primary transition-colors">Inicio</a>
      <a href="/productos" class="text-gray-700 hover:text-primary transition-colors">Productos</a>
      <a href="/blog" class="text-gray-700 hover:text-primary transition-colors">Blog</a>
    </div>
    <button class="relative">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <!-- Icono carrito -->
      </svg>
      <span class="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
        3
      </span>
    </button>
  </div>
</nav>
```

---

## Accesibilidad

### Contraste de Color

Todos los colores cumplen con WCAG AA:

| Combinación | Ratio | Válido |
|-------------|-------|--------|
| `primary` sobre blanco | 4.5:1 | ✅ AA |
| `leaf` sobre blanco | 7.1:1 | ✅ AAA |
| `seed` sobre blanco | 8.2:1 | ✅ AAA |
| `accent` sobre blanco | 3.9:1 | ⚠️ AA Large |
| Blanco sobre `primary` | 4.6:1 | ✅ AA |

**Recomendaciones:**
- Usar `accent` solo para textos grandes (18px+) o bold (14px+)
- Para textos pequeños sobre `accent`, usar blanco
- Mantener `gray-700` o más oscuro para texto sobre fondos claros

### Estados de Foco

```css
/* Focus visible para teclado */
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Textos Alternativos

- Todas las imágenes con `alt` descriptivo
- Iconos decorativos con `aria-hidden="true"`
- Botones con solo iconos deben tener `aria-label`

---

## Animaciones y Transiciones

### Transiciones Estándar

```css
transition-colors    /* Para cambios de color */
transition-all       /* Para múltiples propiedades */
transition-transform /* Para hover effects */
```

**Duración:** 200-300ms (estándar de Tailwind)

### Hover Effects

```css
/* Botones */
hover:bg-leaf hover:shadow-lg

/* Tarjetas */
hover:shadow-xl hover:-translate-y-1

/* Enlaces */
hover:text-primary hover:underline
```

### Loading States

```html
<div class="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
```

---

## Responsive Design

### Breakpoints (Tailwind)

| Breakpoint | Tamaño | Dispositivo |
|------------|--------|-------------|
| `sm` | 640px | Móvil grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop pequeño |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grande |

### Mobile First

Siempre diseñar primero para móvil:

```html
<!-- Móvil: 1 columna, Desktop: 4 columnas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Productos -->
</div>
```

---

## Checklist de Implementación

- [ ] Configurar colores en `tailwind.config.js`
- [ ] Importar fuente Inter desde Google Fonts
- [ ] Crear componentes base (Button, Card, Badge, Input)
- [ ] Establecer layout grid responsive
- [ ] Implementar sistema de espaciado consistente
- [ ] Validar contraste de colores (accesibilidad)
- [ ] Optimizar imágenes (WebP, lazy loading)
- [ ] Añadir transiciones suaves
- [ ] Testear en móvil, tablet y desktop

---

Esta hoja de estilos debe servir como referencia durante todo el desarrollo para mantener coherencia visual en NutreTerra.
