// Cliente API para gestión de pedidos

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

// Helper para obtener el token de autenticación
const getAuthToken = (): string | null => {
  try {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      return JSON.parse(tokenData);
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return null;
};

// Helper para obtener headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug?: string;
    images: string[];
    description?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  address: {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateOrderData {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod?: string;
  notes?: string;
}

/**
 * Obtener todos los pedidos del usuario autenticado
 */
export async function getUserOrders(status?: string): Promise<Order[]> {
  const url = new URL(`${API_URL}/api/orders`);
  if (status) {
    url.searchParams.append('status', status);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener pedidos');
  }

  const data = await response.json();
  return data.orders;
}

/**
 * Obtener detalles de un pedido específico
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener pedido');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Crear un nuevo pedido
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear pedido');
  }

  const data = await response.json();
  return data.order;
}
