import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadProductImage, deleteProductImage } from '@/lib/supabase';

// PUT - Actualizar producto
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();

    // Extraer datos del formulario
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const sku = formData.get('sku') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const compareAtPrice = formData.get('compareAtPrice')
      ? parseFloat(formData.get('compareAtPrice') as string)
      : null;
    const stock = parseInt(formData.get('stock') as string);
    const weight = formData.get('weight')
      ? parseFloat(formData.get('weight') as string)
      : null;
    const categoryId = formData.get('categoryId') as string;
    const active = formData.get('active') === 'on';
    const featured = formData.get('featured') === 'on';
    const tags = JSON.parse(formData.get('tags') as string) as string[];

    // Preparar datos de actualización
    const updateData: any = {
      name,
      slug,
      sku,
      shortDescription,
      description,
      price,
      compareAtPrice,
      stock,
      weight,
      active,
      featured,
      categoryId,
    };

    // Si hay nueva imagen principal, subirla
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const fileName = `${sku}-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const imageUrl = await uploadProductImage(imageFile, fileName);

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }
    }

    // Manejar galería de imágenes
    const galleryCount = parseInt(formData.get('galleryCount') as string || '0');
    const existingImages = formData.get('existingImages')
      ? JSON.parse(formData.get('existingImages') as string)
      : [];
    const newGalleryImages: string[] = [];

    // Subir nuevas imágenes de galería
    for (let i = 0; i < galleryCount; i++) {
      const galleryFile = formData.get(`gallery_${i}`) as File | null;
      if (galleryFile && galleryFile.size > 0) {
        const fileName = `${sku}-gallery-${Date.now()}-${i}.${galleryFile.name.split('.').pop()}`;
        const imageUrl = await uploadProductImage(galleryFile, fileName);
        if (imageUrl) {
          newGalleryImages.push(imageUrl);
        }
      }
    }

    // Combinar imágenes existentes con nuevas
    updateData.images = [...existingImages, ...newGalleryImages];

    // Actualizar producto y tags
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        tags: {
          deleteMany: {},
          create: tags.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Obtener producto para eliminar la imagen
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar producto (las relaciones se eliminan en cascada)
    await prisma.product.delete({
      where: { id },
    });

    // Opcional: Eliminar imagen de Supabase
    // if (product.imageUrl) {
    //   const fileName = product.imageUrl.split('/').pop();
    //   if (fileName) {
    //     await deleteProductImage(fileName);
    //   }
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}
