import { NextRequest, NextResponse } from 'next/server';
import { requireOwnerOrAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las direcciones del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // Dirección por defecto primero
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al obtener direcciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener las direcciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva dirección
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    const body = await request.json();
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body;

    // Validar campos requeridos
    if (!firstName || !lastName || !street || !city || !state || !postalCode || !phone) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Si se marca como predeterminada, desmarcar las demás
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // Si es la primera dirección, marcarla como predeterminada
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    const newAddress = await prisma.address.create({
      data: {
        userId,
        firstName,
        lastName,
        street,
        city,
        state,
        postalCode,
        country: country || 'ES',
        phone,
        isDefault: isDefault || addressCount === 0,
      },
    });

    return NextResponse.json({
      message: 'Dirección creada correctamente',
      address: newAddress,
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al crear dirección:', error);
    return NextResponse.json(
      { error: 'Error al crear la dirección' },
      { status: 500 }
    );
  }
}
