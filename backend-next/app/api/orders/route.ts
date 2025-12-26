import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// GET - Obtener pedidos del usuario
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Construir filtros
    const where: any = {
      userId: user.userId,
    };

    if (status) {
      where.status = status;
    }

    // Obtener pedidos con relaciones
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { addressId, items, paymentMethod, notes } = body;

    // Validar que hay items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      );
    }

    // Validar que la dirección pertenece al usuario
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Dirección no válida' },
        { status: 400 }
      );
    }

    // Calcular totales
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
      });
    }

    // Calcular costos adicionales
    const shippingCost = subtotal >= 50 ? 0 : 3.80; // Envío gratis a partir de 50€
    const tax = subtotal * 0.21; // IVA 21%
    const total = subtotal + shippingCost + tax;

    // Generar número de pedido único
    const orderNumber = `NT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        addressId,
        status: 'PENDING',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || 'stripe',
        subtotal,
        shippingCost,
        tax,
        total,
        notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Pedido creado exitosamente',
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}
