import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getProductLines() {
  return await prisma.productLine.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export default async function ProductLinesPage() {
  const productLines = await getProductLines();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Líneas de Producto</h1>
        <Link
          href="/admin/product-lines/new"
          className="bg-[#7FB14B] hover:bg-[#4A7D36] text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Nueva Línea
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
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
            {productLines.map((line) => (
              <tr key={line.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="w-8 h-8 text-[#7FB14B]"
                    dangerouslySetInnerHTML={{ __html: line.icon }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {line.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {line.slug}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-md">
                    {line.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {line._count.products} productos
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    line.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {line.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/product-lines/${line.id}`}
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

        {productLines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay líneas de producto todavía</p>
            <Link
              href="/admin/product-lines/new"
              className="mt-4 inline-block text-[#7FB14B] hover:text-[#4A7D36]"
            >
              Crear la primera línea
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
