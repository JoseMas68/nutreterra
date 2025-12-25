import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET público - Listar líneas de producto activas
export async function GET() {
  try {
    const productLines = await prisma.productLine.findMany({
      where: {
        active: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
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
