import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { formatINR, getDiscountPercent } from '@/data/products';
import { Rating } from './Rating';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-ink-900 border border-ink-700/50 transition-all duration-300 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-800">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              outOfStock ? 'opacity-50 grayscale' : ''
            }`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-gold-500 text-ink-950 text-xs font-semibold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-white/90 backdrop-blur text-ink-100 text-xs font-medium px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isLuxury && (
            <span className="bg-black/80 backdrop-blur text-gold-300 text-xs font-medium px-2 py-1 rounded border border-gold-400/40">
              LUXE
            </span>
          )}
          {outOfStock && (
            <span className="bg-red-600/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => {
            toggleWishlist(product.id);
            showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', 'success');
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur transition-all duration-300 ${
            wished
              ? 'bg-gold-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.id, 1, product.sizes[0], product.colors[0]);
              showToast(`${product.name} added to bag`, 'success');
            }}
            className="flex-1 bg-black/85 backdrop-blur text-white text-sm font-medium py-3 hover:bg-gold-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-gold-500/90 backdrop-blur text-white text-sm font-medium py-3 px-4 hover:bg-gold-400 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-xs text-gold-400 font-medium tracking-wide uppercase">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm text-cream-100 font-medium leading-snug hover:text-gold-300 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-semibold text-cream-50">{formatINR(product.price)}</span>
          <span className="text-sm text-neutral-500 line-through">{formatINR(product.originalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
