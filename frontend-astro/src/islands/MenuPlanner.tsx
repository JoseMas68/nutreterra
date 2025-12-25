import { useState, useEffect } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: {
    name: string;
  };
}

interface MenuItem {
  id: string;
  productId: string;
  day: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  order: number;
  quantity: number;
  product: Product;
}

interface Menu {
  id?: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MEAL_TYPES = [
  { key: 'BREAKFAST', label: 'Desayuno', color: 'bg-yellow-100 border-yellow-300' },
  { key: 'LUNCH', label: 'Comida', color: 'bg-orange-100 border-orange-300' },
  { key: 'DINNER', label: 'Cena', color: 'bg-blue-100 border-blue-300' },
  { key: 'SNACK', label: 'Snack', color: 'bg-green-100 border-green-300' },
];

// Componente de producto en la lista de disponibles
function ProductItem({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `product-${product.id}`,
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
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
        <p className="text-xs text-gray-500">{product.category.name}</p>
        <p className="text-sm font-semibold text-primary">{product.price.toFixed(2)}€</p>
      </div>
    </div>
  );
}

// Componente de item en el menú
function MenuItemCard({ item, onRemove }: { item: MenuItem; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg">
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-xs text-gray-900 truncate">{item.product.name}</h5>
        <p className="text-xs text-gray-500">x{item.quantity}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 transition-colors p-1"
        title="Eliminar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function MenuPlanner({ apiUrl }: { apiUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [menu, setMenu] = useState<Menu>({
    name: 'Mi Menú Semanal',
    description: '',
    items: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Cargar productos
  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error loading products:', error));
  }, [apiUrl]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Extraer información del drop zone
    const overId = over.id as string;
    const [type, day, mealType] = overId.split('-');

    if (type === 'dropzone' && active.id.toString().startsWith('product-')) {
      // Agregar producto al menú
      const productId = active.id.toString().replace('product-', '');
      const product = products.find((p) => p.id === productId);

      if (product) {
        const dayIndex = parseInt(day);
        const existingItems = menu.items.filter(
          (item) => item.day === dayIndex && item.mealType === mealType
        );

        const newItem: MenuItem = {
          id: `temp-${Date.now()}`,
          productId: product.id,
          day: dayIndex,
          mealType: mealType as any,
          order: existingItems.length,
          quantity: 1,
          product,
        };

        setMenu((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
      }
    }

    setActiveId(null);
  };

  const removeItem = (itemId: string) => {
    setMenu((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const saveMenu = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...menu,
          items: menu.items.map((item) => ({
            productId: item.productId,
            day: item.day,
            mealType: item.mealType,
            order: item.order,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const savedMenu = await response.json();
        setMenu(savedMenu);
        setMessage({ type: 'success', text: 'Menú guardado correctamente' });
      } else {
        throw new Error('Error al guardar el menú');
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      setMessage({ type: 'error', text: 'Error al guardar el menú' });
    } finally {
      setIsSaving(false);
    }
  };

  const getItemsForSlot = (day: number, mealType: string) => {
    return menu.items.filter((item) => item.day === day && item.mealType === mealType);
  };

  const activeProduct = activeId
    ? products.find((p) => `product-${p.id}` === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Planificador de Menús</h1>
          <p className="text-gray-600">Arrastra productos a cada día y comida para crear tu menú semanal</p>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Lista de productos */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Productos Disponibles</h2>
              <SortableContext
                items={products.map((p) => `product-${p.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2">
                  {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>

          {/* Main: Planificador semanal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={menu.name}
                  onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nombre del menú"
                />
                <button
                  onClick={saveMenu}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-leaf transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Menú'}
                </button>
              </div>
            </div>

            {/* Grid semanal */}
            <div className="grid grid-cols-1 gap-6">
              {DAYS.map((dayName, dayIndex) => (
                <div key={dayIndex} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{dayName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MEAL_TYPES.map((mealType) => {
                      const items = getItemsForSlot(dayIndex, mealType.key);
                      return (
                        <div
                          key={mealType.key}
                          id={`dropzone-${dayIndex}-${mealType.key}`}
                          className={`min-h-[120px] p-3 rounded-lg border-2 border-dashed ${mealType.color}`}
                        >
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">
                            {mealType.label}
                          </h4>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                onRemove={() => removeItem(item.id)}
                              />
                            ))}
                            {items.length === 0 && (
                              <p className="text-xs text-gray-400 italic text-center py-4">
                                Arrastra un producto aquí
                              </p>
                            )}
                          </div>
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

      <DragOverlay>
        {activeProduct ? (
          <div className="flex items-center gap-3 p-3 bg-white border-2 border-primary rounded-lg shadow-xl">
            <img
              src={activeProduct.imageUrl}
              alt={activeProduct.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium text-sm">{activeProduct.name}</h4>
              <p className="text-xs text-gray-500">{activeProduct.category.name}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
