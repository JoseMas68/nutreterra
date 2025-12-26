import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { favoriteIds, toggleFavorite, type FavoriteProduct } from '../stores/favoritesStore';

interface FavoriteButtonProps {
  product: FavoriteProduct;
}

export default function FavoriteButton({ product }: FavoriteButtonProps) {
  const favorites = useStore(favoriteIds);
  const [mounted, setMounted] = useState(false);
  const isFavorite = favorites.includes(product.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    toggleFavorite(product);
  };

  if (!mounted) {
    return (
      <button
        className="w-14 h-14 flex items-center justify-center border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
        title="Añadir a favoritos"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl transition-all ${
        isFavorite
          ? 'bg-primary border-primary text-white hover:bg-leaf hover:border-leaf'
          : 'border-primary text-primary hover:bg-primary hover:text-white'
      }`}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
