import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.menuItem.deleteMany();
  await prisma.menu.deleteMany();
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

  // Crear categorías (Desayunos, Comidas, Cenas, Snacks)
  const desayunos = await prisma.category.create({
    data: {
      name: 'Desayunos',
      slug: 'desayunos',
      description: 'Comienza el día con energía. Desayunos equilibrados y nutritivos.',
      imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
      order: 1,
    },
  });

  const comidas = await prisma.category.create({
    data: {
      name: 'Comidas',
      slug: 'comidas',
      description: 'Platos principales completos y balanceados para el mediodía.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      order: 2,
    },
  });

  const cenas = await prisma.category.create({
    data: {
      name: 'Cenas',
      slug: 'cenas',
      description: 'Cenas ligeras y nutritivas para terminar el día.',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      order: 3,
    },
  });

  const snacks = await prisma.category.create({
    data: {
      name: 'Snacks',
      slug: 'snacks',
      description: 'Snacks saludables para mantener tu energía entre comidas.',
      imageUrl: 'https://images.unsplash.com/photo-1607623488235-e2e9ad42b31f?w=800',
      order: 4,
    },
  });

  console.log('✅ Created 4 categories');

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
  const altaProteina = await prisma.tag.create({ data: { name: 'Alta Proteína', slug: 'alta-proteina' } });
  const bajoCarbohidratos = await prisma.tag.create({ data: { name: 'Bajo en Carbohidratos', slug: 'bajo-carbohidratos' } });
  const superalimento = await prisma.tag.create({ data: { name: 'Superalimento', slug: 'superalimento' } });

  console.log('✅ Created tags');

  // ========================================
  // DESAYUNOS (10 productos)
  // ========================================

  const bowlProteico = await prisma.product.create({
    data: {
      sku: 'DES001',
      name: 'Bowl Proteico de Yogur y Frutos Rojos',
      slug: 'bowl-proteico-yogur-frutos-rojos',
      description: 'Bowl de yogur griego con granola casera, frutos rojos frescos, semillas de chía y un toque de miel. Rico en proteínas y antioxidantes.',
      shortDescription: 'Bowl proteico con yogur griego y frutos rojos',
      price: 6.99,
      compareAtPrice: 8.49,
      cost: 3.5,
      stock: 45,
      weight: 350,
      calories: 385,
      protein: 22,
      carbohydrates: 48,
      fat: 12,
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600',
      featured: true,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const tostadaAguacate = await prisma.product.create({
    data: {
      sku: 'DES002',
      name: 'Tostada de Aguacate con Huevo Poché',
      slug: 'tostada-aguacate-huevo-poche',
      description: 'Pan integral tostado con aguacate fresco, huevo poché, tomate cherry y un toque de aceite de oliva. Desayuno completo y equilibrado.',
      shortDescription: 'Tostada de aguacate y huevo poché',
      price: 7.49,
      cost: 3.8,
      stock: 38,
      weight: 280,
      calories: 420,
      protein: 18,
      carbohydrates: 35,
      fat: 24,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
      featured: true,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: ecologico.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const pancakesProteicos = await prisma.product.create({
    data: {
      sku: 'DES003',
      name: 'Pancakes Proteicos con Sirope de Arce',
      slug: 'pancakes-proteicos-sirope-arce',
      description: 'Stack de 3 pancakes con proteína whey, plátano caramelizado, arándanos y sirope de arce natural. 30g de proteína por porción.',
      shortDescription: 'Pancakes con 30g de proteína',
      price: 8.99,
      compareAtPrice: 10.99,
      cost: 4.5,
      stock: 30,
      weight: 320,
      calories: 465,
      protein: 30,
      carbohydrates: 52,
      fat: 14,
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
      featured: true,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: altaProteina.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }, { productLineId: festia.id }],
      },
    },
  });

  const smoothieBowl = await prisma.product.create({
    data: {
      sku: 'DES004',
      name: 'Smoothie Bowl de Açaí y Plátano',
      slug: 'smoothie-bowl-acai-platano',
      description: 'Base de açaí y plátano congelado, topped con granola, coco rallado, kiwi, fresas y mantequilla de almendra. Energía natural para empezar el día.',
      shortDescription: 'Smoothie bowl de açaí',
      price: 7.99,
      cost: 4.2,
      stock: 35,
      weight: 400,
      calories: 395,
      protein: 12,
      carbohydrates: 62,
      fat: 13,
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600',
      featured: false,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: superalimento.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const tortillaEspañola = await prisma.product.create({
    data: {
      sku: 'DES005',
      name: 'Tortilla Española de Patata y Cebolla',
      slug: 'tortilla-espanola-patata-cebolla',
      description: 'Tortilla española tradicional con patatas y cebolla caramelizada. Huevos camperos y aceite de oliva virgen extra. Lista para calentar.',
      shortDescription: 'Tortilla española tradicional',
      price: 6.49,
      cost: 3.2,
      stock: 42,
      weight: 250,
      calories: 380,
      protein: 16,
      carbohydrates: 28,
      fat: 22,
      imageUrl: 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=600',
      featured: false,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: zima.id }],
      },
    },
  });

  const croissantIntegral = await prisma.product.create({
    data: {
      sku: 'DES006',
      name: 'Croissant Integral con Jamón y Queso',
      slug: 'croissant-integral-jamon-queso',
      description: 'Croissant de harina integral relleno de jamón serrano y queso emmental. Horneado al momento, crujiente por fuera y tierno por dentro.',
      shortDescription: 'Croissant integral relleno',
      price: 5.49,
      cost: 2.8,
      stock: 50,
      weight: 180,
      calories: 340,
      protein: 15,
      carbohydrates: 32,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600',
      featured: false,
      categoryId: desayunos.id,
      productLines: {
        create: [{ productLineId: festia.id }],
      },
    },
  });

  const burritoDesa = await prisma.product.create({
    data: {
      sku: 'DES007',
      name: 'Burrito de Desayuno con Huevos Revueltos',
      slug: 'burrito-desayuno-huevos-revueltos',
      description: 'Tortilla de trigo integral con huevos revueltos, frijoles negros, aguacate, queso cheddar y salsa ranchera. Desayuno completo en formato wrap.',
      shortDescription: 'Burrito de desayuno proteico',
      price: 7.99,
      cost: 4.0,
      stock: 32,
      weight: 300,
      calories: 485,
      protein: 24,
      carbohydrates: 45,
      fat: 22,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600',
      featured: false,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: altaProteina.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const porridgeAvena = await prisma.product.create({
    data: {
      sku: 'DES008',
      name: 'Porridge de Avena con Manzana Asada',
      slug: 'porridge-avena-manzana-asada',
      description: 'Porridge cremoso de avena integral con manzana asada, canela, nueces pecanas y un toque de miel. Reconfortante y nutritivo.',
      shortDescription: 'Porridge de avena y manzana',
      price: 5.99,
      cost: 2.5,
      stock: 48,
      weight: 320,
      calories: 350,
      protein: 11,
      carbohydrates: 58,
      fat: 9,
      imageUrl: 'https://images.unsplash.com/photo-1590500462084-99c87d9d7c54?w=600',
      featured: false,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: ecologico.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const wafflesBelgas = await prisma.product.create({
    data: {
      sku: 'DES009',
      name: 'Waffles Belgas con Frutos del Bosque',
      slug: 'waffles-belgas-frutos-bosque',
      description: 'Dos waffles belgas recién hechos con frutos del bosque frescos, nata montada ligera y sirope de agave. Un capricho saludable.',
      shortDescription: 'Waffles belgas con frutos del bosque',
      price: 8.49,
      compareAtPrice: 9.99,
      cost: 4.3,
      stock: 28,
      weight: 290,
      calories: 425,
      protein: 14,
      carbohydrates: 56,
      fat: 16,
      imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600',
      featured: false,
      categoryId: desayunos.id,
      productLines: {
        create: [{ productLineId: festia.id }],
      },
    },
  });

  const bowlGriego = await prisma.product.create({
    data: {
      sku: 'DES010',
      name: 'Bowl Griego con Queso Feta y Aceitunas',
      slug: 'bowl-griego-queso-feta-aceitunas',
      description: 'Base de quinoa con pepino, tomate, aceitunas kalamata, queso feta, cebolla roja y vinagreta de limón. Desayuno mediterráneo lleno de sabor.',
      shortDescription: 'Bowl griego mediterráneo',
      price: 7.49,
      cost: 3.7,
      stock: 36,
      weight: 330,
      calories: 410,
      protein: 17,
      carbohydrates: 42,
      fat: 19,
      imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
      featured: false,
      categoryId: desayunos.id,
      tags: {
        create: [{ tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  console.log('✅ Created 10 Desayunos');

  // ========================================
  // COMIDAS (10 productos)
  // ========================================

  const polloTeriyaki = await prisma.product.create({
    data: {
      sku: 'COM001',
      name: 'Pollo Teriyaki con Arroz Basmati',
      slug: 'pollo-teriyaki-arroz-basmati',
      description: 'Pechuga de pollo marinada en salsa teriyaki casera, acompañada de arroz basmati, brócoli al vapor y sésamo tostado. Plato completo y equilibrado.',
      shortDescription: 'Pollo teriyaki con arroz',
      price: 10.99,
      compareAtPrice: 12.99,
      cost: 5.5,
      stock: 40,
      weight: 450,
      calories: 580,
      protein: 42,
      carbohydrates: 65,
      fat: 14,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      featured: true,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const bowlVegano = await prisma.product.create({
    data: {
      sku: 'COM002',
      name: 'Bowl Vegano de Quinoa y Garbanzos Especiados',
      slug: 'bowl-vegano-quinoa-garbanzos',
      description: 'Base de quinoa con garbanzos crujientes especiados, batata asada, kale salteado, hummus de remolacha y tahini. Explosión de sabor vegetal.',
      shortDescription: 'Bowl vegano de quinoa',
      price: 9.99,
      cost: 4.8,
      stock: 35,
      weight: 420,
      calories: 525,
      protein: 18,
      carbohydrates: 72,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
      featured: true,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: ecologico.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const salmonHorno = await prisma.product.create({
    data: {
      sku: 'COM003',
      name: 'Salmón al Horno con Espárragos Trigueros',
      slug: 'salmon-horno-esparragos',
      description: 'Filete de salmón al horno con costra de hierbas, espárragos trigueros asados, patata panadera y salsa de yogur con eneldo. Rico en omega-3.',
      shortDescription: 'Salmón al horno con espárragos',
      price: 13.99,
      compareAtPrice: 15.99,
      cost: 7.0,
      stock: 28,
      weight: 480,
      calories: 620,
      protein: 45,
      carbohydrates: 38,
      fat: 32,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
      featured: true,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }, { productLineId: festia.id }],
      },
    },
  });

  const curreyVerduras = await prisma.product.create({
    data: {
      sku: 'COM004',
      name: 'Curry de Verduras con Leche de Coco',
      slug: 'curry-verduras-leche-coco',
      description: 'Curry tailandés con calabaza, berenjena, pimiento, bambú y leche de coco. Acompañado de arroz jazmín. Sabor exótico y reconfortante.',
      shortDescription: 'Curry de verduras tailandés',
      price: 9.49,
      cost: 4.5,
      stock: 38,
      weight: 410,
      calories: 485,
      protein: 12,
      carbohydrates: 68,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }, { productLineId: zima.id }],
      },
    },
  });

  const pastaBolonesa = await prisma.product.create({
    data: {
      sku: 'COM005',
      name: 'Pasta Integral Boloñesa con Ternera Ecológica',
      slug: 'pasta-integral-bolonesa',
      description: 'Penne integral con boloñesa de ternera ecológica, tomate natural, zanahoria, apio y queso parmesano. Receta italiana tradicional.',
      shortDescription: 'Pasta boloñesa integral',
      price: 10.49,
      cost: 5.2,
      stock: 44,
      weight: 440,
      calories: 595,
      protein: 35,
      carbohydrates: 72,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: ecologico.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const arrozCubana = await prisma.product.create({
    data: {
      sku: 'COM006',
      name: 'Arroz a la Cubana con Huevo Frito',
      slug: 'arroz-cubana-huevo-frito',
      description: 'Arroz blanco con tomate frito casero, huevo frito, plátano macho frito y una pizca de comino. Plato reconfortante lleno de nostalgia.',
      shortDescription: 'Arroz a la cubana tradicional',
      price: 8.99,
      cost: 4.0,
      stock: 50,
      weight: 400,
      calories: 540,
      protein: 16,
      carbohydrates: 78,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: zima.id }],
      },
    },
  });

  const paella = await prisma.product.create({
    data: {
      sku: 'COM007',
      name: 'Paella Valenciana de Pollo y Conejo',
      slug: 'paella-valenciana-pollo-conejo',
      description: 'Paella tradicional valenciana con pollo de corral, conejo, garrofón, judía verde y azafrán. Receta auténtica, preparada con cariño.',
      shortDescription: 'Paella valenciana tradicional',
      price: 12.99,
      compareAtPrice: 14.99,
      cost: 6.5,
      stock: 25,
      weight: 500,
      calories: 615,
      protein: 38,
      carbohydrates: 70,
      fat: 20,
      imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600',
      featured: true,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: festia.id }],
      },
    },
  });

  const burgerLentejas = await prisma.product.create({
    data: {
      sku: 'COM008',
      name: 'Burger Vegetal de Lentejas con Boniato',
      slug: 'burger-vegetal-lentejas-boniato',
      description: 'Hamburguesa de lentejas rojas con pan brioche integral, lechuga, tomate, cebolla caramelizada y mayonesa vegana. Acompañada de chips de boniato al horno.',
      shortDescription: 'Burger vegetal con chips de boniato',
      price: 9.99,
      cost: 4.8,
      stock: 42,
      weight: 380,
      calories: 520,
      protein: 22,
      carbohydrates: 68,
      fat: 16,
      imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: vegano.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const risottoSetas = await prisma.product.create({
    data: {
      sku: 'COM009',
      name: 'Risotto Cremoso de Setas Mixtas',
      slug: 'risotto-cremoso-setas-mixtas',
      description: 'Risotto de arroz arborio con mezcla de setas (shiitake, portobello, champiñón), parmesano, mantequilla y perejil fresco. Cremoso y aromático.',
      shortDescription: 'Risotto de setas cremoso',
      price: 11.49,
      cost: 5.7,
      stock: 30,
      weight: 420,
      calories: 565,
      protein: 16,
      carbohydrates: 74,
      fat: 22,
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-f51c40d385ca?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: festia.id }],
      },
    },
  });

  const wraps = await prisma.product.create({
    data: {
      sku: 'COM010',
      name: 'Wraps de Pollo con Salsa César',
      slug: 'wraps-pollo-salsa-cesar',
      description: 'Dos wraps de tortilla integral con pollo a la plancha, lechuga romana, tomate cherry, parmesano y salsa césar ligera. Fresco y completo.',
      shortDescription: 'Wraps de pollo césar',
      price: 9.49,
      cost: 4.6,
      stock: 46,
      weight: 360,
      calories: 495,
      protein: 38,
      carbohydrates: 48,
      fat: 16,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600',
      featured: false,
      categoryId: comidas.id,
      tags: {
        create: [{ tagId: altaProteina.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  console.log('✅ Created 10 Comidas');

  // ========================================
  // CENAS (10 productos)
  // ========================================

  const ensaladaCesar = await prisma.product.create({
    data: {
      sku: 'CEN001',
      name: 'Ensalada César Proteica con Pollo',
      slug: 'ensalada-cesar-proteica-pollo',
      description: 'Lechuga romana, pollo a la plancha, bacon crujiente, crutones integrales, parmesano y salsa césar ligera. 35g de proteína por porción.',
      shortDescription: 'Ensalada césar con pollo',
      price: 8.99,
      cost: 4.5,
      stock: 42,
      weight: 350,
      calories: 420,
      protein: 35,
      carbohydrates: 24,
      fat: 22,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
      featured: true,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const sopaMiso = await prisma.product.create({
    data: {
      sku: 'CEN002',
      name: 'Sopa Miso con Tofu y Algas',
      slug: 'sopa-miso-tofu-algas',
      description: 'Sopa japonesa de miso con tofu sedoso, algas wakame, cebolleta y sésamo. Reconfortante, ligera y llena de umami.',
      shortDescription: 'Sopa miso japonesa',
      price: 6.99,
      cost: 3.2,
      stock: 38,
      weight: 320,
      calories: 185,
      protein: 12,
      carbohydrates: 18,
      fat: 7,
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: bajoCarbohidratos.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const revueltoSetas = await prisma.product.create({
    data: {
      sku: 'CEN003',
      name: 'Revuelto de Setas y Gambas',
      slug: 'revuelto-setas-gambas',
      description: 'Huevos camperos revueltos con setas de temporada y gambas salteadas al ajillo. Acompañado de pan integral tostado. Cena ligera y sabrosa.',
      shortDescription: 'Revuelto de setas y gambas',
      price: 9.49,
      cost: 4.8,
      stock: 32,
      weight: 280,
      calories: 320,
      protein: 28,
      carbohydrates: 16,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const verdurasWok = await prisma.product.create({
    data: {
      sku: 'CEN004',
      name: 'Verduras al Wok con Fideos de Arroz',
      slug: 'verduras-wok-fideos-arroz',
      description: 'Salteado de verduras crujientes (brócoli, zanahoria, pimiento, pak choi) con fideos de arroz y salsa de soja. Cena vegana ligera y colorida.',
      shortDescription: 'Verduras al wok con fideos',
      price: 7.99,
      cost: 3.8,
      stock: 40,
      weight: 360,
      calories: 385,
      protein: 10,
      carbohydrates: 62,
      fat: 10,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const tortillaBrocoliQueso = await prisma.product.create({
    data: {
      sku: 'CEN005',
      name: 'Tortilla de Brócoli y Queso de Cabra',
      slug: 'tortilla-brocoli-queso-cabra',
      description: 'Tortilla francesa esponjosa con brócoli al vapor y queso de cabra fundido. Acompañada de ensalada verde. Cena ligera y nutritiva.',
      shortDescription: 'Tortilla de brócoli y queso',
      price: 7.49,
      cost: 3.5,
      stock: 45,
      weight: 290,
      calories: 295,
      protein: 22,
      carbohydrates: 12,
      fat: 18,
      imageUrl: 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const cremaCalabaza = await prisma.product.create({
    data: {
      sku: 'CEN006',
      name: 'Crema de Calabaza con Semillas Tostadas',
      slug: 'crema-calabaza-semillas-tostadas',
      description: 'Crema suave de calabaza asada con jengibre, leche de coco, semillas de calabaza tostadas y aceite de oliva. Reconfortante y nutritiva.',
      shortDescription: 'Crema de calabaza cremosa',
      price: 6.49,
      cost: 2.9,
      stock: 48,
      weight: 350,
      calories: 245,
      protein: 6,
      carbohydrates: 32,
      fat: 11,
      imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }, { productLineId: zima.id }],
      },
    },
  });

  const ensaladaQuinoa = await prisma.product.create({
    data: {
      sku: 'CEN007',
      name: 'Ensalada Templada de Quinoa y Aguacate',
      slug: 'ensalada-templada-quinoa-aguacate',
      description: 'Base de quinoa con aguacate, tomate cherry, pepino, edamame, cilantro y vinagreta de lima. Fresca, completa y saciante.',
      shortDescription: 'Ensalada de quinoa templada',
      price: 8.49,
      cost: 4.0,
      stock: 36,
      weight: 340,
      calories: 395,
      protein: 14,
      carbohydrates: 48,
      fat: 16,
      imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
      featured: true,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const pescadillaPlancha = await prisma.product.create({
    data: {
      sku: 'CEN008',
      name: 'Pescadilla a la Plancha con Verduras',
      slug: 'pescadilla-plancha-verduras',
      description: 'Filete de pescadilla a la plancha con calabacín, berenjena y pimiento asados. Aliñado con limón y aceite de oliva. Ligero y saludable.',
      shortDescription: 'Pescadilla a la plancha',
      price: 9.99,
      cost: 5.0,
      stock: 30,
      weight: 380,
      calories: 340,
      protein: 32,
      carbohydrates: 18,
      fat: 14,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const hamburguesaPavo = await prisma.product.create({
    data: {
      sku: 'CEN009',
      name: 'Hamburguesa de Pavo con Ensalada',
      slug: 'hamburguesa-pavo-ensalada',
      description: 'Hamburguesa de pavo a la plancha con pan integral, lechuga, tomate y mostaza dijon. Acompañada de ensalada mixta. Baja en grasa.',
      shortDescription: 'Hamburguesa de pavo ligera',
      price: 8.99,
      cost: 4.2,
      stock: 38,
      weight: 320,
      calories: 385,
      protein: 34,
      carbohydrates: 32,
      fat: 12,
      imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600',
      featured: false,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const tatakiAtun = await prisma.product.create({
    data: {
      sku: 'CEN010',
      name: 'Tataki de Atún con Ensalada Wakame',
      slug: 'tataki-atun-ensalada-wakame',
      description: 'Tataki de atún rojo sellado con costra de sésamo, ensalada de algas wakame, edamame y salsa ponzu. Sofisticado y ligero.',
      shortDescription: 'Tataki de atún sellado',
      price: 12.99,
      compareAtPrice: 14.99,
      cost: 6.8,
      stock: 22,
      weight: 300,
      calories: 295,
      protein: 38,
      carbohydrates: 12,
      fat: 11,
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
      featured: true,
      categoryId: cenas.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: bajoCarbohidratos.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }, { productLineId: festia.id }],
      },
    },
  });

  console.log('✅ Created 10 Cenas');

  // ========================================
  // SNACKS (10 productos)
  // ========================================

  const hummusPalitos = await prisma.product.create({
    data: {
      sku: 'SNK001',
      name: 'Hummus con Palitos de Vegetales',
      slug: 'hummus-palitos-vegetales',
      description: 'Hummus cremoso de garbanzos con tahini, acompañado de palitos de zanahoria, pepino y apio. Snack proteico y saciante.',
      shortDescription: 'Hummus con vegetales',
      price: 4.99,
      cost: 2.3,
      stock: 50,
      weight: 200,
      calories: 185,
      protein: 7,
      carbohydrates: 18,
      fat: 9,
      imageUrl: 'https://images.unsplash.com/photo-1571212515416-fca5e5138c8d?w=600',
      featured: true,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const energyBalls = await prisma.product.create({
    data: {
      sku: 'SNK002',
      name: 'Energy Balls de Cacao y Almendra',
      slug: 'energy-balls-cacao-almendra',
      description: 'Bolitas energéticas de dátiles, almendras, cacao puro y coco rallado. Sin azúcar añadido. Pack de 6 unidades. Energía natural instantánea.',
      shortDescription: 'Energy balls de cacao',
      price: 5.49,
      compareAtPrice: 6.49,
      cost: 2.7,
      stock: 45,
      weight: 150,
      calories: 245,
      protein: 6,
      carbohydrates: 28,
      fat: 12,
      imageUrl: 'https://images.unsplash.com/photo-1607623488235-e2e9ad42b31f?w=600',
      featured: true,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: superalimento.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const yogurGriego = await prisma.product.create({
    data: {
      sku: 'SNK003',
      name: 'Yogur Griego con Miel y Nueces',
      slug: 'yogur-griego-miel-nueces',
      description: 'Yogur griego natural con miel de azahar y nueces pecanas. Alto en proteínas y probióticos. Snack cremoso y delicioso.',
      shortDescription: 'Yogur griego proteico',
      price: 3.99,
      cost: 1.8,
      stock: 55,
      weight: 180,
      calories: 215,
      protein: 15,
      carbohydrates: 22,
      fat: 8,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const barraCereales = await prisma.product.create({
    data: {
      sku: 'SNK004',
      name: 'Barrita de Cereales y Frutos Rojos',
      slug: 'barrita-cereales-frutos-rojos',
      description: 'Barrita de avena integral, arándanos, frambuesas, almendras y miel. Sin azúcares refinados. Perfecta para llevar.',
      shortDescription: 'Barrita de cereales casera',
      price: 2.99,
      cost: 1.2,
      stock: 60,
      weight: 45,
      calories: 165,
      protein: 5,
      carbohydrates: 24,
      fat: 6,
      imageUrl: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const guacamoleNachos = await prisma.product.create({
    data: {
      sku: 'SNK005',
      name: 'Guacamole con Nachos de Maíz',
      slug: 'guacamole-nachos-maiz',
      description: 'Guacamole fresco de aguacate con lima, cilantro y tomate, acompañado de nachos de maíz horneados. Snack mexicano saludable.',
      shortDescription: 'Guacamole con nachos',
      price: 5.99,
      cost: 2.8,
      stock: 40,
      weight: 220,
      calories: 295,
      protein: 6,
      carbohydrates: 32,
      fat: 16,
      imageUrl: 'https://images.unsplash.com/photo-1596264116790-845b83230f8b?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const batidoProteico = await prisma.product.create({
    data: {
      sku: 'SNK006',
      name: 'Batido Proteico de Chocolate',
      slug: 'batido-proteico-chocolate',
      description: 'Batido con 25g de proteína whey, plátano, cacao puro, leche de almendra y mantequilla de cacahuete. Post-entreno perfecto.',
      shortDescription: 'Batido con 25g proteína',
      price: 4.99,
      compareAtPrice: 5.99,
      cost: 2.4,
      stock: 48,
      weight: 300,
      calories: 285,
      protein: 25,
      carbohydrates: 28,
      fat: 8,
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600',
      featured: true,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: altaProteina.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: proteica.id }],
      },
    },
  });

  const edamame = await prisma.product.create({
    data: {
      sku: 'SNK007',
      name: 'Edamame con Sal Marina',
      slug: 'edamame-sal-marina',
      description: 'Vainas de soja verde cocidas al vapor y saladas con sal marina. Snack japonés rico en proteína vegetal y bajo en calorías.',
      shortDescription: 'Edamame al vapor',
      price: 3.99,
      cost: 1.8,
      stock: 52,
      weight: 150,
      calories: 125,
      protein: 11,
      carbohydrates: 10,
      fat: 5,
      imageUrl: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: altaProteina.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const tostadasMantequillaAlmendra = await prisma.product.create({
    data: {
      sku: 'SNK008',
      name: 'Tostadas con Mantequilla de Almendra y Plátano',
      slug: 'tostadas-mantequilla-almendra-platano',
      description: 'Pan integral tostado con mantequilla de almendra natural, rodajas de plátano y un toque de canela. Snack energético y saciante.',
      shortDescription: 'Tostadas con mantequilla de almendra',
      price: 4.49,
      cost: 2.0,
      stock: 44,
      weight: 160,
      calories: 265,
      protein: 9,
      carbohydrates: 32,
      fat: 12,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const smoothieVerde = await prisma.product.create({
    data: {
      sku: 'SNK009',
      name: 'Smoothie Verde Detox',
      slug: 'smoothie-verde-detox',
      description: 'Batido verde de espinaca, kale, manzana verde, pepino, jengibre, limón y agua de coco. Refrescante, depurativo y lleno de vitaminas.',
      shortDescription: 'Smoothie verde depurativo',
      price: 5.49,
      cost: 2.6,
      stock: 38,
      weight: 350,
      calories: 145,
      protein: 4,
      carbohydrates: 28,
      fat: 2,
      imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }, { tagId: superalimento.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  const frutaDeshidratada = await prisma.product.create({
    data: {
      sku: 'SNK010',
      name: 'Mix de Fruta Deshidratada',
      slug: 'mix-fruta-deshidratada',
      description: 'Mezcla de mango, piña, arándanos y manzana deshidratados sin azúcar añadido. Dulzor natural concentrado. Snack energético portátil.',
      shortDescription: 'Mix de fruta deshidratada',
      price: 4.99,
      cost: 2.3,
      stock: 46,
      weight: 100,
      calories: 245,
      protein: 2,
      carbohydrates: 58,
      fat: 1,
      imageUrl: 'https://images.unsplash.com/photo-1582579180317-c5e2ba1c7c9d?w=600',
      featured: false,
      categoryId: snacks.id,
      tags: {
        create: [{ tagId: vegano.id }, { tagId: sinGluten.id }],
      },
      productLines: {
        create: [{ productLineId: livela.id }],
      },
    },
  });

  console.log('✅ Created 10 Snacks');

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
          { productId: bowlProteico.id, quantity: 2 },
          { productId: polloTeriyaki.id, quantity: 1 },
          { productId: hummusPalitos.id, quantity: 1 },
        ],
      },
    },
  });

  console.log('✅ Created test cart with items');

  console.log('🎉 Seeding completed successfully!');
  console.log('\nTest credentials:');
  console.log('Admin - Email: admin@nutreterra.es, Password: admin123');
  console.log('Customer - Email: test@example.com, Password: test123');
  console.log('\n📊 Database summary:');
  console.log('- 4 Categories: Desayunos, Comidas, Cenas, Snacks');
  console.log('- 40 Products: 10 per category with full nutritional macros');
  console.log('- 4 Product Lines: Livela, Proteica, Zima, Festia');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
