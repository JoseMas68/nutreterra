import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar líneas de producto
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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
