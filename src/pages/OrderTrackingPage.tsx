import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, MapPin, Clock, CheckCircle2, Truck, Box, ArrowRight, AlertTriangle } from 'lucide-react';
import { formatINR, getProductById } from '@/data/products';
import { useToast } from '@/context/ToastContext';

interface OrderTracker {
  orderId: string;
  status: 'placed' | 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  date: string;
  items: { productId: number; quantity: number; size: string; color: string }[];
  total: number;
  estimatedDelivery: string;
  trackingId: string;
}

const initialOrders: OrderTracker[] = [
  {
    orderId: 'VEL-2026-0451',
    status: 'shipped',
    date: '20 Oct 2026',
    items: [
      { productId: 1, quantity: 1, size: 'M', color: 'Black' },
      { productId: 4, quantity: 1, size: '8', color: 'White' },
    ],
    total: 5498,
    estimatedDelivery: '25 Oct 2026',
    trackingId: 'TRK-7845120',
  },
  {
    orderId: 'VEL-2026-0438',
    status: 'delivered',
    date: '15 Oct 2026',
    items: [
      { productId: 5, quantity: 1, size: 'One Size', color: 'Black' },
    ],
    total: 4499,
    estimatedDelivery: '19 Oct 2026',
    trackingId: 'TRK-7841085',
  },
  {
    orderId: 'VEL-2026-0467',
    status: 'confirmed',
    date: '23 Oct 2026',
    items: [
      { productId: 2, quantity: 1, size: '42', color: 'Charcoal' },
      { productId: 12, quantity: 1, size: 'One Size', color: 'Gold' },
    ],
    total: 11998,
    estimatedDelivery: '28 Oct 2026',
    trackingId: 'TRK-7845231',
  },
];

const statusSteps: { key: OrderTracker['status']; label: string; icon: typeof Package }[] = [
  { key: 'placed', label: 'Order Placed', icon: Box },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Package },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder = ['placed', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'];

export function OrderTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<OrderTracker | null>(null);
  const [orders, setOrders] = useState<OrderTracker[]>(initialOrders);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { showToast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;
    const order = orders.find(o => o.orderId === query || o.trackingId === query);
    if (order) {
      setFoundOrder(order);
      showToast(`Order ${order.orderId} found!`, 'success');
    } else {
      setFoundOrder(null);
      showToast('Order not found. Try VEL-2026-0451, VEL-2026-0438, or VEL-2026-0467.', 'error');
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-ink-800 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-3xl font-serif text-cream-50 mb-2">Track Your Order</h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Enter your order ID or tracking number to see the latest status of your shipment.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="e.g. VEL-2026-0451"
            className="w-full bg-ink-800 border border-ink-700 rounded-lg pl-11 pr-4 py-3.5 text-sm text-cream-100 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors whitespace-nowrap"
        >
          Track
        </button>
      </form>

      {/* Recent orders */}
      <div className="mb-8">
        <h2 className="text-lg font-serif text-cream-100 mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {orders.map(order => (
            <button
              key={order.orderId}
              onClick={() => {
                setFoundOrder(order);
                setSearchQuery(order.orderId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-between bg-ink-900 border border-ink-700/50 rounded-lg p-4 hover:border-gold-500/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-cream-100">{order.orderId}</p>
                  <p className="text-xs text-neutral-400">
                    {order.date} · {formatINR(order.total)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                  order.status === 'delivered'
                    ? 'bg-green-900/30 text-green-400 border border-green-500/20'
                    : order.status === 'cancelled'
                      ? 'bg-red-900/30 text-red-400 border border-red-500/20'
                      : order.status === 'shipped' || order.status === 'out-for-delivery'
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20'
                        : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                }`}>
                  {order.status.replace(/-/g, ' ')}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order details */}
      {foundOrder && (
        <OrderDetails
          order={foundOrder}
          onCancel={() => setShowCancelConfirm(true)}
          canCancel={foundOrder.status === 'placed' || foundOrder.status === 'confirmed'}
        />
      )}

      {/* Cancel confirmation modal */}
      {showCancelConfirm && foundOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="bg-ink-900 border border-red-500/30 rounded-xl p-6 max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-cream-50">Cancel Order?</h3>
                <p className="text-xs text-neutral-400">Order {foundOrder.orderId}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 mb-6">
              Are you sure you want to cancel this order? A full refund of {formatINR(foundOrder.total)} will be initiated to your original payment method within 5-7 business days.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 bg-ink-800 border border-ink-700 text-cream-100 text-sm font-medium rounded-lg hover:border-ink-600 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  const updated = orders.map(o =>
                    o.orderId === foundOrder.orderId ? { ...o, status: 'cancelled' as const } : o,
                  );
                  setOrders(updated);
                  setFoundOrder({ ...foundOrder, status: 'cancelled' });
                  setShowCancelConfirm(false);
                  showToast(`Order ${foundOrder.orderId} has been cancelled. Refund of ${formatINR(foundOrder.total)} will be processed in 5-7 days.`, 'success');
                }}
                className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {!foundOrder && (
        <div className="text-center py-12 bg-ink-900 border border-ink-700/50 rounded-xl">
          <MapPin className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <p className="text-sm text-neutral-400">
            Search for an order above or select one from your recent orders.
          </p>
        </div>
      )}
    </div>
  );
}

function OrderDetails({
  order,
  onCancel,
  canCancel,
}: {
  order: OrderTracker;
  onCancel?: () => void;
  canCancel?: boolean;
}) {
  const currentStepIndex = statusOrder.indexOf(order.status);

  return (
    <div className="bg-ink-900 border border-gold-500/20 rounded-xl p-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-ink-700">
        <div>
          <h3 className="text-lg font-serif text-cream-50">Order {order.orderId}</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Placed on {order.date} · Tracking: {order.trackingId}
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <div className="text-left sm:text-right">
            <p className="text-2xl font-semibold text-cream-50">{formatINR(order.total)}</p>
            <p className="text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Est. delivery: {order.estimatedDelivery}
            </p>
          </div>
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-ink-700" />
          <div
            className="absolute top-5 left-5 h-0.5 bg-gold-500 transition-all duration-500"
            style={{ width: `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 1.25rem)` }}
          />
          {statusSteps.map((step, i) => {
            const isComplete = i <= currentStepIndex;
            const StepIcon = step.icon;
            return (
              <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isComplete
                      ? 'bg-gold-500 border-gold-500 text-ink-950'
                      : 'bg-ink-800 border-ink-700 text-neutral-500'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs text-center whitespace-nowrap ${
                    isComplete ? 'text-gold-400 font-medium' : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-wider mb-3">Items in Order</h4>
        <div className="space-y-3">
          {order.items.map((item, i) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <Link
                to={`/product/${product.id}`}
                key={i}
                className="flex items-center gap-4 bg-ink-800/50 border border-ink-700/50 rounded-lg p-3 hover:border-gold-500/30 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gold-400 uppercase tracking-wide">{product.brand}</p>
                  <p className="text-sm text-cream-100 font-medium truncate">{product.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-cream-50 shrink-0">
                  {formatINR(product.price * item.quantity)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
