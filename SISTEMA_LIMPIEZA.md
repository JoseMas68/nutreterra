# 🔒 Sistema de Limpieza Automática - Sitio de Prueba

## 📋 Descripción General

Este proyecto implementa un sistema automático de limpieza de datos para mantener el sitio como un entorno de prueba/demostración.

## ⚙️ Funcionalidades Implementadas

### 1. **Limpieza Automática de Usuarios**
- **Frecuencia**: Diaria a las 2:00 AM (hora del servidor)
- **Qué se borra**: Todos los usuarios que NO son ADMIN y fueron creados hace más de 24 horas
- **Qué se conserva**: Usuarios con rol ADMIN (nunca se borran)

### 2. **Avisos de "Sitio de Prueba"**
- **Banner frontend**: Barra fija superior en todo el sitio
- **Banner admin**: Aviso destacado en la página de login
- **Diseño**: Colores ámbar/naranja con icono de advertencia

## 🚀 Configuración en Vercel

### Variables de Entorno Necesarias

Añade estas variables en tu dashboard de Vercel:

```env
DATABASE_URL=postgresql://postgres.xxudtlkeyljaqfdpcvpl:Sjlxj8Se5sFwmvHr@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

DIRECT_URL=postgresql://postgres.xxudtlkeyljaqfdpcvpl:Sjlxj8Se5sFwmvHr@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

CRON_SECRET=nutreterra_cleanup_secret_2024_change_in_production
```

**⚠️ IMPORTANTE**: Cambia `CRON_SECRET` a un valor seguro único en producción.

### Archivo vercel.json

El proyecto incluye un archivo `vercel.json` que configura el cron job:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-users",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Horario**: Todos los días a las 2:00 AM (UTC)

## 🧪 Testing del Sistema

### Probar la limpieza manualmente:

```bash
# Ejecutar el endpoint de limpieza manualmente
curl -X GET "https://tu-backend.vercel.app/api/admin/cleanup-users" \
  -H "Authorization: Bearer nutreterra_cleanup_secret_2024_change_in_production"
```

### Verificar usuarios en la base de datos:

```bash
cd backend-next
npx tsx scripts/check-users.ts
```

## 👥 Usuarios Administradores (NO se borran)

Los siguientes usuarios tienen rol ADMIN y **NO serán eliminados**:

- admin@nutreterra.es
- ms.dinayassine@gmail.com
- josemas68@gmail.com
- prueba@gmail.com

## 📊 Cómo Funciona la Limpieza

1. **Cron Job Trigger**: Vercel ejecuta el cron job diariamente
2. **Autenticación**: Verifica el `CRON_SECRET` en el header
3. **Cálculo de fecha**: Busca usuarios creados hace más de 24 horas
4. **Filtro**: Excluye usuarios con rol ADMIN
5. **Eliminación en cascada**: Borra usuarios y todos sus datos relacionados:
   - Direcciones
   - Pedidos
   - Carritos
   - Reseñas
   - Menús

## 🎨 Componentes Visuales

### Frontend Banner
- **Ubicación**: Componente `TestSiteBanner.astro`
- **Estilo**: Fijo en la parte superior
- **Animación**: Icono con efecto pulse
- **Responsive**: Se adapta a móviles

### Admin Login Banner
- **Ubicación**: Página `/auth/signin`
- **Estilo**: Tarjeta con gradiente ámbar/naranja
- **Contenido**: Explica la limpieza de datos cada 24h

## 🔄 Desactivar el Sistema

Si en el futuro quieres desactivar la limpieza automática:

1. **Opción 1**: Eliminar el archivo `vercel.json`
2. **Opción 2**: Comentar la sección `crons` en `vercel.json`
3. **Opción 3**: Eliminar el endpoint `/api/admin/cleanup-users`

## 📝 Notas Importantes

- ✅ Los usuarios ADMIN **nunca** se borran
- ✅ La limpieza es irreversible (no hay backup)
- ✅ El cron job solo funciona en producción (Vercel)
- ✅ En local no se ejecuta automáticamente
- ✅ Los datos eliminados incluyen todas las relaciones en cascada

## 🔐 Seguridad

- El endpoint de limpieza está protegido por `CRON_SECRET`
- Solo accesible vía HTTP con el header correcto
- Los logs se guardan en Vercel para auditoría

---

**Creado**: 2026-03-11
**Proyecto**: NutreTerra - Sitio de Prueba
