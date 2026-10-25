import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency, type CurrencyCode } from '@/context/CurrencyContext';

const navLinks = [
  { label: 'Men', slug: 'men' },
  { label: 'Women', slug: 'women' },
  { label: 'Kids', slug: 'kids' },
  { label: 'Footwear', slug: 'footwear' },
  { label: 'Bags', slug: 'bags' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Luxury', slug: 'luxury' },
  { label: 'New Arrivals', slug: 'new-arrivals' },
  { label: 'Bestsellers', slug: 'bestsellers' },
];

interface HeaderProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenCart, onOpenSearch, onOpenMobileMenu }: HeaderProps) {
  const { totalItems } = useCart();
  const { count } = useWishlist();
  const { currency, setCurrency, currencies } = useCurrency();
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const navigate = useNavigate();
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = (formData.get('q') as string)?.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-950/95 backdrop-blur-lg shadow-sm shadow-black/5'
          : 'bg-ink-950'
      } border-b border-gold-500/15`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-ink-100 hover:text-gold-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group" aria-label="VELORA home">
            <span className="text-2xl lg:text-3xl font-serif font-semibold tracking-wider gold-gradient-text">
              VELORA
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.slug}
                to={`/category/${link.slug}`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-gold-600'
                      : 'text-ink-100 hover:text-gold-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/style-finder"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'text-gold-600'
                    : 'text-ink-100 hover:text-gold-600'
                }`
              }
            >
              <Sparkles className="w-4 h-4" />
              Style Finder
            </NavLink>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Currency selector */}
            <div className="relative hidden sm:block" ref={currencyRef}>
              <button
                onClick={() => setCurrencyOpen(prev => !prev)}
                className="flex items-center gap-1 px-2 py-2 text-xs font-medium text-ink-100 hover:text-gold-600 transition-colors"
                aria-label={`Currency: ${currency}. Click to change currency.`}
                aria-expanded={currencyOpen}
              >
                {currency}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-ink-900 border border-ink-700 rounded-lg shadow-xl py-1 animate-fade-in z-50">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                        currency === c.code
                          ? 'text-gold-600 bg-gold-50/50'
                          : 'text-ink-100 hover:bg-ink-800'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-ink-400">{c.symbol.trim()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenSearch}
              className="w-10 h-10 flex items-center justify-center text-ink-100 hover:text-gold-600 transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search for products, brands..."
                  className="w-56 bg-ink-800 border border-ink-700 rounded-full pl-4 pr-4 py-2 text-sm text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
            </form>

            <Link
              to="/account"
              className="w-10 h-10 flex items-center justify-center text-ink-100 hover:text-gold-600 transition-colors"
              aria-label="My account"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              to="/wishlist"
              className="relative w-10 h-10 flex items-center justify-center text-ink-100 hover:text-gold-600 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-gold-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 flex items-center justify-center text-ink-100 hover:text-gold-600 transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-gold-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currency, setCurrency, currencies } = useCurrency();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-ink-900 border-r border-gold-500/20 shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <span className="text-2xl font-serif gold-gradient-text">VELORA</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-ink-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <Link
              key={link.slug}
              to={`/category/${link.slug}`}
              onClick={onClose}
              className="block px-6 py-3 text-ink-100 text-sm font-medium hover:bg-ink-800 hover:text-gold-600 transition-colors border-b border-ink-800/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/style-finder"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 text-ink-100 text-sm font-medium hover:bg-ink-800 hover:text-gold-600 transition-colors border-b border-ink-800/50"
          >
            <Sparkles className="w-4 h-4" />
            Style Finder
          </Link>
          <div className="px-6 py-4 border-b border-ink-800/50">
            <p className="text-xs text-ink-400 uppercase tracking-wider mb-2">Currency</p>
            <div className="flex flex-wrap gap-2">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code as CurrencyCode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    currency === c.code
                      ? 'bg-gold-500 text-white'
                      : 'bg-ink-800 text-ink-100 hover:bg-ink-700'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
