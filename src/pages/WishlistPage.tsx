import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getProductById, formatINR } from '@/data/products';
import { Rating } from '@/components/Rating';

export function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-ink-800 flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-neutral-600" />
        </div>
        <h1 className="text-3xl font-serif text-cream-50 mb-3">Your Wishlist is Empty</h1>
        <p className="text-sm text-neutral-400 mb-6 max-w-md">
          Save your favorite pieces here by tapping the heart icon on any product.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-cream-50 mb-2">My Wishlist</h1>
      <p className="text-sm text-neutral-400 mb-8">{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {wishlist.map(id => {
          const product = getProductById(id);
          if (!product) return null;
          return (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-xl bg-ink-900 border border-ink-700/50"
            >
              <Link to={`/product/${id}`} className="relative aspect-[3/4] overflow-hidden bg-ink-800 block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </Link>
              <div className="flex flex-col gap-2 p-4 flex-1">
                <p className="text-xs text-gold-400 uppercase tracking-wide">{product.brand}</p>
                <Link to={`/product/${id}`}>
                  <h3 className="text-sm text-cream-100 font-medium line-clamp-2 hover:text-gold-300 transition-colors min-h-[2.5rem]">
                    {product.name}
                  </h3>
                </Link>
                <Rating rating={product.rating} />
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-cream-50">{formatINR(product.price)}</span>
                  <span className="text-xs text-neutral-500 line-through">{formatINR(product.originalPrice)}</span>
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => {
                      addToCart(product.id, 1, product.sizes[0], product.colors[0]);
                      showToast(`${product.name} added to bag`, 'success');
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-gold-500 text-ink-950 text-xs font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </button>
                  <button
                    onClick={() => {
                      removeFromWishlist(id);
                      showToast('Removed from wishlist', 'info');
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-ink-800 border border-ink-700 rounded-lg text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
