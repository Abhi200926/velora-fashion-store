import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Drawer } from './Drawer';
import { useCart } from '@/context/CartContext';
import { getProductById, formatINR } from '@/data/products';
import { useToast } from '@/context/ToastContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { showToast } = useToast();

  return (
    <Drawer open={open} onClose={onClose} title={`Shopping Bag (${totalItems})`}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-ink-800 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-neutral-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-cream-100 mb-1">Your bag is empty</h3>
            <p className="text-sm text-neutral-400">Discover our latest collections and find something you love.</p>
          </div>
          <Link
            to="/"
            onClick={onClose}
            className="mt-2 px-6 py-3 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-4 space-y-4">
            {items.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-3 bg-ink-800/50 rounded-lg p-3 border border-ink-700/50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-28 object-cover rounded-md shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-gold-400 uppercase tracking-wide">{product.brand}</p>
                        <h4 className="text-sm text-cream-100 font-medium truncate">{product.name}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Size: {item.size} · Color: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.productId, item.size, item.color);
                          showToast('Item removed from bag', 'info');
                        }}
                        className="text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-2 bg-ink-900 rounded-full border border-ink-700">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm text-cream-100 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-cream-100 hover:text-gold-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-cream-50">
                        {formatINR(product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-ink-700 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Subtotal</span>
              <span className="text-lg font-semibold text-cream-50">{formatINR(subtotal)}</span>
            </div>
            <p className="text-xs text-neutral-500">Shipping and discounts calculated at checkout.</p>
            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full text-center py-3 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              View Bag & Checkout
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center py-2 text-sm text-neutral-400 hover:text-cream-100 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
