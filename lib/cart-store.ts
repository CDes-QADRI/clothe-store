"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './products';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, size) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id && item.size === size
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                size,
                quantity: 1
              }
            ]
          };
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: 'wk-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
