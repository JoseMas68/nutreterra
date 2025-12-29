# Flujo de Compra – NutreTerra

## Visión General

Este documento describe el recorrido completo del usuario desde que descubre un producto hasta que completa la compra.

```
[Home] → [Categoría] → [Producto] → [Carrito] → [Checkout] → [Pago] → [Confirmación]
```

---

## 1. Descubrimiento de Productos

### Página de Inicio (`/`)

**Elementos:**
- Hero con llamada a acción
- Productos destacados
- Categorías principales
- Blog/recetas recientes

**Interacciones:**
- Click en categoría → `/categoria/[slug]`
- Click en producto → `/producto/[slug]`
- Búsqueda → `/buscar?q=[término]`

**Endpoints consumidos:**
- `GET /api/products?featured=true`
- `GET /api/categories`

---

### Página de Categoría (`/categoria/[slug]`)

**Elementos:**
- Breadcrumbs (Home > Categoría)
- Filtros (precio, marca, etiquetas)
- Grid de productos
- Paginación

**Interacciones:**
- Aplicar filtro → Recarga con query params
- Click en producto → `/producto/[slug]`
- Añadir a carrito desde grid (opcional)

**Endpoints consumidos:**
- `GET /api/categories/[slug]/products?page=1&priceMin=0&priceMax=100`

**Generación:**
- SSG en build time para categorías principales
- Filtros dinámicos vía Islands

---

## 2. Detalle de Producto (`/producto/[slug]`)

### Información Mostrada

- Nombre del producto
- Precio
- Descripción completa
- Imágenes (galería)
- Stock disponible
- Información nutricional
- Ingredientes
- Valoraciones y reseñas

### Acciones del Usuario

**Añadir al carrito:**
1. Usuario selecciona cantidad
2. Click en "Añadir al carrito"
3. Island hace POST a `/api/cart`
4. Respuesta actualiza contador de carrito
5. Notificación visual (toast)

**Ver carrito:**
- Click en icono carrito → `/carrito`

**Endpoints consumidos:**
- `GET /api/products/[slug]` (SSG/SSR)
- `POST /api/cart` (requiere autenticación)

### Usuarios No Autenticados

**Opción 1: Carrito en LocalStorage**
- Guardar items en cliente
- Al hacer checkout, pedir login
- Transferir carrito a backend

**Opción 2: Login Obligatorio**
- Redirigir a `/login` al añadir producto
- Después de login, volver a producto

---

## 3. Carrito (`/carrito`)

### Elementos

- Lista de productos añadidos
- Cantidad editable por item
- Botón eliminar por item
- Subtotal por producto
- Total general
- Costes de envío estimados
- Botón "Proceder al checkout"

### Interacciones

**Actualizar cantidad:**
1. Usuario cambia input de cantidad
2. Island hace PATCH a `/api/cart/[itemId]`
3. Recalcula totales

**Eliminar item:**
1. Click en "Eliminar"
2. DELETE a `/api/cart/[itemId]`
3. Actualiza lista

**Proceder al checkout:**
- Click → `/checkout`
- Si no autenticado → `/login?redirect=/checkout`

**Endpoints consumidos:**
- `GET /api/cart`
- `PATCH /api/cart/[itemId]`
- `DELETE /api/cart/[itemId]`

---

## 4. Checkout (`/checkout`)

**Requisito:** Usuario autenticado

### Pasos del Checkout

#### Paso 1: Dirección de Envío

**Campos:**
- Nombre completo
- Dirección
- Ciudad
- Código postal
- Teléfono

**Validación:**
- Frontend: Zod schema (shared)
- Backend: Validación al guardar

**Guardado:**
- Opcional: Guardar dirección en perfil
- POST a `/api/users/addresses`

#### Paso 2: Método de Envío

**Opciones:**
- Estándar (3-5 días) – 4.99€
- Express (24-48h) – 9.99€
- Gratis (>50€)

**Cálculo:**
- Mostrar coste dinámicamente
- Actualizar total

#### Paso 3: Resumen del Pedido

**Mostrar:**
- Productos del carrito
- Dirección de envío
- Método de envío
- Subtotal
- Coste de envío
- **Total a pagar**

**Botón:** "Proceder al pago"

---

## 5. Pago (`/checkout/pago`)

### Integración con Stripe

**Flujo técnico:**

1. **Crear Payment Intent**
   ```javascript
   POST /api/payments/create-intent
   Body: { cartId, shippingMethod }
   Response: { clientSecret, amount }
   ```

2. **Mostrar Stripe Elements**
   - Island de React con Stripe SDK
   - Formulario de tarjeta
   - Usuario ingresa datos

3. **Confirmar Pago**
   ```javascript
   // Frontend confirma con Stripe
   const { error, paymentIntent } = await stripe.confirmPayment({
     elements,
     confirmParams: {
       return_url: 'https://nutreterra.es/checkout/confirmacion'
     }
   });
   ```

4. **Webhook de Stripe**
   ```javascript
   POST /api/webhooks/stripe
   Event: payment_intent.succeeded
   ```

5. **Crear Pedido en Base de Datos**
   - Verificar firma del webhook
   - Crear order en Prisma
   - Actualizar stock de productos
   - Vaciar carrito
   - Enviar email de confirmación

### Manejo de Errores

**Pago rechazado:**
- Mostrar error al usuario
- Permitir reintentar
- No crear pedido

**Timeout:**
- Mensaje de espera
- Verificar estado con Stripe API

**Otros errores:**
- Log en backend
- Mensaje genérico al usuario

---

## 6. Confirmación (`/checkout/confirmacion`)

### Información Mostrada

- Número de pedido
- Estado: "Pagado"
- Resumen de productos
- Dirección de envío
- Total pagado
- Tiempo estimado de entrega

### Acciones

- Ver pedido completo → `/pedidos/[orderId]`
- Volver a la tienda → `/`
- Descargar factura (PDF)

### Notificaciones

**Email al usuario:**
- Confirmación de pedido
- Detalle de productos
- Información de envío

**Email a administrador:**
- Nuevo pedido recibido
- Preparar envío

---

## 7. Gestión de Pedidos

### Página de Pedidos (`/pedidos`)

**Lista de pedidos del usuario:**
- Número de pedido
- Fecha
- Total
- Estado (Pagado, Enviado, Entregado)

**Endpoint:**
- `GET /api/orders`

### Detalle de Pedido (`/pedidos/[orderId]`)

**Información:**
- Productos ordenados
- Estado actual
- Tracking de envío (si disponible)
- Factura descargable

**Endpoint:**
- `GET /api/orders/[orderId]`

---

## Estados del Pedido

```
PENDING     → Carrito activo (no pagado)
PAID        → Pago confirmado
PROCESSING  → Preparando envío
SHIPPED     → Enviado (con tracking)
DELIVERED   → Entregado
CANCELLED   → Cancelado (admin o usuario)
REFUNDED    → Reembolsado
```

**Transiciones permitidas:**
- PENDING → PAID (webhook de Stripe)
- PAID → PROCESSING (admin)
- PROCESSING → SHIPPED (admin añade tracking)
- SHIPPED → DELIVERED (actualización manual o automática)
- PAID/PROCESSING → CANCELLED (admin)
- PAID → REFUNDED (admin, crea refund en Stripe)

---

## Casos Especiales

### Usuario No Registrado

**Opción 1: Registro obligatorio**
- Forzar registro antes de checkout
- Ventaja: Base de datos de usuarios
- Desventaja: Fricción

**Opción 2: Guest Checkout**
- Permitir compra sin cuenta
- Pedir email para confirmación
- Crear cuenta opcional post-compra

### Productos Sin Stock

**Al añadir al carrito:**
- Verificar stock disponible
- Mostrar error si no hay stock

**Durante el checkout:**
- Verificar stock antes de crear Payment Intent
- Si stock insuficiente → Mostrar error y actualizar carrito

### Carrito Abandonado

**Estrategia:**
- Guardar carrito en base de datos (usuarios registrados)
- Email recordatorio después de 24h
- Código de descuento opcional para incentivar

---

## Métricas y Analytics

### Eventos a Trackear

1. **product_view** – Vista de producto
2. **add_to_cart** – Añadir a carrito
3. **begin_checkout** – Iniciar checkout
4. **add_payment_info** – Ingresar info de pago
5. **purchase** – Compra completada

### Herramientas Sugeridas

- Google Analytics 4
- Facebook Pixel (si hay ads)
- Hotjar (mapas de calor)

---

## Optimizaciones SEO

### Páginas Estáticas (SSG)

- Home
- Categorías
- Productos

**Meta tags dinámicos:**
```html
<title>Nombre Producto – NutreTerra</title>
<meta name="description" content="Descripción del producto...">
<meta property="og:image" content="URL de imagen">
```

### Structured Data (JSON-LD)

**Producto:**
```json
{
  "@type": "Product",
  "name": "Nombre Producto",
  "offers": {
    "@type": "Offer",
    "price": "12.99",
    "priceCurrency": "EUR"
  }
}
```

**Breadcrumbs:**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

---

## Resumen Técnico

| Página | Tipo | Autenticación | Endpoints Principales |
|--------|------|---------------|----------------------|
| Home | SSG | No | GET /api/products?featured=true |
| Categoría | SSG | No | GET /api/categories/[slug]/products |
| Producto | SSG/SSR | No | GET /api/products/[slug] |
| Carrito | SSR | Opcional | GET/PATCH/DELETE /api/cart |
| Checkout | SSR | Sí | POST /api/orders |
| Pago | SSR | Sí | POST /api/payments/create-intent |
| Confirmación | SSR | Sí | GET /api/orders/[orderId] |

---

## Próximos Pasos

1. Implementar sistema de cupones/descuentos
2. Programa de fidelización
3. Suscripciones recurrentes
4. Wishlist (lista de deseos)
5. Comparador de productos
