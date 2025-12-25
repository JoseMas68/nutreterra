import { persistentMap } from '@nanostores/persistent';

export interface CartItem {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
}

export const cartItems = persistentMap<Record<string, CartItem>>('cart:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function addCartItem(product: any, quantity: number = 1) {
  const existingEntry = cartItems.get()[product.id];
  if (existingEntry) {
    cartItems.setKey(product.id, {
      ...existingEntry,
      quantity: existingEntry.quantity + quantity,
    });
  } else {
    cartItems.setKey(product.id, {
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        calories: product.calories,
        protein: product.protein,
        carbohydrates: product.carbohydrates,
        fat: product.fat,
      },
    });
  }
}

export function removeCartItem(productId: string) {
  const current = cartItems.get();
  const { [productId]: _, ...rest } = current;
  cartItems.set(rest);
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const existingEntry = cartItems.get()[productId];
  if (existingEntry) {
    if (quantity <= 0) {
      removeCartItem(productId);
    } else {
      cartItems.setKey(productId, {
        ...existingEntry,
        quantity,
      });
    }
  }
}

export function clearCart() {
  cartItems.set({});
}
