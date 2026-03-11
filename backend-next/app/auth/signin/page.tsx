'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E8D8] to-[#7FB14B]/10">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
        {/* Banner de Sitio de Prueba */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-amber-500 p-4 rounded-md">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-amber-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-amber-800">
                ⚠️ Sitio de Prueba
              </h3>
              <div className="mt-1 text-xs text-amber-700">
                <p>Entorno de demostración. Los usuarios y datos se eliminan automáticamente cada 24 horas.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NutreTerra
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel de Administración
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#7FB14B] focus:border-[#7FB14B] focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#7FB14B] focus:border-[#7FB14B] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-center mb-3">
              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964a6 6 0 117.072 0l-.543.543a5.001 5.001 0 00-6.783 6.783l-1 1z" />
              </svg>
              <p className="text-sm font-bold text-blue-900">🔑 CREDENCIALES DE ADMIN</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="bg-white rounded-md p-2 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-1">📧 Email</p>
                <p className="text-sm font-mono font-bold text-gray-900">admin@nutreterra.es</p>
              </div>
              <div className="bg-white rounded-md p-2 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-1">🔒 Contraseña</p>
                <p className="text-sm font-mono font-bold text-gray-900">admin123</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7FB14B] hover:bg-[#4A7D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FB14B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E8D8] to-[#7FB14B]/10">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
          {/* Banner de Sitio de Prueba - Skeleton */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-amber-500 p-4 rounded-md">
            <div className="animate-pulse">
              <div className="h-4 bg-amber-300 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-amber-200 rounded w-full"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
