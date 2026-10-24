import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductById, formatINR, coupons } from '@/data/products';
import { useToast } from '@/context/ToastContext';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    total,
    deliveryFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    showToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-ink-800 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-neutral-600" />
        </div>
        <h1 className="text-3xl font-serif text-cream-50 mb-3">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-neutral-400 mb-6 max-w-md">
          Looks like you haven't added anything yet. Explore our collections and find your perfect style.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-cream-50 mb-2">Shopping Bag</h1>
      <p className="text-sm text-neutral-400 mb-8">{items.length} item{items.length > 1 ? 's' : ''} in your bag</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 bg-ink-900 border border-ink-700/50 rounded-xl p-4"
              >
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gold-400 uppercase tracking-wide">{product.brand}</p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-base font-medium text-cream-100 hover:text-gold-300 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-neutral-400">
                        <span>Size: <span className="text-cream-200">{item.size}</span></span>
                        <span>Color: <span className="text-cream-200">{item.color}</span></span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-semibold text-cream-50">{formatINR(product.price)}</span>
                        <span className="text-sm text-neutral-500 line-through">{formatINR(product.originalPrice)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.size, item.color);
                        showToast('Item removed from bag', 'info');
                      }}
                      className="text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="inline-flex items-center gap-1 bg-ink-800 rounded-full border border-ink-700">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm text-cream-100 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-base font-semibold text-cream-50">
                      {formatINR(product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-4">
            <Link to="/" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
              ← Continue Shopping
            </Link>
            <button
              onClick={() => {
                clearCart();
                showToast('Bag cleared', 'info');
              }}
              className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-ink-900 border border-ink-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-serif text-cream-50">Order Summary</h2>

            {/* Coupon */}
            <div className="border border-ink-700 rounded-lg p-4 space-y-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-sm text-gold-400 font-medium">{appliedCoupon.code}</p>
                      <p className="text-xs text-neutral-400">{appliedCoupon.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeCoupon();
                      showToast('Coupon removed', 'info');
                    }}
                    className="text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-sm text-cream-100 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-ink-700 text-cream-100 text-sm font-medium rounded-lg hover:bg-ink-600 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  <div className="space-y-1.5">
                    {coupons.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          const result = applyCoupon(c.code);
                          showToast(result.message, result.success ? 'success' : 'error');
                        }}
                        className="block w-full text-left text-xs text-neutral-400 hover:text-gold-300 transition-colors"
                      >
                        <span className="text-gold-400 font-medium">{c.code}</span> — {c.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>−{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-300">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-400">FREE</span> : formatINR(deliveryFee)}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-neutral-500">
                  Add {formatINR(999 - (subtotal - discount))} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-ink-700 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-medium text-cream-100">Total</span>
                <span className="text-2xl font-semibold text-cream-50">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Proceed to Checkout
            </button>

            {deliveryFee === 0 && (
              <div className="flex items-center justify-center gap-2 text-xs text-green-400">
                <Truck className="w-4 h-4" />
                You qualify for FREE delivery!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
