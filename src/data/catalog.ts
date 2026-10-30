import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { products as localProducts } from '@/data/products';
import type { Product, CategorySlug } from '@/types';

interface DbProduct {
  id: number;
  brand_slug: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number;
  category: string;
  tags: string[];
  image: string | null;
  sizes: string[];
  colors: string[];
  rating: number;
  review_count: number;
  stock: number;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_luxury: boolean;
}

function mapDbProduct(row: DbProduct, brandName: string): Product {
  return {
    id: row.id,
    name: row.name,
    brand: brandName,
    description: row.description ?? '',
    price: row.price,
    originalPrice: row.original_price,
    category: row.category as CategorySlug,
    tags: row.tags ?? [],
    image: row.image ?? '',
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    isBestseller: row.is_bestseller,
    isNewArrival: row.is_new_arrival,
    isLuxury: row.is_luxury,
    brandSlug: row.brand_slug,
  };
}

export function useCatalog() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ data: rows, error: qErr }, { data: brands, error: bErr }] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('brands').select('slug, name'),
        ]);
        if (qErr) throw qErr;
        if (bErr) throw bErr;
        if (cancelled) return;
        const brandMap = new Map((brands ?? []).map(b => [b.slug, b.name]));
        const mapped = (rows ?? []).map((r: DbProduct) =>
          mapDbProduct(r, brandMap.get(r.brand_slug) ?? r.brand_slug),
        );
        setDbProducts(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allProducts: Product[] = [...dbProducts, ...localProducts];
  return { products: allProducts, loading, error };
}

export function useProductsByCategory(slug: string) {
  const { products, loading, error } = useCatalog();
  const filtered = filterByCategory(products, slug);
  return { products: filtered, loading, error };
}

export function filterByCategory(products: Product[], slug: string): Product[] {
  if (slug === 'new-arrivals') return products.filter(p => p.isNewArrival);
  if (slug === 'bestsellers') return products.filter(p => p.isBestseller);
  if (slug === 'luxury') return products.filter(p => p.isLuxury);
  return products.filter(p => p.category === slug);
}

export function useProductsByBrand(brandSlug: string) {
  const { products, loading, error } = useCatalog();
  const filtered = products.filter(p => p.brandSlug === brandSlug);
  return { products: filtered, loading, error };
}

export function useProductById(id: number) {
  const { products, loading, error } = useCatalog();
  const product = products.find(p => p.id === id);
  return { product, loading, error };
}
