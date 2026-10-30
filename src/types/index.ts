export type CategorySlug =
  | 'men'
  | 'women'
  | 'kids'
  | 'footwear'
  | 'bags'
  | 'accessories'
  | 'luxury'
  | 'new-arrivals'
  | 'bestsellers';

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  category: CategorySlug;
  tags: string[];
  image: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isLuxury?: boolean;
  brandSlug?: string;
}

export type BrandCategory = 'fashion' | 'sportswear' | 'technology' | 'watches' | 'luxury';

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  country: string | null;
  category: BrandCategory;
}

export interface CartItem {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrder: number;
  label: string;
}

export type SortOption = 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
