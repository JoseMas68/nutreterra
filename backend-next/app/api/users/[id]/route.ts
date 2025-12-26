import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
});

// GET - Obtener información del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = id;

    // Verificar que el usuario tiene permiso (admin o dueño del recurso)
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a este recurso' },
        { status: 403 }
      );
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = id;

    // Verificar que el usuario tiene permiso (admin o dueño del recurso)
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a este recurso' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Admins pueden actualizar role, nombre y email
    // Usuarios normales solo pueden actualizar su nombre, email y contraseña
    let updateData: any = {};

    if (session.user.role === 'ADMIN') {
      // Admin puede actualizar todo mediante updateUserSchema
      const validation = updateUserSchema.safeParse(body);
      if (validation.success) {
        updateData = validation.data;
      } else {
        // Si no pasa el schema de admin, usar los campos básicos
        const { name, email, currentPassword, newPassword, image } = body;
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (image !== undefined) updateData.image = image;
      }
    } else {
      // Usuario normal solo puede actualizar campos básicos
      const { name, email, currentPassword, newPassword, image } = body;
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (image !== undefined) updateData.image = image;
    }

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
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'El email ya está en uso' },
          { status: 400 }
        );
      }
    }

    // Si se quiere cambiar la contraseña (solo para usuarios normales actualizando su propia cuenta)
    if (body.newPassword && session.user.id === userId) {
      // Verificar que se proporcionó la contraseña actual
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: 'Debes proporcionar la contraseña actual para cambiarla' },
          { status: 400 }
        );
      }

      // Verificar que la contraseña actual sea correcta
      const isPasswordValid = await bcrypt.compare(
        body.currentPassword,
        existingUser.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        );
      }

      // Validar que la nueva contraseña tenga al menos 6 caracteres
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para realizar esta acción' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = id;

    // Verificar que el usuario exists
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
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}
