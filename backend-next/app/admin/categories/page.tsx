import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <Link
          href="/admin/categories/new"
          className="bg-[#7FB14B] hover:bg-[#4A7D36] text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Nueva Categoría
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-md">
                    {category.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category._count.products} productos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/categories/${category.id}`}
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

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay categorías todavía</p>
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-block text-[#7FB14B] hover:text-[#4A7D36]"
            >
              Crear la primera categoría
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
