import { useEffect, useState } from 'react';
import { getUserOrders, type Order } from '../lib/api/orders';

const statusLabels = {
  PENDING: { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  PROCESSING: { text: 'Procesando', class: 'bg-blue-100 text-blue-800', icon: '⚙️' },
  SHIPPED: { text: 'Enviado', class: 'bg-purple-100 text-purple-800', icon: '📦' },
  DELIVERED: { text: 'Entregado', class: 'bg-green-100 text-green-800', icon: '✓' },
  CANCELLED: { text: 'Cancelado', class: 'bg-red-100 text-red-800', icon: '✗' },
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserOrders(filterStatus || undefined);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por estado
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los pedidos</option>
          <option value="PENDING">Pendientes</option>
          <option value="PROCESSING">Procesando</option>
          <option value="SHIPPED">Enviados</option>
          <option value="DELIVERED">Entregados</option>
          <option value="CANCELLED">Cancelados</option>
        </select>
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-24 w-24"
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
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes pedidos todavía
          </h3>
          <p className="text-gray-600 mb-6">
            Cuando realices tu primer pedido, aparecerá aquí
          </p>
          <a
            href="/productos"
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-leaf transition-colors"
          >
            Explorar Productos
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = statusLabels[order.status as keyof typeof statusLabels];
            const firstImage = order.items[0]?.product?.images?.[0] || '';

            return (
              <a
                key={order.id}
                href={`/cuenta/pedidos/${order.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-primary"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen del primer producto */}
                  {firstImage && (
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img
                        src={firstImage}
                        alt={order.items[0].product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Información del pedido */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Pedido #{order.orderNumber}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold ${statusInfo.class} flex items-center gap-2 w-fit`}
                      >
                        <span>{statusInfo.icon}</span>
                        {statusInfo.text}
                      </span>
                    </div>

                    {/* Productos */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm">
                        {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                        {order.items.length > 1 && (
                          <span className="text-gray-500">
                            {' '}
                            · {order.items[0].product.name}
                            {order.items.length > 1 && ` y ${order.items.length - 1} más`}
                          </span>
                        )}
                        {order.items.length === 1 && (
                          <span className="text-gray-500"> · {order.items[0].product.name}</span>
                        )}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">
                        {order.total.toFixed(2)}€
                      </p>
                      <button className="text-primary hover:text-leaf font-semibold transition-colors flex items-center gap-2">
                        Ver detalles
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
