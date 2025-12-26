import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return order;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-[#7FB14B] hover:text-[#4A7D36] text-sm"
        >
          ← Volver a pedidos
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pedido #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 text-sm font-semibold rounded-full ${
            statusColors[order.status as keyof typeof statusColors]
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos del pedido */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Productos</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.price.toFixed(2)}€ × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                  €
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-900">{order.shippingCost.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{order.total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {order.notes && (
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold mb-2">Notas del pedido</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Información del cliente y envío */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Cliente</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-900">
                  {order.user.name || 'Usuario'}
                </span>
              </div>
              <div className="text-gray-600">{order.user.email}</div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Dirección de envío</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.street}</p>
              <p>
                {order.address.postalCode} {order.address.city}
              </p>
              <p>{order.address.state}</p>
              <p>{order.address.country}</p>
              {order.address.phone && (
                <p className="mt-2">Tel: {order.address.phone}</p>
              )}
            </div>
          </div>

          {/* Información de pago */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Pago</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Método:</span>
                <span className="text-gray-900 capitalize">
                  {order.paymentMethod.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === 'PAID'
                      ? 'text-green-600'
                      : order.paymentStatus === 'PENDING'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {order.paymentStatus === 'PAID'
                    ? 'Pagado'
                    : order.paymentStatus === 'PENDING'
                    ? 'Pendiente'
                    : 'Fallido'}
                </span>
              </div>
              {order.stripePaymentIntentId && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-xs">ID Pago:</span>
                  <p className="text-gray-900 text-xs break-all">
                    {order.stripePaymentIntentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Acciones</h2>
            <div className="space-y-2">
              <button className="w-full bg-[#7FB14B] hover:bg-[#4A7D36] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Cambiar estado
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Imprimir factura
              </button>
              <button className="w-full border border-red-300 hover:bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Cancelar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
