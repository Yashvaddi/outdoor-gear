import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  colorId: string;
  sizeId: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (colorId: string, sizeId: string) => void;
  updateQuantity: (colorId: string, sizeId: string, quantity: number) => void;
  isAdding: boolean;
  error: string | null;
  clearError: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart data from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (newItem: CartItem) => {
    setIsAdding(true);
    setError(null);
    
    // Simulate a mock async function with loading state and random failure
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsAdding(false);
        // Simulate 20% failure rate for bonus points
        if (Math.random() < 0.2) {
          const errMsg = 'Simulated network error: Failed to add to cart. Try again.';
          setError(errMsg);
          reject(new Error(errMsg));
          return;
        }

        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(
            item => item.productId === newItem.productId && item.colorId === newItem.colorId && item.sizeId === newItem.sizeId
          );

          if (existingItemIndex >= 0) {
            const newItems = [...prevItems];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return newItems;
          }
          
          return [...prevItems, newItem];
        });
        resolve();
      }, 800);
    });
  };

  const removeFromCart = (colorId: string, sizeId: string) => {
    setItems(prevItems => prevItems.filter(item => !(item.colorId === colorId && item.sizeId === sizeId)));
  };

  const updateQuantity = (colorId: string, sizeId: string, quantity: number) => {
    setItems(prevItems => prevItems.map(item => 
      (item.colorId === colorId && item.sizeId === sizeId) ? { ...item, quantity } : item
    ));
  };

  const clearError = () => setError(null);

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      isAdding,
      error,
      clearError,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
