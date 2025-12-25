import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Formatear la respuesta con el conteo de productos
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      order: category.order,
      productCount: category._count.products,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}
