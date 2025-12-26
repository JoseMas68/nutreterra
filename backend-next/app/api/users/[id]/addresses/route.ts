import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las direcciones del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = params.id;

    // Solo el propio usuario o un admin pueden ver las direcciones
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a esta información' },
        { status: 403 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // Dirección por defecto primero
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = params.id;

    // Solo el propio usuario o un admin pueden crear direcciones
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para realizar esta acción' },
        { status: 403 }
      );
    }

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
  } catch (error) {
    console.error('Error al crear dirección:', error);
    return NextResponse.json(
      { error: 'Error al crear la dirección' },
      { status: 500 }
    );
  }
}
