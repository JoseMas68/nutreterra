# Convenciones de Código – NutreTerra

## Objetivo

Mantener consistencia, legibilidad y calidad del código en todo el proyecto.

---

## 1. Estructura de Archivos

### Nomenclatura

**Archivos de componentes (Frontend):**
- PascalCase para componentes: `ProductCard.astro`, `Header.tsx`
- kebab-case para páginas: `index.astro`, `categoria-slug.astro`

**Archivos de backend:**
- kebab-case para rutas API: `products.ts`, `auth-login.ts`
- camelCase para funciones y utils: `validateProduct.ts`, `sendEmail.ts`

**Carpetas:**
- kebab-case: `cart-items/`, `user-profile/`

**Ejemplo estructura:**
```
src/
├── components/
│   ├── ProductCard.astro
│   └── CartIcon.tsx
├── pages/
│   ├── index.astro
│   └── producto/
│       └── [slug].astro
└── services/
    ├── api-client.ts
    └── cart-service.ts
```

---

## 2. TypeScript

### Tipos vs Interfaces

**Usar `interface` para:**
- Definir estructuras de objetos
- Aprovechar extensión (extends)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

**Usar `type` para:**
- Uniones y tipos complejos
- Aliases de tipos primitivos

```typescript
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';
type ApiResponse<T> = { data: T } | { error: string };
```

### Tipado Estricto

**Siempre tipar:**
- Parámetros de funciones
- Valores de retorno
- Props de componentes

```typescript
// ✅ Correcto
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ❌ Incorrecto
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

### Evitar `any`

```typescript
// ❌ Evitar
const data: any = await fetch('/api/products');

// ✅ Usar tipos específicos
const data: Product[] = await fetch('/api/products').then(r => r.json());

// ✅ O usar unknown si el tipo es realmente desconocido
const data: unknown = await fetch('/api/products').then(r => r.json());
if (isProductArray(data)) {
  // Type guard
}
```

---

## 3. Nomenclatura de Variables y Funciones

### Variables

**camelCase para variables y constantes locales:**
```typescript
const userId = '123';
const cartItems = [];
```

**UPPER_SNAKE_CASE para constantes globales:**
```typescript
// shared/constants/index.ts
export const FREE_SHIPPING_THRESHOLD = 50;
export const MAX_CART_ITEMS = 99;
```

### Funciones

**camelCase y verbos descriptivos:**
```typescript
// ✅ Correcto
function getProductById(id: string) { }
function validateEmail(email: string) { }
async function fetchUserOrders(userId: string) { }

// ❌ Incorrecto
function product(id: string) { }
function check(email: string) { }
```

**Prefijos comunes:**
- `get` – Obtener datos
- `fetch` – Obtener datos asíncronos (API)
- `create` / `update` / `delete` – Operaciones CRUD
- `validate` – Validaciones
- `calculate` – Cálculos
- `is` / `has` – Funciones booleanas

```typescript
function isValidEmail(email: string): boolean { }
function hasActiveSubscription(user: User): boolean { }
```

---

## 4. Componentes (Astro y React)

### Estructura de Componente Astro

```astro
---
// 1. Imports
import Layout from '@/layouts/Layout.astro';
import ProductCard from '@/components/ProductCard.astro';

// 2. Props interface
interface Props {
  title: string;
  products: Product[];
}

// 3. Props destructuring
const { title, products } = Astro.props;

// 4. Lógica del componente
const featuredProducts = products.filter(p => p.featured);
---

<!-- 5. Template -->
<Layout title={title}>
  <h1>{title}</h1>
  <div class="grid">
    {featuredProducts.map(product => (
      <ProductCard product={product} />
    ))}
  </div>
</Layout>

<!-- 6. Estilos (si es necesario) -->
<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
```

### Estructura de Componente React (Islands)

```tsx
// 1. Imports
import { useState, useEffect } from 'react';
import type { Product } from '@/types';

// 2. Props interface
interface CartIconProps {
  initialCount?: number;
}

// 3. Componente
export default function CartIcon({ initialCount = 0 }: CartIconProps) {
  // 4. State
  const [count, setCount] = useState(initialCount);

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return (
    <button onClick={handleClick} className="cart-icon">
      🛒 {count}
    </button>
  );
}
```

### Props

**Siempre tipar props:**
```typescript
// ✅ Correcto
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

// ❌ Incorrecto (sin tipos)
function ProductCard({ product, onAddToCart }) {
  // ...
}
```

---

## 5. CSS y TailwindCSS

### Uso de Tailwind

**Preferir Tailwind para estilos utilitarios:**
```astro
<div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 class="text-xl font-bold text-gray-900">Título</h2>
</div>
```

**Usar CSS custom solo para:**
- Animaciones complejas
- Estilos muy específicos
- Reutilización mediante clases semánticas

### Orden de clases Tailwind

**Orden recomendado:**
1. Layout (flex, grid, block)
2. Positioning (relative, absolute)
3. Sizing (w-, h-)
4. Spacing (m-, p-)
5. Typography (text-, font-)
6. Visual (bg-, border-, shadow-)
7. States (hover:, focus:)

```html
<!-- ✅ Orden consistente -->
<button class="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
  Comprar
</button>
```

### Nombres de clases custom

**kebab-case:**
```css
.product-card {
  /* ... */
}

.cart-item-quantity {
  /* ... */
}
```

---

## 6. API y Endpoints

### Nomenclatura de Rutas

**REST convencional:**
```
GET    /api/products              # Listar
POST   /api/products              # Crear
GET    /api/products/:id          # Detalle
PATCH  /api/products/:id          # Actualizar
DELETE /api/products/:id          # Eliminar

GET    /api/categories/:slug/products
POST   /api/cart/items
```

### Estructura de Response

**Siempre retornar JSON consistente:**

```typescript
// ✅ Éxito
{
  "data": [...],
  "meta": {
    "page": 1,
    "totalPages": 10
  }
}

// ✅ Error
{
  "error": {
    "message": "Product not found",
    "code": "PRODUCT_NOT_FOUND",
    "status": 404
  }
}
```

### HTTP Status Codes

- `200` – OK (GET, PATCH exitosos)
- `201` – Created (POST exitoso)
- `204` – No Content (DELETE exitoso)
- `400` – Bad Request (validación fallida)
- `401` – Unauthorized (no autenticado)
- `403` – Forbidden (sin permisos)
- `404` – Not Found (recurso no existe)
- `500` – Internal Server Error (error del servidor)

### Validación con Zod

```typescript
import { z } from 'zod';

// Schema compartido (shared/schemas/)
export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
});

// Uso en endpoint
export async function POST(request: Request) {
  const body = await request.json();

  // Validar
  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: { message: 'Validation failed', details: result.error } },
      { status: 400 }
    );
  }

  // Continuar con datos validados
  const product = await prisma.product.create({
    data: result.data
  });

  return NextResponse.json({ data: product }, { status: 201 });
}
```

---

## 7. Gestión de Errores

### Try-Catch

**Siempre manejar errores en endpoints:**
```typescript
export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch products', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}
```

### Logs

**Usar console.error para errores:**
```typescript
console.error('[API] Failed to create order:', error);
```

**Formato de logs:**
```
[CONTEXTO] Mensaje: detalles
```

Ejemplos:
- `[AUTH] User login failed: invalid credentials`
- `[PAYMENT] Stripe webhook failed: invalid signature`

---

## 8. Imports y Exports

### Orden de Imports

1. Externos (React, Astro, etc.)
2. Internos (aliased con @/)
3. Relativos (./, ../)
4. Tipos (import type)
5. Estilos

```typescript
// 1. Externos
import { useState } from 'react';
import { z } from 'zod';

// 2. Internos
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api-client';

// 3. Relativos
import { calculateTotal } from './utils';

// 4. Tipos
import type { Product } from '@/types';

// 5. Estilos
import './styles.css';
```

### Path Aliases

**Configurar en tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/services/*": ["./src/services/*"]
    }
  }
}
```

**Usar:**
```typescript
// ✅ Con alias
import { ProductCard } from '@/components/ProductCard';

// ❌ Sin alias (evitar rutas largas)
import { ProductCard } from '../../../components/ProductCard';
```

### Named Exports vs Default Exports

**Preferir named exports:**
```typescript
// ✅ Named export
export function calculateTotal() { }
export const API_URL = 'https://api.nutreterra.com';

// Importar
import { calculateTotal, API_URL } from './utils';
```

**Usar default export solo para:**
- Componentes principales de página
- Layouts

```typescript
// Layout.astro
export default Layout;
```

---

## 9. Comentarios y Documentación

### Comentarios en Código

**Evitar comentarios obvios:**
```typescript
// ❌ Comentario innecesario
// Incrementar contador
count++;

// ✅ Comentario útil
// Stripe requires amounts in cents, so we multiply by 100
const amountInCents = total * 100;
```

### JSDoc para Funciones Públicas

```typescript
/**
 * Calcula el total del carrito incluyendo costes de envío
 * @param items - Items del carrito
 * @param shippingMethod - Método de envío seleccionado
 * @returns Total en euros
 */
export function calculateCartTotal(
  items: CartItem[],
  shippingMethod: ShippingMethod
): number {
  // ...
}
```

### TODOs

**Formato:**
```typescript
// TODO: Implementar caché de productos
// FIXME: Validación de stock insuficiente
// HACK: Workaround temporal para bug de Stripe, revisar en v2
```

---

## 10. Git y Commits

### Formato de Commits

**Conventional Commits:**
```
<tipo>(<scope>): <mensaje>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat` – Nueva funcionalidad
- `fix` – Corrección de bug
- `docs` – Documentación
- `style` – Formato, no afecta lógica
- `refactor` – Refactorización
- `test` – Añadir tests
- `chore` – Tareas de mantenimiento

**Ejemplos:**
```
feat(cart): add remove item functionality
fix(checkout): validate stock before creating order
docs(readme): update installation instructions
refactor(api): extract validation logic to separate file
```

### Ramas

**Nomenclatura:**
```
feature/nombre-funcionalidad
fix/nombre-bug
refactor/nombre-refactor
```

**Ejemplos:**
```
feature/add-product-filters
fix/cart-total-calculation
refactor/prisma-queries
```

### Pull Requests

**Título:**
- Descriptivo y conciso
- Incluir tipo (feat, fix, etc.)

**Descripción:**
- Qué se implementó
- Por qué se hizo
- Cómo se probó

**Template:**
```markdown
## Descripción
Implementa sistema de filtros de productos por precio y etiquetas.

## Cambios
- Añadir componente FilterPanel
- Crear endpoint GET /api/products con query params
- Actualizar página de categorías

## Testing
- [ ] Filtros funcionan correctamente
- [ ] URL se actualiza con query params
- [ ] Mobile responsive
```

---

## 11. Testing

### Nomenclatura de Tests

```typescript
// product.test.ts

describe('Product', () => {
  describe('calculateDiscount', () => {
    it('should return 20% discount for prices above 50€', () => {
      // ...
    });

    it('should return 0 discount for prices below 50€', () => {
      // ...
    });
  });
});
```

### Estructura AAA (Arrange-Act-Assert)

```typescript
it('should add item to cart', async () => {
  // Arrange
  const cart = createEmptyCart();
  const product = createTestProduct();

  // Act
  await addItemToCart(cart.id, product.id, 2);

  // Assert
  const updatedCart = await getCart(cart.id);
  expect(updatedCart.items).toHaveLength(1);
  expect(updatedCart.items[0].quantity).toBe(2);
});
```

---

## 12. Performance

### Optimizaciones Generales

**Lazy loading de imágenes:**
```astro
<img src={product.imageUrl} alt={product.name} loading="lazy" />
```

**Evitar re-renders innecesarios:**
```tsx
// React: Usar memo para componentes pesados
export default memo(function ProductCard({ product }: Props) {
  // ...
});
```

**Paginar queries grandes:**
```typescript
// ✅ Con paginación
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// ❌ Sin paginación
const products = await prisma.product.findMany(); // Puede retornar miles
```

---

## 13. Seguridad

### Sanitización de Inputs

**Nunca confiar en input del usuario:**
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100),
});

const result = schema.safeParse(userInput);
```

### Variables de Entorno

**Nunca hardcodear secretos:**
```typescript
// ❌ Incorrecto
const stripeKey = 'sk_live_abc123';

// ✅ Correcto
const stripeKey = process.env.STRIPE_SECRET_KEY!;
```

**Archivo .env.example:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/nutreterra
STRIPE_SECRET_KEY=sk_test_...
NEXTAUTH_SECRET=generate_random_secret
```

---

## 14. Accesibilidad

### HTML Semántico

```html
<!-- ✅ Correcto -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ❌ Incorrecto -->
<div class="nav">
  <div class="item">
    <div onclick="navigate('/')">Home</div>
  </div>
</div>
```

### ARIA Labels

```html
<button aria-label="Añadir al carrito">
  🛒
</button>

<img src="product.jpg" alt="Avena integral ecológica 500g" />
```

---

## Resumen

- **TypeScript estricto** en todo el proyecto
- **Validación con Zod** en backend y frontend
- **Conventional Commits** para git
- **Named exports** por defecto
- **Tailwind** para estilos utilitarios
- **Comentarios útiles**, no obvios
- **Seguridad first**: sanitizar inputs, usar env vars
- **Performance**: lazy loading, paginación, memoización

---

Este documento es vivo y debe actualizarse conforme el proyecto evoluciona.
