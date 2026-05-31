"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { type ShopProduct } from "@/lib/shop-products";

export type CartProduct = ShopProduct;

export const PREMIUM_BOX_PRICE = 599;

type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  subtotal: number;
  premiumBoxSelected: boolean;
  addItem: (product: CartProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPremiumBoxSelected: (selected: boolean) => void;
  togglePremiumBox: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [premiumBoxSelected, setPremiumBoxSelected] = useState(false);

  const addItem = useCallback((product: CartProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPremiumBoxSelected(false);
  }, []);

  const togglePremiumBox = useCallback(() => {
    setPremiumBoxSelected((current) => !current);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + (premiumBoxSelected ? PREMIUM_BOX_PRICE : 0);

    return {
      items,
      itemCount,
      subtotal,
      total,
      premiumBoxSelected,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setPremiumBoxSelected,
      togglePremiumBox,
    };
  }, [
    addItem,
    clearCart,
    items,
    premiumBoxSelected,
    removeItem,
    togglePremiumBox,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
