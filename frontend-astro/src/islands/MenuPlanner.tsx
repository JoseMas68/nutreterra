import { useState, useEffect } from 'react';
import { addCartItem } from '../stores/cartStore';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
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
  { key: 'breakfast', label: 'Desayuno' },
  { key: 'lunch', label: 'Comida' },
  { key: 'dinner', label: 'Cena' },
  { key: 'snack', label: 'Snack' },
] as const;

function SortableProductCard({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    data: {
      type: 'Product',
      product,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 p-3 touch-none relative group"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="flex items-center gap-3 cursor-grab active:cursor-grabbing"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs text-gray-900 truncate mb-0.5">
            {product.name}
          </h4>
          <p className="text-[10px] text-gray-500">{product.category.name}</p>
        </div>
      </div>
    </div>
  );
}

function DroppableMealSlot({ 
  dayIndex, 
  mealKey, 
  label, 
  items, 
  onRemove,
  onAddClick
}: { 
  dayIndex: number; 
  mealKey: string; 
  label: string;
  items: MenuItem[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayIndex}-${mealKey}`,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`
        rounded-lg border-2 border-dashed p-3 min-h-[120px] transition-colors relative
        ${isOver ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">{label}</h4>
        <button
          onClick={onAddClick}
          className="md:hidden p-1 bg-primary text-white rounded-full shadow-sm hover:bg-leaf transition-colors"
          title="Añadir producto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onRemove={() => onRemove(item.id)}
          />
        ))}
        {items.length === 0 && !isOver && (
          <div className="h-full flex items-center justify-center py-4">
            <p className="text-xs text-gray-400 text-center hidden md:block">
              Arrastra aquí
            </p>
            <p className="text-xs text-gray-400 text-center md:hidden">
              Vacío
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ item, onRemove }: { item: MenuItem; onRemove: () => void }) {
  return (
    <div className="bg-white rounded border border-gray-200 p-2 shadow-sm flex items-center gap-2 group">
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="w-8 h-8 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-xs text-gray-900 truncate">
          {item.product.name}
        </h5>
        {item.product.calories && (
          <p className="text-[10px] text-gray-500">
            {item.product.calories} kcal
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Eliminar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
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

  // Estado para el modal de selección de productos (Móvil)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{dayIndex: number, mealKey: string} | null>(null);
  
  // Filtros independientes para el modal móvil
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalSelectedCategory, setModalSelectedCategory] = useState('all');
  const [modalFilteredProducts, setModalFilteredProducts] = useState<Product[]>([]);

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

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setFilteredProducts(productsData);
        setModalFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('[MenuPlanner] Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Aplicar filtros sidebar (Desktop)
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

  // Aplicar filtros modal (Móvil)
  useEffect(() => {
    let filtered = [...products];

    if (modalSelectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.slug === modalSelectedCategory);
    }

    if (modalSearchQuery.trim()) {
      const query = modalSearchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query)
      );
    }

    setModalFilteredProducts(filtered);
  }, [modalSelectedCategory, modalSearchQuery, products]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.data.current?.type === 'Product') {
      const [dayStr, mealType] = over.id.toString().split('-');
      const day = parseInt(dayStr);
      const product = active.data.current.product as Product;
      
      if (!isNaN(day) && product) {
        addToMenu(product, day, mealType as any);
      }
    }
    
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

  const getDayMacros = (dayIndex: number) => {
    const dayItems = menuItems.filter(item => item.day === dayIndex);
    return dayItems.reduce(
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
    if (menuItems.length === 0) {
      alert('Añade productos al menú primero');
      return;
    }

    menuItems.forEach(item => {
      addCartItem(item.product);
    });

    alert('Productos añadidos al carrito!');
    window.location.href = '/carrito';
  };

  const openProductModal = (dayIndex: number, mealKey: string) => {
    setActiveSlot({ dayIndex, mealKey });
    setIsProductModalOpen(true);
    // Resetear filtros del modal al abrir
    setModalSearchQuery('');
    setModalSelectedCategory('all');
  };

  const handleProductSelect = (product: Product) => {
    if (activeSlot) {
      addToMenu(product, activeSlot.dayIndex, activeSlot.mealKey as any);
      setIsProductModalOpen(false);
      setActiveSlot(null);
    }
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Productos (Solo Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
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
                <SortableContext
                  items={filteredProducts.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <SortableProductCard 
                        key={product.id} 
                        product={product} 
                      />
                    ))}
                  </div>
                </SortableContext>
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
              {DAYS.map((dayName, dayIndex) => {
                const dayMacros = getDayMacros(dayIndex);
                const hasMacros = dayMacros.calories > 0 || dayMacros.protein > 0 || dayMacros.carbs > 0 || dayMacros.fat > 0;

                return (
                  <div key={dayIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{dayName}</h3>
                        {hasMacros && (
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-primary">{Math.round(dayMacros.calories)}</span>
                              <span className="text-gray-500">kcal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-blue-600">{Math.round(dayMacros.protein)}g</span>
                              <span className="text-gray-500">P</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-accent">{Math.round(dayMacros.carbs)}g</span>
                              <span className="text-gray-500">C</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-leaf">{Math.round(dayMacros.fat)}g</span>
                              <span className="text-gray-500">G</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {MEALS.map((meal) => {
                        const items = getItemsForSlot(dayIndex, meal.key);
                        return (
                          <DroppableMealSlot
                            key={meal.key}
                            dayIndex={dayIndex}
                            mealKey={meal.key}
                            label={meal.label}
                            items={items}
                            onRemove={removeFromMenu}
                            onAddClick={() => openProductModal(dayIndex, meal.key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white rounded-lg shadow-xl p-3 border-2 border-primary w-64 opacity-90">
            {(() => {
              const product = products.find(p => p.id === activeId);
              if (!product) return null;
              return (
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-gray-900 truncate mb-0.5">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-gray-500">{product.category.name}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : null}
      </DragOverlay>

      {/* Modal de Selección de Productos (Móvil) */}
      {isProductModalOpen && activeSlot && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full h-[85vh] sm:h-auto sm:max-h-[80vh] sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Header del Modal */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Añadir a {DAYS[activeSlot.dayIndex]}
                </h3>
                <p className="text-sm text-gray-500">
                  {MEALS.find(m => m.key === activeSlot.mealKey)?.label}
                </p>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filtros del Modal */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
              <input
                type="text"
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setModalSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    modalSelectedCategory === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setModalSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      modalSelectedCategory === cat.slug 
                        ? 'bg-primary text-white' 
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Productos del Modal */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-3">
                {modalFilteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {product.calories && <span>{product.calories} kcal</span>}
                        {product.protein && <span>• {product.protein}g prot</span>}
                      </div>
                    </div>
                    <div className="p-2 text-primary bg-primary/5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                ))}
                {modalFilteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
