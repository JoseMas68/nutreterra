import { addCartItem } from '../stores/cartStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fat?: number | null;
}

interface AddToCartButtonProps {
  product: Product;
  stock: number;
}

export default function AddToCartButton({ product, stock }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    if (stock === 0) return;

    addCartItem(product);

    // Mostrar feedback visual
    const button = document.getElementById('add-to-cart-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Añadido al carrito';
      button.classList.add('bg-green-600');
      button.classList.remove('bg-primary');

      setTimeout(() => {
        button.textContent = originalText || 'Añadir al Carrito';
        button.classList.remove('bg-green-600');
        button.classList.add('bg-primary');
      }, 2000);
    }
  };

  return (
    <button
      id="add-to-cart-btn"
      onClick={handleAddToCart}
      disabled={stock === 0}
      className="flex-1 px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-leaf transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
    </button>
  );
}
