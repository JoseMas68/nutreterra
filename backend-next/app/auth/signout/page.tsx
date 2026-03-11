'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4321';

export default function SignOutPage() {
  useEffect(() => {
    // Cerrar sesión y redirigir al frontend
    signOut({ callbackUrl: FRONTEND_URL });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E8D8] to-[#7FB14B]/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FB14B] mx-auto"></div>
        <p className="mt-4 text-gray-600">Cerrando sesión...</p>
      </div>
    </div>
  );
}
