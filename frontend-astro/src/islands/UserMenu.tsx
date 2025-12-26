import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { currentUser, logout } from '../stores/authStore';

export default function UserMenu() {
  const user = useStore(currentUser);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // No renderizar hasta estar montado para evitar hidratación
  if (!mounted) {
    return (
      <a
        href="/cuenta"
        className="text-gray-700 hover:text-primary transition-colors"
        title="Mi Cuenta"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </a>
    );
  }

  // Si no hay usuario, mostrar link de login
  if (!user) {
    return (
      <a
        href="/auth/login"
        className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden lg:inline font-medium">Ingresar</span>
      </a>
    );
  }

  // Si hay usuario, mostrar menú desplegable
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden lg:inline font-medium">{user.name.split(' ')[0]}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
            <a
              href="/cuenta"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Mi Cuenta
            </a>
            <a
              href="/cuenta/pedidos"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Mis Pedidos
            </a>
            <a
              href="/cuenta/direcciones"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Direcciones
            </a>
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
