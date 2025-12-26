import { NextRequest } from 'next/server';
import { verifyToken, type JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware para verificar autenticación JWT
 * Extrae el token del header Authorization o de las cookies
 */
export function getAuthUser(request: NextRequest): JWTPayload | null {
  // Intentar obtener token del header Authorization
  const authHeader = request.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Si no hay token en el header, intentar obtenerlo de las cookies
  if (!token) {
    token = request.cookies.get('authToken')?.value || null;
  }

  if (!token) {
    return null;
  }

  // Verificar y decodificar el token
  return verifyToken(token);
}

/**
 * Verificar si el usuario está autenticado
 */
export function requireAuth(request: NextRequest): JWTPayload {
  const user = getAuthUser(request);

  if (!user) {
    throw new Error('No autorizado');
  }

  return user;
}

/**
 * Verificar si el usuario es administrador
 */
export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);

  if (user.role !== 'ADMIN') {
    throw new Error('Se requieren permisos de administrador');
  }

  return user;
}

/**
 * Verificar si el usuario puede acceder al recurso
 * (el usuario puede acceder a sus propios recursos o ser admin)
 */
export function requireOwnerOrAdmin(
  request: NextRequest,
  resourceUserId: string
): JWTPayload {
  const user = requireAuth(request);

  if (user.userId !== resourceUserId && user.role !== 'ADMIN') {
    throw new Error('No tienes permiso para acceder a este recurso');
  }

  return user;
}
