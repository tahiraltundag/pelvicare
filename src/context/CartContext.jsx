import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/client';

const CartContext = createContext(null);

const CART_KEY = 'pelvi_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.variant === product.variant);
      if (existing) {
        return prev.map((i) => (i.id === product.id && i.variant === product.variant) ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });

    const id = Date.now();
    setToasts((prev) => [...prev, { id, name: product.name }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);

    setSidebarOpen(true);
  }, []);

  const removeFromCart = useCallback((productId, variant) => {
    setItems((prev) => prev.filter((i) => !(i.id === productId && i.variant === variant)));
  }, []);

  const updateQty = useCallback((productId, variant, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === productId && i.variant === variant) ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  // Merge guest cart with server after login
  const mergeGuestCart = useCallback(async () => {
    // Currently cart is localStorage-only; merge is a no-op but kept for future API cart sync
    return Promise.resolve();
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, toasts, sidebarOpen, setSidebarOpen, addToCart, removeFromCart, updateQty, clearCart, mergeGuestCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
