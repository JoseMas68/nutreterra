# Backend – NutreTerra (Next.js)

## Descripción

Backend API de NutreTerra construido con Next.js (App Router), Prisma y PostgreSQL.

## Stack Tecnológico

- **Next.js (App Router)** – Framework y API REST
- **TypeScript** – Tipado estático
- **Prisma** – ORM para PostgreSQL
- **PostgreSQL** – Base de datos relacional
- **NextAuth.js** – Autenticación
- **Stripe/Redsys** – Procesamiento de pagos
- **Zod** – Validación de schemas

## Estructura de Carpetas

```
backend-next/
├── app/
│   ├── api/                    # Endpoints de la API
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts    # POST /api/auth/register
│   │   │   ├── login/
│   │   │   │   └── route.ts    # POST /api/auth/login
│   │   │   └── refresh/
│   │   │       └── route.ts    # POST /api/auth/refresh
│   │   │
│   │   ├── products/
│   │   │   ├── route.ts        # GET, POST /api/products
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET, PATCH, DELETE /api/products/:id
│   │   │
│   │   ├── categories/
│   │   │   ├── route.ts        # GET /api/categories
│   │   │   └── [slug]/
│   │   │       └── products/
│   │   │           └── route.ts # GET /api/categories/:slug/products
│   │   │
│   │   ├── cart/
│   │   │   ├── route.ts        # GET /api/cart
│   │   │   ├── items/
│   │   │   │   └── route.ts    # POST /api/cart/items
│   │   │   └── [itemId]/
│   │   │       └── route.ts    # PATCH, DELETE /api/cart/:itemId
│   │   │
│   │   ├── orders/
│   │   │   ├── route.ts        # GET, POST /api/orders
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET /api/orders/:id
│   │   │
│   │   ├── payments/
│   │   │   ├── create-intent/
│   │   │   │   └── route.ts    # POST /api/payments/create-intent
│   │   │   └── confirm/
│   │   │       └── route.ts    # POST /api/payments/confirm
│   │   │
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts    # POST /api/webhooks/stripe
│   │
│   ├── actions/                # Server actions personalizadas
│   │   ├── products.ts
│   │   └── orders.ts
│   │
│   └── middleware.ts           # Middleware global (autenticación, CORS)
│
├── lib/                        # Utilidades y configuración
│   ├── prisma.ts               # Cliente Prisma singleton
│   ├── auth.ts                 # Utilidades de autenticación (JWT, hash)
│   ├── stripe.ts               # Configuración de Stripe
│   └── validators/             # Schemas de validación Zod
│       ├── product.ts
│       ├── auth.ts
│       ├── cart.ts
│       └── order.ts
│
├── prisma/
│   ├── schema.prisma           # Modelo de datos
│   ├── migrations/             # Migraciones de base de datos
│   └── seed.ts                 # Datos iniciales
│
├── env.d.ts                    # Tipos de variables de entorno
├── next.config.js              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
├── package.json
└── README.md                   # Este archivo
```

## Responsabilidades

### API Routes (`app/api/`)

**Función:**
- Exponer endpoints REST
- Validar datos de entrada
- Gestionar autenticación y autorización
- Interactuar con la base de datos vía Prisma
- Retornar respuestas JSON

**Estructura de un endpoint:**

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProductSchema } from '@/lib/validators/product';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const products = await prisma.product.findMany({
      where: featured ? { featured: true, active: true } : { active: true },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}

// POST /api/products (requiere autenticación admin)
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación (middleware ya validó)
    const body = await request.json();

    // 2. Validar datos
    const result = createProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: result.error } },
        { status: 400 }
      );
    }

    // 3. Crear producto
    const product = await prisma.product.create({
      data: result.data,
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating product:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create product' } },
      { status: 500 }
    );
  }
}
```

### Middleware (`app/middleware.ts`)

**Función:**
- Autenticación con JWT
- Validación de roles (admin, user)
- CORS
- Rate limiting (opcional)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  // Rutas públicas
  const publicRoutes = ['/api/products', '/api/categories'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Rutas protegidas: verificar token
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json(
      { error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyToken(token);
    // Adjuntar userId al request (Next.js no soporta esto directamente, usar headers)
    response.headers.set('x-user-id', payload.userId);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Invalid token' } },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

### Library (`lib/`)

#### `prisma.ts` – Cliente Prisma

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### `auth.ts` – Autenticación

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
```

#### `stripe.ts` – Stripe

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
```

#### `validators/` – Schemas Zod

```typescript
// lib/validators/product.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url(),
  sku: z.string(),
});

export const updateProductSchema = createProductSchema.partial();
```

### Prisma (`prisma/`)

#### `schema.prisma` – Modelo de datos

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String
  role         Role      @default(USER)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  orders    Order[]
  cart      Cart?
  addresses Address[]

  @@index([email])
}

enum Role {
  USER
  ADMIN
}

model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  imageUrl    String?
  parentId    String?
  createdAt   DateTime @default(now())

  products Product[]
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  @@index([slug])
}

model Product {
  id               String   @id @default(uuid())
  name             String
  slug             String   @unique
  description      String
  shortDescription String?
  price            Decimal  @db.Decimal(10, 2)
  compareAtPrice   Decimal? @db.Decimal(10, 2)
  stock            Int
  sku              String   @unique
  weight           Decimal? @db.Decimal(10, 2)
  imageUrl         String
  images           String[]
  categoryId       String
  featured         Boolean  @default(false)
  active           Boolean  @default(true)
  nutritionalInfo  Json?
  ingredients      String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  category   Category     @relation(fields: [categoryId], references: [id])
  cartItems  CartItem[]
  orderItems OrderItem[]
  tags       ProductTag[]

  @@index([slug])
  @@index([sku])
  @@index([categoryId])
  @@index([featured, active])
}

model Tag {
  id   String @id @default(uuid())
  name String @unique
  slug String @unique

  products ProductTag[]
}

model ProductTag {
  productId String
  tagId     String

  product Product @relation(fields: [productId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])

  @@id([productId, tagId])
}

model Cart {
  id        String   @id @default(uuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User       @relation(fields: [userId], references: [id])
  items CartItem[]
}

model CartItem {
  id         String   @id @default(uuid())
  cartId     String
  productId  String
  quantity   Int
  priceAtAdd Decimal  @db.Decimal(10, 2)
  createdAt  DateTime @default(now())

  cart    Cart    @relation(fields: [cartId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}

model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique
  userId          String
  status          OrderStatus   @default(PENDING)
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingCost    Decimal       @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  shippingMethod  String
  paymentIntentId String?
  paymentStatus   PaymentStatus @default(PENDING)
  addressId       String
  trackingNumber  String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?

  user    User        @relation(fields: [userId], references: [id])
  address Address     @relation(fields: [addressId], references: [id])
  items   OrderItem[]

  @@index([orderNumber])
  @@index([userId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
}

model OrderItem {
  id              String  @id @default(uuid())
  orderId         String
  productId       String
  quantity        Int
  price           Decimal @db.Decimal(10, 2)
  total           Decimal @db.Decimal(10, 2)
  productSnapshot Json?

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([orderId])
}

model Address {
  id         String   @id @default(uuid())
  userId     String
  fullName   String
  street     String
  city       String
  postalCode String
  province   String
  country    String   @default("España")
  phone      String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())

  user   User    @relation(fields: [userId], references: [id])
  orders Order[]

  @@index([userId])
}
```

#### `seed.ts` – Datos iniciales

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Crear categorías
  const cereales = await prisma.category.create({
    data: { name: 'Cereales', slug: 'cereales' },
  });

  const legumbres = await prisma.category.create({
    data: { name: 'Legumbres', slug: 'legumbres' },
  });

  // Crear tags
  const vegano = await prisma.tag.create({
    data: { name: 'Vegano', slug: 'vegano' },
  });

  const sinGluten = await prisma.tag.create({
    data: { name: 'Sin Gluten', slug: 'sin-gluten' },
  });

  // Crear admin user
  const adminPassword = await hashPassword('admin123');
  await prisma.user.create({
    data: {
      email: 'admin@nutreterra.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Crear productos de ejemplo
  await prisma.product.create({
    data: {
      name: 'Avena Integral Ecológica',
      slug: 'avena-integral-ecologica',
      description: 'Avena 100% integral de cultivo ecológico.',
      price: 3.99,
      stock: 100,
      sku: 'AV001',
      imageUrl: '/images/products/avena.jpg',
      images: ['/images/products/avena.jpg'],
      categoryId: cereales.id,
      featured: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Variables de Entorno

Crear archivo `.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nutreterra_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:4321

# Node environment
NODE_ENV=development
```

## Instalación de Dependencias

```bash
npm install
```

**Dependencias principales:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "stripe": "^14.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

## Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

## Comandos Prisma

### Generar cliente Prisma
```bash
npm run prisma:generate
```

### Crear migración
```bash
npm run prisma:migrate
```

### Ver datos en navegador
```bash
npm run prisma:studio
```

### Poblar base de datos
```bash
npm run prisma:seed
```

## Endpoints Disponibles

### Autenticación (Público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login (retorna JWT) |
| POST | `/api/auth/refresh` | Renovar token |

### Productos (Público GET, Admin POST/PATCH/DELETE)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| POST | `/api/products` | Crear producto (admin) |
| GET | `/api/products/:id` | Detalle producto |
| PATCH | `/api/products/:id` | Actualizar producto (admin) |
| DELETE | `/api/products/:id` | Eliminar producto (admin) |

### Categorías (Público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:slug/products` | Productos por categoría |

### Carrito (Autenticado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cart` | Ver carrito |
| POST | `/api/cart/items` | Añadir item |
| PATCH | `/api/cart/:itemId` | Actualizar cantidad |
| DELETE | `/api/cart/:itemId` | Eliminar item |

### Pedidos (Autenticado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/orders` | Historial pedidos |
| POST | `/api/orders` | Crear pedido |
| GET | `/api/orders/:id` | Detalle pedido |

### Pagos (Autenticado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/payments/create-intent` | Crear intento de pago |
| POST | `/api/payments/confirm` | Confirmar pago |

### Webhooks (Público con verificación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Eventos de Stripe |

## Seguridad

### Password Hashing
```typescript
import bcrypt from 'bcrypt';

const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

### JWT Tokens
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
const payload = jwt.verify(token, JWT_SECRET);
```

### Validación con Zod
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(input);
if (!result.success) {
  // Manejar error
}
```

### Stripe Webhook Verification
```typescript
const signature = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
```

## Testing

### Unit Tests (Jest)
```bash
npm test
```

### API Tests (Supertest)
```typescript
import request from 'supertest';

describe('GET /api/products', () => {
  it('should return products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
  });
});
```

## Deployment

### Build para Producción
```bash
npm run build
npm start
```

### Plataformas Recomendadas
- **Vercel** – Zero config, ideal para Next.js
- **Railway** – Deploy fácil con PostgreSQL incluido
- **Render** – Alternativa gratuita

### Migración de Base de Datos en Producción
```bash
npx prisma migrate deploy
```

## Próximos Pasos

1. Implementar rate limiting
2. Añadir logs estructurados (Winston, Pino)
3. Implementar caché con Redis
4. Añadir tests de integración
5. Configurar CI/CD

## Soporte

Para dudas sobre Next.js, consultar [documentación oficial](https://nextjs.org/docs).
Para dudas sobre Prisma, consultar [documentación oficial](https://www.prisma.io/docs).
