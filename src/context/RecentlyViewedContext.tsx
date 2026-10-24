import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface RecentlyViewedContextValue {
  productIds: number[];
  addProduct: (id: number) => void;
  getRecent: (excludeId?: number, limit?: number) => number[];
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);
const STORAGE_KEY = 'velora-recently-viewed';
const MAX_ITEMS = 12;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  }, [productIds]);

  const addProduct = useCallback((id: number) => {
    setProductIds(prev => {
      const filtered = prev.filter(pid => pid !== id);
      return [id, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const getRecent = useCallback(
    (excludeId?: number, limit = 8) => {
      const filtered = excludeId ? productIds.filter(id => id !== excludeId) : productIds;
      return filtered.slice(0, limit);
    },
    [productIds],
  );

  return (
    <RecentlyViewedContext.Provider value={{ productIds, addProduct, getRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
