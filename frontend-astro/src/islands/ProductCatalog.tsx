import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  compareAtPrice: number | null;
  calories: number | null;
  protein: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  productLine?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductLine {
  id: string;
  name: string;
  slug: string;
}

export default function ProductCatalog({ apiUrl }: { apiUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[ProductCatalog] Fetching from:', apiUrl);
        const [productsRes, categoriesRes, linesRes] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/categories`),
          fetch(`${apiUrl}/api/product-lines`),
        ]);

        console.log('[ProductCatalog] Response status:', productsRes.status, categoriesRes.status, linesRes.status);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const linesData = await linesRes.json();

        console.log('[ProductCatalog] Products loaded:', productsData.length);
        console.log('[ProductCatalog] Categories loaded:', categoriesData.length);
        console.log('[ProductCatalog] Lines loaded:', linesData.length);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setProductLines(linesData.filter((line: ProductLine & { active: boolean }) => line.active));
      } catch (error) {
        console.error('[ProductCatalog] Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.slug === selectedCategory);
    }

    // Filtro por línea de producto
    if (selectedLine !== 'all') {
      filtered = filtered.filter(p => p.productLine?.slug === selectedLine);
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedLine, searchQuery, products]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedLine('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por línea de producto */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Línea de Producto
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">Todas las líneas</option>
              {productLines.map((line) => (
                <option key={line.id} value={line.slug}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          {/* Espacio vacío para balance */}
          <div></div>
        </div>

        {/* Filtros activos y botón limpiar */}
        {(selectedCategory !== 'all' || selectedLine !== 'all' || searchQuery) && (
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              )}
              {selectedLine !== 'all' && (
                <span className="px-3 py-1 bg-leaf/10 text-leaf rounded-full text-sm font-medium">
                  {productLines.find(l => l.slug === selectedLine)?.name}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              ✕ Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Contador de resultados */}
      <div className="mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-bold text-primary">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-6">Intenta con otros filtros o búsqueda</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                shortDescription: product.category.name,
                stock: 100, // TODO: obtener stock real de la BD
                images: [product.imageUrl],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
