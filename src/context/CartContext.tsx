import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Coupon } from '@/types';
import { coupons, getProductById } from '@/data/products';

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: number, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discount: number;
  total: number;
  deliveryFee: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'velora-cart';
const COUPON_KEY = 'velora-coupon';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage(STORAGE_KEY, []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => loadFromStorage(COUPON_KEY, null));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  const addToCart = useCallback((productId: number, quantity: number, size: string, color: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId && i.size === size && i.color === color);
      if (existing) {
        return prev.map(i =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity, size, color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size: string, color: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size && i.color === color)));
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const { totalItems, subtotal } = useMemo(() => {
    let count = 0;
    let sub = 0;
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      count += item.quantity;
      sub += product.price * item.quantity;
    }
    return { totalItems: count, subtotal: sub };
  }, [items]);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const upper = code.toUpperCase().trim();
    const coupon = coupons.find(c => c.code === upper);
    if (!coupon) return { success: false, message: 'Invalid coupon code. Try VELORA10, WELCOME5, FASHION15, LUXE20, NEW25, FESTIVE30, or PREMIER50.' };
    if (subtotal < coupon.minOrder) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required for ${coupon.code}.` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied! ${coupon.label}.` };
  }, [subtotal]);

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }, [appliedCoupon, subtotal]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal - discount >= 999) return 0;
    return 99;
  }, [subtotal, discount]);

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discount,
    total,
    deliveryFee,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
