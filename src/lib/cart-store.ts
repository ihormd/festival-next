"use client";
import { useSyncExternalStore } from "react";

export type CartItem = { id: string; name: string; price_cents: number; image_url?: string | null; qty: number; };

const KEY = "nuff_cart_v1";
const listeners = new Set<() => void>();
let items: CartItem[] = [];

if (typeof window !== "undefined") {
  try { items = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { items = []; }
}

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach(l => l());
}

export const cart = {
  add(p: Omit<CartItem, "qty">, qty = 1) {
    const ex = items.find(i => i.id === p.id);
    if (ex) ex.qty += qty; else items = [...items, { ...p, qty }];
    persist();
  },
  remove(id: string) { items = items.filter(i => i.id !== id); persist(); },
  setQty(id: string, qty: number) {
    if (qty <= 0) return cart.remove(id);
    items = items.map(i => i.id === id ? { ...i, qty } : i);
    persist();
  },
  clear() { items = []; persist(); },
  get items() { return items; },
};

export function useCart() {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb); },
    () => items,
    () => [],
  );
}
