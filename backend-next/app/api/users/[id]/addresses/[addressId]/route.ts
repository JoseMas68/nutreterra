import { NextRequest, NextResponse } from 'next/server';
import { requireOwnerOrAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// PUT - Actualizar dirección
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { id: userId, addressId } = params;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    // Verificar que la dirección existe y pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
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

    // Si se marca como predeterminada, desmarcar las demás
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    // Preparar datos para actualizar
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (street !== undefined) updateData.street = street;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (country !== undefined) updateData.country = country;
    if (phone !== undefined) updateData.phone = phone;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Dirección actualizada correctamente',
      address: updatedAddress,
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al actualizar dirección:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la dirección' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar dirección
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { id: userId, addressId } = params;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    // Verificar que la dirección existe y pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la dirección
    await prisma.address.delete({
      where: { id: addressId },
    });

    // Si era la dirección predeterminada, marcar otra como predeterminada
    if (existingAddress.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      message: 'Dirección eliminada correctamente',
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al eliminar dirección:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la dirección' },
      { status: 500 }
    );
  }
}
