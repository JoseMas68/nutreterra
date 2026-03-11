import { cookies } from 'next/headers';
import { verifyToken, type UserPayload } from './jwt';

export async function getAuthUserFromCookie(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function requireAdminFromCookie(): Promise<UserPayload | null> {
  const user = await getAuthUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return user;
}
