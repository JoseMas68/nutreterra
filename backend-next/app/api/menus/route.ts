import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/menus - Obtener menús del usuario o públicos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isPublic = searchParams.get('public') === 'true';
    const isTemplate = searchParams.get('template') === 'true';

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (isPublic) {
      where.isPublic = true;
    }

    if (isTemplate) {
      where.isTemplate = true;
    }

    const menus = await prisma.menu.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Error al obtener los menús' },
      { status: 500 }
    );
  }
}

// POST /api/menus - Crear un nuevo menú
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, userId, isTemplate, isPublic, startDate, endDate, items } = body;

    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        userId,
        isTemplate: isTemplate || false,
        isPublic: isPublic || false,
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
        },
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Error al crear el menú' },
      { status: 500 }
    );
  }
}
