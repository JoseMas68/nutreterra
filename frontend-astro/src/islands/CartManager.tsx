import { useStore } from '@nanostores/react';
import { cartItems, removeCartItem, updateCartItemQuantity, clearCart } from '../stores/cartStore';

export default function CartManager({ apiUrl }: { apiUrl: string }) {
  const $cartItems = useStore(cartItems);
  const items = Object.values($cartItems);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTotalMacros = () => {
    return items.reduce(
      (totals, item) => {
        const product = item.product;
        if (!product) return totals;

        return {
          calories: totals.calories + (product.calories || 0) * item.quantity,
          protein: totals.protein + (product.protein || 0) * item.quantity,
          carbohydrates: totals.carbohydrates + (product.carbohydrates || 0) * item.quantity,
          fat: totals.fat + (product.fat || 0) * item.quantity,
        };
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );
  };

  const totalMacros = calculateTotalMacros();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">
            ¡Empieza a añadir deliciosos platos saludables!
          </p>
          <a
            href="/productos"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-leaf transition-colors"
          >
            Ver Productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl shadow-md p-3 md:p-4 flex items-center gap-2 md:gap-4"
            >
              <img
                src={item.product?.imageUrl}
                alt={item.product?.name}
                className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-lg text-gray-900 mb-1 line-clamp-2">
                  {item.product?.name}
                </h3>
                <p className="text-primary font-bold text-base md:text-lg">
                  {item.product?.price.toFixed(2)}€
                </p>
                {item.product?.calories && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {item.product.calories} kcal
                  </p>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                    className="px-2 md:px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium text-gray-900 w-6 md:w-8 text-center text-sm md:text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                    className="px-2 md:px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeCartItem(item.productId)}
                  className="text-red-500 hover:bg-red-50 p-1.5 md:p-2 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{calculateTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{calculateTotal().toFixed(2)}€</span>
              </div>
            </div>

            {/* Resumen Nutricional */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Información Nutricional Total</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block">Calorías</span>
                  <span className="font-medium">{Math.round(totalMacros.calories)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Proteínas</span>
                  <span className="font-medium">{Math.round(totalMacros.protein)}g</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Carbos</span>
                  <span className="font-medium">{Math.round(totalMacros.carbohydrates)}g</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Grasas</span>
                  <span className="font-medium">{Math.round(totalMacros.fat)}g</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Checkout próximamente!')}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-leaf transition-colors shadow-md hover:shadow-lg"
            >
              Tramitar Pedido
            </button>
            
            <button
              onClick={clearCart}
              className="w-full mt-3 text-gray-500 text-sm hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
