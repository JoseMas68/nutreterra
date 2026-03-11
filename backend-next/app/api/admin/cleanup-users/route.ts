import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API Endpoint para limpiar usuarios antiguos automáticamente
 *
 * Elimina todos los usuarios (y sus datos relacionados) que:
 * - No son ADMIN
 * - Fueron creados hace más de 24 horas
 *
 * Este endpoint está diseñado para ser ejecutado por un Cron Job de Vercel
 */
export async function GET(request: Request) {
  try {
    // Verificar autenticación (opcional para Cron Jobs, pero recomendado)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Encontrar usuarios para eliminar (no ADMINs y creados hace más de 24h)
    const usersToDelete = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (usersToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users to clean up',
        deleted: 0,
      });
    }

    // Eliminar usuarios (Prisma se encarga de las cascadas)
    const deleteResult = await prisma.user.deleteMany({
      where: {
        id: {
          in: usersToDelete.map((u) => u.id),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.count} test users`,
      deleted: deleteResult.count,
      users: usersToDelete.map((u) => ({
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error cleaning up users:', error);
    return NextResponse.json(
      {
        error: 'Failed to clean up users',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
