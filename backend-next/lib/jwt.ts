import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nutreterra-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 días

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
}
