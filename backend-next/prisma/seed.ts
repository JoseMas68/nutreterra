import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productProductLine.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productLine.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nutreterra.es',
      name: 'Admin NutreTerra',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Crear usuario cliente de prueba
  const customerPassword = await bcrypt.hash('test123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Cliente Test',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created test customer:', customer.email);

  // Crear categorías
  const cereales = await prisma.category.create({
    data: {
      name: 'Cereales',
      slug: 'cereales',
      description: 'Cereales integrales y ecológicos de alta calidad',
      imageUrl: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=800',
      order: 1,
    },
  });

  const legumbres = await prisma.category.create({
    data: {
      name: 'Legumbres',
      slug: 'legumbres',
      description: 'Legumbres ricas en proteína y fibra',
      imageUrl: 'https://images.unsplash.com/photo-1589421314885-a7b3f0e52b2c?w=800',
      order: 2,
    },
  });

  const frutosSec = await prisma.category.create({
    data: {
      name: 'Frutos Secos',
      slug: 'frutos-secos',
      description: 'Frutos secos naturales y sin sal añadida',
      imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800',
      order: 3,
    },
  });

  const superalimentos = await prisma.category.create({
    data: {
      name: 'Superalimentos',
      slug: 'superalimentos',
      description: 'Alimentos con propiedades nutricionales excepcionales',
      imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
      order: 4,
    },
  });

  const snacks = await prisma.category.create({
    data: {
      name: 'Snacks Saludables',
      slug: 'snacks',
      description: 'Snacks nutritivos para cualquier momento del día',
      imageUrl: 'https://images.unsplash.com/photo-1607623488235-e2e9ad42b31f?w=800',
      order: 5,
    },
  });

  console.log('✅ Created 5 categories');

  // Crear líneas de producto
  const livela = await prisma.productLine.create({
    data: {
      name: 'Livela',
      slug: 'livela',
      description: 'Productos para vegetarianos que buscan comidas y cenas ligeras llenas de sabor y comodidad. Ideal para quienes quieren reducir el consumo de carne sin renunciar al gusto.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      order: 1,
    },
  });

  const proteica = await prisma.productLine.create({
    data: {
      name: 'Proteica',
      slug: 'proteica',
      description: '40g de proteína real por plato garantizados. Macros exactos, cero matemáticas. Adiós a la dieta de pollo y arroz. Más gimnasio, menos cocina.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
      order: 2,
    },
  });

  const zima = await prisma.productLine.create({
    data: {
      name: 'Zima',
      slug: 'zima',
      description: 'Platos congelados con garantía de calidad y frescura. Máxima comodidad de uso y alta durabilidad. Siempre listos cuando los necesitas.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      order: 3,
    },
  });

  const festia = await prisma.productLine.create({
    data: {
      name: 'Festia',
      slug: 'festia',
      description: 'Los platos para tus celebraciones y ocasiones especiales. Healthy sin renunciar a nada. Disfruta de lo mejor en cada momento importante.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
      order: 4,
    },
  });

  console.log('✅ Created 4 product lines');

  // Crear tags
  const vegano = await prisma.tag.create({ data: { name: 'Vegano', slug: 'vegano' } });
  const sinGluten = await prisma.tag.create({ data: { name: 'Sin Gluten', slug: 'sin-gluten' } });
  const ecologico = await prisma.tag.create({ data: { name: 'Ecológico', slug: 'ecologico' } });
  const proteina = await prisma.tag.create({ data: { name: 'Alto en Proteína', slug: 'proteina' } });
  const omega3 = await prisma.tag.create({ data: { name: 'Omega-3', slug: 'omega-3' } });
  const fibra = await prisma.tag.create({ data: { name: 'Rico en Fibra', slug: 'fibra' } });

  console.log('✅ Created tags');

  // Crear productos
  const avena = await prisma.product.create({
    data: {
      sku: 'AV001',
      name: 'Avena Integral Ecológica',
      slug: 'avena-integral-ecologica',
      description:
        'Avena integral de cultivo ecológico, perfecta para comenzar el día con energía. Rica en fibra soluble y proteínas vegetales.',
      shortDescription: 'Avena integral 100% ecológica',
      price: 3.99,
      compareAtPrice: 4.99,
      cost: 2.0,
      stock: 50,
      weight: 500,
      imageUrl: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=600',
      featured: true,
      categoryId: cereales.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: ecologico.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }, { productLineId: zima.id }],
      },
    },
  });

  const quinoa = await prisma.product.create({
    data: {
      sku: 'QU001',
      name: 'Quinoa Blanca Bio',
      slug: 'quinoa-blanca-bio',
      description:
        'Quinoa blanca de origen andino con certificación ecológica. Pseudocereal con los 9 aminoácidos esenciales.',
      shortDescription: 'Quinoa blanca con todos los aminoácidos',
      price: 5.49,
      compareAtPrice: 6.49,
      cost: 3.0,
      stock: 30,
      weight: 500,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
      featured: true,
      categoryId: cereales.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: proteina.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }, { productLineId: livela.id }],
      },
    },
  });

  const lentejasRojas = await prisma.product.create({
    data: {
      sku: 'LR001',
      name: 'Lentejas Rojas',
      slug: 'lentejas-rojas',
      description:
        'Lentejas rojas de cocción rápida, ideales para sopas y curry. Alta fuente de proteína vegetal y hierro.',
      shortDescription: 'Lentejas rojas de cocción rápida',
      price: 2.99,
      stock: 45,
      weight: 500,
      imageUrl: 'https://images.unsplash.com/photo-1589421314885-a7b3f0e52b2c?w=600',
      featured: true,
      categoryId: legumbres.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: proteina.id }, { tagId: sinGluten.id }],
      },
    },
  });

  const garbanzos = await prisma.product.create({
    data: {
      sku: 'GA001',
      name: 'Garbanzos Ecológicos',
      slug: 'garbanzos-ecologicos',
      description:
        'Garbanzos de cultivo ecológico, perfectos para hummus, ensaladas y guisos. Rico en proteína y fibra.',
      shortDescription: 'Garbanzos 100% ecológicos',
      price: 3.49,
      cost: 1.8,
      stock: 40,
      weight: 500,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a0b3b32fc513?w=600',
      featured: false,
      categoryId: legumbres.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: proteina.id }, { tagId: ecologico.id }],
      },
    },
  });

  const almendras = await prisma.product.create({
    data: {
      sku: 'AL001',
      name: 'Almendras Crudas',
      slug: 'almendras-crudas',
      description:
        'Almendras crudas de California, sin sal ni aditivos. Ricas en vitamina E, magnesio y grasas saludables.',
      shortDescription: 'Almendras naturales sin sal',
      price: 7.99,
      compareAtPrice: 9.99,
      cost: 5.0,
      stock: 25,
      weight: 250,
      imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600',
      featured: true,
      categoryId: frutosSec.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: proteina.id }, { tagId: sinGluten.id }],
      },
    },
  });

  const nueces = await prisma.product.create({
    data: {
      sku: 'NU001',
      name: 'Nueces de California',
      slug: 'nueces-california',
      description:
        'Nueces de California, excelente fuente de omega-3 y antioxidantes. Perfectas como snack o para ensaladas.',
      shortDescription: 'Nueces ricas en omega-3',
      price: 8.49,
      cost: 5.5,
      stock: 20,
      weight: 250,
      imageUrl: 'https://images.unsplash.com/photo-1622484211193-f235e0d68e46?w=600',
      featured: true,
      categoryId: frutosSec.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: omega3.id }, { tagId: sinGluten.id }],
      },
    },
  });

  const chia = await prisma.product.create({
    data: {
      sku: 'CH001',
      name: 'Semillas de Chía',
      slug: 'semillas-chia',
      description:
        'Semillas de chía ricas en omega-3, fibra y proteínas. Ideales para batidos, yogures y puddings.',
      shortDescription: 'Semillas de chía superalimento',
      price: 4.99,
      stock: 35,
      weight: 250,
      imageUrl: 'https://images.unsplash.com/photo-1591165127931-12f1c1e66ac8?w=600',
      featured: true,
      categoryId: superalimentos.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: omega3.id }, { tagId: fibra.id }],
      },
    },
  });

  const espirulina = await prisma.product.create({
    data: {
      sku: 'ES001',
      name: 'Espirulina en Polvo',
      slug: 'espirulina-polvo',
      description:
        'Espirulina en polvo 100% pura, superalimento con 60% de proteína y rico en vitaminas y minerales.',
      shortDescription: 'Espirulina 60% proteína',
      price: 12.99,
      compareAtPrice: 14.99,
      cost: 8.0,
      stock: 15,
      weight: 200,
      imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600',
      featured: true,
      categoryId: superalimentos.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: proteina.id }],
      },
    },
  });

  const arrozIntegral = await prisma.product.create({
    data: {
      sku: 'AR001',
      name: 'Arroz Integral Bio',
      slug: 'arroz-integral-bio',
      description:
        'Arroz integral de grano largo con certificación ecológica. Conserva todo su salvado y germen.',
      shortDescription: 'Arroz integral ecológico',
      price: 3.29,
      stock: 60,
      weight: 1000,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
      featured: false,
      categoryId: cereales.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: ecologico.id }],
      },
    },
  });

  const pastaLentejas = await prisma.product.create({
    data: {
      sku: 'PL001',
      name: 'Pasta de Lentejas',
      slug: 'pasta-lentejas',
      description:
        'Pasta elaborada 100% con harina de lentejas rojas. Alta en proteína y sin gluten. Cocción en 8 minutos.',
      shortDescription: 'Pasta de lentejas sin gluten',
      price: 4.49,
      stock: 28,
      weight: 250,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
      featured: false,
      categoryId: legumbres.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: proteina.id }, { tagId: sinGluten.id }],
      },
    },
  });

  console.log('✅ Created 10 products');

  // Crear dirección para el cliente de prueba
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      firstName: 'Juan',
      lastName: 'Pérez',
      street: 'Calle Principal 123',
      city: 'Madrid',
      state: 'Madrid',
      postalCode: '28001',
      country: 'ES',
      phone: '+34600123456',
      isDefault: true,
    },
  });

  console.log('✅ Created test address');

  // Crear carrito para el cliente con productos
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
      items: {
        create: [
          { productId: avena.id, quantity: 2 },
          { productId: almendras.id, quantity: 1 },
          { productId: chia.id, quantity: 1 },
        ],
      },
    },
  });

  console.log('✅ Created test cart with items');

  console.log('🎉 Seeding completed successfully!');
  console.log('\nTest credentials:');
  console.log('Admin - Email: admin@nutreterra.es, Password: admin123');
  console.log('Customer - Email: test@example.com, Password: test123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
