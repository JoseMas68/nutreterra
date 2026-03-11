# 🔔 Sistema de Toast Notifications

Sistema moderno de notificaciones para reemplazar los `alert()` del navegador.

## 📦 Instalación

Ya instalado en ambos proyectos:
- **Frontend Astro**: `react-hot-toast`
- **Backend Next.js**: `react-hot-toast`

## 🚀 Uso en Frontend (Astro)

### Importar funciones:

```tsx
import { toastSuccess, toastError, toastWarning, toastInfo, toastPromise } from '@/lib/toast';
```

### Tipos de Toast disponibles:

```tsx
// ✅ Success (verde)
toastSuccess('Producto añadido al carrito');

// ❌ Error (rojo)
toastError('Error al conectar con el servidor');

// ⚠️ Warning (amarillo)
toastWarning('Solo quedan 2 unidades');

// ℹ️ Info (azul)
toastInfo('Envío gratuito en pedidos +50€');

// ⏳ Loading/Promise
toastPromise(
  fetch('/api/order'),
  {
    loading: 'Procesando...',
    success: 'Pedido completado',
    error: 'Error en el pedido'
  }
);
```

## 🚀 Uso en Backend (Next.js)

### Importar funciones:

```tsx
import { toastSuccess, toastError, toastWarning, toastInfo } from '@/lib/toast';
```

### Ejemplo en un componente client:

```tsx
'use client';

import { toastSuccess, toastError } from '@/lib/toast';

export default function MyForm() {
  const handleSubmit = async () => {
    try {
      await saveProduct();
      toastSuccess('Producto guardado correctamente');
    } catch (error) {
      toastError('Error al guardar el producto');
    }
  };

  return <button onClick={handleSubmit}>Guardar</button>;
}
```

## 🎨 Características

- ✅ **No bloqueantes**: No interrumpen la navegación
- ✅ **Auto-dismissibles**: Desaparecen automáticamente
- ✅ **Posicionables**: Aparecen en la esquina superior derecha
- ✅ **Animados**: Transiciones suaves
- ✅ **Responsive**: Se adaptan a móviles
- ✅ **Accesibles**: Incluyen ARIA roles
- ✅ **Apilables**: Múltiples toasts se apilan verticalmente

## 📁 Archivos

**Frontend Astro:**
- `src/islands/Toaster.tsx` - Contenedor de toasts
- `src/lib/toast.ts` - Funciones de toast
- `src/layouts/Layout.astro` - Incluye el Toaster

**Backend Next.js:**
- `components/Toaster.tsx` - Contenedor de toasts
- `lib/toast.ts` - Funciones de toast
- `app/admin/layout.tsx` - Incluye el Toaster

## 🔧 Configuración

Los toasts están configurados con:
- **Duración**: 4 segundos (5 para errores)
- **Posición**: Superior derecha
- **Estilos**: Colores personalizados según tipo
- **Iconos**: Emoji automáticos (✅, ❌, ⚠️, etc.)

## 📝 Ejemplos de uso

### En un formulario:

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const loading = toastLoading('Enviando formulario...');

  try {
    await submitForm(data);
    loading.dismiss();
    toastSuccess('Formulario enviado correctamente');
    router.push('/success');
  } catch (error) {
    loading.dismiss();
    toastError('Error al enviar el formulario');
  }
};
```

### En una acción asincrónica:

```tsx
const addToCart = async (productId: string) => {
  await toastPromise(
    api.addToCart(productId),
    {
      loading: 'Añadiendo al carrito...',
      success: 'Producto añadido',
      error: 'No se pudo añadir el producto'
    }
  );
};
```

## 🎯 Ventajas vs alert()

| Toast Notifications | alert() del navegador |
|---------------------|----------------------|
| ✅ No bloqueantes | ❌ Bloquean la navegación |
| ✅ Diseño moderno | ❌ Diseño obsoleto |
| ✅ Personalizables | ❌ No personalizables |
| ✅ Múltiples simultáneos | ❌ Solo uno a la vez |
| ✅ Animaciones suaves | ❌ Sin animaciones |
| ✅ Responsive | ❌ Mismo aspecto en móvil |

---

**Creado**: 2026-03-11
**Librería**: react-hot-toast
