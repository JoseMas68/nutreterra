import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#7FB14B] hover:bg-[#4A7D36] text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.shortDescription}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price.toFixed(2)}€
                  {product.compareAtPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.compareAtPrice.toFixed(2)}€
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${
                    product.stock === 0 ? 'text-red-600 font-semibold' :
                    product.stock < 10 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-[#7FB14B] hover:text-[#4A7D36] mr-4"
                  >
                    Editar
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos todavía</p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-block text-[#7FB14B] hover:text-[#4A7D36]"
            >
              Crear el primer producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
