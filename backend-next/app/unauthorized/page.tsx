import { redirect } from 'next/navigation';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321';

export default function UnauthorizedPage() {
  redirect(FRONTEND_URL);
}
