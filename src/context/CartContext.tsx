import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cartKey = user ? `cart_${user.id}` : 'cart_guest';

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle account switching by swapping cart data
  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    const initialCart = saved ? JSON.parse(saved) : [];
    setCart(initialCart);
    setIsLoaded(true);
  }, [cartKey]);

  // PERSISTENCE: Save cart whenever it changes, but only after initial load for that account
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey, isLoaded]);

  const addToCart = (product: Product, size: string) => {
    if (!isLoaded) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    if (!isLoaded) return;
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (!isLoaded || quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item.id === productId && item.selectedSize === size) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => {
    if (!isLoaded) return;
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
