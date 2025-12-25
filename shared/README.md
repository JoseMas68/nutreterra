# Shared – Código Compartido

## Descripción

Código compartido entre frontend (Astro) y backend (Next.js) para evitar duplicación y mantener consistencia.

## Estructura

```
shared/
├── types/              # Tipos TypeScript compartidos
│   ├── product.ts
│   ├── category.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── user.ts
│   └── index.ts
│
├── constants/          # Constantes globales
│   ├── shipping.ts
│   ├── order-status.ts
│   └── index.ts
│
├── schemas/            # Schemas de validación Zod
│   ├── product.ts
│   ├── auth.ts
│   ├── cart.ts
│   ├── order.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md           # Este archivo
```

## Contenido

### Types (`types/`)

**Función:**
- Definir interfaces y tipos TypeScript
- Compartir estructuras de datos entre frontend y backend
- Garantizar type-safety en toda la aplicación

**Ejemplo:**

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  imageUrl: string;
  images: string[];
  category: Category;
  featured: boolean;
  active: boolean;
  nutritionalInfo?: NutritionalInfo;
  ingredients?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  createdAt: Date;
}

// types/cart.ts
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  priceAtAdd: number;
  createdAt: Date;
}

// types/order.ts
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentIntentId?: string;
  paymentStatus: PaymentStatus;
  address: Address;
  items: OrderItem[];
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  productSnapshot?: any;
}

// types/user.ts
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
}

// types/index.ts
export * from './product';
export * from './category';
export * from './cart';
export * from './order';
export * from './user';
```

### Constants (`constants/`)

**Función:**
- Centralizar valores constantes
- Evitar "magic numbers" en el código
- Facilitar cambios globales

**Ejemplo:**

```typescript
// constants/shipping.ts
export const SHIPPING_METHODS = {
  STANDARD: {
    id: 'standard',
    name: 'Envío Estándar',
    description: '3-5 días laborables',
    cost: 4.99,
  },
  EXPRESS: {
    id: 'express',
    name: 'Envío Express',
    description: '24-48 horas',
    cost: 9.99,
  },
} as const;

export const FREE_SHIPPING_THRESHOLD = 50;

// constants/order-status.ts
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  SUCCEEDED: 'Exitoso',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
};

// constants/index.ts
export * from './shipping';
export * from './order-status';

// Otras constantes útiles
export const MAX_CART_ITEMS = 99;
export const MIN_ORDER_AMOUNT = 5;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PRODUCT_IMAGES = 5;
```

### Schemas (`schemas/`)

**Función:**
- Validación de datos con Zod
- Reutilizar lógica de validación entre frontend y backend
- Garantizar consistencia en validaciones

**Ejemplo:**

```typescript
// schemas/product.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  shortDescription: z.string().max(200).optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  categoryId: z.string().uuid('ID de categoría inválido'),
  imageUrl: z.string().url('URL de imagen inválida'),
  images: z.array(z.string().url()).max(5),
  sku: z.string().min(3),
  weight: z.number().positive().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  nutritionalInfo: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    fiber: z.number().min(0),
  }).optional(),
  ingredients: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  featured: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

// schemas/auth.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

// schemas/cart.ts
import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0').max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(99),
});

// schemas/order.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingMethod: z.enum(['standard', 'express']),
  addressId: z.string().uuid(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  street: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().regex(/^\d{5}$/, 'Código postal inválido'),
  province: z.string().min(2),
  country: z.string().default('España'),
  phone: z.string().regex(/^[0-9]{9}$/, 'Teléfono inválido'),
  isDefault: z.boolean().optional(),
});

// schemas/index.ts
export * from './product';
export * from './auth';
export * from './cart';
export * from './order';
```

## Uso en Frontend (Astro)

### Importar tipos

```typescript
// src/pages/producto/[slug].astro
---
import type { Product } from '@shared/types';
import { getProductBySlug } from '@/services/products';

const { slug } = Astro.params;
const product: Product = await getProductBySlug(slug);
---

<h1>{product.name}</h1>
<p>{product.description}</p>
```

### Usar constantes

```typescript
// src/components/CartSummary.astro
---
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from '@shared/constants';

const subtotal = calculateSubtotal(items);
const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
  ? 0
  : SHIPPING_METHODS.STANDARD.cost;
---
```

### Validar formularios

```typescript
// src/islands/CheckoutForm.tsx
import { addressSchema } from '@shared/schemas';

const handleSubmit = (formData: FormData) => {
  const data = Object.fromEntries(formData);

  const result = addressSchema.safeParse(data);

  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors);
    return;
  }

  // Enviar datos validados
  await submitAddress(result.data);
};
```

## Uso en Backend (Next.js)

### Importar tipos

```typescript
// app/api/products/route.ts
import type { Product } from '@shared/types';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const products: Product[] = await prisma.product.findMany({
    include: { category: true },
  });

  return NextResponse.json({ data: products });
}
```

### Usar constantes

```typescript
// app/api/orders/route.ts
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from '@shared/constants';

const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
  ? 0
  : SHIPPING_METHODS[shippingMethod].cost;

const total = subtotal + shippingCost;
```

### Validar requests

```typescript
// app/api/products/route.ts
import { createProductSchema } from '@shared/schemas';

export async function POST(request: Request) {
  const body = await request.json();

  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: { message: 'Validation failed', details: result.error } },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: result.data,
  });

  return NextResponse.json({ data: product }, { status: 201 });
}
```

## Configuración

### package.json

```json
{
  "name": "@nutreterra/shared",
  "version": "0.1.0",
  "type": "module",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    "./types": "./types/index.ts",
    "./constants": "./constants/index.ts",
    "./schemas": "./schemas/index.ts"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Path Aliases

### En Frontend (Astro)

```json
// frontend-astro/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

### En Backend (Next.js)

```json
// backend-next/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

## Ventajas

1. **DRY (Don't Repeat Yourself)**: Código escrito una sola vez
2. **Type-Safety**: Tipos compartidos garantizan consistencia
3. **Validación Unificada**: Mismos schemas en frontend y backend
4. **Mantenibilidad**: Cambios en un solo lugar
5. **Consistencia**: Mismos valores constantes en toda la app

## Buenas Prácticas

### 1. Mantener Tipos Sincronizados con Prisma

```typescript
// Generar tipos desde Prisma
import type { Product as PrismaProduct } from '@prisma/client';

// Extender o adaptar según necesidad
export type Product = Omit<PrismaProduct, 'categoryId'> & {
  category: Category;
};
```

### 2. Exportar Todo desde index.ts

```typescript
// types/index.ts
export * from './product';
export * from './category';
export * from './cart';
export * from './order';
export * from './user';
```

### 3. Documentar Schemas

```typescript
export const createProductSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  // ...
});
```

### 4. Versionar Cambios

- Cambios en schemas pueden romper compatibilidad
- Usar semantic versioning
- Documentar breaking changes

## Próximos Pasos

1. Añadir utilidades compartidas (formateo, validaciones custom)
2. Implementar tests para schemas
3. Generar tipos automáticamente desde Prisma
4. Añadir helpers para transformación de datos

## Instalación

```bash
cd shared
npm install
```

## Build (Opcional)

Si se quiere publicar como paquete npm interno:

```bash
npm run build
```

Esto generará la carpeta `dist/` con los archivos compilados.
