import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import type { SortOption } from '@/types';
import { getProductsByCategory, categories } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

export function CategoryPage() {
  const { slug = '' } = useParams();
  const [sort, setSort] = useState<SortOption>('popularity');
  const [sortOpen, setSortOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 15000 });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const category = categories.find(c => c.slug === slug);
  const allProducts = useMemo(() => getProductsByCategory(slug), [slug]);

  useEffect(() => {
    setSort('popularity');
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 15000 });
  }, [slug]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    allProducts.forEach(p => p.colors.forEach(c => colors.add(c)));
    return Array.from(colors).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(
      p => p.price >= priceRange.min && p.price <= priceRange.max,
    );
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    switch (sort) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [allProducts, sort, priceRange, selectedColors]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color],
    );
  };

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif text-cream-50 mb-4">Category not found</h2>
        <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Category header */}
      <div className="relative h-[200px] lg:h-[280px] overflow-hidden">
        <img src={category.image} alt={category.name} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold-400 text-xs uppercase tracking-[0.3em] mb-2">Collection</p>
            <h1 className="text-4xl lg:text-5xl font-serif text-cream-50">{category.name}</h1>
            <p className="text-sm text-cream-200/60 mt-2">{filteredProducts.length} products</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink-800 border border-ink-700 rounded-lg text-sm text-cream-100 hover:border-gold-500/40 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < 15000) && (
              <span className="w-2 h-2 bg-gold-400 rounded-full" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink-800 border border-ink-700 rounded-lg text-sm text-cream-100 hover:border-gold-500/40 transition-colors"
            >
              Sort: <span className="text-gold-400">{sortOptions.find(o => o.value === sort)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-20 bg-ink-800 border border-ink-700 rounded-lg shadow-xl py-1 min-w-[200px]">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        sort === option.value
                          ? 'text-gold-400 bg-ink-700/50'
                          : 'text-cream-100 hover:bg-ink-700/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-64 shrink-0 hidden lg:block">
              <FilterPanel
                availableColors={availableColors}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onClear={() => {
                  setSelectedColors([]);
                  setPriceRange({ min: 0, max: 15000 });
                }}
              />
            </aside>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-cream-100 mb-2">No products found</p>
                <p className="text-sm text-neutral-400 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedColors([]);
                    setPriceRange({ min: 0, max: 15000 });
                  }}
                  className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-ink-900 border-l border-gold-500/20 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700">
              <h3 className="text-lg font-serif text-cream-50">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel
                availableColors={availableColors}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onClear={() => {
                  setSelectedColors([]);
                  setPriceRange({ min: 0, max: 15000 });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterPanelProps {
  availableColors: string[];
  selectedColors: string[];
  toggleColor: (color: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  onClear: () => void;
}

function FilterPanel({
  availableColors,
  selectedColors,
  toggleColor,
  priceRange,
  setPriceRange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-wider">Price Range</h4>
          {(selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < 15000) && (
            <button onClick={onClear} className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-cream-200">
            <span>₹{priceRange.min.toLocaleString('en-IN')}</span>
            <span className="text-neutral-600">—</span>
            <span>₹{priceRange.max.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={priceRange.max}
            onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            className="w-full accent-gold-500"
          />
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={priceRange.min}
            onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            className="w-full accent-gold-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-wider mb-3">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedColors.includes(color)
                  ? 'bg-gold-500 text-ink-950 border-gold-500'
                  : 'bg-ink-800 text-cream-200 border-ink-700 hover:border-gold-500/40'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
