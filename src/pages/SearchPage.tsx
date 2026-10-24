import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-5 h-5 text-gold-400" />
          <h1 className="text-2xl lg:text-3xl font-serif text-cream-50">
            Search Results
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          {results.length > 0
            ? `${results.length} product${results.length > 1 ? 's' : ''} found for "${query}"`
            : `No results for "${query}"`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-ink-800 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-neutral-600" />
          </div>
          <h2 className="text-xl font-serif text-cream-100 mb-2">No products found</h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-md">
            We couldn't find anything matching your search. Try a different keyword or browse our collections.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['men', 'women', 'luxury', 'new-arrivals', 'bestsellers'].map(cat => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="px-5 py-2.5 bg-ink-800 border border-ink-700 rounded-full text-sm text-cream-100 hover:border-gold-500/40 hover:text-gold-300 transition-colors capitalize"
              >
                {cat.replace('-', ' ')}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
