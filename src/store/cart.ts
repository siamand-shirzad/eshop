"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";
import { useAuth } from "./auth";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  mergeOnLogin: () => Promise<void>;
}

/** Pure local upsert used for optimistic updates. */
function upsertLocal(items: CartItem[], product: Product, qty: number): CartItem[] {
  const existing = items.find((i) => i.productId === product.id);
  if (existing) {
    return items.map((i) =>
      i.productId === product.id
        ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
        : i,
    );
  }
  return [
    ...items,
    {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      quantity: Math.min(qty, product.stock),
      stock: product.stock,
    },
  ];
}

/** Call the server cart API; returns the authoritative items, or null on failure. */
async function syncCart(
  path: string,
  method: string,
  body?: unknown,
): Promise<CartItem[] | null> {
  try {
    const res = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.items ?? null) as CartItem[] | null;
  } catch {
    return null;
  }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        if (product.stock === 0) return;
        set((state) => ({ items: upsertLocal(state.items, product, qty) }));
        if (useAuth.getState().user) {
          void syncCart("/api/cart", "POST", {
            productId: product.id,
            quantity: qty,
          }).then((items) => {
            if (items) set({ items });
          });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        if (useAuth.getState().user) {
          void syncCart(`/api/cart?productId=${productId}`, "DELETE").then(
            (items) => {
              if (items) set({ items });
            },
          );
        }
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
        if (useAuth.getState().user) {
          void syncCart("/api/cart", "PATCH", {
            productId,
            quantity,
          }).then((items) => {
            if (items) set({ items });
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
        if (useAuth.getState().user) {
          void syncCart("/api/cart?all=1", "DELETE").then((items) => {
            if (items) set({ items });
          });
        }
      },

      mergeOnLogin: async () => {
        const items = await syncCart("/api/cart/merge", "POST", {
          items: get().items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        });
        if (items) set({ items });
      },
    }),
    { name: "chronos-cart" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
