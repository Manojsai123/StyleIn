import { Product, User, Order } from '../types';

const API_BASE = '/api';

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
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async login(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async getUserOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/user/orders`, {
      headers: getHeaders()
    });
    return res.json();
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
