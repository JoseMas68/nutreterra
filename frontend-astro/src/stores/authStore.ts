import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

// Estado de autenticación persistente
export const authToken = persistentAtom<string | null>('authToken', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const currentUser = persistentAtom<User | null>('currentUser', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const isAuthenticated = atom<boolean>(false);

// Actualizar estado de autenticación cuando cambie el token
authToken.subscribe((token) => {
  isAuthenticated.set(!!token);
});

// Función para hacer login
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al iniciar sesión' };
    }

    // Guardar token y usuario en localStorage
    authToken.set(data.token);
    currentUser.set(data.user);

    // También guardar en cookie para que el backend pueda leerlo
    document.cookie = `authToken=${data.token}; path=/; max-age=604800; sameSite=lax`;

    return { success: true };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error de conexión' };
  }
}

// Función para hacer registro
export async function register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al registrarse' };
    }

    // Guardar token y usuario en localStorage
    authToken.set(data.token);
    currentUser.set(data.user);

    // También guardar en cookie para que el backend pueda leerlo
    document.cookie = `authToken=${data.token}; path=/; max-age=604800; sameSite=lax`;

    return { success: true };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: 'Error de conexión' };
  }
}

// Función para hacer logout
export function logout() {
  authToken.set(null);
  currentUser.set(null);
  isAuthenticated.set(false);

  // También eliminar la cookie
  document.cookie = 'authToken=; path=/; max-age=0';
}
