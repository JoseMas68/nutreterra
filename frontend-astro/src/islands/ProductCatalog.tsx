import { useState, useEffect } from 'react';

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
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Buscar
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🍽️ Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📦 Línea de Producto
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">Todas las líneas</option>
              {productLines.map((line) => (
                <option key={line.id} value={line.slug}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <a
              key={product.id}
              href={`/producto/${product.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.compareAtPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    OFERTA
                  </div>
                )}
                {product.productLine && (
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                    {product.productLine.name}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category.name}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.calories && (
                  <p className="text-xs text-gray-500 mb-3">
                    {product.calories} kcal • {product.protein}g proteína
                  </p>
                )}
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg md:text-xl font-bold text-primary">
                      {product.price.toFixed(2)}€
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.compareAtPrice.toFixed(2)}€
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
