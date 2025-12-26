import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { favoriteProducts, removeFromFavorites } from '../stores/favoritesStore';

export default function FavoritesList() {
  const favorites = useStore(favoriteProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No tienes productos favoritos todavía
          </h2>
          <p className="text-gray-600 mb-8">
            Explora nuestra tienda y guarda los productos que te interesen para encontrarlos fácilmente más tarde
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/productos"
              className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-leaf transition-colors shadow-lg hover:shadow-xl"
            >
              Explorar Productos
            </a>
            <a
              href="/lineas"
              className="px-8 py-4 border-2 border-primary text-primary font-bold text-lg rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              Ver Líneas de Producto
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {favorites.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
          <div className="relative">
            <a href={`/producto/${product.slug}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </a>
            <button
              onClick={() => removeFromFavorites(product.id)}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors group/btn"
              title="Quitar de favoritos"
            >
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          <div className="p-4">
            <a href={`/producto/${product.slug}`}>
              <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">{product.name}</h3>
            </a>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)}€</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.compareAtPrice.toFixed(2)}€
                  </span>
                )}
              </div>
              <a
                href={`/producto/${product.slug}`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-leaf transition-colors font-medium text-sm"
              >
                Ver Producto
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
