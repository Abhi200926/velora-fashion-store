import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { fetchBrandBySlug } from '@/data/brands';
import { useProductsByBrand } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import type { Brand } from '@/types';

export function BrandPage() {
  const { slug = '' } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandLoading, setBrandLoading] = useState(true);
  const { products, loading } = useProductsByBrand(slug);

  useEffect(() => {
    let cancelled = false;
    setBrandLoading(true);
    fetchBrandBySlug(slug)
      .then(b => {
        if (!cancelled) setBrand(b);
      })
      .catch(() => {
        if (!cancelled) setBrand(null);
      })
      .finally(() => {
        if (!cancelled) setBrandLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (brandLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-400">Loading brand...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif text-cream-50 mb-4">Brand not found</h2>
        <Link to="/brands" className="text-gold-400 hover:text-gold-300 transition-colors">
          Browse all brands
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-gold-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Brands
        </Link>
      </div>

      <div className="relative h-[240px] lg:h-[340px] overflow-hidden bg-ink-900 border-y border-gold-500/15">
        {brand.cover_url ? (
          <img
            src={brand.cover_url}
            alt={brand.name}
            className="h-full w-full object-cover object-center opacity-40"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={`${brand.name} logo`}
                className="h-16 w-16 object-contain mx-auto mb-4 rounded-lg"
              />
            ) : null}
            <h1 className="text-4xl lg:text-6xl font-serif text-cream-50 tracking-wide">
              {brand.name}
            </h1>
            {brand.country && (
              <p className="flex items-center justify-center gap-1.5 text-sm text-gold-400 mt-3 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                {brand.country}
              </p>
            )}
            <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full border border-gold-500/30 text-gold-400 uppercase tracking-wider">
              {brand.category}
            </span>
          </div>
        </div>
      </div>

      {brand.description && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-sm lg:text-base text-ink-300 leading-relaxed">{brand.description}</p>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-cream-50">Products</h2>
          <span className="text-sm text-ink-400">
            {loading ? 'Loading...' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-ink-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-ink-400 mb-4">
              No products available from this brand yet. Check back soon.
            </p>
            <Link
              to="/brands"
              className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
            >
              Browse other brands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
