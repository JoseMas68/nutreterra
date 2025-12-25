# Arquitectura del Sistema NutreTerra

## Visión General

NutreTerra utiliza una arquitectura desacoplada con separación clara entre frontend y backend, comunicándose mediante API REST.

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Astro)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │ Layouts  │  │Components│  │ Islands  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                        │                                     │
│                        │ Consume API REST                    │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Next.js)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (App Router)                  │  │
│  │  /api/auth  /api/products  /api/cart  /api/orders    │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              Lógica de Negocio                        │  │
│  │  • Validación (Zod)                                   │  │
│  │  • Autenticación (NextAuth)                           │  │
│  │  • Pagos (Stripe/Redsys)                              │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              Prisma ORM                               │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL                                 │
│  Tables: users, products, categories, orders, cart_items    │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Frontend – Astro

**Responsabilidades:**
- Renderizar páginas estáticas y dinámicas
- Optimizar SEO (meta tags, sitemaps, URLs)
- Gestionar experiencia de usuario
- Consumir API del backend

**Características técnicas:**
- **SSG (Static Site Generation)**: Páginas de productos, categorías, blog
- **SSR (Server-Side Rendering)**: Checkout, perfil de usuario
- **Islands Architecture**: Componentes React/Preact solo donde se necesita interactividad
- **Optimización de assets**: Compresión de imágenes, lazy loading

**Flujo de datos:**
1. Usuario solicita página
2. Astro renderiza HTML (SSG o SSR)
3. Componentes Islands hidratan en cliente si es necesario
4. Islands consumen API del backend vía fetch

### 2. Backend – Next.js

**Responsabilidades:**
- Exponer API REST
- Gestionar autenticación y autorización
- Procesar pagos
- Validar datos de entrada
- Gestionar base de datos vía Prisma

**Estructura de API:**

```
/api/
├── auth/
│   ├── register       POST   – Registro de usuarios
│   ├── login          POST   – Login (retorna token)
│   └── refresh        POST   – Renovar token
├── products/
│   ├── GET            –       Listar productos (público)
│   ├── POST           –       Crear producto (admin)
│   ├── [id]/
│   │   ├── GET        –       Detalle producto (público)
│   │   ├── PATCH      –       Actualizar producto (admin)
│   │   └── DELETE     –       Eliminar producto (admin)
├── categories/
│   ├── GET            –       Listar categorías (público)
│   └── [id]/
│       └── GET        –       Productos por categoría (público)
├── cart/
│   ├── GET            –       Ver carrito (autenticado)
│   ├── POST           –       Añadir item (autenticado)
│   └── [id]/DELETE    –       Eliminar item (autenticado)
├── orders/
│   ├── GET            –       Historial pedidos (autenticado)
│   ├── POST           –       Crear pedido (autenticado)
│   └── [id]/
│       └── GET        –       Detalle pedido (autenticado)
├── payments/
│   ├── create-intent  POST   – Crear intento de pago
│   └── confirm        POST   – Confirmar pago
└── webhooks/
    └── stripe         POST   – Eventos de Stripe
```

**Middleware:**
- Autenticación JWT en rutas protegidas
- Validación de roles (user, admin)
- Rate limiting
- CORS configurado para frontend

### 3. Shared

**Responsabilidades:**
- Compartir tipos TypeScript entre frontend y backend
- Definir schemas de validación reutilizables
- Centralizar constantes

**Contenido:**

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  stock: number;
}

// schemas/product.schema.ts
export const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  // ...
});

// constants/index.ts
export const SHIPPING_COST = 4.99;
export const FREE_SHIPPING_THRESHOLD = 50;
```

## Flujos de Datos

### Flujo de Consulta de Productos

1. Usuario visita `/productos`
2. Astro genera página estática (build time) o SSR
3. Astro hace fetch a `GET /api/products`
4. Backend consulta Prisma → PostgreSQL
5. Backend retorna JSON
6. Astro renderiza HTML con datos

### Flujo de Autenticación

1. Usuario envía credenciales desde frontend
2. Frontend POST a `/api/auth/login`
3. Backend valida con NextAuth
4. Backend retorna JWT
5. Frontend guarda token (localStorage/cookie)
6. Siguientes peticiones incluyen token en header

### Flujo de Compra

1. Usuario añade productos al carrito (POST `/api/cart`)
2. Usuario va a checkout
3. Frontend crea intento de pago (POST `/api/payments/create-intent`)
4. Backend crea PaymentIntent en Stripe
5. Frontend muestra formulario de pago (Stripe Elements)
6. Usuario confirma pago
7. Stripe envía webhook a `/api/webhooks/stripe`
8. Backend verifica evento y crea pedido
9. Backend actualiza stock de productos

## Seguridad

### Frontend
- Validación de formularios en cliente
- Sanitización de inputs
- HTTPS obligatorio en producción
- CSP (Content Security Policy)

### Backend
- Validación con Zod en todas las rutas
- Hashing de passwords (bcrypt)
- JWT firmados con secreto
- Protección CSRF
- Rate limiting por IP
- Validación de webhooks (Stripe signature)

### Base de Datos
- Migrations con Prisma
- Índices en campos consultados frecuentemente
- Constraints de integridad referencial
- Backups automáticos

## Escalabilidad

### Horizontal
- Frontend: Despliegue en CDN (Vercel, Netlify, Cloudflare)
- Backend: Múltiples instancias detrás de load balancer
- Base de datos: Read replicas para consultas

### Vertical
- Caché de consultas frecuentes (Redis)
- Optimización de queries Prisma
- Compresión de respuestas API (gzip)

## Entornos

### Development
- Frontend: `localhost:4321`
- Backend: `localhost:3000`
- Database: PostgreSQL local

### Staging
- Frontend: `staging.nutreterra.com`
- Backend: `api-staging.nutreterra.com`
- Database: PostgreSQL en nube (pruebas)

### Production
- Frontend: `nutreterra.com`
- Backend: `api.nutreterra.com`
- Database: PostgreSQL en nube (producción)

## Decisiones Técnicas

### ¿Por qué Astro?
- SSG para SEO excepcional
- Mínimo JavaScript en cliente
- Islands para interactividad selectiva
- Rendimiento superior a SPAs tradicionales

### ¿Por qué Next.js para backend?
- App Router moderno
- TypeScript nativo
- Fácil despliegue
- Ecosistema maduro

### ¿Por qué Prisma?
- Type-safety completo
- Migrations automáticas
- Queries optimizadas
- Excelente DX (Developer Experience)

### ¿Por qué PostgreSQL?
- ACID compliant
- Relaciones complejas
- JSON support para datos flexibles
- Escalabilidad probada
