import { useState } from 'react';
import { addCartItem } from '../stores/cartStore';
import { addToFavorites, removeFromFavorites, favoriteIds } from '../stores/favoritesStore';
import { useStore } from '@nanostores/react';
import { currentUser } from '../stores/authStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  images?: string[];
  shortDescription?: string;
  stock: number;
  featured?: boolean;
  productLine?: {
    id: string;
    name: string;
  };
  tags?: Array<string | { name: string }>;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const user = useStore(currentUser);
  const favIds = useStore(favoriteIds);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const isFavorite = favIds.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    setIsAddingToCart(true);

    // Agregar al carrito
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      calories: product.calories,
      protein: product.protein,
      carbohydrates: product.carbohydrates,
      fat: product.fat,
    }, 1);

    // Mostrar mensaje de confirmación
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
      setIsAddingToCart(false);
    }, 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        slug: product.slug,
      });
    }
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 md:hover:-translate-y-2 relative">
      {/* Botón de favoritos */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md md:shadow-lg hover:scale-110 transition-transform"
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <svg
          className={`w-4 h-4 md:w-6 md:h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Imagen */}
      <a href={`/producto/${product.slug}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-accent text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold text-xs md:text-sm shadow-md md:shadow-lg">
            -{discountPercentage}%
          </span>
        )}
      </a>

      {/* Contenido */}
      <div className="p-3 md:p-6">
        <a href={`/producto/${product.slug}`} className="block">
          {/* Línea de producto como badge profesional */}
          {product.productLine && (
            <span className="inline-block text-[10px] md:text-xs font-semibold text-primary uppercase tracking-wide mb-1 md:mb-2">
              {product.productLine.name}
            </span>
          )}

          {/* Nombre del producto */}
          <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 hover:text-primary transition-colors leading-tight line-clamp-2 md:min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Descripción corta - oculta en móvil */}
          <p className="hidden md:block text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.shortDescription || ''}
          </p>

          {/* Tags - ocultos en móvil */}
          <div className="hidden md:flex flex-wrap gap-2 mb-3 min-h-[2rem]">
            {product.tags && product.tags.length > 0 && product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-gray-700 border border-gray-300 px-2.5 py-1 rounded-full h-fit"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </a>

        {/* Precio y acciones */}
        <div className="flex items-end justify-between pt-2 md:pt-4 border-t border-gray-100 mt-2">
          <div className="flex flex-col">
            {product.compareAtPrice && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {product.compareAtPrice.toFixed(2)}€
              </span>
            )}
            <span className="text-lg md:text-2xl font-bold text-primary">
              {product.price.toFixed(2)}€
            </span>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddingToCart}
            className={`px-2 md:px-9 py-1.5 md:py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base ${
              product.stock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : showAddedMessage
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-leaf hover:shadow-lg'
            }`}
            title={product.stock <= 0 ? 'Producto agotado' : 'Agregar al carrito'}
          >
            {showAddedMessage ? (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Stock info */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-accent font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            ¡Solo {product.stock} disponibles!
          </div>
        )}
        {product.stock === 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-600 font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Agotado
          </div>
        )}
      </div>

      {/* Mensaje de agregado al carrito */}
      {showAddedMessage && (
        <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-center animate-fade-in">
          ✓ Agregado al carrito
        </div>
      )}
    </div>
  );
}
