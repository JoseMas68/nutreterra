import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../ProductForm';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProductData(id: string) {
  const [product, categories, tags] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return { product, categories, tags };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, categories, tags } = await getProductData(id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Producto</h1>
      <ProductForm product={product} categories={categories} tags={tags} />
    </div>
  );
}
