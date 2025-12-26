# Guía de Despliegue en Vercel - NutreTerra

## Preparación completada ✅

El proyecto ya está configurado para Vercel con:
- ✅ Adaptador de Vercel instalado (@astrojs/vercel)
- ✅ Configuración de Astro actualizada
- ✅ Archivos de configuración creados

## Pasos para desplegar el Frontend en Vercel

### 1. Crear cuenta en Vercel (si no la tienes)
- Ve a https://vercel.com
- Haz clic en "Sign Up"
- Usa tu cuenta de GitHub para registrarte

### 2. Importar el proyecto desde GitHub

1. Una vez logueado en Vercel, haz clic en **"Add New Project"**
2. Selecciona **"Import Git Repository"**
3. Busca y selecciona tu repositorio: **JoseMas68/nutreterra**
4. Haz clic en **"Import"**

### 3. Configurar el proyecto

En la pantalla de configuración:

**Framework Preset**: Vercel debería detectar automáticamente "Astro"

**Root Directory**: 
- Haz clic en "Edit"
- Selecciona o escribe: `frontend-astro`
- Esto es IMPORTANTE porque el frontend está en una subcarpeta

**Build Command**: (debería estar ya configurado)
```
npm run build
```

**Output Directory**: (debería estar ya configurado)
```
dist
```

### 4. Configurar Variables de Entorno

En la sección **"Environment Variables"**, añade:

| Name | Value |
|------|-------|
| `PUBLIC_API_URL` | URL de tu backend (por ahora puedes usar `http://localhost:3001` o la URL del backend cuando lo despliegues) |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Tu clave pública de Stripe (opcional por ahora) |

**IMPORTANTE**: Las variables que empiezan con `PUBLIC_` estarán disponibles en el cliente.

### 5. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel comenzará a construir y desplegar tu aplicación
3. Espera 2-3 minutos mientras se completa el despliegue
4. Una vez completado, verás la URL de tu aplicación (algo como `nutreterra.vercel.app`)

### 6. Configurar dominio personalizado (opcional)

1. Ve a tu proyecto en Vercel
2. Click en **"Settings"** > **"Domains"**
3. Añade tu dominio personalizado
4. Sigue las instrucciones para configurar los DNS

## Desplegar el Backend

### Opción 1: Vercel (Recomendado para Next.js)

Tu backend está en Next.js, así que también puede desplegarse en Vercel:

1. Repite el mismo proceso pero selecciona `backend-next` como **Root Directory**
2. Configura las variables de entorno del backend:
   - `DATABASE_URL`: URL de tu base de datos PostgreSQL
   - `JWT_SECRET`: Un secreto para JWT
   - Y cualquier otra variable de tu `.env`

### Opción 2: Railway / Render / Fly.io

Estas plataformas también soportan Next.js y PostgreSQL:
- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io

## Bases de datos en producción

Para PostgreSQL en producción, puedes usar:

1. **Supabase** (Gratis hasta cierto límite)
   - https://supabase.com
   - Incluye PostgreSQL + Auth + Storage
   
2. **Neon** (Serverless Postgres)
   - https://neon.tech
   - Gratis hasta 0.5GB
   
3. **Railway** (Incluye Postgres)
   - https://railway.app
   - $5/mes aproximadamente

## Verificar el despliegue

Una vez desplegado:
1. Abre la URL de Vercel
2. Verifica que la página principal carga correctamente
3. Revisa que las imágenes y estilos se ven bien
4. Si hay errores, revisa los logs en Vercel Dashboard > Deployments > [tu deployment] > Logs

## Configuración adicional

### Conectar frontend con backend desplegado

1. Una vez tengas el backend desplegado, copia su URL
2. Ve a Vercel Dashboard > Tu proyecto > Settings > Environment Variables
3. Actualiza `PUBLIC_API_URL` con la URL del backend
4. Haz un nuevo deployment (en Deployments > ... > Redeploy)

### Habilitar Analytics (opcional)

Vercel Analytics ya está habilitado en la configuración de Astro.
Para verlo:
1. Ve a tu proyecto en Vercel
2. Click en la pestaña "Analytics"

## Solución de problemas comunes

### Error: "Build failed"
- Revisa los logs en Vercel
- Asegúrate de que `frontend-astro` está seleccionado como Root Directory
- Verifica que todas las dependencias están en `package.json`

### Las variables de entorno no funcionan
- Asegúrate de que empiezan con `PUBLIC_` para variables del cliente
- Redespliega después de añadir nuevas variables

### La API no responde
- Verifica que `PUBLIC_API_URL` apunta a tu backend desplegado
- Revisa la consola del navegador (F12) para ver errores CORS

## Próximos pasos

1. ✅ Desplegar frontend en Vercel
2. ⏳ Desplegar backend (Next.js + PostgreSQL)
3. ⏳ Configurar base de datos en producción
4. ⏳ Conectar frontend con backend
5. ⏳ Configurar dominio personalizado
6. ⏳ Configurar Stripe para pagos reales

---

**¿Necesitas ayuda?** Contáctame o revisa la documentación:
- Vercel: https://vercel.com/docs
- Astro: https://docs.astro.build/en/guides/deploy/vercel/
