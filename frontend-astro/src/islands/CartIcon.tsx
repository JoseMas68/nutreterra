// Island interactivo: Icono de carrito con contador
import { useState } from 'react';

export default function CartIcon() {
  // Por ahora un valor hardcoded, luego conectar con estado global
  const [cartCount] = useState(3);

  const handleClick = () => {
    alert('Funcionalidad de carrito en desarrollo. Próximamente disponible!');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Carrito de compras"
    >
      {/* Icono de carrito (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      {/* Contador */}
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
}
