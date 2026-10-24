import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
          ? 'bg-ink-950/95 backdrop-blur-lg shadow-lg shadow-ink-950/50'
          : 'bg-ink-950'
      } border-b border-gold-500/15`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl lg:text-3xl font-serif font-semibold tracking-wider gold-gradient-text">
              VELORA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.slug}
                to={`/category/${link.slug}`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-gold-400'
                      : 'text-cream-100 hover:text-gold-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenSearch}
              className="w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop search bar */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search for products, brands..."
                  className="w-56 bg-ink-800 border border-ink-700 rounded-full pl-4 pr-4 py-2 text-sm text-cream-100 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
            </form>

            <Link
              to="/account"
              className="w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              to="/wishlist"
              className="relative w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-gold-500 text-ink-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-gold-500 text-ink-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] lg:hidden">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-ink-900 border-r border-gold-500/20 shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <span className="text-2xl font-serif gold-gradient-text">VELORA</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navLinks.map(link => (
            <Link
              key={link.slug}
              to={`/category/${link.slug}`}
              onClick={onClose}
              className="block px-6 py-3 text-cream-100 text-sm font-medium hover:bg-ink-800 hover:text-gold-400 transition-colors border-b border-ink-800/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
