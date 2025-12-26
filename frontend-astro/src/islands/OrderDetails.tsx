import { useEffect, useState } from 'react';
import { getOrderById, type Order } from '../lib/api/orders';

const statusLabels = {
  PENDING: { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  PROCESSING: { text: 'Procesando', class: 'bg-blue-100 text-blue-800', icon: '⚙️' },
  SHIPPED: { text: 'Enviado', class: 'bg-purple-100 text-purple-800', icon: '📦' },
  DELIVERED: { text: 'Entregado', class: 'bg-green-100 text-green-800', icon: '✓' },
  CANCELLED: { text: 'Cancelado', class: 'bg-red-100 text-red-800', icon: '✗' },
};

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || 'Pedido no encontrado'}
      </div>
    );
  }

  const statusInfo = statusLabels[order.status];

  return (
    <div>
      {/* Título y Estado */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pedido #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span className={`px-6 py-3 rounded-xl text-lg font-bold ${statusInfo.class} flex items-center gap-2 w-fit`}>
            <span className="text-2xl">{statusInfo.icon}</span>
            {statusInfo.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal - Productos */}
        <div className="lg:col-span-2">
          {/* Productos del Pedido */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos</h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <img
                    src={item.product.images[0] || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Cantidad: {item.quantity}</p>
                    <p className="text-primary font-bold text-lg">
                      {item.subtotal.toFixed(2)}€
                      <span className="text-gray-500 font-normal text-sm ml-2">
                        ({item.price.toFixed(2)}€ c/u)
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Envío */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dirección de Envío</h2>

            <div className="space-y-2 text-gray-700">
              <p className="font-bold text-gray-900">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>{order.address.postalCode}, {order.address.city}</p>
              <p>{order.address.state}, {order.address.country}</p>
              <p className="text-sm text-gray-600 pt-2">{order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Columna Lateral - Resumen */}
        <div className="lg:col-span-1">
          {/* Resumen del Pedido */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{order.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Envío:</span>
                <span className="font-semibold">
                  {order.shippingCost === 0 ? 'Gratis' : `${order.shippingCost.toFixed(2)}€`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IVA (21%):</span>
                <span className="font-semibold">{order.tax.toFixed(2)}€</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-primary">{order.total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              {order.status === 'DELIVERED' && (
                <button
                  onClick={() => alert('Funcionalidad en desarrollo')}
                  className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-leaf transition-colors"
                >
                  Repetir Pedido
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Imprimir Pedido
              </button>
              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <button
                  onClick={() => alert('Para cancelar tu pedido, contacta con soporte')}
                  className="w-full px-6 py-3 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Solicitar Cancelación
                </button>
              )}
            </div>

            {/* Ayuda */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">¿Necesitas ayuda con tu pedido?</p>
              <a
                href="/contacto"
                className="text-primary hover:text-leaf font-semibold text-sm transition-colors"
              >
                Contactar con Soporte →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
