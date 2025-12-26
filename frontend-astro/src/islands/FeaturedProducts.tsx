import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  images?: string[];
  shortDescription?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  stock: number;
  featured?: boolean;
  productLine?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface FeaturedProductsProps {
  apiUrl: string;
}

export default function FeaturedProducts({ apiUrl }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products?featured=true&limit=8`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-96"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay productos destacados disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            shortDescription: product.shortDescription || product.category?.name || '',
            stock: product.stock || 100, // TODO: obtener stock real
            images: product.images || [product.imageUrl],
          }}
        />
      ))}
    </div>
  );
}
