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

export const api = {
  // Auth
  async register(data: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
    } catch (e) {
      // Fallback: Local registration
      const newUser: User = { id: Date.now().toString(), ...data, role: 'user' };
      saveLocalUser(newUser);
      return { token: `local-token-${newUser.id}`, user: newUser };
    }
  },

  async login(data: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
    } catch (e) {
      // Fallback: Local login
      const users = getLocalUsers();
      const user = users.find(u => u.email === data.email);
      if (!user) throw new Error('User not found');
      return { token: `local-token-${user.id}`, user };
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
    } catch (e) {
      return MOCK_PRODUCTS || [];
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
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
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
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
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error();
      return await res.json();
    } catch (e) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return user ? getLocalOrders(user.id) : [];
    }
  },

  // Admin
  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: getHeaders()
      });
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) throw new Error([]);
      return await res.json();
    } catch (e) {
      return [];
    }
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
