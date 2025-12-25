import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadProductImage } from '@/lib/supabase';

// POST - Crear nuevo producto
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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

    // Subir imagen a Supabase
    const imageFile = formData.get('image') as File;
    if (!imageFile) {
      return NextResponse.json(
        { error: 'La imagen es requerida' },
        { status: 400 }
      );
    }

    const fileName = `${sku}-${Date.now()}.${imageFile.name.split('.').pop()}`;
    const imageUrl = await uploadProductImage(imageFile, fileName);

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Error al subir la imagen' },
        { status: 500 }
      );
    }

    // Subir imágenes de galería
    const galleryCount = parseInt(formData.get('galleryCount') as string || '0');
    const galleryImages: string[] = [];

    for (let i = 0; i < galleryCount; i++) {
      const galleryFile = formData.get(`gallery_${i}`) as File | null;
      if (galleryFile && galleryFile.size > 0) {
        const galleryFileName = `${sku}-gallery-${Date.now()}-${i}.${galleryFile.name.split('.').pop()}`;
        const galleryImageUrl = await uploadProductImage(galleryFile, galleryFileName);
        if (galleryImageUrl) {
          galleryImages.push(galleryImageUrl);
        }
      }
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        shortDescription,
        description,
        price,
        compareAtPrice,
        stock,
        weight,
        imageUrl,
        images: galleryImages,
        active,
        featured,
        categoryId,
        tags: {
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}
