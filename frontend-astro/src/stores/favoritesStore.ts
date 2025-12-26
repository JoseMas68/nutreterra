import { persistentAtom } from '@nanostores/persistent';

export interface FavoriteProduct {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number | null;
}

// Lista de IDs de productos favoritos
export const favoriteIds = persistentAtom<string[]>('favoriteIds', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Información completa de productos favoritos
export const favoriteProducts = persistentAtom<FavoriteProduct[]>('favoriteProducts', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Verificar si un producto está en favoritos
export function isFavorite(productId: string): boolean {
  return favoriteIds.get().includes(productId);
}

// Añadir producto a favoritos
export function addToFavorites(product: FavoriteProduct) {
  const ids = favoriteIds.get();
  const products = favoriteProducts.get();

  if (!ids.includes(product.id)) {
    favoriteIds.set([...ids, product.id]);
    favoriteProducts.set([...products, product]);
  }
}

// Quitar producto de favoritos
export function removeFromFavorites(productId: string) {
  const ids = favoriteIds.get();
  const products = favoriteProducts.get();

  favoriteIds.set(ids.filter(id => id !== productId));
  favoriteProducts.set(products.filter(p => p.id !== productId));
}

// Toggle favorito
export function toggleFavorite(product: FavoriteProduct) {
  if (isFavorite(product.id)) {
    removeFromFavorites(product.id);
  } else {
    addToFavorites(product);
  }
}

// Limpiar favoritos
export function clearFavorites() {
  favoriteIds.set([]);
  favoriteProducts.set([]);
}
