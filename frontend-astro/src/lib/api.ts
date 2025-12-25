// Servicio para conectar con la API del backend
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  featured: boolean;
  active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

// Obtener todos los productos
export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams();

  if (params?.category) searchParams.set('category', params.category);
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const url = `${API_URL}/products${searchParams.toString() ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Obtener un producto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

// Obtener todas las categorías
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Obtener una categoría por slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error fetching category: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}
