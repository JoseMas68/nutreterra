import { prisma } from '@/lib/prisma';
import ProductForm from '../ProductForm';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFormData() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return { categories, tags };
}

export default async function NewProductPage() {
  const { categories, tags } = await getFormData();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Producto</h1>
      <ProductForm categories={categories} tags={tags} />
    </div>
  );
}
