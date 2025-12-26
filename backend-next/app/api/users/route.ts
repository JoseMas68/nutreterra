import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// GET - Listar usuarios (solo admin)
export async function GET(request: NextRequest) {
  try {
    // Solo admin puede listar todos los usuarios
    requireAdmin(request);

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && (role === 'ADMIN' || role === 'CUSTOMER')) {
      where.role = role;
    }

    // Obtener usuarios
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              addresses: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de usuarios' },
      { status: 500 }
    );
  }
}
