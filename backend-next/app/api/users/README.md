# API de Gestión de Usuarios

Endpoints para gestionar usuarios y sus direcciones en NutreTerra.

## Autenticación

Todos los endpoints requieren autenticación mediante NextAuth. El token de sesión debe estar presente en las cookies.

## Endpoints de Usuarios

### 1. Listar Usuarios (Solo Admin)

```http
GET /api/users
```

**Permisos:** Solo administradores

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 10)
- `search` (opcional): Buscar por nombre o email
- `role` (opcional): Filtrar por rol (ADMIN | CUSTOMER)

**Respuesta exitosa (200):**
```json
{
  "users": [
    {
      "id": "user_id",
      "email": "usuario@example.com",
      "name": "Nombre Usuario",
      "role": "CUSTOMER",
      "image": null,
      "emailVerified": null,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z",
      "_count": {
        "orders": 5,
        "reviews": 3,
        "addresses": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Obtener Usuario por ID

```http
GET /api/users/{id}
```

**Permisos:** El propio usuario o administrador

**Respuesta exitosa (200):**
```json
{
  "id": "user_id",
  "email": "usuario@example.com",
  "name": "Nombre Usuario",
  "role": "CUSTOMER",
  "image": null,
  "emailVerified": null,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### 3. Actualizar Usuario

```http
PUT /api/users/{id}
```

**Permisos:** El propio usuario o administrador

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "image": "url_de_imagen",
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

**Notas:**
- Todos los campos son opcionales
- Para cambiar la contraseña se requieren `currentPassword` y `newPassword`
- La nueva contraseña debe tener al menos 6 caracteres
- Si se cambia el email, debe ser único

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario actualizado correctamente",
  "user": {
    "id": "user_id",
    "email": "nuevo@email.com",
    "name": "Nuevo Nombre",
    "role": "CUSTOMER",
    "image": "url_de_imagen",
    "emailVerified": null,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### 4. Eliminar Usuario (Solo Admin)

```http
DELETE /api/users/{id}
```

**Permisos:** Solo administradores

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

## Endpoints de Direcciones

### 5. Listar Direcciones del Usuario

```http
GET /api/users/{id}/addresses
```

**Permisos:** El propio usuario o administrador

**Respuesta exitosa (200):**
```json
{
  "addresses": [
    {
      "id": "address_id",
      "userId": "user_id",
      "firstName": "Juan",
      "lastName": "Pérez",
      "street": "Calle Principal 123",
      "city": "Madrid",
      "state": "Madrid",
      "postalCode": "28001",
      "country": "ES",
      "phone": "+34 600 000 000",
      "isDefault": true,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### 6. Crear Nueva Dirección

```http
POST /api/users/{id}/addresses
```

**Permisos:** El propio usuario o administrador

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "street": "Calle Principal 123",
  "city": "Madrid",
  "state": "Madrid",
  "postalCode": "28001",
  "country": "ES",
  "phone": "+34 600 000 000",
  "isDefault": false
}
```

**Notas:**
- Todos los campos excepto `country` e `isDefault` son requeridos
- `country` por defecto es "ES"
- Si es la primera dirección, automáticamente se marca como predeterminada
- Si se marca como predeterminada, las demás se desmarcan

**Respuesta exitosa (200):**
```json
{
  "message": "Dirección creada correctamente",
  "address": {
    "id": "address_id",
    "userId": "user_id",
    "firstName": "Juan",
    "lastName": "Pérez",
    "street": "Calle Principal 123",
    "city": "Madrid",
    "state": "Madrid",
    "postalCode": "28001",
    "country": "ES",
    "phone": "+34 600 000 000",
    "isDefault": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

### 7. Actualizar Dirección

```http
PUT /api/users/{id}/addresses/{addressId}
```

**Permisos:** El propio usuario o administrador

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez García",
  "street": "Calle Secundaria 456",
  "city": "Barcelona",
  "state": "Barcelona",
  "postalCode": "08001",
  "country": "ES",
  "phone": "+34 611 111 111",
  "isDefault": true
}
```

**Notas:**
- Todos los campos son opcionales
- Si se marca como predeterminada, las demás se desmarcan automáticamente

**Respuesta exitosa (200):**
```json
{
  "message": "Dirección actualizada correctamente",
  "address": {
    "id": "address_id",
    "userId": "user_id",
    "firstName": "Juan",
    "lastName": "Pérez García",
    "street": "Calle Secundaria 456",
    "city": "Barcelona",
    "state": "Barcelona",
    "postalCode": "08001",
    "country": "ES",
    "phone": "+34 611 111 111",
    "isDefault": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:45:00Z"
  }
}
```

### 8. Eliminar Dirección

```http
DELETE /api/users/{id}/addresses/{addressId}
```

**Permisos:** El propio usuario o administrador

**Notas:**
- Si se elimina la dirección predeterminada, automáticamente se marca la siguiente como predeterminada

**Respuesta exitosa (200):**
```json
{
  "message": "Dirección eliminada correctamente"
}
```

## Códigos de Error

- `401` - No autorizado (no hay sesión activa)
- `403` - Prohibido (sin permisos suficientes)
- `404` - No encontrado (recurso no existe)
- `400` - Solicitud incorrecta (datos inválidos)
- `500` - Error del servidor

## Ejemplos de Uso

### Actualizar perfil de usuario

```javascript
const response = await fetch('/api/users/user_123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Juan Pérez',
    email: 'juan@example.com'
  })
});

const data = await response.json();
console.log(data.message); // "Usuario actualizado correctamente"
```

### Cambiar contraseña

```javascript
const response = await fetch('/api/users/user_123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    currentPassword: 'mi_contraseña_actual',
    newPassword: 'mi_nueva_contraseña_segura'
  })
});

const data = await response.json();
```

### Crear dirección

```javascript
const response = await fetch('/api/users/user_123/addresses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    street: 'Calle Principal 123, Piso 4, Puerta B',
    city: 'Madrid',
    state: 'Madrid',
    postalCode: '28001',
    phone: '+34 600 000 000',
    isDefault: true
  })
});

const data = await response.json();
```
