# NutreTerra – Tienda Online de Productos y Cocina Natural

## Descripción

NutreTerra es una plataforma e-commerce especializada en productos naturales y cocina saludable. El proyecto está diseñado con enfoque en rendimiento, SEO y control total sobre la experiencia del usuario.

## Stack Tecnológico

### Frontend
- **Astro** – Framework principal para generación estática y SSR
- **TypeScript** – Tipado estático
- **TailwindCSS** – Estilos utilitarios
- **React/Preact** – Islands para componentes interactivos

### Backend
- **Next.js (App Router)** – API REST y lógica de negocio
- **Prisma** – ORM para base de datos
- **PostgreSQL** – Base de datos relacional
- **NextAuth.js** – Autenticación
- **Stripe/Redsys** – Procesamiento de pagos

### Monorepo
- **Shared** – Tipos, constantes y schemas compartidos
- **Docs** – Documentación del proyecto

## Estructura del Proyecto

```
nutreterra/
├── frontend-astro/      # Aplicación frontend con Astro
├── backend-next/        # API y lógica de negocio con Next.js
├── shared/              # Código compartido entre frontend y backend
├── docs/                # Documentación técnica y arquitectura
└── README.md            # Este archivo
```

## Módulos Principales

### Frontend (Astro)
- **Responsabilidad**: Presentación, SEO, experiencia de usuario
- **Características**:
  - Generación estática para páginas de productos y categorías
  - SSR para páginas dinámicas (carrito, checkout)
  - Islands para interactividad específica
  - Optimización de imágenes y assets

### Backend (Next.js)
- **Responsabilidad**: API REST, autenticación, pagos, gestión de datos
- **Características**:
  - Endpoints públicos (productos, categorías)
  - Endpoints privados (carrito, pedidos, pagos)
  - Integración con Stripe/Redsys
  - Webhooks para eventos de pago
  - Middleware de autenticación

### Shared
- **Responsabilidad**: Evitar duplicación de código
- **Contenido**:
  - Tipos TypeScript compartidos
  - Schemas de validación (Zod)
  - Constantes globales

## Cómo Arrancar el Proyecto

### Requisitos Previos
- Node.js v18 o superior
- PostgreSQL instalado y corriendo
- Git

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]

# Instalar dependencias del frontend
cd frontend-astro
npm install

# Instalar dependencias del backend
cd ../backend-next
npm install
```

### Variables de Entorno
Configurar archivos `.env` en cada módulo (frontend y backend) según `.env.example`

### Desarrollo
```bash
# Terminal 1: Frontend (puerto 4321)
cd frontend-astro
npm run dev

# Terminal 2: Backend (puerto 3000)
cd backend-next
npm run dev
```

## Principios del Proyecto

### 1. SEO-First
- Páginas estáticas generadas en build time
- Meta tags optimizados
- URLs amigables
- Sitemap automático

### 2. Rendimiento
- Lazy loading de imágenes
- Code splitting automático
- Caché estratégico
- Minimización de JavaScript en cliente

### 3. Control Total
- Sin dependencia de plataformas de terceros
- Base de datos propia
- Gestión completa de usuarios y pedidos
- Flexibilidad para personalizaciones

### 4. Escalabilidad
- Arquitectura modular
- Separación clara de responsabilidades
- Código reutilizable vía shared/
- Fácil extensión de funcionalidades

## Documentación Adicional

- [Arquitectura del Sistema](docs/arquitectura.md)
- [Flujo de Compra](docs/flujo-compra.md)
- [Modelo de Datos](docs/modelo-datos.md)
- [Convenciones de Código](docs/convenciones.md)

## Estado del Proyecto

🚧 **En Desarrollo** – Estructura inicial y documentación

## Contacto y Soporte

Para dudas o sugerencias, consultar la documentación en `docs/` o revisar los README específicos de cada módulo.
