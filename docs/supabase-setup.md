# Configuración de Supabase para NutreTerra

Esta guía te ayudará a configurar Supabase como base de datos PostgreSQL para el proyecto NutreTerra.

## 1. Crear Cuenta y Proyecto en Supabase

### Paso 1: Registrarse
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con GitHub, Google o Email

### Paso 2: Crear Proyecto
1. Una vez dentro, haz clic en "New Project"
2. Completa los datos:
   - **Name:** `nutreterra` (o el nombre que prefieras)
   - **Database Password:** Genera una contraseña segura y **guárdala** (la necesitarás)
   - **Region:** Elige la más cercana a tus usuarios (ej: `Europe (Frankfurt)` para España)
   - **Pricing Plan:** Free (para desarrollo)
3. Haz clic en "Create new project"
4. Espera 2-3 minutos mientras se crea la base de datos

## 2. Obtener las Connection Strings

### Paso 1: Ir a Database Settings
1. En el panel izquierdo, ve a **Settings** (icono de engranaje)
2. Selecciona **Database**

### Paso 2: Copiar las URLs de Conexión
En la sección "Connection string", encontrarás varias opciones:

#### Para `DATABASE_URL` (Connection Pooling)
1. Selecciona la pestaña **URI**
2. Selecciona el modo **Transaction** (recomendado)
3. Copia la URL completa, se verá así:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
4. **Importante:** Reemplaza `[YOUR-PASSWORD]` con la contraseña que guardaste al crear el proyecto

#### Para `DIRECT_URL` (Migraciones)
1. Selecciona la pestaña **URI**
2. Selecciona el modo **Session**
3. Copia la URL completa, se verá así:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
4. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

## 3. Configurar Variables de Entorno

### Paso 1: Crear archivo `.env`
En la carpeta `backend-next/`, crea un archivo `.env` (si no existe):

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:TU_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.xxxxxxxxxxxxx:TU_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_una_clave_secreta_aleatoria_aqui

# Stripe (usar cuando tengas cuenta)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Email (Resend)
RESEND_API_KEY=re_placeholder
EMAIL_FROM=noreply@nutreterra.es

# Frontend URL
FRONTEND_URL=http://localhost:4321

# Node Environment
NODE_ENV=development
```

### Paso 2: Generar NEXTAUTH_SECRET
Puedes generar un secret aleatorio ejecutando en terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 4. Ejecutar Migraciones de Prisma

### Paso 1: Generar el Cliente Prisma
```bash
cd backend-next
npm run prisma:generate
```

### Paso 2: Crear las Tablas en Supabase
```bash
npm run prisma:migrate
```

Cuando te pregunte el nombre de la migración, escribe algo como: `init` o `initial_setup`

Esto creará todas las tablas en tu base de datos Supabase:
- `users` (usuarios)
- `categories` (categorías)
- `products` (productos)
- `tags` (etiquetas)
- `product_tags` (relación productos-tags)
- `carts` (carritos)
- `cart_items` (items del carrito)
- `orders` (pedidos)
- `order_items` (items de pedidos)
- `addresses` (direcciones)
- `reviews` (reseñas)

### Paso 3: Verificar en Supabase
1. Ve a tu proyecto en Supabase
2. En el panel izquierdo, haz clic en **Table Editor**
3. Deberías ver todas las tablas creadas

## 5. Poblar con Datos de Prueba

### Ejecutar el Seed
```bash
npm run prisma:seed
```

Esto creará:
- **10 productos** de ejemplo (avena, quinoa, lentejas, etc.)
- **5 categorías** (Cereales, Legumbres, Frutos Secos, etc.)
- **6 tags** (Vegano, Sin Gluten, Ecológico, etc.)
- **2 usuarios** de prueba:
  - Admin: `admin@nutreterra.es` / `admin123`
  - Cliente: `test@example.com` / `test123`
- **1 carrito** de prueba con productos

### Verificar los Datos
Puedes usar Prisma Studio para ver los datos:
```bash
npm run prisma:studio
```

Esto abrirá una interfaz en `http://localhost:5555`

O también puedes verlos directamente en Supabase:
1. Ve a **Table Editor**
2. Selecciona cualquier tabla (ej: `products`)
3. Verás todos los registros insertados

## 6. Verificar la Conexión

### Iniciar el Backend
```bash
npm run dev
```

El servidor debería iniciar en `http://localhost:3000`

### Probar un Endpoint
Abre tu navegador o Postman y prueba:
```
GET http://localhost:3000/api/products
```

Deberías recibir una respuesta JSON con los 10 productos creados.

## 7. Monitoreo y Gestión

### Ver Logs de la Base de Datos
En Supabase:
1. Ve a **Database** → **Logs**
2. Aquí puedes ver todas las queries ejecutadas

### Ver Uso de Recursos
En Supabase:
1. Ve a **Settings** → **Billing**
2. Puedes ver el uso de:
   - Database size
   - Bandwidth
   - API requests

### Límites del Plan Free
- **Database:** 500 MB
- **Bandwidth:** 2 GB
- **API Requests:** Ilimitadas

Para desarrollo, esto es más que suficiente.

## 8. Troubleshooting

### Error: "Can't reach database server"
- Verifica que las URLs en `.env` sean correctas
- Asegúrate de haber reemplazado `[YOUR-PASSWORD]` con tu contraseña real
- Verifica que no haya espacios extra en las URLs

### Error: "Invalid connection string"
- La contraseña debe estar URL-encoded si contiene caracteres especiales
- Ejemplo: Si tu password es `Pass@123`, debe ser `Pass%40123`

### Error al ejecutar migraciones
- Asegúrate de tener `DIRECT_URL` configurado en `.env`
- Verifica que estés usando el puerto `6543` para `DIRECT_URL`

### No veo las tablas en Supabase
- Espera unos segundos y recarga la página
- Ve a **Table Editor** y haz clic en el botón de refresh

## 9. Siguiente Paso: Producción

Cuando estés listo para producción:

1. **Cambiar a un plan de pago** (si necesitas más recursos)
2. **Actualizar las variables de entorno** en tu plataforma de hosting (Vercel, Railway, etc.)
3. **Ejecutar migraciones en producción:**
   ```bash
   npx prisma migrate deploy
   ```
4. **NO ejecutar el seed** en producción (solo datos de desarrollo)

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Dashboard](https://app.supabase.com)

---

**¿Tienes problemas?** Revisa la [documentación oficial de Supabase](https://supabase.com/docs/guides/database) o el [Discord de Supabase](https://discord.supabase.com).
