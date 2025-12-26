import { NextRequest, NextResponse } from 'next/server';
import { requireOwnerOrAdmin, requireAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Obtener información del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // No incluir password por seguridad
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener la información del usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información del usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Verificar autenticación y permisos
    requireOwnerOrAdmin(request, userId);

    const body = await request.json();
    const { name, email, currentPassword, newPassword, image } = body;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Si se intenta cambiar el email, verificar que no esté en uso
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'El email ya está en uso' },
          { status: 400 }
        );
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (image !== undefined) updateData.image = image;

    // Si se quiere cambiar la contraseña
    if (newPassword) {
      // Verificar que se proporcionó la contraseña actual
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Debes proporcionar la contraseña actual para cambiarla' },
          { status: 400 }
        );
      }

      // Verificar que la contraseña actual sea correcta
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        existingUser.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        );
      }

      // Validar que la nueva contraseña tenga al menos 6 caracteres
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la información del usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Solo admin puede eliminar usuarios
    requireAdmin(request);

    const userId = params.id;

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar usuario (las relaciones se eliminarán en cascada)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: 'Usuario eliminado correctamente',
    });
  } catch (error: any) {
    if (error.message === 'No autorizado' || error.message.includes('permiso')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'No autorizado' ? 401 : 403 }
      );
    }

    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}
