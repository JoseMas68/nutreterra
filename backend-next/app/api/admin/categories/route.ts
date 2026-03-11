import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// GET - Listar categorías
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request);

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error al obtener las categorías' },
      { status: 500 }
    );
  }
}

// POST - Crear categoría
export async function POST(req: NextRequest) {
  try {
    const user = requireAdmin(req);

    const body = await req.json();
    const { name, slug, description } = body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        active: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 }
    );
  }
}
