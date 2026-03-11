import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nutreterra-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 días

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check for token in cookies for browser requests
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const authTokenCookie = cookies.find(c => c.startsWith('authToken='));
    if (authTokenCookie) {
      return authTokenCookie.substring('authToken='.length);
    }
  }

  return null;
}
