'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, initialItems = [] }: { 
  children: React.ReactNode; 
  initialItems?: CartItem[]; 
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);

  useEffect(() => {
    setCartItems(initialItems);
  }, [JSON.stringify(initialItems)]);

  return (
    <CartContext.Provider value={{ cartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
