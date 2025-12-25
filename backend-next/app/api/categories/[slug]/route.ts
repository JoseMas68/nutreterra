import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            active: true,
          },
          include: {
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy: {
            featured: 'desc',
          },
        },
      },
    });

    if (!category || !category.active) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    // Formatear la respuesta
    const formattedCategory = {
      ...category,
      products: category.products.map((product) => ({
        ...product,
        tags: product.tags.map((pt) => pt.tag),
      })),
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json({ error: 'Error al obtener categoría' }, { status: 500 });
  }
}
