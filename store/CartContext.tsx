'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  addCartItem: (item: CartItem) => void;
  removeCartItem: (productId: string) => void;
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

  const addCartItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const isExist = prevItems.some((i) => i.productId === item.productId);
      if (isExist) return prevItems;
      
      return [...prevItems, item];
    });
  };

  const removeCartItem = (productId: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addCartItem, removeCartItem }}>
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
