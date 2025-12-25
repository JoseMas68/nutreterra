// Datos mock de productos para NutreTerra

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  imageUrl: string;
  images: string[];
  stock: number;
  tags: string[];
  featured: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    sku: 'AV001',
    name: 'Avena Integral Ecológica',
    slug: 'avena-integral-ecologica',
    description: 'Avena 100% integral procedente de cultivo ecológico. Rica en fibra, proteínas y minerales. Perfecta para desayunos energéticos y recetas saludables. Sin aditivos ni conservantes.',
    shortDescription: 'Avena ecológica 100% integral',
    price: 3.99,
    category: {
      id: '1',
      name: 'Cereales',
      slug: 'cereales',
    },
    imageUrl: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=600&h=600&fit=crop',
    ],
    stock: 50,
    tags: ['Vegano', 'Sin Gluten', 'Ecológico'],
    featured: true,
  },
  {
    id: '2',
    sku: 'QU001',
    name: 'Quinoa Blanca Bio',
    slug: 'quinoa-blanca-bio',
    description: 'Quinoa blanca de agricultura ecológica. Superalimento rico en proteína completa con los 9 aminoácidos esenciales. Ideal como guarnición o en ensaladas. Fácil de cocinar y muy versátil.',
    shortDescription: 'Quinoa ecológica con proteína completa',
    price: 5.49,
    compareAtPrice: 6.99,
    category: {
      id: '1',
      name: 'Cereales',
      slug: 'cereales',
    },
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    ],
    stock: 30,
    tags: ['Vegano', 'Sin Gluten', 'Proteína'],
    featured: true,
  },
  {
    id: '3',
    sku: 'LE001',
    name: 'Lentejas Rojas',
    slug: 'lentejas-rojas',
    description: 'Lentejas rojas de cocción rápida. Excelente fuente de proteína vegetal, hierro y fibra. Perfectas para currys, sopas y guisos. Se cocinan en solo 15 minutos.',
    shortDescription: 'Lentejas rojas de cocción rápida',
    price: 2.99,
    category: {
      id: '2',
      name: 'Legumbres',
      slug: 'legumbres',
    },
    imageUrl: 'https://images.unsplash.com/photo-1599909199731-b4ab8d9c8c07?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599909199731-b4ab8d9c8c07?w=600&h=600&fit=crop',
    ],
    stock: 45,
    tags: ['Vegano', 'Proteína', 'Sin Gluten'],
    featured: true,
  },
  {
    id: '4',
    sku: 'GA001',
    name: 'Garbanzos Ecológicos',
    slug: 'garbanzos-ecologicos',
    description: 'Garbanzos de cultivo ecológico. Versátiles y nutritivos, ideales para hummus, cocidos y ensaladas. Alto contenido en proteína y fibra. Producto certificado bio.',
    shortDescription: 'Garbanzos certificados ecológicos',
    price: 3.49,
    category: {
      id: '2',
      name: 'Legumbres',
      slug: 'legumbres',
    },
    imageUrl: 'https://images.unsplash.com/photo-1607712974164-f71335c8c0d0?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1607712974164-f71335c8c0d0?w=600&h=600&fit=crop',
    ],
    stock: 40,
    tags: ['Vegano', 'Proteína', 'Ecológico'],
    featured: false,
  },
  {
    id: '5',
    sku: 'AL001',
    name: 'Almendras Crudas',
    slug: 'almendras-crudas',
    description: 'Almendras crudas naturales sin tostar ni salar. Ricas en vitamina E, magnesio y grasas saludables. Perfectas como snack o para hacer leche de almendras casera.',
    shortDescription: 'Almendras crudas sin tostar',
    price: 7.99,
    category: {
      id: '3',
      name: 'Frutos Secos',
      slug: 'frutos-secos',
    },
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&h=600&fit=crop',
    ],
    stock: 25,
    tags: ['Vegano', 'Proteína', 'Sin Gluten'],
    featured: true,
  },
  {
    id: '6',
    sku: 'NU001',
    name: 'Nueces de California',
    slug: 'nueces-california',
    description: 'Nueces de California premium. Excelente fuente de Omega-3, antioxidantes y minerales. Perfectas para ensaladas, repostería o como snack energético.',
    shortDescription: 'Nueces premium ricas en Omega-3',
    price: 8.49,
    category: {
      id: '3',
      name: 'Frutos Secos',
      slug: 'frutos-secos',
    },
    imageUrl: 'https://images.unsplash.com/photo-1621368883218-68f1fe6f3c60?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621368883218-68f1fe6f3c60?w=600&h=600&fit=crop',
    ],
    stock: 20,
    tags: ['Vegano', 'Omega-3', 'Sin Gluten'],
    featured: true,
  },
  {
    id: '7',
    sku: 'CH001',
    name: 'Semillas de Chía',
    slug: 'semillas-chia',
    description: 'Semillas de chía orgánicas. Superalimento rico en Omega-3, fibra y proteína. Perfectas para puddings, smoothies y como topping. Ayudan a la digestión y saciedad.',
    shortDescription: 'Semillas de chía orgánicas',
    price: 4.99,
    category: {
      id: '4',
      name: 'Superalimentos',
      slug: 'superalimentos',
    },
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop',
    ],
    stock: 35,
    tags: ['Vegano', 'Omega-3', 'Fibra'],
    featured: true,
  },
  {
    id: '8',
    sku: 'ES001',
    name: 'Espirulina en Polvo',
    slug: 'espirulina-polvo',
    description: 'Espirulina pura en polvo. Alga con altísimo contenido en proteína (65%), hierro y vitaminas. Ideal para smoothies y batidos verdes. Energizante natural.',
    shortDescription: 'Espirulina pura 100%',
    price: 12.99,
    category: {
      id: '4',
      name: 'Superalimentos',
      slug: 'superalimentos',
    },
    imageUrl: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=600&h=600&fit=crop',
    ],
    stock: 15,
    tags: ['Vegano', 'Proteína', 'Antioxidantes'],
    featured: true,
  },
  {
    id: '9',
    sku: 'AR001',
    name: 'Arroz Integral Bio',
    slug: 'arroz-integral-bio',
    description: 'Arroz integral de grano largo de cultivo ecológico. Conserva todos sus nutrientes y fibra. Ideal como guarnición o para bowls saludables. Sabor suave y textura firme.',
    shortDescription: 'Arroz integral ecológico',
    price: 3.29,
    category: {
      id: '1',
      name: 'Cereales',
      slug: 'cereales',
    },
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    ],
    stock: 60,
    tags: ['Vegano', 'Sin Gluten', 'Ecológico'],
    featured: false,
  },
  {
    id: '10',
    sku: 'PA001',
    name: 'Pasta de Lentejas',
    slug: 'pasta-lentejas',
    description: 'Pasta fusilli elaborada 100% con harina de lentejas rojas. Alta en proteína y sin gluten. Perfecta para deportistas y celíacos. Cocción en 8-10 minutos.',
    shortDescription: 'Pasta 100% lentejas sin gluten',
    price: 4.49,
    category: {
      id: '2',
      name: 'Legumbres',
      slug: 'legumbres',
    },
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop',
    ],
    stock: 28,
    tags: ['Vegano', 'Proteína', 'Sin Gluten'],
    featured: false,
  },
];
