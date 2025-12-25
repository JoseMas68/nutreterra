# Modelo de Datos – NutreTerra

## Visión General

Este documento define el esquema de base de datos para PostgreSQL usando Prisma ORM.

---

## Entidades Principales

### 1. User (Usuarios)

**Descripción:** Usuarios registrados en la plataforma.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| email | String | Email del usuario | Único, Requerido |
| passwordHash | String | Contraseña hasheada | Requerido |
| name | String | Nombre completo | Requerido |
| role | Enum | Rol del usuario | USER \| ADMIN |
| createdAt | DateTime | Fecha de registro | Default: now() |
| updatedAt | DateTime | Última actualización | Auto |

**Relaciones:**
- `orders` → Order[] (uno a muchos)
- `cart` → Cart? (uno a uno)
- `addresses` → Address[] (uno a muchos)

**Índices:**
- `email` (único)

---

### 2. Category (Categorías)

**Descripción:** Categorías de productos.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| name | String | Nombre de categoría | Requerido, Único |
| slug | String | URL amigable | Requerido, Único |
| description | String? | Descripción | Opcional |
| imageUrl | String? | Imagen de categoría | Opcional |
| parentId | String? | ID categoría padre | FK (Category) |
| createdAt | DateTime | Fecha de creación | Default: now() |

**Relaciones:**
- `products` → Product[] (uno a muchos)
- `parent` → Category? (auto-relación)
- `children` → Category[] (auto-relación)

**Índices:**
- `slug` (único)
- `name` (único)

**Notas:**
- Soporte para categorías anidadas (padre-hijo)
- Ejemplo: Alimentación > Cereales > Avena

---

### 3. Product (Productos)

**Descripción:** Productos disponibles en la tienda.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| name | String | Nombre del producto | Requerido |
| slug | String | URL amigable | Requerido, Único |
| description | String | Descripción completa | Requerido |
| shortDescription | String? | Descripción corta | Opcional |
| price | Decimal | Precio en euros | Requerido, >0 |
| compareAtPrice | Decimal? | Precio anterior (oferta) | Opcional |
| stock | Int | Unidades disponibles | Requerido, >=0 |
| sku | String | Código de producto | Único, Requerido |
| weight | Decimal? | Peso en gramos | Opcional |
| imageUrl | String | Imagen principal | Requerido |
| images | String[] | Galería de imágenes | Array |
| categoryId | String | ID de categoría | FK (Category) |
| featured | Boolean | Producto destacado | Default: false |
| active | Boolean | Producto activo | Default: true |
| nutritionalInfo | Json? | Info nutricional | Opcional |
| ingredients | String? | Lista de ingredientes | Opcional |
| createdAt | DateTime | Fecha de creación | Default: now() |
| updatedAt | DateTime | Última actualización | Auto |

**Relaciones:**
- `category` → Category (muchos a uno)
- `cartItems` → CartItem[] (uno a muchos)
- `orderItems` → OrderItem[] (uno a muchos)
- `tags` → ProductTag[] (muchos a muchos)

**Índices:**
- `slug` (único)
- `sku` (único)
- `categoryId`
- `featured, active` (compuesto)

**Notas:**
- `nutritionalInfo` puede contener JSON:
  ```json
  {
    "calories": 350,
    "protein": 12,
    "carbs": 60,
    "fat": 8,
    "fiber": 10
  }
  ```

---

### 4. Tag (Etiquetas)

**Descripción:** Etiquetas para filtrado de productos (ej: "sin gluten", "vegano", "ecológico").

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| name | String | Nombre de la etiqueta | Requerido, Único |
| slug | String | URL amigable | Requerido, Único |

**Relaciones:**
- `products` → ProductTag[] (muchos a muchos)

---

### 5. ProductTag (Relación Producto-Etiqueta)

**Descripción:** Tabla intermedia para relación muchos a muchos.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| productId | String | ID del producto | FK (Product) |
| tagId | String | ID de la etiqueta | FK (Tag) |

**Restricciones:**
- PK compuesta: (productId, tagId)

---

### 6. Cart (Carrito)

**Descripción:** Carrito de compras del usuario.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| userId | String | ID del usuario | FK (User), Único |
| createdAt | DateTime | Fecha de creación | Default: now() |
| updatedAt | DateTime | Última actualización | Auto |

**Relaciones:**
- `user` → User (uno a uno)
- `items` → CartItem[] (uno a muchos)

---

### 7. CartItem (Items del Carrito)

**Descripción:** Productos dentro del carrito.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| cartId | String | ID del carrito | FK (Cart) |
| productId | String | ID del producto | FK (Product) |
| quantity | Int | Cantidad | Requerido, >0 |
| priceAtAdd | Decimal | Precio al añadir | Requerido |
| createdAt | DateTime | Fecha de adición | Default: now() |

**Relaciones:**
- `cart` → Cart (muchos a uno)
- `product` → Product (muchos a uno)

**Índices:**
- `cartId, productId` (único compuesto)

**Notas:**
- `priceAtAdd` guarda el precio en el momento de añadir al carrito (por si cambia después)

---

### 8. Order (Pedidos)

**Descripción:** Pedidos realizados por usuarios.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| orderNumber | String | Número de pedido | Único, Auto-generado |
| userId | String | ID del usuario | FK (User) |
| status | Enum | Estado del pedido | OrderStatus |
| subtotal | Decimal | Subtotal productos | Requerido |
| shippingCost | Decimal | Coste de envío | Requerido |
| total | Decimal | Total a pagar | Requerido |
| shippingMethod | String | Método de envío | Ej: "standard", "express" |
| paymentIntentId | String? | ID de Stripe | Opcional |
| paymentStatus | Enum | Estado del pago | PaymentStatus |
| addressId | String | Dirección de envío | FK (Address) |
| trackingNumber | String? | Número de seguimiento | Opcional |
| createdAt | DateTime | Fecha del pedido | Default: now() |
| updatedAt | DateTime | Última actualización | Auto |
| paidAt | DateTime? | Fecha de pago | Opcional |
| shippedAt | DateTime? | Fecha de envío | Opcional |
| deliveredAt | DateTime? | Fecha de entrega | Opcional |

**Relaciones:**
- `user` → User (muchos a uno)
- `items` → OrderItem[] (uno a muchos)
- `address` → Address (muchos a uno)

**Índices:**
- `orderNumber` (único)
- `userId`
- `status`

**Enums:**

```prisma
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
```

---

### 9. OrderItem (Items del Pedido)

**Descripción:** Productos incluidos en un pedido.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| orderId | String | ID del pedido | FK (Order) |
| productId | String | ID del producto | FK (Product) |
| quantity | Int | Cantidad comprada | Requerido, >0 |
| price | Decimal | Precio unitario | Requerido |
| total | Decimal | Total del item | Requerido |
| productSnapshot | Json? | Snapshot del producto | Opcional |

**Relaciones:**
- `order` → Order (muchos a uno)
- `product` → Product (muchos a uno)

**Índices:**
- `orderId`

**Notas:**
- `productSnapshot` guarda info del producto en el momento de la compra (por si se modifica/elimina después):
  ```json
  {
    "name": "Avena Integral",
    "sku": "AV001",
    "imageUrl": "..."
  }
  ```

---

### 10. Address (Direcciones)

**Descripción:** Direcciones de envío de los usuarios.

**Campos:**

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | UUID único | PK, Default: uuid() |
| userId | String | ID del usuario | FK (User) |
| fullName | String | Nombre completo | Requerido |
| street | String | Calle y número | Requerido |
| city | String | Ciudad | Requerido |
| postalCode | String | Código postal | Requerido |
| province | String | Provincia | Requerido |
| country | String | País | Default: "España" |
| phone | String | Teléfono | Requerido |
| isDefault | Boolean | Dirección por defecto | Default: false |
| createdAt | DateTime | Fecha de creación | Default: now() |

**Relaciones:**
- `user` → User (muchos a uno)
- `orders` → Order[] (uno a muchos)

**Índices:**
- `userId`

---

## Diagrama de Relaciones

```
User ──────< Address
 │
 ├──────< Order ──────< OrderItem >────── Product
 │           │
 │           └─────── Address
 │
 └──────○ Cart ──────< CartItem >────── Product

Category ──────< Product >────── ProductTag >────── Tag
   │
   └──────○ Category (parent-child)
```

**Leyenda:**
- `──────<` : Uno a muchos
- `──────○` : Uno a uno
- `>──────<` : Muchos a muchos (a través de tabla intermedia)

---

## Consultas Frecuentes

### 1. Listar productos de una categoría con paginación

```prisma
// Prisma query
const products = await prisma.product.findMany({
  where: {
    categoryId: categoryId,
    active: true
  },
  include: {
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    createdAt: 'desc'
  }
});
```

### 2. Obtener carrito con productos

```prisma
const cart = await prisma.cart.findUnique({
  where: { userId: userId },
  include: {
    items: {
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    }
  }
});
```

### 3. Crear pedido desde carrito

```typescript
// Transacción Prisma
const order = await prisma.$transaction(async (tx) => {
  // 1. Crear order
  const order = await tx.order.create({
    data: {
      userId,
      status: 'PENDING',
      subtotal,
      shippingCost,
      total,
      // ...
    }
  });

  // 2. Crear orderItems desde cartItems
  const orderItems = cartItems.map(item => ({
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.priceAtAdd,
    total: item.quantity * item.priceAtAdd,
    productSnapshot: { /* ... */ }
  }));

  await tx.orderItem.createMany({
    data: orderItems
  });

  // 3. Actualizar stock de productos
  for (const item of cartItems) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    });
  }

  // 4. Vaciar carrito
  await tx.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  return order;
});
```

### 4. Buscar productos por texto

```prisma
const products = await prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } }
    ],
    active: true
  },
  include: {
    category: true
  }
});
```

### 5. Productos más vendidos

```prisma
const topProducts = await prisma.product.findMany({
  include: {
    orderItems: {
      select: {
        quantity: true
      }
    }
  },
  orderBy: {
    orderItems: {
      _count: 'desc'
    }
  },
  take: 10
});
```

---

## Índices Recomendados

```prisma
// En schema.prisma

model Product {
  // ...
  @@index([categoryId])
  @@index([featured, active])
  @@index([slug])
  @@index([sku])
}

model Order {
  // ...
  @@index([userId])
  @@index([status])
  @@index([orderNumber])
}

model CartItem {
  // ...
  @@unique([cartId, productId])
}
```

---

## Validaciones a Nivel de Aplicación

Además de las restricciones de BD, implementar validaciones con Zod:

```typescript
// shared/schemas/product.schema.ts
export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  // ...
});
```

---

## Migraciones

### Workflow con Prisma

1. **Modificar schema.prisma**
2. **Crear migración:**
   ```bash
   npx prisma migrate dev --name add_tags_table
   ```
3. **Aplicar en producción:**
   ```bash
   npx prisma migrate deploy
   ```

### Seeders (Datos Iniciales)

Crear archivo `prisma/seed.ts`:

```typescript
async function main() {
  // Crear categorías
  await prisma.category.createMany({
    data: [
      { name: 'Cereales', slug: 'cereales' },
      { name: 'Legumbres', slug: 'legumbres' },
      // ...
    ]
  });

  // Crear tags
  await prisma.tag.createMany({
    data: [
      { name: 'Vegano', slug: 'vegano' },
      { name: 'Sin Gluten', slug: 'sin-gluten' },
      // ...
    ]
  });

  // Crear admin user
  const adminPassword = await hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@nutreterra.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });
}
```

Ejecutar:
```bash
npx prisma db seed
```

---

## Consideraciones de Rendimiento

### 1. Conexiones a BD
- Usar connection pooling de Prisma
- Configurar límite de conexiones según servidor

### 2. Queries N+1
- Usar `include` para evitar queries múltiples
- Evaluar uso de `select` para campos específicos

### 3. Índices
- Añadir índices en campos consultados frecuentemente
- Evitar índices innecesarios (overhead en writes)

### 4. Caché
- Implementar Redis para:
  - Productos destacados
  - Categorías
  - Productos más vendidos
- Invalidar caché al actualizar datos

---

## Backup y Recuperación

### Estrategia

1. **Backups automáticos diarios** (vía proveedor cloud)
2. **Backups manuales** antes de migraciones importantes
3. **Retención:** 30 días
4. **Pruebas de restauración** mensuales

### Comandos

```bash
# Backup
pg_dump -U user -d nutreterra_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U user -d nutreterra_db < backup_20250323.sql
```

---

## Próximas Extensiones

- **Reviews/Valoraciones** – Tabla `Review` relacionada con `User` y `Product`
- **Wishlist** – Tabla `Wishlist` y `WishlistItem`
- **Cupones** – Tabla `Coupon` con validaciones de uso
- **Notificaciones** – Tabla `Notification` para usuarios
- **Suscripciones** – Tabla `Subscription` para productos recurrentes
