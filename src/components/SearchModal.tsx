import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const trendingSearches = ['Leather Jacket', 'Sneakers', 'Black Dress', 'Handbag', 'Sunglasses', 'Suit'];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative mx-auto max-w-2xl mt-20 px-4 animate-scale-in">
        <div className="bg-ink-900 border border-gold-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 px-6 py-5 border-b border-ink-700">
            <Search className="w-6 h-6 text-gold-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="flex-1 bg-transparent text-cream-100 text-lg placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          <div className="px-6 py-5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Trending Searches</p>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map(term => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(term)}`);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm bg-ink-800 border border-ink-700 rounded-full text-cream-200 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
