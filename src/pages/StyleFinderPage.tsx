import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { products } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';
import { ProductCard } from '@/components/ProductCard';
import type { CategorySlug } from '@/types';

type Occasion = 'casual' | 'work' | 'party' | 'wedding' | 'travel' | 'festive';
type Style = 'classic' | 'streetwear' | 'minimal' | 'bohemian' | 'luxury' | 'sporty';
type Budget = 'all' | 'under2000' | '2000to5000' | '5000plus';

const occasions: { key: Occasion; label: string; emoji: string }[] = [
  { key: 'casual', label: 'Casual Day Out', emoji: '☕' },
  { key: 'work', label: 'Work / Office', emoji: '💼' },
  { key: 'party', label: 'Party Night', emoji: '🎉' },
  { key: 'wedding', label: 'Wedding', emoji: '💒' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'festive', label: 'Festive', emoji: '🪔' },
];

const styles: { key: Style; label: string; desc: string }[] = [
  { key: 'classic', label: 'Classic', desc: 'Timeless & tailored' },
  { key: 'streetwear', label: 'Streetwear', desc: 'Bold & urban' },
  { key: 'minimal', label: 'Minimal', desc: 'Clean & simple' },
  { key: 'bohemian', label: 'Bohemian', desc: 'Free-spirited' },
  { key: 'luxury', label: 'Luxury', desc: 'Premium & refined' },
  { key: 'sporty', label: 'Sporty', desc: 'Active & casual' },
];

const budgets: { key: Budget; label: string }[] = [
  { key: 'all', label: 'Any Budget' },
  { key: 'under2000', label: 'Under ₹2,000' },
  { key: '2000to5000', label: '₹2,000 – ₹5,000' },
  { key: '5000plus', label: 'Above ₹5,000' },
];

function matchOccasion(product: typeof products[0], occasion: Occasion): boolean {
  const tags = product.tags.join(' ').toLowerCase();
  const cat = product.category;
  switch (occasion) {
    case 'casual':
      return ['casual', 'everyday', 'tshirt', 'shorts', 'sneakers', 'weekend'].some(t => tags.includes(t)) ||
        ['men', 'women', 'footwear', 'kids'].includes(cat);
    case 'work':
      return ['formal', 'blazer', 'suit', 'shirt', 'office', 'oxford', 'loafers', 'turtleneck'].some(t => tags.includes(t)) ||
        ['men', 'women'].includes(cat);
    case 'party':
      return ['cocktail', 'evening', 'party', 'dress', 'gown', 'heels', 'stiletto', 'rhinestone'].some(t => tags.includes(t));
    case 'wedding':
      return ['gown', 'evening', 'luxury', 'suit', 'wedding', 'satin', 'velvet', 'festive', 'formal'].some(t => tags.includes(t)) ||
      product.isLuxury === true;
    case 'travel':
      return ['casual', 'backpack', 'sneakers', 'jeans', 'coat', 'travel', 'denim'].some(t => tags.includes(t));
    case 'festive':
      return ['festive', 'ethnic', 'kurta', 'traditional', 'saree', 'gold', 'red', 'wedding'].some(t => tags.includes(t));
    default:
      return true;
  }
}

function matchStyle(product: typeof products[0], style: Style): boolean {
  const tags = product.tags.join(' ').toLowerCase();
  const name = product.name.toLowerCase();
  switch (style) {
    case 'classic':
      return ['formal', 'classic', 'tailored', 'suit', 'oxford', 'white', 'blazer', 'coat', 'trench'].some(t => tags.includes(t) || name.includes(t));
    case 'streetwear':
      return ['street', 'urban', 'denim', 'jeans', 'ripped', 'leather', 'sneakers', 'edgy', 'biker'].some(t => tags.includes(t) || name.includes(t));
    case 'minimal':
      return ['minimal', 'white', 'black', 'clean', 'simple', 'minimalist'].some(t => tags.includes(t) || name.includes(t));
    case 'bohemian':
      return ['floral', 'vintage', 'artistic', 'boho', 'pink', 'tea', 'fan'].some(t => tags.includes(t) || name.includes(t));
    case 'luxury':
      return product.isLuxury === true || ['luxury', 'couture', 'premium', 'gown', 'satin', 'velvet', 'gold', 'pearl', 'rhinestone'].some(t => tags.includes(t));
    case 'sporty':
      return ['sneakers', 'sport', 'casual', 'tshirt', 'shorts', 'backpack', 'summer', 'retro'].some(t => tags.includes(t) || name.includes(t));
    default:
      return true;
  }
}

function matchBudget(product: typeof products[0], budget: Budget): boolean {
  switch (budget) {
    case 'under2000':
      return product.price < 2000;
    case '2000to5000':
      return product.price >= 2000 && product.price <= 5000;
    case '5000plus':
      return product.price > 5000;
    default:
      return true;
  }
}

export function StyleFinderPage() {
  const { formatPrice } = useCurrency();
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [budget, setBudget] = useState<Budget>('all');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!occasion || !style) return [];
    return products
      .filter(p => matchOccasion(p, occasion))
      .filter(p => matchStyle(p, style))
      .filter(p => matchBudget(p, budget))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [occasion, style, budget]);

  const canSubmit = occasion && style;
  const step = !occasion ? 1 : !style ? 2 : 3;

  const handleReset = () => {
    setOccasion(null);
    setStyle(null);
    setBudget('all');
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-gold-100 border border-gold-300/50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gold-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink-100 mb-3">Smart Style Finder</h1>
        <p className="text-sm text-ink-400 max-w-md mx-auto leading-relaxed">
          Tell us your occasion, preferred style, and budget — we'll curate the perfect pieces from our collection.
        </p>
      </div>

      {!submitted && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Step 1: Occasion */}
          <div className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-gold-500 text-white' : 'bg-ink-800 text-ink-400'}`}>1</span>
              <h2 className="text-lg font-serif text-ink-100">What's the occasion?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {occasions.map(o => (
                <button
                  key={o.key}
                  onClick={() => setOccasion(o.key)}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all text-left ${
                    occasion === o.key
                      ? 'border-gold-500 bg-gold-50/50'
                      : 'border-ink-700 hover:border-ink-600 bg-ink-800/30'
                  }`}
                >
                  <span className="text-xl">{o.emoji}</span>
                  <span className={`text-sm font-medium ${occasion === o.key ? 'text-gold-700' : 'text-ink-100'}`}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Style */}
          <div className={`bg-ink-900 border border-ink-700/50 rounded-xl p-6 lg:p-8 transition-opacity ${step < 2 ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-gold-500 text-white' : 'bg-ink-800 text-ink-400'}`}>2</span>
              <h2 className="text-lg font-serif text-ink-100">Pick your style</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {styles.map(s => (
                <button
                  key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`p-4 border rounded-lg transition-all text-left ${
                    style === s.key
                      ? 'border-gold-500 bg-gold-50/50'
                      : 'border-ink-700 hover:border-ink-600 bg-ink-800/30'
                  }`}
                >
                  <p className={`text-sm font-medium ${style === s.key ? 'text-gold-700' : 'text-ink-100'}`}>{s.label}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget */}
          <div className={`bg-ink-900 border border-ink-700/50 rounded-xl p-6 lg:p-8 transition-opacity ${step < 3 ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-gold-500 text-white' : 'bg-ink-800 text-ink-400'}`}>3</span>
              <h2 className="text-lg font-serif text-ink-100">What's your budget?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {budgets.map(b => (
                <button
                  key={b.key}
                  onClick={() => setBudget(b.key)}
                  className={`p-3 border rounded-lg transition-all text-center ${
                    budget === b.key
                      ? 'border-gold-500 bg-gold-50/50 text-gold-700'
                      : 'border-ink-700 hover:border-ink-600 bg-ink-800/30 text-ink-100'
                  }`}
                >
                  <span className="text-sm font-medium">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => canSubmit && setSubmitted(true)}
            disabled={!canSubmit}
            className="w-full py-4 bg-gold-500 text-white text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Find My Style
          </button>
        </div>
      )}

      {submitted && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-serif text-ink-100">Your Curated Picks</h2>
              <p className="text-sm text-ink-400 mt-1">
                {results.length} {results.length === 1 ? 'piece' : 'pieces'} matched for{' '}
                <span className="text-gold-600">{occasions.find(o => o.key === occasion)?.label}</span>,{' '}
                <span className="text-gold-600">{styles.find(s => s.key === style)?.label}</span> style
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink-900 border border-ink-700 text-ink-100 text-sm font-medium rounded-lg hover:border-gold-500/40 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-ink-900 border border-ink-700/50 rounded-xl max-w-md mx-auto">
              <p className="text-sm text-ink-400 mb-4">
                No pieces matched your exact combination. Try a different style or broaden your budget.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {!submitted && (
        <div className="text-center mt-12">
          <Link to="/" className="text-sm text-ink-400 hover:text-gold-600 transition-colors inline-flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
