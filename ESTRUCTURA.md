# NutreTerra – Resumen de Estructura

## Árbol de Directorios Completo

```
nutreterra/
│
├── docs/                           # Documentación técnica
│   ├── arquitectura.md             # Arquitectura del sistema
│   ├── flujo-compra.md             # Flujo completo de compra
│   ├── modelo-datos.md             # Modelo de datos y Prisma schema
│   └── convenciones.md             # Convenciones de código
│
├── frontend-astro/                 # Frontend con Astro
│   ├── src/
│   │   ├── pages/                  # Rutas de la aplicación
│   │   │   ├── index.astro
│   │   │   ├── producto/[slug].astro
│   │   │   ├── categoria/[slug].astro
│   │   │   ├── carrito.astro
│   │   │   ├── checkout/
│   │   │   ├── login.astro
│   │   │   ├── registro.astro
│   │   │   ├── perfil.astro
│   │   │   ├── pedidos/
│   │   │   └── contacto.astro
│   │   │
│   │   ├── layouts/                # Plantillas base
│   │   │   ├── Layout.astro
│   │   │   ├── ProductLayout.astro
│   │   │   └── CheckoutLayout.astro
│   │   │
│   │   ├── components/             # Componentes estáticos
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── CategoryCard.astro
│   │   │   ├── Breadcrumbs.astro
│   │   │   ├── Hero.astro
│   │   │   └── SEO.astro
│   │   │
│   │   ├── islands/                # Componentes interactivos (React)
│   │   │   ├── CartIcon.tsx
│   │   │   ├── AddToCart.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── PaymentForm.tsx
│   │   │
│   │   ├── services/               # Consumo de API
│   │   │   ├── api-client.ts
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── styles/                 # Estilos globales
│   │   │   ├── global.css
│   │   │   └── fonts.css
│   │   │
│   │   └── env.d.ts                # Tipos de variables de entorno
│   │
│   ├── public/                     # Assets estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── favicon.svg
│   │
│   ├── astro.config.mjs
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── backend-next/                   # Backend con Next.js
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   └── refresh/route.ts
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [slug]/products/route.ts
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── route.ts
│   │   │   │   ├── items/route.ts
│   │   │   │   └── [itemId]/route.ts
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── create-intent/route.ts
│   │   │   │   └── confirm/route.ts
│   │   │   │
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   │
│   │   ├── actions/                # Server actions
│   │   │   ├── products.ts
│   │   │   └── orders.ts
│   │   │
│   │   └── middleware.ts           # Middleware global
│   │
│   ├── lib/                        # Utilidades
│   │   ├── prisma.ts               # Cliente Prisma
│   │   ├── auth.ts                 # JWT, hashing
│   │   ├── stripe.ts               # Configuración Stripe
│   │   └── validators/             # Schemas Zod
│   │       ├── product.ts
│   │       ├── auth.ts
│   │       ├── cart.ts
│   │       └── order.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma           # Modelo de datos
│   │   ├── migrations/             # Migraciones
│   │   └── seed.ts                 # Datos iniciales
│   │
│   ├── env.d.ts
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── shared/                         # Código compartido
│   ├── types/                      # Tipos TypeScript
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── constants/                  # Constantes globales
│   │   ├── shipping.ts
│   │   ├── order-status.ts
│   │   └── index.ts
│   │
│   ├── schemas/                    # Schemas Zod
│   │   ├── product.ts
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── index.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── .gitignore
├── README.md                       # README principal
└── ESTRUCTURA.md                   # Este archivo
```

## Archivos Generados

### Documentación (docs/)
- ✅ `arquitectura.md` – Diagramas y explicación de la arquitectura
- ✅ `flujo-compra.md` – Flujo completo del usuario desde home hasta confirmación
- ✅ `modelo-datos.md` – Schema de Prisma y relaciones de BD
- ✅ `convenciones.md` – Estándares de código, nomenclatura, commits

### Frontend (frontend-astro/)
- ✅ Estructura de carpetas completa
- ✅ `README.md` – Documentación del frontend
- ✅ `package.json` – Configuración de dependencias
- ✅ `tsconfig.json` – Configuración TypeScript
- ✅ `astro.config.mjs` – Configuración Astro (placeholder)
- ✅ `tailwind.config.js` – Configuración Tailwind (placeholder)
- ✅ `.env.example` – Variables de entorno de ejemplo
- ✅ Archivos `.gitkeep` en todas las carpetas

### Backend (backend-next/)
- ✅ Estructura de carpetas completa
- ✅ `README.md` – Documentación del backend con ejemplos de código
- ✅ `package.json` – Configuración de dependencias
- ✅ `tsconfig.json` – Configuración TypeScript
- ✅ `next.config.js` – Configuración Next.js (placeholder)
- ✅ `.env.example` – Variables de entorno de ejemplo
- ✅ `env.d.ts` – Tipos de variables de entorno
- ✅ Archivos `.gitkeep` en todas las carpetas

### Shared (shared/)
- ✅ Estructura de carpetas completa
- ✅ `README.md` – Documentación de código compartido con ejemplos
- ✅ `package.json` – Configuración de paquete
- ✅ `tsconfig.json` – Configuración TypeScript
- ✅ Archivos `.gitkeep` en todas las carpetas

### Raíz del Proyecto
- ✅ `README.md` – Documentación principal
- ✅ `.gitignore` – Archivos a ignorar en Git
- ✅ `ESTRUCTURA.md` – Este archivo de resumen

## Próximos Pasos (Implementación)

### 1. Inicializar Proyectos

```bash
# Frontend
cd frontend-astro
npm init astro@latest . -- --template minimal --typescript strict
npm install @astrojs/react @astrojs/tailwind tailwindcss react react-dom

# Backend
cd ../backend-next
npx create-next-app@latest . --typescript --app --no-src-dir
npm install @prisma/client bcrypt jsonwebtoken stripe zod
npm install -D prisma @types/bcrypt @types/jsonwebtoken tsx

# Shared
cd ../shared
npm install
```

### 2. Configurar Base de Datos

```bash
cd backend-next

# Configurar .env con tu DATABASE_URL
cp .env.example .env

# Generar cliente Prisma
npx prisma generate

# Crear base de datos y ejecutar migraciones
npx prisma migrate dev --name init

# Poblar con datos iniciales
npm run prisma:seed
```

### 3. Configurar Variables de Entorno

Frontend (.env):
```bash
PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Backend (.env):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/nutreterra_db
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:4321
```

### 4. Desarrollar Endpoints (Backend)

Orden recomendado:
1. `/api/auth` (register, login)
2. `/api/categories` (GET)
3. `/api/products` (GET, POST, PATCH, DELETE)
4. `/api/cart` (GET, POST, PATCH, DELETE)
5. `/api/orders` (GET, POST)
6. `/api/payments` (create-intent, confirm)
7. `/api/webhooks/stripe`

### 5. Desarrollar Frontend

Orden recomendado:
1. Layout principal (Header, Footer)
2. Página home con productos destacados
3. Página de categoría
4. Página de producto
5. Carrito
6. Checkout
7. Autenticación (login, registro)
8. Perfil y pedidos

### 6. Integrar Stripe

1. Crear cuenta en Stripe
2. Obtener API keys
3. Configurar webhook en Stripe dashboard
4. Implementar PaymentForm en frontend
5. Probar flujo de pago

### 7. Testing

1. Tests unitarios para schemas (Zod)
2. Tests de integración para API
3. Tests E2E para flujo de compra

### 8. Deploy

Frontend:
- Vercel / Netlify / Cloudflare Pages

Backend:
- Vercel / Railway / Render

Base de datos:
- Railway / Supabase / Neon

## Comandos Útiles

### Frontend
```bash
npm run dev          # Servidor desarrollo (puerto 4321)
npm run build        # Build para producción
npm run preview      # Preview de build
```

### Backend
```bash
npm run dev          # Servidor desarrollo (puerto 3000)
npm run build        # Build para producción
npm start            # Servidor producción
npm run prisma:studio # Ver BD en navegador
```

### Prisma
```bash
npx prisma generate           # Generar cliente
npx prisma migrate dev        # Crear migración
npx prisma migrate deploy     # Aplicar migraciones (prod)
npx prisma studio             # Interfaz visual de BD
npx prisma db seed            # Poblar BD
```

## Estado Actual

✅ **Documentación completa**
✅ **Estructura de carpetas**
✅ **Archivos de configuración**
✅ **README en cada módulo**

⏳ **Pendiente de implementación:**
- Código funcional de endpoints
- Código funcional de páginas y componentes
- Integración con Stripe
- Tests
- Deployment

## Contacto

Para cualquier duda sobre la estructura, consultar:
- [README.md](README.md) principal
- README específico de cada módulo
- Documentación en [docs/](docs/)
