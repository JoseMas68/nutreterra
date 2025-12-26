import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/menus/[id] - Obtener un menú específico
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                category: true,
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { day: 'asc' },
            { mealType: 'asc' },
            { order: 'asc' },
          ],
        },
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Error al obtener el menú' },
      { status: 500 }
    );
  }
}

// PUT /api/menus/[id] - Actualizar un menú
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, isTemplate, isPublic, startDate, endDate, items } = body;

    // Si se proporcionan items, eliminamos los existentes y creamos los nuevos
    if (items) {
      await prisma.menuItem.deleteMany({
        where: { menuId: id },
      });
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        description,
        isTemplate,
        isPublic,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        items: items
          ? {
              create: items.map((item: any) => ({
                productId: item.productId,
                day: item.day,
                mealType: item.mealType,
                order: item.order || 0,
                quantity: item.quantity || 1,
                notes: item.notes,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: [
            { day: 'asc' },
            { mealType: 'asc' },
            { order: 'asc' },
          ],
        },
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el menú' },
      { status: 500 }
    );
  }
}

// DELETE /api/menus/[id] - Eliminar un menú
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Menú eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el menú' },
      { status: 500 }
    );
  }
}
