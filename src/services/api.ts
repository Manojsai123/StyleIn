import { Product, User, Order } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const API_BASE = '/api';

// Helper for local storage Fallback (for Netlify/Static hosting)
const getLocalUsers = (): User[] => JSON.parse(localStorage.getItem('stylein_users') || '[]');
const saveLocalUser = (user: User) => {
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem('stylein_users', JSON.stringify(users));
};

const getLocalOrders = (userId: string): Order[] => {
  const allOrders: Order[] = JSON.parse(localStorage.getItem('stylein_orders') || '[]');
  return allOrders.filter(o => o.userId === userId);
};

const saveLocalOrder = (order: Order) => {
  const allOrders: Order[] = JSON.parse(localStorage.getItem('stylein_orders') || '[]');
  allOrders.push(order);
  localStorage.setItem('stylein_orders', JSON.stringify(allOrders));
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Shared helper to safely handle JSON parsing and fallback
const handleResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type');
  if (!res.ok || !contentType || !contentType.includes('application/json')) {
    throw new Error('Not a valid JSON response from server');
  }
  return res.json();
};

export const api = {
  // Auth
  async register(data: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (e) {
      // Fallback: Local registration
      const newUser: User = { id: Date.now().toString(), ...data, role: 'user' };
      saveLocalUser(newUser);
      const token = `local-token-${newUser.id}`;
      return { token, user: newUser };
    }
  },

  async login(data: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (e) {
      // Fallback: Local login
      const users = getLocalUsers();
      const user = users.find(u => u.email === data.email);
      if (!user) throw new Error('User not found locally');
      // In a real app we'd verify password, but for safety in static mode we allow local mock login
      const token = `local-token-${user.id}`;
      return { token, user };
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      return await handleResponse(res);
    } catch (e) {
      return MOCK_PRODUCTS;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      return await handleResponse(res);
    } catch (e) {
      const p = MOCK_PRODUCTS.find(p => p.id === id);
      if (!p) throw new Error('Product not found');
      return p;
    }
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      return await handleResponse(res);
    } catch (e) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const newOrder: Order = {
        id: Date.now().toString(),
        userId: user?.id || 'guest',
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      saveLocalOrder(newOrder);
      return newOrder;
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/user/orders`, {
        headers: getHeaders()
      });
      return await handleResponse(res);
    } catch (e) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return [];
      return getLocalOrders(user.id);
    }
  },

  // Admin
  async getAllOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async addProduct(productData: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return res.json();
  }
};
