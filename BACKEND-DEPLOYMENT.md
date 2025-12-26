# Guía de Despliegue del Backend en Vercel

## ✅ Preparación completada

El backend ya está configurado para Vercel:
- ✅ Scripts de build actualizados con Prisma
- ✅ Archivos de configuración creados
- ✅ Ya tienes Supabase como base de datos

## Pasos para desplegar el Backend

### 1. Ir a Vercel
- Abre https://vercel.com
- Haz clic en **"Add New Project"**

### 2. Importar el repositorio OTRA VEZ
- Selecciona **JoseMas68/nutreterra** (el mismo repositorio)
- Esta vez es para el BACKEND

### 3. Configurar el proyecto

**Framework Preset**: Next.js (auto-detectado)

**Root Directory**: 
- Haz clic en "Edit"
- Selecciona: **`backend-next`** (MUY IMPORTANTE - diferente del frontend)

**Project Name**: Ponle un nombre diferente, por ejemplo:
- `nutreterra-api` o `nutreterra-backend`

### 4. Variables de Entorno (IMPORTANTE)

En la sección **"Environment Variables"**, añade TODAS estas:

#### Base de datos (Ya las tienes en tu .env local)
```
DATABASE_URL
postgresql://postgres:NutreAdmin68@db.xxudtlkeyljaqfdpcvpl.supabase.co:5432/postgres
```

```
DIRECT_URL
postgresql://postgres:NutreAdmin68@db.xxudtlkeyljaqfdpcvpl.supabase.co:5432/postgres
```

#### NextAuth
```
NEXTAUTH_SECRET
```
Genera un secreto aleatorio. Puedes usar este comando en tu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
NEXTAUTH_URL
```
Déjalo vacío por ahora, lo actualizarás después con la URL de Vercel

#### Frontend URL (para CORS)
```
FRONTEND_URL
```
Pon la URL de tu frontend que ya desplegaste (ejemplo: `https://nutreterra.vercel.app`)

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL
https://xxudtlkeyljaqfdpcvpl.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
sb_secret_k03wfZ5wj0WbtHJhiFruxw_X9I6XwKz
```

#### Stripe (opcional por ahora)
```
STRIPE_SECRET_KEY
sk_test_placeholder
```

```
STRIPE_PUBLISHABLE_KEY
pk_test_placeholder
```

```
STRIPE_WEBHOOK_SECRET
whsec_placeholder
```

#### Email (opcional por ahora)
```
RESEND_API_KEY
re_placeholder
```

```
EMAIL_FROM
noreply@nutreterra.com
```

#### Node Environment
```
NODE_ENV
production
```

### 5. Desplegar
1. Haz clic en **"Deploy"**
2. Espera 3-5 minutos
3. Cuando termine, copia la URL (ejemplo: `https://nutreterra-api.vercel.app`)

### 6. Actualizar variables de entorno

#### En el BACKEND:
1. Ve a tu proyecto del backend en Vercel
2. Settings → Environment Variables
3. Actualiza `NEXTAUTH_URL` con la URL del backend que acabas de obtener

#### En el FRONTEND:
1. Ve a tu proyecto del frontend en Vercel
2. Settings → Environment Variables
3. Actualiza `PUBLIC_API_URL` con la URL del backend
4. Haz clic en Deployments → ... (tres puntos) → Redeploy

### 7. Verificar que funciona

Abre en tu navegador:
```
https://TU-BACKEND-URL.vercel.app/api/health
```

Deberías ver:
```json
{"status":"ok","message":"API is running"}
```

Si ves esto, el backend está funcionando! 🎉

## Configuración de CORS

Si tienes problemas de CORS, verifica que `FRONTEND_URL` en el backend tenga la URL correcta del frontend (sin barra final).

## Próximos pasos

1. ✅ Desplegar backend en Vercel
2. ✅ Actualizar PUBLIC_API_URL en el frontend
3. ✅ Redesplegar frontend con la nueva URL
4. ⏳ Probar la aplicación completa
5. ⏳ Configurar Stripe para pagos reales
6. ⏳ Configurar dominio personalizado

---

¿Problemas? Revisa los logs en Vercel Dashboard → Tu proyecto → Deployments → [deployment] → Build Logs
