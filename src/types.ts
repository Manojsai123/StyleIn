export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  address: {
    fullName: string;
    street: string;
    city: string;
    zipCode: string;
  };
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}
