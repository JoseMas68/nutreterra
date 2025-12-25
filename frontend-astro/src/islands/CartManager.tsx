import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  stock: number;
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
}

interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export default function CartManager({ apiUrl }: { apiUrl: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      // Cargar items pendientes de localStorage (desde el planificador)
      const pendingItems = localStorage.getItem('pendingCartItems');
      if (pendingItems) {
        const items: CartItem[] = JSON.parse(pendingItems);

        // Cargar información de productos
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(`${apiUrl}/api/products`);
              const products: Product[] = await response.json();
              const product = products.find(p => p.id === item.productId);
              return { ...item, product };
            } catch (error) {
              console.error('Error loading product:', error);
              return item;
            }
          })
        );

        setCartItems(itemsWithProducts.filter(item => item.product));
        localStorage.removeItem('pendingCartItems');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTotalMacros = () => {
    return cartItems.reduce(
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
          <p className="mt-2 text-gray-600">Añade productos desde el planificador o el catálogo</p>
          <div className="mt-6 flex gap-4 justify-center">
            <a
              href="/planificador"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors"
            >
              Ir al Planificador
            </a>
            <a
              href="/productos"
              className="px-6 py-3 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Productos
            </a>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const totalMacros = calculateTotalMacros();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos ({cartItems.length})</h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Vaciar Carrito
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => {
                if (!item.product) return null;

                return (
                  <div key={item.productId} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.calories && `${item.product.calories} kcal`}
                        {item.product.protein && ` • ${item.product.protein}g proteína`}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.product.price.toFixed(2)}€ / ud.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>

            {/* Macros totales */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-leaf/10 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Totales Nutricionales</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-bold text-primary">{totalMacros.calories.toFixed(0)}</div>
                  <div className="text-gray-600 text-xs">kcal</div>
                </div>
                <div>
                  <div className="font-bold text-blue-600">{totalMacros.protein.toFixed(1)}g</div>
                  <div className="text-gray-600 text-xs">Proteínas</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">{totalMacros.carbohydrates.toFixed(1)}g</div>
                  <div className="text-gray-600 text-xs">Carbohidratos</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600">{totalMacros.fat.toFixed(1)}g</div>
                  <div className="text-gray-600 text-xs">Grasas</div>
                </div>
              </div>
            </div>

            {/* Desglose de precio */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">GRATIS</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <a
              href="/checkout"
              className="block w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors text-center"
            >
              Proceder al Pago
            </a>

            <a
              href="/productos"
              className="block w-full mt-3 px-6 py-3 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Seguir Comprando
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
