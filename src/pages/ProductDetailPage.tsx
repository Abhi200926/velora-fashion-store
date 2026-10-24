import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Minus, Plus, Truck, RefreshCw, Shield, ChevronRight, Clock } from 'lucide-react';
import { getProductById, products, formatINR, getDiscountPercent } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { Rating } from '@/components/Rating';
import { ProductCard } from '@/components/ProductCard';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { ReviewsSection } from '@/components/ReviewsSection';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const product = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { addProduct, getRecent } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setActiveTab('description');
      addProduct(product.id);
    }
    window.scrollTo(0, 0);
  }, [productId, product, addProduct]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif text-cream-50 mb-4">Product not found</h2>
        <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const outOfStock = product.stock === 0;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const recentlyViewedIds = getRecent(product.id, 4);
  const recentlyViewedProducts = recentlyViewedIds
    .map(pid => getProductById(pid))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product.id, quantity, selectedSize, selectedColor);
    showToast(`${product.name} (${selectedSize}, ${selectedColor}) added to bag`, 'success');
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product.id, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen">
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${product.category}`} className="hover:text-gold-400 transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cream-100 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-ink-800 border border-ink-700/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`h-full w-full object-cover ${outOfStock ? 'opacity-60 grayscale' : ''}`}
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-gold-500 text-ink-950 text-sm font-semibold px-3 py-1.5 rounded">
                    {discount}% OFF
                  </span>
                )}
                {product.isLuxury && (
                  <span className="absolute top-4 right-4 bg-ink-950/80 backdrop-blur text-gold-300 text-sm font-medium px-3 py-1.5 rounded border border-gold-500/40">
                    LUXE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm text-gold-400 font-medium uppercase tracking-wider">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-serif text-cream-50 mt-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-semibold text-cream-50">{formatINR(product.price)}</span>
              <span className="text-lg text-neutral-500 line-through">{formatINR(product.originalPrice)}</span>
              {discount > 0 && (
                <span className="text-sm text-gold-400 font-medium">{discount}% off</span>
              )}
            </div>
            <p className="text-xs text-neutral-500">Inclusive of all taxes</p>

            {/* Color selection */}
            <div>
              <h4 className="text-sm font-medium text-cream-100 mb-2">
                Color: <span className="text-gold-400">{selectedColor}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      selectedColor === color
                        ? 'bg-gold-500 text-ink-950 border-gold-500 font-medium'
                        : 'bg-ink-800 text-cream-100 border-ink-700 hover:border-gold-500/40'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-cream-100">
                  Size: <span className="text-gold-400">{selectedSize}</span>
                </h4>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-neutral-400 hover:text-gold-400 transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 py-2 text-sm rounded-lg border transition-colors ${
                      selectedSize === size
                        ? 'bg-gold-500 text-ink-950 border-gold-500 font-medium'
                        : 'bg-ink-800 text-cream-100 border-ink-700 hover:border-gold-500/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock status */}
            <div>
              {outOfStock ? (
                <p className="text-sm text-red-400">Out of stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-sm text-amber-400">Only {product.stock} left in stock — order soon!</p>
              ) : (
                <p className="text-sm text-green-400">In stock</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h4 className="text-sm font-medium text-cream-100 mb-2">Quantity</h4>
              <div className="inline-flex items-center gap-2 bg-ink-800 rounded-full border border-ink-700">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                  disabled={outOfStock}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base text-cream-100 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                  disabled={outOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-ink-800 border border-gold-500/30 text-cream-100 text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', 'success');
                }}
                className={`w-14 h-14 flex items-center justify-center rounded-lg border transition-all ${
                  wished
                    ? 'bg-gold-500 text-ink-950 border-gold-500'
                    : 'bg-ink-800 border-ink-700 text-cream-100 hover:border-gold-500/40'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${wished ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="w-full py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink-800">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Above ₹999' },
                { icon: RefreshCw, label: 'Easy Returns', sub: '7 days' },
                { icon: Shield, label: 'Authentic', sub: '100% genuine' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1">
                  <item.icon className="w-5 h-5 text-gold-400" />
                  <span className="text-xs text-cream-100 font-medium">{item.label}</span>
                  <span className="text-[10px] text-neutral-500">{item.sub}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-ink-800 pt-6">
              <div className="flex gap-6 border-b border-ink-800">
                {[
                  { key: 'description' as const, label: 'Description' },
                  { key: 'details' as const, label: 'Details' },
                  { key: 'shipping' as const, label: 'Shipping & Returns' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.key
                        ? 'text-gold-400'
                        : 'text-neutral-400 hover:text-cream-100'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-400" />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-4 text-sm text-neutral-300 leading-relaxed">
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'details' && (
                  <ul className="space-y-2">
                    <li>Brand: {product.brand}</li>
                    <li>Category: <span className="capitalize">{product.category.replace('-', ' ')}</span></li>
                    <li>Available sizes: {product.sizes.join(', ')}</li>
                    <li>Available colors: {product.colors.join(', ')}</li>
                    <li>Tags: {product.tags.join(', ')}</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>Free shipping on all orders above ₹999. Standard delivery within 3-5 business days.</p>
                    <p>Easy 7-day returns and exchanges. Items must be unused with original tags attached.</p>
                    <p>Cash on delivery available for orders below ₹5,000.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Reviews */}
            <ReviewsSection product={product} />
          </div>
        </div>

        {/* Recently viewed */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-8">
              <Clock className="w-5 h-5 text-gold-400" />
              <h2 className="text-2xl lg:text-3xl font-serif text-cream-50">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {recentlyViewedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl lg:text-3xl font-serif text-cream-50 mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
