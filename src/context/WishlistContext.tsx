import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface WishlistContextValue {
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  removeFromWishlist: (productId: number) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = 'velora-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId],
    );
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => wishlist.includes(productId),
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist, count: wishlist.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
