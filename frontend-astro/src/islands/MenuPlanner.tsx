import { useState, useEffect } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MenuItem {
  id: string;
  productId: string;
  day: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  product: Product;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const MEALS = [
  { key: 'breakfast', label: 'Desayuno', icon: '🌅', color: 'bg-amber-50 border-amber-200' },
  { key: 'lunch', label: 'Comida', icon: '🍽️', color: 'bg-orange-50 border-orange-200' },
  { key: 'dinner', label: 'Cena', icon: '🌙', color: 'bg-blue-50 border-blue-200' },
  { key: 'snack', label: 'Snack', icon: '🍎', color: 'bg-green-50 border-green-200' },
] as const;

function SortableProductCard({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border border-gray-200 p-3"
    >
      <div className="flex items-center gap-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
            {product.name}
          </h4>
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          {product.calories && (
            <p className="text-xs text-gray-600">
              {product.calories} kcal • {product.protein}g prot
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item, onRemove }: { item: MenuItem; onRemove: () => void }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm">
      <div className="flex items-start gap-2">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-14 h-14 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-xs text-gray-900 truncate mb-1">
            {item.product.name}
          </h5>
          {item.product.calories && (
            <p className="text-xs text-gray-500">
              {item.product.calories} kcal
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MenuPlanner({ apiUrl }: { apiUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[MenuPlanner] Fetching from:', apiUrl);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/categories`),
        ]);

        console.log('[MenuPlanner] Response status:', productsRes.status, categoriesRes.status);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        console.log('[MenuPlanner] Products loaded:', productsData.length);
        console.log('[MenuPlanner] Categories loaded:', categoriesData.length);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('[MenuPlanner] Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.slug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const addToMenu = (product: Product, day: number, mealType: typeof MEALS[number]['key']) => {
    const newItem: MenuItem = {
      id: `${Date.now()}-${Math.random()}`,
      productId: product.id,
      day,
      mealType,
      product,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const removeFromMenu = (itemId: string) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  const getItemsForSlot = (day: number, mealType: string) => {
    return menuItems.filter(item => item.day === day && item.mealType === mealType);
  };

  const getTotalMacros = () => {
    return menuItems.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.product.calories || 0),
        protein: acc.protein + (item.product.protein || 0),
        carbs: acc.carbs + (item.product.carbohydrates || 0),
        fat: acc.fat + (item.product.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const sendToCart = () => {
    alert('Funcionalidad de carrito próximamente!');
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

  const totals = getTotalMacros();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Productos */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Productos Disponibles</h3>

              {/* Búsqueda */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Categorías */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="all">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Lista de Productos */}
            <div className="bg-white rounded-xl shadow-lg p-4 max-h-[600px] overflow-y-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredProducts.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <SortableProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    <div className="bg-white rounded-lg shadow-xl p-3 border-2 border-primary">
                      {/* Overlay content */}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Planificador */}
        <div className="lg:col-span-3 space-y-6">
          {/* Resumen de Macros */}
          {menuItems.length > 0 && (
            <div className="bg-gradient-to-r from-primary to-leaf rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Resumen Semanal</h3>
                <button
                  onClick={sendToCart}
                  className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Añadir al Carrito
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Calorías</p>
                  <p className="text-2xl font-bold">{Math.round(totals.calories)}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Proteína</p>
                  <p className="text-2xl font-bold">{Math.round(totals.protein)}g</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Carbohidratos</p>
                  <p className="text-2xl font-bold">{Math.round(totals.carbs)}g</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Grasas</p>
                  <p className="text-2xl font-bold">{Math.round(totals.fat)}g</p>
                </div>
              </div>
            </div>
          )}

          {/* Cuadrícula de Días */}
          <div className="space-y-4">
            {DAYS.map((dayName, dayIndex) => (
              <div key={dayIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">{dayName}</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {MEALS.map((meal) => {
                    const items = getItemsForSlot(dayIndex, meal.key);
                    return (
                      <div key={meal.key} className={`${meal.color} rounded-lg border-2 p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{meal.icon}</span>
                          <h4 className="font-semibold text-sm text-gray-800">{meal.label}</h4>
                        </div>
                        <div className="space-y-2 min-h-[80px]">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                onRemove={() => removeFromMenu(item.id)}
                              />
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-xs text-gray-400">
                                Haz clic en un producto para agregarlo
                              </p>
                            </div>
                          )}
                        </div>
                        {items.length === 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {filteredProducts.slice(0, 3).map((product) => (
                              <button
                                key={product.id}
                                onClick={() => addToMenu(product, dayIndex, meal.key)}
                                className="text-xs bg-white hover:bg-gray-50 px-2 py-1 rounded border border-gray-300 transition-colors"
                              >
                                + {product.name.split(' ').slice(0, 2).join(' ')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
