import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { authToken } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const token = useStore(authToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      window.location.href = redirectTo;
    }
  }, [mounted, token, redirectTo]);

  // No renderizar nada hasta estar montado
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay token, mostrar loading mientras redirige
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si hay token, renderizar el contenido
  return <>{children}</>;
}
