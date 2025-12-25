import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const where: any = {
      active: true,
    };

    // Filtro por categoría
    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    // Filtro por destacados
    if (featured === 'true') {
      where.featured = true;
    }

    // Búsqueda por nombre o descripción
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
        productLines: {
          include: {
            productLine: {
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
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Formatear la respuesta
    const formattedProducts = products.map((product) => ({
      ...product,
      tags: product.tags.map((pt) => pt.tag),
      productLine: product.productLines.length > 0 ? product.productLines[0].productLine : null,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}
