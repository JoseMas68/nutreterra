import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener línea de producto por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const productLine = await prisma.productLine.findUnique({
      where: { id },
    });

    if (!productLine) {
      return NextResponse.json(
        { error: 'Línea de producto no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(productLine);
  } catch (error) {
    console.error('Error fetching product line:', error);
    return NextResponse.json(
      { error: 'Error al obtener la línea de producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar línea de producto
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, icon, order, active } = body;

    const productLine = await prisma.productLine.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
        order,
        active,
      },
    });

    return NextResponse.json(productLine);
  } catch (error) {
    console.error('Error updating product line:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la línea de producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar línea de producto
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.productLine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product line:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la línea de producto' },
      { status: 500 }
    );
  }
}
