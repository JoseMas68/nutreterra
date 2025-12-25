// Datos mock de categorías para NutreTerra

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Cereales',
    slug: 'cereales',
    description: 'Cereales integrales y ecológicos para una alimentación saludable',
    imageUrl: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=800&h=450&fit=crop',
  },
  {
    id: '2',
    name: 'Legumbres',
    slug: 'legumbres',
    description: 'Legumbres ricas en proteína y fibra',
    imageUrl: 'https://images.unsplash.com/photo-1583523032135-e3b7f7c9f7c4?w=800&h=450&fit=crop',
  },
  {
    id: '3',
    name: 'Frutos Secos',
    slug: 'frutos-secos',
    description: 'Frutos secos naturales, fuente de grasas saludables',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&h=450&fit=crop',
  },
  {
    id: '4',
    name: 'Superalimentos',
    slug: 'superalimentos',
    description: 'Superalimentos con alto valor nutricional',
    imageUrl: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=800&h=450&fit=crop',
  },
  {
    id: '5',
    name: 'Snacks Saludables',
    slug: 'snacks',
    description: 'Snacks naturales para picar entre horas',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=450&fit=crop',
  },
];
