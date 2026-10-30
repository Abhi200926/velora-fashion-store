import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBrands } from '@/data/brands';
import type { Brand, BrandCategory } from '@/types';

const categoryLabels: Record<BrandCategory, string> = {
  fashion: 'Fashion',
  sportswear: 'Sportswear',
  technology: 'Technology',
  watches: 'Watches',
  luxury: 'Luxury',
};

const categoryOrder: BrandCategory[] = ['luxury', 'fashion', 'sportswear', 'technology', 'watches'];

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brand/${brand.slug}`}
      className="group flex flex-col items-center justify-center gap-4 p-6 lg:p-8 bg-ink-900 border border-ink-700/50 rounded-xl transition-all duration-300 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 hover:-translate-y-1"
    >
      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-ink-800 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-500/40 transition-colors">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain rounded-full" />
        ) : (
          <span className="text-xl lg:text-2xl font-serif font-semibold gold-gradient-text">
            {brand.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-base lg:text-lg font-serif text-cream-50 group-hover:text-gold-300 transition-colors">
          {brand.name}
        </h3>
        {brand.country && (
          <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">{brand.country}</p>
        )}
      </div>
    </Link>
  );
}

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<BrandCategory | 'all'>('all');

  useEffect(() => {
    let cancelled = false;
    fetchBrands()
      .then(data => {
        if (!cancelled) setBrands(data);
      })
      .catch(() => {
        if (!cancelled) setBrands([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBrands =
    activeCategory === 'all'
      ? brands
      : brands.filter(b => b.category === activeCategory);

  const availableCategories = Array.from(
    new Set(brands.map(b => b.category)),
  ).sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-cream-50 mb-3">
          Global Brands
        </h1>
        <p className="text-sm text-ink-400 max-w-2xl mx-auto leading-relaxed">
          Shop world-class brands across fashion, sportswear, technology, and luxury timepieces —
          all in one place.
        </p>
      </div>

      {!loading && availableCategories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'bg-gold-500 text-white border-gold-500'
                : 'bg-ink-800 text-ink-100 border-ink-700 hover:border-gold-500/40'
            }`}
          >
            All Brands
          </button>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-gold-500 text-white border-gold-500'
                  : 'bg-ink-800 text-ink-100 border-ink-700 hover:border-gold-500/40'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-ink-400">Loading brands...</p>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-ink-400">No brands found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {filteredBrands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}
