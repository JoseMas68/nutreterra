import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// GET - Listar líneas de producto
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request);

    const productLines = await prisma.productLine.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(productLines);
  } catch (error) {
    console.error('Error fetching product lines:', error);
    return NextResponse.json(
      { error: 'Error al obtener las líneas de producto' },
      { status: 500 }
    );
  }
}

// POST - Crear línea de producto
export async function POST(req: NextRequest) {
  try {
    const user = requireAdmin(req);

    const body = await req.json();
    const { name, slug, description, icon, order, active } = body;

    const productLine = await prisma.productLine.create({
      data: {
        name,
        slug,
        description,
        icon,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(productLine, { status: 201 });
  } catch (error) {
    console.error('Error creating product line:', error);
    return NextResponse.json(
      { error: 'Error al crear la línea de producto' },
      { status: 500 }
    );
  }
}
