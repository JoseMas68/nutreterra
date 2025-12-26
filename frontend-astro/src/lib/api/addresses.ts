// Cliente de API para gestión de direcciones

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone: string;
  isDefault?: boolean;
}

export interface UpdateAddressData {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

// Obtener URL base del backend
const getBackendUrl = () => {
  // En desarrollo, usar el backend local de Next.js
  // En producción, usar la variable de entorno
  return import.meta.env.PUBLIC_API_URL || import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

// Obtener el token de autenticación
const getAuthToken = (): string | null => {
  // Intentar obtener el token de localStorage
  try {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      return JSON.parse(tokenData);
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return null;
};

// Obtener headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Obtener todas las direcciones del usuario
 */
export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/users/${userId}/addresses`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener las direcciones');
    }

    const data = await response.json();
    return data.addresses;
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    throw error;
  }
}

/**
 * Crear una nueva dirección
 */
export async function createAddress(
  userId: string,
  addressData: CreateAddressData
): Promise<Address> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/users/${userId}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear la dirección');
    }

    const data = await response.json();
    return data.address;
  } catch (error) {
    console.error('Error al crear dirección:', error);
    throw error;
  }
}

/**
 * Actualizar una dirección existente
 */
export async function updateAddress(
  userId: string,
  addressId: string,
  addressData: UpdateAddressData
): Promise<Address> {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/users/${userId}/addresses/${addressId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(addressData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar la dirección');
    }

    const data = await response.json();
    return data.address;
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    throw error;
  }
}

/**
 * Eliminar una dirección
 */
export async function deleteAddress(userId: string, addressId: string): Promise<void> {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/users/${userId}/addresses/${addressId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar la dirección');
    }
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    throw error;
  }
}
